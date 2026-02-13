import { sqliteTable } from "drizzle-orm/sqlite-core";

export const pages = sqliteTable("pages", (t) => ({
  id: t.integer().notNull().primaryKey({ autoIncrement: true }),
  title: t.text().notNull(),
  slug: t.text().notNull().unique(),
  content: t.text().default(""),
}));
