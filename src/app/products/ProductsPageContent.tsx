"use client";

import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/catalog";
import { useTranslations, useI18n } from "@/lib/i18n";

type ProductsPageContentProps = {
  products: Product[];
  category?: string;
  search?: string;
};

const categoryInfo = {
  "dried-berries": {
    titleKey: "dried_berries",
    icon: "🫐",
    image: "/images/categories/cat-berries.png"
  },
  "dried-fruits": {
    titleKey: "dried_fruits",
    icon: "🍎",
    image: "/images/categories/cat-fruits.png"
  },
  "dried-vegetables": {
    titleKey: "dried_vegetables",
    icon: "🥕",
    image: "/images/categories/cat-vegetables.png"
  },
  "syrups": {
    titleKey: "syrups",
    icon: "🧪",
    image: "/images/categories/cat-syrups.png"
  },
};

const benefits = [
  {
    titleKey: "natural",
    descKey: "natural_desc",
    icon: "🌱"
  },
  {
    titleKey: "vitamins",
    descKey: "vitamins_desc",
    icon: "💚"
  },
  {
    titleKey: "storage",
    descKey: "storage_desc",
    icon: "⏰"
  }
];

export default function ProductsPageContent({ products, category }: ProductsPageContentProps) {
  const t = useTranslations();
  const { locale } = useI18n();

  const getCategoryTitle = (key: string) => t(`products.${key}`);
  
  // Определяем заголовок и описание текущей категории
  const currentCategoryInfo = category && category in categoryInfo 
    ? categoryInfo[category as keyof typeof categoryInfo] 
    : null;

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-white via-gray-50 to-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-berry/5 rounded-full blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 mb-5">
                <div className="w-1 h-10 bg-gradient-to-b from-berry to-gold rounded-full"></div>
                <h1 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight">
                  {t('products_page.title')}
                </h1>
              </div>
              <p className="text-xl text-gray-600 leading-relaxed font-normal max-w-xl">
                {t('products_page.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link href="#catalog" className="btn btn-primary text-base px-8 py-4">
                  {t('products_page.view_catalog')}
                </Link>
                <Link href="/about" className="btn btn-secondary text-base px-8 py-4">
                  {t('hero.about')}
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-2xl">
                <Image
                  src="/images/categories/cat-berries.png"
                  alt={t('products_page.title')}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 border-t border-gray-200 bg-gradient-to-b from-white to-gray-50/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-5 justify-center">
              <div className="w-1 h-10 bg-gradient-to-b from-berry to-gold rounded-full"></div>
              <h2 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight">
                {t('products_page.why_choose')}
              </h2>
            </div>
            <p className="text-lg text-gray-600 font-normal max-w-2xl mx-auto leading-relaxed">
              {t('products_page.why_choose_desc')}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="panel p-8 text-center hover-lift">
                <div className="text-5xl mb-6">{benefit.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {t(`products_page.benefits.${benefit.titleKey}`)}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t(`products_page.benefits.${benefit.descKey}`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {!category && (
        <section className="py-20 border-t border-gray-200 bg-gradient-to-br from-gray-50 to-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 mb-5 justify-center">
                <div className="w-1 h-10 bg-gradient-to-b from-berry to-gold rounded-full"></div>
                <h2 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight">
                  {t('products_page.categories_title')}
                </h2>
              </div>
              <p className="text-lg text-gray-600 font-normal max-w-2xl mx-auto leading-relaxed">
                {t('products_page.categories_desc')}
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {Object.entries(categoryInfo).map(([key, info]) => (
                <Link
                  key={key}
                  href={`/products?category=${key}`}
                  className="card-premium block group"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    <Image
                      src={info.image}
                      alt={getCategoryTitle(info.titleKey)}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-4 left-4 text-4xl opacity-80">{info.icon}</div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-berry transition-colors">
                      {getCategoryTitle(info.titleKey)}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {/* Описание категории пока берем стандартное, можно добавить ключ */}
                      {getCategoryTitle(info.titleKey)}
                    </p>
                  </div>
                </Link>
              ))}
              
              {/* Gift Card */}
              <Link
                href="/gifts"
                className="card-premium block group ring-2 ring-[color:var(--berry)]/20"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-berry/10 to-gold/10">
                  <Image
                    src="/images/categories/cat-gifts.png"
                    alt={t('products_page.gift_card_title')}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-4 left-4 text-4xl opacity-80">🎁</div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-berry transition-colors">
                    {t('products_page.gift_card_title')}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {t('products_page.gift_card_desc')}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Catalog Section */}
      <section id="catalog" className="py-20 border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <div className="inline-flex items-center gap-3 mb-5">
                <div className="w-1 h-10 bg-gradient-to-b from-berry to-gold rounded-full"></div>
                <h2 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight">
                  {currentCategoryInfo ? getCategoryTitle(currentCategoryInfo.titleKey) : t('products.view_all')}
                </h2>
              </div>
              <p className="text-lg text-gray-600 font-normal max-w-2xl leading-relaxed">
                {currentCategoryInfo
                  ? getCategoryTitle(currentCategoryInfo.titleKey) // Можно добавить отд. описание
                  : t('products_page.subtitle')
                }
              </p>
              {category && (
                <p className="mt-2 text-sm text-berry font-semibold">
                  {t('products_page.shown_products')} {products.length} {products.length === 1 ? t('products_page.product_singular') : t('products_page.product_plural')}
                </p>
              )}
            </div>
          </div>

          {products.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-7xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {t('products_page.not_found')}
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                {category ? t('products_page.not_found_desc') : t('products_page.not_found')}
              </p>
              <Link href="/products" className="btn btn-primary">
                {t('products_page.view_catalog')}
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-gray-200 bg-gradient-to-br from-berry via-berry-dark to-berry-dark relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/images/hero-bg.png"
            alt="Background"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10"></div>
        <div className="relative mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-semibold text-white mb-6 tracking-tight">
            {t('products_page.cta_title')}
          </h2>
          <p className="text-white/90 mb-10 text-xl font-normal leading-relaxed">
            {t('products_page.cta_desc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contacts" className="btn btn-secondary bg-white text-berry hover:bg-gray-100">
              {t('products_page.cta_contact')}
            </Link>
            <Link href="/faq" className="btn bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/20">
              {t('products_page.cta_faq')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
