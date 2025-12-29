/**
 * 🔍 SCRIPT CEK WEBHOOK LOGS & STATUS SUBSCRIPTION
 * 
 * Script ini untuk mengecek:
 * 1. Payment terakhir user
 * 2. Status subscription user
 * 3. Log untuk debugging
 * 
 * Cara pakai:
 * node scripts/check-webhook-logs.js USER_EMAIL
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkWebhookStatus(email) {
  try {
    console.log('\n🔍 CHECKING WEBHOOK STATUS');
    console.log('=' .repeat(60));
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        nama: true,
        email: true,
        isPremium: true,
        subscriptionStatus: true,
        subscriptionStart: true,
        subscriptionEnd: true,
      }
    });
    
    if (!user) {
      console.log('❌ User not found:', email);
      return;
    }
    
    console.log('\n👤 USER INFO:');
    console.log('Name:', user.nama);
    console.log('Email:', user.email);
    console.log('Premium:', user.isPremium ? '✅ YES' : '❌ NO');
    console.log('Subscription Status:', user.subscriptionStatus);
    console.log('Subscription Start:', user.subscriptionStart || 'N/A');
    console.log('Subscription End:', user.subscriptionEnd || 'N/A');
    
    // Check payments
    const payments = await prisma.payment.findMany({
      where: { 
        user_id: user.id,
        paymentType: 'subscription'
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    
    console.log('\n💰 RECENT SUBSCRIPTION PAYMENTS:');
    console.log('-'.repeat(60));
    
    if (payments.length === 0) {
      console.log('No subscription payments found.');
    } else {
      payments.forEach((payment, idx) => {
        console.log(`\n[${idx + 1}] ORDER ID: ${payment.order_id}`);
        console.log(`    Status: ${payment.status}`);
        console.log(`    Amount: Rp ${payment.jumlah.toLocaleString('id-ID')}`);
        console.log(`    Paid At: ${payment.paid_at || 'Not paid yet'}`);
        console.log(`    Created: ${payment.createdAt}`);
      });
    }
    
    // Check if latest payment is paid but subscription not active
    const latestPayment = payments[0];
    if (latestPayment) {
      console.log('\n⚠️ DIAGNOSIS:');
      console.log('-'.repeat(60));
      
      if (latestPayment.status === 'paid' && user.subscriptionStatus !== 'active') {
        console.log('❌ BUG DETECTED!');
        console.log('   Payment is PAID but subscription is NOT ACTIVE');
        console.log('   This means webhook did NOT activate subscription');
        console.log('\n🔧 POSSIBLE CAUSES:');
        console.log('   1. Webhook was not called by Midtrans');
        console.log('   2. Webhook signature verification failed');
        console.log('   3. Webhook hit error during processing');
        console.log('\n💡 SOLUTION:');
        console.log('   1. Check server logs during payment');
        console.log('   2. Verify webhook URL in Midtrans Dashboard');
        console.log('   3. Run: node scripts/test-webhook-sandbox.js');
      } else if (latestPayment.status === 'paid' && user.subscriptionStatus === 'active') {
        console.log('✅ ALL GOOD!');
        console.log('   Payment is PAID and subscription is ACTIVE');
        console.log('   Webhook is working correctly!');
      } else if (latestPayment.status === 'pending') {
        console.log('⏳ PAYMENT PENDING');
        console.log('   Payment not completed yet');
        console.log('   Wait for Midtrans to send webhook');
      } else {
        console.log('ℹ️ Status:', latestPayment.status);
      }
    }
    
    console.log('\n' + '='.repeat(60));
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Get email from command line args
const email = process.argv[2];

if (!email) {
  console.log('Usage: node scripts/check-webhook-logs.js USER_EMAIL');
  console.log('Example: node scripts/check-webhook-logs.js user@example.com');
  process.exit(1);
}

checkWebhookStatus(email);
