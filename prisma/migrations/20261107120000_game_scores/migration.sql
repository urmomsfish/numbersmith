-- The 3D world it belonged to was removed; nothing reads this table.
DROP TABLE IF EXISTS "WorldSave";

-- One row per user per game per variant. See the GameScore model comment.
CREATE TABLE "GameScore" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "game" TEXT NOT NULL,
    "variant" TEXT NOT NULL DEFAULT 'default',
    "bestScore" INTEGER NOT NULL DEFAULT 0,
    "plays" INTEGER NOT NULL DEFAULT 0,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "totalXp" INTEGER NOT NULL DEFAULT 0,
    "state" TEXT NOT NULL DEFAULT '{}',
    "lastPlayedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameScore_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "GameScore_userId_game_variant_key" ON "GameScore"("userId", "game", "variant");
CREATE INDEX "GameScore_userId_idx" ON "GameScore"("userId");
CREATE INDEX "GameScore_game_bestScore_idx" ON "GameScore"("game", "bestScore");

ALTER TABLE "GameScore" ADD CONSTRAINT "GameScore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
