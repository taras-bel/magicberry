"use client";

import { useState } from "react";
import { useTranslations } from "@/lib/i18n";
import Link from "next/link";

interface Review {
  id: number;
  name: string;
  role?: string;
  company?: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
  image?: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={`text-lg ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}>
          ★
        </span>
      ))}
    </div>
  );
}

function ReviewCard({ review, badgeText }: { review: Review, badgeText: string }) {
  return (
    <div className="card-premium p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-berry/20 to-berry/10 rounded-full flex items-center justify-center text-berry font-semibold text-sm">
            {review.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{review.name}</h3>
              {review.verified && (
                <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-full font-medium">
                  {badgeText}
                </span>
              )}
            </div>
            {review.role && (
              <p className="text-sm text-gray-600 font-normal">
                {review.role}
                {review.company && ` • ${review.company}`}
              </p>
            )}
          </div>
        </div>
        <StarRating rating={review.rating} />
      </div>

      <p className="text-gray-700 mb-4 leading-relaxed font-normal">&ldquo;{review.text}&rdquo;</p>

      <div className="text-xs text-gray-500 font-medium">
        {new Date(review.date).toLocaleDateString()}
      </div>
    </div>
  );
}

export default function ReviewsPage() {
  const [filter, setFilter] = useState<'all' | 'verified'>('all');
  const t = useTranslations();

  // Получаем переведенные отзывы
  const reviewsList = (t('reviews_page.list') as any) as Omit<Review, "id" | "rating" | "date" | "verified">[];
  
  // Объединяем с метаданными (рейтинг, дата, верификация), которые остаются статичными для демо
  const reviews: Review[] = [
    { ...reviewsList[0], id: 1, rating: 5, date: "2024-10-15", verified: true },
    { ...reviewsList[1], id: 2, rating: 5, date: "2024-09-28", verified: true },
    { ...reviewsList[2], id: 3, rating: 5, date: "2024-09-12", verified: true },
    { ...reviewsList[3], id: 4, rating: 5, date: "2024-08-30", verified: true },
    { ...reviewsList[4], id: 5, rating: 5, date: "2024-08-15", verified: true },
    { ...reviewsList[5], id: 6, rating: 4, date: "2024-07-22", verified: true },
  ];

  const filteredReviews = reviews.filter(review =>
    filter === 'all' || review.verified
  );

  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const totalReviews = reviews.length;
  const verifiedReviews = reviews.filter(r => r.verified).length;

  return (
    <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-3 mb-5 justify-center">
          <div className="w-1 h-10 bg-gradient-to-b from-berry to-gold rounded-full"></div>
          <h1 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight">
            {t('reviews_page.title')}
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto font-normal leading-relaxed mb-12">
          {t('reviews_page.subtitle')}
        </p>

        <div className="flex justify-center gap-8 mb-10">
          <div className="text-center">
            <div className="text-4xl font-bold text-berry mb-2">{averageRating.toFixed(1)}</div>
            <StarRating rating={Math.round(averageRating)} />
            <div className="text-sm text-gray-600 mt-2 font-medium">{t('reviews_page.average')}</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">{totalReviews}</div>
            <div className="text-sm text-gray-600 font-medium">{t('reviews_page.total')}</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">{verifiedReviews}</div>
            <div className="text-sm text-gray-600 font-medium">{t('reviews_page.verified')}</div>
          </div>
        </div>

        <div className="flex justify-center gap-3 mb-12">
          <button
            onClick={() => setFilter('all')}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              filter === 'all'
                ? 'bg-berry text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
            }`}
          >
            {t('reviews_page.filter_all')}
          </button>
          <button
            onClick={() => setFilter('verified')}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              filter === 'verified'
                ? 'bg-berry text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
            }`}
          >
            {t('reviews_page.filter_verified')}
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredReviews.map((review) => (
          <ReviewCard key={review.id} review={review} badgeText={t('reviews_page.verified_badge')} />
        ))}
      </div>

      <div className="mt-20 text-center card-premium p-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 tracking-tight">
          {t('reviews_page.cta_title')}
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto font-normal leading-relaxed">
          {t('reviews_page.cta_desc')}
        </p>
        <Link href="/contacts" className="btn btn-primary">
          {t('reviews_page.cta_button')}
        </Link>
      </div>
    </div>
  );
}
