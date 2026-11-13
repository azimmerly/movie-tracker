import { type AnyColumn, asc, sql } from "drizzle-orm";

export const ascLower = (column: AnyColumn) => asc(sql`lower(${column})`);
