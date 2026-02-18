"use server";

import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { pagesTable } from "@/lib/db/schema";

export async function setAsHome(pageUrl: string) {
  await db.transaction(async (tx) => {
    const currentHomePage = await tx
      .select()
      .from(pagesTable)
      .where(eq(pagesTable.url, "/"))
      .get();

    if (currentHomePage) {
      await tx
        .update(pagesTable)
        .set({
          url: `/${currentHomePage.slug}`,
        })
        .where(eq(pagesTable.url, "/"))
        .catch(() => {
          console.error("Failed to set current home page as page");
          tx.rollback();
        });
    }

    await tx
      .update(pagesTable)
      .set({ url: "/" })
      .where(eq(pagesTable.url, pageUrl))
      .catch(() => {
        console.error("Failed to set home url");
        tx.rollback();
      });
  });
}
