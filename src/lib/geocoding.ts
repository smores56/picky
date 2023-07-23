import { browser } from "$app/environment";
import type { createTRPCClient } from "trpc-sveltekit";
import type { NewAddress } from "$lib/server/db/schema";
import type { AppRouter } from "$lib/trpc/router";
import type { TRPCClientError } from "@trpc/client";

export async function getGeoPosition(): Promise<GeolocationPosition> {
  if (!browser || !navigator?.geolocation) {
    throw new Error("Location access is currently unavailable");
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => {
        if (error.code === GeolocationPositionError.PERMISSION_DENIED) {
          reject("Not allowed to access location");
        } else if (error.code === GeolocationPositionError.POSITION_UNAVAILABLE) {
          reject("Location access is currently unavailable");
        } else {
          reject("Location access timed out");
        }
      }
    );
  });
}

export async function getCurrentAddress(trpc: ReturnType<typeof createTRPCClient<AppRouter>>): Promise<NewAddress> {
  const position = await getGeoPosition();

  try {
    const address = await trpc.addressFromCoords.query({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
    if (!address) {
      throw new Error("Could not find current address");
    }

    return address;
  } catch (e) {
    const message = (e as TRPCClientError<any>).message;
    throw new Error(`Internal error: ${message}`);
  }
}