import { mergeRouters } from "$lib/trpc/router/base";
import { loginRouter } from "$lib/trpc/router/login";
import { registerRouter } from "$lib/trpc/router/register";
import { pickupLocationsRouter } from "$lib/trpc/router/pickupLocations";
import { locationRouter } from "$lib/trpc/router/location";
import { usersRouter } from "$lib/trpc/router/users";

export const appRouter = mergeRouters(
  loginRouter,
  registerRouter,
  usersRouter,
  pickupLocationsRouter,
  locationRouter
);

export type AppRouter = typeof appRouter;
