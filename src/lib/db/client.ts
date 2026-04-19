import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

const connectionString =
	process.env.DATABASE_URL ??
	(process.env.GACHAROO_DATABASE_URL_FALLBACK === "1"
		? "postgresql://127.0.0.1:5432/gacharoo_build_placeholder"
		: undefined)

if (!connectionString) {
	throw new Error("DATABASE_URL environment variable is not set")
}

const connection = postgres(connectionString)
export const db = drizzle(connection, { schema })
