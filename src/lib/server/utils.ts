import type { z } from "zod";
import { SECONDS_IN_A_WEEK } from "$lib/constants";
import { addresses, pickupLocations, sessions, users } from "$lib/server/db/schema";
import { db } from "$lib/server/db";
import { and, eq, lte } from "drizzle-orm";
import { env } from "$env/dynamic/private";
import oc from "opencage-api-client";
import type { ZodNewAddress, ZodCoordinates, OpenCageResponse } from "$lib/trpc/types";

export async function loadUserWithSession(sessionToken: string) {
  const userIdList = await db
    .select({ id: users.id })
    .from(users)
    .innerJoin(sessions, eq(sessions.user, users.id))
    .where(eq(sessions.token, sessionToken))
    .limit(1);

  if (userIdList.length === 0) return null;
  const userId = userIdList[0].id;

  const [userList, pickupLocationList] = await Promise.all([
    db.select()
      .from(users)
      .innerJoin(addresses, eq(addresses.id, users.address)),
    db.select({ id: pickupLocations.id })
      .from(pickupLocations)
      .where(eq(pickupLocations.owner, userId))
  ]);

  if (userList.length === 0) return null;
  return {
    ...userList[0].users,
    address: userList[0].addresses,
    pickupLocations: pickupLocationList.map(pl => pl.id)
  };
}

export async function cleanupSessionsForUser(userId: number) {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - SECONDS_IN_A_WEEK * 1000);

  await db
    .delete(sessions)
    .where(and(eq(sessions.user, userId), lte(sessions.updatedAt, weekAgo)));
}

export async function getCoordsForAddress(address: z.infer<typeof ZodNewAddress>): Promise<z.infer<typeof ZodCoordinates> | null> {
  if (!env.OPENCAGE_API_KEY) {
    throw new Error("OPENCAGE_API_KEY is not set");
  }

  const formattedAddress = `${address.lineOne}, ${address.city}, ${address.state} ${address.zipCode}`;
  const result = await oc.geocode({
    q: formattedAddress,
    key: env.OPENCAGE_API_KEY
  }) as OpenCageResponse;

  if (result.status.code !== 200) {
    throw new Error(`Error returned from OpenCage: ${result.status.message}`);
  } else if (result.results.length === 0) {
    return null;
  }

  return {
    latitude: result.results[0].geometry.lat,
    longitude: result.results[0].geometry.lng
  }
}
