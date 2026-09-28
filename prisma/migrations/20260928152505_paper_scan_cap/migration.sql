-- CreateTable
CREATE TABLE "PaperScan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaperScan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PaperScan_userId_createdAt_idx" ON "PaperScan"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "PaperScan" ADD CONSTRAINT "PaperScan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

