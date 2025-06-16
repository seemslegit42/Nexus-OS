CREATE TABLE IF NOT EXISTS "deployed_agent_instances" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"marketplace_agent_id" varchar(255) NOT NULL,
	"instance_name" text NOT NULL,
	"config" jsonb,
	"status" varchar(50) DEFAULT 'pending_config' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"last_run_at" timestamp,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" text,
	"email" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deployed_agent_instances" ADD CONSTRAINT "deployed_agent_instances_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "deployed_agent_user_id_idx" ON "deployed_agent_instances" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "deployed_agent_marketplace_agent_id_idx" ON "deployed_agent_instances" USING btree ("marketplace_agent_id");