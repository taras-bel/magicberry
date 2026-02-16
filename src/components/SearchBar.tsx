"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Product } from "@/types/catalog";

type Props = { products: Product[] };

export default function SearchBar({ products }: Props) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return products
      .filter(p =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.shortDescription?.toLowerCase().includes(lowerQuery) ||
        p.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
      )
      .slice(0, 6);
  }, [query, products]);

  return (
    <div className="relative w-full max-w-sm">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Поиск по продуктам…"
        className="w-full rounded-full border border-[var(--border)] surface-glass px-4 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]/20 focus-visible:border-[color:var(--accent)]"
      />
      {results.length > 0 && (
        <div className="panel absolute z-20 mt-2 w-full overflow-hidden rounded-xl">
          <ul className="divide-y divide-[var(--border-light)]">
            {results.map((p) => (
              <li key={p.id} className="bg-white/70 hover:bg-white transition-colors">
                <Link href={`/products/${p.slug}`} className="block px-4 py-2 text-sm text-[color:var(--foreground)]">
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}


