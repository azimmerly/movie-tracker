"use server";

import { hash } from "bcryptjs";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/prisma/db";

const userSchema = z.object({
  username: z
    .string()
    .min(1)
    .max(20)
    .regex(/^[a-zA-Z0-9]+$/),
  email: z.string().email(),
  password: z.string().min(1),
});

type UserCredentials = {
  username: string;
  email: string;
  password: string;
};

export const addUser = async (userCredentials: UserCredentials) => {
  try {
    const { username, email, password } = userSchema.parse(userCredentials);

    const existingEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingEmail) {
      return { ok: false, message: "User with this email already exists" };
    }

    const hashedPassword = await hash(password, 10);
    await prisma.user.create({
      data: {
        email,
        name: username,
        password: hashedPassword,
      },
    });

    return { ok: true, message: "Account created" };
  } catch (err) {
    return { ok: false, message: "Something went wrong" };
  }
};

export const deleteUser = async () => {
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

    await prisma.user.delete({
      where: {
        id: user.id,
      },
    });

    return { ok: true, message: "Account deleted" };
  } catch (err) {
    return { ok: false, message: "Something went wrong" };
  }
};
