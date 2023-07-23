import { InferModel, relations, sql } from "drizzle-orm";
import { blob, integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { existingSections } from "~/common/constants";


export const users = sqliteTable("users", {
	id: integer("id").primaryKey({autoIncrement: true}),
	email: text("email").unique("email_idx").notNull(),
	password: text("password").notNull(),
	salt: text("salt").notNull(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	active: integer("active", {mode: "boolean"}).default(false).notNull(),
	createdAt: integer("created_at").default(sql`(strftime('%s','now') * 1000)`).notNull(),
});


export const admins = sqliteTable("admins", {
	userId: integer("user_id").unique().notNull().references(() => users.id, {onDelete: "cascade"}),
	superAdmin: integer("super_admin", {mode: "boolean"}).default(false).notNull(),
	createdAt: integer("created_at").default(sql`(strftime('%s','now') * 1000)`).notNull(),
});


export const teachers = sqliteTable("teachers", {
	userId: integer("user_id").unique().notNull().references(() => users.id, {onDelete: "cascade"}),
	folders: blob("folders", {mode: "json"}).$type<string[] | null>(),
	takenSpace: integer("taken_space").default(0).notNull(),
	allowedSpace: integer("allowed_space").default(500000000).notNull(),
	createdAt: integer("created_at").default(sql`(strftime('%s','now') * 1000)`).notNull(),
});


export const students = sqliteTable("students", {
	userId: integer("user_id").unique().notNull().references(() => users.id, {onDelete: "cascade"}),
	group: text("group").notNull(),
	createdAt: integer("created_at").default(sql`(strftime('%s','now') * 1000)`).notNull(),
});


export const contentManagers = sqliteTable("content_managers", {
	userId: integer("user_id").unique().notNull().references(() => users.id, {onDelete: "cascade"}),
	createdAt: integer("created_at").default(sql`(strftime('%s','now') * 1000)`).notNull(),
});


export const news = sqliteTable("news", {
	id: integer("id").primaryKey({autoIncrement: true}),
	title: text("title").notNull(),
	source: text("source").notNull(),
	html: text("html").notNull(),
	lang: text("lang").notNull().$type<"uk" | "en">(),
	createdAt: integer("created_at").default(sql`(strftime('%s','now') * 1000)`).notNull(),
});

export const articles = sqliteTable("articles", {
	lang: text("lang").$type<"uk" | "en">(),
	section: text("section").$type<typeof existingSections[number]>(),
	slug: text("slug").notNull(),
	title: text("title").notNull(),
	description: text("description").notNull(),
	keywords: text("keywords"),
	isDraft: integer("is_draft", {mode: "boolean"}).default(true),
	articleLang: text("article_lang").notNull().$type<"uk" | "en">(),
	source: text("source").notNull(),
	html: text("html").notNull(),
	createdAt: integer("created_at").default(sql`(strftime('%s','now') * 1000)`).notNull(),
}, (table) => ({
	pk: primaryKey(table.lang, table.section, table.slug),
}));

export const resetTokens = sqliteTable("reset_tokens", {
	userId: integer("user_id").notNull().unique().references(() => users.id, {onDelete: "cascade"}),
	token: text("token").notNull(),
	expiresAt: integer("expires_at").notNull(),
});


// Types
export type TUsers = InferModel<typeof users>;


// Relations
export const userRelations = relations(users, ({one}) => ({
	admin: one(admins, {
		fields: [users.id],
		references: [admins.userId],
	}),
	teacher: one(teachers, {
		fields: [users.id],
		references: [teachers.userId],
	}),
	student: one(students, {
		fields: [users.id],
		references: [students.userId],
	}),
	contentManager: one(contentManagers, {
		fields: [users.id],
		references: [contentManagers.userId],
	}),
	resetToken: one(resetTokens, {
		fields: [users.id],
		references: [resetTokens.userId],
	}),
}));

