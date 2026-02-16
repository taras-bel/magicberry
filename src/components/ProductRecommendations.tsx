"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { aiRecommendationService, ProductRecommendation } from "@/lib/ai-recommendations";
import { useTranslations } from "@/lib/i18n";
import { analytics } from "./GoogleAnalytics";

interface ProductRecommendationsProps {
  title?: string;
  type?: 'personal' | 'similar' | 'trending';
  productId?: string;
  limit?: number;
  className?: string;
}

export default function ProductRecommendations({
  title,
  type = 'personal',
  productId,
  limit = 6,
  className = ''
}: ProductRecommendationsProps) {
  const { data: session } = useSession();
  const t = useTranslations();
  const [recommendations, setRecommendations] = useState<ProductRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRecommendations();
  }, [session, type, productId]);

  const loadRecommendations = async () => {
    if (!session?.user?.id && type !== 'trending') {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      let recs: ProductRecommendation[];
      switch (type) {
        case 'similar':
          if (productId) {
            recs = await aiRecommendationService.getSimilarProducts(productId, limit);
          } else {
            recs = [];
          }
          break;
        case 'trending':
          recs = await aiRecommendationService.getPersonalizedRecommendations('guest', limit);
          break;
        case 'personal':
        default:
          recs = await aiRecommendationService.getPersonalizedRecommendations(session!.user.id, limit);
          break;
      }
      setRecommendations(recs);
    } catch (err) {
      console.error('Error loading recommendations:', err);
      setError('Не удалось загрузить рекомендации');
    } finally {
      setLoading(false);
    }
  };

  const displayTitle = title || getDefaultTitle(type);

  function getDefaultTitle(type: string): string {
    switch (type) {
      case 'personal': return t('recommendations.personal');
      case 'similar': return t('recommendations.similar');
      case 'trending': return t('recommendations.trending');
      default: return t('recommendations.for_you');
    }
  }

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
         <div className="h-8 w-48 bg-gray-100 rounded animate-pulse" />
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/5] bg-gray-100 w-full mb-4" />
              <div className="h-4 bg-gray-100 w-3/4 mb-2" />
              <div className="h-4 bg-gray-100 w-1/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || recommendations.length === 0) return null;

  return (
    <div className={`space-y-8 ${className}`}>
      {title !== "" && (
         <h2 className="text-2xl font-serif font-medium">{displayTitle}</h2>
      )}

      <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {recommendations.map((rec) => (
          <Link
            key={rec.product.id}
            href={`/products/${rec.product.slug}`}
            className="group block"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100 mb-4">
              {rec.product.image ? (
                <Image
                  src={rec.product.image}
                  alt={rec.product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-300 text-4xl">📦</div>
              )}
            </div>

            <div className="space-y-1">
              <h3 className="font-serif text-lg text-primary group-hover:text-berry transition-colors">
                {rec.product.name}
              </h3>
              
              <div className="flex justify-between items-baseline">
                {rec.score > 0.8 && (
                   <span className="text-[10px] uppercase tracking-widest text-gold">AI Pick</span>
                )}
              </div>
              
              <p className="text-xs text-gray-400 line-clamp-1">{rec.reason}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
