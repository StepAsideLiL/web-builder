"use server";

import { db } from "@/lib/db";
import { pagesTable } from "@/lib/db/schema";
import type { TPageContent } from "@/lib/types";

export async function createNewPage(pageContent: TPageContent): Promise<
  {
    pageId: number;
  } & TPageContent
> {
  const { title, slug, url, content, publish } = pageContent;

  const res = await db
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
    .returning({
      pageId: pagesTable.id,
      title: pagesTable.title,
      slug: pagesTable.slug,
      url: pagesTable.url,
      publish: pagesTable.publish,
      content: pagesTable.content,
    })
    .get()
    .catch((error) => {
      throw new Error(
        "Failed to insert data in db - createNewPage action.\n",
        error,
      );
    });

  return res;
}
