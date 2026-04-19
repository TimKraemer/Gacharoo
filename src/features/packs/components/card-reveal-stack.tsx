"use client"

import { useFrame } from "@react-three/fiber"
import { useEffect, useMemo, useRef } from "react"
import type { Group } from "three"
import { Card3D } from "@/features/cards/components/card-3d"
import type { CardData } from "@/features/cards/types"

interface CardRevealStackProps {
	cards: CardData[]
	revealedIndices: Set<number>
	nextRevealIndex: number
	interactive: boolean
	onCardClick: (index: number) => void
}

export function CardRevealStack({
	cards,
	revealedIndices,
	nextRevealIndex,
	interactive,
	onCardClick,
}: CardRevealStackProps) {
	const positions = useMemo(() => {
		const total = cards.length
		const spread = 0.35
		return cards.map((_, i) => {
			const offset = (i - (total - 1) / 2) * spread
			return [offset, 0, -i * 0.01] as [number, number, number]
		})
	}, [cards])

	return (
		<group>
			{cards.map((card, index) => (
				<AnimatedCard
					key={card.id}
					card={card}
					position={positions[index]}
					isRevealed={revealedIndices.has(index)}
					isNext={index === nextRevealIndex}
					interactive={interactive}
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
	isNext: boolean
	interactive: boolean
	delay: number
	onClick: () => void
}

function AnimatedCard({
	card,
	position,
	isRevealed,
	isNext,
	interactive,
	delay,
	onClick,
}: AnimatedCardProps) {
	const groupRef = useRef<Group>(null)
	const hasEntryStartedRef = useRef(delay === 0)

	useEffect(() => {
		const group = groupRef.current
		if (!group) {
			return
		}

		group.position.set(position[0], 2, position[2])
		group.rotation.y = Math.PI
		group.scale.setScalar(0.95)
	}, [position])

	useEffect(() => {
		if (delay === 0) {
			hasEntryStartedRef.current = true
			return
		}

		hasEntryStartedRef.current = false
		const timerId = window.setTimeout(() => {
			hasEntryStartedRef.current = true
		}, delay)

		return () => {
			window.clearTimeout(timerId)
		}
	}, [delay])

	useFrame(({ clock }, delta) => {
		const group = groupRef.current
		if (!group || !hasEntryStartedRef.current) {
			return
		}

		const smoothing = Math.min(1, delta * 8)
		const targetScale = isRevealed ? 1.05 : 0.95
		const targetRotY = isRevealed ? 0 : Math.PI

		group.position.x = position[0]
		group.position.z = position[2]
		group.position.y += (position[1] - group.position.y) * smoothing
		group.rotation.y += (targetRotY - group.rotation.y) * smoothing

		const nextScale = group.scale.x + (targetScale - group.scale.x) * smoothing
		group.scale.setScalar(nextScale)

		if (interactive && isNext && !isRevealed) {
			group.position.y += Math.sin(clock.elapsedTime * 8) * 0.0008
		}
	})

	return (
		<group ref={groupRef}>
			<Card3D
				card={card}
				faceDown={!isRevealed}
				onClick={interactive && isNext ? onClick : undefined}
				enableTilt={isRevealed}
				scale={0.8}
			/>
		</group>
	)
}
