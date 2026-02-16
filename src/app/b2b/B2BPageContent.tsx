"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "@/lib/i18n";

export default function B2BPageContent() {
  const t = useTranslations();

  const b2bProducts = [
    {
      title: t('b2b_page.product_cards.syrups.title'),
      description: t('b2b_page.product_cards.syrups.desc'),
      applications: (t('b2b_page.product_cards.syrups.apps') as any) as string[],
      benefits: (t('b2b_page.product_cards.syrups.benefits') as any) as string[],
      icon: "🧪",
      image: "/images/products/fruit-mix-1200.png"
    },
    {
      title: t('b2b_page.product_cards.must.title'),
      description: t('b2b_page.product_cards.must.desc'),
      applications: (t('b2b_page.product_cards.must.apps') as any) as string[],
      benefits: (t('b2b_page.product_cards.must.benefits') as any) as string[],
      icon: "🏭",
      image: "/images/products/golden-berries-1200.png"
    },
    {
      title: t('b2b_page.product_cards.ingredients.title'),
      description: t('b2b_page.product_cards.ingredients.desc'),
      applications: (t('b2b_page.product_cards.ingredients.apps') as any) as string[],
      benefits: (t('b2b_page.product_cards.ingredients.benefits') as any) as string[],
      icon: "🫐",
      image: "/images/products/cranberry-1200.png"
    }
  ];

  const industries = [
    {
      title: t('b2b_page.industry_cards.horeca.title'),
      description: t('b2b_page.industry_cards.horeca.desc'),
      services: (t('b2b_page.industry_cards.horeca.services') as any) as string[],
      icon: "🏨"
    },
    {
      title: t('b2b_page.industry_cards.industry.title'),
      description: t('b2b_page.industry_cards.industry.desc'),
      services: (t('b2b_page.industry_cards.industry.services') as any) as string[],
      icon: "🏭"
    },
    {
      title: t('b2b_page.industry_cards.retail.title'),
      description: t('b2b_page.industry_cards.retail.desc'),
      services: (t('b2b_page.industry_cards.retail.services') as any) as string[],
      icon: "🏪"
    }
  ];

  const advantages = [
    {
      title: t('b2b_page.advantages_list.quality.title'),
      description: t('b2b_page.advantages_list.quality.desc'),
      icon: "✅"
    },
    {
      title: t('b2b_page.advantages_list.stability.title'),
      description: t('b2b_page.advantages_list.stability.desc'),
      icon: "📅"
    },
    {
      title: t('b2b_page.advantages_list.individual.title'),
      description: t('b2b_page.advantages_list.individual.desc'),
      icon: "🎯"
    },
    {
      title: t('b2b_page.advantages_list.support.title'),
      description: t('b2b_page.advantages_list.support.desc'),
      icon: "🔧"
    },
    {
      title: t('b2b_page.advantages_list.price.title'),
      description: t('b2b_page.advantages_list.price.desc'),
      icon: "💰"
    },
    {
      title: t('b2b_page.advantages_list.docs.title'),
      description: t('b2b_page.advantages_list.docs.desc'),
      icon: "📋"
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-white via-gray-50 to-white py-20 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-1 h-10 bg-gradient-to-b from-berry to-gold rounded-full"></div>
                <h1 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight">
                  {t('b2b_page.title')}
                </h1>
              </div>
              <p className="text-xl text-gray-600 font-normal leading-relaxed mb-8">
                {t('b2b_page.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contacts" className="btn btn-primary">
                  {t('b2b_page.partner_btn')}
                </Link>
                <Link href="#products" className="btn btn-secondary">
                  {t('b2b_page.products_btn')}
                </Link>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/b2b-hero.png"
                alt={t('b2b_page.title')}
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
                priority
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-20 border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-3 mb-5 justify-center">
              <div className="w-1 h-10 bg-gradient-to-b from-berry to-gold rounded-full"></div>
              <h2 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight">
                {t('b2b_page.advantages_title')}
              </h2>
            </div>
            <p className="text-lg text-gray-600 font-normal leading-relaxed">
              {t('b2b_page.advantages_desc')}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {advantages.map((advantage, index) => (
              <div key={index} className="card-premium p-6">
                <div className="text-3xl mb-4">{advantage.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{advantage.title}</h3>
                <p className="text-gray-600 text-sm font-normal">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 border-t border-gray-200 bg-gradient-to-b from-gray-50/30 to-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-3 mb-5 justify-center">
              <div className="w-1 h-10 bg-gradient-to-b from-berry to-gold rounded-full"></div>
              <h2 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight">
                {t('b2b_page.products_title')}
              </h2>
            </div>
            <p className="text-lg text-gray-600 font-normal leading-relaxed">
              {t('b2b_page.products_desc')}
            </p>
          </div>

          <div className="space-y-12">
            {b2bProducts.map((product, index) => (
              <div key={index} className="card-premium overflow-hidden">
                <div className="grid items-center gap-8 lg:grid-cols-2">
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="text-4xl">{product.icon}</div>
                      <h3 className="text-2xl font-semibold text-gray-900 tracking-tight">
                        {product.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 mb-6 font-normal leading-relaxed">{product.description}</p>

                    <div className="space-y-5">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 text-sm">{t('b2b_page.labels.apps')}</h4>
                        <div className="flex flex-wrap gap-2">
                          {product.applications.map((app, i) => (
                            <span key={i} className="px-3 py-1.5 bg-berry/10 text-berry border border-berry/20 rounded-lg text-sm font-medium">
                              {app}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 text-sm">{t('b2b_page.labels.benefits')}</h4>
                        <ul className="space-y-2">
                          {product.benefits.map((benefit, i) => (
                            <li key={i} className="text-gray-600 text-sm flex items-center gap-2 font-normal">
                              <span className="text-green-600 font-semibold">✓</span>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="relative aspect-[4/3]">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-20 border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-3 mb-5 justify-center">
              <div className="w-1 h-10 bg-gradient-to-b from-berry to-gold rounded-full"></div>
              <h2 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight">
                {t('b2b_page.industries_title')}
              </h2>
            </div>
            <p className="text-lg text-gray-600 font-normal leading-relaxed">
              {t('b2b_page.industries_desc')}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {industries.map((industry, index) => (
              <div key={index} className="card-premium p-8 text-center">
                <div className="text-5xl mb-5">{industry.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 tracking-tight">
                  {industry.title}
                </h3>
                <p className="text-gray-600 mb-6 font-normal">{industry.description}</p>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm">{t('b2b_page.labels.services')}</h4>
                  <ul className="space-y-2">
                    {industry.services.map((service, i) => (
                      <li key={i} className="text-gray-600 text-sm flex items-center justify-center gap-2 font-normal">
                        <span className="text-berry">•</span>
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Section */}
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
        <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-semibold text-white mb-6 tracking-tight">
            {t('b2b_page.cta_title')}
          </h2>
          <p className="text-white/90 mb-10 text-xl font-normal leading-relaxed">
            {t('b2b_page.cta_desc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contacts" className="btn btn-secondary bg-white text-berry hover:bg-gray-50">
              {t('b2b_page.cta_discuss')}
            </Link>
            <Link href="/docs" className="btn bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/20">
              {t('b2b_page.cta_docs')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
