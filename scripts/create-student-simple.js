// Simple script to create a student user
// Run with: node -r dotenv/config scripts/create-student-simple.js

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function createStudent() {
  try {
    console.log("🔐 در حال هش کردن رمز عبور...");
    const hashedPassword = await bcrypt.hash("12345678", 10);

    console.log("👤 در حال ایجاد دانش‌آموز...");
    const student = await prisma.user.create({
      data: {
        phone: "09121112225",
        password: hashedPassword,
        name: "دانش‌آموز تست",
        role: "STUDENT",
        isActive: true,
        phoneVerifiedAt: new Date(),
      },
    });

    console.log("✅ دانش‌آموز با موفقیت ایجاد شد:");
    console.log(`📱 شماره موبایل: ${student.phone}`);
    console.log(`👤 نام: ${student.name}`);
    console.log(`🎭 نقش: ${student.role}`);
    console.log(`🆔 ID: ${student.id}`);
    console.log(`🔐 رمز عبور: 12345678`);
    console.log("");
    console.log("🎉 حالا می‌تونی با این اطلاعات وارد بشی:");
    console.log(`   شماره موبایل: 09121112225`);
    console.log(`   رمز عبور: 12345678`);

  } catch (error) {
    console.error("❌ خطا در ایجاد دانش‌آموز:", error);
    
    if (error.message.includes("Unique constraint")) {
      console.log("⚠️ این شماره موبایل قبلاً ثبت شده!");
    }
  } finally {
    await prisma.$disconnect();
  }
}

createStudent();
