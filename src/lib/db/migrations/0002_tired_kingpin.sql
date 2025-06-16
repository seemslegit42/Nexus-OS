CREATE TABLE IF NOT EXISTS "user_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"preferences" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"feature_flags" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_settings_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workspace_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"workspace_id" integer NOT NULL,
	"preferences" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"feature_flags" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "workspace_settings_workspace_id_unique" UNIQUE("workspace_id")
);
--> statement-breakpoint
DROP TABLE "global_settings";--> statement-breakpoint
ALTER TABLE "audit_logs" DROP CONSTRAINT "audit_logs_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "prompt_logs" DROP CONSTRAINT "prompt_logs_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "agent_event_logs" ALTER COLUMN "details" SET DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "agent_event_logs" ALTER COLUMN "details" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_sessions" ALTER COLUMN "session_data" SET DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "agent_sessions" ALTER COLUMN "session_data" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "audit_logs" ALTER COLUMN "action" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "audit_logs" ALTER COLUMN "metadata" SET DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "audit_logs" ALTER COLUMN "metadata" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "deployed_agent_instances" ALTER COLUMN "config" SET DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "deployed_agent_instances" ALTER COLUMN "config" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "deployed_agent_instances" ALTER COLUMN "metadata" SET DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "deployed_agent_instances" ALTER COLUMN "metadata" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "file_uploads" ALTER COLUMN "workspace_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "file_uploads" ALTER COLUMN "metadata" SET DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "file_uploads" ALTER COLUMN "metadata" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "loom_edges" ALTER COLUMN "source_node_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "loom_edges" ALTER COLUMN "target_node_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "loom_nodes" ALTER COLUMN "position" SET DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "loom_nodes" ALTER COLUMN "position" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "loom_nodes" ALTER COLUMN "data" SET DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "loom_nodes" ALTER COLUMN "data" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "marketplace_agents" ALTER COLUMN "config_schema" SET DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "marketplace_agents" ALTER COLUMN "config_schema" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "metadata" SET DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "metadata" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "prompt_logs" ALTER COLUMN "model" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "prompt_logs" ALTER COLUMN "prompt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "prompt_logs" ALTER COLUMN "response" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "prompt_logs" ALTER COLUMN "token_usage" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "prompt_logs" ALTER COLUMN "cost_usd" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "system_tasks" ALTER COLUMN "payload" SET DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "system_tasks" ALTER COLUMN "payload" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "workspace_members" ALTER COLUMN "role" SET DEFAULT 'member';--> statement-breakpoint
ALTER TABLE "workspace_members" ALTER COLUMN "role" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workspace_settings" ADD CONSTRAINT "workspace_settings_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_settings_user_id_idx" ON "user_settings" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "workspace_settings_workspace_id_idx" ON "workspace_settings" USING btree ("workspace_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "prompt_logs" ADD CONSTRAINT "prompt_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "agent_event_logs_agent_instance_id_idx" ON "agent_event_logs" USING btree ("agent_instance_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "agent_event_logs_event_type_idx" ON "agent_event_logs" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "agent_event_logs_created_at_idx" ON "agent_event_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "agent_sessions_agent_instance_id_idx" ON "agent_sessions" USING btree ("agent_instance_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_logs_user_id_idx" ON "audit_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_logs_action_idx" ON "audit_logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_logs_created_at_idx" ON "audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "deployed_agent_status_idx" ON "deployed_agent_instances" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "file_uploads_user_id_idx" ON "file_uploads" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "file_uploads_workspace_id_idx" ON "file_uploads" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "file_uploads_project_id_idx" ON "file_uploads" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "file_uploads_filename_idx" ON "file_uploads" USING btree ("filename");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "file_uploads_uploaded_at_idx" ON "file_uploads" USING btree ("uploaded_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "loom_edges_flow_id_idx" ON "loom_edges" USING btree ("flow_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "loom_edges_source_node_id_idx" ON "loom_edges" USING btree ("source_node_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "loom_edges_target_node_id_idx" ON "loom_edges" USING btree ("target_node_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "loom_flows_project_id_idx" ON "loom_flows" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "loom_nodes_flow_id_idx" ON "loom_nodes" USING btree ("flow_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "loom_nodes_type_idx" ON "loom_nodes" USING btree ("type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "marketplace_agents_created_by_idx" ON "marketplace_agents" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "micro_apps_created_by_idx" ON "micro_apps" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "micro_apps_visibility_idx" ON "micro_apps" USING btree ("visibility");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "notifications_user_id_idx" ON "notifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "notifications_workspace_id_idx" ON "notifications" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "notifications_type_idx" ON "notifications" USING btree ("type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "notifications_read_idx" ON "notifications" USING btree ("read");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "notifications_created_at_idx" ON "notifications" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "projects_workspace_id_idx" ON "projects" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "projects_status_idx" ON "projects" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "prompt_logs_user_id_idx" ON "prompt_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "prompt_logs_model_idx" ON "prompt_logs" USING btree ("model");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "prompt_logs_created_at_idx" ON "prompt_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "role_permissions_role_id_idx" ON "role_permissions" USING btree ("role_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "runtime_environments_agent_instance_id_idx" ON "runtime_environments" USING btree ("agent_instance_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "system_tasks_task_type_idx" ON "system_tasks" USING btree ("task_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "system_tasks_status_idx" ON "system_tasks" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "system_tasks_created_at_idx" ON "system_tasks" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_roles_user_id_idx" ON "user_roles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_roles_workspace_id_idx" ON "user_roles" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_roles_role_id_idx" ON "user_roles" USING btree ("role_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "workspace_members_workspace_id_idx" ON "workspace_members" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "workspace_members_user_id_idx" ON "workspace_members" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "workspaces_owner_id_idx" ON "workspaces" USING btree ("owner_id");--> statement-breakpoint
ALTER TABLE "loom_edges" ADD CONSTRAINT "loom_edges_flow_source_target_unique" UNIQUE("flow_id","source_node_id","target_node_id");--> statement-breakpoint
ALTER TABLE "loom_flows" ADD CONSTRAINT "loom_flows_name_project_id_unique" UNIQUE("name","project_id");--> statement-breakpoint
ALTER TABLE "marketplace_agents" ADD CONSTRAINT "marketplace_agents_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "micro_apps" ADD CONSTRAINT "micro_apps_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_name_workspace_id_unique" UNIQUE("name","workspace_id");--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_permission_unique" UNIQUE("role_id","permission");--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_workspace_role_unique" UNIQUE("user_id","workspace_id","role_id");--> statement-breakpoint
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_workspace_id_user_id_unique" UNIQUE("workspace_id","user_id");--> statement-breakpoint
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_name_owner_id_unique" UNIQUE("name","owner_id");