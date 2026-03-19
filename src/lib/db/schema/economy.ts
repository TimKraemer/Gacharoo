import { boolean, date, integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { cardSets } from "./cards"
import { users } from "./users"

export const packPhaseEnum = pgEnum("pack_phase", ["collection", "holo_hunt"])

export const packs = pgTable("packs", {
	id: uuid("id").defaultRandom().primaryKey(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	setId: uuid("set_id")
		.notNull()
		.references(() => cardSets.id, { onDelete: "cascade" }),
	availablePacks: integer("available_packs").default(5).notNull(),
	lastRegeneratedAt: timestamp("last_regenerated_at").defaultNow().notNull(),
	adsWatchedToday: integer("ads_watched_today").default(0).notNull(),
	packsOpenedTotal: integer("packs_opened_total").default(0).notNull(),
	packsOpenedToday: integer("packs_opened_today").default(0).notNull(),
	shimmerPacksToday: integer("shimmer_packs_today").default(0).notNull(),
	epicPityCounter: integer("epic_pity_counter").default(0).notNull(),
	legendaryPityCounter: integer("legendary_pity_counter").default(0).notNull(),
	phase: packPhaseEnum("phase").default("collection").notNull(),
	lastResetDate: date("last_reset_date"),
})

export const dailyMissions = pgTable("daily_missions", {
	id: uuid("id").defaultRandom().primaryKey(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	missionType: text("mission_type").notNull(),
	progress: integer("progress").default(0).notNull(),
	target: integer("target").notNull(),
	completed: boolean("completed").default(false).notNull(),
	rewardClaimed: boolean("reward_claimed").default(false).notNull(),
	missionDate: date("mission_date").notNull(),
})
