import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  preferences: jsonb("preferences").default({
    interests: [],
    budget: { min: 500, max: 2000 },
    duration: { min: 3, max: 10 }
  }).notNull(),
});

export const cities = pgTable("cities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  mainImage: text("main_image").notNull(),
  description: text("description").notNull(),
  additionalImages: jsonb("additional_images").$type<string[]>().notNull(),
  tags: jsonb("tags").$type<string[]>().notNull(),
  coordinates: jsonb("coordinates").$type<{ lat: number, lng: number }>().notNull(),
  localInfo: jsonb("local_info").$type<{
    weather: string;
    language: string;
    currency: string;
    bestSeason: string;
  }>().notNull(),
});

export const pois = pgTable("pois", {
  id: serial("id").primaryKey(),
  cityId: integer("city_id").references(() => cities.id).notNull(),
  name: text("name").notNull(),
  image: text("image").notNull(),
  description: text("description"),
  tags: jsonb("tags").$type<string[]>().notNull(),
});

export const routes = pgTable("routes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  cities: jsonb("cities").$type<number[]>().notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  price: integer("price").notNull(),
  color: text("color").notNull(),
});

export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  routeId: integer("route_id").references(() => routes.id).notNull(),
  dateAdded: timestamp("date_added").defaultNow().notNull(),
});

export const swipes = pgTable("swipes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  cityId: integer("city_id").references(() => cities.id).notNull(),
  liked: boolean("liked").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  preferences: true,
});

export const insertCitySchema = createInsertSchema(cities);
export const insertPoiSchema = createInsertSchema(pois);
export const insertRouteSchema = createInsertSchema(routes);
export const insertFavoriteSchema = createInsertSchema(favorites).omit({ dateAdded: true });
export const insertSwipeSchema = createInsertSchema(swipes).omit({ timestamp: true });

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCity = z.infer<typeof insertCitySchema>;
export type City = typeof cities.$inferSelect;

export type InsertPoi = z.infer<typeof insertPoiSchema>;
export type Poi = typeof pois.$inferSelect;

export type InsertRoute = z.infer<typeof insertRouteSchema>;
export type Route = typeof routes.$inferSelect;

export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favorites.$inferSelect;

export type InsertSwipe = z.infer<typeof insertSwipeSchema>;
export type Swipe = typeof swipes.$inferSelect;
