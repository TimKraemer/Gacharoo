import { boolean, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import type { CardStats } from "./cards"
import { cardSets } from "./cards"
import { users } from "./users"

export type GhostTeamCard = {
	cardTemplateId: string
	title: string
	stats: CardStats
	elementType: string
	imageUrl: string | null
	rarity: string
}

export type BattleRound = {
	roundNumber: number
	playerCard: string
	opponentCard: string
	playerDamage: number
	opponentDamage: number
	playerHpAfter: number
	opponentHpAfter: number
	knockout: "player" | "opponent" | null
	regroupChoice?: string
}

export const ghostSnapshots = pgTable("ghost_snapshots", {
	id: uuid("id").defaultRandom().primaryKey(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	setId: uuid("set_id")
		.notNull()
		.references(() => cardSets.id, { onDelete: "cascade" }),
	team: jsonb("team").$type<GhostTeamCard[]>().notNull(),
	eloRating: integer("elo_rating").default(1000).notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const battleRuns = pgTable("battle_runs", {
	id: uuid("id").defaultRandom().primaryKey(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	setId: uuid("set_id")
		.notNull()
		.references(() => cardSets.id, { onDelete: "cascade" }),
	score: integer("score").default(0).notNull(),
	heartsRemaining: integer("hearts_remaining").default(5).notNull(),
	rounds: jsonb("rounds").$type<BattleRound[]>().default([]),
	isDailyRun: boolean("is_daily_run").default(false).notNull(),
	completedAt: timestamp("completed_at"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const botPlayers = pgTable("bot_players", {
	id: uuid("id").defaultRandom().primaryKey(),
	setId: uuid("set_id")
		.notNull()
		.references(() => cardSets.id, { onDelete: "cascade" }),
	displayName: text("display_name").notNull(),
	collection: jsonb("collection").$type<Record<string, number>>().notNull(),
	ghostTeam: jsonb("ghost_team").$type<GhostTeamCard[]>().notNull(),
	tradeInventory: jsonb("trade_inventory").$type<Record<string, number>>().notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
})
