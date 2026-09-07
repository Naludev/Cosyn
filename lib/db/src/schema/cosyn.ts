import { createInsertSchema } from "drizzle-zod";
import { boolean, date, integer, pgTable, serial, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const usersTable = pgTable("cosyn_users", {
  id: serial("id").primaryKey(),
  clerkId: text("clerk_id").notNull().unique(),
  username: text("username").notNull(),
  avatarUrl: text("avatar_url").notNull(),
  bannerUrl: text("banner_url").notNull(),
  bio: text("bio").notNull().default(""),
  country: text("country").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const conventionsTable = pgTable("cosyn_conventions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  city: text("city").notNull(),
  venue: text("venue").notNull(),
  address: text("address").notNull(),
  startDate: date("start_date", { mode: "string" }).notNull(),
  endDate: date("end_date", { mode: "string" }).notNull(),
  description: text("description").notNull(),
  bannerUrl: text("banner_url").notNull(),
  websiteUrl: text("website_url"),
  ticketUrl: text("ticket_url"),
  category: text("category").notNull(),
  organizer: text("organizer").notNull(),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const attendanceTable = pgTable("cosyn_attendance", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  conventionId: integer("convention_id").notNull().references(() => conventionsTable.id),
  cosplayCharacter: text("cosplay_character").notNull().default(""),
  fandom: text("fandom").notNull().default(""),
  cosplayProgress: text("cosplay_progress").notNull().default("Planning"),
  cosplayPictureUrl: text("cosplay_picture_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userConventionUnique: uniqueIndex("cosyn_attendance_user_convention_idx").on(table.userId, table.conventionId),
}));

export const postsTable = pgTable("cosyn_posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  body: text("body").notNull(),
  imageUrl: text("image_url"),
  likes: integer("likes").notNull().default(0),
  comments: integer("comments").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const chatsTable = pgTable("cosyn_chats", {
  id: serial("id").primaryKey(),
  conventionId: integer("convention_id").notNull().references(() => conventionsTable.id),
  name: text("name").notNull(),
});

export const messagesTable = pgTable("cosyn_messages", {
  id: serial("id").primaryKey(),
  chatId: integer("chat_id").notNull().references(() => chatsTable.id),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  body: text("body").notNull(),
  reactions: integer("reactions").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const groupsTable = pgTable("cosyn_groups", {
  id: serial("id").primaryKey(),
  conventionId: integer("convention_id").notNull().references(() => conventionsTable.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  characters: text("characters").notNull(),
  meetingPlace: text("meeting_place").notNull(),
  meetingTime: text("meeting_time").notNull(),
});

export const groupMembersTable = pgTable("cosyn_group_members", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").notNull().references(() => groupsTable.id),
  userId: integer("user_id").notNull().references(() => usersTable.id),
}, (table) => ({
  groupUserUnique: uniqueIndex("cosyn_group_member_unique_idx").on(table.groupId, table.userId),
}));

export const photoshootsTable = pgTable("cosyn_photoshoots", {
  id: serial("id").primaryKey(),
  conventionId: integer("convention_id").notNull().references(() => conventionsTable.id),
  title: text("title").notNull(),
  date: date("date", { mode: "string" }).notNull(),
  time: text("time").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  rsvpCount: integer("rsvp_count").notNull().default(0),
});

export const photoRsvpsTable = pgTable("cosyn_photo_rsvps", {
  id: serial("id").primaryKey(),
  photoshootId: integer("photoshoot_id").notNull().references(() => photoshootsTable.id),
  userId: integer("user_id").notNull().references(() => usersTable.id),
});

export const friendRequestsTable = pgTable("cosyn_friend_requests", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull().references(() => usersTable.id),
  recipientId: integer("recipient_id").notNull().references(() => usersTable.id),
  status: text("status").notNull().default("pending"),
});

export const friendsTable = pgTable("cosyn_friends", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  friendId: integer("friend_id").notNull().references(() => usersTable.id),
});

export const insertConventionSchema = createInsertSchema(conventionsTable).omit({ id: true, createdAt: true });
export type InsertConvention = z.infer<typeof insertConventionSchema>;
export type Convention = typeof conventionsTable.$inferSelect;