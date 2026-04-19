import { getTranslations } from "next-intl/server"
import { GacharooLogoLockup } from "@/components/brand/gacharoo-logo-lockup"

export default async function HomePage() {
	const t = await getTranslations("common")
	const tb = await getTranslations("brand")

	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-8">
			<div className="max-w-2xl space-y-8 text-center">
				<GacharooLogoLockup
					className="flex justify-center"
					lockupAriaLabel={tb("logoLockupAriaLabel")}
					appName={t("appName")}
				/>
				<p className="text-lg text-muted-foreground md:text-xl">{tb("homeSubtitle")}</p>
				<div className="flex flex-wrap justify-center gap-4 pt-2">
					<a
						href="/demo"
						className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
					>
						{tb("tryDemo")}
					</a>
					<a
						href="https://github.com/gacharoo"
						className="inline-flex items-center justify-center rounded-lg border border-input px-6 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
					>
						{tb("openSource")}
					</a>
				</div>
			</div>
		</main>
	)
}
