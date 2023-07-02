import { randomUUID } from "crypto";
import { relations } from "drizzle-orm";
import { blob, integer, primaryKey, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { existingSections } from "~/common/constants";


export const users = sqliteTable("users", {
	id: text("id").primaryKey().default(randomUUID()),
	email: text("email"),
	password: text("password"),
	salt: text("salt"),
	firstName: text("first_name"),
	lastName: text("last_name"),
	active: integer("active", {mode: "boolean"}).default(false),
	createdAt: integer("created_at", {mode: "timestamp_ms"}).default(new Date()),
	updatedAt: integer("updated_at", {mode: "timestamp_ms"}).default(new Date()),
}, (table) => ({
	emailIdx: uniqueIndex("email_idx").on(table.email),
}));


export const admins = sqliteTable("admins", {
	id: text("id").primaryKey().default(randomUUID()),
	userId: text("user_id"),
	createdAt: integer("created_at", {mode: "timestamp_ms"}).default(new Date()),
	updatedAt: integer("updated_at", {mode: "timestamp_ms"}).default(new Date()),
}, (table) => ({
	userIdIdx: uniqueIndex("user_id_idx").on(table.userId),
}));


export const teachers = sqliteTable("teachers", {
	id: text("id").primaryKey().default(randomUUID()),
	userId: text("user_id"),
	folders: blob("folders", {mode: "json"}).default([]).$type<string[]>(),
	takenSpace: integer("taken_space").default(0),
	allowedSpace: integer("allowed_space").default(500000000),
	createdAt: integer("created_at", {mode: "timestamp_ms"}).default(new Date()),
	updatedAt: integer("updated_at", {mode: "timestamp_ms"}).default(new Date()),
}, (table) => ({
	userIdIdx: uniqueIndex("user_id_idx").on(table.userId),
}));


export const students = sqliteTable("students", {
	id: text("id").primaryKey().default(randomUUID()),
	userId: text("user_id"),
	group: text("group"),
	createdAt: integer("created_at", {mode: "timestamp_ms"}).default(new Date()),
	updatedAt: integer("updated_at", {mode: "timestamp_ms"}).default(new Date()),
}, (table) => ({
	userIdIdx: uniqueIndex("user_id_idx").on(table.userId),
}));


export const contentManagers = sqliteTable("content_managers", {
	id: text("id").primaryKey().default(randomUUID()),
	userId: text("user_id"),
	createdAt: integer("created_at", {mode: "timestamp_ms"}).default(new Date()),
	updatedAt: integer("updated_at", {mode: "timestamp_ms"}).default(new Date()),
}, (table) => ({
	userIdIdx: uniqueIndex("user_id_idx").on(table.userId),
}));


export const news = sqliteTable("news", {
	id: text("id").primaryKey().default(randomUUID()),
	title: text("title"),
	source: text("source"),
	html: text("html"),
	lang: text("lang").$type<"uk" | "en">(),
	createdAt: integer("created_at", {mode: "timestamp_ms"}).default(new Date()),
	updatedAt: integer("updated_at", {mode: "timestamp_ms"}).default(new Date()),
});

export const articles = sqliteTable("articles", {
	lang: text("lang").$type<"uk" | "en">(),
	section: text("section").$type<typeof existingSections[number]>(),
	slug: text("slug"),
	title: text("title"),
	description: text("description"),
	keywords: text("keywords"),
	isDraft: integer("is_draft", {mode: "boolean"}).default(true),
	articleLang: text("article_lang").$type<"uk" | "en">(),
	source: text("source"),
	html: text("html"),
	createdAt: integer("created_at", {mode: "timestamp_ms"}).default(new Date()),
	updatedAt: integer("updated_at", {mode: "timestamp_ms"}).default(new Date()),
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

