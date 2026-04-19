#!/usr/bin/env bun
/**
 * Generates raster brand art via fal.ai **Nano Banana 2** (`fal-ai/nano-banana-2`).
 * Set `FAL_KEY` from https://fal.ai/dashboard — never commit keys.
 *
 * Outputs (gitignored): `public/brand/fal-generated/avatar.png`,
 * `public/brand/fal-generated/logo-wide.png`
 *
 * Run: `bun run scripts/generate-gacharoo-brand-assets.ts`
 */
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"

const FAL_KEY = process.env.FAL_KEY
const MODEL_ID = "fal-ai/nano-banana-2"
const OUT_DIR = path.join(process.cwd(), "public", "brand", "fal-generated")

const AVATAR_PROMPT =
	"Mascot character: cute stylized kangaroo holding a holographic trading card booster pack, violet and teal highlights, friendly vector-game style, centered, plain dark background, no text, no watermark area, square composition"

const WIDE_LOGO_PROMPT =
	"Wide logo banner: playful kangaroo plus floating holographic gacha booster pack, word-free mark suitable for a game called Gacharoo, purple and gold palette, dark background, horizontal 16:9, crisp edges, no text"

type FalImage = { url?: string; content_type?: string }

type FalResult = {
	images?: FalImage[]
}

async function falSubscribeJson(body: Record<string, unknown>): Promise<FalResult> {
	const response = await fetch(`https://fal.run/${MODEL_ID}`, {
		method: "POST",
		headers: {
			Authorization: `Key ${FAL_KEY}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	})

	const text = await response.text()
	let json: unknown
	try {
		json = JSON.parse(text) as unknown
	} catch {
		throw new Error(`fal.ai returned non-JSON (${response.status}): ${text.slice(0, 400)}`)
	}

	if (!response.ok) {
		throw new Error(`fal.ai error ${response.status}: ${text.slice(0, 600)}`)
	}

	return json as FalResult
}

async function downloadToFile(url: string, filePath: string) {
	const imageResponse = await fetch(url)
	if (!imageResponse.ok) {
		throw new Error(`Failed to download image: ${imageResponse.status}`)
	}

	const buffer = Buffer.from(await imageResponse.arrayBuffer())
	await writeFile(filePath, buffer)
}

async function main() {
	if (!FAL_KEY) {
		console.error("Missing FAL_KEY. Export a fal.ai API key and retry.")
		process.exit(1)
	}

	await mkdir(OUT_DIR, { recursive: true })

	const avatarResult = await falSubscribeJson({
		prompt: AVATAR_PROMPT,
		num_images: 1,
		aspect_ratio: "1:1",
		output_format: "png",
		resolution: "1K",
	})

	const avatarUrl = avatarResult.images?.[0]?.url
	if (!avatarUrl) {
		console.error("Unexpected fal response (avatar):", JSON.stringify(avatarResult, null, 2))
		process.exit(1)
	}

	await downloadToFile(avatarUrl, path.join(OUT_DIR, "avatar.png"))
	console.log(`Wrote ${path.relative(process.cwd(), path.join(OUT_DIR, "avatar.png"))}`)

	const wideResult = await falSubscribeJson({
		prompt: WIDE_LOGO_PROMPT,
		num_images: 1,
		aspect_ratio: "16:9",
		output_format: "png",
		resolution: "1K",
	})

	const wideUrl = wideResult.images?.[0]?.url
	if (!wideUrl) {
		console.error("Unexpected fal response (wide):", JSON.stringify(wideResult, null, 2))
		process.exit(1)
	}

	await downloadToFile(wideUrl, path.join(OUT_DIR, "logo-wide.png"))
	console.log(`Wrote ${path.relative(process.cwd(), path.join(OUT_DIR, "logo-wide.png"))}`)
}

await main()
