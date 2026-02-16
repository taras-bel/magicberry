import { posts as mockPosts } from "@/data/blog";
import BlogCard from "@/components/BlogCard";
import TagFilter from "@/components/TagFilter";
import { getCmsPosts } from "@/lib/cms";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  cover?: string;
  content: string[];
  tags?: string[];
}

export const metadata = {
  title: "Блог Magic Berry",
  description: "Новости, статьи и полезная информация о натуральных вяленых продуктах, здоровом питании и кулинарных идеях.",
};

const PAGE_SIZE = 6;

const blogCategories = [
  {
    name: "Технологии",
    description: "О нашей запатентованной технологии вяления",
    icon: "🔬",
    tag: "технологии",
    color: "bg-blue-100 text-blue-800"
  },
  {
    name: "Здоровье",
    description: "Полезные свойства вяленых ягод и фруктов",
    icon: "💚",
    tag: "здоровье",
    color: "bg-green-100 text-green-800"
  },
  {
    name: "Рецепты",
    description: "Кулинарные идеи и советы по приготовлению",
    icon: "👨‍🍳",
    tag: "рецепты",
    color: "bg-orange-100 text-orange-800"
  },
  {
    name: "Новости",
    description: "Последние новости компании и отрасли",
    icon: "📰",
    tag: "новости",
    color: "bg-purple-100 text-purple-800"
  },
  {
    name: "Полезное",
    description: "Советы по выбору и хранению продукции",
    icon: "💡",
    tag: "полезное",
    color: "bg-yellow-100 text-yellow-800"
  },
  {
    name: "Бизнес",
    description: "Информация для партнеров и B2B клиентов",
    icon: "🤝",
    tag: "бизнес",
    color: "bg-indigo-100 text-indigo-800"
  }
];

type Props = { searchParams: { page?: string; tag?: string } };

export default async function BlogPage({ searchParams }: Props) {
  const cms = await getCmsPosts();
  const posts: BlogPost[] = cms.length
    ? cms.map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt || "",
        date: p.date || "",
        cover: typeof p.cover === "string" ? p.cover : undefined,
        content: [p.content || ""],
        tags: p.tags || [],
      }))
    : mockPosts;
  const tag = searchParams.tag;
  const filtered = tag ? posts.filter((p) => p.tags?.includes(tag)) : posts;
  const page = Math.max(1, parseInt(searchParams.page || "1", 10));
  const start = (page - 1) * PAGE_SIZE;
  const list = filtered.slice(start, start + PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags || [])));

  // Получаем последние 3 поста для featured секции
  const featuredPosts = posts.slice(0, 3);

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-white via-gray-50 to-white py-20 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-1 h-10 bg-gradient-to-b from-accent to-accent-gold rounded-full"></div>
                <h1 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight">
                  Блог Magic Berry
                </h1>
              </div>
              <p className="text-xl text-gray-600 font-normal leading-relaxed mb-8">
                Новости, полезная информация и вдохновляющие идеи о натуральных продуктах,
                здоровом питании и кулинарных экспериментах с вялеными ягодами.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#featured" className="btn btn-primary">
                  Популярные статьи
                </a>
                <a href="#categories" className="btn btn-secondary">
                  Категории
                </a>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/products/cranberry-heap-1200.webp"
                alt="Блог Magic Berry"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section id="featured" className="py-20 border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-3 mb-5 justify-center">
              <div className="w-1 h-10 bg-gradient-to-b from-accent to-accent-gold rounded-full"></div>
              <h2 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight">
                Популярные статьи
              </h2>
            </div>
            <p className="text-lg text-gray-600 font-normal leading-relaxed">
              Самые читаемые материалы нашего блога
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {featuredPosts.map((post, index) => (
              <div key={post.slug} className="card-premium overflow-hidden group">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={post.cover || "/images/products/cranberry-1200.webp"}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 border border-gray-200">
                      Популярное
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-sm text-gray-500 mb-2 font-medium">
                    {new Date(post.date).toLocaleDateString('ru-RU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-accent transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 font-normal">{post.excerpt}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      {post.tags?.slice(0, 2).map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-accent/10 text-accent border border-accent/20 rounded-lg text-xs font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-accent hover:text-accent-dark font-semibold text-sm transition-colors"
                    >
                      Читать →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-20 border-t border-gray-200 bg-gradient-to-b from-gray-50/30 to-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-3 mb-5 justify-center">
              <div className="w-1 h-10 bg-gradient-to-b from-accent to-accent-gold rounded-full"></div>
              <h2 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight">
                Темы блога
              </h2>
            </div>
            <p className="text-lg text-gray-600 font-normal leading-relaxed">
              Выберите интересующую вас тему
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogCategories.map((category, index) => (
              <Link
                key={index}
                href={`/blog?tag=${category.tag}`}
                className="card-premium p-6 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">{category.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-accent transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 text-sm font-normal">{category.description}</p>
                  </div>
                </div>
                <div className="text-right pt-4 border-t border-gray-200">
                  <span className="text-accent group-hover:text-accent-dark font-semibold transition-colors">
                    Читать статьи →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Posts Section */}
      <section className="py-20 border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-1 h-10 bg-gradient-to-b from-accent to-accent-gold rounded-full"></div>
                <h2 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight">
                  {tag ? `Статьи: ${tag}` : "Все статьи"}
                </h2>
              </div>
              <p className="text-lg text-gray-600 font-normal leading-relaxed">
                {tag
                  ? `Найдено ${filtered.length} ${filtered.length === 1 ? "статья" : filtered.length < 5 ? "статьи" : "статей"}`
                  : "Новости, полезная информация и вдохновляющие идеи"
                }
              </p>
            </div>

            <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
              <Suspense fallback={<div className="h-10 w-48 animate-pulse rounded-md bg-gray-200" />}>
                <TagFilter tags={allTags} />
              </Suspense>
            </div>
          </div>

          {list.length > 0 ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((p) => (
                  <BlogCard key={p.slug} post={p} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-3">
                  <PageLink page={page - 1} disabled={page <= 1} />
                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                      return (
                        <a
                          key={pageNum}
                          href={`/blog?page=${pageNum}${tag ? `&tag=${tag}` : ''}`}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            pageNum === page
                              ? 'bg-accent text-white shadow-sm'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                          }`}
                        >
                          {pageNum}
                        </a>
                      );
                    })}
                  </div>
                  <PageLink page={page + 1} disabled={page >= totalPages} />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">📝</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3 tracking-tight">
                Статьи не найдены
              </h3>
              <p className="text-gray-600 mb-8 font-normal text-lg">
                В выбранной категории пока нет статей
              </p>
              <Link href="/blog" className="btn btn-primary">
                Смотреть все статьи
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 border-t border-gray-200 bg-gradient-to-br from-accent via-accent-dark to-accent-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10"></div>
        <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-semibold text-white mb-6 tracking-tight">
            Подпишитесь на обновления
          </h2>
          <p className="text-white/90 mb-10 text-xl font-normal leading-relaxed">
            Будьте в курсе новых статей и полезных материалов
          </p>
          <Link href="/contacts" className="btn btn-secondary bg-white text-accent hover:bg-gray-50">
            Подписаться на новости
          </Link>
        </div>
      </section>
    </div>
  );
}

function PageLink({ page, disabled }: { page: number; disabled?: boolean }) {
  const href = `/blog?page=${page}`;
  if (disabled) {
    return <span className="btn btn-secondary opacity-50 cursor-not-allowed">Назад/Далее</span>;
  }
  return (
    <a className="btn btn-secondary" href={href}>
      {page > 1 ? "Далее" : "Назад"}
    </a>
  );
}


