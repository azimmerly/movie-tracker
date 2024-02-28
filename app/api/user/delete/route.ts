import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/prisma/db";

export async function DELETE() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify({ error: "Must be signed in" }), {
      status: 401,
    });
  }

  try {
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

    await prisma.user.delete({
      where: {
        id: prismaUser.id,
      },
    });

    return new NextResponse(JSON.stringify({ message: "Account deleted" }), {
      status: 200,
    });
  } catch (err) {
    return new NextResponse(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}
