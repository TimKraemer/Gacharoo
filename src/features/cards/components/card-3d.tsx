"use client"

import { useRef, useState, useMemo } from "react"
import { useFrame, type ThreeEvent } from "@react-three/fiber"
import { RoundedBox, Text, Float } from "@react-three/drei"
import type { Group, Mesh } from "three"
import * as THREE from "three"
import type { CardData } from "../types"
import {
	RARITY_BORDER_COLORS,
	RARITY_GLOW_COLORS,
	RARITY_GLOW_INTENSITY,
	getRaritySymbol,
} from "../utils/rarity-visuals"

const CARD_WIDTH = 0.63
const CARD_HEIGHT = 0.88
const CARD_DEPTH = 0.01

interface Card3DProps {
	card: CardData
	faceDown?: boolean
	onClick?: () => void
	enableTilt?: boolean
	scale?: number
}

export function Card3D({
	card,
	faceDown = false,
	onClick,
	enableTilt = true,
	scale = 1,
}: Card3DProps) {
	const groupRef = useRef<Group>(null)
	const [hovered, setHovered] = useState(false)

	const borderColor = useMemo(
		() => new THREE.Color(RARITY_BORDER_COLORS[card.rarity]),
		[card.rarity],
	)
	const glowColor = useMemo(
		() => new THREE.Color(RARITY_GLOW_COLORS[card.rarity]),
		[card.rarity],
	)
	const glowIntensity = RARITY_GLOW_INTENSITY[card.rarity]

	useFrame(({ pointer }) => {
		if (!groupRef.current || !enableTilt) return
		const targetRotY = pointer.x * 0.15
		const targetRotX = -pointer.y * 0.1
		groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.1
		groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.1
	})

	const handleClick = (e: ThreeEvent<MouseEvent>) => {
		e.stopPropagation()
		onClick?.()
	}

	return (
		<group
			ref={groupRef}
			scale={scale}
			onClick={handleClick}
			onPointerOver={() => setHovered(true)}
			onPointerOut={() => setHovered(false)}
		>
			<RoundedBox
				args={[CARD_WIDTH, CARD_HEIGHT, CARD_DEPTH]}
				radius={0.02}
				smoothness={4}
				castShadow
			>
				<meshStandardMaterial
					color={faceDown ? "#1e293b" : "#0f172a"}
					roughness={0.3}
					metalness={0.1}
				/>
			</RoundedBox>

			{/* Rarity border frame */}
			<mesh position={[0, 0, CARD_DEPTH / 2 + 0.001]}>
				<planeGeometry args={[CARD_WIDTH - 0.02, CARD_HEIGHT - 0.02]} />
				<meshBasicMaterial color={borderColor} transparent opacity={0.15} />
			</mesh>

			{/* Border outline */}
			<lineSegments position={[0, 0, CARD_DEPTH / 2 + 0.002]}>
				<edgesGeometry
					args={[new THREE.PlaneGeometry(CARD_WIDTH - 0.04, CARD_HEIGHT - 0.04)]}
				/>
				<lineBasicMaterial color={borderColor} linewidth={2} />
			</lineSegments>

			{!faceDown && (
				<>
					{/* Card title */}
					<Text
						position={[0, CARD_HEIGHT / 2 - 0.1, CARD_DEPTH / 2 + 0.003]}
						fontSize={0.045}
						color="white"
						anchorX="center"
						anchorY="middle"
						maxWidth={CARD_WIDTH - 0.1}
						font="/fonts/bebas-neue-v14-latin-regular.woff2"
					>
						{card.title}
					</Text>

					{/* Rarity symbol */}
					<Text
						position={[CARD_WIDTH / 2 - 0.06, CARD_HEIGHT / 2 - 0.06, CARD_DEPTH / 2 + 0.003]}
						fontSize={0.04}
						color={RARITY_BORDER_COLORS[card.rarity]}
						anchorX="center"
						anchorY="middle"
					>
						{getRaritySymbol(card.rarity)}
					</Text>

					{/* Stats display */}
					<group position={[0, -CARD_HEIGHT / 2 + 0.12, CARD_DEPTH / 2 + 0.003]}>
						<StatBar label="ATK" value={card.stats.atk} x={-0.2} color="#ef4444" />
						<StatBar label="DEF" value={card.stats.def} x={-0.07} color="#3b82f6" />
						<StatBar label="SPD" value={card.stats.spd} x={0.07} color="#22c55e" />
						<StatBar label="HP" value={card.stats.hp} x={0.2} color="#eab308" />
					</group>

					{/* Holographic shimmer overlay */}
					{card.isHolographic && <HoloOverlay />}

					{/* Flavor text */}
					{card.flavorText && (
						<Text
							position={[0, -0.1, CARD_DEPTH / 2 + 0.003]}
							fontSize={0.025}
							color="#94a3b8"
							anchorX="center"
							anchorY="middle"
							maxWidth={CARD_WIDTH - 0.12}
							textAlign="center"
							fontStyle="italic"
						>
							{card.flavorText}
						</Text>
					)}
				</>
			)}

			{faceDown && (
				<>
					{/* Card back pattern */}
					<Text
						position={[0, 0, CARD_DEPTH / 2 + 0.003]}
						fontSize={0.12}
						color="#334155"
						anchorX="center"
						anchorY="middle"
					>
						G
					</Text>
					<Text
						position={[0, -0.15, CARD_DEPTH / 2 + 0.003]}
						fontSize={0.03}
						color="#475569"
						anchorX="center"
						anchorY="middle"
					>
						GACHAROO
					</Text>
				</>
			)}

			{/* Hover glow */}
			{(hovered || glowIntensity > 0) && (
				<pointLight
					position={[0, 0, 0.15]}
					color={glowColor}
					intensity={hovered ? glowIntensity + 0.5 : glowIntensity}
					distance={0.8}
				/>
			)}
		</group>
	)
}

function StatBar({
	label,
	value,
	x,
	color,
}: { label: string; value: number; x: number; color: string }) {
	return (
		<group position={[x, 0, 0]}>
			<Text fontSize={0.018} color="#64748b" position={[0, 0.02, 0]} anchorX="center">
				{label}
			</Text>
			<Text fontSize={0.028} color={color} position={[0, -0.01, 0]} anchorX="center">
				{value.toString()}
			</Text>
		</group>
	)
}

function HoloOverlay() {
	const meshRef = useRef<Mesh>(null)

	useFrame(({ clock }) => {
		if (!meshRef.current) return
		const material = meshRef.current.material as THREE.MeshBasicMaterial
		material.opacity = 0.08 + Math.sin(clock.elapsedTime * 2) * 0.04
	})

	return (
		<mesh ref={meshRef} position={[0, 0, CARD_DEPTH / 2 + 0.004]}>
			<planeGeometry args={[CARD_WIDTH - 0.06, CARD_HEIGHT - 0.06]} />
			<meshBasicMaterial
				color="#ffffff"
				transparent
				opacity={0.1}
				blending={THREE.AdditiveBlending}
			/>
		</mesh>
	)
}
