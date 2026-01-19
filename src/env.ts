import { z } from "zod";

const envSchema = z.object({
  BETTER_AUTH_SECRET: z.string(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  DATABASE_URL: z.string(),
  MOVIEDB_API_KEY: z.string(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const envVars = parsedEnv.error.issues.map(({ path }) => path[0]).join(", ");
  throw new Error(`Missing environment variables: ${envVars}`);
}

export const env = parsedEnv.data;
