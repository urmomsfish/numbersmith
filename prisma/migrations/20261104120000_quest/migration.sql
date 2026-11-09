-- The quest: a road, a hero with health, and something in the way.
--
-- All additive with defaults. `lives` gains a default so the quest engine can
-- stop writing it — the arcade's three-lives model is replaced by hp/maxHp,
-- but the column stays so existing finished runs still read back.
ALTER TABLE "GameRun" ALTER COLUMN "lives" SET DEFAULT 3;

ALTER TABLE "GameRun" ADD COLUMN     "phase" TEXT NOT NULL DEFAULT 'BATTLE';
ALTER TABLE "GameRun" ADD COLUMN     "region" TEXT NOT NULL DEFAULT 'EMBERWASTES';
ALTER TABLE "GameRun" ADD COLUMN     "road" TEXT NOT NULL DEFAULT '[]';
ALTER TABLE "GameRun" ADD COLUMN     "stepIndex" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "GameRun" ADD COLUMN     "hp" INTEGER NOT NULL DEFAULT 60;
ALTER TABLE "GameRun" ADD COLUMN     "maxHp" INTEGER NOT NULL DEFAULT 60;
ALTER TABLE "GameRun" ADD COLUMN     "gold" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "GameRun" ADD COLUMN     "relics" TEXT NOT NULL DEFAULT '[]';
ALTER TABLE "GameRun" ADD COLUMN     "enemyKey" TEXT;
ALTER TABLE "GameRun" ADD COLUMN     "enemyHp" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "GameRun" ADD COLUMN     "enemyMaxHp" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "GameRun" ADD COLUMN     "wardSpent" BOOLEAN NOT NULL DEFAULT false;
