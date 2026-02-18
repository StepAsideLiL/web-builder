"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { setAsHome } from "@/lib/actions/set-as-home";
import type { TPage } from "@/lib/types";

export default function SelectHomePage({ pages }: { pages: TPage[] }) {
  const currentHomePage = pages.find((page) => page.url === "/");
  const [pageUrl, setPageUrl] = useState(
    currentHomePage ? currentHomePage.url : "",
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  console.log(pageUrl);

  async function handleSetAsHomePage() {
    setLoading(true);

    const page = pages.find((page) => page.url === pageUrl);

    if (page && page.url === "/") {
      toast.error("Already a home page.");
      setLoading(false);
      return;
    }

    await setAsHome(pageUrl)
      .then(() => {
        toast.success(`Set ${page?.title} as home page.`);
        setLoading(false);
        setPageUrl("/");
        router.refresh();
      })
      .catch(() => {
        setLoading(false);
      });
  }

  return (
    <div>
      {pages.length !== 0 ? (
        <div className="flex items-center gap-2">
          <Select value={pageUrl} onValueChange={setPageUrl}>
            <SelectTrigger className="w-52 cursor-pointer">
              <SelectValue placeholder="Select Home Page" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectLabel>Pages</SelectLabel>
                {pages.map((page) => (
                  <SelectItem key={page.id} value={page.url} className="w-52">
                    {page.title}
                    <Badge variant={"outline"}>{page.url}</Badge>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {loading ? (
            <Button variant={"outline"} disabled>
              Setting as Home Page <Spinner data-icon="inline-start" />
            </Button>
          ) : (
            <Button
              variant={"outline"}
              className="cursor-pointer"
              onClick={handleSetAsHomePage}
            >
              Set as Home Page
            </Button>
          )}
        </div>
      ) : (
        <p className="text-muted-foreground">No Page Found</p>
      )}
    </div>
  );
}
