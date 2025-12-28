// Script to simulate Midtrans payment success and trigger subscription activation
// Use this in development/testing when Midtrans sandbox doesn't auto-complete payments

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const SUBSCRIPTION_DURATION_DAYS = 30; // From constants.ts

async function simulatePaymentSuccess(orderIdOrEmail) {
  try {
    // Find payment by order_id or user email
    let payment;
    
    if (orderIdOrEmail.includes('@')) {
      // Find by email - get latest pending subscription payment
      console.log(`🔍 Searching for pending subscription payment for ${orderIdOrEmail}...`);
      payment = await prisma.payment.findFirst({
        where: {
          user: { email: orderIdOrEmail },
          paymentType: 'subscription',
          status: 'pending'
        },
        orderBy: { createdAt: 'desc' },
        include: {
          user: true,
          package: true
        }
      });
    } else {
      // Find by order_id
      console.log(`🔍 Searching for payment with order_id: ${orderIdOrEmail}...`);
      payment = await prisma.payment.findFirst({
        where: { order_id: orderIdOrEmail },
        include: {
          user: true,
          package: true
        }
      });
    }

    if (!payment) {
      console.log(`❌ Payment not found!`);
      return;
    }

    if (payment.status === 'paid') {
      console.log(`ℹ️  Payment already marked as paid`);
      console.log(`   User: ${payment.user.email}`);
      console.log(`   Type: ${payment.paymentType}`);
      return;
    }

    console.log(`\n📦 Payment Details:`);
    console.log(`   Order ID: ${payment.order_id}`);
    console.log(`   User: ${payment.user.email} (${payment.user.nama})`);
    console.log(`   Amount: Rp ${payment.jumlah.toLocaleString()}`);
    console.log(`   Type: ${payment.paymentType}`);
    console.log(`   Status: ${payment.status} -> paid`);
    
    if (payment.paymentType === 'subscription') {
      console.log(`   Package: 💎 Subscription (30 days access)`);
    } else {
      console.log(`   Package: ${payment.package?.nama || 'N/A'}`);
    }

    // Simulate payment success
    const now = new Date();
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'paid',
        paid_at: now
      }
    });

    console.log(`\n✅ Payment marked as paid!`);

    // If subscription payment, activate subscription
    if (payment.paymentType === 'subscription') {
      const subscriptionEnd = new Date();
      subscriptionEnd.setDate(subscriptionEnd.getDate() + (SUBSCRIPTION_DURATION_DAYS || 30));

      await prisma.user.update({
        where: { id: payment.user_id },
        data: {
          isPremium: true,
          subscriptionStatus: 'active',
          subscriptionStart: now,
          subscriptionEnd: subscriptionEnd
        }
      });

      console.log(`\n💎 Subscription Activated!`);
      console.log(`   User: ${payment.user.email}`);
      console.log(`   Start: ${now.toLocaleDateString('id-ID')}`);
      console.log(`   End: ${subscriptionEnd.toLocaleDateString('id-ID')}`);
      console.log(`   Duration: ${SUBSCRIPTION_DURATION_DAYS || 30} days`);
      console.log(`\n🎉 User now has access to ALL premium packages!`);
    } else {
      console.log(`\n✅ Individual package payment completed!`);
      console.log(`   User can now access: ${payment.package?.nama}`);
    }

    console.log(`\n✨ Done! User should refresh browser to see changes.`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Usage examples:
// node scripts/simulate-payment-success.js user@email.com
// node scripts/simulate-payment-success.js SUB-cmjpxryr-1766938935742

const input = process.argv[2];

if (!input) {
  console.log(`
📝 Usage:
  node scripts/simulate-payment-success.js <email_or_order_id>

Examples:
  node scripts/simulate-payment-success.js user@gmail.com
  node scripts/simulate-payment-success.js SUB-cmjpxryr-1766938935742

This will:
- Mark payment as "paid"
- If subscription payment: activate 30-day subscription
- If package payment: user can access that package
  `);
  process.exit(1);
}

simulatePaymentSuccess(input);
