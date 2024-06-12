-- AlterTable
ALTER TABLE "Runs" ADD COLUMN "syncExternalId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Runs_eventId_syncExternalId_key" ON "Runs"("eventId", "syncExternalId");
