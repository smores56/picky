import { mergeRouters } from "$lib/trpc/router/base";
import { loginRouter } from "$lib/trpc/router/login";

export const appRouter = mergeRouters(loginRouter);

export type AppRouter = typeof appRouter;
