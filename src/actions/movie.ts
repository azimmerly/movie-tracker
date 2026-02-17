"use server";

import { createFetch } from "@better-fetch/fetch";
import { and, eq } from "drizzle-orm";

import { getSession } from "@/actions/auth";
import { revalidatePaths } from "@/actions/utils";
import { MOVIE_DB_API_URL } from "@/consts";
import { env } from "@/env";
import { db } from "@/lib/db";
import { listMovie, movie, movieList, userMovie } from "@/lib/db/schema";
import type {
  AddMovieData,
  DeleteMovieData,
  Movie,
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
    const movies = await movieDbFetch("/search/movie", {
      output: movieSearchResponseSchema,
      query: { query: title },
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

    const existingListMovie = await db.query.listMovie.findFirst({
      where: and(eq(listMovie.listId, listId), eq(listMovie.movieId, movieId)),
    });

    if (existingListMovie) {
      throw new Error("Duplicate movie");
    }

    let movieData = await db.query.movie.findFirst({
      where: eq(movie.id, movieId),
    });

    if (!movieData) {
      const fetchedMovieData = await movieDbFetch(`/movie/:id`, {
        params: { id: movieId.toString() },
        query: { append_to_response: "credits" },
        output: movieDetailsResponseSchema,
      });
      if (!fetchedMovieData) {
        throw new Error("Error fetching movie data");
      }
      movieData = await db
        .insert(movie)
        .values(fetchedMovieData)
        .returning()
        .then(([data]) => data);
    }

    const [newListMovie] = await db
      .insert(listMovie)
      .values({ listId, movieId: movieData!.id })
      .returning({ id: listMovie.id });

    await db
      .insert(userMovie)
      .values({ userId: session.user.id, movieId: movieData!.id })
      .onConflictDoNothing();

    await revalidatePaths(["/", "/dashboard", `/list/${listId}`]);
    return { success: true, data: newListMovie };
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

    const list = await db.query.movieList.findFirst({
      where: and(
        eq(movieList.id, listId),
        eq(movieList.userId, session.user.id),
      ),
    });

    if (!list) {
      throw new Error("List not found or unauthorized");
    }

    const [deletedListMovie] = await db
      .delete(listMovie)
      .where(and(eq(listMovie.listId, listId), eq(listMovie.movieId, movieId)))
      .returning({ id: listMovie.id });

    if (!deletedListMovie) {
      throw new Error("Movie not found in list");
    }

    await revalidatePaths(["/", "/dashboard", `/list/${listId}`]);
    return { success: true, data: deletedListMovie };
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

    const [updatedUserMovie] = await db
      .insert(userMovie)
      .values({ userId: session.user.id, movieId, favorite, rating })
      .onConflictDoUpdate({
        target: [userMovie.userId, userMovie.movieId],
        set: { favorite, rating },
      })
      .returning({ id: userMovie.id, movieId: userMovie.movieId });

    if (!updatedUserMovie) {
      throw new Error("Failed to update movie");
    }

    await revalidatePaths([`/list/${listId}`]);
    return { success: true, data: updatedUserMovie };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Something went wrong" };
  }
};

export const getMovie = async (id: Movie["id"]) => {
  try {
    const movieData = await db.query.movie.findFirst({
      where: eq(movie.id, id),
    });

    return {
      success: true,
      data: movieData,
    };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Something went wrong" };
  }
};

export const getAllMovieIds = async () => {
  try {
    const movies = await db.query.movie.findMany({
      columns: { id: true },
    });

    return {
      success: true,
      data: movies.map(({ id }) => ({ id: id.toString() })),
    };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Something went wrong" };
  }
};
