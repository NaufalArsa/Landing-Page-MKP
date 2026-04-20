import { pgTable, serial, text, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const newsStatusEnum = pgEnum("news_status", ["draft", "published", "archived"]);

export const newsTable = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content"),
  imageUrl: text("image_url"),
  category: text("category"),
  status: newsStatusEnum("status").notNull().default("draft"),
  uploaderId: integer("uploader_id").references(() => usersTable.id).notNull(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertNewsSchema = createInsertSchema(newsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertNews = z.infer<typeof insertNewsSchema>;
export type News = typeof newsTable.$inferSelect;
