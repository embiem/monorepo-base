import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

export function createDbConnection(connectionString: string = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/development') {
  const queryClient = postgres(connectionString);
  return drizzle(queryClient, { schema });
}

// Export schema and types
export * from './schema';