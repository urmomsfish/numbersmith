-- Lets a student attach a screenshot to a Smith AI message.
--
-- Purely additive: two nullable columns, no default, no backfill, no rewrite of
-- existing rows. Written by hand rather than generated, because `prisma migrate
-- dev` wanted to reset the database to build a shadow copy — this schema lives
-- on the production Neon instance and a reset would have destroyed it.
ALTER TABLE "AiChatMessage" ADD COLUMN "imageData" TEXT;
ALTER TABLE "AiChatMessage" ADD COLUMN "imageType" TEXT;
