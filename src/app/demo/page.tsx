"use client"

import { useState } from "react"
import { CardScene } from "@/features/cards/components/card-scene"
import { PackOpeningScene } from "@/features/packs/components/pack-opening-scene"
import { DEMO_CARDS } from "@/features/packs/utils/demo-cards"
import type { CardData } from "@/features/cards/types"

export default function DemoPage() {
	const [mode, setMode] = useState<"card" | "pack">("pack")
	const [selectedCard, setSelectedCard] = useState<CardData>(DEMO_CARDS[0])
	const [packKey, setPackKey] = useState(0)

	const resetPack = () => setPackKey((k) => k + 1)

	return (
		<main className="min-h-screen bg-background">
			{/* Header */}
			<div className="flex items-center justify-between p-4 border-b border-border">
				<h1 className="font-display text-3xl">Gacharoo Demo</h1>
				<div className="flex gap-2">
					<button
						type="button"
						onClick={() => setMode("pack")}
						className={`px-4 py-2 rounded-lg text-sm transition-colors ${
							mode === "pack"
								? "bg-primary text-primary-foreground"
								: "bg-muted text-muted-foreground hover:text-foreground"
						}`}
					>
						Pack Opening
					</button>
					<button
						type="button"
						onClick={() => setMode("card")}
						className={`px-4 py-2 rounded-lg text-sm transition-colors ${
							mode === "card"
								? "bg-primary text-primary-foreground"
								: "bg-muted text-muted-foreground hover:text-foreground"
						}`}
					>
						Card Viewer
					</button>
				</div>
			</div>

			{/* 3D Scene */}
			{mode === "pack" && (
				<div className="relative h-[70vh]">
					<PackOpeningScene
						key={packKey}
						cards={DEMO_CARDS}
						onComplete={() => {}}
						className="w-full h-full"
					/>
					<button
						type="button"
						onClick={resetPack}
						className="absolute top-4 right-4 px-4 py-2 bg-muted/80 backdrop-blur rounded-lg text-sm hover:bg-muted transition-colors"
					>
						Reset Pack
					</button>
				</div>
			)}

			{mode === "card" && (
				<div className="relative h-[70vh]">
					<CardScene card={selectedCard} className="w-full h-full" />
				</div>
			)}

			{/* Card selector (card mode) */}
			{mode === "card" && (
				<div className="p-4">
					<h2 className="text-sm text-muted-foreground mb-3">Select a card:</h2>
					<div className="flex gap-2 flex-wrap">
						{DEMO_CARDS.map((card) => (
							<button
								key={card.id}
								type="button"
								onClick={() => setSelectedCard(card)}
								className={`px-3 py-2 rounded-lg text-sm transition-all ${
									selectedCard.id === card.id
										? "bg-primary text-primary-foreground scale-105"
										: "bg-muted text-muted-foreground hover:text-foreground"
								}`}
							>
								<span className="mr-1">
									{card.rarity === "legendary" ? "♛" : card.rarity === "epic" ? "★★" : card.rarity === "rare" ? "★" : card.rarity === "uncommon" ? "◆" : "●"}
								</span>
								{card.title}
								{card.isHolographic && " ✨"}
							</button>
						))}
					</div>
				</div>
			)}

			{/* Info footer */}
			<div className="p-4 border-t border-border">
				<p className="text-xs text-muted-foreground text-center">
					Gacharoo — Turn anything into a trading card game. This is a demo of the 3D card
					renderer and pack opening system.
				</p>
			</div>
		</main>
	)
}
