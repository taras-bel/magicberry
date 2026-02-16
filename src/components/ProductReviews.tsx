"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "@/lib/i18n";
import StarRating, { RatingDistribution } from "./StarRating";
import { analytics } from "./GoogleAnalytics";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { CheckCircle, User } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  title?: string;
  comment: string;
  createdAt: string;
  user: {
    name: string;
    isVerified: boolean;
  };
}

interface ProductReviewsProps {
  productSlug: string;
}

export default function ProductReviews({ productSlug }: ProductReviewsProps) {
  const t = useTranslations();
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState<Array<{ rating: number; count: number }>>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productSlug]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/products/${productSlug}/reviews`);
      const data = await response.json();

      if (response.ok) {
        setReviews(data.reviews);
        setAverageRating(data.averageRating);
        setRatingDistribution(data.ratingDistribution);
        setTotalReviews(data.totalReviews);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Заголовок и статистика */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {t("common.reviews")} ({totalReviews})
        </h2>
        {session && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="btn btn-primary"
          >
            {t("common.write_review")}
          </button>
        )}
      </div>

      {/* Рейтинг и распределение */}
      {totalReviews > 0 && (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="text-center md:text-left">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {averageRating.toFixed(1)}
            </div>
            <StarRating rating={averageRating} size="lg" className="justify-center md:justify-start" />
            <p className="text-gray-600 mt-2">
              {t("common.based_on")} {totalReviews} {t("common.reviews")}
            </p>
          </div>
          <div>
            <RatingDistribution distribution={ratingDistribution} totalReviews={totalReviews} />
          </div>
        </div>
      )}

      {/* Форма создания отзыва */}
      {showReviewForm && (
        <ReviewForm
          productSlug={productSlug}
          onClose={() => setShowReviewForm(false)}
          onReviewSubmitted={fetchReviews}
        />
      )}

      {/* Список отзывов */}
      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {review.user.name}
                      </span>
                      {review.user.isVerified && (
                        <div title="Проверенный покупатель">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <StarRating rating={review.rating} size="sm" />
                      <span>•</span>
                      <span>
                        {formatDistanceToNow(new Date(review.createdAt), {
                          addSuffix: true,
                          locale: ru
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {review.title && (
                <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
              )}

              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {t("common.no_reviews")}
          </h3>
          <p className="text-gray-600 mb-6">
            {t("common.be_first_review")}
          </p>
          {session && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="btn btn-primary"
            >
              {t("common.write_review")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Компонент формы создания отзыва
interface ReviewFormProps {
  productSlug: string;
  onClose: () => void;
  onReviewSubmitted: () => void;
}

function ReviewForm({ productSlug, onClose, onReviewSubmitted }: ReviewFormProps) {
  const t = useTranslations();
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!comment.trim() || comment.length < 10) {
      setError(t("reviews.comment_too_short"));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/products/${productSlug}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          title: title.trim() || undefined,
          comment: comment.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Отслеживание отзыва
        analytics.review(productSlug, rating);

        onReviewSubmitted();
        onClose();
      } else {
        setError(data.error || t("common.error"));
      }
    } catch (error) {
      setError(t("common.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="panel p-6">
      <h3 className="text-lg font-semibold text-[color:var(--foreground)] mb-4">
        {t("common.write_review")}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[color:var(--secondary-foreground)] mb-2">
            {t("common.rating")}
          </label>
          <StarRating
            rating={rating}
            interactive={true}
            onRatingChange={setRating}
            size="lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[color:var(--secondary-foreground)] mb-2">
            {t("common.title")} ({t("common.optional")})
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("reviews.title_placeholder")}
            className="w-full px-3 py-2 rounded-xl surface-glass border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/20 focus:border-[color:var(--accent)]"
            maxLength={100}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[color:var(--secondary-foreground)] mb-2">
            {t("common.comment")}
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t("reviews.comment_placeholder")}
            rows={4}
            className="w-full px-3 py-2 rounded-xl surface-glass border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/20 focus:border-[color:var(--accent)] resize-none"
            required
          />
          <p className="text-sm text-[color:var(--secondary-foreground)] mt-1">
            {t("reviews.comment_help")}
          </p>
        </div>

        {error && (
          <div className="text-[color:var(--accent)] text-sm">{error}</div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? t("common.loading") : t("common.submit")}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
          >
            {t("common.cancel")}
          </button>
        </div>
      </form>
    </div>
  );
}
