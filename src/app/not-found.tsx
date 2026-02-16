"use client";

import Link from "next/link";
import { useTranslations } from "@/lib/i18n";

export default function NotFound() {
  const t = useTranslations();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-8">
        <h1 className="font-serif text-9xl font-bold text-gray-200">404</h1>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
          <span className="text-4xl">🍓</span>
        </div>
      </div>
      
      <h2 className="mb-4 font-serif text-3xl font-medium text-gray-900">
        Страница не найдена
      </h2>
      
      <p className="mb-8 max-w-md text-gray-600">
        Возможно, она была перемещена или удалена. Попробуйте вернуться на главную или воспользоваться поиском.
      </p>

      <Link 
        href="/" 
        className="btn btn-primary"
      >
        Вернуться на главную
      </Link>
    </div>
  );
}
