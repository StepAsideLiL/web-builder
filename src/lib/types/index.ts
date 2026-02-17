import type { InferSelectModel } from "drizzle-orm";
import type { pagesTable } from "../db/schema";

export type TPageContent = Omit<InferSelectModel<typeof pagesTable>, "id">;
