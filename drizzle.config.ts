import { defineConfig } from "drizzle-kit";

import { env } from "@/env";

export default defineConfig({
  dialect: "postgresql",
  casing: "snake_case",
  out: "./src/lib/db/migrations",
  schema: "./src/lib/db/schema.ts",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
