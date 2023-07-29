ALTER TYPE "link_training_status" ADD VALUE 'failed';--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "type" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "pages" ALTER COLUMN "last_trained_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN IF EXISTS "refresh_token_expires_in";