import type { InferSelectModel } from "drizzle-orm";
import type { pagesTable } from "@/lib/db/schema";

export type TPage = InferSelectModel<typeof pagesTable>;
export type TPageContent = Omit<InferSelectModel<typeof pagesTable>, "id">;
export type TAdminNavMenus = {
  name: string;
  href: string;
};
