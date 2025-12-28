const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkLatestPayments() {
  try {
    console.log('🔍 Mengecek 10 pembayaran terakhir...\n');
    
    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        user: {
          select: {
            email: true,
            nama: true,
            isPremium: true,
            subscriptionStatus: true,
            subscriptionEnd: true
          }
        },
        package: {
          select: {
            nama: true,
            is_free: true
          }
        }
      }
    });

    payments.forEach((payment, index) => {
      console.log(`${index + 1}. ${payment.user.email} - ${payment.user.name}`);
      console.log(`   Status: ${payment.status}`);
      console.log(`   Amount: Rp ${payment.jumlah?.toLocaleString() || 0}`);
      console.log(`   Type: ${payment.paymentType || 'package'}`);
      console.log(`   Package: ${payment.package ? payment.package.nama : '💎 Subscription'}`);
      console.log(`   User Premium: ${payment.user.isPremium}`);
      console.log(`   Subscription: ${payment.user.subscriptionStatus || 'inactive'}`);
      if (payment.user.subscriptionEnd) {
        console.log(`   Expires: ${payment.user.subscriptionEnd.toLocaleDateString('id-ID')}`);
      }
      console.log(`   Order ID: ${payment.order_id}`);
      console.log(`   Snap Token: ${payment.snap_token ? 'Yes' : 'No'}`);
      console.log(`   Created: ${payment.createdAt.toLocaleString('id-ID')}`);
      console.log('');
    });

    // Show users with paid payments but no active subscription
    const paidPayments = payments.filter(p => p.status === 'paid');
    console.log(`\n📊 Summary:`);
    console.log(`Total payments: ${payments.length}`);
    console.log(`Paid: ${paidPayments.length}`);
    console.log(`Pending: ${payments.filter(p => p.status === 'pending').length}`);
    console.log(`Failed: ${payments.filter(p => p.status === 'failed').length}`);
    
    const usersWithIssues = paidPayments.filter(p => 
      (p.paymentType === 'subscription' && p.user.subscriptionStatus !== 'active') ||
      (p.paymentType === 'package' && !p.user.isPremium)
    );
    
    if (usersWithIssues.length > 0) {
      console.log(`\n⚠️  Users dengan pembayaran berhasil tapi akses belum aktif: ${usersWithIssues.length}`);
      usersWithIssues.forEach(p => {
        console.log(`   - ${p.user.email}: ${p.paymentType} payment berhasil tapi ${p.paymentType === 'subscription' ? 'subscription tidak active' : 'tidak premium'}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkLatestPayments();
