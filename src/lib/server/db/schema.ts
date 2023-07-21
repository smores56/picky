import { boolean, integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import type { InferModel } from "drizzle-orm";

export const addresses = pgTable("addresses", {
  id: serial("id").primaryKey(),
  lineOne: varchar("line_one").notNull(),
  lineTwo: varchar("line_two").notNull(),
  city: varchar("city").notNull(),
  state: varchar("state").notNull(),
  zipCode: varchar("zip_code").notNull(),
  country: varchar("country").notNull(),
  phoneNumber: varchar("phone_number").notNull()
});

export type Address = InferModel<typeof addresses>;
export type NewAddress = InferModel<typeof addresses, "insert">;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email").notNull().unique(),
  passwordHash: varchar("password_hash").notNull(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  addressId: integer("address_id").references(() => addresses.id, {
    onUpdate: "cascade",
    onDelete: "set null"
  })
});

export type User = InferModel<typeof users>;
export type NewUser = InferModel<typeof users, "insert">;

export const sessions = pgTable("sessions", {
  token: varchar("token").primaryKey(),
  origin: varchar("origin").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  userId: integer("user_id").references(() => users.id, {
    onUpdate: "cascade",
    onDelete: "cascade"
  })
});

export type Session = InferModel<typeof sessions>;
export type NewSession = InferModel<typeof sessions, "insert">;

export const pickupLocations = pgTable("pickup_locations", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  addressId: integer("address_id").references(() => addresses.id, {
    onUpdate: "cascade",
    onDelete: "set null"
  })
});

export type PickupLocation = InferModel<typeof pickupLocations>;
export type NewPickupLocation = InferModel<typeof pickupLocations, "insert">;

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  itemName: varchar("item_name").notNull(),
  imageLink: varchar("image_link"),
  completed: boolean("completed").default(false).notNull(),
  currentLocationId: integer("current_location_id").references(() => addresses.id, {
    onUpdate: "cascade",
    onDelete: "set null"
  }),
  pickupLocationId: integer("pickup_location_id").references(() => pickupLocations.id, {
    onUpdate: "cascade",
    onDelete: "set null"
  })
});

export type Order = InferModel<typeof orders>;
export type NewOrder = InferModel<typeof orders, "insert">;
