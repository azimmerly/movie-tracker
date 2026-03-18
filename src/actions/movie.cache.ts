import { eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { db } from "@/lib/db";
import { movie } from "@/lib/db/schema";
import type { Movie } from "@/types";

export async function getCachedMovieData(id: Movie["id"]) {
  "use cache";
  cacheLife("max");
  cacheTag(`movie-${id}`);
  return db.query.movie.findFirst({ where: eq(movie.id, id) });
}
