import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import type { MovieType } from "@/app/types";
import prisma from "@/prisma/db";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify({ error: "Must be signed in" }), {
      status: 401,
    });
  }

  type RequestDataType = {
    newMovie: MovieType;
    listId: string;
  };

  const { newMovie, listId }: RequestDataType = await request.json();

  try {
    const prismaUser = await prisma.user.findUnique({
      where: {
        email: session.user?.email as string,
      },
    });

    if (!prismaUser) {
      throw Error("User not found");
    }

    await prisma.movie.create({
      data: {
        movieDbId: newMovie.movieDbId,
        imdbId: newMovie.imdbId,
        title: newMovie.title,
        description: newMovie.description,
        tagline: newMovie.tagline,
        runtime: newMovie.runtime,
        image: newMovie.image,
        year: newMovie.year,
        genres: newMovie.genres,
        userId: prismaUser.id,
        listId: listId,
      },
    });

    return new NextResponse(JSON.stringify({ message: "Movie added" }), {
      status: 200,
    });
  } catch (err) {
    return new NextResponse(JSON.stringify({ error: "Something went wrong" }), {
      status: 403,
    });
  }
}
