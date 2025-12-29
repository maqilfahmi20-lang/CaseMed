/**
 * 🧪 SCRIPT TEST WEBHOOK MIDTRANS SANDBOX
 * 
 * Script ini untuk mensimulasikan webhook dari Midtrans Sandbox
 * Gunakan untuk testing apakah subscription auto-aktif
 * 
 * Cara pakai:
 * 1. Pastikan server Next.js running di http://localhost:3000
 * 2. Ganti ORDER_ID dengan order_id dari payment yang mau di-test
 * 3. Jalankan: node scripts/test-webhook-sandbox.js
 */

const crypto = require('crypto');

// ==================== CONFIGURATION ====================
const WEBHOOK_URL = 'http://localhost:3000/api/midtrans-webhook';
const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-YOUR-SERVER-KEY'; // Ganti dengan server key sandbox
const ORDER_ID = 'SUB-123456-1735446400000'; // Ganti dengan order_id dari database
const GROSS_AMOUNT = '55000';

// ==================== GENERATE SIGNATURE ====================
function generateSignature(orderId, statusCode, grossAmount, serverKey) {
  const signatureString = `${orderId}${statusCode}${grossAmount}${serverKey}`;
  console.log('\n📝 Signature String:', signatureString);
  
  const signature = crypto
    .createHash('sha512')
    .update(signatureString)
    .digest('hex');
  
  console.log('🔐 Generated Signature:', signature);
  return signature;
}

// ==================== SIMULATE WEBHOOK ====================
async function simulateWebhook() {
  console.log('\n🚀 SIMULATING MIDTRANS WEBHOOK (SANDBOX)');
  console.log('=' .repeat(50));
  
  // Status code untuk settlement adalah "200"
  const statusCode = '200';
  const signature = generateSignature(ORDER_ID, statusCode, GROSS_AMOUNT, SERVER_KEY);
  
  // Payload webhook Midtrans untuk transaksi SETTLEMENT (SUCCESS)
  const payload = {
    transaction_time: new Date().toISOString(),
    transaction_status: 'settlement', // Status transaksi berhasil
    transaction_id: `TRX-${Date.now()}`,
    status_message: 'midtrans payment notification',
    status_code: statusCode,
    signature_key: signature,
    payment_type: 'qris',
    order_id: ORDER_ID,
    merchant_id: 'G123456789',
    gross_amount: GROSS_AMOUNT,
    fraud_status: 'accept', // Sandbox biasanya auto-accept
    currency: 'IDR'
  };
  
  console.log('\n📦 Payload:');
  console.log(JSON.stringify(payload, null, 2));
  
  console.log(`\n📡 Sending to: ${WEBHOOK_URL}`);
  
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    const result = await response.json();
    
    console.log('\n📥 Response Status:', response.status);
    console.log('📥 Response Body:', JSON.stringify(result, null, 2));
    
    if (response.status === 200) {
      console.log('\n✅ WEBHOOK BERHASIL!');
      console.log('Cek database apakah subscription sudah aktif.');
    } else {
      console.log('\n❌ WEBHOOK GAGAL!');
      console.log('Error:', result.error || 'Unknown error');
    }
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
  }
  
  console.log('\n' + '='.repeat(50));
}

// ==================== RUN ====================
simulateWebhook();
