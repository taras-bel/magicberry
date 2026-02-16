"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function TagFilter({ tags }: { tags: string[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const current = params.get("tag") || "all";
  function setTag(value: string) {
    const url = new URL(window.location.href);
    if (value === "all") url.searchParams.delete("tag");
    else url.searchParams.set("tag", value);
    url.searchParams.delete("page");
    router.push(url.pathname + url.search);
  }
  const options = ["all", ...tags];
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((t) => (
        <button
          key={t}
          onClick={() => setTag(t)}
          className={`pill text-sm ${current === t ? "pill-active" : ""}`}
        >
          {t === "all" ? "Все" : t}
        </button>
      ))}
    </div>
  );
}


