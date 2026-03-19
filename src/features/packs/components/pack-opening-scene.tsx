"use client"

import { useState, useCallback } from "react"
import { Canvas } from "@react-three/fiber"
import { Environment } from "@react-three/drei"
import { Suspense } from "react"
import { Card3D } from "@/features/cards/components/card-3d"
import type { CardData } from "@/features/cards/types"
import type { RevealState } from "../types"
import { PackMesh } from "./pack-mesh"
import { CardRevealStack } from "./card-reveal-stack"

interface PackOpeningSceneProps {
	cards: CardData[]
	onComplete?: () => void
	className?: string
}

export function PackOpeningScene({ cards, onComplete, className }: PackOpeningSceneProps) {
	const [revealState, setRevealState] = useState<RevealState>("sealed")
	const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set())

	const handlePackTap = useCallback(() => {
		if (revealState === "sealed") {
			setRevealState("opening")
			setTimeout(() => setRevealState("revealing"), 600)
		}
	}, [revealState])

	const handleCardReveal = useCallback(
		(index: number) => {
			setRevealedIndices((prev) => {
				const next = new Set(prev)
				next.add(index)
				if (next.size === cards.length) {
					setTimeout(() => {
						setRevealState("complete")
						onComplete?.()
					}, 500)
				}
				return next
			})
		},
		[cards.length, onComplete],
	)

	return (
		<div className={className}>
			<Canvas
				camera={{ position: [0, 0, 2.5], fov: 40 }}
				gl={{ antialias: true }}
				style={{ background: "transparent" }}
			>
				<Suspense fallback={null}>
					<ambientLight intensity={0.6} />
					<directionalLight position={[3, 5, 4]} intensity={0.8} castShadow />
					<pointLight position={[-3, 2, 2]} intensity={0.3} color="#818cf8" />

					{revealState === "sealed" && (
						<PackMesh onClick={handlePackTap} />
					)}

					{(revealState === "revealing" || revealState === "complete") && (
						<CardRevealStack
							cards={cards}
							revealedIndices={revealedIndices}
							onCardClick={handleCardReveal}
						/>
					)}

					{revealState === "opening" && <OpeningFlash />}

					<Environment preset="night" />
				</Suspense>
			</Canvas>

			{/* UI Overlay */}
			<div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
				{revealState === "sealed" && (
					<p className="text-muted-foreground text-sm animate-pulse">
						Tap to open pack
					</p>
				)}
				{revealState === "revealing" && (
					<p className="text-muted-foreground text-sm">
						Tap cards to reveal ({revealedIndices.size}/{cards.length})
					</p>
				)}
				{revealState === "complete" && (
					<p className="text-primary text-sm font-medium">
						All cards revealed!
					</p>
				)}
			</div>
		</div>
	)
}

function OpeningFlash() {
	return (
		<mesh>
			<sphereGeometry args={[0.5, 16, 16]} />
			<meshBasicMaterial color="#fbbf24" transparent opacity={0.6} />
		</mesh>
	)
}
