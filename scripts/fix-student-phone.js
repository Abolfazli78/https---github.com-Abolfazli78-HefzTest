// Fix student phone number format
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/hefztest"
});

async function fixStudentPhone() {
  try {
    console.log("🔍 در حال جستجوی کاربر با شماره 09121112225...");
    
    // Find user with old phone format
    const existingUser = await pool.query(
      'SELECT id, phone FROM "User" WHERE phone = $1',
      ['09121112225']
    );

    if (existingUser.rows.length === 0) {
      console.log("❌ کاربری با شماره 09121112225 پیدا نشد!");
      return;
    }

    const user = existingUser.rows[0];
    console.log(`✅ کاربر پیدا شد: ${user.phone} (ID: ${user.id})`);

    // Check if new format already exists
    const newFormatUser = await pool.query(
      'SELECT id FROM "User" WHERE phone = $1',
      ['+989121112225']
    );

    if (newFormatUser.rows.length > 0) {
      console.log("⚠️ کاربر با فرمت جدید (+989121112225) قبلاً وجود داره!");
      return;
    }

    // Update phone to new format
    await pool.query(
      'UPDATE "User" SET phone = $1, "updatedAt" = NOW() WHERE id = $2',
      ['+989121112225', user.id]
    );

    console.log("✅ شماره موبایل با موفقیت آپدیت شد:");
    console.log(`   از: ${user.phone}`);
    console.log(`   به: +989121112225`);
    console.log("");
    console.log("🎉 حالا می‌تونی با این اطلاعات وارد بشی:");
    console.log(`   شماره موبایل: 09121112225 یا +989121112225`);
    console.log(`   رمز عبور: 12345678`);

  } catch (error) {
    console.error("❌ خطا در آپدیت شماره موبایل:", error.message);
  } finally {
    await pool.end();
  }
}

fixStudentPhone();
