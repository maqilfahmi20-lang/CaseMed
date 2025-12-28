// Script to manually activate subscription for a user who already paid
// Usage: node scripts/activate-subscription.js <user_email>

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function activateSubscription(userEmail) {
  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        payments: {
          where: { status: 'paid' },
          orderBy: { paid_at: 'desc' },
          take: 1
        }
      }
    });

    if (!user) {
      console.log(`❌ User with email ${userEmail} not found`);
      return;
    }

    // Check if user already has active subscription
    if (user.subscriptionStatus === 'active' && user.subscriptionEnd && new Date(user.subscriptionEnd) > new Date()) {
      console.log(`✅ User ${user.nama} already has active subscription until ${user.subscriptionEnd}`);
      return;
    }

    // Activate 30-day subscription
    const subscriptionStart = new Date();
    const subscriptionEnd = new Date();
    subscriptionEnd.setDate(subscriptionEnd.getDate() + 30);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isPremium: true,
        subscriptionStatus: 'active',
        subscriptionStart: subscriptionStart,
        subscriptionEnd: subscriptionEnd,
      }
    });

    console.log(`✅ Subscription activated for ${user.nama} (${user.email})`);
    console.log(`   Start: ${subscriptionStart.toISOString()}`);
    console.log(`   End: ${subscriptionEnd.toISOString()}`);
    console.log(`   Duration: 30 days`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get email from command line arguments
const userEmail = process.argv[2];

if (!userEmail) {
  console.log('Usage: node scripts/activate-subscription.js <user_email>');
  console.log('Example: node scripts/activate-subscription.js user@example.com');
  process.exit(1);
}

activateSubscription(userEmail);
