"use client"

import { useRef, useState } from "react"
import { useFrame, type ThreeEvent } from "@react-three/fiber"
import { RoundedBox, Text, Float } from "@react-three/drei"
import type { Group } from "three"

interface PackMeshProps {
	onClick: () => void
}

export function PackMesh({ onClick }: PackMeshProps) {
	const groupRef = useRef<Group>(null)
	const [hovered, setHovered] = useState(false)

	useFrame(({ clock }) => {
		if (!groupRef.current) return
		groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.5) * 0.05
	})

	const handleClick = (e: ThreeEvent<MouseEvent>) => {
		e.stopPropagation()
		onClick()
	}

	return (
		<Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
			{/* biome-ignore lint/a11y/noStaticElementInteractions: R3F group handles pointer interactions in canvas. */}
			<group
				ref={groupRef}
				onClick={handleClick}
				onPointerOver={() => setHovered(true)}
				onPointerOut={() => setHovered(false)}
				scale={hovered ? 1.05 : 1}
			>
				{/* Pack body */}
				<RoundedBox args={[0.8, 1.1, 0.08]} radius={0.03} smoothness={4}>
					<meshStandardMaterial color="#1e1b4b" roughness={0.2} metalness={0.6} />
				</RoundedBox>

				{/* Pack foil shine */}
				<mesh position={[0, 0, 0.042]}>
					<planeGeometry args={[0.72, 1.02]} />
					<meshStandardMaterial
						color="#4338ca"
						roughness={0.1}
						metalness={0.8}
						transparent
						opacity={0.7}
					/>
				</mesh>

				{/* Pack label */}
				<Text
					position={[0, 0.15, 0.05]}
					fontSize={0.1}
					color="#e2e8f0"
					anchorX="center"
					anchorY="middle"
				>
					GACHAROO
				</Text>

				<Text
					position={[0, -0.05, 0.05]}
					fontSize={0.04}
					color="#94a3b8"
					anchorX="center"
					anchorY="middle"
				>
					Booster Pack
				</Text>

				{/* Glow when hovered */}
				{hovered && (
					<pointLight position={[0, 0, 0.3]} color="#818cf8" intensity={0.8} distance={1} />
				)}
			</group>
		</Float>
	)
}
