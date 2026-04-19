"use client"

import Image from "next/image"
import { useId } from "react"
import { usePreferredMascotUrl } from "@/hooks/use-preferred-mascot-url"
import { BRAND_MASCOT_PNG_PATH } from "@/lib/brand/brand-assets"

export type GacharooMascotMarkProps = {
	className?: string
	/** When true, hide from assistive tech (parent supplies the label). */
	decorative?: boolean
	/** Accessibility label when not decorative */
	"aria-label"?: string
}

/**
 * Mascot mark: prefers committed Nano Banana 2 PNG when present, else inline SVG fallback.
 */
export function GacharooMascotMark({
	className,
	decorative = false,
	"aria-label": ariaLabel,
}: GacharooMascotMarkProps) {
	const uid = useId().replace(/:/g, "")
	const packGradId = `gacharoo-pack-${uid}`
	const holoGradId = `gacharoo-holo-${uid}`
	const { url, onRasterError } = usePreferredMascotUrl()

	const wrapperClass = `relative inline-block ${className ?? ""}`.trim()

	if (url === BRAND_MASCOT_PNG_PATH) {
		return (
			<span className={wrapperClass} aria-hidden={decorative ? true : undefined}>
				<Image
					src={BRAND_MASCOT_PNG_PATH}
					alt={decorative ? "" : (ariaLabel ?? "Gacharoo")}
					fill
					className="object-contain"
					sizes="120px"
					unoptimized
					onError={onRasterError}
				/>
			</span>
		)
	}

	const a11y = decorative
		? { "aria-hidden": true as const }
		: { role: "img" as const, "aria-label": ariaLabel ?? "Gacharoo" }

	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" className={className} {...a11y}>
			<title>{decorative ? "Gacharoo mascot illustration" : (ariaLabel ?? "Gacharoo")}</title>
			<defs>
				<linearGradient id={packGradId} x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" style={{ stopColor: "#a78bfa", stopOpacity: 1 }} />
					<stop offset="55%" style={{ stopColor: "#7c3aed", stopOpacity: 1 }} />
					<stop offset="100%" style={{ stopColor: "#4c1d95", stopOpacity: 1 }} />
				</linearGradient>
				<linearGradient id={holoGradId} x1="0%" y1="0%" x2="100%" y2="0%">
					<stop offset="0%" style={{ stopColor: "#fbbf24", stopOpacity: 0.35 }} />
					<stop offset="40%" style={{ stopColor: "#22d3ee", stopOpacity: 0.55 }} />
					<stop offset="100%" style={{ stopColor: "#c084fc", stopOpacity: 0.4 }} />
				</linearGradient>
			</defs>
			<ellipse cx="34" cy="38" rx="14" ry="22" fill="#7c3aed" transform="rotate(-18 34 38)" />
			<ellipse cx="58" cy="52" rx="32" ry="28" fill="#8b5cf6" />
			<ellipse cx="82" cy="34" rx="12" ry="20" fill="#a78bfa" transform="rotate(22 82 34)" />
			<ellipse cx="52" cy="58" rx="18" ry="14" fill="#c4b5fd" />
			<ellipse cx="38" cy="56" rx="7" ry="6" fill="#1e1b4b" />
			<circle cx="70" cy="48" r="6" fill="#fafafa" />
			<circle cx="71" cy="47" r="2.5" fill="#312e81" />
			<rect x="44" y="68" width="52" height="44" rx="10" fill={`url(#${packGradId})`} />
			<rect
				x="46"
				y="70"
				width="48"
				height="40"
				rx="8"
				fill="none"
				stroke={`url(#${holoGradId})`}
				strokeWidth="3"
				opacity={0.9}
			/>
			<path d="M70 70 L70 108" stroke="#ddd6fe" strokeWidth="1.5" strokeOpacity={0.5} />
			<path
				d="M88 78 L90 86 L98 84 L92 90 L96 98 L88 92 L82 100 L84 90 L76 88 L84 84 Z"
				fill="#fbbf24"
				opacity={0.95}
			/>
		</svg>
	)
}
