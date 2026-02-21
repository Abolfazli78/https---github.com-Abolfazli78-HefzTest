-- AlterTable (IF NOT EXISTS so safe if column already present)
ALTER TABLE "SubscriptionPlan" ADD COLUMN IF NOT EXISTS "examSimulatorEnabled" BOOLEAN NOT NULL DEFAULT false;
