import { z } from "zod";

export const LIST_TITLE_MAX_CHARS = 40;

export const isValidListTitle = (title: string) => {
  const schema = z.string().trim().min(1).max(LIST_TITLE_MAX_CHARS);
  const validatedTitle = schema.safeParse(title);
  return validatedTitle.success;
};

export const isValidSearchTerm = (title: string) => {
  const schema = z.string().trim().min(1);
  const validatedTitle = schema.safeParse(title);
  return validatedTitle.success;
};
