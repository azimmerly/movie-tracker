"use server";

import {
  and,
  asc,
  avg,
  count,
  desc,
  eq,
  exists,
  gt,
  ilike,
  inArray,
} from "drizzle-orm";

import { getSession } from "@/actions/auth";
import { movieDbFetch } from "@/actions/utils";
import { db } from "@/lib/db";
import { listMovie, movie, movieList, userMovie } from "@/lib/db/schema";
import type {
  AddMovieData,
  DeleteMovieData,
  DeleteUserMovieData,
  Movie,
  MovieSearchData,
  UpdateMovieData,
} from "@/types";
import {
  PENDING_STATUSES,
  addMovieSchema,
  deleteMovieSchema,
  deleteUserMovieSchema,
  movieDetailsResponseSchema,
  movieSearchResponseSchema,
  movieSearchSchema,
  updateMovieSchema,
} from "@/utils/validation/movie";

const getUserMoviesOrderBy = (sort?: string) => {
  switch (sort) {
    case "added":
      return [desc(userMovie.createdAt)];
    case "title":
      return [asc(movie.title)];
    case "rating":
      return [desc(userMovie.rating), asc(movie.title)];
    case "released":
      return [desc(movie.releaseDate), asc(movie.title)];
    default:
      return [desc(userMovie.createdAt)];
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
      if (fetchedMovieData) {
        await tx.insert(movie).values(fetchedMovieData).onConflictDoNothing();
      }

      const [inserted] = await tx
        .insert(listMovie)
        .values({ listId, movieId })
        .onConflictDoNothing()
        .returning({ id: listMovie.id });

      if (!inserted) {
        throw new Error("Duplicate movie");
      }

      await tx
        .insert(userMovie)
        .values({ userId: session.user.id, movieId })
        .onConflictDoNothing();

      return inserted;
    });

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

    return { success: true, data: deletedListMovie };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Something went wrong" };
  }
};

export const deleteUserMovie = async (data: DeleteUserMovieData) => {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Not authenticated" };
  }

  try {
    const { movieId } = deleteUserMovieSchema.parse(data);

    await db.transaction(async (tx) => {
      const [, [deleted]] = await Promise.all([
        tx.delete(listMovie).where(
          and(
            eq(listMovie.movieId, movieId),
            exists(
              db
                .select({ id: movieList.id })
                .from(movieList)
                .where(
                  and(
                    eq(movieList.id, listMovie.listId),
                    eq(movieList.userId, session.user.id),
                  ),
                ),
            ),
          ),
        ),
        tx
          .delete(userMovie)
          .where(
            and(
              eq(userMovie.userId, session.user.id),
              eq(userMovie.movieId, movieId),
            ),
          )
          .returning({ id: userMovie.id }),
      ]);

      if (!deleted) {
        throw new Error("User movie not found or unauthorized");
      }
    });

    return { success: true };
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

    return { success: true, data: updatedUserMovie };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Something went wrong" };
  }
};

export const getMovie = async (id: Movie["id"]) => {
  try {
    let movieData = await db.query.movie.findFirst({ where: eq(movie.id, id) });

    if (movieData && PENDING_STATUSES.has(movieData.status)) {
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

    return { success: true, data: movieData };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Something went wrong" };
  }
};

export const getMovieAvgRating = async (id: Movie["id"]) => {
  try {
    const result = await db
      .select({ avg: avg(userMovie.rating) })
      .from(userMovie)
      .where(and(eq(userMovie.movieId, id), gt(userMovie.rating, 0)))
      .then(([row]) => row?.avg);
    return result ? parseFloat(result) / 2 : null;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const getUserMovies = async (
  userId: string,
  pageSize: number,
  offset: number,
  search?: string,
  sort?: string,
) => {
  try {
    const session = await getSession();
    const includePrivate = session?.user.id === userId;

    const whereClause = and(
      eq(userMovie.userId, userId),
      search ? ilike(movie.title, `%${search}%`) : undefined,
    );

    const [movies, [{ totalCount }]] = await Promise.all([
      db
        .select({
          rating: userMovie.rating,
          favorite: userMovie.favorite,
          movie,
        })
        .from(userMovie)
        .innerJoin(movie, eq(movie.id, userMovie.movieId))
        .where(whereClause)
        .orderBy(...getUserMoviesOrderBy(sort))
        .limit(pageSize)
        .offset(offset),
      db
        .select({ totalCount: count() })
        .from(userMovie)
        .innerJoin(movie, eq(movie.id, userMovie.movieId))
        .where(whereClause),
    ]);

    const movieIds = movies.map(({ movie }) => movie.id);
    const memberships = movieIds.length
      ? await db
          .select({
            movieId: listMovie.movieId,
            list: { id: movieList.id, title: movieList.title },
          })
          .from(listMovie)
          .innerJoin(
            movieList,
            and(
              eq(movieList.id, listMovie.listId),
              eq(movieList.userId, userId),
              includePrivate ? undefined : eq(movieList.private, false),
            ),
          )
          .where(inArray(listMovie.movieId, movieIds))
          .orderBy(asc(listMovie.createdAt))
      : [];

    const listsByMovieId = Map.groupBy(memberships, ({ movieId }) => movieId);

    const moviesWithLists = movies.map((m) => {
      const movieMemberships = listsByMovieId.get(m.movie.id) ?? [];
      return { ...m, lists: movieMemberships.map(({ list }) => list) };
    });

    return { success: true, data: { movies: moviesWithLists, totalCount } };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Something went wrong" };
  }
};
