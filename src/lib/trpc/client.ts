import { SESSION_TOKEN_NAME } from "$lib/constants";
import type { AppRouter } from "$lib/trpc/router";
import { createTRPCClient, type TRPCClientInit } from "trpc-sveltekit";

let browserClient: ReturnType<typeof createTRPCClient<AppRouter>>;

export function trpc(init?: TRPCClientInit) {
  const isBrowser = typeof window !== "undefined";
  if (isBrowser && browserClient) return browserClient;

  const client = createTRPCClient<AppRouter>({
    init,
    headers: () => ({
      SESSION_TOKEN_NAME: localStorage?.getItem(SESSION_TOKEN_NAME) || undefined
    })
  });

  if (isBrowser) browserClient = client;

  return client;
}
