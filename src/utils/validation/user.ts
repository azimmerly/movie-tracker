import { z } from "zod";

const emailSchema = z
  .string()
  .min(1, { message: "Required" })
  .email("Invalid email");

const nameSchema = z
  .string()
  .trim()
  .min(1, { message: "Required" })
  .max(30, { message: "Max 30 characters" })
  .regex(/^[a-zA-Z0-9_\s]+$/, { message: "Alphanumeric only" });

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: "Required" }),
  rememberMe: z.boolean(),
});

export const signUpSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: z.string().min(8, { message: "Min 8 characters" }),
    passwordConfirm: z.string().min(1, { message: "Required" }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Must match",
  });

export const updateUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
});
