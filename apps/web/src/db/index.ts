import { drizzle } from 'drizzle-orm/postgres-js';

import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not defined.');
}

export const db = drizzle({
  connection: { url: connectionString, prepare: false, max: 1 },
  casing: 'snake_case',
  schema,
});
