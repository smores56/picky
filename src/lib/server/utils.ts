import { SECONDS_IN_A_WEEK } from "$lib/constants";
import { sessions } from "$lib/server/db/schema";
import { db } from "$lib/server/db";
import { and, eq, lte } from "drizzle-orm";

export async function cleanupSessionsForUser(userId: number) {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - SECONDS_IN_A_WEEK * 1000);

  await db
    .delete(sessions)
    .where(and(eq(sessions.userId, userId), lte(sessions.updatedAt, weekAgo)));
}
