type UmamiEventData = Record<string, string | number | boolean>

export function trackEvent(eventName: string, data?: UmamiEventData) {
	if (typeof window === "undefined") return
	const umami = (window as { umami?: { track: (name: string, data?: UmamiEventData) => void } })
		.umami
	umami?.track(eventName, data)
}

export const events = {
	setCreated: (setSize: number, sourceType: string) =>
		trackEvent("set_created", { set_size: setSize, source_type: sourceType }),
	packOpened: (packType: string) => trackEvent("pack_opened", { pack_type: packType }),
	cardPulled: (rarity: string) => trackEvent("card_pulled", { rarity }),
	tradeCompleted: () => trackEvent("trade_completed"),
	battleRunStarted: () => trackEvent("battle_run_started"),
	battleRunScore: (score: number) => trackEvent("battle_run_score", { score }),
	adWatched: (adType: string) => trackEvent("ad_watched", { ad_type: adType }),
	adBlocked: () => trackEvent("ad_blocked"),
	inviteSent: () => trackEvent("invite_sent"),
	inviteJoined: () => trackEvent("invite_joined"),
}
