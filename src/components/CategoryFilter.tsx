"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Category } from "@/types/catalog";

const options: { label: string; value: Category | "all" }[] = [
  { label: "Все", value: "all" },
  { label: "Весовая", value: "weight" },
  { label: "Фасованная", value: "packaged" },
  { label: "Сиропы", value: "syrup" },
  { label: "Сусла", value: "must" },
];

export default function CategoryFilter() {
  const router = useRouter();
  const params = useSearchParams();
  const current = (params.get("category") as Category | null) ?? "all";

  function setCategory(value: string) {
    const url = new URL(window.location.href);
    if (value === "all") {
      url.searchParams.delete("category");
    } else {
      url.searchParams.set("category", value);
    }
    router.push(url.pathname + url.search);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = (current ?? "all") === o.value;
        return (
          <button
            key={o.value}
            onClick={() => setCategory(o.value)}
            className={`pill text-sm ${
              active ? "pill-active" : "hover:bg-[var(--gray-50)]"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}


