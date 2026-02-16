"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Runtime error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-8 rounded-full bg-red-50 p-6">
        <span className="text-4xl">⚠️</span>
      </div>
      
      <h2 className="mb-4 font-serif text-3xl font-medium text-gray-900">
        Что-то пошло не так
      </h2>
      
      <p className="mb-8 max-w-md text-gray-600">
        Произошла неожиданная ошибка. Мы уже работаем над её исправлением.
        Попробуйте обновить страницу или вернуться позже.
      </p>

      <div className="flex flex-col gap-4 sm:flex-row">
        <button
          onClick={reset}
          className="btn btn-outline"
        >
          Попробовать снова
        </button>
        <Link 
          href="/" 
          className="btn btn-primary"
        >
          На главную
        </Link>
      </div>
    </div>
  );
}
