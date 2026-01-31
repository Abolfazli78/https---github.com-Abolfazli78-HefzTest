-- Add phone-based auth fields + OTP table

-- 1) Add new enum for OTP purpose
DO $$ BEGIN
  CREATE TYPE "OtpPurpose" AS ENUM ('REGISTER', 'LOGIN', 'RESET_PASSWORD');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2) Add new columns to User (phone backfilled for existing rows)
ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "phone" TEXT,
  ADD COLUMN IF NOT EXISTS "phoneVerifiedAt" TIMESTAMP(3);

WITH numbered AS (
  SELECT "id", row_number() OVER (ORDER BY "id") AS rn
  FROM "User"
)
UPDATE "User" u
SET "phone" = '+98' || '999' || lpad(numbered.rn::text, 7, '0')
FROM numbered
WHERE u."id" = numbered."id"
  AND (u."phone" IS NULL OR u."phone" = '');

ALTER TABLE "User"
  ALTER COLUMN "phone" SET NOT NULL;

DO $$ BEGIN
  ALTER TABLE "User" ADD CONSTRAINT "User_phone_key" UNIQUE ("phone");
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3) Create PhoneOtp table
CREATE TABLE IF NOT EXISTS "PhoneOtp" (
  "id" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "codeHash" TEXT NOT NULL,
  "purpose" "OtpPurpose" NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "consumedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "PhoneOtp_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "PhoneOtp_phone_idx" ON "PhoneOtp"("phone");
CREATE INDEX IF NOT EXISTS "PhoneOtp_expiresAt_idx" ON "PhoneOtp"("expiresAt");
