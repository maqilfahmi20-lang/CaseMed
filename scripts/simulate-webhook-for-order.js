/**
 * 🧪 SIMULATE WEBHOOK FOR SPECIFIC ORDER
 * 
 * Script ini akan simulate webhook Midtrans untuk order tertentu
 * Gunakan untuk testing tanpa perlu Midtrans Dashboard
 * 
 * Usage: node scripts/simulate-webhook-for-order.js ORDER_ID
 */

const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function simulateWebhook(orderId) {
  try {
    console.log('\n🧪 SIMULATING WEBHOOK FOR ORDER');
    console.log('='.repeat(60));
    console.log('Order ID:', orderId);

    // Get payment from database
    const payment = await prisma.payment.findUnique({
      where: { order_id: orderId },
      include: { user: true }
    });

    if (!payment) {
      console.log('❌ Payment not found in database');
      return;
    }

    console.log('\n📦 PAYMENT INFO:');
    console.log('User:', payment.user.email);
    console.log('Amount:', payment.jumlah);
    console.log('Current Status:', payment.status);

    // Get server key from env
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (!serverKey) {
      console.log('❌ MIDTRANS_SERVER_KEY not found in .env');
      return;
    }

    console.log('\n🔐 GENERATING SIGNATURE:');
    console.log('Server Key:', serverKey.substring(0, 20) + '...');

    const grossAmount = String(payment.jumlah);
    const transactionStatus = 'settlement';
    const statusCode = '200';

    // Try both signature methods
    const sig1String = `${orderId}${statusCode}${grossAmount}${serverKey}`;
    const sig1 = crypto.createHash('sha512').update(sig1String).digest('hex');

    const sig2String = `${orderId}${transactionStatus}${grossAmount}${serverKey}`;
    const sig2 = crypto.createHash('sha512').update(sig2String).digest('hex');

    console.log('Method 1 (status_code):', sig1.substring(0, 40) + '...');
    console.log('Method 2 (transaction_status):', sig2.substring(0, 40) + '...');

    // Create webhook payload (using method 2 - transaction_status)
    const payload = {
      transaction_time: new Date().toISOString(),
      transaction_status: transactionStatus,
      transaction_id: `TRX-${Date.now()}`,
      status_message: 'midtrans payment notification',
      status_code: statusCode,
      signature_key: sig2, // Use method 2
      payment_type: 'qris',
      order_id: orderId,
      merchant_id: 'G123456789',
      gross_amount: grossAmount,
      fraud_status: 'accept',
      currency: 'IDR'
    };

    console.log('\n📤 SENDING WEBHOOK TO:');
    const webhookUrl = 'http://localhost:3000/api/midtrans-webhook';
    console.log(webhookUrl);

    console.log('\n📦 PAYLOAD:');
    console.log(JSON.stringify(payload, null, 2));

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    console.log('\n📥 RESPONSE:');
    console.log('Status:', response.status);
    console.log('Body:', JSON.stringify(result, null, 2));

    if (response.status === 200 && result.subscriptionActivated) {
      console.log('\n✅✅✅ SUCCESS! ✅✅✅');
      console.log('Subscription should be activated now!');
      console.log('\nVerify dengan:');
      console.log(`node scripts/check-webhook-logs.js ${payment.user.email}`);
    } else {
      console.log('\n⚠️ Webhook processed but check if subscription activated');
      console.log('Check server logs untuk detail');
    }

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

const orderId = process.argv[2];

if (!orderId) {
  console.log('Usage: node scripts/simulate-webhook-for-order.js ORDER_ID');
  console.log('Example: node scripts/simulate-webhook-for-order.js SUB-cmjqe2dq-1766966231467');
  process.exit(1);
}

simulateWebhook(orderId);
