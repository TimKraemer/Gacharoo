"use client"

import { animate } from "animejs"
import { useLayoutEffect, useRef } from "react"

/**
 * Soft breathing glow on the marketing gradient (anime.js); static when reduced motion is on.
 */
export function AmbientVioletPulse() {
	const layerRef = useRef<HTMLDivElement>(null)

	useLayoutEffect(() => {
		const el = layerRef.current
		if (!el) {
			return
		}

		const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

		if (prefersReducedMotion) {
			el.style.opacity = "1"
			return
		}

		el.style.opacity = "0.92"

		const animation = animate(el, {
			opacity: [0.78, 1],
			scale: [1, 1.02],
			duration: 5400,
			ease: "inOutSine",
			loop: true,
			alternate: true,
		})

		return () => {
			animation.revert()
		}
	}, [])

	return (
		<div
			ref={layerRef}
			className="pointer-events-none absolute inset-x-0 top-0 h-80 origin-top bg-[radial-gradient(ellipse_at_top,_rgba(139,92,246,0.22),_transparent_55%)]"
			aria-hidden
		/>
	)
}
