import type { ReactNode } from "react"
import { AmbientVioletPulse } from "@/components/motion/ambient-violet-pulse"

export type MarketingShellProps = {
	children: ReactNode
}

/**
 * Full-height marketing surface: soft violet ambient, subtle top glow, stacks with a sticky header.
 */
export function MarketingShell({ children }: MarketingShellProps) {
	return (
		<div className="relative flex min-h-screen flex-col bg-linear-to-b from-background via-background to-violet-950/25">
			<AmbientVioletPulse />
			<div className="relative z-10 flex min-h-0 flex-1 flex-col">{children}</div>
		</div>
	)
}
