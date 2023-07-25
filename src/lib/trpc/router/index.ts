import { mergeRouters } from "$lib/trpc/router/base";
import { usersRouter } from "$lib/trpc/router/users";
import { ordersRouter } from "$lib/trpc/router/orders";
import { pickupLocationsRouter } from "$lib/trpc/router/pickupLocations";
import { positionRouter } from "$lib/trpc/router/position";

export const appRouter = mergeRouters(
  usersRouter,
  ordersRouter,
  pickupLocationsRouter,
  positionRouter
);

export type AppRouter = typeof appRouter;
