import fs from "node:fs"
import path from "node:path"
import { BRAND_MASCOT_PNG_PATH, BRAND_MASCOT_SVG_PATH } from "@/lib/brand/brand-assets"

/**
 * Prefer the fal-generated PNG mascot when present on disk (server-only consumers).
 */
export function getDefaultMascotPublicPath():
	| typeof BRAND_MASCOT_PNG_PATH
	| typeof BRAND_MASCOT_SVG_PATH {
	try {
		const absolutePng = path.join(process.cwd(), "public", "brand", "gacharoo-mascot.png")
		if (fs.existsSync(absolutePng)) {
			return BRAND_MASCOT_PNG_PATH
		}
	} catch {
		// Non-file environments (edge, tests): fall back to SVG.
	}
	return BRAND_MASCOT_SVG_PATH
}
