import { drizzle } from "drizzle-orm/postgres-js";

import { env } from "@/env";
import * as schema from "./schema";

export const db = drizzle({
  schema,
  connection: env.DATABASE_URL,
  casing: "snake_case",
});
