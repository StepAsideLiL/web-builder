import { drizzle } from "drizzle-orm/libsql";

// biome-ignore lint/style/noNonNullAssertion: <"allow">
export const db = drizzle(process.env.DB_FILE_NAME!);
