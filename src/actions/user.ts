"use server";

import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const getUserById = async (id: string) => {
  try {
    const userData = await db.query.user.findFirst({
      where: eq(user.id, id),
      columns: { id: true, name: true, image: true },
    });

    return { success: true, data: userData };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Something went wrong" };
  }
};
