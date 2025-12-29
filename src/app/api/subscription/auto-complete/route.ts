import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

/**
 * API untuk auto-complete payment di SANDBOX
 * Endpoint ini akan dipanggil otomatis dari client-side setelah payment
 * untuk trigger webhook dan activate subscription
 */
export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID required' },
        { status: 400 }
      );
    }

    // Check if sandbox mode
    const isSandbox = process.env.MIDTRANS_IS_PRODUCTION !== 'true';
    if (!isSandbox) {
      return NextResponse.json(
        { error: 'This endpoint only works in sandbox mode' },
        { status: 403 }
      );
    }

    // Get payment from database
    const payment = await prisma.payment.findUnique({
      where: { order_id: orderId },
      include: { user: true }
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // If already paid, return success
    if (payment.status === 'paid') {
      return NextResponse.json({
        success: true,
        alreadyPaid: true,
        subscription: {
          isPremium: payment.user.isPremium,
          status: payment.user.subscriptionStatus,
          endDate: payment.user.subscriptionEnd
        }
      });
    }

    // Generate webhook payload
    const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
    const grossAmount = String(payment.jumlah);
    const transactionStatus = 'settlement';
    const statusCode = '200';

    // Generate signature (try method 2 - transaction_status)
    const signatureString = `${orderId}${transactionStatus}${grossAmount}${serverKey}`;
    const signature = crypto.createHash('sha512').update(signatureString).digest('hex');

    // Create webhook payload
    const webhookPayload = {
      transaction_time: new Date().toISOString(),
      transaction_status: transactionStatus,
      transaction_id: `TRX-${Date.now()}`,
      status_message: 'midtrans payment notification',
      status_code: statusCode,
      signature_key: signature,
      payment_type: 'qris',
      order_id: orderId,
      merchant_id: 'G123456789',
      gross_amount: grossAmount,
      fraud_status: 'accept',
      currency: 'IDR'
    };

    // Call webhook internally
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const webhookUrl = `${baseUrl}/api/midtrans-webhook`;

    console.log('🔄 Auto-completing payment:', orderId);
    console.log('Calling webhook:', webhookUrl);

    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookPayload)
    });

    if (!webhookResponse.ok) {
      console.error('Webhook call failed:', webhookResponse.status);
      return NextResponse.json(
        { error: 'Failed to process webhook' },
        { status: 500 }
      );
    }

    const webhookResult = await webhookResponse.json();
    console.log('✅ Webhook processed:', webhookResult);

    // Get updated user data
    const updatedUser = await prisma.user.findUnique({
      where: { id: payment.user_id },
      select: {
        isPremium: true,
        subscriptionStatus: true,
        subscriptionEnd: true,
      }
    });

    return NextResponse.json({
      success: true,
      subscriptionActivated: webhookResult.subscriptionActivated,
      subscription: {
        isPremium: updatedUser?.isPremium,
        status: updatedUser?.subscriptionStatus,
        endDate: updatedUser?.subscriptionEnd
      }
    });

  } catch (error: any) {
    console.error('Auto-complete error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
