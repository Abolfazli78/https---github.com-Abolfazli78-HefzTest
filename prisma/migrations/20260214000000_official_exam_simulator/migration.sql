-- CreateTable
CREATE TABLE "OfficialExam" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "degree" INTEGER NOT NULL,
    "juzStart" INTEGER NOT NULL,
    "juzEnd" INTEGER NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OfficialExam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfficialExamQuestion" (
    "id" TEXT NOT NULL,
    "officialExamId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "juz" INTEGER NOT NULL,
    "questionKind" TEXT NOT NULL,

    CONSTRAINT "OfficialExamQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SimulatorAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "officialExamId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "correctAnswers" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedAt" TIMESTAMP(3),

    CONSTRAINT "SimulatorAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OfficialExam_isActive_idx" ON "OfficialExam"("isActive");

-- CreateIndex
CREATE INDEX "OfficialExam_year_idx" ON "OfficialExam"("year");

-- CreateIndex
CREATE INDEX "OfficialExamQuestion_officialExamId_idx" ON "OfficialExamQuestion"("officialExamId");

-- CreateIndex
CREATE INDEX "OfficialExamQuestion_questionId_idx" ON "OfficialExamQuestion"("questionId");

-- CreateIndex
CREATE INDEX "SimulatorAttempt_userId_idx" ON "SimulatorAttempt"("userId");

-- CreateIndex
CREATE INDEX "SimulatorAttempt_officialExamId_idx" ON "SimulatorAttempt"("officialExamId");

-- AddForeignKey
ALTER TABLE "OfficialExamQuestion" ADD CONSTRAINT "OfficialExamQuestion_officialExamId_fkey" FOREIGN KEY ("officialExamId") REFERENCES "OfficialExam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfficialExamQuestion" ADD CONSTRAINT "OfficialExamQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimulatorAttempt" ADD CONSTRAINT "SimulatorAttempt_officialExamId_fkey" FOREIGN KEY ("officialExamId") REFERENCES "OfficialExam"("id") ON DELETE CASCADE ON UPDATE CASCADE;
