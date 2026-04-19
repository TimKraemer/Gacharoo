"use client"

import { useCallback, useEffect, useState } from "react"
import { BRAND_MASCOT_PNG_PATH, BRAND_MASCOT_SVG_PATH } from "@/lib/brand/brand-assets"

/**
 * Prefer committed Nano Banana 2 PNG when `/brand/gacharoo-mascot.png` exists; otherwise SVG.
 * Uses a HEAD probe then falls back if the raster fails to decode in the browser.
 */
export function usePreferredMascotUrl(): {
	url: typeof BRAND_MASCOT_SVG_PATH | typeof BRAND_MASCOT_PNG_PATH
	onRasterError: () => void
} {
	const [url, setUrl] = useState<typeof BRAND_MASCOT_SVG_PATH | typeof BRAND_MASCOT_PNG_PATH>(
		BRAND_MASCOT_SVG_PATH,
	)

	const onRasterError = useCallback(() => {
		setUrl(BRAND_MASCOT_SVG_PATH)
	}, [])

	useEffect(() => {
		let cancelled = false

		void fetch(BRAND_MASCOT_PNG_PATH, { method: "HEAD" }).then(
			(res) => {
				if (!cancelled && res.ok) {
					setUrl(BRAND_MASCOT_PNG_PATH)
				}
			},
			() => {
				// ignore
			},
		)

		return () => {
			cancelled = true
		}
	}, [])

	return { url, onRasterError }
}
