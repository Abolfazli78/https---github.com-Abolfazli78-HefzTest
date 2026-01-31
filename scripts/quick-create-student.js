// Quick student creation script using direct SQL
// Run with: node scripts/quick-create-student.js

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/hefztest"
});

async function createStudent() {
  try {
    console.log("🔐 در حال هش کردن رمز عبور...");
    const hashedPassword = await bcrypt.hash("12345678", 10);

    console.log("👤 در حال ایجاد دانش‌آموز...");
    
    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM "User" WHERE phone = $1',
      ['09121112225']
    );

    if (existingUser.rows.length > 0) {
      console.log("⚠️ این شماره موبایل قبلاً ثبت شده!");
      return;
    }

    // Insert new student
    const result = await pool.query(`
      INSERT INTO "User" (
        id, phone, email, password, name, role, "isActive", "phoneVerifiedAt", "createdAt", "updatedAt"
      ) VALUES (
        gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, NOW(), NOW()
      ) RETURNING id, phone, name, role
    `, [
      '09121112225',
      'student@test.com',
      hashedPassword,
      'دانش‌آموز تست',
      'STUDENT',
      true,
      new Date()
    ]);

    const student = result.rows[0];

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
    console.error("❌ خطا در ایجاد دانش‌آموز:", error.message);
  } finally {
    await pool.end();
  }
}

createStudent();
