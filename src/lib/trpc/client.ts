import type { AppRouter } from "$lib/trpc/router";
import { createTRPCClient, type TRPCClientInit } from "trpc-sveltekit";
import { sessionToken } from "$lib/stores";
import { get } from "svelte/store";

let browserClient: ReturnType<typeof createTRPCClient<AppRouter>>;

export function trpc(init?: TRPCClientInit) {
  const isBrowser = typeof window !== "undefined";
  if (isBrowser && browserClient) return browserClient;

  const client = createTRPCClient<AppRouter>({
    init,
    headers: () => ({
      SESSION_TOKEN_NAME: get(sessionToken) || undefined
    })
  });

  if (isBrowser) browserClient = client;

  return client;
}
