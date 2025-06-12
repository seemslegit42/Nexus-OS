
import { pgTable, serial, text, varchar, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  fullName: text('full_name'),
  email: varchar('email', { length: 256 }).unique().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
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
