import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/prisma/db";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify({ error: "Must be signed in" }), {
      status: 401,
    });
  }

  const { movieId } = await request.json();

  try {
    await prisma.movie.delete({
      where: {
        id: movieId,
      },
    });

    return new NextResponse(JSON.stringify({ message: "Movie removed" }), {
      status: 200,
    });
  } catch (err) {
    return new NextResponse(JSON.stringify({ error: "Something went wrong" }), {
      status: 403,
    });
  }
}
