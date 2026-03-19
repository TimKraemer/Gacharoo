import { useTranslations } from "next-intl"

export default function HomePage() {
	const t = useTranslations("common")

	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-8">
			<div className="text-center space-y-6 max-w-2xl">
				<h1 className="font-display text-6xl md:text-8xl tracking-tight">{t("appName")}</h1>
				<p className="text-lg md:text-xl text-muted-foreground">
					Turn anything into a trading card game.
				</p>
				<div className="flex gap-4 justify-center pt-4">
					<a
						href="/demo"
						className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
					>
						Try the Demo
					</a>
					<a
						href="https://github.com/gacharoo"
						className="inline-flex items-center justify-center rounded-lg border border-input px-6 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
					>
						Open Source
					</a>
				</div>
			</div>
		</main>
	)
}
