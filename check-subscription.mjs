import { PrismaClient } from './src/generated/index.js';

const prisma = new PrismaClient();

async function checkUserSubscription() {
  try {
    // Find user taha
    const user = await prisma.user.findUnique({
      where: { phone: '+989990000003' },
      select: { id: true, name: true, role: true }
    });

    if (!user) {
      console.log('❌ User taha not found');
      return;
    }

    console.log('✅ User found:', user);

    // Check active subscriptions
    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId: user.id,
        status: 'ACTIVE',
        OR: [
          { endDate: null },
          { endDate: { gte: new Date() } }
        ]
      },
      include: {
        plan: true
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`\n📊 Active subscriptions for ${user.name}:`);
    if (subscriptions.length === 0) {
      console.log('❌ No active subscriptions found');
      
      // Check all subscriptions (including inactive)
      const allSubscriptions = await prisma.subscription.findMany({
        where: { userId: user.id },
        include: { plan: true },
        orderBy: { createdAt: 'desc' }
      });
      
      console.log(`\n📋 All subscriptions (${allSubscriptions.length}):`);
      allSubscriptions.forEach((sub, index) => {
        console.log(`${index + 1}. ${sub.plan?.name || 'Unknown'} - ${sub.status} - ${sub.startDate}`);
        if (sub.endDate) {
          console.log(`   Ends: ${sub.endDate}`);
        }
      });
    } else {
      subscriptions.forEach((sub, index) => {
        console.log(`${index + 1}. ${sub.plan?.name || 'Unknown'} - ${sub.status}`);
        console.log(`   Features: ${sub.plan?.features || 'None'}`);
        console.log(`   Start: ${sub.startDate}`);
        if (sub.endDate) {
          console.log(`   End: ${sub.endDate}`);
        }
      });
    }

    // Test subscription info API logic
    console.log('\n🔍 Testing subscription info logic...');
    
    const hasActiveSubscription = subscriptions.length > 0;
    console.log(`hasActiveSubscription: ${hasActiveSubscription}`);
    
    if (hasActiveSubscription) {
      const activeSub = subscriptions[0];
      const features = new Set();
      
      // Add base features for student role
      const baseFeatures = ["basic_exams", "performance_tracking", "leaderboard_access"];
      baseFeatures.forEach(f => features.add(f));
      
      // Add plan features
      if (activeSub.plan?.features) {
        try {
          const planFeatures = JSON.parse(activeSub.plan.features);
          if (Array.isArray(planFeatures)) {
            planFeatures.forEach(f => {
              if (typeof f === 'string') {
                features.add(f);
              }
            });
          }
        } catch (e) {
          console.warn('Invalid features JSON:', activeSub.plan.features);
        }
      }
      
      console.log('Features:', Array.from(features));
      console.log('Has ticket_support:', features.has('ticket_support'));
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserSubscription();
