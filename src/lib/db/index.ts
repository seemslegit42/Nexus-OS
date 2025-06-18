import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema'; // Import all exports from schema.ts

if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL environment variable is not set. Please define it in your .env file. For Neon, this should be your Neon connection string.'
  );
}

// --- Neon Postgres Connection ---
// Neon requires SSL. Ensure your DATABASE_URL from .env includes ?sslmode=require or similar.
// Example Neon connection string format: postgresql://user:password@host.neon.tech/dbname?sslmode=require

const isProduction = process.env.NODE_ENV === 'production';

// Configure the connection pool.
// `pg.Pool` handles connection pooling automatically. Default settings are generally fine for Neon.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction
    ? { rejectUnauthorized: true } // In production, always verify the server's SSL certificate.
    : { rejectUnauthorized: false }, // In development, you might disable unauthorized certificate rejection for convenience if not using a local CA.
  // You can add other pool options here if needed, e.g., max, idleTimeoutMillis.
  // Refer to `pg.Pool` documentation for more options.
});

// Instantiate Drizzle ORM with the Neon-connected pool and your schema.
// The 'db' object will be typed based on your schema
// and provides access to all tables defined in schema.ts.
export const db = drizzle(pool, { schema });

// Optional: Test connection on startup (can be useful for debugging)
// pool.connect()
//   .then(() => console.log('Successfully connected to Neon Postgres database.'))
//   .catch(err => console.error('Error connecting to Neon Postgres database:', err));
