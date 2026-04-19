import { GacharooMascotMark } from "@/components/brand/gacharoo-mascot-mark"

export type GacharooLogoLockupProps = {
	/** Full lockup description for assistive tech */
	lockupAriaLabel: string
	appName: string
	tagline?: string
	taglineClassName?: string
	nameClassName?: string
	mascotClassName?: string
	className?: string
}

export function GacharooLogoLockup({
	lockupAriaLabel,
	appName,
	tagline,
	taglineClassName = "text-muted-foreground",
	nameClassName = "text-foreground",
	mascotClassName,
	className,
}: GacharooLogoLockupProps) {
	return (
		<section className={className} aria-label={lockupAriaLabel}>
			<div className="flex flex-wrap items-center gap-4">
				<GacharooMascotMark
					decorative
					className={
						mascotClassName ??
						"h-16 w-16 shrink-0 drop-shadow-[0_0_18px_rgba(139,92,246,0.45)] md:h-20 md:w-20"
					}
				/>
				<div className="min-w-0 text-left">
					{tagline ? (
						<p className={`text-xs uppercase tracking-[0.2em] ${taglineClassName}`}>{tagline}</p>
					) : null}
					<p
						className={`font-display text-4xl leading-none tracking-tight md:text-5xl ${nameClassName}`}
					>
						{appName}
					</p>
				</div>
			</div>
		</section>
	)
}
