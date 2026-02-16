"use client";

import { useState } from "react";
import Image from "next/image";
import GiftConfigurator from "@/components/GiftConfigurator";
import { useTranslations, useI18n } from "@/lib/i18n";
import Link from "next/link";

export default function GiftsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const t = useTranslations();
  const { locale } = useI18n();

  const giftSets = [
    {
      nameKey: "classic",
      image: "/images/products/cranberry-1200.png",
      popular: false,
      price: "25 BYN"
    },
    {
      nameKey: "mix",
      image: "/images/products/fruit-mix-1200.png",
      popular: true,
      price: "35 BYN"
    },
    {
      nameKey: "premium",
      image: "/images/categories/cat-berries.png",
      popular: false,
      price: "55 BYN"
    }
  ];

  const advantages = [
    {
      key: "natural",
      icon: "🌱"
    },
    {
      key: "design",
      icon: "🎨"
    },
    {
      key: "storage",
      icon: "⏰"
    },
    {
      key: "healthy",
      icon: "💚"
    }
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/gift-request", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage(t('gifts_page.form_success'));
        e.currentTarget.reset();
      } else {
        setMessage(t('gifts_page.form_error'));
      }
    } catch (error) {
      setMessage(t('gifts_page.form_error'));
    } finally {
      setIsSubmitting(false);
    }
  }

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
                  {t('gifts_page.title')}
                </h1>
              </div>
              <p className="text-xl text-gray-600 font-normal leading-relaxed mb-8">
                {t('gifts_page.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#configurator" className="btn btn-primary">
                  {t('gifts_page.build_gift')}
                </a>
                <a href="#examples" className="btn btn-secondary">
                  {t('gifts_page.view_examples')}
                </a>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/gifts-hero.png"
                alt={t('gifts_page.title')}
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
                {t('gifts_page.why_choose')}
              </h2>
            </div>
            <p className="text-lg text-gray-600 font-normal leading-relaxed">
              {t('gifts_page.why_choose_desc')}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {advantages.map((advantage, index) => (
              <div key={index} className="card-premium p-6 text-center">
                <div className="text-4xl mb-4">{advantage.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{t(`gifts_page.benefits.${advantage.key}`)}</h3>
                <p className="text-gray-600 text-sm font-normal">{t(`gifts_page.benefits.${advantage.key}_desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gift Sets Examples */}
      <section id="examples" className="py-20 border-t border-gray-200 bg-gradient-to-b from-gray-50/30 to-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-3 mb-5 justify-center">
              <div className="w-1 h-10 bg-gradient-to-b from-berry to-gold rounded-full"></div>
              <h2 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight">
                {t('gifts_page.examples_title')}
              </h2>
            </div>
            <p className="text-lg text-gray-600 font-normal leading-relaxed">
              {t('gifts_page.examples_desc')}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {giftSets.map((set, index) => {
              // Получаем список элементов из перевода. 
              // t returns string, so we need to parse or hardcode list in component if structure is complex.
              // But here I defined arrays in translations. 
              // NOTE: t() usually returns string. If I need array, I should handle it. 
              // My i18n implementation returns string. I need to fix i18n or use keys like item1, item2.
              // For simplicity now, I will use t(`gifts_page.sets.${set.nameKey}.items`) which returns string (joined) or I'll change translation structure to flat strings if needed.
              // Wait, my i18n implementation (I wrote it earlier) returns `value || key`.
              // If value is array, it returns array.
              // Let's check src/lib/i18n.tsx.
              // It returns `value || key`. If value is object/array, it returns it. But return type is `string`.
              // I will cast it.
              
              const items = t(`gifts_page.sets.${set.nameKey}.items`) as unknown as string[];
              
              return (
              <div key={index} className="card-premium overflow-hidden group">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={set.image}
                    alt={t(`gifts_page.sets.${set.nameKey}.name`)}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    unoptimized
                  />
                  {set.popular && (
                    <div className="absolute top-4 right-4 bg-berry text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm">
                      {t('gifts_page.popular')}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{t(`gifts_page.sets.${set.nameKey}.name`)}</h3>
                  <p className="text-gray-600 text-sm mb-4 font-normal">{t(`gifts_page.sets.${set.nameKey}.desc`)}</p>

                  <div className="space-y-2 mb-4">
                    <h4 className="font-medium text-gray-900 text-sm">{t('gifts_page.composition')}</h4>
                    <ul className="text-gray-600 text-sm space-y-1 font-normal">
                      {Array.isArray(items) && items.map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="text-berry">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <button className="w-full btn btn-secondary text-sm">
                      {t('gifts_page.order')}
                    </button>
                  </div>
                </div>
              </div>
            )})}
          </div>
        </div>
      </section>

      {/* Configurator Section */}
      <section id="configurator" className="py-20 border-t border-gray-200">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-5 justify-center">
              <div className="w-1 h-10 bg-gradient-to-b from-berry to-gold rounded-full"></div>
              <h2 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight">
                {t('gifts_page.configurator_title')}
              </h2>
            </div>
            <p className="text-lg text-gray-600 font-normal leading-relaxed">
              {t('gifts_page.configurator_desc')}
            </p>
          </div>

          <div className="card-premium p-8">
            <GiftConfigurator />
          </div>
        </div>
      </section>

      {/* Order Form */}
      <section className="py-20 border-t border-gray-200">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="card-premium p-10">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-semibold text-gray-900 mb-4 tracking-tight">
                {t('gifts_page.form_title')}
              </h2>
              <p className="text-gray-600 font-normal leading-relaxed">
                {t('gifts_page.form_desc')}
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    {t('gifts_page.form_name')}
                  </label>
                  <input
                    name="name"
                    type="text"
                    placeholder="Иван Иванов" // Можно оставить плейсхолдер или перевести
                    className="w-full px-4 py-3 rounded-xl surface-glass border border-[var(--border)] text-[color:var(--foreground)] placeholder-[color:var(--secondary-foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--berry)]/20 focus:border-[color:var(--berry)] transition-all"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    {t('gifts_page.form_email')}
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="ivan@example.com"
                    className="w-full px-4 py-3 rounded-xl surface-glass border border-[var(--border)] text-[color:var(--foreground)] placeholder-[color:var(--secondary-foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--berry)]/20 focus:border-[color:var(--berry)] transition-all"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    {t('gifts_page.form_company')}
                  </label>
                  <input
                    name="company"
                    type="text"
                    placeholder="Company Ltd."
                    className="w-full px-4 py-3 rounded-xl surface-glass border border-[var(--border)] text-[color:var(--foreground)] placeholder-[color:var(--secondary-foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--berry)]/20 focus:border-[color:var(--berry)] transition-all"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    {t('gifts_page.form_phone')}
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    placeholder="+375 (29) 123-45-67"
                    className="w-full px-4 py-3 rounded-xl surface-glass border border-[var(--border)] text-[color:var(--foreground)] placeholder-[color:var(--secondary-foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--berry)]/20 focus:border-[color:var(--berry)] transition-all"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  {t('gifts_page.form_message')}
                </label>
                <textarea
                  name="message"
                  placeholder={t('gifts_page.form_message_placeholder')}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl surface-glass border border-[var(--border)] text-[color:var(--foreground)] placeholder-[color:var(--secondary-foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--berry)]/20 focus:border-[color:var(--berry)] transition-all resize-none"
                  disabled={isSubmitting}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn btn-primary disabled:opacity-50"
              >
                {isSubmitting ? t('gifts_page.form_sending') : t('gifts_page.form_submit')}
              </button>
            </form>

            {message && (
              <div className={`mt-6 p-4 rounded-xl font-medium ${
                message.includes("ошибка") || message.includes("error")
                  ? "bg-[rgba(214,48,49,0.08)] text-[color:var(--berry)] border border-[rgba(214,48,49,0.20)]" 
                  : "bg-green-50 text-green-700 border border-green-200"
              }`}>
                {message}
              </div>
            )}
          </div>
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
        <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-semibold text-white mb-6 tracking-tight">
            {t('gifts_page.cta_title')}
          </h2>
          <p className="text-white/90 mb-10 text-xl font-normal leading-relaxed">
            {t('gifts_page.cta_desc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+37500000000" className="btn btn-secondary bg-white text-berry hover:bg-gray-50">
              {t('gifts_page.cta_call')}
            </a>
            <Link href="/contacts" className="btn bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/20">
              {t('gifts_page.cta_chat')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
