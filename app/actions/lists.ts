"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { isValidListTitle } from "@/app/utils/validation";
import prisma from "@/prisma/db";

type AddList = {
  listTitle: string;
};

type DeleteList = {
  listId: string;
};

type UpdateList = {
  listId: string;
  listTitle: string;
};

export const addList = async ({ listTitle }: AddList) => {
  if (!isValidListTitle(listTitle)) {
    return { ok: false, message: "List title must not be empty" };
  }

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

    await prisma.list.create({
      data: {
        title: listTitle,
        userId: user.id,
      },
    });

    return { ok: true, message: "List created" };
  } catch (err) {
    return { ok: false, message: "Something went wrong" };
  }
};

export const deleteList = async ({ listId }: DeleteList) => {
  try {
    await prisma.list.delete({
      where: {
        id: listId,
      },
    });

    return { ok: true, message: "List deleted" };
  } catch (err) {
    return { ok: false, message: "Something went wrong" };
  }
};

export const updateList = async ({ listId, listTitle }: UpdateList) => {
  if (!isValidListTitle(listTitle)) {
    return { ok: false, message: "List title must not be empty" };
  }

  try {
    await prisma.list.update({
      where: {
        id: listId,
      },
      data: {
        title: listTitle,
      },
    });

    return { ok: true, message: "List title updated" };
  } catch (err) {
    return { ok: false, message: "Something went wrong" };
  }
};
