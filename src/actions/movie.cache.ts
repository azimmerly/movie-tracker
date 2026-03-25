import { and, avg, eq, gt } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { db } from "@/lib/db";
import { movie, userMovie } from "@/lib/db/schema";
import type { Movie } from "@/types";

export async function getCachedMovieData(id: Movie["id"]) {
  "use cache";
  cacheLife("max");
  cacheTag(`movie-${id}`);
  return db.query.movie.findFirst({ where: eq(movie.id, id) });
}

export async function getCachedMovieAvgRating(id: Movie["id"]) {
  "use cache";
  cacheLife("max");
  cacheTag(`movie-avg-rating-${id}`);
  const result = await db
    .select({ avg: avg(userMovie.rating) })
    .from(userMovie)
    .where(and(eq(userMovie.movieId, id), gt(userMovie.rating, 0)))
    .then(([row]) => row?.avg);
  return result ? parseFloat(result) / 2 : null;
}
