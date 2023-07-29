DO $$ BEGIN
 CREATE TYPE "ChatbotUserRole" AS ENUM('owner', 'admin', 'member');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "link_training_status" AS ENUM('idle', 'training', 'trained');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "user_role" AS ENUM('admin', 'user');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" varchar(80) NOT NULL,
	"provider" varchar(80) NOT NULL,
	"provider_account_id" varchar(80) NOT NULL,
	"refresh_token" varchar(255),
	"access_token" varchar(255),
	"expires_at" integer,
	"refresh_token_expires_in" integer,
	"token_type" varchar(80),
	"scope" varchar(80),
	"id_token" varchar(255),
	"session_state" varchar(80)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chatbot_users" (
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"chatbot_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "ChatbotUserRole" DEFAULT 'member' NOT NULL,
	CONSTRAINT chatbot_users_chatbot_id_user_id PRIMARY KEY("chatbot_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chatbots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"name" varchar(32) NOT NULL,
	"slug" varchar(32) NOT NULL,
	"description" varchar(300)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "page_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"page_id" uuid NOT NULL,
	"content" varchar(2000) NOT NULL,
	"embedding" vector(1536) NOT NULL,
	"token_count" smallint NOT NULL,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"last_trained_at" timestamp(3),
	"url" varchar(255) NOT NULL,
	"chatbot_id" uuid NOT NULL,
	"metadata" jsonb,
	"training_status" "link_training_status" DEFAULT 'idle' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_token" varchar(255) NOT NULL,
	"user_id" uuid NOT NULL,
	"expires" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"name" varchar(80),
	"email" varchar(255) NOT NULL,
	"role" "user_role" DEFAULT 'user'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verification_tokens" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(64) NOT NULL,
	"expires" timestamp(3) NOT NULL,
	CONSTRAINT verification_tokens_identifier_token PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "accounts_provider_provider_account_id_index" ON "accounts" ("provider","provider_account_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "chatbots_slug_index" ON "chatbots" ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chatbots_name_index" ON "chatbots" ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "pages_chatbot_id_url_index" ON "pages" ("chatbot_id","url");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "sessions_session_token_index" ON "sessions" ("session_token");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_index" ON "users" ("email");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "verification_tokens_token_index" ON "verification_tokens" ("token");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chatbot_users" ADD CONSTRAINT "chatbot_users_chatbot_id_chatbots_id_fk" FOREIGN KEY ("chatbot_id") REFERENCES "chatbots"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chatbot_users" ADD CONSTRAINT "chatbot_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "page_sections" ADD CONSTRAINT "page_sections_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pages" ADD CONSTRAINT "pages_chatbot_id_chatbots_id_fk" FOREIGN KEY ("chatbot_id") REFERENCES "chatbots"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
