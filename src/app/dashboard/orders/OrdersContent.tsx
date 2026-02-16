"use client";

import Link from "next/link";
import Image from "next/image";
import { Package, Eye } from "lucide-react";
import { useTranslations } from "@/lib/i18n";

interface OrdersContentProps {
  orders: any[];
}

export default function OrdersContent({ orders }: OrdersContentProps) {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-1 h-10 bg-gradient-to-b from-accent to-accent-gold rounded-full"></div>
            <h1 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight font-serif">
              {t('dashboard_orders.title')}
            </h1>
          </div>
          <p className="text-lg text-gray-600 font-normal">
            {t('dashboard_orders.subtitle')}
          </p>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="card-premium p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                  <div>
                    <h3 className="text-xl font-serif font-semibold text-gray-900 mb-2">
                      {t('dashboard_orders.order_number')}{order.orderNumber}
                    </h3>
                    <p className="text-sm text-gray-600 font-normal">
                      {t('dashboard_orders.date')}: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-2xl font-bold text-gray-900 mb-2">{order.totalAmount} BYN</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                      order.status === 'DELIVERED'
                        ? 'bg-green-50 text-green-700 border-green-100'
                        : order.status === 'PROCESSING'
                        ? 'bg-blue-50 text-blue-700 border-blue-100'
                        : order.status === 'CANCELLED'
                        ? 'bg-red-50 text-red-700 border-red-100'
                        : 'bg-gray-50 text-gray-600 border-gray-100'
                    }`}>
                      {(t('dashboard.recent_orders.status') as any)[order.status] || order.status}
                    </span>
                  </div>
                </div>

                <div className="mb-6 space-y-4">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-gray-50 border border-gray-100">
                        {item.product.image ? (
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <Package className="h-8 w-8 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900">
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-gray-500 font-normal">
                          {item.product.unit} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        {item.price} BYN
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <Link
                    href={`/dashboard/orders/${order.id}`}
                    className="btn btn-secondary inline-flex items-center gap-2 text-sm"
                  >
                    <Eye className="h-4 w-4" />
                    {t('common.show_more')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card-premium p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4 shadow-sm">
              <Package className="h-8 w-8 text-gray-300" />
            </div>
            <h3 className="text-xl font-serif font-semibold text-gray-900 mb-2">{t('dashboard_orders.no_orders')}</h3>
            <p className="text-gray-500 mb-8 font-normal">
              {t('dashboard_orders.no_orders_desc')}
            </p>
            <Link href="/products" className="btn btn-primary">
              {t('dashboard_orders.start_shopping')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
