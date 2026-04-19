import Image from "next/image"
import { usePreferredMascotUrl } from "@/hooks/use-preferred-mascot-url"

export type GacharooBrandAvatarProps = {
	/** Display size in CSS pixels (width and height). */
	size?: 32 | 40 | 48 | 64
	className?: string
	alt: string
	priority?: boolean
}

const sizeClass: Record<NonNullable<GacharooBrandAvatarProps["size"]>, string> = {
	32: "h-8 w-8",
	40: "h-10 w-10",
	48: "h-12 w-12",
	64: "h-16 w-16",
}

/**
 * Rounded-rect avatar: prefers committed Nano Banana 2 PNG when present, else SVG.
 */
export function GacharooBrandAvatar({
	size = 48,
	className = "",
	alt,
	priority = false,
}: GacharooBrandAvatarProps) {
	const pixel = size
	const { url, onRasterError } = usePreferredMascotUrl()

	return (
		<Image
			key={url}
			src={url}
			alt={alt}
			width={pixel}
			height={pixel}
			priority={priority}
			unoptimized
			onError={onRasterError}
			className={`rounded-xl border border-violet-500/35 bg-violet-950/40 object-cover shadow-[0_0_24px_-8px_rgba(139,92,246,0.55)] ${sizeClass[size]} ${className}`}
		/>
	)
}
