import { boolean, date, integer, pgTable, primaryKey, real, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import type { InferModel } from "drizzle-orm";

export const addresses = pgTable("addresses", {
  id: serial("id").primaryKey(),
  lineOne: varchar("line_one").notNull(),
  lineTwo: varchar("line_two").notNull(),
  city: varchar("city").notNull(),
  state: varchar("state").notNull(),
  zipCode: varchar("zip_code").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  phoneNumber: varchar("phone_number").notNull()
});

export type Address = InferModel<typeof addresses>;
export type NewAddress = InferModel<typeof addresses, "insert">;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email").notNull().unique(),
  passwordHash: varchar("password_hash").notNull(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull()
});

export type User = InferModel<typeof users>;
export type NewUser = InferModel<typeof users, "insert">;

export const sessions = pgTable("sessions", {
  token: varchar("token").primaryKey(),
  origin: varchar("origin").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  user: integer("user_id").references(() => users.id, {
    onUpdate: "cascade",
    onDelete: "cascade"
  })
});

export type Session = InferModel<typeof sessions>;
export type NewSession = InferModel<typeof sessions, "insert">;

export const pickupLocations = pgTable("pickup_locations", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  owner: integer("owner_id").notNull().references(() => users.id, {
    onUpdate: "cascade",
    onDelete: "cascade"
  }),
  address: integer("address_id").references(() => addresses.id, {
    onUpdate: "cascade",
    onDelete: "set null"
  })
});

export type PickupLocation = InferModel<typeof pickupLocations>;
export type NewPickupLocation = InferModel<typeof pickupLocations, "insert">;

export const pickupLocationDayHours = pgTable("pickup_location_hours", {
  location: integer("location_id").notNull().references(() => pickupLocations.id, {
    onUpdate: "cascade",
    onDelete: "cascade"
  }),
  dayOfWeek: integer("day_of_week").notNull(),
  startingHour: integer("starting_hour"),
  startingMinute: integer("starting_minute"),
  endingHour: integer("ending_hour"),
  endingMinute: integer("ending_minute")
}, (table) => ({
  pk: primaryKey(table.location, table.dayOfWeek),
}));

export type PickupLocationDayHours = InferModel<typeof pickupLocationDayHours>;
export type NewPickupLocationDayHours = InferModel<typeof pickupLocationDayHours, "insert">;

export const pickupLocationClosedDays = pgTable("pickup_location_closed_days", {
  id: serial("id").primaryKey(),
  location: integer("location_id").notNull().references(() => pickupLocations.id, {
    onUpdate: "cascade",
    onDelete: "cascade"
  }),
  closed_date: date("closed_date").notNull()
});

export type PickupLocationClosedDay = InferModel<typeof pickupLocationClosedDays>;
export type NewPickupLocationClosedDay = InferModel<typeof pickupLocationClosedDays, "insert">;

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  itemName: varchar("item_name").notNull(),
  imageLink: varchar("image_link"),
  completed: boolean("completed").default(false).notNull(),
  currentLocation: integer("current_location_id").references(() => addresses.id, {
    onUpdate: "cascade",
    onDelete: "set null"
  }),
  pickupLocation: integer("pickup_location_id").references(() => pickupLocations.id, {
    onUpdate: "cascade",
    onDelete: "set null"
  })
});

export type Order = InferModel<typeof orders>;
export type NewOrder = InferModel<typeof orders, "insert">;
