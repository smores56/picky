import { z } from "zod";
import { router, publicProcedure } from "$lib/trpc/router/base";
import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import { addresses, users } from "$lib/server/db/schema";
import * as argon2 from "argon2";
import { ZodNewAddress } from "$lib/trpc/types";
import { getCoordsForAddress } from "$lib/server/utils";

export const registerRouter = router({
  register: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        address: ZodNewAddress
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

      const [passwordHash, position] = await Promise.all([
        argon2.hash(input.password),
        getCoordsForAddress(input.address)
      ]);
      if (!position) {
        throw new Error(`Coordinates could not be determined for the given address`);
      }

      return await db.transaction(async (tx) => {
        const [{ id: newAddressId }] = await tx
          .insert(addresses)
          .values({
            ...input.address,
            latitude: position.latitude,
            longitude: position.longitude
          })
          .returning({ id: addresses.id });
        const [{ id: newUserId }] = await tx
          .insert(users)
          .values({
            email: input.email,
            passwordHash,
            firstName: input.firstName,
            lastName: input.lastName,
            address: newAddressId
          })
          .returning({ id: users.id });

        return newUserId;
      });
    })
});
