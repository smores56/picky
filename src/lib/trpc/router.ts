import { mergeRouters } from "$lib/trpc/base-router";
import { loginRouter } from "$lib/server/routes/login";

export const appRouter = mergeRouters(loginRouter);

export type AppRouter = typeof appRouter;
