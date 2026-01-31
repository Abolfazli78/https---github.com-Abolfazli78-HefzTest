-- AlterTable
ALTER TABLE "SupportTicket" ADD COLUMN     "instituteId" TEXT,
ADD COLUMN     "recipientRole" "UserRole",
ADD COLUMN     "recipientUserId" TEXT;

-- CreateTable
CREATE TABLE "TicketParticipant" (
    "ticketId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TicketParticipant_pkey" PRIMARY KEY ("ticketId","userId")
);

-- CreateIndex
CREATE INDEX "TicketParticipant_userId_idx" ON "TicketParticipant"("userId");

-- CreateIndex
CREATE INDEX "SupportTicket_recipientUserId_idx" ON "SupportTicket"("recipientUserId");

-- CreateIndex
CREATE INDEX "SupportTicket_recipientRole_idx" ON "SupportTicket"("recipientRole");

-- CreateIndex
CREATE INDEX "SupportTicket_instituteId_idx" ON "SupportTicket"("instituteId");

-- AddForeignKey
ALTER TABLE "TicketParticipant" ADD CONSTRAINT "TicketParticipant_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "SupportTicket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketParticipant" ADD CONSTRAINT "TicketParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
