import { router, publicProcedure } from "$lib/trpc/router/base";

export const usersRouter = router({
  currentUser: publicProcedure
    .query(({ ctx }) => ctx.user),
});
