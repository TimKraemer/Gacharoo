import type { ElementType, Rarity } from "@/types/rarity"

export interface CardData {
	id: string
	title: string
	imageUrl: string | null
	description: string | null
	flavorText: string | null
	stats: {
		atk: number
		def: number
		spd: number
		hp: number
	}
	rarity: Rarity
	elementType: ElementType | null
	isHolographic: boolean
	superlative: string | null
}
