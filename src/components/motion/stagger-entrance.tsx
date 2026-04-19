"use client"

import { animate, stagger } from "animejs"
import { type ReactNode, useLayoutEffect, useRef } from "react"

export type StaggerEntranceProps = {
	children: ReactNode
	className?: string
}

const ENTRANCE_SELECTOR = "[data-enter]"

/**
 * Staggers fade/slide-in for descendants marked with `data-enter` (anime.js v4).
 */
export function StaggerEntrance({ children, className }: StaggerEntranceProps) {
	const rootRef = useRef<HTMLDivElement>(null)

	useLayoutEffect(() => {
		const root = rootRef.current
		if (!root) {
			return
		}

		const targets = root.querySelectorAll<HTMLElement>(ENTRANCE_SELECTOR)
		if (!targets.length) {
			return
		}

		const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

		if (prefersReducedMotion) {
			for (const el of targets) {
				el.style.opacity = "1"
				el.style.transform = ""
			}
			return
		}

		for (const el of targets) {
			el.style.opacity = "0"
			el.style.transform = "translateY(14px)"
		}

		const animation = animate(targets, {
			opacity: [0, 1],
			y: [14, 0],
			duration: 780,
			ease: "outExpo",
			delay: stagger(95, { start: 60 }),
		})

		return () => {
			animation.revert()
		}
	}, [])

	return (
		<div ref={rootRef} className={className}>
			{children}
		</div>
	)
}
