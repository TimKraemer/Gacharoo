import type { CardData } from "@/features/cards/types"

export type PackType = "normal" | "golden" | "shimmer"

export interface PackResult {
	cards: CardData[]
	packType: PackType
	isGolden: boolean
}

export type RevealState = "sealed" | "opening" | "revealing" | "complete"
