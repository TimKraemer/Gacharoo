"use client"

import { Environment } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { Suspense, useCallback, useRef, useState } from "react"
import type { Mesh } from "three"
import type { CardData } from "@/features/cards/types"
import type { RevealState } from "../types"
import { CardRevealStack } from "./card-reveal-stack"
import { PackMesh } from "./pack-mesh"

interface PackOpeningSceneProps {
	cards: CardData[]
	onComplete?: () => void
	onPackStart?: () => boolean
	className?: string
}

export function PackOpeningScene({
	cards,
	onComplete,
	onPackStart,
	className,
}: PackOpeningSceneProps) {
	const [revealState, setRevealState] = useState<RevealState>("sealed")
	const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set())
	const [nextRevealIndex, setNextRevealIndex] = useState(0)

	const handlePackTap = useCallback(() => {
		if (revealState !== "sealed") {
			return
		}

		if (onPackStart && !onPackStart()) {
			return
		}

		setRevealState("opening")
		window.setTimeout(() => setRevealState("dealing"), 260)
		window.setTimeout(() => setRevealState("revealing"), 1050)
	}, [onPackStart, revealState])

	const handleCardReveal = useCallback(
		(index: number) => {
			if (revealState !== "revealing" || index !== nextRevealIndex) {
				return
			}

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
			setNextRevealIndex(index + 1)
		},
		[cards.length, nextRevealIndex, onComplete, revealState],
	)
	const canRevealNext = revealState === "revealing" && nextRevealIndex < cards.length

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

					{revealState === "sealed" && <PackMesh onClick={handlePackTap} />}

					{(revealState === "dealing" ||
						revealState === "revealing" ||
						revealState === "complete") && (
						<CardRevealStack
							cards={cards}
							revealedIndices={revealedIndices}
							nextRevealIndex={nextRevealIndex}
							interactive={revealState === "revealing"}
							onCardClick={handleCardReveal}
						/>
					)}

					{revealState === "opening" && <OpeningFlash />}

					<Environment preset="night" />
				</Suspense>
			</Canvas>

			{/* UI Overlay */}
			<div className="absolute bottom-6 left-0 right-0 text-center">
				{revealState === "sealed" && (
					<div className="space-y-2">
						<p className="pointer-events-none text-muted-foreground text-sm animate-pulse">
							Tap to open pack
						</p>
						<button
							type="button"
							onClick={handlePackTap}
							className="rounded-lg bg-violet-500 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-400"
						>
							Open Pack
						</button>
					</div>
				)}
				{revealState === "opening" && (
					<p className="pointer-events-none text-amber-300 text-sm font-semibold tracking-wide uppercase animate-pulse">
						Ripping foil...
					</p>
				)}
				{revealState === "dealing" && (
					<p className="pointer-events-none text-violet-300 text-sm font-medium animate-pulse">
						Dealing cards...
					</p>
				)}
				{revealState === "revealing" && (
					<div className="space-y-2">
						<p className="pointer-events-none text-muted-foreground text-sm">
							Reveal cards in order ({revealedIndices.size}/{cards.length})
						</p>
						{canRevealNext && (
							<button
								type="button"
								onClick={() => handleCardReveal(nextRevealIndex)}
								className="rounded-lg bg-zinc-100 px-4 py-2 text-xs font-semibold text-zinc-950 hover:bg-zinc-300"
							>
								Reveal Next Card
							</button>
						)}
					</div>
				)}
				{revealState === "complete" && (
					<p className="pointer-events-none text-primary text-sm font-medium">
						All cards revealed!
					</p>
				)}
			</div>
		</div>
	)
}

function OpeningFlash() {
	const meshRef = useRef<Mesh>(null)

	useFrame(({ clock }) => {
		const mesh = meshRef.current
		if (!mesh) {
			return
		}

		const material = mesh.material
		if (!("opacity" in material)) {
			return
		}

		material.opacity = 0.28 + Math.sin(clock.elapsedTime * 16) * 0.2
	})

	return (
		<mesh ref={meshRef}>
			<sphereGeometry args={[0.5, 16, 16]} />
			<meshBasicMaterial color="#fbbf24" transparent opacity={0.4} />
		</mesh>
	)
}
