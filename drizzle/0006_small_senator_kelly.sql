CREATE TABLE IF NOT EXISTS "project_invitations" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"email" varchar(255) NOT NULL,
	"project_id" uuid NOT NULL,
	"expires" timestamp NOT NULL,
	"role" "project_user_role" DEFAULT 'member' NOT NULL,
	CONSTRAINT project_invitations_project_id_email PRIMARY KEY("project_id","email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_invitations" ADD CONSTRAINT "project_invitations_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
