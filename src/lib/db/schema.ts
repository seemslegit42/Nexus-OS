// NexOS: Ultimate Unified Drizzle ORM Schema

import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  integer,
  jsonb,
  index,
  boolean,
  decimal,
  unique, // Import unique for composite unique constraints
} from 'drizzle-orm/pg-core';

// ---------- USERS & WORKSPACES ----------
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  fullName: text('full_name'), // Nullable
  email: varchar('email', { length: 256 })
    .unique('users_email_unique')
    .notNull(), // Unique email constraint
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const workspaces = pgTable(
  'workspaces',
  {
    id: serial('id').primaryKey(),
    ownerId: integer('owner_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  table => ({
    // Composite unique index to ensure workspace name is unique per owner
    unqNamePerOwner: unique('workspaces_name_owner_id_unique').on(
      table.name,
      table.ownerId
    ),
    // Index for foreign key
    ownerIdIdx: index('workspaces_owner_id_idx').on(table.ownerId),
  })
);

export const workspaceMembers = pgTable(
  'workspace_members',
  {
    id: serial('id').primaryKey(),
    workspaceId: integer('workspace_id')
      .references(() => workspaces.id, { onDelete: 'cascade' })
      .notNull(),
    userId: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    role: varchar('role', { length: 50 }).default('member').notNull(), // Role cannot be null
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  table => ({
    // Composite unique index to ensure a user is a member only once per workspace
    unqUserWorkspace: unique(
      'workspace_members_workspace_id_user_id_unique'
    ).on(table.workspaceId, table.userId),
    // Indexes for foreign keys
    workspaceIdIdx: index('workspace_members_workspace_id_idx').on(
      table.workspaceId
    ),
    userIdIdx: index('workspace_members_user_id_idx').on(table.userId),
  })
);

// ---------- PROJECTS ----------
export const projects = pgTable(
  'projects',
  {
    id: serial('id').primaryKey(),
    workspaceId: integer('workspace_id')
      .references(() => workspaces.id, { onDelete: 'cascade' })
      .notNull(),
    name: varchar('name', { length: 200 }).notNull(),
    description: text('description'), // Nullable
    status: varchar('status', { length: 50 }).default('active').notNull(), // Status cannot be null
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  table => ({
    // Composite unique index to ensure project name is unique per workspace
    unqNamePerWorkspace: unique('projects_name_workspace_id_unique').on(
      table.name,
      table.workspaceId
    ),
    // Indexes for foreign key and commonly queried column
    workspaceIdIdx: index('projects_workspace_id_idx').on(table.workspaceId),
    statusIdx: index('projects_status_idx').on(table.status),
  })
);

// ---------- DEPLOYED AGENTS & SESSIONS ----------
export const deployedAgentInstances = pgTable(
  'deployed_agent_instances',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    marketplaceAgentId: varchar('marketplace_agent_id', {
      length: 255,
    }).notNull(),
    instanceName: text('instance_name').notNull(),
    config: jsonb('config').default({}).notNull(), // Default to empty JSON object
    status: varchar('status', { length: 50 })
      .notNull()
      .default('pending_config'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    lastRunAt: timestamp('last_run_at'), // Nullable
    metadata: jsonb('metadata').default({}).notNull(), // Default to empty JSON object
  },
  table => ({
    // Indexes for foreign key and commonly queried columns
    userIdIndex: index('deployed_agent_user_id_idx').on(table.userId),
    marketplaceAgentIdIndex: index(
      'deployed_agent_marketplace_agent_id_idx'
    ).on(table.marketplaceAgentId),
    statusIdx: index('deployed_agent_status_idx').on(table.status),
  })
);

export const agentSessions = pgTable(
  'agent_sessions',
  {
    id: serial('id').primaryKey(),
    agentInstanceId: integer('agent_instance_id')
      .references(() => deployedAgentInstances.id, { onDelete: 'cascade' })
      .notNull(),
    sessionData: jsonb('session_data').default({}).notNull(), // Default to empty JSON object
    startedAt: timestamp('started_at').defaultNow().notNull(),
    endedAt: timestamp('ended_at'), // Nullable
  },
  table => ({
    // Index for foreign key
    agentInstanceIdIdx: index('agent_sessions_agent_instance_id_idx').on(
      table.agentInstanceId
    ),
  })
);

// ---------- LOOM STUDIO (VISUAL FLOWS) ----------
export const loomFlows = pgTable(
  'loom_flows',
  {
    id: serial('id').primaryKey(),
    projectId: integer('project_id')
      .references(() => projects.id, { onDelete: 'cascade' })
      .notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'), // Nullable
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  table => ({
    // Composite unique index to ensure flow name is unique per project
    unqNamePerProject: unique('loom_flows_name_project_id_unique').on(
      table.name,
      table.projectId
    ),
    // Index for foreign key
    projectIdIdx: index('loom_flows_project_id_idx').on(table.projectId),
  })
);

export const loomNodes = pgTable(
  'loom_nodes',
  {
    id: serial('id').primaryKey(),
    flowId: integer('flow_id')
      .references(() => loomFlows.id, { onDelete: 'cascade' })
      .notNull(),
    type: varchar('type', { length: 100 }).notNull(),
    position: jsonb('position').default({}).notNull(), // Position required
    data: jsonb('data').default({}).notNull(), // Node specific data required
  },
  table => ({
    // Index for foreign key and type
    flowIdIdx: index('loom_nodes_flow_id_idx').on(table.flowId),
    typeIdx: index('loom_nodes_type_idx').on(table.type),
  })
);

export const loomEdges = pgTable(
  'loom_edges',
  {
    id: serial('id').primaryKey(),
    flowId: integer('flow_id')
      .references(() => loomFlows.id, { onDelete: 'cascade' })
      .notNull(),
    sourceNodeId: integer('source_node_id')
      .references(() => loomNodes.id, { onDelete: 'cascade' })
      .notNull(), // Must have a source node
    targetNodeId: integer('target_node_id')
      .references(() => loomNodes.id, { onDelete: 'cascade' })
      .notNull(), // Must have a target node
    label: text('label'), // Nullable
  },
  table => ({
    // Composite unique index to prevent duplicate edges within a flow
    unqEdgePerFlow: unique('loom_edges_flow_source_target_unique').on(
      table.flowId,
      table.sourceNodeId,
      table.targetNodeId
    ),
    // Indexes for foreign keys
    flowIdIdx: index('loom_edges_flow_id_idx').on(table.flowId),
    sourceNodeIdIdx: index('loom_edges_source_node_id_idx').on(
      table.sourceNodeId
    ),
    targetNodeIdIdx: index('loom_edges_target_node_id_idx').on(
      table.targetNodeId
    ),
  })
);

// ---------- MARKETPLACE AGENTS ----------
export const marketplaceAgents = pgTable(
  'marketplace_agents',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 })
      .unique('marketplace_agents_name_unique')
      .notNull(), // Agent names should be unique
    description: text('description'), // Nullable
    configSchema: jsonb('config_schema').default({}).notNull(), // Schema for agent config required
    createdBy: integer('created_by').references(() => users.id, {
      onDelete: 'set null',
    }), // Nullable
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  table => ({
    // Index for foreign key
    createdByIdx: index('marketplace_agents_created_by_idx').on(
      table.createdBy
    ),
  })
);

// ---------- PROMPT LOGS & BILLING ----------
export const promptLogs = pgTable(
  'prompt_logs',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id, {
      onDelete: 'set null',
    }), // Nullable if system prompts or anonymous
    model: varchar('model', { length: 50 }).notNull(), // Model used should be tracked
    prompt: text('prompt').notNull(),
    response: text('response').notNull(),
    tokenUsage: integer('token_usage').notNull(),
    costUSD: decimal('cost_usd', { precision: 10, scale: 4 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  table => ({
    // Indexes for foreign key, model, and creation timestamp
    userIdIdx: index('prompt_logs_user_id_idx').on(table.userId),
    modelIdx: index('prompt_logs_model_idx').on(table.model),
    createdAtIdx: index('prompt_logs_created_at_idx').on(table.createdAt),
  })
);

// ---------- AUDIT LOGS ----------
export const auditLogs = pgTable(
  'audit_logs',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id, {
      onDelete: 'set null',
    }), // Nullable if system actions
    action: text('action').notNull(),
    metadata: jsonb('metadata').default({}).notNull(), // Default to empty JSON object
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  table => ({
    // Indexes for foreign key and action type
    userIdIdx: index('audit_logs_user_id_idx').on(table.userId),
    actionIdx: index('audit_logs_action_idx').on(table.action),
    createdAtIdx: index('audit_logs_created_at_idx').on(table.createdAt),
  })
);

// ---------- NOTIFICATIONS ----------
export const notifications = pgTable(
  'notifications',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(), // Notification must be for a user
    workspaceId: integer('workspace_id').references(() => workspaces.id, {
      onDelete: 'cascade',
    }), // Nullable for global notifications
    type: varchar('type', { length: 100 }).notNull(),
    message: text('message').notNull(),
    read: boolean('read').default(false).notNull(),
    metadata: jsonb('metadata').default({}).notNull(), // Default to empty JSON object
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  table => ({
    // Indexes for recipient, type, and read status for efficient querying
    userIdIdx: index('notifications_user_id_idx').on(table.userId),
    workspaceIdIdx: index('notifications_workspace_id_idx').on(
      table.workspaceId
    ),
    typeIdx: index('notifications_type_idx').on(table.type),
    readIdx: index('notifications_read_idx').on(table.read),
    createdAtIdx: index('notifications_created_at_idx').on(table.createdAt),
  })
);

// ---------- MICRO-APP REGISTRY ----------
export const microApps = pgTable(
  'micro_apps',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 })
      .unique('micro_apps_name_unique')
      .notNull(),
    slug: varchar('slug', { length: 255 })
      .unique('micro_apps_slug_unique')
      .notNull(),
    version: varchar('version', { length: 50 }).notNull(),
    description: text('description'), // Nullable
    visibility: varchar('visibility', { length: 50 })
      .default('public')
      .notNull(),
    createdBy: integer('created_by').references(() => users.id, {
      onDelete: 'set null',
    }), // Nullable
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  table => ({
    // Index for foreign key and visibility
    createdByIdx: index('micro_apps_created_by_idx').on(table.createdBy),
    visibilityIdx: index('micro_apps_visibility_idx').on(table.visibility),
  })
);

