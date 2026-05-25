import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const gcgTable = pgTable("gcg", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  uploaderId: integer("uploader_id").references(() => usersTable.id),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
