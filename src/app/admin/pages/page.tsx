import { Settings } from "lucide-react";
import Link from "next/link";
import CreateNewPage from "@/components/create-new-page/create-new-page";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { db } from "@/lib/db";
import { pagesTable } from "@/lib/db/schema";
import { loadSearchParams } from "@/lib/search-param";

export default async function Page(props: PageProps<"/admin/pages">) {
  const { action } = loadSearchParams(await props.searchParams);

  console.log(action);

  if (action === "new-page") {
    return <CreateNewPage />;
  }

  const pageContent = await db.select().from(pagesTable);

  return (
    <main className="mx-auto w-full max-w-7xl space-y-5 py-10">
      <section>
        <Button className="cursor-pointer" asChild>
          <Link href="/admin/pages?action=new-page">Create New Page</Link>
        </Button>
      </section>

      <section>
        {pageContent.length !== 0 ? (
          <div>pages</div>
        ) : (
          <div>
            <Empty className="border shadow">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Settings />
                </EmptyMedia>
                <EmptyTitle>No Page Found</EmptyTitle>
                <EmptyDescription>
                  You haven&apos;t created any page yet. Get started by creating
                  a page.
                </EmptyDescription>
                <EmptyContent className="flex-row items-center justify-center gap-2">
                  <Button className="cursor-pointer" asChild>
                    <Link href="/admin/pages?action=new-page">
                      Create New Page
                    </Link>
                  </Button>
                </EmptyContent>
              </EmptyHeader>
            </Empty>
          </div>
        )}
      </section>
    </main>
  );
}
