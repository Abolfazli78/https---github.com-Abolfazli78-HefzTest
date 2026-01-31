-- Remove discountCode from Invitation model

ALTER TABLE "Invitation"
  DROP COLUMN IF EXISTS "discountCode";
