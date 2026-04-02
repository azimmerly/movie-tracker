"use server";

import { and, avg, count, desc, eq, gt, sql } from "drizzle-orm";

import { getSession } from "@/actions/auth";
import { db } from "@/lib/db";
import { account, movie, movieList, user, userMovie } from "@/lib/db/schema";

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

export const getUserMovieStats = async (userId: string) => {
  try {
    const [genreRatingStats, genreCountStats, decadeStats] = await Promise.all([
      db
        .select({
          genre: sql<string>`unnest(${movie.genres}[1:3])`,
          avg: sql<number>`(avg(${userMovie.rating}) / 2)::float`,
          count: count(),
        })
        .from(userMovie)
        .innerJoin(movie, eq(movie.id, userMovie.movieId))
        .where(and(eq(userMovie.userId, userId), gt(userMovie.rating, 0)))
        .groupBy(sql`1`)
        .orderBy(desc(avg(userMovie.rating)))
        .limit(5),
      db
        .select({
          genre: sql<string>`unnest(${movie.genres}[1:3])`,
          avg: sql<number>`coalesce(avg(${userMovie.rating}) filter (where ${userMovie.rating} > 0) / 2, 0)::float`,
          count: count(),
        })
        .from(userMovie)
        .innerJoin(movie, eq(movie.id, userMovie.movieId))
        .where(eq(userMovie.userId, userId))
        .groupBy(sql`1`)
        .orderBy(desc(count()))
        .limit(5),
      db
        .select({
          decade: sql<number>`case when extract(year from ${movie.releaseDate})::int < 1960 then 1950 else extract(year from ${movie.releaseDate})::int / 10 * 10 end`,
          percent: sql<number>`round(count(*)::numeric / sum(count(*)) over () * 100, 1)::float`,
          avg: sql<number>`coalesce(avg(${userMovie.rating}) filter (where ${userMovie.rating} > 0) / 2, 0)::float`,
          count: count(),
        })
        .from(userMovie)
        .innerJoin(movie, eq(movie.id, userMovie.movieId))
        .where(eq(userMovie.userId, userId))
        .groupBy(sql`1`)
        .orderBy(sql`1 desc`),
    ]);

    return {
      success: true,
      data: { genreRatingStats, genreCountStats, decadeStats },
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
