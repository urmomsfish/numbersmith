-- CreateTable
CREATE TABLE "GameRun" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mode" TEXT NOT NULL DEFAULT 'GAUNTLET',
    "status" TEXT NOT NULL DEFAULT 'IN_PROGRESS',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "score" INTEGER NOT NULL DEFAULT 0,
    "wave" INTEGER NOT NULL DEFAULT 1,
    "lives" INTEGER NOT NULL,
    "streak" INTEGER NOT NULL DEFAULT 0,
    "bestStreak" INTEGER NOT NULL DEFAULT 0,
    "answered" INTEGER NOT NULL DEFAULT 0,
    "correct" INTEGER NOT NULL DEFAULT 0,
    "servedIds" TEXT NOT NULL DEFAULT '[]',
    "pendingProblemId" TEXT,
    "pendingServedAt" TIMESTAMP(3),

    CONSTRAINT "GameRun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GameRun_userId_status_idx" ON "GameRun"("userId", "status");

-- CreateIndex
CREATE INDEX "GameRun_userId_score_idx" ON "GameRun"("userId", "score");

-- AddForeignKey
ALTER TABLE "GameRun" ADD CONSTRAINT "GameRun_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
