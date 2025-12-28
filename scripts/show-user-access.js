// Script to show which packages a user has access to
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function showUserAccess(userEmail) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        payments: {
          where: { status: 'paid' },
          include: {
            package: true
          }
        }
      }
    });

    if (!user) {
      console.log(`❌ User ${userEmail} not found`);
      return;
    }

    console.log(`\n👤 User: ${user.nama} (${user.email})`);
    console.log(`   Subscription: ${user.subscriptionStatus}`);
    
    if (user.subscriptionStatus === 'active' && user.subscriptionEnd) {
      console.log(`   ✅ Active until: ${user.subscriptionEnd}`);
      console.log(`   💎 Has access to ALL premium packages`);
    } else {
      console.log(`   ℹ️  No active subscription`);
    }

    console.log(`\n📦 Packages with PAID individual access:`);
    
    const paidPackages = user.payments.filter(p => p.package_id !== null);
    
    if (paidPackages.length === 0) {
      console.log('   None');
    } else {
      paidPackages.forEach(payment => {
        console.log(`\n   ✅ ${payment.package.nama}`);
        console.log(`      ID: ${payment.package_id}`);
        console.log(`      Type: ${payment.package.tipe_paket}`);
        console.log(`      Paid: ${payment.paid_at}`);
        console.log(`      Access URL: http://localhost:3000/paket/${payment.package_id}`);
      });
    }

    // List all packages
    console.log(`\n\n📋 ALL Available Packages:\n`);
    
    const allPackages = await prisma.package.findMany({
      where: { is_active: true },
      orderBy: [
        { tipe_paket: 'asc' },
        { createdAt: 'asc' }
      ]
    });

    for (const pkg of allPackages) {
      const hasPaid = paidPackages.some(p => p.package_id === pkg.id);
      const hasSubscription = user.subscriptionStatus === 'active' && user.subscriptionEnd && new Date(user.subscriptionEnd) > new Date();
      
      // User has access if: free package OR paid for this package OR has active subscription
      const hasAccess = pkg.is_free || hasPaid || hasSubscription;
      
      const accessIcon = pkg.is_free ? '🆓' : hasAccess ? '✅' : '🔒';
      const accessStatus = pkg.is_free ? 'FREE' : hasAccess ? (hasPaid ? 'PAID' : 'SUBSCRIPTION') : 'LOCKED';
      
      console.log(`${accessIcon} [${accessStatus}] ${pkg.nama} (${pkg.tipe_paket})`);
      console.log(`   ID: ${pkg.id}`);
      console.log(`   URL: http://localhost:3000/paket/${pkg.id}`);
      console.log(``);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

const userEmail = process.argv[2] || 'bibi@gmail.com';
showUserAccess(userEmail);
