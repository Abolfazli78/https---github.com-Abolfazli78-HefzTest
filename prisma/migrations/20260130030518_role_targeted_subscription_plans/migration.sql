-- CreateEnum
CREATE TYPE "PlanTargetRole" AS ENUM ('STUDENT', 'TEACHER', 'INSTITUTE');

-- AlterTable
ALTER TABLE "SubscriptionPlan" ADD COLUMN     "maxClassesAllowed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "maxTeachersAllowed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "targetRole" "PlanTargetRole" NOT NULL DEFAULT 'STUDENT';
