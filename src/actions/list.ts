"use server";

import type { User } from "better-auth";
import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  inArray,
  lte,
  or,
  sql,
} from "drizzle-orm";

import { getSession } from "@/actions/auth";
import { LIST_CARD_POSTERS } from "@/consts";
import { db } from "@/lib/db";
import { listMovie, movie, movieList, user, userMovie } from "@/lib/db/schema";
import type { AddListData, MovieList, UpdateListData } from "@/types";
import { ascLower } from "@/utils/ascLower";
import { logError } from "@/utils/logError";
import { addListSchema, updateListSchema } from "@/utils/validation/list";

const getMovieListOrderBy = (sort?: string) => {
  switch (sort) {
    case "created":
      return [desc(movieList.createdAt)];
    case "title":
      return [ascLower(movieList.title)];
    case "count":
      return [desc(sql`movie_count`), ascLower(movieList.title)];
    default:
      return [desc(movieList.createdAt)];
  }
};

const getMovieOrderBy = (sort?: string) => {
  switch (sort) {
    case "added":
      return [desc(listMovie.createdAt)];
    case "title":
      return [ascLower(movie.title)];
    case "rating":
      return [desc(userMovie.rating), ascLower(movie.title)];
    case "released":
      return [desc(movie.releaseDate), ascLower(movie.title)];
    default:
      return [desc(listMovie.createdAt)];
  }
};

const withPosterPaths = async <T extends { id: MovieList["id"] }>(
  lists: T[],
) => {
  if (!lists.length) {
    return lists.map((list) => ({ ...list, posterPaths: [] as string[] }));
  }

  const ranked = db
    .select({
      listId: listMovie.listId,
      posterPath: movie.posterPath,
      rank: sql<number>`row_number() over (partition by ${listMovie.listId} order by ${listMovie.createdAt} desc)`.as(
        "rank",
      ),
    })
    .from(listMovie)
    .innerJoin(movie, eq(movie.id, listMovie.movieId))
    .where(
      inArray(
        listMovie.listId,
        lists.map(({ id }) => id),
      ),
    )
    .as("ranked");

  const rows = await db
    .select({ listId: ranked.listId, posterPath: ranked.posterPath })
    .from(ranked)
    .where(lte(ranked.rank, LIST_CARD_POSTERS))
    .orderBy(ranked.rank);

  const rowsByList = Map.groupBy(rows, ({ listId }) => listId);

  return lists.map((list) => ({
    ...list,
    posterPaths:
      rowsByList.get(list.id)?.map(({ posterPath }) => posterPath) ?? [],
  }));
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
        .orderBy(...getMovieListOrderBy(sort), asc(movieList.id))
        .limit(pageSize)
        .offset(offset),
      db
        .select({ totalCount: count() })
        .from(movieList)
        .innerJoin(user, eq(movieList.userId, user.id))
        .where(and(eq(movieList.private, false), searchFilter)),
    ]);

    return {
      success: true,
      data: { lists: await withPosterPaths(allMovieLists), totalCount },
    };
  } catch (e) {
    logError("list/getAllMovieLists", e);
    return { success: false, message: "Something went wrong" };
  }
};

export const getUserMovieLists = async (
  userId: User["id"],
  pageSize: number,
  offset: number,
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

    const [userMovieLists, [{ totalCount }]] = await Promise.all([
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
        .where(whereClause)
        .leftJoin(listMovie, eq(movieList.id, listMovie.listId))
        .innerJoin(user, eq(movieList.userId, user.id))
        .groupBy(movieList.id, user.id)
        .orderBy(...getMovieListOrderBy(sort), asc(movieList.id))
        .limit(pageSize)
        .offset(offset),
      db.select({ totalCount: count() }).from(movieList).where(whereClause),
    ]);

    return {
      success: true,
      data: { lists: await withPosterPaths(userMovieLists), totalCount },
    };
  } catch (e) {
    logError("list/getUserMovieLists", e);
    return { success: false, message: "Something went wrong" };
  }
};

export const getMovieListById = async (
  id: MovieList["id"],
  pageSize: number,
  offset: number,
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

    const listFilter = and(eq(listMovie.listId, id), searchFilter);

    const [movies, [{ totalCount }]] = await Promise.all([
      db
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
        .where(listFilter)
        .orderBy(...getMovieOrderBy(sort), asc(movie.id))
        .limit(pageSize)
        .offset(offset),
      db
        .select({ totalCount: count() })
        .from(listMovie)
        .innerJoin(movie, eq(movie.id, listMovie.movieId))
        .where(listFilter),
    ]);

    return { success: true, data: { ...list, movies, totalCount } };
  } catch (e) {
    logError("list/getMovieListById", e);
    return { success: false, message: "Something went wrong" };
  }
};
