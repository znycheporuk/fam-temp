import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import * as schema from "~/drizzle/schema.server";


if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL env var is not defined");
}

const sqlite = new Database(process.env.DATABASE_URL);
export const db = drizzle(sqlite, {schema});

await migrate(db, {migrationsFolder: "./src/drizzle/migrations"});
