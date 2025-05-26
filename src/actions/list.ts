"use server";

import type { User } from "better-auth";
import { and, asc, desc, eq } from "drizzle-orm";

import { getSession } from "@/actions/auth";
import { cleanupUnreferencedMovieInfo, revalidatePaths } from "@/actions/utils";
import { db } from "@/lib/db";
import { movie, movieList } from "@/lib/db/schema";
import type { AddListData, MovieList, UpdateListData } from "@/types";

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

export const getAllMovieLists = async (filterBy?: string) => {
  try {
    let allMovieLists = await db.query.movieList.findMany({
      where: eq(movieList.private, false),
      orderBy: desc(movieList.createdAt),
      columns: { id: true, title: true, createdAt: true },
      with: {
        user: {
          columns: { name: true, image: true },
        },
        movies: {
          columns: { id: true },
        },
      },
    });

    if (filterBy === "non-empty") {
      allMovieLists = allMovieLists.filter(({ movies }) => !!movies.length);
    }

    return { success: true, data: allMovieLists };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Something went wrong" };
  }
};

export const getUserMovieLists = async (userId: User["id"], sort?: string) => {
  try {
    const userMovieLists = await db.query.movieList.findMany({
      where: eq(movieList.userId, userId),
      orderBy:
        sort === "title" ? asc(movieList.title) : desc(movieList.createdAt),
      columns: { id: true, title: true, createdAt: true, private: true },
      with: {
        user: {
          columns: { name: true, image: true },
        },
        movies: {
          columns: { id: true },
        },
      },
    });
    return { success: true, data: userMovieLists };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Something went wrong" };
  }
};

export const getMovieListById = async (id: MovieList["id"]) => {
  try {
    const list = await db.query.movieList.findFirst({
      where: eq(movieList.id, id),
      columns: { id: true, title: true, createdAt: true, private: true },
      with: {
        user: {
          columns: { id: true, name: true, image: true },
        },
        movies: {
          orderBy: movie.createdAt,
          with: { movieInfo: true },
        },
      },
    });
    return { success: true, data: list };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Something went wrong" };
  }
};
