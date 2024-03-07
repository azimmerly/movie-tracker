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

  try {
    const { title } = await request.json();

    if (!isValidListTitle(title)) {
      return new NextResponse(JSON.stringify({ error: "Invalid title" }), {
        status: 400,
      });
    }

    const prismaUser = await prisma.user.findUnique({
      where: {
        email: session.user?.email as string,
      },
    });

    if (!prismaUser) {
      return new NextResponse(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    await prisma.list.create({
      data: {
        title: title.trim(),
        userId: prismaUser.id,
      },
    });

    return new NextResponse(JSON.stringify({ message: "List created" }), {
      status: 201,
    });
  } catch (err) {
    return new NextResponse(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}
