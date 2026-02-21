/*
  Warnings:

  - The values [BOTH] on the enum `QuestionKind` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "QuestionKind_new" AS ENUM ('MEMORIZATION', 'CONCEPTS');
ALTER TABLE "public"."Question" ALTER COLUMN "questionKind" DROP DEFAULT;
ALTER TABLE "Question" ALTER COLUMN "questionKind" TYPE "QuestionKind_new" USING ("questionKind"::text::"QuestionKind_new");
ALTER TYPE "QuestionKind" RENAME TO "QuestionKind_old";
ALTER TYPE "QuestionKind_new" RENAME TO "QuestionKind";
DROP TYPE "public"."QuestionKind_old";
ALTER TABLE "Question" ALTER COLUMN "questionKind" SET DEFAULT 'CONCEPTS';
COMMIT;

-- AlterTable
ALTER TABLE "Question" ALTER COLUMN "questionKind" SET DEFAULT 'CONCEPTS';
