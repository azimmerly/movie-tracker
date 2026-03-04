"use server";

import { eq } from "drizzle-orm";

import { getSession } from "@/actions/auth";
import { db } from "@/lib/db";
import { account, user } from "@/lib/db/schema";

export const getUserProvider = async () => {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Not authenticated" };
  }

  try {
    const userAccount = await db.query.account.findFirst({
      where: eq(account.userId, session.user.id),
      columns: { providerId: true },
    });

    return { success: true, data: userAccount?.providerId };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Something went wrong" };
  }
};

export const getUserById = async (id: string) => {
  try {
    const userData = await db.query.user.findFirst({
      where: eq(user.id, id),
      columns: { id: true, name: true, image: true, createdAt: true },
    });

    return { success: true, data: userData };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Something went wrong" };
  }
};
