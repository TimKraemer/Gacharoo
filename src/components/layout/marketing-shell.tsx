import type { ReactNode } from "react"

export type MarketingShellProps = {
	children: ReactNode
}

/**
 * Full-height marketing surface: soft violet ambient, subtle top glow, stacks with a sticky header.
 */
export function MarketingShell({ children }: MarketingShellProps) {
	return (
		<div className="relative flex min-h-screen flex-col bg-linear-to-b from-background via-background to-violet-950/25">
			<div
				className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(ellipse_at_top,_rgba(139,92,246,0.22),_transparent_55%)]"
				aria-hidden
			/>
			<div className="relative z-10 flex min-h-0 flex-1 flex-col">{children}</div>
		</div>
	)
}
