import { mergeRouters } from "$lib/trpc/router/base";
import { loginRouter } from "$lib/trpc/router/login";
import { registerRouter } from "$lib/trpc/router/register";

export const appRouter = mergeRouters(loginRouter, registerRouter);

export type AppRouter = typeof appRouter;
