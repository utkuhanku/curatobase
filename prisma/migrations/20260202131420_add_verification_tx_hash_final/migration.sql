/*
  Warnings:

  - A unique constraint covering the columns `[verificationTxHash]` on the table `RewardEvent` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "RewardEvent" ADD COLUMN "verificationTxHash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "RewardEvent_verificationTxHash_key" ON "RewardEvent"("verificationTxHash");
