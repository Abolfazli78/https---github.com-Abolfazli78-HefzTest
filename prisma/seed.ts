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

async function main() {
  console.log("Start seeding...");

  // Check if admin already exists
  const existingAdmin = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
  });

  if (existingAdmin) {
    console.log('Admin user already exists:', existingAdmin.phone);
  } else {
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
  }

  // Create student user if not exists
  const studentPhone = "09121112225";
  const studentPassword = "12345678";

  const existingStudent = await prisma.user.findUnique({
    where: { phone: studentPhone },
  });

  if (!existingStudent) {
    const hashedStudentPassword = await bcrypt.hash(studentPassword, 10);
    const student = await prisma.user.create({
      data: {
        phone: studentPhone,
        password: hashedStudentPassword,
        name: "دانش‌آموز تست",
        role: "STUDENT",
        isActive: true,
        phoneVerifiedAt: new Date(),
      },
    });
    console.log("✅ Student user created:", student.phone);
    console.log(`   📱 شماره: ${student.phone}`);
    console.log(`   🔐 رمز: ${studentPassword}`);
  } else {
    console.log("ℹ️ Student user already exists");
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
