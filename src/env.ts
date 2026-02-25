import { z } from "zod";

const envSchema = z.object({
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_BASE_URL: z.url(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  DATABASE_URL: z.url().startsWith("postgresql://"),
  MOVIEDB_API_KEY: z.string(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  throw new Error(z.prettifyError(parsedEnv.error));
}

export const env = parsedEnv.data;
