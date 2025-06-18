import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' }); // Ensure .env variables are loaded

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set.');
}

export default {
  schema: './src/lib/db/schema.ts',
  out: './src/lib/db/migrations',
  dialect: 'postgresql', // Corrected from 'driver' to 'dialect' for Drizzle Kit v0.20+
  dbCredentials: {
    url: process.env.DATABASE_URL, // Corrected from 'connectionString' to 'url'
  },
  verbose: true,
  strict: true,
} satisfies Config;
