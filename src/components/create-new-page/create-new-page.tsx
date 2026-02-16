"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import * as Editor from "@/components/editor/editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { createNewPage } from "@/lib/actions/create-new-page";
import { slugify } from "@/lib/slugify";
import type { TPageContent } from "@/lib/types";

export default function CreateNewPage() {
  const [pageContent, setPageContent] = useState<TPageContent>({
    title: "",
    slug: "",
    url: "",
    publish: "draft",
    content: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleOnSaveClick() {
    setLoading(true);
    if (pageContent.title === "") {
      toast.error("Page title can not be empty");
      setLoading(false);
      return;
    }
    if (pageContent.slug === "") {
      toast.error("Page slug can not be empty");
      setLoading(false);
      return;
    }
    if (pageContent.content === "") {
      toast.error("Page content can not be empty");
      setLoading(false);
      return;
    }
    await createNewPage(pageContent)
      .then(() => {
        setLoading(false);
        router.replace(`/admin/pages?action=edit&slug=${pageContent.slug}`);
      })
      .catch(() => {
        setLoading(false);
      });
  }

  return (
    <div>
      <header className="flex items-center justify-between gap-2 p-2">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Page Title"
            className="w-52"
            value={pageContent.title}
            onChange={(event) => {
              const titleSlug = slugify(event.target.value);

              setPageContent({
                ...pageContent,
                title: event.target.value,
                slug: titleSlug,
                url: `/${titleSlug}`,
              });
            }}
          />
          <Input
            placeholder="Page Slug"
            className="w-52"
            value={pageContent.slug}
            onChange={(event) => {
              setPageContent({ ...pageContent, slug: event.target.value });
            }}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button className="cursor-pointer">Publish</Button>
          {loading ? (
            <Button
              variant={"outline"}
              onClick={handleOnSaveClick}
              disabled={loading}
            >
              Saving... <Spinner data-icon="inline-start" />
            </Button>
          ) : (
            <Button
              variant={"outline"}
              className="cursor-pointer"
              onClick={handleOnSaveClick}
            >
              Save
            </Button>
          )}
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl space-y-5 py-10">
        <Editor.Provider
          onUpdate={(editor) => {
            setPageContent({ ...pageContent, content: editor.getHTML() });
          }}
        >
          <Editor.Box />
        </Editor.Provider>
      </main>
    </div>
  );
}
