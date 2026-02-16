export type TPageContent = {
  title: string;
  slug: string;
  url: string;
  publish: "unpublish" | "publish" | "draft";
  content: string;
};
