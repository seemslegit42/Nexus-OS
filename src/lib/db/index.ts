
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema'; // Import all exports from schema.ts

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set. Please define it in your .env file.');
}

// Neon typically requires SSL.
// For development, you might use rejectUnauthorized: false, but be cautious.
// For production, ensure you have proper CA certificate handling if not using a managed service that handles this.
const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: true } : { rejectUnauthorized: false }, // Adjust SSL based on environment
});

// The 'db' object will be typed based on your schema
// and provides access to all tables defined in schema.ts
export const db = drizzle(pool, { schema });
