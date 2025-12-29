/**
 * 🔧 MANUAL SUBSCRIPTION ACTIVATION
 * 
 * Script ini untuk MANUAL activate subscription jika webhook gagal
 * HANYA untuk emergency/testing
 * 
 * Usage: node scripts/manual-activate-subscription.js ORDER_ID
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const SUBSCRIPTION_DURATION_DAYS = 30;

async function manualActivate(orderId) {
  try {
    console.log('\n🔧 MANUAL SUBSCRIPTION ACTIVATION');
    console.log('='.repeat(60));
    console.log('Order ID:', orderId);

    // Find payment
    const payment = await prisma.payment.findUnique({
      where: { order_id: orderId },
      include: { user: true }
    });

    if (!payment) {
      console.log('❌ Payment not found');
      return;
    }

    console.log('\n📦 PAYMENT INFO:');
    console.log('User:', payment.user.email);
    console.log('Amount:', `Rp ${payment.jumlah.toLocaleString('id-ID')}`);
    console.log('Current Status:', payment.status);
    console.log('Payment Type:', payment.paymentType);

    if (payment.paymentType !== 'subscription') {
      console.log('❌ This is not a subscription payment');
      return;
    }

    // Update payment status
    console.log('\n💾 Updating payment to PAID...');
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'paid',
        paid_at: new Date(),
      }
    });
    console.log('✅ Payment updated');

    // Activate subscription
    console.log('\n🚀 Activating subscription...');
    const subscriptionStart = new Date();
    const subscriptionEnd = new Date();
    subscriptionEnd.setDate(subscriptionEnd.getDate() + SUBSCRIPTION_DURATION_DAYS);

    const updatedUser = await prisma.user.update({
      where: { id: payment.user_id },
      data: {
        isPremium: true,
        subscriptionStatus: 'active',
        subscriptionStart: subscriptionStart,
        subscriptionEnd: subscriptionEnd,
      }
    });

    console.log('✅✅✅ SUBSCRIPTION ACTIVATED ✅✅✅');
    console.log('\n👤 USER INFO:');
    console.log('Email:', updatedUser.email);
    console.log('Premium:', updatedUser.isPremium);
    console.log('Status:', updatedUser.subscriptionStatus);
    console.log('Start:', subscriptionStart.toISOString());
    console.log('End:', subscriptionEnd.toISOString());

    console.log('\n' + '='.repeat(60));
    console.log('✅ Done! User can now access premium features');
    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

const orderId = process.argv[2];

if (!orderId) {
  console.log('Usage: node scripts/manual-activate-subscription.js ORDER_ID');
  console.log('Example: node scripts/manual-activate-subscription.js SUB-12345678-1735446400000');
  process.exit(1);
}

manualActivate(orderId);
