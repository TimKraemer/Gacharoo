export const RARITY_TIERS = ["standard", "common", "uncommon", "rare", "epic", "legendary"] as const
export type Rarity = (typeof RARITY_TIERS)[number]

export const RARITY_CONFIG = {
	standard: { color: "gray", symbol: "—", haloChance: 0.02, label: "Standard" },
	common: { color: "gray", symbol: "●", haloChance: 0.02, label: "Common" },
	uncommon: { color: "emerald", symbol: "◆", haloChance: 0.05, label: "Uncommon" },
	rare: { color: "blue", symbol: "★", haloChance: 0.1, label: "Rare" },
	epic: { color: "purple", symbol: "★★", haloChance: 0.25, label: "Epic" },
	legendary: { color: "amber", symbol: "♛", haloChance: 0.5, label: "Legendary" },
} as const satisfies Record<
	Rarity,
	{ color: string; symbol: string; haloChance: number; label: string }
>

export const DEFAULT_PACK_WEIGHTS = {
	common: 60,
	uncommon: 25,
	rare: 10,
	epic: 4,
	legendary: 1,
} as const

export const ELEMENT_TYPES = ["blitz", "fortress", "swift"] as const
export type ElementType = (typeof ELEMENT_TYPES)[number]

export const ELEMENT_ADVANTAGE: Record<ElementType, ElementType> = {
	blitz: "swift",
	swift: "fortress",
	fortress: "blitz",
}

export const ELEMENT_MULTIPLIER = 1.3
