"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "@/lib/i18n";

export default function MixesPage() {
  const t = useTranslations();

  return (
    <div className="space-y-0">
      <section className="relative bg-gradient-to-br from-white via-gray-50 to-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-5xl px-6 lg:px-8 py-20 lg:py-28 text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-1 h-10 bg-gradient-to-b from-accent to-accent-gold rounded-full"></div>
            <h1 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight">
              {t('mix_builder.unavailable_title')}
            </h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed font-normal mb-8 max-w-3xl mx-auto">
            {t('mix_builder.unavailable_desc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contacts" className="btn btn-primary min-w-[200px]">
              {t('products_page.cta_contact')}
            </Link>
            <Link href="/products" className="btn btn-secondary min-w-[200px]">
              {t('products_page.view_catalog')}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-gray-200 bg-gradient-to-b from-white to-gray-50/50">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="panel p-10 text-center space-y-6">
            <Image
              src="/images/categories/cat-mixes.png"
              alt="Mix builder temporarily unavailable"
              width={320}
              height={200}
              className="mx-auto rounded-3xl object-cover"
              unoptimized
            />
            <p className="text-gray-600 text-lg leading-relaxed">
              {t('products_page.subtitle')}
            </p>
            <p className="text-sm text-gray-400">
              {t('common.on_request')}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

