import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { cardSets, cardTemplates } from "./cards"
import { users } from "./users"

export const reportStatusEnum = pgEnum("report_status", [
	"pending",
	"reviewed",
	"resolved",
	"dismissed",
])

export const reports = pgTable("reports", {
	id: uuid("id").defaultRandom().primaryKey(),
	reporterId: uuid("reporter_id")
		.notNull()
		.references(() => users.id),
	cardId: uuid("card_id").references(() => cardTemplates.id),
	setId: uuid("set_id").references(() => cardSets.id),
	targetUserId: uuid("target_user_id").references(() => users.id),
	reason: text("reason").notNull(),
	status: reportStatusEnum("status").default("pending").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const removalRequests = pgTable("removal_requests", {
	id: uuid("id").defaultRandom().primaryKey(),
	requesterEmail: text("requester_email").notNull(),
	cardId: uuid("card_id").references(() => cardTemplates.id),
	setId: uuid("set_id").references(() => cardSets.id),
	reason: text("reason").notNull(),
	status: reportStatusEnum("status").default("pending").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	resolvedAt: timestamp("resolved_at"),
})

export const blockedUsers = pgTable("blocked_users", {
	id: uuid("id").defaultRandom().primaryKey(),
	blockerId: uuid("blocker_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	blockedId: uuid("blocked_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at").defaultNow().notNull(),
})
