import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/prisma/db";

type Params = {
  params: {
    id: string;
  };
};

export async function GET(_request: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify({ error: "Must be signed in" }), {
      status: 401,
    });
  }

  try {
    const { id } = params;

    const user = await prisma.user.findUnique({
      where: {
        email: session.user?.email as string,
      },
    });

    if (!user) {
      return new NextResponse(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    const data = await prisma.list.findUnique({
      where: {
        id,
      },
      include: {
        movies: {
          orderBy: {
            createdAt: "asc",
          },
        },
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!data) {
      return new NextResponse(JSON.stringify({ error: "List not found" }), {
        status: 404,
      });
    }

    if (data.user?.id !== user?.id) {
      return new NextResponse(JSON.stringify({ error: "Not authorized" }), {
        status: 403,
      });
    }

    return new NextResponse(JSON.stringify(data), { status: 200 });
  } catch (err) {
    return new NextResponse(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}
