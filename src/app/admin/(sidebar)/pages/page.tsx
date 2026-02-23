import { Settings } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
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

export default async function Page() {
  const pages = await db.select().from(pagesTable);

  return (
    <main className="mx-auto w-full max-w-7xl space-y-5 py-10">
      <section>
        <Button className="cursor-pointer" asChild>
          <Link href="/admin/edit?action=new-page">Create New Page</Link>
        </Button>
      </section>

      <section>
        {pages.length !== 0 ? (
          <div className="space-y-2">
            {pages.map((page) => (
              <div key={page.id} className="border p-2">
                <div className="flex items-center gap-2">
                  <h1>{page.title}</h1>
                  <Badge variant={"outline"}>{page.url}</Badge>
                </div>
                <Button variant={"link"} asChild>
                  <Link href={`/admin/edit?action=edit&pageId=${page.id}`}>
                    Edit
                  </Link>
                </Button>
                <Button variant={"link"} asChild>
                  <Link href={`${page.url}`}>View</Link>
                </Button>
              </div>
            ))}
          </div>
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
