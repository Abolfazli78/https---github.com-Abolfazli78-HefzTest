-- DropIndex
DROP INDEX IF EXISTS "Question_surah_idx";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN IF EXISTS "surah";
