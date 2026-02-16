"use client"

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { ShoppingCart, Check } from "lucide-react";
import { analytics } from "./GoogleAnalytics";
import { useTranslations, useI18n } from "@/lib/i18n";

type Product = {
  id: string;
  name: string;
  name_en?: string;
  slug: string;
  shortDescription?: string;
  shortDescription_en?: string;
  priceFrom?: number;
  unit?: string;
  image?: string;
  placeholder?: string;
};

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const { data: session } = useSession();
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const t = useTranslations();
  const { locale } = useI18n();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      return;
    }

    setIsAdding(true);
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity: 1 })
      });

      if (response.ok) {
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);

        analytics.addToCart({
          id: product.id,
          name: product.name,
          price: product.priceFrom,
          quantity: 1,
          currency: 'BYN'
        });
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const name = locale === 'en' ? product.name_en || product.name : product.name;
  const unit = locale === 'en' 
    ? (product.unit === 'кг' ? 'kg' : product.unit === 'г' ? 'g' : product.unit === 'л' ? 'L' : product.unit === 'шт' ? 'pcs' : product.unit)
    : product.unit;

  return (
    <div className="group relative">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100">
          {product.image ? (
            <Image
              src={product.image}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              placeholder={product.placeholder ? "blur" : "empty"}
              blurDataURL={product.placeholder}
              unoptimized
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-50">
              <span className="text-4xl">📦</span>
            </div>
          )}
          
          {session && (
            <div className="absolute bottom-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`w-10 h-10 flex items-center justify-center transition-all duration-300 ${
                  added
                    ? "bg-berry text-white"
                    : "bg-white text-primary hover:bg-primary hover:text-white"
                }`}
                title={t('products.add_to_cart')}
              >
                {added ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <ShoppingCart className="w-5 h-5" />
                )}
              </button>
            </div>
          )}
        </div>

        <div className="pt-4 space-y-1">
          <h3 className="font-serif text-lg text-primary group-hover:text-berry transition-colors">
            {name}
          </h3>

        </div>
      </Link>
    </div>
  );
}
