import { pgTable, text, serial, integer, boolean, timestamp, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("contributor"), // admin, contributor
});

export const disasters = pgTable("disasters", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  locationName: text("location_name").notNull(),
  latitude: real("latitude"),
  longitude: real("longitude"),
  description: text("description").notNull(),
  tags: text("tags").array().notNull().default([]),
  ownerId: text("owner_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  auditTrail: jsonb("audit_trail").notNull().default([]),
});

export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  disasterId: integer("disaster_id").notNull(),
  userId: text("user_id").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  verificationStatus: text("verification_status").notNull().default("pending"), // pending, verified, rejected
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  disasterId: integer("disaster_id"),
  name: text("name").notNull(),
  locationName: text("location_name").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  type: text("type").notNull(), // shelter, hospital, food, etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cache = pgTable("cache", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

export const socialMediaPosts = pgTable("social_media_posts", {
  id: serial("id").primaryKey(),
  disasterId: integer("disaster_id"),
  content: text("content").notNull(),
  user: text("user").notNull(),
  platform: text("platform").notNull().default("twitter"),
  priority: text("priority").notNull().default("normal"), // normal, priority, official
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertDisasterSchema = createInsertSchema(disasters).omit({
  id: true,
  createdAt: true,
  auditTrail: true,
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  createdAt: true,
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  createdAt: true,
});

export const insertSocialMediaPostSchema = createInsertSchema(socialMediaPosts).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Disaster = typeof disasters.$inferSelect;
export type InsertDisaster = z.infer<typeof insertDisasterSchema>;

export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;

export type Resource = typeof resources.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;

export type SocialMediaPost = typeof socialMediaPosts.$inferSelect;
export type InsertSocialMediaPost = z.infer<typeof insertSocialMediaPostSchema>;

export type CacheEntry = typeof cache.$inferSelect;
