"use client";

import { useState } from "react";
import * as Editor from "@/components/editor/editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { slugify } from "@/lib/slugify";

type Page = {
  title: string;
  slug: string;
  url: string;
  publish: boolean;
  content: string;
};

export default function CreateNewPage() {
  const [pageContent, setPageContent] = useState<Page>({
    title: "",
    slug: "",
    url: "",
    publish: false,
    content: "",
  });

  function handleOnSaveClick() {
    console.log(pageContent);
  }

  return (
    <div>
      <header className="flex items-center justify-between gap-2 p-2">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Page Title"
            value={pageContent.title}
            onChange={(event) => {
              setPageContent({
                ...pageContent,
                title: event.target.value,
                slug: slugify(event.target.value),
              });
            }}
          />
          <Input
            placeholder="Page Slug"
            value={pageContent.slug}
            onChange={(event) => {
              setPageContent({ ...pageContent, slug: event.target.value });
            }}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button>Publish</Button>
          <Button onClick={handleOnSaveClick}>Save</Button>
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
