"use server";

import type { User } from "better-auth";
import { and, asc, count, desc, eq, ilike, sql } from "drizzle-orm";

import { getSession } from "@/actions/auth";
import { revalidatePaths } from "@/actions/utils";
import { db } from "@/lib/db";
import { listMovie, movie, movieList, user, userMovie } from "@/lib/db/schema";
import type { AddListData, MovieList, UpdateListData } from "@/types";

const getMovieListOrderBy = (sort?: string) => {
  switch (sort) {
    case "created":
      return desc(movieList.createdAt);
    case "title":
      return asc(movieList.title);
    case "count":
      return desc(sql`movie_count`);
    default:
      return desc(movieList.createdAt);
  }
};

const getMovieOrderBy = (sort?: string) => {
  switch (sort) {
    case "added":
      return desc(listMovie.createdAt);
    case "rating":
      return desc(userMovie.rating);
    case "title":
      return asc(movie.title);
    case "released":
      return desc(movie.releaseDate);
    default:
      return desc(listMovie.createdAt);
  }
};

export const addMovieList = async (data: AddListData) => {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Not authenticated" };
  }

  try {
    const [newList] = await db
      .insert(movieList)
      .values({ ...data, userId: session.user.id })
      .returning({ id: movieList.id });
    await revalidatePaths(["/", "/dashboard"]);
    return { success: true, data: newList };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Something went wrong" };
  }
};

export const updateMovieList = async ({ id, ...rest }: UpdateListData) => {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Not authenticated" };
  }

  try {
    const [updatedList] = await db
      .update(movieList)
      .set(rest)
      .where(and(eq(movieList.id, id), eq(movieList.userId, session.user.id)))
      .returning({ id: movieList.id });

    if (!updatedList) {
      throw new Error("Movie list not found or unauthorized");
    }
    await revalidatePaths([`/list/${id}`]);
    return { success: true, data: updatedList };
  } catch (e) {
    console.error(e);
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

    await revalidatePaths(["/", "/dashboard"]);
    return { success: true, data: deletedList };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Something went wrong" };
  }
};

export const getAllMovieLists = async (
  pageSize: number,
  search?: string,
  sort?: string,
  offset?: number,
) => {
  try {
    const whereClause = search
      ? and(eq(movieList.private, false), ilike(movieList.title, `%${search}%`))
      : eq(movieList.private, false);

    const allMovieLists = await db
      .select({
        id: movieList.id,
        title: movieList.title,
        createdAt: movieList.createdAt,
        movieCount: count(listMovie.id).as("movie_count"),
        user: { name: user.name, image: user.image },
      })
      .from(movieList)
      .where(whereClause)
      .leftJoin(listMovie, eq(movieList.id, listMovie.listId))
      .innerJoin(user, eq(movieList.userId, user.id))
      .groupBy(movieList.id, user.id)
      .orderBy(getMovieListOrderBy(sort))
      .limit(pageSize)
      .offset(offset ?? 0);

    const [{ totalCount }] = await db
      .select({ totalCount: count() })
      .from(movieList)
      .where(whereClause);

    return { success: true, data: allMovieLists, totalCount };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Something went wrong" };
  }
};

export const getUserMovieLists = async (
  userId: User["id"],
  search?: string,
  sort?: string,
) => {
  try {
    const whereClause = search
      ? and(eq(movieList.userId, userId), ilike(movieList.title, `%${search}%`))
      : eq(movieList.userId, userId);

    const userMovieLists = await db
      .select({
        id: movieList.id,
        title: movieList.title,
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
      .orderBy(getMovieListOrderBy(sort));

    return { success: true, data: userMovieLists };
  } catch (e) {
    console.error(e);
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
      columns: { id: true, title: true, createdAt: true, private: true },
      with: {
        user: {
          columns: { id: true, name: true, image: true },
        },
      },
    });

    if (!list) {
      return { success: true, data: undefined };
    }

    const whereClause = search
      ? and(eq(listMovie.listId, id), ilike(movie.title, `%${search}%`))
      : eq(listMovie.listId, id);

    const movies = await db
      .select({
        id: listMovie.id,
        createdAt: listMovie.createdAt,
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
      .where(whereClause)
      .orderBy(getMovieOrderBy(sort));

    return { success: true, data: { ...list, movies } };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Something went wrong" };
  }
};
