-- Questions read out of an uploaded PDF, one JSON entry per question.
--
-- Purely additive with a default, so every existing UploadedPaper row stays
-- valid: an empty array means "not scanned", and those papers keep working
-- exactly as before — sat with the PDF on screen and a typed answer sheet.
-- No backfill, no data loss, and safe to apply while the old code is running.
ALTER TABLE "UploadedPaper" ADD COLUMN     "questions" TEXT NOT NULL DEFAULT '[]';
