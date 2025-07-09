import { z } from "zod";

const titleSchema = z
  .string()
  .trim()
  .min(1, { error: "Required" })
  .max(30, { error: "Max 30 characters" });

export const addListSchema = z.object({
  title: titleSchema,
  private: z.boolean(),
});

export const updateListSchema = z.object({
  id: z.string(),
  title: titleSchema.optional(),
  private: z.boolean().optional(),
});
