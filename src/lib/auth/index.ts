import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { DEFAULT_GACHAROO_AVATAR_PATH } from "@/lib/brand/default-avatar"
import { db } from "@/lib/db/client"

export const auth = betterAuth({
	database: drizzleAdapter(db, { provider: "pg" }),
	databaseHooks: {
		user: {
			create: {
				before: async (user) => {
					if (user.image) {
						return
					}

					return {
						data: {
							...user,
							image: DEFAULT_GACHAROO_AVATAR_PATH,
						},
					}
				},
			},
		},
	},
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
