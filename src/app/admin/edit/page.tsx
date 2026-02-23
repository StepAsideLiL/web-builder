import { eq } from "drizzle-orm";
import EditPageContent from "@/components/page-content/edit-page-content";
import { db } from "@/lib/db";
import { pagesTable } from "@/lib/db/schema";
import { loadSearchParams } from "@/lib/search-param";

export default async function Page(props: PageProps<"/admin/edit">) {
  const { action, pageId } = loadSearchParams(await props.searchParams);

  if (action === "new-page") {
    return <EditPageContent />;
  }

  if (action === "edit" && typeof pageId === "string" && pageId.length > 0) {
    const pageContent = await db
      .select({
        title: pagesTable.title,
        slug: pagesTable.slug,
        url: pagesTable.url,
        publish: pagesTable.publish,
        content: pagesTable.content,
      })
      .from(pagesTable)
      .where(eq(pagesTable.id, parseInt(pageId, 10)))
      .get();

    if (pageContent) {
      return <EditPageContent content={pageContent} />;
    }
  }
}
