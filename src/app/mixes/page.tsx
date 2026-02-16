"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import MixBuilder from "@/components/MixBuilder";

export default function MixesPage() {
  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-white via-gray-50 to-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-1 h-12 bg-gradient-to-b from-accent to-accent-gold rounded-full"></div>
              <h1 className="text-4xl lg:text-6xl font-semibold text-gray-900 tracking-tight">
                Конструктор миксов
              </h1>
            </div>
            <p className="text-xl text-gray-600 leading-relaxed font-normal mb-4">
              Создайте свой уникальный микс из наших натуральных вяленых продуктов. 
              Выберите любимые ягоды, фрукты и овощи, установите нужные пропорции и получите идеальную смесь.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                Выберите до 10 продуктов
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-2 h-2 bg-accent-gold rounded-full"></span>
                Установите пропорции
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                Добавьте в корзину одним кликом
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Builder Section */}
      <section className="py-20 border-t border-gray-200 bg-gradient-to-b from-white to-gray-50/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <MixBuilder />
        </div>
      </section>
    </div>
  );
}

