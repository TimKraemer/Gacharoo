"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { GacharooMascotMark } from "@/components/brand/gacharoo-mascot-mark"
export function SiteHeader() {
	const tBrand = useTranslations("brand")

	return (
		<header className="w-full border-b border-border/70 bg-background/75 backdrop-blur-md">
			<div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 md:px-8">
				<Link
					href="/"
					className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-primary outline-none ring-ring transition hover:text-primary/90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
					aria-label={tBrand("goHomeAriaLabel")}
				>
					<GacharooMascotMark
						decorative
						className="h-9 w-9 drop-shadow-[0_0_14px_rgba(139,92,246,0.45)]"
					/>
				</Link>
				<nav
					className="flex flex-wrap items-center justify-end gap-2"
					aria-label={tBrand("marketingNavAriaLabel")}
				>
					<Link
						href="/demo"
						className="inline-flex min-h-10 items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
					>
						{tBrand("tryDemo")}
					</Link>
					<Link
						href="https://github.com/gacharoo"
						className="inline-flex min-h-10 items-center justify-center rounded-lg border border-input px-4 py-2 text-sm font-medium transition hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
					>
						{tBrand("openSource")}
					</Link>
				</nav>
			</div>
		</header>
	)
}
