#!/usr/bin/env bun
/**
 * Generates the primary mascot PNG via fal.ai **Nano Banana 2** (`fal-ai/nano-banana-2`).
 * Set `FAL_KEY` from https://fal.ai/dashboard — never commit keys.
 *
 * Default output (commit this file after review): `public/brand/gacharoo-mascot.png`
 *
 * Run: `FAL_KEY=... bun run brand:generate`
 * Optional wide banner: `FAL_KEY=... bun run scripts/generate-gacharoo-brand-assets.ts --wide`
 */
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"

const FAL_KEY = process.env.FAL_KEY
const MODEL_ID = "fal-ai/nano-banana-2"
const MASCOT_OUT = path.join(process.cwd(), "public", "brand", "gacharoo-mascot.png")
const WIDE_OUT_DIR = path.join(process.cwd(), "public", "brand", "fal-generated")

/** Emphasize real macropod anatomy + Gacharoo zinc/violet game UI harmony. */
const MASCOT_PROMPT =
	"Premium mobile gacha key art, NOT abstract shapes: a clearly recognizable red kangaroo (Macropus rufus) with long thick tail, upright ears, elongated snout, dark nose, visible forepaws, subtle pouch hint, friendly eyes. The kangaroo is holding a sealed trading-card booster pack with rainbow holographic foil reflections. Background deep charcoal #09090b with soft violet #7c3aed rim light and faint teal specular highlights matching a dark trading-card app UI. Full-body three-quarter view, strong readable silhouette, painterly PBR illustration, no text, no watermark, no human, square 1:1."

const WIDE_LOGO_PROMPT =
	"Wide 16:9 banner: same red kangaroo mascot identity holding holographic booster, deep charcoal and violet neon palette, premium gacha game marketing art, no text, no watermark."

type FalImage = { url?: string }

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

async function generateMascotPng() {
	const result = await falSubscribeJson({
		prompt: MASCOT_PROMPT,
		num_images: 1,
		aspect_ratio: "1:1",
		output_format: "png",
		resolution: "1K",
	})

	const url = result.images?.[0]?.url
	if (!url) {
		console.error("Unexpected fal response (mascot):", JSON.stringify(result, null, 2))
		process.exit(1)
	}

	await downloadToFile(url, MASCOT_OUT)
	console.log(`Wrote ${path.relative(process.cwd(), MASCOT_OUT)}`)
}

async function generateWidePng() {
	await mkdir(WIDE_OUT_DIR, { recursive: true })

	const result = await falSubscribeJson({
		prompt: WIDE_LOGO_PROMPT,
		num_images: 1,
		aspect_ratio: "16:9",
		output_format: "png",
		resolution: "1K",
	})

	const url = result.images?.[0]?.url
	if (!url) {
		console.error("Unexpected fal response (wide):", JSON.stringify(result, null, 2))
		process.exit(1)
	}

	const widePath = path.join(WIDE_OUT_DIR, "logo-wide.png")
	await downloadToFile(url, widePath)
	console.log(`Wrote ${path.relative(process.cwd(), widePath)}`)
}

async function main() {
	if (!FAL_KEY) {
		console.error("Missing FAL_KEY. Export a fal.ai API key and retry.")
		process.exit(1)
	}

	const wantsWide = process.argv.includes("--wide")

	await generateMascotPng()

	if (wantsWide) {
		await generateWidePng()
	}
}

await main()
