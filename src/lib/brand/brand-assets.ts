/**
 * Canonical brand asset URLs and sizing guidance for logo, favicon, and default avatars.
 * Keep paths aligned with `public/brand/` and metadata in `src/app/layout.tsx`.
 */

/** Primary vector mark (mascot + holo pack); safe for favicon, PWA, and small UI chrome. */
export const BRAND_MASCOT_SVG_PATH = "/brand/gacharoo-mascot.svg" as const

/** Optional Nano Banana 2 raster mascot; commit after `bun run brand:generate` with `FAL_KEY`. */
export const BRAND_MASCOT_PNG_PATH = "/brand/gacharoo-mascot.png" as const

/**
 * Minimum on-screen size for the mascot mark when it is the only branded control
 * (e.g. header home control). Prefer 44px+ for touch targets.
 */
export const BRAND_MARK_MIN_TOUCH_PX = 44

/** Suggested Tailwind class bundles for the inline `GacharooMascotMark` in lockups. */
export const BRAND_MARK_TAILWIND = {
	/** Dense headers / toolbars */
	lockupCompact: "h-14 w-14 shrink-0 drop-shadow-[0_0_16px_rgba(139,92,246,0.55)] md:h-16 md:w-16",
	/** Marketing hero */
	lockupHero: "h-16 w-16 shrink-0 drop-shadow-[0_0_18px_rgba(139,92,246,0.45)] md:h-20 md:w-20",
} as const
