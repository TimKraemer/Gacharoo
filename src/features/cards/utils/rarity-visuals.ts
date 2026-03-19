import type { Rarity } from "@/types/rarity"
import { RARITY_CONFIG } from "@/types/rarity"

export const RARITY_BORDER_COLORS: Record<Rarity, string> = {
	standard: "#94a3b8",
	common: "#94a3b8",
	uncommon: "#34d399",
	rare: "#3b82f6",
	epic: "#a855f7",
	legendary: "#f59e0b",
}

export const RARITY_GLOW_COLORS: Record<Rarity, string> = {
	standard: "#64748b",
	common: "#64748b",
	uncommon: "#10b981",
	rare: "#2563eb",
	epic: "#9333ea",
	legendary: "#d97706",
}

export const RARITY_GLOW_INTENSITY: Record<Rarity, number> = {
	standard: 0,
	common: 0,
	uncommon: 0.3,
	rare: 0.6,
	epic: 1.0,
	legendary: 1.5,
}

export function getRaritySymbol(rarity: Rarity): string {
	return RARITY_CONFIG[rarity].symbol
}

export function getRarityLabel(rarity: Rarity): string {
	return RARITY_CONFIG[rarity].label
}
