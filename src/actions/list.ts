"use server";

import type { User } from "better-auth";
import { and, asc, count, desc, eq, ilike, or, sql } from "drizzle-orm";

import { getSession } from "@/actions/auth";
import { db } from "@/lib/db";
import { listMovie, movie, movieList, user, userMovie } from "@/lib/db/schema";
import type { AddListData, MovieList, UpdateListData } from "@/types";
import { logError } from "@/utils/logError";
import { addListSchema, updateListSchema } from "@/utils/validation/list";

const getMovieListOrderBy = (sort?: string) => {
  switch (sort) {
    case "created":
      return [desc(movieList.createdAt)];
    case "title":
      return [asc(movieList.title)];
    case "count":
      return [desc(sql`movie_count`), asc(movieList.title)];
    default:
      return [desc(movieList.createdAt)];
  }
};

const getMovieOrderBy = (sort?: string) => {
  switch (sort) {
    case "added":
      return [desc(listMovie.createdAt)];
    case "title":
      return [asc(movie.title)];
    case "rating":
      return [desc(userMovie.rating), asc(movie.title)];
    case "released":
      return [desc(movie.releaseDate), asc(movie.title)];
    default:
      return [desc(listMovie.createdAt)];
  }
};

export const addMovieList = async (data: AddListData) => {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Not authenticated" };
  }

  try {
    const validated = addListSchema.parse(data);
    const [newList] = await db
      .insert(movieList)
      .values({ ...validated, userId: session.user.id })
      .returning({ id: movieList.id });

    return { success: true, data: newList };
  } catch (e) {
    logError("list/addMovieList", e);
    return { success: false, message: "Something went wrong" };
  }
};

export const updateMovieList = async (data: UpdateListData) => {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Not authenticated" };
  }

  try {
    const { id, ...rest } = updateListSchema.parse(data);
    const [updatedList] = await db
      .update(movieList)
      .set(rest)
      .where(and(eq(movieList.id, id), eq(movieList.userId, session.user.id)))
      .returning({ id: movieList.id });

    if (!updatedList) {
      throw new Error("Movie list not found or unauthorized");
    }

    return { success: true, data: updatedList };
  } catch (e) {
    logError("list/updateMovieList", e);
    return { success: false, message: "Something went wrong" };
  }
};

export const deleteMovieList = async (id: MovieList["id"]) => {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Not authenticated" };
  }

  try {
    const [deletedList] = await db
      .delete(movieList)
      .where(and(eq(movieList.id, id), eq(movieList.userId, session.user.id)))
      .returning({ id: movieList.id });

    if (!deletedList) {
      throw new Error("Movie list not found or unauthorized");
    }

    return { success: true, data: deletedList };
  } catch (e) {
    logError("list/deleteMovieList", e);
    return { success: false, message: "Something went wrong" };
  }
};

export const getAllMovieLists = async (
  pageSize: number,
  offset: number,
  search?: string,
  sort?: string,
) => {
  try {
    const searchFilter = search
      ? or(
          ilike(movieList.title, `%${search}%`),
          ilike(user.name, `%${search}%`),
        )
      : undefined;

    const [allMovieLists, [{ totalCount }]] = await Promise.all([
      db
        .select({
          id: movieList.id,
          title: movieList.title,
          description: movieList.description,
          createdAt: movieList.createdAt,
          private: movieList.private,
          movieCount: count(listMovie.id).as("movie_count"),
          user: { name: user.name, image: user.image },
        })
        .from(movieList)
        .leftJoin(listMovie, eq(movieList.id, listMovie.listId))
        .innerJoin(user, eq(movieList.userId, user.id))
        .where(and(eq(movieList.private, false), searchFilter))
        .groupBy(movieList.id, user.id)
        .orderBy(...getMovieListOrderBy(sort))
        .limit(pageSize)
        .offset(offset),
      db
        .select({ totalCount: count() })
        .from(movieList)
        .innerJoin(user, eq(movieList.userId, user.id))
        .where(and(eq(movieList.private, false), searchFilter)),
    ]);

    return { success: true, data: { lists: allMovieLists, totalCount } };
  } catch (e) {
    logError("list/getAllMovieLists", e);
    return { success: false, message: "Something went wrong" };
  }
};

export const getUserMovieLists = async (
  userId: User["id"],
  search?: string,
  sort?: string,
) => {
  try {
    const session = await getSession();
    const includePrivate = session?.user.id === userId;

    const whereClause = and(
      eq(movieList.userId, userId),
      includePrivate ? undefined : eq(movieList.private, false),
      search ? ilike(movieList.title, `%${search}%`) : undefined,
    );

    const userMovieLists = await db
      .select({
        id: movieList.id,
        title: movieList.title,
        description: movieList.description,
        createdAt: movieList.createdAt,
        private: movieList.private,
        movieCount: count(listMovie.id).as("movie_count"),
        user: { name: user.name, image: user.image },
      })
      .from(movieList)
      .where(whereClause)
      .leftJoin(listMovie, eq(movieList.id, listMovie.listId))
      .innerJoin(user, eq(movieList.userId, user.id))
      .groupBy(movieList.id, user.id)
      .orderBy(...getMovieListOrderBy(sort));

    return { success: true, data: userMovieLists };
  } catch (e) {
    logError("list/getUserMovieLists", e);
    return { success: false, message: "Something went wrong" };
  }
};

export const getMovieListById = async (
  id: MovieList["id"],
  search?: string,
  sort?: string,
) => {
  try {
    const list = await db.query.movieList.findFirst({
      where: eq(movieList.id, id),
      columns: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        private: true,
      },
      with: {
        user: {
          columns: { id: true, name: true, image: true },
        },
      },
    });

    if (!list) {
      return { success: true, data: undefined };
    }

    if (list.private) {
      const session = await getSession();
      if (session?.user.id !== list.user.id) {
        return { success: true, data: undefined };
      }
    }

    const searchFilter = search
      ? or(
          ilike(movie.title, `%${search}%`),
          sql`${movie.genres}::text ilike ${"%" + search + "%"}`,
        )
      : undefined;

    const movies = await db
      .select({
        rating: sql<number>`coalesce(${userMovie.rating}, 0)`.as("rating"),
        favorite: sql<boolean>`coalesce(${userMovie.favorite}, false)`.as(
          "favorite",
        ),
        movie: movie,
      })
      .from(listMovie)
      .innerJoin(movie, eq(movie.id, listMovie.movieId))
      .leftJoin(
        userMovie,
        and(
          eq(userMovie.movieId, movie.id),
          eq(userMovie.userId, list.user.id),
        ),
      )
      .where(and(eq(listMovie.listId, id), searchFilter))
      .orderBy(...getMovieOrderBy(sort));

    return { success: true, data: { ...list, movies } };
  } catch (e) {
    logError("list/getMovieListById", e);
    return { success: false, message: "Something went wrong" };
  }
};
