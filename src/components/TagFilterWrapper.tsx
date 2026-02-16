"use client";

import { Suspense } from "react";
import TagFilter from "./TagFilter";

export default function TagFilterWrapper({ tags }: { tags: string[] }) {
  return (
    <Suspense fallback={<div className="h-10 w-48 animate-pulse rounded-xl bg-[var(--gray-100)]" />}>
      <TagFilter tags={tags} />
    </Suspense>
  );
}

