"use server";

import { and, asc, avg, desc, eq, exists, gt, ilike } from "drizzle-orm";

import { getSession } from "@/actions/auth";
import { movieDbFetch, revalidatePaths } from "@/actions/utils";
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
  movieSearchSchema,
  updateMovieSchema,
} from "@/utils/validation/movie";

const PENDING_STATUSES = [
  "Rumored",
  "Planned",
  "In Production",
  "Post Production",
];

const getUserMoviesOrderBy = (sort?: string) => {
  switch (sort) {
    case "rating":
      return desc(userMovie.rating);
    case "title":
      return asc(movie.title);
    case "released":
      return desc(movie.releaseDate);
    default:
      return desc(userMovie.createdAt);
  }
};

export const searchMovies = async (data: MovieSearchData) => {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Not authenticated" };
  }

  try {
    const { title } = movieSearchSchema.parse(data);
    const movies = await movieDbFetch("/search/movie", {
      output: movieSearchResponseSchema,
      query: { query: title },
      next: { revalidate: 86400 },
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

    const movieExists = await db.query.movie.findFirst({
      where: eq(movie.id, movieId),
      columns: { id: true },
    });

    let fetchedMovieData = null;
    if (!movieExists) {
      fetchedMovieData = await movieDbFetch("/movie/:id", {
        params: { id: movieId.toString() },
        query: { append_to_response: "credits" },
        output: movieDetailsResponseSchema,
      });
      if (!fetchedMovieData) {
        throw new Error("Error fetching movie data");
      }
    }

    const newListMovie = await db.transaction(async (tx) => {
      const existingListMovie = await tx.query.listMovie.findFirst({
        where: and(
          eq(listMovie.listId, listId),
          eq(listMovie.movieId, movieId),
        ),
      });

      if (existingListMovie) {
        throw new Error("Duplicate movie");
      }

      if (fetchedMovieData) {
        await tx.insert(movie).values(fetchedMovieData).onConflictDoNothing();
      }

      const [inserted] = await tx
        .insert(listMovie)
        .values({ listId, movieId })
        .returning({ id: listMovie.id });

      await tx
        .insert(userMovie)
        .values({ userId: session.user.id, movieId })
        .onConflictDoNothing();

      return inserted;
    });

    await revalidatePaths(["/", "/dashboard/lists", `/list/${listId}`]);
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

    const [deletedListMovie] = await db
      .delete(listMovie)
      .where(
        and(
          eq(listMovie.listId, listId),
          eq(listMovie.movieId, movieId),
          exists(
            db
              .select({ id: movieList.id })
              .from(movieList)
              .where(
                and(
                  eq(movieList.id, listId),
                  eq(movieList.userId, session.user.id),
                ),
              ),
          ),
        ),
      )
      .returning({ id: listMovie.id });

    if (!deletedListMovie) {
      throw new Error("List movie not found or unauthorized");
    }

    await revalidatePaths(["/", "/dashboard/lists", `/list/${listId}`]);
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
    const { movieId, favorite, rating } = updateMovieSchema.parse(data);

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

    const listsWithMovie = await db
      .select({ listId: listMovie.listId })
      .from(listMovie)
      .where(eq(listMovie.movieId, movieId));

    await revalidatePaths([
      `/movie/${movieId}`,
      "/dashboard/movies",
      ...listsWithMovie.map(({ listId }) => `/list/${listId}`),
    ]);

    return { success: true, data: updatedUserMovie };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Something went wrong" };
  }
};

export const getMovie = async (id: Movie["id"]) => {
  try {
    const [dbMovie, avgRating] = await Promise.all([
      db.query.movie.findFirst({ where: eq(movie.id, id) }),
      db
        .select({ avg: avg(userMovie.rating) })
        .from(userMovie)
        .where(and(eq(userMovie.movieId, id), gt(userMovie.rating, 0)))
        .then(([row]) => row?.avg),
    ]);

    let movieData = dbMovie;
    if (movieData && PENDING_STATUSES.includes(movieData.status)) {
      const today = new Date().toISOString().split("T")[0];

      if (movieData.releaseDate <= today) {
        const fetchedMovieData = await movieDbFetch("/movie/:id", {
          params: { id: id.toString() },
          query: { append_to_response: "credits" },
          output: movieDetailsResponseSchema,
        });

        if (fetchedMovieData) {
          movieData = await db
            .update(movie)
            .set(fetchedMovieData)
            .where(eq(movie.id, id))
            .returning()
            .then(([data]) => data);
        }
      }
    }

    return {
      success: true,
      data: movieData && {
        ...movieData,
        avgRating: avgRating ? parseFloat(avgRating) / 2 : null,
      },
    };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Something went wrong" };
  }
};

export const getUserMovies = async (
  userId: string,
  search?: string,
  sort?: string,
) => {
  try {
    const whereClause = and(
      eq(userMovie.userId, userId),
      search ? ilike(movie.title, `%${search}%`) : undefined,
    );

    const movies = await db
      .select({
        id: userMovie.id,
        rating: userMovie.rating,
        favorite: userMovie.favorite,
        createdAt: userMovie.createdAt,
        movie: movie,
      })
      .from(userMovie)
      .innerJoin(movie, eq(movie.id, userMovie.movieId))
      .where(whereClause)
      .orderBy(getUserMoviesOrderBy(sort));

    return { success: true, data: movies };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Something went wrong" };
  }
};
