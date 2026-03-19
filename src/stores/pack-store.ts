import { create } from "zustand"

interface PackSessionState {
	packsOpenedToday: number
	sessionStart: number | null
	coolDownShown: boolean
	incrementPacksOpened: () => void
	startSession: () => void
	markCoolDownShown: () => void
	resetDaily: () => void
	getSessionMinutes: () => number
}

export const usePackStore = create<PackSessionState>((set, get) => ({
	packsOpenedToday: 0,
	sessionStart: null,
	coolDownShown: false,

	incrementPacksOpened: () =>
		set((s) => ({ packsOpenedToday: s.packsOpenedToday + 1, coolDownShown: false })),

	startSession: () => set((s) => ({ sessionStart: s.sessionStart ?? Date.now() })),

	markCoolDownShown: () => set({ coolDownShown: true }),

	resetDaily: () => set({ packsOpenedToday: 0, coolDownShown: false }),

	getSessionMinutes: () => {
		const start = get().sessionStart
		if (!start) return 0
		return Math.floor((Date.now() - start) / 60000)
	},
}))
