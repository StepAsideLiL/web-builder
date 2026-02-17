"use client";

import * as Editor from "@/components/editor/editor";

export default function RenderPageContent({ content }: { content: string }) {
  return (
    <Editor.Provider content={content}>
      <Editor.ReadOnly />
    </Editor.Provider>
  );
}
