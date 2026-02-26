import { eq } from "drizzle-orm";
import EditPageContent from "@/components/page-content/edit-page-content";
import { db } from "@/lib/db";
import { pagesTable } from "@/lib/db/schema";
import { loadSearchParams } from "@/lib/search-param";

export default async function Page(props: PageProps<"/admin/edit">) {
  const { action, pageId } = loadSearchParams(await props.searchParams);

  if (action === "edit" && typeof pageId === "string" && pageId.length > 0) {
    const pageContent = await db
      .select()
      .from(pagesTable)
      .where(eq(pagesTable.id, parseInt(pageId, 10)))
      .get();

    if (pageContent && parseInt(pageId, 10) === pageContent.id) {
      return (
        <EditPageContent
          pageId={pageId}
          action={action}
          content={pageContent}
        />
      );
    }
  }

  return (
    <EditPageContent
      action={action}
      pageId={pageId}
      content={{
        title: "",
        slug: "",
        url: "",
        publish: "draft",
        content: "",
      }}
    />
  );
}
