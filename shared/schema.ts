import { pgTable, text, serial, integer, boolean, timestamp, jsonb, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  phone: text("phone"),
  fullName: text("full_name"),
  isVerified: boolean("is_verified").default(false),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const cars = pgTable("cars", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  price: integer("price").notNull(),
  mileage: integer("mileage"),
  color: text("color"),
  fuelType: text("fuel_type"),
  transmission: text("transmission"),
  description: text("description"),
  condition: text("condition"),
  imageUrls: text("image_urls").array(),
  location: text("location"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  features: text("features").array(),
  isActive: boolean("is_active").default(true),
  listingType: text("listing_type").default("regular"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const favorites = pgTable("favorites", {
  userId: integer("user_id").references(() => users.id),
  carId: integer("car_id").references(() => cars.id),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.carId] }),
}));

export const carComparisons = pgTable("car_comparisons", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  carIds: integer("car_ids").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const carShops = pgTable("car_shops", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  phone: text("phone"),
  website: text("website"),
  types: text("types").array(),
  rating: integer("rating"),
});

export const carMaintenanceShops = pgTable("car_maintenance_shops", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  phone: text("phone"),
  website: text("website"),
  services: text("services").array(),
  rating: integer("rating"),
});

// Insert and select schemas

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  isVerified: true,
}).extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
});

export const insertCarSchema = createInsertSchema(cars).omit({
  id: true,
  createdAt: true,
  isActive: true,
  userId: true,
});

export const insertFavoriteSchema = createInsertSchema(favorites);
export const insertCarComparisonSchema = createInsertSchema(carComparisons).omit({
  id: true,
  createdAt: true,
});

export const insertCarShopSchema = createInsertSchema(carShops).omit({
  id: true,
});

export const insertCarMaintenanceShopSchema = createInsertSchema(carMaintenanceShops).omit({
  id: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCar = z.infer<typeof insertCarSchema>;
export type Car = typeof cars.$inferSelect;

export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favorites.$inferSelect;

export type InsertCarComparison = z.infer<typeof insertCarComparisonSchema>;
export type CarComparison = typeof carComparisons.$inferSelect;

export type InsertCarShop = z.infer<typeof insertCarShopSchema>;
export type CarShop = typeof carShops.$inferSelect;

export type InsertCarMaintenanceShop = z.infer<typeof insertCarMaintenanceShopSchema>;
export type CarMaintenanceShop = typeof carMaintenanceShops.$inferSelect;
