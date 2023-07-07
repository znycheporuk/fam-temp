import { relations, sql } from "drizzle-orm";
import { blob, integer, primaryKey, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import type { existingSections } from "~/common/constants";


export const users = sqliteTable("users", {
	id: integer("id").primaryKey({autoIncrement: true}),
	email: text("email").notNull(),
	password: text("password").notNull(),
	salt: text("salt").notNull(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	active: integer("active", {mode: "boolean"}).notNull().default(false),
	createdAt: integer("created_at", {mode: "timestamp_ms"}).notNull().default(sql`CURRENT_TIMESTAMP`),
	updatedAt: integer("updated_at", {mode: "timestamp_ms"}).notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
	emailIdx: uniqueIndex("email_idx").on(table.email),
}));


export const admins = sqliteTable("admins", {
	id: integer("id").primaryKey({autoIncrement: true}),
	userId: integer("user_id").notNull(),
	createdAt: integer("created_at", {mode: "timestamp_ms"}).notNull().default(sql`CURRENT_TIMESTAMP`),
	updatedAt: integer("updated_at", {mode: "timestamp_ms"}).notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
	userIdIdx: uniqueIndex("admins_user_id_idx").on(table.userId),
}));


export const teachers = sqliteTable("teachers", {
	id: integer("id").primaryKey({autoIncrement: true}),
	userId: integer("user_id").notNull(),
	folders: blob("folders", {mode: "json"}).$type<string[]>(),
	takenSpace: integer("taken_space").notNull().default(0),
	allowedSpace: integer("allowed_space").notNull().default(500000000),
	createdAt: integer("created_at", {mode: "timestamp_ms"}).notNull().default(sql`CURRENT_TIMESTAMP`),
	updatedAt: integer("updated_at", {mode: "timestamp_ms"}).notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
	userIdIdx: uniqueIndex("teachers_user_id_idx").on(table.userId),
}));


export const students = sqliteTable("students", {
	id: integer("id").primaryKey({autoIncrement: true}),
	userId: integer("user_id").notNull(),
	group: text("group").notNull(),
	createdAt: integer("created_at", {mode: "timestamp_ms"}).notNull().default(sql`CURRENT_TIMESTAMP`),
	updatedAt: integer("updated_at", {mode: "timestamp_ms"}).notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
	userIdIdx: uniqueIndex("students_user_id_idx").on(table.userId),
}));


export const contentManagers = sqliteTable("content_managers", {
	id: integer("id").primaryKey({autoIncrement: true}),
	userId: integer("user_id").notNull(),
	createdAt: integer("created_at", {mode: "timestamp_ms"}).notNull().default(sql`CURRENT_TIMESTAMP`),
	updatedAt: integer("updated_at", {mode: "timestamp_ms"}).notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
	userIdIdx: uniqueIndex("content_managers_user_id_idx").on(table.userId),
}));


export const news = sqliteTable("news", {
	id: integer("id").primaryKey({autoIncrement: true}),
	title: text("title").notNull(),
	source: text("source").notNull(),
	html: text("html").notNull(),
	lang: text("lang").notNull().$type<"uk" | "en">(),
	createdAt: integer("created_at", {mode: "timestamp_ms"}).notNull().default(sql`CURRENT_TIMESTAMP`),
	updatedAt: integer("updated_at", {mode: "timestamp_ms"}).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const articles = sqliteTable("articles", {
	lang: text("lang").notNull().$type<"uk" | "en">(),
	section: text("section").notNull().$type<typeof existingSections[number]>(),
	slug: text("slug").notNull(),
	title: text("title").notNull(),
	description: text("description").notNull(),
	keywords: text("keywords").notNull(),
	isDraft: integer("is_draft", {mode: "boolean"}).notNull().default(true),
	articleLang: text("article_lang").notNull().$type<"uk" | "en">(),
	source: text("source").notNull(),
	html: text("html").notNull(),
	createdAt: integer("created_at", {mode: "timestamp_ms"}).notNull().default(sql`CURRENT_TIMESTAMP`),
	updatedAt: integer("updated_at", {mode: "timestamp_ms"}).notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
	pk: primaryKey(table.lang, table.section, table.slug),
}));


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
}));

