-- AlterTable
ALTER TABLE "Question" ADD COLUMN "surahId" INTEGER;

-- CreateIndex
CREATE INDEX "Question_surahId_idx" ON "Question"("surahId");
