"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Plus, X, ShoppingCart, Check, Search, Filter } from "lucide-react";
import Image from "next/image";
import { useTranslations, useI18n } from "@/lib/i18n";

type Product = {
  id: string;
  name: string;
  name_en?: string;
  slug: string;
  shortDescription?: string;
  shortDescription_en?: string;
  price?: number;
  priceFrom?: number;
  unit?: string;
  image?: string;
  category?: {
    name: string;
    slug: string;
  };
};

type MixItem = {
  product: Product;
  quantity: number;
};

export default function MixBuilder() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const t = useTranslations();
  const { locale } = useI18n();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [mixItems, setMixItems] = useState<MixItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<Array<{ slug: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, selectedCategory, locale]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      if (response.ok) {
        const data = await response.json();
        const productsList = data.products || [];
        setProducts(productsList);
        
        // Получить уникальные категории
        const cats = Array.from(
          new Map(
            productsList
              .map((p: Product) => p.category)
              .filter(Boolean)
              .map((cat: any) => [cat.slug, cat])
          ).values()
        ) as Array<{ slug: string; name: string }>; // Cast to correct type
        setCategories(cats);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (p) => p.category?.slug === selectedCategory
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) => {
           const name = locale === 'en' ? p.name_en || p.name : p.name;
           return name.toLowerCase().includes(query) ||
           (p.shortDescription?.toLowerCase().includes(query) ?? false)
        }
      );
    }

    setFilteredProducts(filtered);
  };

  const addToMix = (product: Product) => {
    if (mixItems.length >= 10) {
      alert(t('mix_builder.max_limit'));
      return;
    }

    if (mixItems.find((item) => item.product.id === product.id)) {
      return;
    }

    setMixItems([...mixItems, { product, quantity: 100 }]);
  };

  const removeFromMix = (productId: string) => {
    setMixItems(mixItems.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 0) return;
    setMixItems(
      mixItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const calculateTotalPrice = () => {
    return mixItems.reduce((total, item) => {
      const price = item.product.price || item.product.priceFrom || 0;
      // Конвертируем граммы в кг (цена в API всегда за кг)
      const weight = item.quantity / 1000;
      return total + price * weight;
    }, 0);
  };

  const calculateTotalWeight = () => {
    return mixItems.reduce((total, item) => {
      // Конвертируем все в граммы, потом в кг
      const weight = item.quantity / 1000;
      return total + weight;
    }, 0);
  };

  const handleAddToCart = async () => {
    if (!session) {
      router.push("/auth/signin?callbackUrl=/mixes");
      return;
    }

    if (mixItems.length === 0) {
      alert(t('mix_builder.add_products_alert'));
      return;
    }

    setAddingToCart(true);
    try {
      // Добавляем каждый продукт из микса в корзину
      // quantity в API ожидается в единицах измерения продукта (кг или г)
      for (const item of mixItems) {
        const quantity = item.product.unit === "кг" 
          ? item.quantity / 1000 // конвертируем граммы в кг
          : item.quantity; // оставляем в граммах
        
        const roundedQuantity = Math.round(quantity * 100) / 100; // Округляем до 2 знаков

        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: item.product.id,
            quantity: roundedQuantity,
          }),
        });
      }

      setAdded(true);
      setTimeout(() => {
        setAdded(false);
        router.push("/cart");
      }, 1500);
    } catch (error) {
      console.error("Failed to add mix to cart:", error);
      alert(t('mix_builder.error_adding'));
    } finally {
      setAddingToCart(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border border-[var(--border)] border-t-[color:var(--accent)]"></div>
        <p className="mt-4 text-[color:var(--secondary-foreground)]">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Product Selection Panel */}
      <div className="lg:col-span-2">
        <div className="card p-6 space-y-6">
           <div className="mb-6">
             {/* Заголовки скрыты, чтобы избежать дублирования с заголовком категории на странице */}
             {/* <h1 className="text-3xl lg:text-4xl mb-4">{t('mix_builder.title')}</h1> */}
             {/* <p className="text-gray-500 font-light">{t('mix_builder.description')}</p> */}
             <div className="flex flex-wrap gap-4 mt-4 text-xs text-gray-400">
                <span>1. {t('mix_builder.steps.select')}</span>
                <span>2. {t('mix_builder.steps.proportions')}</span>
                <span>3. {t('mix_builder.steps.add')}</span>
             </div>
           </div>

          {/* Search and Filter */}
          <div className="space-y-5">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('mix_builder.search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-12"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${selectedCategory === "all" ? "bg-primary text-white border-primary" : "bg-white text-gray-600 border-gray-200 hover:border-primary"}`}
              >
                {t('mix_builder.all')}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${selectedCategory === cat.slug ? "bg-primary text-white border-primary" : "bg-white text-gray-600 border-gray-200 hover:border-primary"}`}
                >
                  {/* Пытаемся перевести категорию по слагу, если нет - выводим имя */}
                  {t(`mix_builder.categories.${cat.slug}`) === `mix_builder.categories.${cat.slug}` ? cat.name : t(`mix_builder.categories.${cat.slug}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredProducts.map((product) => {
              const isInMix = mixItems.some(
                (item) => item.product.id === product.id
              );
              const isMaxReached = mixItems.length >= 10;
              const name = locale === 'en' ? product.name_en || product.name : product.name;
              const description = locale === 'en' ? product.shortDescription_en || product.shortDescription : product.shortDescription;
              
              const unit = locale === 'en'
                  ? (product.unit === 'кг' ? 'kg' : product.unit === 'г' ? 'g' : product.unit === 'л' ? 'L' : product.unit === 'шт' ? 'pcs' : product.unit)
                  : product.unit;

              return (
                <div
                  key={product.id}
                  className={`p-5 rounded-lg border transition-all ${
                    isInMix ? "border-berry shadow-sm bg-berry/5" : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <div className="flex gap-4">
                    {product.image && (
                      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={product.image}
                          alt={name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-primary mb-1 text-base">
                        {name}
                      </h3>
                      {description && (
                        <p className="text-sm text-gray-500 line-clamp-2 mb-3 font-normal">
                          {description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <div>
                          {/* Price hidden */}
                        </div>
                        <button
                          onClick={() => addToMix(product)}
                          disabled={isInMix || isMaxReached}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            isInMix
                              ? "bg-berry text-white"
                              : isMaxReached
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-white border border-gray-200 text-primary hover:bg-primary hover:text-white"
                          }`}
                        >
                          {isInMix ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Plus className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">{t('mix_builder.no_products_found')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Mix Summary Panel */}
      <div className="lg:col-span-1">
        <div className="card p-6 space-y-6 sticky top-24 bg-gray-50 border-none">
          <div>
            <div className="inline-flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-serif font-medium text-primary tracking-tight">
                {t('mix_builder.your_mix')}
              </h2>
            </div>
            <p className="text-sm text-gray-600 mb-4 font-medium">
              {mixItems.length} / 10 {t('mix_builder.products_count')}
            </p>
          </div>

          {mixItems.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
              <p className="text-gray-400 text-sm">
                {t('mix_builder.empty_mix')}
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {mixItems.map((item) => {
                   const name = locale === 'en' ? item.product.name_en || item.product.name : item.product.name;
                   const unit = locale === 'en'
                    ? (item.product.unit === 'кг' ? 'kg' : item.product.unit === 'г' ? 'g' : item.product.unit === 'л' ? 'L' : item.product.unit === 'шт' ? 'pcs' : item.product.unit)
                    : item.product.unit;
                   
                   return (
                  <div
                    key={item.product.id}
                    className="bg-white rounded-lg p-4 space-y-3 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-primary truncate mb-1">
                          {name}
                        </h4>
                        {/* Price hidden */}
                      </div>
                      <button
                        onClick={() => removeFromMix(item.product.id)}
                        className="text-gray-400 hover:text-berry transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-xs text-gray-500 whitespace-nowrap font-medium">
                        {t('mix_builder.weight')}
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="10"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(
                            item.product.id,
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="flex-1 px-3 py-1 text-sm rounded border border-gray-200 focus:outline-none focus:border-berry transition-all text-right"
                      />
                    </div>
                  </div>
                )})}
              </div>

              <div className="border-t border-gray-200 pt-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">{t('mix_builder.total_weight')}:</span>
                  <span className="font-semibold text-primary">
                    {calculateTotalWeight().toFixed(2)} {locale === 'en' ? 'kg' : 'кг'}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-2">
                  <span className="font-serif text-lg text-primary">{t('mix_builder.total_price')}:</span>
                  <span className="font-bold text-berry text-2xl">
                    {t('common.on_request')}
                  </span>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart || added}
                  className={`w-full btn ${
                    added ? "bg-green-600 hover:bg-green-700 text-white" : "btn-primary"
                  } flex items-center justify-center gap-2`}
                >
                  {addingToCart ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {t('mix_builder.adding')}
                    </>
                  ) : added ? (
                    <>
                      <Check className="w-4 h-4" />
                      {t('mix_builder.added')}
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      {t('mix_builder.add_to_cart')}
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
