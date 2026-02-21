-- CreateEnum
CREATE TYPE "QuestionKind" AS ENUM ('MEMORIZATION', 'CONCEPTS', 'BOTH');

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "questionKind" "QuestionKind" NOT NULL DEFAULT 'BOTH';
