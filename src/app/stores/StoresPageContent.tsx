"use client";

import { useState } from "react";
import { useTranslations } from "@/lib/i18n";
import Image from "next/image";

type Store = {
  title: string;
};

export default function StoresPageContent({ cmsStores }: { cmsStores: Store[] }) {
  const t = useTranslations();

  // Статический список адресов, где можно купить продукцию
  const staticStores: Store[] = [
    // Минск
    { title: "г. Минск, пр-т Независимости, 3/2, ТЦ «Столица», Красный пищевик" },
    { title: "г. Минск, ул. Белинского, 15, магазин «Красный пищевик»" },
    { title: "г. Минск, пр-т Независимости, 134, фирменный магазин «Красный пищевик»" },
    { title: "г. Минск, пр-т Независимости, 3/2, ТЦ «Столица», нижний уровень, павильон 320, «Любимый Брест»" },
    { title: "г. Минск, ул. Кедышко, 2, магазин «Красный пищевик»" },
    { title: "г. Минск, ул. Мясникова, 35, магазин «Красный пищевик»" },
    { title: "г. Минск, пр-т Независимости, 3/2, ТЦ «Столица», магазин «Спартак»" },
    { title: "г. Минск, ул. Романовская слобода, 13, магазин «Красный пищевик»" },
    { title: "г. Минск, пр-т Любимова, 26, магазин «Красный пищевик»" },
    { title: "г. Минск, Долгиновский тракт, 178, магазин «Красный пищевик»" },
    { title: "г. Минск, б-р Мулявина, 3, магазин «Красный пищевик»" },
    { title: "г. Минск, ул. Есенина, 76/1, ТЦ «Максимус», пав. 54, магазин «Спартак»" },
    { title: "г. Минск, ул. Минская, 5/4, магазин «Красный пищевик»" },
    { title: "г. Минск, ул. Воронянского, 1а, магазин «Красный пищевик»" },

    // Гродно
    { title: "г. Гродно, пр-т Янки Купалы, 87, ТЦ «Тринити», магазин «Красный пищевик»" },
    { title: "г. Гродно, ул. Ожешко, 42, магазин «Красный пищевик»" },
    { title: "г. Гродно, ул. Курчатова, 22, магазин «Красный пищевик»" },

    // Брест
    { title: "г. Брест, ул. Советская, 28/9, магазин «Любимый Брест»" },
    { title: "г. Брест, ул. Спортивная, 1, магазин «Спартак»" },
    { title: "г. Брест, ул. Советская, 80, магазин №12 «Спартак»" },

    // Гомель
    { title: "г. Гомель, ул. Ефремова, 5-269, магазин №3 «Красный пищевик»" },
    { title: "г. Гомель, ул. Мазурова, 10Г-1, магазин «Красный пищевик»" },
    { title: "г. Гомель, пр-т Ленина, 27-13, мини-кафе «Красный пищевик»" },
    { title: "г. Гомель, пр-т Речицкий, 75-198, магазин «Красный пищевик»" },
    { title: "г. Гомель, ул. Хатаевича, 1, магазин №1 «Спартак»" },
    { title: "г. Гомель, ул. Рогачёвская, 2А, мини-кафе «Красный пищевик»" },
    { title: "г. Гомель, ул. Советская, 2-36, магазин №13 «Спартак»" },
    { title: "г. Гомель, ул. Б. Хмельницкого, 90, фирменный магазин №5 «Спартак»" },

    // Могилев
    { title: "г. Могилев, ул. Будённого, 13, магазин №9 «Спартак»" },
    { title: "г. Могилев, ул. Ленинская, 29, фирменный магазин Гродненского мясокомбината" },
    { title: "г. Могилев, ул. Первомайская, 32, фирменный магазин Гродненского мясокомбината" },

    // Витебск
    { title: "г. Витебск, ул. Коммунистическая, 27-70, фирменный магазин №6 «Красный пищевик»" },
    { title: "г. Витебск, ул. М. Горького, 62, ТЦ «Магнит», магазин «Красный пищевик»" },
    { title: "г. Витебск, ул. Черняховского, 1-51, фирменный магазин №16 «Красный пищевик»" },
    { title: "г. Витебск, ул. Кирова, 2, фирменный магазин №29 «Красный пищевик»" },

    // Пинск
    { title: "г. Пинск, ул. Первомайская, 156, магазин «Красный пищевик»" },
    { title: "г. Пинск, ул. Первомайская, 33, магазин «Красный пищевик»" },
    { title: "г. Пинск, ул. Брестская, 93, магазин «Красный пищевик»" },

    // Другие города
    { title: "г. Слуцк, ул. Ленина, 150, фирменный магазин №17 «Красный пищевик»" },
    { title: "г. Орша, ул. Островского, 30, фирменный магазин №21 «Красный пищевик»" },
    { title: "г. Новополоцк, ул. Молодёжная, 169, фирменный магазин №20 «Красный пищевик»" },
    { title: "г. Молодечно, ул. Притыцкого, 4, магазин «Красный пищевик»" },
    { title: "г. Солигорск, ул. Ленина, 36, магазин «Спартак»" },
    { title: "г. Солигорск, ул. К. Заслонова, 34А, магазин «Красный пищевик»" },
    { title: "Минская обл., г. Борисов, ул. Дзержинского, 76Б, магазин «Красный пищевик»" },
  ];

  const stores = staticStores;
  const pageSize = 3;
  const totalPages = Math.ceil(stores.length / pageSize);
  const [page, setPage] = useState(0);

  const visibleStores = stores.slice(page * pageSize, page * pageSize + pageSize);

  const handlePrev = () => {
    setPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const handleNext = () => {
    setPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

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

      <div className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleStores.map((store, index) => (
            <div key={store.title || index} className="card-premium p-6">
              <p className="text-sm text-gray-700 font-normal leading-relaxed">
                {store.title}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            type="button"
            onClick={handlePrev}
            className="btn btn-secondary px-4 py-2 text-sm"
          >
            ← Назад
          </button>
          <span className="text-sm text-gray-600">
            {page + 1} / {totalPages}
          </span>
          <button
            type="button"
            onClick={handleNext}
            className="btn btn-secondary px-4 py-2 text-sm"
          >
            Вперед →
          </button>
        </div>
      </div>
    </div>
  );
}
