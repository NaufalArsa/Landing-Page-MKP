import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const gratificationReportsTable = pgTable("gratification_reports", {
  id: serial("id").primaryKey(),
  year: integer("year").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  pdfUrl: text("pdf_url").notNull(),
  coverImageUrl: text("cover_image_url"),
  uploaderId: integer("uploader_id").references(() => usersTable.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertGratificationReportSchema = createInsertSchema(gratificationReportsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertGratificationReport = z.infer<typeof insertGratificationReportSchema>;
export type GratificationReport = typeof gratificationReportsTable.$inferSelect;
