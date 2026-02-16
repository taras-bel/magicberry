"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTranslations } from "@/lib/i18n";
import { analytics } from "./GoogleAnalytics";
import { Search, Filter, X } from "lucide-react";

interface SearchResult {
  id: string;
  type: 'product' | 'recipe' | 'post';
  title: string;
  description: string;
  slug: string;
  image?: string;
  category?: string;
  price?: number;
  unit?: string;
}

interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
}

export default function AdvancedSearch() {
  const t = useTranslations();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const searchTimeout = useRef<NodeJS.Timeout>();

  const categories = [
    { value: "all", label: t("products.all_categories") },
    { value: "dried-berries", label: t("products.dried_berries") },
    { value: "dried-fruits", label: t("products.dried_fruits") },
    { value: "dried-vegetables", label: t("products.dried_vegetables") },
    { value: "syrups", label: t("products.syrups") },
    { value: "mixes", label: t("products.mixes") }
  ];

  const types = [
    { value: "all", label: t("common.search") },
    { value: "product", label: t("products.title") },
    { value: "recipe", label: t("recipes.title") },
    { value: "post", label: t("navigation.blog") }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (!query.trim()) {
      setResults([]);
      return;
    }

    searchTimeout.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          q: query,
          ...(selectedCategory !== "all" && { category: selectedCategory }),
          ...(selectedType !== "all" && { type: selectedType }),
          limit: "10"
        });

        const response = await fetch(`/api/search?${params}`);
        const data: SearchResponse = await response.json();
        setResults(data.results);
        setIsDropdownOpen(true);

        // Отслеживание поиска
        analytics.search(query);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [query, selectedCategory, selectedType]);

  const getResultUrl = (result: SearchResult) => {
    switch (result.type) {
      case 'product':
        return `/products/${result.slug}`;
      case 'recipe':
        return `/recipes/${result.slug}`;
      case 'post':
        return `/blog/${result.slug}`;
      default:
        return '/';
    }
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'product':
        return '🛒';
      case 'recipe':
        return '👨‍🍳';
      case 'post':
        return '📝';
      default:
        return '🔍';
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setIsDropdownOpen(true)}
            placeholder={t("products.search")}
            className="w-full rounded-full border border-[var(--border)] surface-glass px-4 py-2 pl-10 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]/20 focus-visible:border-[color:var(--accent)]"
          />
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--secondary-foreground)]" />

          {query && (
            <button
              onClick={() => {
                setQuery("");
                setResults([]);
                setIsDropdownOpen(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--secondary-foreground)] hover:text-[color:var(--foreground)]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`rounded-full border p-2 transition-colors ${
            showFilters
              ? 'bg-[color:var(--accent)] text-white border-[color:var(--accent)]'
              : 'border-[var(--border)] text-[color:var(--secondary-foreground)] hover:text-[color:var(--foreground)]'
          }`}
        >
          <Filter className="h-4 w-4" />
        </button>
      </div>

      {/* Фильтры */}
      {showFilters && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white border border-gray-100 rounded-xl shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-[color:var(--secondary-foreground)] mb-2">
                {t("products.category")}
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] surface-glass px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[color:var(--accent)]/20 focus:border-[color:var(--accent)]"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[color:var(--secondary-foreground)] mb-2">
                {t("common.search")}
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] surface-glass px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[color:var(--accent)]/20 focus:border-[color:var(--accent)]"
              >
                {types.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Результаты поиска */}
      {isDropdownOpen && (results.length > 0 || isLoading) && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden bg-white/95 backdrop-blur shadow-xl border rounded-xl surface-glass">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[color:var(--accent)] border-t-transparent"></div>
            </div>
          ) : (
            <ul className="max-h-96 overflow-y-auto">
              {results.map((result) => (
                <li key={`${result.type}-${result.id}`} className="border-b border-[var(--border-light)] last:border-b-0">
                  <Link
                    href={getResultUrl(result)}
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-[var(--gray-50)] transition-colors"
                  >
                    <span className="mt-0.5 text-lg">{getResultIcon(result.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-[color:var(--foreground)] truncate">{result.title}</h4>
                        <span className="text-xs px-2 py-1 rounded-full bg-[var(--gray-100)] text-[color:var(--secondary-foreground)] capitalize">
                          {result.type}
                        </span>
                      </div>
                      {result.description && (
                        <p className="text-sm text-[color:var(--secondary-foreground)] line-clamp-1 mt-1">
                          {result.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        {result.category && (
                          <span className="text-xs text-[color:var(--secondary-foreground)]">{result.category}</span>
                        )}
                        {/* Price hidden */}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {results.length > 0 && (
            <div className="border-t border-[var(--border)] bg-[var(--gray-50)] px-4 py-2">
              <Link
                href={`/search?q=${encodeURIComponent(query)}&category=${selectedCategory}&type=${selectedType}`}
                onClick={() => setIsDropdownOpen(false)}
                className="text-sm text-[color:var(--accent)] hover:opacity-80 font-medium"
              >
                {t("common.show_more")} ({results.length} {t("common.search").toLowerCase()})
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
