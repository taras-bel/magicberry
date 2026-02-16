"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import CouponInput from "@/components/CouponInput"
import { analytics } from "@/components/GoogleAnalytics"
import { useTranslations, useI18n } from "@/lib/i18n"

interface CartItem {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    name_en?: string // Added for safety
    price: number | null
    unit: string | null
    image: string | null
  }
}

interface Coupon {
  id: string
  code: string
  description?: string
  type: 'PERCENTAGE' | 'FIXED' | 'FREE_SHIPPING'
  value: number
  discountAmount: number
  minOrderAmount?: number
}

interface CartData {
  items: CartItem[]
  total: number
}

export default function CartPage() {
  const t = useTranslations()
  const { locale } = useI18n()
  const { data: session, status } = useSession()
  const router = useRouter()
  const [cart, setCart] = useState<CartData>({ items: [], total: 0 })
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/signin?callbackUrl=/cart")
      return
    }

    fetchCart()
  }, [session, status, router])

  useEffect(() => {
    if (cart.items.length > 0) {
      analytics.viewCart(
        cart.items.map(item => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price || undefined,
          quantity: item.quantity
        })),
        'BYN'
      );
    }
  }, [cart.items]);

  const fetchCart = async () => {
    try {
      const response = await fetch("/api/cart")
      if (response.ok) {
        const data = await response.json()
        setCart(data)
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 0) return

    setUpdating(itemId)
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity })
      })

      if (response.ok) {
        await fetchCart()
      }
    } catch (error) {
      console.error("Failed to update quantity:", error)
    } finally {
      setUpdating(null)
    }
  }

  const removeItem = async (itemId: string) => {
    setUpdating(itemId)
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "DELETE"
      })

      if (response.ok) {
        const item = cart.items.find(i => i.id === itemId);
        if (item) {
          analytics.removeFromCart({
            id: item.product.id,
            name: item.product.name,
            price: item.product.price || undefined,
            quantity: item.quantity,
            currency: 'BYN'
          });
        }
        await fetchCart()
      }
    } catch (error) {
      console.error("Failed to remove item:", error)
    } finally {
      setUpdating(null)
    }
  }

  const getUnit = (unit: string | null) => {
    if (!unit) return "";
    if (unit === "кг") return t('products.unit_kg');
    if (unit === "шт") return t('products.unit_pc');
    if (unit === "л") return t('products.unit_l');
    return unit;
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card-premium p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-1 h-10 bg-gradient-to-b from-accent to-accent-gold rounded-full"></div>
            <h1 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight font-serif">
              {t('cart_page.title')}
            </h1>
          </div>
          <p className="text-lg text-gray-600 font-normal">
            {t('cart_page.items_count').replace('{count}', cart.items.length.toString())}
          </p>
        </div>

        {cart.items.length > 0 ? (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Список товаров */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <div key={item.id} className="card-premium p-6">
                  <div className="flex items-center gap-6">
                    <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 border border-gray-200">
                      {item.product.image ? (
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {locale === 'en' && item.product.name_en ? item.product.name_en : item.product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {getUnit(item.product.unit)}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={updating === item.id || item.quantity <= 1}
                          className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 text-center min-w-[3rem] font-medium text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={updating === item.id}
                          className="p-2 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={updating === item.id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl disabled:opacity-50 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Сумма и оформление */}
            <div className="lg:col-span-1">
              <div className="panel p-6 sticky top-24">
                <div className="inline-flex items-center gap-2 mb-6">
                  <div className="w-1 h-6 bg-gradient-to-b from-accent to-accent-gold rounded-full"></div>
                  <h2 className="text-xl font-semibold text-gray-900">{t('cart_page.total')}</h2>
                </div>

                <div className="mb-6">
                  <CouponInput
                    orderAmount={cart.total}
                    onCouponApplied={setAppliedCoupon}
                    appliedCoupon={appliedCoupon}
                  />
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>{t('cart_page.subtotal')} ({cart.items.length})</span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>{t('cart_page.coupon_title')} ({appliedCoupon.code})</span>
                      <span>✓</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span>{t('cart_page.shipping')}</span>
                    <span className="font-medium text-gray-900">
                      {t('cart_page.free')}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-3 flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">{t('cart_page.total')}</span>
                    <span className="text-xl font-bold text-accent">
                      {t('common.on_request')}
                    </span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full btn btn-primary mb-3 block text-center"
                >
                  {t('cart_page.checkout')}
                </Link>

                <Link
                  href="/products"
                  className="w-full btn btn-secondary text-center block"
                >
                  {t('cart_page.continue')}
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
              <ShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">{t('cart_page.empty_title')}</h3>
            <p className="text-gray-600 mb-8 font-normal">
              {t('cart_page.empty_desc')}
            </p>
            <Link
              href="/products"
              className="btn btn-primary"
            >
              {t('cart_page.continue')}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
