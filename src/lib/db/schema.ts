import { sqliteTable } from "drizzle-orm/sqlite-core";

export const pagesTable = sqliteTable("pages_table", (t) => ({
  id: t.integer().notNull().primaryKey({ autoIncrement: true }),
  title: t.text().notNull(),
  slug: t.text().notNull().unique(),
  url: t.text().notNull().unique(),
  content: t.text().default(""),
}));
