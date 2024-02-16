import { NextResponse, type NextRequest } from "next/server";

import prisma from "@/prisma/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const listId = params.id;
    const data = await prisma.list.findUnique({
      where: {
        id: listId,
      },
      include: {
        movies: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    return new NextResponse(JSON.stringify(data), { status: 200 });
  } catch (err) {
    return new NextResponse(JSON.stringify({ error: "Something went wrong" }), {
      status: 403,
    });
  }
}
