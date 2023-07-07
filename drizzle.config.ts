import type { Config } from "drizzle-kit";


export default {
	schema: "./src/drizzle/schema.ts",
	out: "./src/drizzle/migrations",
	dbCredentials: {
		url: "file://./src/db/sqlite.db",
	},
} satisfies Config;
