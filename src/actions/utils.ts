"use server";

import { eq, notExists } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { movie, movieInfo } from "@/lib/db/schema";

export const cleanupUnreferencedMovieInfo = async () => {
  const movieReference = db
    .select({ id: movie.id })
    .from(movie)
    .where(eq(movie.movieInfoId, movieInfo.id))
    .limit(1);
  await db.delete(movieInfo).where(notExists(movieReference));
};

export const revalidatePaths = async (paths: string[]) => {
  paths.forEach((path) => revalidatePath(path));
};
