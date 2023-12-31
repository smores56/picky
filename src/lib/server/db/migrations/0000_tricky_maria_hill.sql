CREATE TABLE IF NOT EXISTS "addresses" (
	"id" serial PRIMARY KEY NOT NULL,
	"line_one" varchar NOT NULL,
	"line_two" varchar NOT NULL,
	"city" varchar NOT NULL,
	"state" varchar NOT NULL,
	"zip_code" varchar NOT NULL,
	"latitude" real NOT NULL,
	"longitude" real NOT NULL,
	"phone_number" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_name" varchar NOT NULL,
	"image_link" varchar,
	"completed" boolean DEFAULT false NOT NULL,
	"current_location_id" integer,
	"pickup_location_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pickup_location_closed_days" (
	"id" serial PRIMARY KEY NOT NULL,
	"location_id" integer NOT NULL,
	"closed_date" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pickup_location_hours" (
	"location_id" integer NOT NULL,
	"day_of_week" integer NOT NULL,
	"starting_hour" integer,
	"ending_hour" integer,
	CONSTRAINT pickup_location_hours_location_id_day_of_week PRIMARY KEY("location_id","day_of_week")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pickup_locations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"owner_id" integer NOT NULL,
	"address_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"token" varchar PRIMARY KEY NOT NULL,
	"origin" varchar NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"user_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar NOT NULL,
	"password_hash" varchar NOT NULL,
	"first_name" varchar NOT NULL,
	"last_name" varchar NOT NULL,
	"address_id" integer,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_current_location_id_addresses_id_fk" FOREIGN KEY ("current_location_id") REFERENCES "addresses"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_pickup_location_id_pickup_locations_id_fk" FOREIGN KEY ("pickup_location_id") REFERENCES "pickup_locations"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pickup_location_closed_days" ADD CONSTRAINT "pickup_location_closed_days_location_id_pickup_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "pickup_locations"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pickup_location_hours" ADD CONSTRAINT "pickup_location_hours_location_id_pickup_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "pickup_locations"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pickup_locations" ADD CONSTRAINT "pickup_locations_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pickup_locations" ADD CONSTRAINT "pickup_locations_address_id_addresses_id_fk" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_address_id_addresses_id_fk" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
