"use client";

import Link from "next/link";
import Image from "next/image";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Newsletter from "@/components/Newsletter";
import Reveal from "@/components/Reveal";
import HeroSplit from "@/components/HeroSplit";
import { recipes } from "@/data/recipes";
import RecipeCard from "@/components/RecipeCard";
import ProductRecommendations from "@/components/ProductRecommendations";
import { useSession } from "next-auth/react";
import { useTranslations } from "@/lib/i18n";

export default function Home() {
  const { data: session, status } = useSession();
  const t = useTranslations();
  const featured = products.slice(0, 3);
  
  return (
    <div className="bg-white">
      <HeroSplit />

      {/* Featured Products */}
      <section className="py-24 lg:py-32">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-16">
            <div className="max-w-xl">
              <h2 className="mb-6">{t('products.popular')}</h2>
              <p className="text-gray-500 font-light text-lg">
                {t('products.popular_desc')}
              </p>
            </div>
            <Link href="/products" className="hidden md:flex btn btn-outline px-8 py-3 text-xs">
              {t('products.view_all')}
            </Link>
          </div>
          
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <Reveal key={p.id}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
          
          <div className="mt-12 text-center md:hidden">
             <Link href="/products" className="btn btn-outline w-full">
              {t('products.view_all')}
            </Link>
          </div>
        </div>
      </section>

      {/* Philosophy / About teaser */}
      <section className="py-24 bg-gray-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
             <div className="space-y-8">
               <h2 className="text-4xl lg:text-5xl leading-tight">
                 {t('home.philosophy_title')}
               </h2>
               <div className="space-y-6 text-gray-600 font-light leading-relaxed">
                 <p>{t('home.philosophy_text_1')}</p>
                 <p>{t('home.philosophy_text_2')}</p>
               </div>
               <Link href="/about" className="text-berry font-medium uppercase tracking-widest text-sm hover:text-primary transition-colors inline-block pt-4">
                 {t('home.read_history')}
               </Link>
             </div>
             <div className="relative aspect-square bg-gray-200 lg:h-[600px] lg:aspect-auto">
               <Image
                 src="/images/about-process.png"
                 alt={t('home.philosophy_title')}
                 fill
                 className="object-cover"
                 unoptimized
               />
             </div>
          </div>
        </div>
      </section>

      {/* Recipes & Inspiration */}
      <section className="py-24 lg:py-32">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-16">
            <h2>{t('home.inspiration')}</h2>
            <Link href="/recipes" className="text-sm font-medium hover:text-berry transition-colors">
              {t('home.all_recipes')}
            </Link>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.slice(0, 3).map((r) => (
              <RecipeCard key={r.slug} recipe={r} />
            ))}
          </div>
        </div>
      </section>

      {/* Personal Recommendations (if logged in) */}
      <section className="py-24 border-t border-gray-100">
        <div className="container-custom text-center mb-16">
          <h2 className="text-3xl lg:text-4xl mb-4">{t('home.personal_picks')}</h2>
          <p className="text-gray-500">{t('home.personal_desc')}</p>
        </div>
        <div className="container-custom">
           <ProductRecommendations
            type={status === "loading" ? "trending" : session ? "personal" : "trending"}
            limit={4}
          />
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-primary text-white">
        <div className="container-custom max-w-4xl text-center">
          <h2 className="text-white mb-6">{t('home.newsletter_title')}</h2>
          <p className="text-gray-400 mb-10 font-light max-w-lg mx-auto">
            {t('home.newsletter_desc')}
          </p>
          <div className="max-w-md mx-auto">
            <Newsletter />
          </div>
        </div>
      </section>
    </div>
  );
}
