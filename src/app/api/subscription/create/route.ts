import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SUBSCRIPTION_PRICE } from '@/lib/constants';

const midtransClient = require('midtrans-client');

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID diperlukan' },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, nama: true, email: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User tidak ditemukan' },
        { status: 404 }
      );
    }

    // Generate unique order ID
    const orderId = `SUB-${userId.slice(0, 8)}-${Date.now()}`;

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        user_id: userId,
        package_id: null, // Subscription payment
        order_id: orderId,
        jumlah: SUBSCRIPTION_PRICE,
        status: 'pending',
        paymentType: 'subscription',
      },
    });

    // Initialize Midtrans Snap
    const snap = new midtransClient.Snap({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
    });

    // Create transaction parameters
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: SUBSCRIPTION_PRICE,
      },
      customer_details: {
        first_name: user.nama,
        email: user.email,
      },
      item_details: [
        {
          id: 'subscription',
          price: SUBSCRIPTION_PRICE,
          quantity: 1,
          name: 'Langganan Premium 30 Hari - CaseMed UKMPPD',
        },
      ],
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_BASE_URL}/subscription/success`,
      },
    };

    // Create Snap transaction
    const transaction = await snap.createTransaction(parameter);

    // Update payment with snap_token
    await prisma.payment.update({
      where: { id: payment.id },
      data: { snap_token: transaction.token },
    });

    return NextResponse.json({
      success: true,
      snap_token: transaction.token,
      order_id: orderId,
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    return NextResponse.json(
      { error: 'Gagal membuat pembayaran subscription' },
      { status: 500 }
    );
  }
}
