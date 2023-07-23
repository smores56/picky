import { SESSION_TOKEN_NAME } from "$lib/constants";
import { loadUserWithSession } from "$lib/server/utils";
import type { RequestEvent } from "@sveltejs/kit";
import type { inferAsyncReturnType } from "@trpc/server";

export async function createContext(event: RequestEvent) {
  const sessionToken = event.request.headers.get(SESSION_TOKEN_NAME);
  const user = sessionToken ? await loadUserWithSession(sessionToken) : null;

  return {
    user,
    clientAddress: event.getClientAddress()
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
