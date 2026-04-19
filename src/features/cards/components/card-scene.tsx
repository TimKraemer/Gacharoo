"use client"

import { ContactShadows, Environment } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"
import type { CardData } from "../types"
import { Card3D } from "./card-3d"

interface CardSceneProps {
	card: CardData
	className?: string
}

export function CardScene({ card, className }: CardSceneProps) {
	return (
		<div className={className}>
			<Canvas
				camera={{ position: [0, 0, 1.2], fov: 45 }}
				gl={{ antialias: true, alpha: true }}
				style={{ background: "transparent" }}
			>
				<Suspense fallback={null}>
					<ambientLight intensity={0.5} />
					<directionalLight position={[5, 5, 5]} intensity={0.8} />
					<Card3D card={card} />
					<ContactShadows position={[0, -0.5, 0]} opacity={0.4} scale={2} blur={2} far={1} />
					<Environment preset="city" />
				</Suspense>
			</Canvas>
		</div>
	)
}
