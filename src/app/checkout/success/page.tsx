"use client";

import { Suspense, useEffect } from "react"
import Link from "next/link"
import { CheckCircle, Package, Clock } from "lucide-react"
import { analytics } from "@/components/GoogleAnalytics"

interface PageProps {
  searchParams: { order?: string }
}

function SuccessContent({ orderNumber }: { orderNumber?: string }) {
  useEffect(() => {
    // Отслеживание покупки, если есть номер заказа
    if (orderNumber) {
      // Получаем данные заказа для аналитики
      fetch(`/api/orders/${orderNumber}`)
        .then(response => response.json())
        .then(orderData => {
          if (orderData && orderData.items) {
            analytics.purchase({
              transactionId: orderNumber,
              value: orderData.totalAmount,
              currency: 'BYN',
              items: orderData.items.map((item: any) => ({
                id: item.productId,
                name: item.product.name,
                price: item.price,
                quantity: item.quantity
              }))
            });
          }
        })
        .catch(error => console.error('Failed to track purchase:', error));
    }
  }, [orderNumber]);

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="mx-auto max-w-2xl px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-8">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>

          <div className="inline-flex items-center gap-3 mb-6 justify-center">
            <div className="w-1 h-10 bg-gradient-to-b from-accent to-accent-gold rounded-full"></div>
            <h1 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight">
              Заказ успешно оформлен!
            </h1>
          </div>

          <p className="text-xl text-gray-600 mb-10 font-normal leading-relaxed">
            Спасибо за ваш заказ. Мы свяжемся с вами в ближайшее время для подтверждения деталей.
          </p>

          {orderNumber && (
            <div className="card-premium p-8 mb-10">
              <div className="flex items-center justify-center mb-4">
                <Package className="h-6 w-6 text-gray-400 mr-3" />
                <span className="text-sm font-semibold text-gray-700">
                  Номер вашего заказа
                </span>
              </div>
              <div className="text-3xl font-bold text-accent mb-3">
                {orderNumber}
              </div>
              <p className="text-sm text-gray-600 font-normal">
                Сохраните этот номер для отслеживания заказа
              </p>
            </div>
          )}

          <div className="panel p-8 mb-10">
            <div className="flex items-center justify-center mb-4">
              <Clock className="h-5 w-5 text-accent mr-3" />
              <span className="text-sm font-semibold text-gray-900">
                Что происходит дальше?
              </span>
            </div>
            <div className="text-sm text-gray-600 space-y-3 text-left max-w-md mx-auto font-normal">
              <p className="flex items-start gap-3">
                <span className="text-accent mt-0.5">•</span>
                <span>Мы обработаем ваш заказ в течение 1-2 рабочих дней</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="text-accent mt-0.5">•</span>
                <span>Менеджер свяжется с вами для подтверждения деталей</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="text-accent mt-0.5">•</span>
                <span>Вы получите уведомление о готовности к отправке</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="text-accent mt-0.5">•</span>
                <span>Доставка осуществляется в согласованные сроки</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard/orders"
              className="btn btn-primary"
            >
              Отследить заказ
            </Link>
            <Link
              href="/products"
              className="btn btn-secondary"
            >
              Продолжить покупки
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white py-20">
        <div className="mx-auto max-w-2xl px-6 lg:px-8">
          <div className="animate-pulse text-center">
            <div className="mx-auto h-20 w-20 bg-gray-200 rounded-full mb-8"></div>
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
          </div>
        </div>
      </div>
    }>
      <SuccessContent orderNumber={searchParams.order} />
    </Suspense>
  )
}
