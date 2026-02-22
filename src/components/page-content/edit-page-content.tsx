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

export default function EditPageContent({
  content,
}: {
  content?: TPageContent;
}) {
  const [pageContent, setPageContent] = useState<TPageContent>(
    content
      ? content
      : {
          title: "",
          slug: "",
          url: "",
          publish: "draft",
          content: "",
        },
  );
  const [saveBtnLoading, setSaveBtnLoadingLoading] = useState(false);
  const [publishBtnLoading, setPublishBtnLoadingLoading] = useState(false);
  const router = useRouter();

  console.log(pageContent);

  async function upsertPage(page: TPageContent) {
    if (pageContent.title === "") {
      toast.error("Page title can not be empty");
      setSaveBtnLoadingLoading(false);
      setPublishBtnLoadingLoading(false);
      return;
    }
    if (pageContent.slug === "") {
      toast.error("Page slug can not be empty");
      setSaveBtnLoadingLoading(false);
      setPublishBtnLoadingLoading(false);
      return;
    }
    if (pageContent.content === "") {
      toast.error("Page content can not be empty");
      setSaveBtnLoadingLoading(false);
      setPublishBtnLoadingLoading(false);
      return;
    }
    await createNewPage(page).catch(() => {
      console.error("Failed to modify DB.");
    });
  }

  async function handleOnSaveClick() {
    setSaveBtnLoadingLoading(true);
    await upsertPage({ ...pageContent })
      .then(() => {
        setSaveBtnLoadingLoading(false);
        toast.success("Page is saved as draft.");
        router.replace(`/admin/pages?action=edit&slug=${pageContent.slug}`);
      })
      .catch(() => {
        setSaveBtnLoadingLoading(false);
        toast.error("Page is failed to save.");
      });
  }

  async function handleOnPublishClick() {
    setPublishBtnLoadingLoading(true);
    await upsertPage({ ...pageContent, publish: "publish" })
      .then(() => {
        setPublishBtnLoadingLoading(false);
        toast.success("Page is published.");
        router.refresh();
      })
      .catch(() => {
        setPublishBtnLoadingLoading(false);
        toast.error("Post id failed to publish.");
      });
  }

  async function handleOnUnpublishClick() {
    setPublishBtnLoadingLoading(true);
    await upsertPage({ ...pageContent, publish: "unpublish" })
      .then(() => {
        setPublishBtnLoadingLoading(false);
        toast.success("Page is unpublished.");
        router.refresh();
      })
      .catch(() => {
        setPublishBtnLoadingLoading(false);
        toast.error("Post id failed to unpublish.");
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
          {(pageContent.publish === "unpublish" ||
            pageContent.publish === "draft") && (
            <div>
              {publishBtnLoading ? (
                <Button disabled={publishBtnLoading || saveBtnLoading}>
                  Publishing... <Spinner data-icon="inline-start" />
                </Button>
              ) : (
                <Button
                  disabled={publishBtnLoading || saveBtnLoading}
                  className="cursor-pointer"
                  onClick={handleOnPublishClick}
                >
                  Publish
                </Button>
              )}
            </div>
          )}
          {pageContent.publish === "publish" && (
            <div>
              {publishBtnLoading ? (
                <Button disabled={publishBtnLoading || saveBtnLoading}>
                  Unpublishing... <Spinner data-icon="inline-start" />
                </Button>
              ) : (
                <Button
                  disabled={publishBtnLoading || saveBtnLoading}
                  className="cursor-pointer"
                  onClick={handleOnUnpublishClick}
                >
                  Unpublish
                </Button>
              )}
            </div>
          )}
          {saveBtnLoading ? (
            <Button variant={"outline"} disabled={saveBtnLoading}>
              Saving... <Spinner data-icon="inline-start" />
            </Button>
          ) : (
            <Button
              variant={"outline"}
              className="cursor-pointer"
              disabled={saveBtnLoading || publishBtnLoading}
              onClick={handleOnSaveClick}
            >
              Save
            </Button>
          )}
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl space-y-5 py-10">
        <Editor.Provider
          content={content ? content.content : ""}
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
