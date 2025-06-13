
import { pgTable, serial, text, varchar, timestamp, integer, jsonb, index } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  fullName: text('full_name'),
  email: varchar('email', { length: 256 }).unique().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const deployedAgentInstances = pgTable('deployed_agent_instances', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  marketplaceAgentId: varchar('marketplace_agent_id', { length: 255 }).notNull(),
  instanceName: text('instance_name').notNull(),
  config: jsonb('config'), // Store instance-specific configuration as JSON
  status: varchar('status', { length: 50 }).notNull().default('pending_config'), // e.g., 'pending_config', 'active', 'inactive', 'error', 'deploying'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  lastRunAt: timestamp('last_run_at'),
  metadata: jsonb('metadata'), // For any other flexible data
}, (table) => {
  return {
    userIdIndex: index('deployed_agent_user_id_idx').on(table.userId),
    marketplaceAgentIdIndex: index('deployed_agent_marketplace_agent_id_idx').on(table.marketplaceAgentId),
  };
});

// Example of another table: items
// export const items = pgTable('items', {
//   id: serial('id').primaryKey(),
//   name: text('name').notNull(),
//   description: text('description'),
//   userId: integer('user_id').references(() => users.id), // Example foreign key
//   createdAt: timestamp('created_at').defaultNow().notNull(),
// });

// You can define more tables here as your application grows.
