-- AlterTable
ALTER TABLE "Card" ADD COLUMN "qrCodeId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Card_qrCodeId_key" ON "Card"("qrCodeId");

-- CreateIndex
CREATE INDEX "Card_qrCodeId_idx" ON "Card"("qrCodeId");
