import { router, publicProcedure } from "$lib/trpc/router/base";
import * as oc from "opencage-api-client";
import { env } from "$env/dynamic/private";
import type { NewAddress } from "$lib/server/db/schema";
import { ZodCoordinates, type OpenCageResponse, ZodNewAddress } from "$lib/trpc/types";
import { getCoordsForAddress } from "$lib/server/utils";

export const locationRouter = router({
  coordsFromAddress: publicProcedure
    .input(ZodNewAddress)
    .query(async ({ input }) => {
      return await getCoordsForAddress(input);
    }),
  addressFromCoords: publicProcedure
    .input(ZodCoordinates)
    .query(async ({ input }) => {
      if (!env.OPENCAGE_API_KEY) {
        throw new Error("OPENCAGE_API_KEY is not set");
      }

      const result = await oc.geocode({
        q: `${input.latitude},${input.longitude}`,
        key: env.OPENCAGE_API_KEY
      }) as OpenCageResponse;

      if (result.status.code !== 200) {
        throw new Error(`Error returned from OpenCage: ${result.status.message}`);
      } else if (result.results.length === 0) {
        return null;
      }

      const address = result.results[0].components;
      return {
        latitude: input.latitude,
        longitude: input.longitude,
        lineOne: address.house_number ? `${address.house_number} ${address.road}` : address.road,
        lineTwo: "",
        city: address.city,
        state: address.state,
        zipCode: address.postcode,
        phoneNumber: ""
      } satisfies NewAddress;
    }),
});
