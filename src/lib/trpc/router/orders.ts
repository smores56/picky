import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { db } from "$lib/server/db";
import { router, publicProcedure } from "$lib/trpc/router/base";
import { orders, pickupLocations } from "$lib/server/db/schema";
import { choice } from "$lib/server/utils";

export const ordersRouter = router({
  completeOrder: publicProcedure
    .input(z.object({
      orderId: z.number().int()
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new Error("Must be logged in");
      }
      // TODO: validate that order exists and user owns pickup location order is from

      await db.update(orders).set({ completed: true }).where(eq(orders.id, input.orderId));
    }),
  ordersForPickupLocation: publicProcedure
    .input(z.object({
      pickupLocationId: z.number().int(),
    }))
    .query(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new Error("Must be logged in");
      }

      const pl = await db.query.pickupLocations.findFirst({
        columns: { owner: true },
        where: eq(pickupLocations.id, input.pickupLocationId)
      });
      if (!pl) {
        throw new Error(`No pickup location found with id ${input.pickupLocationId}`);
      } else if (pl.owner !== ctx.user.id) {
        throw new Error(`Mock order generation is only allowed for your own pickup locations`);
      }

      return await db.query.orders.findMany({
        where: and(
          eq(orders.pickupLocation, input.pickupLocationId),
          eq(orders.completed, false),
        )
      })
    }),
  generateMockOrders: publicProcedure
    .input(z.object({
      pickupLocationId: z.number().int(),
      quantity: z.number().int(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new Error("Must be logged in");
      }

      const pl = await db.query.pickupLocations.findFirst({
        columns: { owner: true },
        where: eq(pickupLocations.id, input.pickupLocationId)
      });
      if (!pl) {
        throw new Error(`No pickup location found with id ${input.pickupLocationId}`);
      } else if (pl.owner !== ctx.user.id) {
        throw new Error(`Mock order generation is only allowed for your own pickup locations`);
      }

      const colors = ["Red", "Orange", "Yellow", "Green", "Blue", "Purple"];
      const sizes = ["Small", "Medium", "Large"];
      const items = ["Toy", "Purse", "Pair of Shoes", "Charger", "Pillow", "Mouse"];

      return await db.transaction(async tx => {
        const newOrderIds = [] as number[];

        for (var i = 0; i < input.quantity; i++) {
          const itemName = `${choice(sizes)} ${choice(colors)} ${choice(items)}`;
          const imageLink = "https://picsum.photos/300/200";

          const [{ id: newOrderId }] = await tx.insert(orders).values({
            itemName,
            imageLink,
            pickupLocation: input.pickupLocationId,
          }).returning({
            id: orders.id
          });

          newOrderIds.push(newOrderId);
        }

        return newOrderIds;
      });
    }),
});
