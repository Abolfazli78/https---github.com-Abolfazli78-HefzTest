-- CreateTable
CREATE TABLE "UserExam" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "juzStart" INTEGER NOT NULL,
    "juzEnd" INTEGER NOT NULL,
    "year" INTEGER,
    "durationMinutes" INTEGER NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserExam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserExamQuestion" (
    "id" TEXT NOT NULL,
    "userExamId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "juz" INTEGER NOT NULL,
    "questionKind" TEXT NOT NULL,

    CONSTRAINT "UserExamQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserExam_userId_idx" ON "UserExam"("userId");

-- CreateIndex
CREATE INDEX "UserExamQuestion_userExamId_idx" ON "UserExamQuestion"("userExamId");

-- CreateIndex
CREATE INDEX "UserExamQuestion_questionId_idx" ON "UserExamQuestion"("questionId");

-- AddForeignKey
ALTER TABLE "UserExam" ADD CONSTRAINT "UserExam_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserExamQuestion" ADD CONSTRAINT "UserExamQuestion_userExamId_fkey" FOREIGN KEY ("userExamId") REFERENCES "UserExam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserExamQuestion" ADD CONSTRAINT "UserExamQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
