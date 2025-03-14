"use server";

import { eq, notExists } from "drizzle-orm";

import { db } from "@/lib/db";
import { movie, movieInfo } from "@/lib/db/schema";

export const cleanupUnreferencedMovieInfo = async () => {
  const movieReferenceCheck = db
    .select({ id: movie.id })
    .from(movie)
    .where(eq(movie.movieInfoId, movieInfo.id))
    .limit(1);
  await db.delete(movieInfo).where(notExists(movieReferenceCheck));
};
