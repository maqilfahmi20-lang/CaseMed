'use server';

import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import midtransClient from 'midtrans-client';

const coreApi = new midtransClient.CoreApi({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY || '',
  clientKey: process.env.MIDTRANS_CLIENT_KEY || '',
});

export async function verifyPayment(orderId: string) {
  const user = await requireAuth();

  try {
    // Get transaction status from Midtrans
    const statusResponse = await coreApi.transaction.status(orderId);
    
    // Find payment record
    const payment = await prisma.payment.findUnique({
      where: { order_id: orderId }
    });

    if (!payment) {
      return { error: 'Payment tidak ditemukan' };
    }

    // Check if payment belongs to user
    if (payment.user_id !== user.id) {
      return { error: 'Unauthorized' };
    }

    // Update payment status based on Midtrans response
    let newStatus = payment.status;
    
    if (statusResponse.transaction_status === 'capture' || 
        statusResponse.transaction_status === 'settlement') {
      newStatus = 'paid';
    } else if (statusResponse.transaction_status === 'pending') {
      newStatus = 'pending';
    } else {
      newStatus = 'failed';
    }

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: newStatus,
        paid_at: newStatus === 'paid' ? new Date() : null,
      }
    });

    return { 
      success: true, 
      status: newStatus,
      payment 
    };
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return { error: error.message || 'Gagal memverifikasi pembayaran' };
  }
}
