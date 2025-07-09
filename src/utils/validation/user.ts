import { z } from "zod";

const emailSchema = z
  .string()
  .min(1, { error: "Required" })
  .email({ error: "Invalid email" });

const nameSchema = z
  .string()
  .trim()
  .min(1, { error: "Required" })
  .max(30, { error: "Max 30 characters" })
  .regex(/^[a-zA-Z0-9_\s]+$/, { error: "Alphanumeric only" });

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { error: "Required" }),
  rememberMe: z.boolean(),
});

export const signUpSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: z.string().min(8, { error: "Min 8 characters" }),
    passwordConfirm: z.string().min(1, { error: "Required" }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    error: "Must match",
  });

export const updateUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
});
