import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const boardMembersTable = pgTable("board_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  position: text("position"),
  photoUrl: text("photo_url").notNull(),
  type: text("type").notNull(), // 'direksi' | 'komisaris'
  orderIndex: integer("order_index").default(0).notNull(),
  uploaderId: integer("uploader_id").references(() => usersTable.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
