import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts")

const nextConfig: NextConfig = {
	output: "standalone",
	allowedDevOrigins: ["127.0.0.1", "localhost"],
	images: {
		remotePatterns: [{ protocol: "https", hostname: "**" }],
	},
	serverExternalPackages: ["sharp"],
}

export default withNextIntl(nextConfig)
