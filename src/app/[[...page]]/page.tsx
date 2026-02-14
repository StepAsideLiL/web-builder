import { eq } from "drizzle-orm";
import { Settings } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
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

export default async function Page(props: PageProps<"/[[...page]]">) {
  const pageUrl =
    (await props.params).page === undefined
      ? "/"
      : `/${(await props.params).page?.join("/")}`;

  const pageContent = await db
    .select()
    .from(pagesTable)
    .where(eq(pagesTable.url, pageUrl))
    .get();

  if (pageUrl !== "/" && pageContent === undefined) {
    notFound();
  }

  return (
    <div>
      <main className="mx-auto w-full max-w-7xl py-10">
        {pageContent === undefined ? (
          <Empty className="border shadow">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Settings />
              </EmptyMedia>
              <EmptyTitle>No Home Page</EmptyTitle>
              <EmptyDescription>
                You haven&apos;t created home page yet. Get started by creating
                home page.
              </EmptyDescription>
              <EmptyContent className="flex-row items-center justify-center gap-2">
                <Button className="cursor-pointer" asChild>
                  <Link href="/admin/pages">Create Home Page</Link>
                </Button>

                <Button
                  variant={"secondary"}
                  className="cursor-pointer"
                  asChild
                >
                  <Link href="/admin">Dashboard</Link>
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
 * - create admin page
 * - create pages page
 * - get page content from db
 * - create edit page with tiptap
 */
