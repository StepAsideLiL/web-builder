import { sqliteTable } from "drizzle-orm/sqlite-core";

export const pagesTable = sqliteTable("pages_table", (t) => ({
  id: t.integer().notNull().primaryKey({ autoIncrement: true }),
  title: t.text().notNull(),
  slug: t.text().notNull().unique(),
  url: t.text().notNull().unique(),
  publish: t
    .text("publish", {
      enum: ["unpublish", "publish", "draft"],
    })
    .notNull()
    .default("draft"),
  content: t.text().notNull().default("<p></p>"),
}));
