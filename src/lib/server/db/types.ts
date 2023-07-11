import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Addresses {
  id: Generated<number>;
  lineOne: string;
  lineTwo: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Orders {
  id: Generated<number>;
  itemName: string;
  imageLink: string | null;
  completed: Generated<boolean>;
  currentLocationId: number | null;
  pickupLocationId: number | null;
}

export interface PickupLocations {
  id: Generated<number>;
  name: string;
  addressId: number | null;
}

export interface Sessions {
  token: string;
  origin: string;
  updatedAt: Generated<Timestamp>;
  userId: number;
}

export interface Users {
  id: Generated<number>;
  email: string | null;
  passwordHash: string;
  firstName: string;
  lastName: string;
  addressId: number | null;
}

export interface Database {
  addresses: Addresses;
  orders: Orders;
  pickupLocations: PickupLocations;
  sessions: Sessions;
  users: Users;
}
