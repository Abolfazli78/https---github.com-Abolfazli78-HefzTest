-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- AlterTable
ALTER TABLE "SubscriptionPlan" ADD COLUMN     "maxExamsPerMonth" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "maxQuestionsPerMonth" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "maxStudentsAllowed" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "email" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
