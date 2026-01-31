-- Convert Invitation from email to phone and add discountCode

-- 1) Add new column phone and discountCode, drop email
ALTER TABLE "Invitation"
  ADD COLUMN IF NOT EXISTS "phone" TEXT,
  ADD COLUMN IF NOT EXISTS "discountCode" TEXT;

-- 2) Backfill phone with placeholder if needed (no existing invitations expected)
UPDATE "Invitation"
SET "phone" = '+989990000000'
WHERE "phone" IS NULL;

-- 3) Make phone NOT NULL
ALTER TABLE "Invitation"
  ALTER COLUMN "phone" SET NOT NULL;

-- 4) Drop email column
ALTER TABLE "Invitation"
  DROP COLUMN IF EXISTS "email";

-- 5) Recreate indexes
DROP INDEX IF EXISTS "Invitation_email_idx";
CREATE INDEX IF NOT EXISTS "Invitation_phone_idx" ON "Invitation"("phone");
CREATE INDEX IF NOT EXISTS "Invitation_senderId_idx" ON "Invitation"("senderId");
