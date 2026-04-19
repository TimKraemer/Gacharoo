"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { useEffect, useMemo, useState } from "react"
import { GacharooLogoLockup } from "@/components/brand/gacharoo-logo-lockup"
import { StaggerEntrance } from "@/components/motion/stagger-entrance"
import { CardScene } from "@/features/cards/components/card-scene"
import type { CardData } from "@/features/cards/types"
import { PackOpeningScene } from "@/features/packs/components/pack-opening-scene"
import { DEMO_CARDS } from "@/features/packs/utils/demo-cards"
import { usePackStore } from "@/stores/pack-store"

const FREE_PACKS_PER_LOOP = 3
const COOL_DOWN_SECONDS = 45
const AD_REWARD_PACKS = 1

function rarityBadge(rarity: CardData["rarity"]) {
	switch (rarity) {
		case "legendary":
			return "♛"
		case "epic":
			return "★★"
		case "rare":
			return "★"
		case "uncommon":
			return "◆"
		default:
			return "●"
	}
}

function formatTime(totalSeconds: number) {
	const minutes = Math.floor(totalSeconds / 60)
	const seconds = totalSeconds % 60
	return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
}

export default function DemoPage() {
	const tBrand = useTranslations("brand")
	const tCommon = useTranslations("common")
	const tDemo = useTranslations("demo")
	const tRarity = useTranslations("rarity")
	const [mode, setMode] = useState<"card" | "pack">("pack")
	const [selectedCard, setSelectedCard] = useState<CardData>(DEMO_CARDS[0])
	const [packKey, setPackKey] = useState(0)
	const [packsRemaining, setPacksRemaining] = useState(FREE_PACKS_PER_LOOP)
	const [coolDownEndsAt, setCoolDownEndsAt] = useState<number | null>(null)
	const [timeNow, setTimeNow] = useState(Date.now())
	const [packInProgress, setPackInProgress] = useState(false)
	const [packComplete, setPackComplete] = useState(false)
	const [collectionCount, setCollectionCount] = useState(0)
	const [coins, setCoins] = useState(0)
	const [lastReward, setLastReward] = useState<{
		coins: number
		rarity: CardData["rarity"]
	} | null>(null)
	const [sessionMinutes, setSessionMinutes] = useState(0)
	const packsOpenedToday = usePackStore((state) => state.packsOpenedToday)
	const incrementPacksOpened = usePackStore((state) => state.incrementPacksOpened)
	const startSession = usePackStore((state) => state.startSession)
	const getSessionMinutes = usePackStore((state) => state.getSessionMinutes)

	useEffect(() => {
		startSession()
	}, [startSession])

	useEffect(() => {
		const timerId = window.setInterval(() => {
			setTimeNow(Date.now())
			setSessionMinutes(getSessionMinutes())
		}, 1000)

		return () => {
			window.clearInterval(timerId)
		}
	}, [getSessionMinutes])

	const coolDownSecondsLeft = useMemo(() => {
		if (!coolDownEndsAt) {
			return 0
		}

		return Math.max(0, Math.ceil((coolDownEndsAt - timeNow) / 1000))
	}, [coolDownEndsAt, timeNow])

	const canClaimFreeRefill = coolDownEndsAt !== null && coolDownSecondsLeft === 0

	const handlePackStart = () => {
		if (packInProgress || packsRemaining <= 0) {
			return false
		}

		setPackInProgress(true)
		setPackComplete(false)
		setLastReward(null)
		setPacksRemaining((previous) => {
			const next = Math.max(0, previous - 1)
			if (next === 0) {
				setCoolDownEndsAt(Date.now() + COOL_DOWN_SECONDS * 1000)
			}
			return next
		})
		incrementPacksOpened()
		return true
	}

	const handlePackComplete = () => {
		const rolledIndex = Math.floor(Math.random() * DEMO_CARDS.length)
		const topCard = DEMO_CARDS[rolledIndex]
		const rewardedCoins = topCard.rarity === "legendary" ? 140 : topCard.rarity === "epic" ? 90 : 50

		setPackInProgress(false)
		setPackComplete(true)
		setCollectionCount((previous) => previous + DEMO_CARDS.length)
		setCoins((previous) => previous + rewardedCoins)
		setLastReward({ coins: rewardedCoins, rarity: topCard.rarity })
	}

	const openNextPack = () => {
		if (packsRemaining <= 0 || packInProgress) {
			return
		}

		setPackKey((previous) => previous + 1)
		setPackComplete(false)
	}

	const watchRewardedAd = () => {
		setPacksRemaining((previous) => previous + AD_REWARD_PACKS)
		setCoolDownEndsAt(null)
	}

	const claimFreeRefill = () => {
		if (!canClaimFreeRefill) {
			return
		}

		setPacksRemaining((previous) => previous + 1)
		setCoolDownEndsAt(null)
	}

	return (
		<main className="min-h-screen bg-linear-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100">
			<StaggerEntrance className="mx-auto max-w-6xl px-4 py-6 md:px-8">
				<header
					data-enter
					className="mb-6 rounded-2xl border border-violet-500/20 bg-zinc-900/70 p-4 shadow-[0_0_60px_-22px_rgba(139,92,246,0.65)] backdrop-blur"
				>
					<div className="flex flex-wrap items-center justify-between gap-4">
						<div className="min-w-0 space-y-2">
							<Link
								href="/"
								className="inline-flex min-h-8 items-center text-sm font-medium text-violet-200/90 outline-none ring-violet-400/60 transition hover:text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
							>
								{tBrand("backToMarketing")}
							</Link>
							<GacharooLogoLockup
								lockupAriaLabel={tBrand("logoLockupAriaLabel")}
								tagline={tCommon("appName")}
								tone="dark"
								appName={tDemo("packLoopTitle")}
							/>
							<p className="text-sm text-zinc-400">{tDemo("headerBlurb")}</p>
						</div>
						<div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
							<div className="rounded-xl border border-zinc-700/80 bg-zinc-900/80 px-3 py-2">
								<div className="text-zinc-500">{tDemo("statPacks")}</div>
								<div className="text-lg font-semibold text-emerald-300">{packsRemaining}</div>
							</div>
							<div className="rounded-xl border border-zinc-700/80 bg-zinc-900/80 px-3 py-2">
								<div className="text-zinc-500">{tDemo("statCoins")}</div>
								<div className="text-lg font-semibold text-amber-300">{coins}</div>
							</div>
							<div className="rounded-xl border border-zinc-700/80 bg-zinc-900/80 px-3 py-2">
								<div className="text-zinc-500">{tDemo("statOpened")}</div>
								<div className="text-lg font-semibold text-sky-300">{packsOpenedToday}</div>
							</div>
							<div className="rounded-xl border border-zinc-700/80 bg-zinc-900/80 px-3 py-2">
								<div className="text-zinc-500">{tDemo("statSession")}</div>
								<div className="text-lg font-semibold text-fuchsia-300">{sessionMinutes}m</div>
							</div>
						</div>
					</div>
				</header>

				<div
					data-enter
					className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3"
				>
					<div className="flex gap-2">
						<button
							type="button"
							onClick={() => setMode("pack")}
							className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
								mode === "pack"
									? "bg-violet-500 text-white shadow-[0_0_35px_-15px_rgba(139,92,246,0.85)]"
									: "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
							}`}
						>
							{tDemo("modePack")}
						</button>
						<button
							type="button"
							onClick={() => setMode("card")}
							className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
								mode === "card"
									? "bg-violet-500 text-white shadow-[0_0_35px_-15px_rgba(139,92,246,0.85)]"
									: "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
							}`}
						>
							{tDemo("modeCard")}
						</button>
					</div>
					<div className="text-xs text-zinc-400">
						{tDemo("collectionScore", { count: collectionCount })}
					</div>
				</div>

				{mode === "pack" && (
					<section
						data-enter
						className="rounded-2xl border border-violet-500/20 bg-zinc-900/60 p-3 shadow-[inset_0_0_40px_-25px_rgba(139,92,246,0.8)]"
					>
						<div className="relative h-[65vh] overflow-hidden rounded-xl border border-zinc-800 bg-linear-to-b from-zinc-900 via-zinc-950 to-black">
							<PackOpeningScene
								key={packKey}
								cards={DEMO_CARDS}
								onComplete={handlePackComplete}
								onPackStart={handlePackStart}
								className="h-full w-full"
							/>
							<div className="absolute left-3 top-3 rounded-lg border border-zinc-700/70 bg-zinc-900/85 px-3 py-1.5 text-xs text-zinc-300">
								{packsRemaining > 0
									? tDemo("packHudFree", { count: packsRemaining })
									: tDemo("packHudNone")}
							</div>
						</div>
					</section>
				)}

				{mode === "card" && (
					<section data-enter className="rounded-2xl border border-cyan-500/20 bg-zinc-900/60 p-3">
						<div className="relative h-[65vh] overflow-hidden rounded-xl border border-zinc-800 bg-linear-to-b from-zinc-900 via-zinc-950 to-black">
							<CardScene card={selectedCard} className="h-full w-full" />
						</div>
					</section>
				)}

				{mode === "card" && (
					<div data-enter className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
						<h2 className="mb-3 text-sm font-medium text-zinc-300">{tDemo("selectCard")}</h2>
						<div className="flex flex-wrap gap-2">
							{DEMO_CARDS.map((card) => (
								<button
									key={card.id}
									type="button"
									onClick={() => setSelectedCard(card)}
									className={`rounded-lg px-3 py-2 text-sm transition ${
										selectedCard.id === card.id
											? "scale-105 bg-cyan-500 text-cyan-950"
											: "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
									}`}
								>
									<span className="mr-1">{rarityBadge(card.rarity)}</span>
									{card.title}
									{card.isHolographic && " ✨"}
								</button>
							))}
						</div>
					</div>
				)}

				<div data-enter className="mt-4 grid gap-3 md:grid-cols-3">
					<div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
						<p className="text-xs uppercase tracking-widest text-zinc-500">
							{tDemo("packStatusTitle")}
						</p>
						<p className="mt-2 text-sm text-zinc-300">
							{packInProgress
								? tDemo("packStatusInProgress")
								: packComplete
									? tDemo("packStatusComplete")
									: tDemo("packStatusReady")}
						</p>
						{packComplete && packsRemaining > 0 && (
							<button
								type="button"
								onClick={openNextPack}
								className="mt-3 w-full rounded-lg bg-emerald-500 px-3 py-2 text-sm font-medium text-emerald-950 hover:bg-emerald-400"
							>
								{tDemo("openNextPack")}
							</button>
						)}
					</div>

					<div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
						<p className="text-xs uppercase tracking-widest text-zinc-500">
							{tDemo("refillTitle")}
						</p>
						<p className="mt-2 text-sm text-zinc-300">
							{packsRemaining > 0
								? tDemo("refillHasPacks")
								: canClaimFreeRefill
									? tDemo("refillFreeReady")
									: tDemo("refillCooldown", { time: formatTime(coolDownSecondsLeft) })}
						</p>
						<div className="mt-3 flex gap-2">
							<button
								type="button"
								onClick={claimFreeRefill}
								disabled={!canClaimFreeRefill}
								className="flex-1 rounded-lg bg-zinc-700 px-3 py-2 text-sm font-medium text-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
							>
								{tDemo("claimFree")}
							</button>
							<button
								type="button"
								onClick={watchRewardedAd}
								className="flex-1 rounded-lg bg-amber-400 px-3 py-2 text-sm font-medium text-amber-950 hover:bg-amber-300"
							>
								{tDemo("watchAd", { count: AD_REWARD_PACKS })}
							</button>
						</div>
					</div>

					<div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
						<p className="text-xs uppercase tracking-widest text-zinc-500">
							{tDemo("rewardTitle")}
						</p>
						{lastReward ? (
							<div className="mt-2 text-sm text-zinc-200">
								<p>{tDemo("rewardCoins", { coins: lastReward.coins })}</p>
								<p className="text-zinc-400">
									{tDemo("rewardTopRarity", { rarity: tRarity(lastReward.rarity) })}
								</p>
							</div>
						) : (
							<p className="mt-2 text-sm text-zinc-400">{tDemo("rewardEmpty")}</p>
						)}
					</div>
				</div>

				<footer
					data-enter
					className="mt-5 border-t border-zinc-800 pt-4 text-center text-xs text-zinc-500"
				>
					{tDemo("footerBlurb")}
				</footer>
			</StaggerEntrance>
		</main>
	)
}
