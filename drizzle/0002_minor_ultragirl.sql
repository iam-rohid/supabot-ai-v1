ALTER TABLE "chatbot_users" DROP CONSTRAINT "chatbot_users_chatbot_id_chatbots_id_fk";
--> statement-breakpoint
ALTER TABLE "links" DROP CONSTRAINT "links_chatbot_id_chatbots_id_fk";
--> statement-breakpoint
ALTER TABLE "chatbots" RENAME TO "projects";--> statement-breakpoint
ALTER TABLE "chatbot_users" RENAME COLUMN "chatbot_id" TO "project_id";--> statement-breakpoint
ALTER TABLE "links" RENAME COLUMN "chatbot_id" TO "project_id";--> statement-breakpoint
ALTER TABLE "chatbot_users" DROP CONSTRAINT "chatbot_users_chatbot_id_user_id";--> statement-breakpoint
DROP INDEX IF EXISTS "links_chatbot_id_url_index";--> statement-breakpoint
DROP INDEX IF EXISTS "chatbots_slug_index";--> statement-breakpoint
DROP INDEX IF EXISTS "chatbots_name_index";--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "type" SET DATA TYPE varchar(80);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "links_project_id_url_index" ON "links" ("project_id","url");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "projects_slug_index" ON "projects" ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "projects_name_index" ON "projects" ("name");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chatbot_users" ADD CONSTRAINT "chatbot_users_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "links" ADD CONSTRAINT "links_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "chatbot_users" ADD CONSTRAINT "chatbot_users_project_id_user_id" PRIMARY KEY("project_id","user_id");