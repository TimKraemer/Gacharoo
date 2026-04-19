import { GacharooMascotMark } from "@/components/brand/gacharoo-mascot-mark"
import { BRAND_MARK_TAILWIND } from "@/lib/brand/brand-assets"

export type GacharooLogoLockupProps = {
	/** Full lockup description for assistive tech */
	lockupAriaLabel: string
	appName: string
	tagline?: string
	taglineClassName?: string
	nameClassName?: string
	mascotClassName?: string
	className?: string
	/** `dark` optimizes typography for zinc / game canvases (demo, pack scenes). */
	tone?: "default" | "dark"
}

export function GacharooLogoLockup({
	lockupAriaLabel,
	appName,
	tagline,
	taglineClassName,
	nameClassName,
	mascotClassName,
	className,
	tone = "default",
}: GacharooLogoLockupProps) {
	const resolvedTaglineClass =
		taglineClassName ?? (tone === "dark" ? "text-violet-300/80" : "text-muted-foreground")
	const resolvedNameClass = nameClassName ?? (tone === "dark" ? "text-zinc-100" : "text-foreground")
	const resolvedMascotClass =
		mascotClassName ??
		(tone === "dark"
			? BRAND_MARK_TAILWIND.lockupCompact
			: "h-16 w-16 shrink-0 drop-shadow-[0_0_18px_rgba(139,92,246,0.45)] md:h-20 md:w-20")

	return (
		<section className={className} aria-label={lockupAriaLabel}>
			<div className="flex flex-wrap items-center gap-4">
				<GacharooMascotMark decorative className={resolvedMascotClass} />
				<div className="min-w-0 text-left">
					{tagline ? (
						<p className={`text-xs uppercase tracking-[0.2em] ${resolvedTaglineClass}`}>
							{tagline}
						</p>
					) : null}
					<p
						className={`font-display text-4xl leading-none tracking-tight md:text-5xl ${resolvedNameClass}`}
					>
						{appName}
					</p>
				</div>
			</div>
		</section>
	)
}
