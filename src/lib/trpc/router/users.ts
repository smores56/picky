import { z } from "zod";
import { uuid } from "uuidv4";
import { cleanupSessionsForUser } from "$lib/server/utils";
import { router, publicProcedure } from "$lib/trpc/router/base";
import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import { addresses, sessions, users } from "$lib/server/db/schema";
import * as argon2 from "argon2";
import { ZodNewAddress } from "$lib/trpc/types";
import { getCoordsForAddress } from "$lib/server/utils";

export const usersRouter = router({
  currentUser: publicProcedure
    .query(({ ctx }) => ctx.user),
  login: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await db.query.users.findFirst({
        where: eq(users.email, input.email)
      });
      if (!user) {
        throw new Error("No account found with provided email/password");
      }

      const validPassword = await argon2.verify(user.passwordHash, input.password);
      if (!validPassword) {
        throw new Error("No account found with provided email/password");
      }

      await cleanupSessionsForUser(user.id);

      const existingSessions = await db
        .select()
        .from(sessions)
        .where(eq(sessions.origin, ctx.clientAddress))
        .where(eq(sessions.user, user.id));

      if (existingSessions.length > 0) {
        await db
          .update(sessions)
          .set({ updatedAt: new Date() })
          .where(eq(sessions.token, existingSessions[0].token));

        return existingSessions[0].token;
      } else {
        const token = uuid();
        await db.insert(sessions).values({
          token,
          origin: ctx.clientAddress,
          user: user.id
        });

        return token;
      }
    }),
  register: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
        firstName: z.string(),
        lastName: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const usersWithEmail = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, input.email));
      if (usersWithEmail.length > 0) {
        throw new Error("A user already has that email address");
      }

      const passwordHash = await Promise.all([
        argon2.hash(input.password),
      ]);

      return await db.transaction(async (tx) => {
        const [{ id: newUserId }] = await tx
          .insert(users)
          .values({
            email: input.email,
            passwordHash,
            firstName: input.firstName,
            lastName: input.lastName
          })
          .returning({ id: users.id });

        return newUserId;
      });
    })
});
