import { pgTable, serial, text, integer, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const directorDecreesTable = pgTable("director_decrees", {
  id: serial("id").primaryKey(),
  number: text("number").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  effectiveDate: date("effective_date"),
  pdfUrl: text("pdf_url").notNull(),
  coverImageUrl: text("cover_image_url"),
  uploaderId: integer("uploader_id").references(() => usersTable.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertDirectorDecreeSchema = createInsertSchema(directorDecreesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertDirectorDecree = z.infer<typeof insertDirectorDecreeSchema>;
export type DirectorDecree = typeof directorDecreesTable.$inferSelect;
