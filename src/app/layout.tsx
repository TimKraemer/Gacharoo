import type { Metadata } from "next"
import { Bebas_Neue, DM_Sans } from "next/font/google"
import Script from "next/script"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"
import "./globals.css"

const displayFont = Bebas_Neue({
	subsets: ["latin"],
	weight: "400",
	variable: "--font-display",
})

const bodyFont = DM_Sans({
	subsets: ["latin"],
	variable: "--font-body",
})

export const metadata: Metadata = {
	title: "Gacharoo — Turn Anything Into a Card Game",
	description:
		"Create trading card sets from your friends, communities, or any data source. Collect, trade, and battle with 3D holographic cards.",
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const locale = await getLocale()
	const messages = await getMessages()

	return (
		<html lang={locale} className={`${displayFont.variable} ${bodyFont.variable}`}>
			<body className="font-body antialiased bg-background text-foreground min-h-screen">
				<NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
				{process.env.NEXT_PUBLIC_UMAMI_URL && process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
					<Script
						src={`${process.env.NEXT_PUBLIC_UMAMI_URL}/script.js`}
						data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
						strategy="afterInteractive"
					/>
				)}
			</body>
		</html>
	)
}
