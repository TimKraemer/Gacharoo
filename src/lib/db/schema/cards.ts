import { relations } from "drizzle-orm"
import {
	boolean,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core"
import { users } from "./users"

export const rarityEnum = pgEnum("rarity", [
	"standard",
	"common",
	"uncommon",
	"rare",
	"epic",
	"legendary",
])

export const elementEnum = pgEnum("element_type", ["blitz", "fortress", "swift"])

export const imageStorageEnum = pgEnum("image_storage", ["local", "external", "dicebear", "none"])

export type RarityWeights = {
	common: number
	uncommon: number
	rare: number
	epic: number
	legendary: number
}

export type CardStats = {
	atk: number
	def: number
	spd: number
	hp: number
}

export const cardSets = pgTable("card_sets", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: text("name").notNull(),
	description: text("description"),
	ownerId: uuid("owner_id")
		.notNull()
		.references(() => users.id),
	isPublic: boolean("is_public").default(false).notNull(),
	isNsfw: boolean("is_nsfw").default(false).notNull(),
	sourceType: text("source_type").default("manual").notNull(),
	packSize: integer("pack_size").default(5).notNull(),
	packCap: integer("pack_cap"),
	rarityWeights: jsonb("rarity_weights").$type<RarityWeights>(),
	cardCount: integer("card_count").default(0).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const setMembers = pgTable("set_members", {
	id: uuid("id").defaultRandom().primaryKey(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	setId: uuid("set_id")
		.notNull()
		.references(() => cardSets.id, { onDelete: "cascade" }),
	role: text("role").default("member").notNull(),
	joinedAt: timestamp("joined_at").defaultNow().notNull(),
})

export const cardTemplates = pgTable("card_templates", {
	id: uuid("id").defaultRandom().primaryKey(),
	setId: uuid("set_id")
		.notNull()
		.references(() => cardSets.id, { onDelete: "cascade" }),
	title: text("title").notNull(),
	imageUrl: text("image_url"),
	imageStorage: imageStorageEnum("image_storage").default("none").notNull(),
	description: text("description"),
	flavorText: text("flavor_text"),
	stats: jsonb("stats").$type<CardStats>().notNull(),
	rarity: rarityEnum("rarity").default("common").notNull(),
	elementType: elementEnum("element_type"),
	variantOf: uuid("variant_of"),
	superlative: text("superlative"),
	pool: text("pool").default("normal").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const userCards = pgTable("user_cards", {
	id: uuid("id").defaultRandom().primaryKey(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	cardTemplateId: uuid("card_template_id")
		.notNull()
		.references(() => cardTemplates.id, { onDelete: "cascade" }),
	quantity: integer("quantity").default(1).notNull(),
	isHolographic: boolean("is_holographic").default(false).notNull(),
	obtainedAt: timestamp("obtained_at").defaultNow().notNull(),
})

export const userWishlists = pgTable("user_wishlists", {
	id: uuid("id").defaultRandom().primaryKey(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	cardTemplateId: uuid("card_template_id")
		.notNull()
		.references(() => cardTemplates.id, { onDelete: "cascade" }),
})

export const cardSetsRelations = relations(cardSets, ({ many, one }) => ({
	cards: many(cardTemplates),
	members: many(setMembers),
	owner: one(users, { fields: [cardSets.ownerId], references: [users.id] }),
}))

export const cardTemplatesRelations = relations(cardTemplates, ({ one }) => ({
	set: one(cardSets, { fields: [cardTemplates.setId], references: [cardSets.id] }),
}))
