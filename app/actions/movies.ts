"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import type { MovieType } from "@/app/types";
import prisma from "@/prisma/db";

type AddMovie = {
  listId: string;
  newMovie: MovieType;
};

type DeleteMovie = {
  movieId: string;
};

type UpdateMovie = {
  movieId: string;
  isWatched: boolean;
  isFavorite: boolean;
};

export const addMovie = async ({ listId, newMovie }: AddMovie) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return { ok: false, message: "Must be signed in" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: session.user?.email as string,
      },
    });

    if (!user) {
      return { ok: false, message: "User not found" };
    }

    await prisma.movie.create({
      data: {
        listId,
        userId: user.id,
        movieDbId: newMovie.movieDbId,
        imdbId: newMovie.imdbId,
        title: newMovie.title,
        description: newMovie.description,
        tagline: newMovie.tagline,
        runtime: newMovie.runtime,
        image: newMovie.image,
        year: newMovie.year,
        genres: newMovie.genres,
      },
    });

    return { ok: true, message: "Movie added" };
  } catch (err) {
    return { ok: false, message: "Something went wrong" };
  }
};

export const deleteMovie = async ({ movieId }: DeleteMovie) => {
  try {
    await prisma.movie.delete({
      where: {
        id: movieId,
      },
    });

    return { ok: true, message: "Movie removed" };
  } catch (err) {
    return { ok: false, message: "Something went wrong" };
  }
};

export const updateMovie = async ({
  movieId,
  isFavorite,
  isWatched,
}: UpdateMovie) => {
  try {
    await prisma.movie.update({
      where: {
        id: movieId,
      },
      data: {
        isFavorite,
        isWatched,
      },
    });

    return { ok: true, message: "Movie updated" };
  } catch (err) {
    return { ok: false, message: "Something went wrong" };
  }
};
