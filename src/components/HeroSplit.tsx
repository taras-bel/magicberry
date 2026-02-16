"use client";

import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";
import { useTranslations } from "@/lib/i18n";

export default function HeroSplit() {
  const t = useTranslations();

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="container-custom py-20 lg:py-32">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-24">
          <div className="space-y-10 order-2 lg:order-1">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-berry">
                {t('hero.since')}
              </span>
              <h1 className="text-5xl lg:text-7xl font-medium leading-[1.1]">
                {t('hero.title_prefix')} <br />
                <span className="italic text-gray-500">{t('hero.title_accent')}</span> {t('hero.title_suffix')}
              </h1>
            </div>

            <p className="text-lg text-gray-600 leading-relaxed max-w-md font-light">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <Link href="/products" className="btn btn-primary min-w-[180px]">
                {t('hero.cta')}
              </Link>
              <Link href="/about" className="group flex items-center gap-2 text-sm font-medium uppercase tracking-widest hover:text-berry transition-colors">
                {t('hero.about')}
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>

          <div className="relative order-1 lg:order-2">
            <Reveal>
              <div className="aspect-[4/5] relative overflow-hidden bg-gray-100">
                <Image
                  src="/images/hero-bg.png"
                  alt="Вяленая клюква Magic Berry"
                  fill
                  className="object-cover scale-105 hover:scale-100 transition-transform duration-700"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  unoptimized
                />
              </div>
            </Reveal>
            {/* Minimal decoration */}
            <div className="absolute -bottom-10 -left-10 w-full h-full border border-gray-100 -z-10 hidden lg:block"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
