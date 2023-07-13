import { SESSION_TOKEN_NAME } from "$lib/constants";
import { db } from "$lib/server/db";
import type { RequestEvent } from "@sveltejs/kit";
import type { inferAsyncReturnType } from "@trpc/server";

export async function createContext(event: RequestEvent) {
  const sessionToken = event.request.headers.get(SESSION_TOKEN_NAME);
  const user = sessionToken ?
    await db.selectFrom("users")
      .selectAll()
      .innerJoin("sessions", "users.id", "sessions.userId")
      .where("sessions.token", "=", sessionToken)
      .executeTakeFirst()
    : undefined;

  return {
    user,
    clientAddress: event.getClientAddress()
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
