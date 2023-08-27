import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "$lib/server/db";
import { router, publicProcedure } from "$lib/trpc/router/base";
import { addresses, orders, pickupLocations, pickupLocationDayHours } from "$lib/server/db/schema";
import { DDPoint, Haversine } from "haversine-ts";
import * as hav from "haversine-ts";
import { ZodNewAddress, ZodNewHours } from "$lib/trpc/types";

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
      const pickupLocation = await db.query
        .pickupLocations
        .findFirst({ where: eq(pickupLocations.id, input.id) });
      if (!pickupLocation) {
        throw new Error(`No pickup location found with id ${input.id}`);
      }

      const [locationAddress, locationOrders] = await Promise.all([
        db.query.addresses.findFirst({ where: eq(addresses.id, pickupLocation.address || 0) }),
        db.query.orders.findMany({ where: eq(orders.pickupLocation, pickupLocation.id) }),
      ]);

      return {
        ...pickupLocation,
        address: locationAddress!,
        orders: locationOrders
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
      hours: ZodNewHours
    }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;
      if (!user) {
        throw new Error("Must be logged in to register pickup location");
      }
      if (input.hours.length != 7) {
        throw new Error("Must have exactly 7 business-hour entries");
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
        input.hours.forEach(async (dayHours, day) => {
          await tx.insert(pickupLocationDayHours)
            .values({
              location: newLocationId,
              dayOfWeek: day,
              ...dayHours
            })
        })

        return newLocationId;
      })
    }),
})
