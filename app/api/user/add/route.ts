import { hash } from "bcryptjs";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import prisma from "@/prisma/db";

const schema = z.object({
  username: z
    .string()
    .min(1)
    .max(20)
    .regex(/^[a-zA-Z0-9]+$/),
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password } = schema.parse(body);

    const existingEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingEmail) {
      return new NextResponse(
        JSON.stringify({ error: "User with this email already exists" }),
        { status: 409 },
      );
    }

    const hashedPassword = await hash(password, 10);
    await prisma.user.create({
      data: {
        email,
        name: username,
        password: hashedPassword,
      },
    });

    return new NextResponse(JSON.stringify({ message: "Account created" }), {
      status: 201,
    });
  } catch (err) {
    return new NextResponse(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}
