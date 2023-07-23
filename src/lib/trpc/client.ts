import type { AppRouter } from "$lib/trpc/router";
import { createTRPCClient, type TRPCClientInit } from "trpc-sveltekit";
import { getSessionToken } from "$lib/utils";
import { SESSION_TOKEN_NAME } from "$lib/constants";

let browserClient: ReturnType<typeof createTRPCClient<AppRouter>>;

export function trpc(init?: TRPCClientInit) {
  const isBrowser = typeof window !== "undefined";
  if (isBrowser && browserClient) return browserClient;

  const client = createTRPCClient<AppRouter>({
    init,
    headers: () => ({
      [SESSION_TOKEN_NAME]: getSessionToken()
    })
  });

  if (isBrowser) browserClient = client;

  return client;
}
