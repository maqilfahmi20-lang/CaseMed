import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const user = await requireAuth();

    // Get current user with subscription
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        nama: true,
        email: true,
        subscriptionStatus: true,
        subscriptionEnd: true,
      }
    });

    // Check if subscription is active
    const isSubscriptionActive = currentUser?.subscriptionStatus === 'active' 
      && currentUser?.subscriptionEnd 
      && new Date(currentUser.subscriptionEnd) > new Date();

    // Get all payments for this user
    const payments = await prisma.payment.findMany({
      where: { user_id: user.id },
      include: {
        package: {
          select: {
            id: true,
            nama: true,
            is_free: true,
            harga: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        subscriptionStatus: currentUser?.subscriptionStatus || 'none',
        subscriptionEnd: currentUser?.subscriptionEnd || null,
        isSubscriptionActive: isSubscriptionActive
      },
      payments: payments.map(p => ({
        order_id: p.order_id,
        package_id: p.package_id,
        package_name: p.package?.nama || 'Subscription',
        amount: p.jumlah,
        status: p.status,
        paymentType: p.paymentType,
        paid_at: p.paid_at,
        created_at: p.createdAt
      })),
      totalPayments: payments.length,
      paidPayments: payments.filter(p => p.status === 'paid').length
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
