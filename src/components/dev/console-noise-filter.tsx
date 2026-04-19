"use client"

import { useEffect } from "react"

const THIRD_PARTY_NOISE_PATTERNS = [
	"THREE.THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.",
	"unsupported GPOS table",
	"unsupported GSUB table",
	"THREE.WebGLRenderer: Context Lost.",
]

function shouldSuppress(args: unknown[]) {
	for (const arg of args) {
		if (typeof arg !== "string") {
			continue
		}

		for (const pattern of THIRD_PARTY_NOISE_PATTERNS) {
			if (arg.includes(pattern)) {
				return true
			}
		}

		if (arg.includes("A tree hydrated but some attributes") && arg.includes("data-cursor-ref")) {
			return true
		}
	}

	return false
}

export function ConsoleNoiseFilter() {
	useEffect(() => {
		const originalError = console.error
		const originalWarn = console.warn
		const originalLog = console.log

		console.error = (...args: unknown[]) => {
			if (shouldSuppress(args)) {
				return
			}

			originalError(...args)
		}

		console.warn = (...args: unknown[]) => {
			if (shouldSuppress(args)) {
				return
			}

			originalWarn(...args)
		}

		console.log = (...args: unknown[]) => {
			if (shouldSuppress(args)) {
				return
			}

			originalLog(...args)
		}

		return () => {
			console.error = originalError
			console.warn = originalWarn
			console.log = originalLog
		}
	}, [])

	return null
}
