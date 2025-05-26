"use server";

import { createFetch } from "@better-fetch/fetch";
import { and, avg, eq, ne } from "drizzle-orm";

import { getSession } from "@/actions/auth";
import { cleanupUnreferencedMovieInfo, revalidatePaths } from "@/actions/utils";
import { MOVIE_DB_API_URL } from "@/consts";
import { env } from "@/env";
import { db } from "@/lib/db";
import { movie, movieInfo } from "@/lib/db/schema";
import type {
  AddMovieData,
  DeleteMovieData,
  MovieInfo,
  MovieSearchData,
  UpdateMovieData,
} from "@/types";
import {
  addMovieSchema,
  deleteMovieSchema,
  movieDetailsResponseSchema,
  movieSearchResponseSchema,
  updateMovieSchema,
} from "@/utils/validation/movie";

const movieDbFetch = createFetch({
  retry: 2,
  throw: true,
  baseURL: MOVIE_DB_API_URL,
  method: "GET",
  headers: {
    accept: "application/json",
    authorization: `Bearer ${env.MOVIEDB_API_KEY}`,
  },
});

export const searchMovies = async ({ title }: MovieSearchData) => {
  try {
    const queryString = `query=${encodeURIComponent(title)}`;
    const movies = await movieDbFetch(`/search/movie?${queryString}`, {
      output: movieSearchResponseSchema,
    });
    return { success: true, data: movies };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Something went wrong" };
  }
};

export const addMovie = async (data: AddMovieData) => {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Not authenticated" };
  }

  try {
    const { listId, movieId } = addMovieSchema.parse(data);

    const existingMovie = await db.query.movie.findFirst({
      where: and(eq(movie.listId, listId), eq(movie.movieInfoId, movieId)),
    });

    if (existingMovie) {
      throw new Error("Duplicate movie");
    }

    let movieData = await db.query.movieInfo.findFirst({
      where: eq(movieInfo.id, movieId),
    });

    if (!movieData) {
      const fetchedMovieData = await movieDbFetch(`/movie/:id`, {
        params: { id: movieId.toString() },
        output: movieDetailsResponseSchema,
      });
      if (!fetchedMovieData) {
        throw new Error("Error fetching movie data");
      }
      movieData = await db
        .insert(movieInfo)
        .values(fetchedMovieData)
        .returning()
        .then(([data]) => data);
    }

    const [newMovie] = await db
      .insert(movie)
      .values({ userId: session.user.id, movieInfoId: movieData!.id, listId })
      .returning({ id: movie.id });

    revalidatePaths(["/", "/dashboard", `/list/${listId}`]);
    return { success: true, data: newMovie };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Something went wrong" };
  }
};

export const deleteMovie = async (data: DeleteMovieData) => {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Not authenticated" };
  }

  try {
    const { listId, movieId } = deleteMovieSchema.parse(data);

    const [deletedMovie] = await db
      .delete(movie)
      .where(
        and(
          eq(movie.id, movieId),
          eq(movie.listId, listId),
          eq(movie.userId, session.user.id),
        ),
      )
      .returning({ id: movie.id });

    if (!deletedMovie) {
      throw new Error("Movie not found or unauthorized");
    }

    await cleanupUnreferencedMovieInfo();
    revalidatePaths(["/", "/dashboard", `/list/${listId}`]);
    return { success: true, data: deletedMovie };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Something went wrong" };
  }
};

export const updateMovie = async (data: UpdateMovieData) => {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Not authenticated" };
  }

  try {
    const { listId, movieId, favorite, rating } = updateMovieSchema.parse(data);

    const [updatedMovie] = await db
      .update(movie)
      .set({ favorite, rating })
      .where(
        and(
          eq(movie.id, movieId),
          eq(movie.listId, listId),
          eq(movie.userId, session.user.id),
        ),
      )
      .returning({ id: movie.id, movieInfoId: movie.movieInfoId });

    if (!updatedMovie) {
      throw new Error("Movie not found or unauthorized");
    }
    revalidatePaths([`/list/${listId}`, `/movie/${updatedMovie.movieInfoId}`]);
    return { success: true, data: updatedMovie };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Something went wrong" };
  }
};

export const getMovieInfo = async (id: MovieInfo["id"]) => {
  try {
    const movieData = await db.query.movieInfo.findFirst({
      where: eq(movieInfo.id, id),
    });

    const { avgRating } = await db
      .select({ avgRating: avg(movie.rating) })
      .from(movie)
      .where(and(eq(movie.movieInfoId, id), ne(movie.rating, 0)))
      .then(([data]) => data);

    return {
      success: true,
      data: {
        ...movieData,
        avgRating: avgRating ? parseFloat(avgRating).toFixed(1) : null,
      },
    };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Something went wrong" };
  }
};
