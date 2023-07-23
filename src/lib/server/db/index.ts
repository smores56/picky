import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { env } from "$env/dynamic/private";
import * as schema from "$lib/server/db/schema";

// for migrations
if (env.DATABASE_URL) {
  const migrationClient = postgres(env.DATABASE_URL, { max: 1 });
  migrate(drizzle(migrationClient), {
    migrationsFolder: "src/lib/server/db/migrations/"
  });
}

// for query purposes
const queryClient = postgres(env.DATABASE_URL);
export const db = drizzle(queryClient, { schema });
