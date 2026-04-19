import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { GacharooLogoLockup } from "@/components/brand/gacharoo-logo-lockup"
import { MarketingShell } from "@/components/layout/marketing-shell"
import { SiteHeader } from "@/components/layout/site-header"

export default async function HomePage() {
	const t = await getTranslations("common")
	const tb = await getTranslations("brand")

	return (
		<MarketingShell>
			<SiteHeader />
			<main className="flex flex-1 flex-col items-center justify-center px-4 py-12 md:px-8">
				<div className="max-w-2xl space-y-8 text-center">
					<GacharooLogoLockup
						className="flex justify-center"
						lockupAriaLabel={tb("logoLockupAriaLabel")}
						appName={t("appName")}
					/>
					<p className="text-lg text-muted-foreground md:text-xl">{tb("homeSubtitle")}</p>
					<p className="text-sm text-muted-foreground/90">{tb("homeLayoutHint")}</p>
					<div className="flex flex-wrap justify-center gap-4 pt-2">
						<Link
							href="/demo"
							className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
						>
							{tb("tryDemo")}
						</Link>
						<a
							href="https://github.com/gacharoo"
							className="inline-flex min-h-11 items-center justify-center rounded-lg border border-input px-6 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
							rel="noopener noreferrer"
							target="_blank"
						>
							{tb("openSource")}
						</a>
					</div>
				</div>
			</main>
		</MarketingShell>
	)
}
