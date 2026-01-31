require('dotenv').config();
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('❌ DATABASE_URL is not set in environment.');
  process.exit(1);
}

const pool = new Pool({ connectionString });

async function fixEnumValues() {
  const client = await pool.connect();
  try {
    console.log('🔄 Ensuring enum values exist...');

    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type t
                       JOIN pg_enum e ON t.oid = e.enumtypid
                       WHERE t.typname = 'UserRole' AND e.enumlabel = 'INSTITUTE') THEN
          ALTER TYPE "UserRole" ADD VALUE 'INSTITUTE';
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_type t
                       JOIN pg_enum e ON t.oid = e.enumtypid
                       WHERE t.typname = 'UserRole' AND e.enumlabel = 'TEACHER') THEN
          ALTER TYPE "UserRole" ADD VALUE 'TEACHER';
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_type t
                       JOIN pg_enum e ON t.oid = e.enumtypid
                       WHERE t.typname = 'UserRole' AND e.enumlabel = 'STUDENT') THEN
          ALTER TYPE "UserRole" ADD VALUE 'STUDENT';
        END IF;
      END$$;
    `);

    console.log('🔄 Fixing old enum values...');

    const res1 = await client.query(`UPDATE "User" SET role = 'STUDENT' WHERE role = 'USER'`);
    console.log(`✓ Updated ${res1.rowCount} USER records to STUDENT`);

    const res2 = await client.query(`UPDATE "User" SET role = 'INSTITUTE' WHERE role = 'INSTITUTE_MANAGER'`);
    console.log(`✓ Updated ${res2.rowCount} INSTITUTE_MANAGER records to INSTITUTE`);

    console.log('✅ Enum value preparation completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

fixEnumValues();
