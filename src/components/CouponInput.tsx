"use client";

import { useState } from "react";
import { useTranslations } from "@/lib/i18n";
import { Tag, Check, X, Loader } from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  description?: string;
  type: 'PERCENTAGE' | 'FIXED' | 'FREE_SHIPPING';
  value: number;
  discountAmount: number;
  minOrderAmount?: number;
}

interface CouponInputProps {
  orderAmount: number;
  onCouponApplied: (coupon: Coupon | null) => void;
  appliedCoupon?: Coupon | null;
}

export default function CouponInput({
  orderAmount,
  onCouponApplied,
  appliedCoupon
}: CouponInputProps) {
  const t = useTranslations();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const applyCoupon = async () => {
    if (!code.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code.trim(),
          orderAmount
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onCouponApplied(data.coupon);
        setCode("");
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError(t("common.error"));
    } finally {
      setIsLoading(false);
    }
  };

  const removeCoupon = () => {
    onCouponApplied(null);
    setCode("");
    setError("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      applyCoupon();
    }
  };

  if (appliedCoupon) {
    return (
      <div className="panel p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-2xl">
              <Tag className="w-4 h-4 text-[color:var(--foreground)]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-[color:var(--foreground)]">
                  {appliedCoupon.code}
                </span>
                <Check className="w-4 h-4 text-[color:var(--foreground)]" />
              </div>
              {appliedCoupon.description && (
                <p className="text-sm text-[color:var(--secondary-foreground)]">{appliedCoupon.description}</p>
              )}
              <p className="text-sm font-medium text-[color:var(--foreground)]">
                {t('cart_page.discount')}: -{appliedCoupon.discountAmount.toFixed(2)} BYN
              </p>
            </div>
          </div>
          <button
            onClick={removeCoupon}
            className="pill !p-2 !rounded-xl"
            title={t('cart_page.remove_coupon')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-[color:var(--secondary-foreground)]">
        {t("cart_page.coupon_title")}
      </label>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyPress={handleKeyPress}
            placeholder={t("cart_page.coupon_placeholder")}
            className="w-full px-3 py-2 rounded-xl surface-glass border border-[var(--border)] pr-10 focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/20 focus:border-[color:var(--accent)]"
            disabled={isLoading}
          />
          <Tag className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--secondary-foreground)]" />
        </div>

        <button
          onClick={applyCoupon}
          disabled={isLoading || !code.trim()}
          className="btn btn-primary !py-2 !px-4 !text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            t("cart_page.apply")
          )}
        </button>
      </div>

      {error && (
        <p className="text-[color:var(--accent)] text-sm">{error}</p>
      )}

      <p className="text-xs text-[color:var(--secondary-foreground)]">
        {t("cart_page.coupon_help")}
      </p>
    </div>
  );
}
