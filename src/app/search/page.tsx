"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "@/lib/i18n";
import ProductCard from "@/components/ProductCard";
import { Search, Filter } from "lucide-react";

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

function SearchContent() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'all';
  const type = searchParams.get('type') || 'all';

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        setTotal(0);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          q: query,
          ...(category !== 'all' && { category }),
          ...(type !== 'all' && { type }),
          limit: '50'
        });

        const response = await fetch(`/api/search?${params}`);
        const data: SearchResponse = await response.json();
        setResults(data.results);
        setTotal(data.total);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
        setTotal(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query, category, type]);

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

  const products = results.filter(r => r.type === 'product');
  const recipes = results.filter(r => r.type === 'recipe');
  const posts = results.filter(r => r.type === 'post');

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        {/* Заголовок */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
              <Search className="h-5 w-5 text-accent" />
            </div>
            <div className="inline-flex items-center gap-3">
              <div className="w-1 h-10 bg-gradient-to-b from-accent to-accent-gold rounded-full"></div>
              <h1 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight">
                {t("common.search")}
              </h1>
            </div>
          </div>

          {query && (
            <div className="flex items-center gap-2 text-lg text-gray-600 font-normal">
              <span>Результаты поиска:</span>
              <span className="font-medium text-gray-900">"{query}"</span>
              {total > 0 && (
                <span className="text-gray-500">
                  ({total} {t("common.search").toLowerCase()})
                </span>
              )}
            </div>
          )}

          {(category !== 'all' || type !== 'all') && (
            <div className="flex items-center gap-2 mt-3">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600 font-medium">
                {category !== 'all' && `${t("products.category")}: ${category}`}
                {category !== 'all' && type !== 'all' && ', '}
                {type !== 'all' && `${t("common.search")}: ${type}`}
              </span>
            </div>
          )}
        </div>

        {/* Загрузка */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">{t("common.loading")}</p>
            </div>
          </div>
        )}

        {/* Результаты */}
        {!isLoading && results.length === 0 && query && (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3 tracking-tight">
              {t("common.search")} не найден
            </h3>
            <p className="text-gray-600 mb-8 font-normal text-lg">
              Попробуйте изменить запрос или фильтры
            </p>
            <Link
              href="/products"
              className="btn btn-primary"
            >
              {t("products.view_all")}
            </Link>
          </div>
        )}

        {!isLoading && results.length > 0 && (
          <div className="space-y-16">
            {/* Продукты */}
            {products.length > 0 && (
              <section>
                <div className="inline-flex items-center gap-3 mb-8">
                  <div className="w-1 h-8 bg-gradient-to-b from-accent to-accent-gold rounded-full"></div>
                  <h2 className="text-3xl font-semibold text-gray-900 tracking-tight flex items-center gap-2">
                    <span>{getResultIcon('product')}</span>
                    {t("products.title")} ({products.length})
                  </h2>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={{
                        id: product.id,
                        slug: product.slug,
                        name: product.title,
                        shortDescription: product.description,
                        image: product.image,
                        priceFrom: product.price,
                        unit: product.unit
                      }}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Рецепты */}
            {recipes.length > 0 && (
              <section>
                <div className="inline-flex items-center gap-3 mb-8">
                  <div className="w-1 h-8 bg-gradient-to-b from-accent to-accent-gold rounded-full"></div>
                  <h2 className="text-3xl font-semibold text-gray-900 tracking-tight flex items-center gap-2">
                    <span>{getResultIcon('recipe')}</span>
                    {t("recipes.title")} ({recipes.length})
                  </h2>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {recipes.map((recipe) => (
                    <Link
                      key={recipe.id}
                      href={getResultUrl(recipe)}
                      className="card-premium group overflow-hidden transition-all hover:shadow-lg"
                    >
                      <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center">
                        <span className="text-4xl">{getResultIcon(recipe.type)}</span>
                      </div>
                      <div className="p-6">
                        <h3 className="font-semibold text-gray-900 group-hover:text-accent transition-colors mb-2">
                          {recipe.title}
                        </h3>
                        {recipe.description && (
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2 font-normal">
                            {recipe.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Посты */}
            {posts.length > 0 && (
              <section>
                <div className="inline-flex items-center gap-3 mb-8">
                  <div className="w-1 h-8 bg-gradient-to-b from-accent to-accent-gold rounded-full"></div>
                  <h2 className="text-3xl font-semibold text-gray-900 tracking-tight flex items-center gap-2">
                    <span>{getResultIcon('post')}</span>
                    {t("navigation.blog")} ({posts.length})
                  </h2>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {posts.map((post) => (
                    <Link
                      key={post.id}
                      href={getResultUrl(post)}
                      className="card-premium group overflow-hidden transition-all hover:shadow-lg"
                    >
                      <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center">
                        <span className="text-4xl">{getResultIcon(post.type)}</span>
                      </div>
                      <div className="p-6">
                        <h3 className="font-semibold text-gray-900 group-hover:text-accent transition-colors mb-2">
                          {post.title}
                        </h3>
                        {post.description && (
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2 font-normal">
                            {post.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Нет результатов */}
        {!isLoading && !query && (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3 tracking-tight">
              Начните поиск
            </h3>
            <p className="text-gray-600 font-normal text-lg">
              Введите запрос в поле поиска выше
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Загрузка...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
