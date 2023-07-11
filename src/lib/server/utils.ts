import { SECONDS_IN_A_WEEK } from "$lib/constants";
import { db } from "$lib/server/db";

export async function cleanupSessionsForUser(userId: number) {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - SECONDS_IN_A_WEEK * 1000);

  await db
    .deleteFrom("sessions")
    .where("userId", "=", userId)
    .where("updatedAt", "<=", weekAgo)
    .execute();
}
