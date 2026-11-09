-- A player's standing in a 3D world. One row per user per world.
CREATE TABLE "WorldSave" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "world" TEXT NOT NULL DEFAULT 'forgelands',
    "xp" INTEGER NOT NULL DEFAULT 0,
    "openedGates" TEXT NOT NULL DEFAULT '[]',
    "collectedShards" TEXT NOT NULL DEFAULT '[]',
    "litPillars" TEXT NOT NULL DEFAULT '[]',
    "pendingGate" TEXT,
    "pendingProblemId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorldSave_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "WorldSave_userId_world_key" ON "WorldSave"("userId", "world");

ALTER TABLE "WorldSave" ADD CONSTRAINT "WorldSave_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
