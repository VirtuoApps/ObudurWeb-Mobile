import React from "react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function RightSide({
  selectedItem,
}: {
  selectedItem: { title: string; mdText: string } | null;
}) {
  return (
    <div className="w-[68%] h-full pt-5 pl-8 text-[#262626] prose prose-lg max-w-none">
      <p className="text-[#262626] font-bold text-[24px] pb-4">
        {selectedItem?.title}
      </p>
      <div dangerouslySetInnerHTML={{ __html: selectedItem?.mdText || "" }} />
    </div>
  );
}
