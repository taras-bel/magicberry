"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Check } from "lucide-react"
import { analytics } from "@/components/GoogleAnalytics"
import { useTranslations } from "@/lib/i18n"

interface CartItem {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    price: number | null
    unit: string | null
    image: string | null
  }
}

interface CartData {
  items: CartItem[]
  total: number
}

export default function CheckoutPage() {
  const t = useTranslations()
  const { data: session, status } = useSession()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [cart, setCart] = useState<CartData>({ items: [], total: 0 })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    // Информация о доставке
    shippingName: "",
    shippingPhone: "",
    shippingAddress: "",
    shippingCity: "",
    shippingNotes: "",

    // Информация об оплате
    paymentMethod: "cash" as "cash" | "card" | "transfer",
  })

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/signin?callbackUrl=/checkout")
      return
    }

    fetchCart()
  }, [session, status, router])

  // Отслеживание начала оформления заказа
  useEffect(() => {
    if (cart.items.length > 0) {
      analytics.beginCheckout(
        cart.items.map(item => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price || undefined,
          quantity: item.quantity
        })),
        undefined, // coupon
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

        if (data.items.length === 0) {
          router.push("/cart")
          return
        }
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const nextStep = () => {
    if (step < 3) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          items: cart.items.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price || 0
          })),
          totalAmount: cart.total
        })
      })

      if (response.ok) {
        const { orderId, orderNumber } = await response.json()
        router.push(`/checkout/success?order=${orderNumber}`)
      } else {
        alert("Ошибка при оформлении заказа")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Произошла ошибка при оформлении заказа")
    } finally {
      setSubmitting(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="card-premium p-6">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
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
        {/* Шаги оформления */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/cart"
              className="inline-flex items-center text-gray-600 hover:text-accent transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Вернуться в корзину
            </Link>
            <div className="text-sm text-gray-600 font-medium">
              Шаг {step} из 3
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-3 ${step >= 1 ? 'text-accent' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                step >= 1 ? 'bg-accent text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > 1 ? <Check className="w-5 h-5" /> : "1"}
              </div>
              <span className="text-sm font-medium">Доставка</span>
            </div>

            <div className={`flex-1 h-0.5 ${step >= 2 ? 'bg-accent' : 'bg-gray-200'} transition-colors`} />

            <div className={`flex items-center gap-3 ${step >= 2 ? 'text-accent' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                step >= 2 ? 'bg-accent text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > 2 ? <Check className="w-5 h-5" /> : "2"}
              </div>
              <span className="text-sm font-medium">Оплата</span>
            </div>

            <div className={`flex-1 h-0.5 ${step >= 3 ? 'bg-accent' : 'bg-gray-200'} transition-colors`} />

            <div className={`flex items-center gap-3 ${step >= 3 ? 'text-accent' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                step >= 3 ? 'bg-accent text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                3
              </div>
              <span className="text-sm font-medium">Подтверждение</span>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Форма */}
          <div className="lg:col-span-2">
            <div className="card-premium p-8">
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <div className="inline-flex items-center gap-2 mb-4">
                      <div className="w-1 h-6 bg-gradient-to-b from-accent to-accent-gold rounded-full"></div>
                      <h2 className="text-2xl font-semibold text-gray-900">Информация о доставке</h2>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="shippingName" className="block text-sm font-medium text-gray-700 mb-2">
                        ФИО *
                      </label>
                      <input
                        type="text"
                        id="shippingName"
                        name="shippingName"
                        required
                        value={formData.shippingName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl surface-glass border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/20 focus:border-[color:var(--accent)]"
                        placeholder="Иванов Иван Иванович"
                      />
                    </div>

                    <div>
                      <label htmlFor="shippingPhone" className="block text-sm font-medium text-gray-700 mb-2">
                        Телефон *
                      </label>
                      <input
                        type="tel"
                        id="shippingPhone"
                        name="shippingPhone"
                        required
                        value={formData.shippingPhone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl surface-glass border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/20 focus:border-[color:var(--accent)]"
                        placeholder="+375 (00) 000-00-00"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700 mb-2">
                      Адрес доставки *
                    </label>
                    <input
                      type="text"
                      id="shippingAddress"
                      name="shippingAddress"
                      required
                      value={formData.shippingAddress}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl surface-glass border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/20 focus:border-[color:var(--accent)]"
                      placeholder="ул. Ленина, д. 1, кв. 1"
                    />
                  </div>

                  <div>
                    <label htmlFor="shippingCity" className="block text-sm font-medium text-gray-700 mb-2">
                      Город *
                    </label>
                    <input
                      type="text"
                      id="shippingCity"
                      name="shippingCity"
                      required
                      value={formData.shippingCity}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl surface-glass border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/20 focus:border-[color:var(--accent)]"
                      placeholder="Минск"
                    />
                  </div>

                  <div>
                    <label htmlFor="shippingNotes" className="block text-sm font-medium text-gray-700 mb-2">
                      Примечания к заказу
                    </label>
                    <textarea
                      id="shippingNotes"
                      name="shippingNotes"
                      rows={4}
                      value={formData.shippingNotes}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl surface-glass border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/20 focus:border-[color:var(--accent)]"
                      placeholder="Особые пожелания по доставке..."
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={nextStep}
                      disabled={!formData.shippingName || !formData.shippingPhone || !formData.shippingAddress || !formData.shippingCity}
                      className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Далее
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <div className="inline-flex items-center gap-2 mb-4">
                      <div className="w-1 h-6 bg-gradient-to-b from-accent to-accent-gold rounded-full"></div>
                      <h2 className="text-2xl font-semibold text-gray-900">Способ оплаты</h2>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-accent transition-colors group">
                      <input
                        id="cash"
                        name="paymentMethod"
                        type="radio"
                        value="cash"
                        checked={formData.paymentMethod === "cash"}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as "cash" })}
                        className="h-4 w-4 text-[color:var(--accent)] border-[var(--border)] focus:ring-[color:var(--accent)]/20"
                      />
                      <span className="ml-3 text-sm font-medium text-[color:var(--foreground)] group-hover:text-[color:var(--accent)] transition-colors">
                        Наличными при получении
                      </span>
                    </label>

                    <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-accent transition-colors group">
                      <input
                        id="card"
                        name="paymentMethod"
                        type="radio"
                        value="card"
                        checked={formData.paymentMethod === "card"}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as "card" })}
                        className="h-4 w-4 text-[color:var(--accent)] border-[var(--border)] focus:ring-[color:var(--accent)]/20"
                      />
                      <span className="ml-3 text-sm font-medium text-[color:var(--foreground)] group-hover:text-[color:var(--accent)] transition-colors">
                        Банковской картой
                      </span>
                    </label>

                    <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-accent transition-colors group">
                      <input
                        id="transfer"
                        name="paymentMethod"
                        type="radio"
                        value="transfer"
                        checked={formData.paymentMethod === "transfer"}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as "transfer" })}
                        className="h-4 w-4 text-[color:var(--accent)] border-[var(--border)] focus:ring-[color:var(--accent)]/20"
                      />
                      <span className="ml-3 text-sm font-medium text-[color:var(--foreground)] group-hover:text-[color:var(--accent)] transition-colors">
                        Банковский перевод
                      </span>
                    </label>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      onClick={prevStep}
                      className="btn btn-secondary"
                    >
                      Назад
                    </button>
                    <button
                      onClick={nextStep}
                      className="btn btn-primary"
                    >
                      Далее
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <div className="inline-flex items-center gap-2 mb-4">
                      <div className="w-1 h-6 bg-gradient-to-b from-accent to-accent-gold rounded-full"></div>
                      <h2 className="text-2xl font-semibold text-gray-900">Подтверждение заказа</h2>
                    </div>
                    <p className="text-gray-600 font-normal">
                      Проверьте все данные перед оформлением заказа
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="panel p-6">
                      <h3 className="font-semibold text-gray-900 mb-3">Доставка</h3>
                      <div className="space-y-1 text-gray-600 font-normal">
                        <p>{formData.shippingName}</p>
                        <p>{formData.shippingPhone}</p>
                        <p>{formData.shippingAddress}, {formData.shippingCity}</p>
                        {formData.shippingNotes && (
                          <p className="text-sm mt-2 pt-2 border-t border-gray-200">Примечание: {formData.shippingNotes}</p>
                        )}
                      </div>
                    </div>

                    <div className="panel p-6">
                      <h3 className="font-semibold text-gray-900 mb-3">Оплата</h3>
                      <p className="text-gray-600 font-normal">
                        {formData.paymentMethod === "cash" && "Наличными при получении"}
                        {formData.paymentMethod === "card" && "Банковской картой"}
                        {formData.paymentMethod === "transfer" && "Банковский перевод"}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      onClick={prevStep}
                      className="btn btn-secondary"
                    >
                      Назад
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? "Оформление..." : "Подтвердить заказ"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Корзина */}
          <div className="lg:col-span-1">
            <div className="panel p-6 sticky top-24">
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="w-1 h-6 bg-gradient-to-b from-accent to-accent-gold rounded-full"></div>
                <h3 className="text-xl font-semibold text-gray-900">Ваш заказ</h3>
              </div>

              <div className="space-y-4 mb-6">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 border border-gray-200">
                      {item.product.image ? (
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.quantity} {item.product.unit || 'шт.'}
                      </p>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {/* Price hidden */}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-lg font-semibold mb-2">
                  <span className="text-gray-900">Итого</span>
                  <span className="text-accent">{t('common.on_request')}</span>
                </div>
                <p className="text-sm text-gray-600 font-normal">Доставка бесплатная</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
