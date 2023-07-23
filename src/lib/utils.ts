import { browser } from "$app/environment";
import { SESSION_TOKEN_NAME } from "$lib/constants";
import type { Address } from "$lib/server/db/schema";

export function getSessionToken(): string | undefined {
  if (!browser) return undefined;

  return sessionStorage.getItem(SESSION_TOKEN_NAME)
    ?? localStorage.getItem(SESSION_TOKEN_NAME)
    ?? undefined;
}

export function formatAddress(address: Address): string {
  const streetLocation = address.lineTwo ? `${address.lineOne} ${address.lineTwo}` : address.lineOne;

  return `${streetLocation}, ${address.city}, ${address.state} ${address.zipCode}`;
}