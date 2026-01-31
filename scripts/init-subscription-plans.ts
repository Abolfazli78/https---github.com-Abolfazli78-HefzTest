import { PrismaClient } from '../src/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  connectionTimeoutMillis: 10000,
  query_timeout: 30000,
  idleTimeoutMillis: 30000,
  max: 20,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

const TIER_FEATURES = {
  student: {
    base: ["basic_exams", "performance_tracking", "leaderboard_access"],
    quotas: {
      maxExamsPerMonth: 10,
      maxQuestionsPerMonth: 500,
      maxStudentsAllowed: 0,
      maxTeachersAllowed: 0,
      maxClassesAllowed: 0,
    },
  },
  teacher: {
    base: [
      "exam_creation",
      "student_management", 
      "basic_analytics",
      "question_bank_access",
      "custom_exams",
      "ticket_support"
    ],
    quotas: {
      maxExamsPerMonth: 50,
      maxQuestionsPerMonth: 2000,
      maxStudentsAllowed: 50,
      maxTeachersAllowed: 0,
      maxClassesAllowed: 5,
    },
  },
  institute: {
    base: [
      "exam_creation",
      "student_management",
      "teacher_management",
      "advanced_analytics",
      "question_bank_access",
      "custom_exams",
      "white_label",
      "bulk_operations",
      "priority_support"
    ],
    quotas: {
      maxExamsPerMonth: 500,
      maxQuestionsPerMonth: 10000,
      maxStudentsAllowed: 500,
      maxTeachersAllowed: 50,
      maxClassesAllowed: 50,
    },
  },
};

async function initSubscriptionPlans() {
  console.log('Initializing default subscription plans...');

  const plans = [
    // Student Plans
    {
      name: "دانش‌آموز رایگان",
      description: "دسترسی به آزمون‌های پایه و tracking عملکرد",
      price: 0,
      duration: 30,
      targetRole: "STUDENT" as const,
      features: JSON.stringify(TIER_FEATURES.student.base),
      ...TIER_FEATURES.student.quotas,
    },
    {
      name: "دانش‌آموز پرمیوم",
      description: "دسترسی نامحدود به آزمون‌ها و تحلیل‌های پیشرفته",
      price: 9.99,
      duration: 30,
      targetRole: "STUDENT" as const,
      features: JSON.stringify([...TIER_FEATURES.student.base, "unlimited_exams", "advanced_analytics", "custom_exams"]),
      maxExamsPerMonth: -1, // Unlimited
      maxQuestionsPerMonth: -1, // Unlimited
      maxStudentsAllowed: 0,
      maxTeachersAllowed: 0,
      maxClassesAllowed: 0,
    },
    // Teacher Plans
    {
      name: "معلم استاندارد",
      description: "ایجاد آزمون و مدیریت دانش‌آموزان",
      price: 29.99,
      duration: 30,
      targetRole: "TEACHER" as const,
      features: JSON.stringify(TIER_FEATURES.teacher.base),
      ...TIER_FEATURES.teacher.quotas,
    },
    {
      name: "معلم پرمیوم",
      description: "ظرفیت بالا و ابزارهای پیشرفته",
      price: 59.99,
      duration: 30,
      targetRole: "TEACHER" as const,
      features: JSON.stringify([...TIER_FEATURES.teacher.base, "advanced_analytics", "custom_themes"]),
      maxExamsPerMonth: 200,
      maxQuestionsPerMonth: 5000,
      maxStudentsAllowed: 200,
      maxTeachersAllowed: 0,
      maxClassesAllowed: 20,
    },
    // Institute Plans
    {
      name: "موسسه استاندارد",
      description: "مدیریت کامل معلمان و دانش‌آموزان",
      price: 199.99,
      duration: 30,
      targetRole: "INSTITUTE" as const,
      features: JSON.stringify(TIER_FEATURES.institute.base),
      ...TIER_FEATURES.institute.quotas,
    },
    {
      name: "موسسه پیشرفته",
      description: "ظرفیت نامحدود و امکانات سفارشی",
      price: 499.99,
      duration: 30,
      targetRole: "INSTITUTE" as const,
      features: JSON.stringify([...TIER_FEATURES.institute.base, "unlimited_everything", "dedicated_support"]),
      maxExamsPerMonth: -1, // Unlimited
      maxQuestionsPerMonth: -1, // Unlimited
      maxStudentsAllowed: -1, // Unlimited
      maxTeachersAllowed: -1, // Unlimited
      maxClassesAllowed: -1, // Unlimited
    },
  ];

  for (const planData of plans) {
    try {
      const existing = await prisma.subscriptionPlan.findFirst({
        where: { 
          name: planData.name, 
          targetRole: planData.targetRole 
        },
      });

      if (!existing) {
        await prisma.subscriptionPlan.create({ data: planData });
        console.log(`✅ Created plan: ${planData.name} (${planData.targetRole})`);
      } else {
        console.log(`⏭️  Plan already exists: ${planData.name} (${planData.targetRole})`);
      }
    } catch (error) {
      console.error(`❌ Error creating plan ${planData.name}:`, error);
    }
  }

  console.log('✅ Subscription plans initialization completed!');
}

async function main() {
  try {
    await initSubscriptionPlans();
  } catch (error) {
    console.error('❌ Error initializing subscription plans:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}
