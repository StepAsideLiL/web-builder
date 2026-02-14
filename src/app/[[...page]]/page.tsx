import { eq } from "drizzle-orm";
import { Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
// import PageEditor from "@/components/page-editor";
import { db } from "@/lib/db";
import { pagesTable } from "@/lib/db/schema";
import { loadSearchParams } from "@/lib/search-param";

export default async function Page(props: PageProps<"/[[...page]]">) {
  const pageUrl =
    (await props.params).page === undefined
      ? "/"
      : `/${(await props.params).page?.join("/")}`;
  const { action } = loadSearchParams(await props.searchParams);

  if (action === "edit") {
    return <div>edit page</div>;
  }

  const pageContent = await db
    .select()
    .from(pagesTable)
    .where(eq(pagesTable.url, pageUrl))
    .get();

  console.log(pageContent);

  return (
    <div>
      <main className="mx-auto w-full max-w-7xl py-10">
        {pageContent === undefined ? (
          <Empty className="border bg-secondary shadow">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Settings />
              </EmptyMedia>
              <EmptyTitle>No Page</EmptyTitle>
              <EmptyDescription>
                You haven&apos;t created home page yet. Get started by creating
                home page.
              </EmptyDescription>
              <EmptyContent className="flex-row justify-center gap-2">
                <Button className="cursor-pointer" asChild>
                  <Link
                    href={
                      pageUrl === "/"
                        ? "/?action=edit"
                        : `${pageUrl}?action=edit`
                    }
                  >
                    Create Home Page
                  </Link>
                </Button>

                <Button variant={"outline"} className="cursor-pointer">
                  Dashboard
                </Button>
              </EmptyContent>
            </EmptyHeader>
          </Empty>
        ) : (
          <div>hello</div>
        )}
      </main>
    </div>
  );
}

/**
 * TODOs
 * - get page content from db
 * - create edit page with tiptap
 */
