// Script to auto-complete ALL pending subscription payments
// Useful for bulk testing in development

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const SUBSCRIPTION_DURATION_DAYS = 30; // From constants.ts

async function autoCompleteAllPendingPayments() {
  try {
    console.log('🔍 Finding all pending subscription payments...\n');
    
    const pendingPayments = await prisma.payment.findMany({
      where: {
        paymentType: 'subscription',
        status: 'pending'
      },
      include: {
        user: true
      },
      orderBy: { createdAt: 'desc' }
    });

    if (pendingPayments.length === 0) {
      console.log('✅ No pending subscription payments found!');
      return;
    }

    console.log(`Found ${pendingPayments.length} pending subscription payments\n`);

    for (const payment of pendingPayments) {
      console.log(`Processing: ${payment.user.email}`);
      console.log(`  Order ID: ${payment.order_id}`);
      console.log(`  Amount: Rp ${payment.jumlah.toLocaleString()}`);
      
      const now = new Date();
      const subscriptionEnd = new Date();
      subscriptionEnd.setDate(subscriptionEnd.getDate() + (SUBSCRIPTION_DURATION_DAYS || 30));

      // Update payment to paid
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'paid',
          paid_at: now
        }
      });

      // Activate subscription
      await prisma.user.update({
        where: { id: payment.user_id },
        data: {
          isPremium: true,
          subscriptionStatus: 'active',
          subscriptionStart: now,
          subscriptionEnd: subscriptionEnd
        }
      });

      console.log(`  ✅ Subscription activated until ${subscriptionEnd.toLocaleDateString('id-ID')}\n`);
    }

    console.log(`\n🎉 Completed ${pendingPayments.length} subscription payments!`);
    console.log(`\nℹ️  Users should refresh their browser to see changes.`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

autoCompleteAllPendingPayments();
