-- CreateTable
CREATE TABLE "CardView" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "referrer" TEXT,
    "city" TEXT,
    "country" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CardView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardLinkClick" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "linkLabel" TEXT NOT NULL,
    "linkUrl" TEXT,
    "city" TEXT,
    "country" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CardLinkClick_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CardView_cardId_idx" ON "CardView"("cardId");

-- CreateIndex
CREATE INDEX "CardView_cardId_createdAt_idx" ON "CardView"("cardId", "createdAt");

-- CreateIndex
CREATE INDEX "CardView_cardId_visitorId_idx" ON "CardView"("cardId", "visitorId");

-- CreateIndex
CREATE INDEX "CardView_cardId_source_idx" ON "CardView"("cardId", "source");

-- CreateIndex
CREATE INDEX "CardLinkClick_cardId_idx" ON "CardLinkClick"("cardId");

-- CreateIndex
CREATE INDEX "CardLinkClick_cardId_createdAt_idx" ON "CardLinkClick"("cardId", "createdAt");

-- CreateIndex
CREATE INDEX "CardLinkClick_cardId_linkLabel_idx" ON "CardLinkClick"("cardId", "linkLabel");

-- AddForeignKey
ALTER TABLE "CardView" ADD CONSTRAINT "CardView_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardLinkClick" ADD CONSTRAINT "CardLinkClick_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;
