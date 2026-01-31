-- Add DiscountCode model

CREATE TABLE "DiscountCode" (
  "id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "percent" INTEGER NOT NULL,
  "expiresAt" TIMESTAMP(3),
  "usageLimit" INTEGER,
  "usedCount" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "DiscountCode_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DiscountCode_code_key" ON "DiscountCode"("code");
CREATE INDEX "DiscountCode_code_idx" ON "DiscountCode"("code");
CREATE INDEX "DiscountCode_expiresAt_idx" ON "DiscountCode"("expiresAt");
CREATE INDEX "DiscountCode_isActive_idx" ON "DiscountCode"("isActive");

-- Add foreign key
ALTER TABLE "DiscountCode" ADD CONSTRAINT "DiscountCode_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
