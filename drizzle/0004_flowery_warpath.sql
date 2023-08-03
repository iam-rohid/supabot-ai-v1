DO $$ BEGIN
 CREATE TYPE "project_user_role" AS ENUM('owner', 'admin', 'member');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "project_users" ALTER COLUMN "role" SET DATA TYPE project_user_role;