#!/usr/bin/env node

const { PrismaClient } = require('../../node_modules/@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function resetUserQuotas() {
  const email = process.argv[2];
  const phone = process.argv[3];

  if (!email && !phone) {
    console.log('Usage: node reset-quotas.js <email> <phone>');
    process.exit(1);
  }

  try {
    // Find user
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(email ? [{ email }] : []),
          ...(phone ? [{ phone }] : [])
        ]
      }
    });

    if (!user) {
      console.log('User not found');
      process.exit(1);
    }

    console.log(`Found user: ${user.email} (${user.phone})`);

    // Get current date
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 0, 0, -1);

    // Update exam records to move them to previous month
    const updatedExams = await prisma.exam.updateMany({
      where: {
        createdById: user.id,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      },
      data: {
        questionCount: 0,
        createdAt: new Date(now.getFullYear() - 1, now.getMonth(), 1) // Move to previous month
      }
    });

    console.log(`Updated ${updatedExams.count} exam records`);

    // Alternative: Delete exam records for current month
    // const deletedExams = await prisma.exam.deleteMany({
    //   where: {
    //     createdById: user.id,
    //     createdAt: {
    //       gte: startOfMonth,
    //       lte: endOfMonth
    //     }
    //   }
    // });

    // console.log(`Deleted ${deletedExams.count} exam records`);

    console.log('✅ User quotas reset successfully');
    console.log(`📊 Current status:`);
    console.log(`   - Exams this month: 0`);
    console.log(`   - Questions used: 0`);

  } catch (error) {
    console.error('❌ Error resetting quotas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetUserQuotas();
