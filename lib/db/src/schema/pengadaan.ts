import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const pengadaanTable = pgTable("pengadaan", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  pdfUrl: text("pdf_url").notNull(),
  coverImageUrl: text("cover_image_url").notNull(),
  uploaderId: integer("uploader_id").references(() => usersTable.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
