import { z } from "zod";
import * as scrypt from "scrypt-kdf";
import { router, publicProcedure } from "$lib/trpc/router/base";
import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import { addresses, users } from "$lib/server/db/schema";
import { SCRYPT_PARAMS } from "$lib/constants";

const ZodNewAddress = z.object({
  lineOne: z.string(),
  lineTwo: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  country: z.string()
});

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

      const passwordHashBytes = await scrypt.kdf(input.password, SCRYPT_PARAMS);
      const passwordHash = new TextDecoder().decode(passwordHashBytes);

      return await db.transaction(async (tx) => {
        const [{ id: newAddressId }] = await tx
          .insert(addresses)
          .values({
            ...input.address
          })
          .returning({ id: addresses.id });
        const [{ id: newUserId }] = await tx
          .insert(users)
          .values({
            email: input.email,
            passwordHash,
            firstName: input.firstName,
            lastName: input.lastName,
            addressId: newAddressId
          })
          .returning({ id: users.id });

        return newUserId;
      });
    })
});