// ---------- AGENT EVENT LOGS ----------
export const agentEventLogs = pgTable(
  'agent_event_logs',
  {
    id: serial('id').primaryKey(),
    agentInstanceId: integer('agent_instance_id')
      .references(() => deployedAgentInstances.id, { onDelete: 'cascade' })
      .notNull(),
    eventType: varchar('event_type', { length: 100 }).notNull(),
    details: jsonb('details').default({}).notNull(), // Default to empty JSON object
    latencyMs: integer('latency_ms'), // Nullable
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  table => ({
    // Indexes for foreign key, event type and creation timestamp
    agentInstanceIdIdx: index('agent_event_logs_agent_instance_id_idx').on(
      table.agentInstanceId
    ),
    eventTypeIdx: index('agent_event_logs_event_type_idx').on(table.eventType),
    createdAtIdx: index('agent_event_logs_created_at_idx').on(table.createdAt),
  })
);

// ---------- RUNTIME ENVIRONMENTS ----------
export const runtimeEnvironments = pgTable(
  'runtime_environments',
  {
    id: serial('id').primaryKey(),
    agentInstanceId: integer('agent_instance_id')
      .references(() => deployedAgentInstances.id, { onDelete: 'cascade' })
      .notNull(),
    environmentData: jsonb('environment_data').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  table => ({
    // Index for foreign key
    agentInstanceIdIdx: index('runtime_environments_agent_instance_id_idx').on(
      table.agentInstanceId
    ),
  })
);

// ---------- PERMISSIONS / ROLES ----------
export const roles = pgTable('roles', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).unique('roles_name_unique').notNull(),
  description: text('description'), // Nullable
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const rolePermissions = pgTable(
  'role_permissions',
  {
    id: serial('id').primaryKey(),
    roleId: integer('role_id')
      .references(() => roles.id, { onDelete: 'cascade' })
      .notNull(),
    permission: varchar('permission', { length: 100 }).notNull(),
  },
  table => ({
    // Composite unique index to prevent duplicate permissions per role
    unqPermissionPerRole: unique(
      'role_permissions_role_id_permission_unique'
    ).on(table.roleId, table.permission),
    // Index for foreign key
    roleIdIdx: index('role_permissions_role_id_idx').on(table.roleId),
  })
);

// User-specific settings (moved from globalSettings for clarity)
export const userSettings = pgTable(
  'user_settings',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .unique('user_settings_user_id_unique')
      .notNull(), // One-to-one with users
    preferences: jsonb('preferences').default({}).notNull(),
    featureFlags: jsonb('feature_flags').default({}).notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  table => ({
    userIdIdx: index('user_settings_user_id_idx').on(table.userId),
  })
);

// Workspace-specific settings (moved from globalSettings for clarity)
export const workspaceSettings = pgTable(
  'workspace_settings',
  {
    id: serial('id').primaryKey(),
    workspaceId: integer('workspace_id')
      .references(() => workspaces.id, { onDelete: 'cascade' })
      .unique('workspace_settings_workspace_id_unique')
      .notNull(), // One-to-one with workspaces
    preferences: jsonb('preferences').default({}).notNull(),
    featureFlags: jsonb('feature_flags').default({}).notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  table => ({
    workspaceIdIdx: index('workspace_settings_workspace_id_idx').on(
      table.workspaceId
    ),
  })
);

// ---------- FILE UPLOADS ----------
export const fileUploads = pgTable(
  'file_uploads',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id, {
      onDelete: 'set null',
    }), // Nullable if uploaded by system/agent
    workspaceId: integer('workspace_id')
      .references(() => workspaces.id, { onDelete: 'cascade' })
      .notNull(), // Must belong to a workspace
    projectId: integer('project_id').references(() => projects.id, {
      onDelete: 'cascade',
    }), // Nullable if not project-specific
    filename: varchar('filename', { length: 255 }).notNull(),
    url: text('url').notNull(),
    mimeType: varchar('mime_type', { length: 100 }), // Nullable
    sizeBytes: integer('size_bytes'), // Nullable
    metadata: jsonb('metadata').default({}).notNull(), // Default to empty JSON object
    uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
  },
  table => ({
    // Indexes for foreign keys and common query points
    userIdIdx: index('file_uploads_user_id_idx').on(table.userId),
    workspaceIdIdx: index('file_uploads_workspace_id_idx').on(
      table.workspaceId
    ),
    projectIdIdx: index('file_uploads_project_id_idx').on(table.projectId),
    filenameIdx: index('file_uploads_filename_idx').on(table.filename),
    uploadedAtIdx: index('file_uploads_uploaded_at_idx').on(table.uploadedAt),
  })
);

// ---------- SYSTEM TASKS ----------
export const systemTasks = pgTable(
  'system_tasks',
  {
    id: serial('id').primaryKey(),
    taskType: varchar('task_type', { length: 100 }).notNull(),
    status: varchar('status', { length: 50 }).default('pending').notNull(),
    payload: jsonb('payload').default({}).notNull(), // Task payload required
    scheduledAt: timestamp('scheduled_at'), // Nullable
    startedAt: timestamp('started_at'), // Nullable
    completedAt: timestamp('completed_at'), // Nullable
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  table => ({
    // Indexes for task type and status for efficient queue management
    taskTypeIdx: index('system_tasks_task_type_idx').on(table.taskType),
    statusIdx: index('system_tasks_status_idx').on(table.status),
    createdAtIdx: index('system_tasks_created_at_idx').on(table.createdAt),
  })
);

// ---------- User-Workspace Role Mapping (for specific roles within a workspace, complementing workspaceMembers) ----------
// This table defines specific roles (e.g., 'admin', 'editor') that a user might have within a *particular* workspace, beyond their general membership status.
// If workspaceMembers already captures all role granularity, this might be redundant.
// However, if 'workspace_members.role' is a general status and 'userRoles' is for specific permission sets, then it's distinct.
// Given the existing `workspaceMembers` table with a `role` column, let's assume `userRoles`
// is intended for assigning predefined `roles` (from the `roles` table) to `users` potentially globally
// or for more specific scenarios not covered by `workspaceMembers`.
// If it's for global roles, `workspaceId` would be null. If it's for defining roles within a workspace, it's redundant with workspaceMembers.
// Let's refine based on the previous schema: `workspaceMembers` defines the *user's role within that workspace*.
// `userRoles` could define *global* user roles, or connect to a more granular permission system.
// Given `workspaceMembers` exists, and the new `roles` table, `userRoles` here seems to link users to *global* roles (where `workspaceId` would be null) or to *additional* roles within a workspace beyond their primary `workspaceMembers.role`.
// For clarity, I'll assume `userRoles` handles specific role assignments *from the roles table* to a user, potentially scoped to a workspace or globally.

export const userRoles = pgTable(
  'user_roles',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    // workspaceId can be null for global roles, or specific for workspace-scoped roles
    workspaceId: integer('workspace_id').references(() => workspaces.id, {
      onDelete: 'cascade',
    }),
    roleId: integer('role_id')
      .references(() => roles.id, { onDelete: 'cascade' })
      .notNull(),
  },
  table => ({
    // Composite unique index for user-role within a specific workspace or global scope
    // If workspaceId is null, it applies globally for that user and role.
    unqUserRoleScope: unique('user_roles_user_workspace_role_unique').on(
      table.userId,
      table.workspaceId,
      table.roleId
    ),
    // Indexes for foreign keys
    userIdIdx: index('user_roles_user_id_idx').on(table.userId),
    workspaceIdIdx: index('user_roles_workspace_id_idx').on(table.workspaceId),
    roleIdIdx: index('user_roles_role_id_idx').on(table.roleId),
  })
);
