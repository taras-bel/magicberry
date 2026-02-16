"use client";

import { useTranslations } from "@/lib/i18n";
import Image from "next/image";

type Store = {
  title: string;
  address?: string | null;
  phone?: string | null;
};

export default function StoresPageContent({ cmsStores }: { cmsStores: Store[] }) {
  const t = useTranslations();

  const defaultStores = [
    { title: t('stores.default_stores.0.title'), address: t('stores.default_stores.0.address'), phone: "+375 (17) 123-45-67" },
    { title: t('stores.default_stores.1.title'), address: t('stores.default_stores.1.address'), phone: "+375 (17) 234-56-78" },
    { title: t('stores.default_stores.2.title'), address: t('stores.default_stores.2.address'), phone: "+375 (17) 345-67-89" },
  ];

  const stores = cmsStores && cmsStores.length > 0 ? cmsStores : defaultStores;

  return (
    <div className="mx-auto max-w-7xl space-y-0 px-6 py-20 lg:px-8">
      
      {/* Hero Image */}
      <div className="relative w-full h-[300px] lg:h-[400px] mb-12 rounded-2xl overflow-hidden shadow-lg">
        <Image
          src="/images/stores-hero.png"
          alt={t('stores.title')}
          fill
          className="object-cover"
          priority
          unoptimized
        />
      </div>

      <div className="mb-16">
        <div className="inline-flex items-center gap-3 mb-5">
          <div className="w-1 h-10 bg-gradient-to-b from-berry to-gold rounded-full"></div>
          <h1 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight">
            {t('stores.title')}
          </h1>
        </div>
        <p className="text-lg text-gray-600 font-normal leading-relaxed max-w-2xl">
          {t('stores.subtitle')}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stores.map((store, index) => (
          <div key={store.title || index} className="card-premium p-6">
            <h3 className="font-semibold text-gray-900 mb-3 text-lg">{store.title}</h3>
            <p className="text-sm text-gray-600 mb-3 font-normal">{store.address || store.title}</p>
            {store.phone && (
              <p className="text-sm text-berry font-medium">{store.phone}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
