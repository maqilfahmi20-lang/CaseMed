/**
 * 🎯 CAPTURE REAL WEBHOOK PAYLOAD FROM MIDTRANS
 * 
 * Script ini untuk test webhook dengan data REAL dari payment yang ada
 * Langkah:
 * 1. Ambil payment terakhir dari database
 * 2. Tampilkan informasi payment
 * 3. Beri instruksi cara trigger webhook dari Midtrans Dashboard
 * 
 * Usage: node scripts/capture-real-webhook.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function captureWebhook() {
  try {
    console.log('\n🎯 CAPTURE REAL WEBHOOK PAYLOAD');
    console.log('='.repeat(60));

    // Get latest subscription payment
    const payment = await prisma.payment.findFirst({
      where: {
        paymentType: 'subscription',
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: true
      }
    });

    if (!payment) {
      console.log('❌ No subscription payment found');
      console.log('Buat payment dulu di aplikasi!');
      return;
    }

    console.log('\n📦 LATEST SUBSCRIPTION PAYMENT:');
    console.log('-'.repeat(60));
    console.log('Order ID:', payment.order_id);
    console.log('User Email:', payment.user.email);
    console.log('Amount:', `Rp ${payment.jumlah.toLocaleString('id-ID')}`);
    console.log('Status:', payment.status);
    console.log('Payment Type:', payment.paymentType);
    console.log('Created:', payment.createdAt);
    console.log('Paid At:', payment.paid_at || 'Not paid yet');

    console.log('\n👤 USER INFO:');
    console.log('-'.repeat(60));
    console.log('Name:', payment.user.nama);
    console.log('Email:', payment.user.email);
    console.log('Premium:', payment.user.isPremium ? '✅ YES' : '❌ NO');
    console.log('Subscription Status:', payment.user.subscriptionStatus);
    console.log('Subscription End:', payment.user.subscriptionEnd || 'N/A');

    console.log('\n🔔 CARA TRIGGER WEBHOOK DARI MIDTRANS:');
    console.log('='.repeat(60));
    console.log('\n1. Buka Midtrans Dashboard Sandbox:');
    console.log('   https://dashboard.sandbox.midtrans.com/');
    
    console.log('\n2. Masuk ke menu "Transactions"');
    
    console.log('\n3. Search order_id:', payment.order_id);
    
    console.log('\n4. Klik order tersebut, lalu klik "Change Status"');
    
    console.log('\n5. Pilih status "settlement"');
    
    console.log('\n6. Midtrans akan KIRIM webhook ke server Anda');
    
    console.log('\n7. Check server logs untuk melihat:');
    console.log('   🔔 MIDTRANS WEBHOOK RECEIVED');
    console.log('   FULL PAYLOAD: {...}');
    console.log('   ✅ SUBSCRIPTION ACTIVATED');

    console.log('\n📝 IMPORTANT NOTES:');
    console.log('-'.repeat(60));
    console.log('- Server Next.js HARUS running (npm run dev)');
    console.log('- Webhook URL harus PUBLIC (gunakan ngrok jika localhost)');
    console.log('- Check .env untuk MIDTRANS_SERVER_KEY');
    console.log('- Lihat console server untuk log webhook');

    console.log('\n🔧 WEBHOOK URL CONFIGURATION:');
    console.log('-'.repeat(60));
    console.log('Di Midtrans Dashboard → Settings → Configuration');
    console.log('Payment Notification URL:');
    console.log('  https://your-domain.com/api/midtrans-webhook');
    console.log('  atau');
    console.log('  https://your-ngrok-url.ngrok.io/api/midtrans-webhook');

    console.log('\n' + '='.repeat(60));
    console.log('✅ Ready! Sekarang trigger webhook dari Midtrans Dashboard');
    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

captureWebhook();
