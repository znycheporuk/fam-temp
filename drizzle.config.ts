import type { Config } from "drizzle-kit";


export default {
	schema: "./src/drizzle/schema.server.ts",
	out: "./src/drizzle/migrations",
	dbCredentials: {
		url: process.env.DATABASE_URL || "./sqlite.db",
	},
} satisfies Config;
