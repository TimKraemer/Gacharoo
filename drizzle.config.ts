import { defineConfig } from "drizzle-kit"

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
	throw new Error("DATABASE_URL is required for drizzle-kit")
}

export default defineConfig({
	schema: "./src/lib/db/schema/index.ts",
	out: "./src/lib/db/migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: databaseUrl,
	},
})
