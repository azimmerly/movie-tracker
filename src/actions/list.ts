"use server";

import type { User } from "better-auth";
import { and, asc, count, desc, eq, ilike, sql } from "drizzle-orm";

import { getSession } from "@/actions/auth";
import { cleanupUnreferencedMovieInfo, revalidatePaths } from "@/actions/utils";
import { db } from "@/lib/db";
import { movie, movieInfo, movieList, user } from "@/lib/db/schema";
import type { AddListData, MovieList, UpdateListData } from "@/types";

const getMovieListOrderBy = (sort?: string) => {
  switch (sort) {
    case "date":
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
    case "date":
      return desc(movie.createdAt);
    case "rating":
      return desc(movie.rating);
    case "title":
      return asc(movieInfo.title);
    case "year":
      return desc(movieInfo.year);
    default:
      return desc(movie.createdAt);
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
    revalidatePaths(["/", "/dashboard"]);
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
    revalidatePaths(["/", "/dashboard", `/list/${id}`]);
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

    await cleanupUnreferencedMovieInfo();
    revalidatePaths(["/", "/dashboard"]);
    return { success: true, data: deletedList };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Something went wrong" };
  }
};

export const getAllMovieLists = async (search?: string, sort?: string) => {
  try {
    const whereClause = search
      ? and(eq(movieList.private, false), ilike(movieList.title, `%${search}%`))
      : eq(movieList.private, false);

    const allMovieLists = await db
      .select({
        id: movieList.id,
        title: movieList.title,
        createdAt: movieList.createdAt,
        movieCount: count(movie.id).as("movie_count"),
        user: { name: user.name, image: user.image },
      })
      .from(movieList)
      .where(whereClause)
      .leftJoin(movie, eq(movieList.id, movie.listId))
      .innerJoin(user, eq(movieList.userId, user.id))
      .groupBy(movieList.id, user.id)
      .orderBy(getMovieListOrderBy(sort));

    return { success: true, data: allMovieLists };
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
        movieCount: count(movie.id).as("movie_count"),
        user: { name: user.name, image: user.image },
      })
      .from(movieList)
      .where(whereClause)
      .leftJoin(movie, eq(movieList.id, movie.listId))
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
      ? and(eq(movie.listId, id), ilike(movieInfo.title, `%${search}%`))
      : eq(movie.listId, id);

    const movies = await db
      .select({
        id: movie.id,
        rating: movie.rating,
        createdAt: movie.createdAt,
        favorite: movie.favorite,
        listId: movie.listId,
        movieInfo: movieInfo,
      })
      .from(movie)
      .innerJoin(movieInfo, eq(movieInfo.id, movie.movieInfoId))
      .where(whereClause)
      .orderBy(getMovieOrderBy(sort));

    return { success: true, data: { ...list, movies } };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Something went wrong" };
  }
};
