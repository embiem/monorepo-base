import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

export function createConnection(
  connectionString: string = process.env.DATABASE_URL ||
    "postgres://postgres:postgres@localhost:5432/development",
) {
  return drizzle({
    connection: {
      connectionString,
    },
  });
}

