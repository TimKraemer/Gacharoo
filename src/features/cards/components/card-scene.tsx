"use client"

import { Canvas } from "@react-three/fiber"
import { Environment, ContactShadows } from "@react-three/drei"
import { Suspense } from "react"
import { Card3D } from "./card-3d"
import type { CardData } from "../types"

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
					<ContactShadows
						position={[0, -0.5, 0]}
						opacity={0.4}
						scale={2}
						blur={2}
						far={1}
					/>
					<Environment preset="city" />
				</Suspense>
			</Canvas>
		</div>
	)
}
