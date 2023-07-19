import { SESSION_TOKEN_NAME } from "$lib/constants";
import { db } from "$lib/server/db";
import { sessions, users } from "$lib/server/db/schema";
import type { RequestEvent } from "@sveltejs/kit";
import type { inferAsyncReturnType } from "@trpc/server";
import { eq } from "drizzle-orm";

export async function createContext(event: RequestEvent) {
  const sessionToken = event.request.headers.get(SESSION_TOKEN_NAME);
  const user = sessionToken
    ? (
        await db
          .select(users._.columns)
          .from(users)
          .innerJoin(sessions, eq(users.id, sessions.userId))
          .where(eq(sessions.token, sessionToken))
      ).at(0)
    : undefined;

  return {
    user,
    clientAddress: event.getClientAddress()
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
