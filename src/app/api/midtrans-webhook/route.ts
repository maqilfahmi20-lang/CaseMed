import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const {
      order_id,
      transaction_status,
      fraud_status,
      signature_key,
      gross_amount,
    } = body;

    // Verify signature
    const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
    const hash = crypto
      .createHash('sha512')
      .update(`${order_id}${transaction_status}${gross_amount}${serverKey}`)
      .digest('hex');

    if (hash !== signature_key) {
      console.error('Invalid signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Find payment record
    const payment = await prisma.payment.findUnique({
      where: { order_id }
    });

    if (!payment) {
      console.error('Payment not found:', order_id);
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Update payment status based on transaction_status
    let newStatus = payment.status;

    if (transaction_status === 'capture' || transaction_status === 'settlement') {
      if (fraud_status === 'accept' || !fraud_status) {
        newStatus = 'paid';
      }
    } else if (transaction_status === 'pending') {
      newStatus = 'pending';
    } else if (
      transaction_status === 'deny' ||
      transaction_status === 'expire' ||
      transaction_status === 'cancel'
    ) {
      newStatus = 'failed';
    }

    // Update payment
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: newStatus,
        paid_at: newStatus === 'paid' ? new Date() : null,
      }
    });

    console.log(`Payment ${order_id} updated to ${newStatus}`);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
