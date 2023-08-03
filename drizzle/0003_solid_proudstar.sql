ALTER TABLE "chatbot_users" DROP CONSTRAINT "chatbot_users_project_id_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "chatbot_users" DROP CONSTRAINT "chatbot_users_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "chatbot_users" RENAME TO "project_users";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_users" ADD CONSTRAINT "project_users_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_users" ADD CONSTRAINT "project_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
