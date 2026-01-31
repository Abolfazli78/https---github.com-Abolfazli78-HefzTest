import { PrismaClient } from "../src/generated/client.js";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function createStudent() {
  try {
    const hashedPassword = await bcrypt.hash("12345678", 10);

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
