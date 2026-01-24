"use server";

import { revalidatePath } from "next/cache";

export const revalidatePaths = async (paths: string[]) => {
  paths.forEach((path) => revalidatePath(path));
};
