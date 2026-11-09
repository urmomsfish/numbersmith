-- Meteor kinds, boss layers, forge charge and the perfect-wave counter.
-- All additive with defaults, so runs created before this migration keep
-- working: they read as plain STANDARD meteors with no charge.
ALTER TABLE "GameRun" ADD COLUMN     "charge" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "GameRun" ADD COLUMN     "waveMisses" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "GameRun" ADD COLUMN     "bossWave" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "GameRun" ADD COLUMN     "pendingKind" TEXT NOT NULL DEFAULT 'STANDARD';
ALTER TABLE "GameRun" ADD COLUMN     "pendingClockMs" INTEGER NOT NULL DEFAULT 60000;
ALTER TABLE "GameRun" ADD COLUMN     "bossLayersLeft" INTEGER NOT NULL DEFAULT 0;
