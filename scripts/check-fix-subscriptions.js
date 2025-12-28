// Script to check and fix users with successful payments but no active subscription
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAndFixSubscriptions() {
  try {
    console.log('🔍 Checking users with successful payments...\n');

    // Find all successful payments
    const successfulPayments = await prisma.payment.findMany({
      where: { status: 'paid' },
      include: {
        user: {
          select: {
            id: true,
            nama: true,
            email: true,
            subscriptionStatus: true,
            subscriptionEnd: true,
          }
        }
      },
      orderBy: { paid_at: 'desc' }
    });

    console.log(`Found ${successfulPayments.length} successful payments\n`);

    for (const payment of successfulPayments) {
      console.log(`\n📋 Payment ID: ${payment.order_id}`);
      console.log(`   User: ${payment.user.nama} (${payment.user.email})`);
      console.log(`   Type: ${payment.paymentType}`);
      console.log(`   Amount: Rp ${payment.jumlah.toLocaleString('id-ID')}`);
      console.log(`   Current Status: ${payment.user.subscriptionStatus || 'none'}`);
      
      // Check if subscription is active
      const isActive = payment.user.subscriptionStatus === 'active' 
        && payment.user.subscriptionEnd 
        && new Date(payment.user.subscriptionEnd) > new Date();

      if (isActive) {
        console.log(`   ✅ Subscription ACTIVE until ${payment.user.subscriptionEnd}`);
      } else {
        console.log(`   ⚠️  Subscription NOT ACTIVE`);
        
        // If it's a subscription payment, activate it
        if (payment.paymentType === 'subscription') {
          const subscriptionStart = payment.paid_at || new Date();
          const subscriptionEnd = new Date(subscriptionStart);
          subscriptionEnd.setDate(subscriptionEnd.getDate() + 30);

          await prisma.user.update({
            where: { id: payment.user_id },
            data: {
              isPremium: true,
              subscriptionStatus: 'active',
              subscriptionStart: subscriptionStart,
              subscriptionEnd: subscriptionEnd,
            }
          });

          console.log(`   ✨ FIXED! Activated subscription until ${subscriptionEnd.toISOString()}`);
        } else {
          console.log(`   ℹ️  This is a package payment, not subscription. User needs to subscribe separately.`);
        }
      }
    }

    console.log('\n\n✅ Check complete!');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndFixSubscriptions();
