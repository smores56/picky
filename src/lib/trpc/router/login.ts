import { z } from "zod";
import { uuid } from "uuidv4";
import * as scrypt from "scrypt-kdf";
import { cleanupSessionsForUser } from "$lib/server/utils";
import { router, publicProcedure } from "$lib/trpc/router/base";
import { db } from "$lib/server/db";

export const loginRouter = router({
  login: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await db
        .selectFrom("users")
        .select(["id", "passwordHash"])
        .where("email", "=", input.email)
        .executeTakeFirst();

      const passwordHashBytes = new TextEncoder().encode(user?.passwordHash || "");
      const validPassword = await scrypt.verify(passwordHashBytes, input.password);
      if (!user || !validPassword) {
        throw new Error("No account found with provided email/password");
      }

      await cleanupSessionsForUser(user.id);

      const existingSession = await db
        .selectFrom("sessions")
        .select("token")
        .where("origin", "=", ctx.clientAddress)
        .where("userId", "=", user.id)
        .executeTakeFirst();

      if (existingSession) {
        await db
          .updateTable("sessions")
          .set({ updatedAt: new Date() })
          .where("token", "=", existingSession.token)
          .execute();

        return existingSession.token;
      } else {
        const token = uuid();
        await db
          .insertInto("sessions")
          .values({
            token,
            origin: ctx.clientAddress,
            userId: user.id
          })
          .execute();

        return token;
      }
    })
});
