import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { isValidListTitle } from "@/app/utils/validation";
import prisma from "@/prisma/db";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify({ error: "Must be signed in" }), {
      status: 401,
    });
  }

  const { title, id } = await request.json();

  if (!isValidListTitle(title)) {
    return new NextResponse(JSON.stringify({ error: "Invalid title" }), {
      status: 401,
    });
  }

  try {
    await prisma.list.update({
      where: {
        id: id,
      },
      data: {
        title: title.trim(),
      },
    });

    return new NextResponse(JSON.stringify({ message: "List title updated" }), {
      status: 200,
    });
  } catch (err) {
    return new NextResponse(JSON.stringify({ error: "Something went wrong" }), {
      status: 403,
    });
  }
}
