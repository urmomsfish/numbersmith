-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "altSolutions" TEXT NOT NULL DEFAULT '[]';

-- CreateTable
CREATE TABLE "ScratchWork" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScratchWork_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UploadedPaper" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "fileData" TEXT NOT NULL,
    "questionCount" INTEGER NOT NULL,
    "timeLimitMinutes" INTEGER NOT NULL,
    "answerKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UploadedPaper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UploadedPaperAttempt" (
    "id" TEXT NOT NULL,
    "paperId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "answers" TEXT NOT NULL DEFAULT '[]',
    "correctCount" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'IN_PROGRESS',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedAt" TIMESTAMP(3),

    CONSTRAINT "UploadedPaperAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ScratchWork_userId_problemId_key" ON "ScratchWork"("userId", "problemId");

-- CreateIndex
CREATE INDEX "UploadedPaper_userId_idx" ON "UploadedPaper"("userId");

-- CreateIndex
CREATE INDEX "UploadedPaperAttempt_userId_idx" ON "UploadedPaperAttempt"("userId");

-- AddForeignKey
ALTER TABLE "ScratchWork" ADD CONSTRAINT "ScratchWork_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScratchWork" ADD CONSTRAINT "ScratchWork_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UploadedPaper" ADD CONSTRAINT "UploadedPaper_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UploadedPaperAttempt" ADD CONSTRAINT "UploadedPaperAttempt_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "UploadedPaper"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UploadedPaperAttempt" ADD CONSTRAINT "UploadedPaperAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

