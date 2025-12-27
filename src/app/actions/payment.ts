'use server';

import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import midtransClient from 'midtrans-client';

const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY || '',
  clientKey: process.env.MIDTRANS_CLIENT_KEY || '',
});

export async function createPayment(packageId: string) {
  const user = await requireAuth();

  try {
    // Check if package exists
    const pkg = await prisma.package.findUnique({
      where: { id: packageId }
    });

    if (!pkg) {
      return { error: 'Paket tidak ditemukan' };
    }

    if (pkg.is_free || !pkg.harga || pkg.harga <= 0) {
      return { error: 'Paket ini gratis, tidak perlu pembayaran' };
    }

    // Check if user already has active payment
    const existingPayment = await prisma.payment.findFirst({
      where: {
        user_id: user.id,
        package_id: packageId,
        status: 'paid'
      }
    });

    if (existingPayment) {
      return { error: 'Anda sudah membeli paket ini' };
    }

    // Generate unique order ID
    const orderId = `ORDER-${Date.now()}-${user.id.substring(0, 8)}`;

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        user_id: user.id,
        package_id: packageId,
        order_id: orderId,
        jumlah: pkg.harga,
        status: 'pending',
      }
    });

    // Create Midtrans transaction
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: pkg.harga,
      },
      customer_details: {
        first_name: user.nama,
        email: user.email,
      },
      item_details: [
        {
          id: packageId,
          price: pkg.harga,
          quantity: 1,
          name: pkg.nama,
        }
      ],
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_BASE_URL}/paket/${packageId}?payment=success&order_id=${orderId}`,
        error: `${process.env.NEXT_PUBLIC_BASE_URL}/paket/${packageId}?payment=error&order_id=${orderId}`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/paket/${packageId}?payment=pending&order_id=${orderId}`,
      }
    };

    const transaction = await snap.createTransaction(parameter);

    // Update payment with transaction details
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        snap_token: transaction.token,
      }
    });

    return { 
      success: true, 
      token: transaction.token,
      redirectUrl: transaction.redirect_url 
    };
  } catch (error: any) {
    console.error('Payment creation error:', error);
    return { error: error.message || 'Gagal membuat pembayaran' };
  }
}

export async function checkPaymentStatus(packageId: string) {
  const user = await requireAuth();

  try {
    const payment = await prisma.payment.findFirst({
      where: {
        user_id: user.id,
        package_id: packageId,
        status: 'paid'
      }
    });

    return { 
      hasPaid: !!payment,
      payment: payment 
    };
  } catch (error: any) {
    return { error: error.message };
  }
}
