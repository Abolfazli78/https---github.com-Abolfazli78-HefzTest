import { PrismaClient } from '../src/generated/client';
import bcrypt from 'bcryptjs';

import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

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

async function seedAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.phone);
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const admin = await prisma.user.create({
      data: {
        name: 'Admin',
        phone: '+989999999999',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'ADMIN',
        phoneVerifiedAt: new Date(),
      },
    });

    console.log('Admin user created:');
    console.log('Phone: +989999999999');
    console.log('Password: admin123');
    console.log('Email: admin@example.com');
  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();
