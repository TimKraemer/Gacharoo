"use client"

import { useMemo } from "react"
import { useSpring, animated } from "@react-spring/three"
import { Card3D } from "@/features/cards/components/card-3d"
import type { CardData } from "@/features/cards/types"

interface CardRevealStackProps {
	cards: CardData[]
	revealedIndices: Set<number>
	onCardClick: (index: number) => void
}

export function CardRevealStack({ cards, revealedIndices, onCardClick }: CardRevealStackProps) {
	const positions = useMemo(() => {
		const total = cards.length
		const spread = 0.35
		return cards.map((_, i) => {
			const offset = (i - (total - 1) / 2) * spread
			return [offset, 0, -i * 0.01] as [number, number, number]
		})
	}, [cards.length])

	return (
		<group>
			{cards.map((card, index) => (
				<AnimatedCard
					key={card.id}
					card={card}
					position={positions[index]}
					isRevealed={revealedIndices.has(index)}
					delay={index * 100}
					onClick={() => onCardClick(index)}
				/>
			))}
		</group>
	)
}

interface AnimatedCardProps {
	card: CardData
	position: [number, number, number]
	isRevealed: boolean
	delay: number
	onClick: () => void
}

function AnimatedCard({ card, position, isRevealed, delay, onClick }: AnimatedCardProps) {
	const { posY, rotY, scale } = useSpring({
		posY: isRevealed ? 0 : 0,
		rotY: isRevealed ? 0 : Math.PI,
		scale: isRevealed ? 1.05 : 0.95,
		config: { tension: 200, friction: 20 },
		delay: isRevealed ? 0 : delay,
	})

	const { entryY } = useSpring({
		from: { entryY: 2 },
		to: { entryY: position[1] },
		config: { tension: 120, friction: 14 },
		delay,
	})

	return (
		<animated.group
			position-x={position[0]}
			position-y={entryY}
			position-z={position[2]}
			rotation-y={rotY}
			scale={scale}
		>
			<Card3D
				card={card}
				faceDown={!isRevealed}
				onClick={onClick}
				enableTilt={isRevealed}
				scale={0.8}
			/>
		</animated.group>
	)
}
