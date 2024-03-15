import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/prisma/db";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify({ error: "Must be signed in" }), {
      status: 401,
    });
  }

  try {
    const data = await prisma.user.findUnique({
      where: {
        email: session.user?.email as string,
      },
      include: {
        lists: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            movies: {
              orderBy: {
                createdAt: "asc",
              },
              select: {
                id: true,
                title: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!data?.lists) {
      return new NextResponse(JSON.stringify({ error: "Lists not found" }), {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify(data.lists), { status: 200 });
  } catch (err) {
    return new NextResponse(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}
