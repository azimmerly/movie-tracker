"use server";

import { createFetch } from "@better-fetch/fetch";
import { revalidatePath } from "next/cache";

import { MOVIE_DB_API_URL } from "@/consts";
import { env } from "@/env";

export const revalidatePaths = async (paths: string[]) => {
  paths.forEach((path) => revalidatePath(path));
};

export const movieDbFetch = createFetch({
  retry: 2,
  throw: true,
  baseURL: MOVIE_DB_API_URL,
  method: "GET",
  headers: {
    accept: "application/json",
    authorization: `Bearer ${env.MOVIEDB_API_KEY}`,
  },
});
