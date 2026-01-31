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

async function fixExistingPlans() {
  try {
    console.log('Fixing existing subscription plans...');

    // Update teacher plan
    const teacherPlan = await prisma.subscriptionPlan.update({
      where: { 
        id: "cb114038-0b4c-4a88-8026-fff0222ead57" 
      },
      data: { 
        targetRole: "TEACHER" 
      }
    });
    console.log('Updated teacher plan:', teacherPlan.name);

    // Update institute plan
    const institutePlan = await prisma.subscriptionPlan.update({
      where: { 
        id: "9f93ede6-1cb9-4263-8db6-4f1bca4bf419" 
      },
      data: { 
        targetRole: "INSTITUTE" 
      }
    });
    console.log('Updated institute plan:', institutePlan.name);

    console.log('✅ Plans fixed successfully!');
  } catch (error) {
    console.error('❌ Error fixing plans:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixExistingPlans();
