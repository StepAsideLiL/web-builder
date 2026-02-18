import { eq } from "drizzle-orm";
import { Settings } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import RenderPageContent from "@/components/page-content/render-page-content";
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

  if (
    (pageUrl !== "/" && pageContent === undefined) ||
    pageContent?.publish !== "publish"
  ) {
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
          <RenderPageContent content={pageContent.content} />
        )}
      </main>
    </div>
  );
}

/**
 * TODOs
 * - create admin sitebar
 * - create site settings
 * - get page content from db
 * - create edit page with tiptap
 */
