import { z } from "zod";

const titleSchema = z
  .string()
  .trim()
  .min(1, { error: "Required" })
  .max(50, { error: "Max 50 characters" });

const descriptionSchema = z
  .string()
  .trim()
  .max(150, { error: "Max 150 characters" })
  .nullish()
  .transform((v) => v || null);

export const addListSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  private: z.boolean(),
});

export const updateListSchema = z.object({
  id: z.uuid(),
  title: titleSchema.optional(),
  description: descriptionSchema,
  private: z.boolean().optional(),
});
