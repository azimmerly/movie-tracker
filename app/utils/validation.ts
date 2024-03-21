import { z } from "zod";

export const LIST_TITLE_MAX_CHARS = 40;

const listTitleschema = z.string().trim().min(1).max(LIST_TITLE_MAX_CHARS);
const searchTermSchema = z.string().trim().min(1);

export const isValidListTitle = (title: string) => {
  const validatedTitle = listTitleschema.safeParse(title);
  return validatedTitle.success;
};

export const isValidSearchTerm = (searchTerm: string) => {
  const validatedSearchTerm = searchTermSchema.safeParse(searchTerm);
  return validatedSearchTerm.success;
};
