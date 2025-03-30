import { db } from "../db/drizzle";
import { lt } from "drizzle-orm";
import { blacklistedTokens } from "../db/schema";

export const cleanupBlacklistedTokens = async () => {
  try {
    const now = new Date().toISOString();
    await db
      .delete(blacklistedTokens)
      .where(lt(blacklistedTokens.expiresAt, now));
  } catch (error) {
    console.error("Token cleanup error:", error);
  }
};
