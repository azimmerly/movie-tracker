"use server";

import { count, eq, sql } from "drizzle-orm";

import { getSession } from "@/actions/auth";
import { db } from "@/lib/db";
import { account, movieList, user, userMovie } from "@/lib/db/schema";

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

export const getUserStats = async (userId: string) => {
  try {
    const [[{ totalMovies, totalRatings, totalFavorites }], [{ totalLists }]] =
      await Promise.all([
        db
          .select({
            totalMovies: count(userMovie.id),
            totalRatings:
              sql<number>`count(case when ${userMovie.rating} > 0 then 1 end)`.mapWith(
                Number,
              ),
            totalFavorites:
              sql<number>`count(case when ${userMovie.favorite} = true then 1 end)`.mapWith(
                Number,
              ),
          })
          .from(userMovie)
          .where(eq(userMovie.userId, userId)),
        db
          .select({ totalLists: count(movieList.id) })
          .from(movieList)
          .where(eq(movieList.userId, userId)),
      ]);

    return {
      success: true,
      data: { totalMovies, totalLists, totalRatings, totalFavorites },
    };
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
