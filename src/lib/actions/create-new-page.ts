"use server";

import { db } from "@/lib/db";
import { pagesTable } from "@/lib/db/schema";
import type { TPageContent } from "@/lib/types";

export async function createNewPage(pageContent: TPageContent) {
  const { title, slug, url, content, publish } = pageContent;

  await db
    .insert(pagesTable)
    .values({
      title,
      slug,
      url,
      publish,
      content,
    })
    .onConflictDoUpdate({
      target: pagesTable.url,
      set: {
        title,
        slug,
        url,
        publish,
        content,
      },
    })
    .catch((error) => {
      throw new Error(
        "Failed to insert data in db - createNewPage action.\n",
        error,
      );
    });
}
