ALTER TABLE "users" DROP CONSTRAINT "users_address_id_addresses_id_fk";
--> statement-breakpoint
ALTER TABLE "pickup_location_hours" ADD COLUMN "starting_minute" integer;--> statement-breakpoint
ALTER TABLE "pickup_location_hours" ADD COLUMN "ending_minute" integer;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "address_id";