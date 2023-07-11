import { Kysely, PostgresDialect, sql } from "kysely";

/**
 * @param db {Kysely<PostgresDialect>}
 */
export async function up(db) {
  await db.schema
    .createTable("addresses")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("line_one", "varchar(100)", (col) => col.notNull())
    .addColumn("line_two", "varchar(100)", (col) => col.notNull())
    .addColumn("city", "varchar(100)", (col) => col.notNull())
    .addColumn("state", "varchar(100)", (col) => col.notNull())
    .addColumn("zip_code", "varchar(100)", (col) => col.notNull())
    .addColumn("country", "varchar(100)", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("users")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("email", "varchar(100)", (col) => col.unique())
    .addColumn("password_hash", "varchar(100)", (col) => col.notNull())
    .addColumn("firstName", "varchar(100)", (col) => col.notNull())
    .addColumn("lastName", "varchar(100)", (col) => col.notNull())
    .addColumn("address_id", "integer", (col) =>
      col.references("addresses.id").onUpdate("cascade").onDelete("set null")
    )
    .execute();

  await db.schema
    .createTable("sessions")
    .addColumn("token", "varchar(100)", (col) => col.primaryKey())
    .addColumn("origin", "varchar(100)", (col) => col.notNull())
    .addColumn("updated_at", "timestamp", (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn("user_id", "integer", (col) =>
      col.references("users.id").onUpdate("cascade").onDelete("cascade").notNull()
    )
    .execute();

  await db.schema
    .createTable("pickup_locations")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("name", "varchar(100)", (col) => col.notNull())
    .addColumn("address_id", "integer", (col) =>
      col.references("addresses.id").onUpdate("cascade").onDelete("set null")
    )
    .execute();

  await db.schema
    .createTable("orders")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("item_name", "varchar(100)", (col) => col.notNull())
    .addColumn("image_link", "varchar(2000)")
    .addColumn("completed", "boolean", (col) => col.defaultTo(false).notNull())
    .addColumn("current_location_id", "integer", (col) =>
      col.references("addresses.id").onUpdate("cascade").onDelete("set null")
    )
    .addColumn("pickup_location_id", "integer", (col) =>
      col.references("pickup_locations.id").onUpdate("cascade").onDelete("set null")
    )
    .execute();
}

/**
 * @param db {Kysely<PostgresDialect>}
 */
export async function down(db) {
  for (const tableName in ["orders", "pickup_locations", "sessions", "users", "addresses"]) {
    await db.schema.dropTable(tableName).execute();
  }
}
