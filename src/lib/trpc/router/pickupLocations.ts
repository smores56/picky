import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "$lib/server/db";
import { router, publicProcedure } from "$lib/trpc/router/base";
import { addresses, pickupLocations } from "$lib/server/db/schema";
import { DDPoint, Haversine } from "haversine-ts";
import * as hav from "haversine-ts";
import { ZodNewAddress } from "$lib/trpc/types";

export const pickupLocationsRouter = router({
  pickupLocationsForUser: publicProcedure.query(async ({ ctx }) => {
    return await db.query.pickupLocations.findMany({
      where: eq(pickupLocations.owner, ctx.user?.id ?? -1)
    })
  }),
  pickupLocation: publicProcedure
    .input(
      z.object({
        id: z.number().int()
      })
    )
    .query(async ({ input }) => {
      const locationList = await db.select().from(pickupLocations)
        .innerJoin(addresses, eq(addresses.id, pickupLocations.address))
        .where(eq(pickupLocations.id, input.id));

      if (locationList.length === 0) {
        throw new Error(`No pickup location found with id ${input.id}`);
      }

      return {
        ...locationList[0].pickup_locations,
        address: locationList[0].addresses
      };
    }),
  pickupLocationsWithinDistance: publicProcedure
    .input(z.object({
      latitude: z.number(),
      longitude: z.number(),
      withinMiles: z.number().positive()
    }))
    .query(async ({ input }) => {
      const allAddresses = await db.select({
        latitude: addresses.latitude,
        longitude: addresses.longitude,
      })
        .from(pickupLocations)
        .innerJoin(addresses, eq(pickupLocations.address, addresses.id));

      const origin = new DDPoint(input.latitude, input.longitude);
      const haversine = new Haversine(hav.UnitOfDistance.Mile);

      return allAddresses.filter(address => {
        const point = new DDPoint(address.latitude, address.longitude);
        return haversine.getDistance(origin, point) <= input.withinMiles;
      });
    }),
  registerPickupLocation: publicProcedure
    .input(z.object({
      name: z.string(),
      address: ZodNewAddress,
    }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;
      if (!user) {
        throw new Error("Must be logged in to register pickup location");
      }

      return await db.transaction(async tx => {
        const [{ id: newAddressId }] = await tx.insert(addresses)
          .values(input.address)
          .returning({ id: addresses.id });
        const [{ id: newLocationId }] = await tx.insert(pickupLocations)
          .values({
            name: input.name,
            owner: user.id,
            address: newAddressId
          })
          .returning({ id: pickupLocations.id });

        return newLocationId;
      })
    }),
})