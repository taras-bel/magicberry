"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "@/lib/i18n";

export default function AboutPageContent() {
  const t = useTranslations();

  const achievements = [
    { number: "10+", label: t('about_page.achievements.exp') },
    { number: "50+", label: t('about_page.achievements.products') },
    { number: "1000+", label: t('about_page.achievements.clients') },
    { number: "3", label: t('about_page.achievements.patents') },
  ];

  const values = [
    {
      title: t('about_page.values_cards.natural.title'),
      description: t('about_page.values_cards.natural.desc'),
      icon: "🌱"
    },
    {
      title: t('about_page.values_cards.quality.title'),
      description: t('about_page.values_cards.quality.desc'),
      icon: "✨"
    },
    {
      title: t('about_page.values_cards.innovation.title'),
      description: t('about_page.values_cards.innovation.desc'),
      icon: "💡"
    },
    {
      title: t('about_page.values_cards.sustainability.title'),
      description: t('about_page.values_cards.sustainability.desc'),
      icon: "🌍"
    }
  ];

  const team = (t('about_page.team_members') as any) as any[];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-white via-gray-50 to-white py-20 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-5 justify-center">
              <div className="w-1 h-10 bg-gradient-to-b from-berry to-gold rounded-full"></div>
              <h1 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight">
                {t('about_page.title')}
              </h1>
            </div>
            <p className="mx-auto max-w-2xl text-xl text-gray-600 font-normal leading-relaxed">
              {t('about_page.subtitle')}
            </p>
          </div>

          {/* Achievements */}
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-berry mb-2">{achievement.number}</div>
                <div className="text-sm text-gray-600 font-medium">{achievement.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-3 mb-5">
                  <div className="w-1 h-10 bg-gradient-to-b from-berry to-gold rounded-full"></div>
                  <h2 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight">
                    {t('about_page.story_title')}
                  </h2>
                </div>
              </div>
              <div className="space-y-5 text-gray-700 font-normal leading-relaxed">
                <p>{t('about_page.story_text_1')}</p>
                <p>{t('about_page.story_text_2')}</p>
                <p>{t('about_page.story_text_3')}</p>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/about-process.png"
                alt={t('about_page.title')}
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 border-t border-gray-200 bg-gradient-to-b from-gray-50/30 to-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-3 mb-5 justify-center">
              <div className="w-1 h-10 bg-gradient-to-b from-berry to-gold rounded-full"></div>
              <h2 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight">
                {t('about_page.tech_title')}
              </h2>
            </div>
            <p className="text-lg text-gray-600 font-normal leading-relaxed">
              {t('about_page.tech_desc')}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="card-premium p-6 text-center">
              <div className="text-4xl mb-4">🌡️</div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('about_page.tech_cards.temp.title')}</h3>
              <p className="text-gray-600 text-sm font-normal">
                {t('about_page.tech_cards.temp.desc')}
              </p>
            </div>
            <div className="card-premium p-6 text-center">
              <div className="text-4xl mb-4">⏱️</div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('about_page.tech_cards.time.title')}</h3>
              <p className="text-gray-600 text-sm font-normal">
                {t('about_page.tech_cards.time.desc')}
              </p>
            </div>
            <div className="card-premium p-6 text-center">
              <div className="text-4xl mb-4">🌬️</div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('about_page.tech_cards.vent.title')}</h3>
              <p className="text-gray-600 text-sm font-normal">
                {t('about_page.tech_cards.vent.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-3 mb-5 justify-center">
              <div className="w-1 h-10 bg-gradient-to-b from-berry to-gold rounded-full"></div>
              <h2 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight">
                {t('about_page.values_title')}
              </h2>
            </div>
            <p className="text-lg text-gray-600 font-normal leading-relaxed">
              {t('about_page.values_desc')}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <div key={index} className="card-premium p-6 text-center">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm font-normal">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 border-t border-gray-200 bg-gradient-to-b from-gray-50/30 to-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-3 mb-5 justify-center">
              <div className="w-1 h-10 bg-gradient-to-b from-berry to-gold rounded-full"></div>
              <h2 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight">
                {t('about_page.products_title')}
              </h2>
            </div>
            <p className="text-lg text-gray-600 font-normal leading-relaxed">
              {t('about_page.products_desc')}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="card-premium p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl">🫐</div>
                <h3 className="font-semibold text-gray-900">{t('about_page.product_cards.berries.title')}</h3>
              </div>
              <p className="text-gray-600 text-sm font-normal">
                {t('about_page.product_cards.berries.desc')}
              </p>
            </div>

            <div className="card-premium p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl">🥕</div>
                <h3 className="font-semibold text-gray-900">{t('about_page.product_cards.vegetables.title')}</h3>
              </div>
              <p className="text-gray-600 text-sm font-normal">
                {t('about_page.product_cards.vegetables.desc')}
              </p>
            </div>

            <div className="card-premium p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl">🧪</div>
                <h3 className="font-semibold text-gray-900">{t('about_page.product_cards.syrups.title')}</h3>
              </div>
              <p className="text-gray-600 text-sm font-normal">
                {t('about_page.product_cards.syrups.desc')}
              </p>
            </div>

            <div className="card-premium p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl">🏭</div>
                <h3 className="font-semibold text-gray-900">{t('about_page.product_cards.must.title')}</h3>
              </div>
              <p className="text-gray-600 text-sm font-normal">
                {t('about_page.product_cards.must.desc')}
              </p>
            </div>

            <div className="card-premium p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl">🎁</div>
                <h3 className="font-semibold text-gray-900">{t('about_page.product_cards.gifts.title')}</h3>
              </div>
              <p className="text-gray-600 text-sm font-normal">
                {t('about_page.product_cards.gifts.desc')}
              </p>
            </div>

            <div className="card-premium p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl">🍽️</div>
                <h3 className="font-semibold text-gray-900">{t('about_page.product_cards.culinary.title')}</h3>
              </div>
              <p className="text-gray-600 text-sm font-normal">
                {t('about_page.product_cards.culinary.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-3 mb-5 justify-center">
              <div className="w-1 h-10 bg-gradient-to-b from-berry to-gold rounded-full"></div>
              <h2 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight">
                {t('about_page.team_title')}
              </h2>
            </div>
            <p className="text-lg text-gray-600 font-normal leading-relaxed">
              {t('about_page.team_desc')}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {Array.isArray(team) && team.map((member, index) => (
              <div key={index} className="card-premium p-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-berry/20 to-berry/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-xl text-berry font-semibold">
                    {member.name.split(' ').map((n: string) => n[0]).join('')}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-berry text-sm mb-3 font-medium">{member.role}</p>
                <p className="text-gray-600 text-sm font-normal">{member.bio}</p>
              </div>
            ))}
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
            {t('about_page.cta_title')}
          </h2>
          <p className="text-white/90 mb-10 text-xl font-normal leading-relaxed">
            {t('about_page.cta_desc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="btn btn-secondary bg-white text-berry hover:bg-gray-50">
              {t('about_page.cta_catalog')}
            </Link>
            <Link href="/contacts" className="btn bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/20">
              {t('about_page.cta_contact')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
