import { integer, jsonb, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { cardSets, cardTemplates } from "./cards"
import { users } from "./users"

export const tradeStatusEnum = pgEnum("trade_status", [
	"pending",
	"accepted",
	"declined",
	"cancelled",
])

export const trades = pgTable("trades", {
	id: uuid("id").defaultRandom().primaryKey(),
	senderId: uuid("sender_id")
		.notNull()
		.references(() => users.id),
	receiverId: uuid("receiver_id")
		.notNull()
		.references(() => users.id),
	setId: uuid("set_id")
		.notNull()
		.references(() => cardSets.id),
	status: tradeStatusEnum("status").default("pending").notNull(),
	offeredCards: jsonb("offered_cards").$type<string[]>().notNull(),
	requestedCards: jsonb("requested_cards").$type<string[]>().notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	resolvedAt: timestamp("resolved_at"),
})

export const wonderPicks = pgTable("wonder_picks", {
	id: uuid("id").defaultRandom().primaryKey(),
	sourceUserId: uuid("source_user_id")
		.notNull()
		.references(() => users.id),
	pickerUserId: uuid("picker_user_id").references(() => users.id),
	setId: uuid("set_id")
		.notNull()
		.references(() => cardSets.id),
	cardTemplateId: uuid("card_template_id")
		.notNull()
		.references(() => cardTemplates.id),
	pickedAt: timestamp("picked_at"),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const invites = pgTable("invites", {
	id: uuid("id").defaultRandom().primaryKey(),
	code: text("code").notNull().unique(),
	setId: uuid("set_id")
		.notNull()
		.references(() => cardSets.id, { onDelete: "cascade" }),
	creatorId: uuid("creator_id")
		.notNull()
		.references(() => users.id),
	usesCount: integer("uses_count").default(0).notNull(),
	maxUses: integer("max_uses"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
})
