import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { db } from "@/lib/db/client"

export const auth = betterAuth({
	database: drizzleAdapter(db, { provider: "pg" }),
	plugins: [nextCookies()],
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		...(process.env.GOOGLE_CLIENT_ID && {
			google: {
				clientId: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
			},
		}),
	},
})
