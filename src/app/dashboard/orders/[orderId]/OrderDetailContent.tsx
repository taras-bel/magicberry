"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, CreditCard, Package } from "lucide-react";
import { useTranslations, useI18n } from "@/lib/i18n";
import { format } from "date-fns";
import { ru, enUS } from "date-fns/locale";

interface OrderDetailContentProps {
  order: any; // Типизировать по необходимости
}

export default function OrderDetailContent({ order }: OrderDetailContentProps) {
  const t = useTranslations();
  const { locale } = useI18n();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'PROCESSING': return 'bg-indigo-100 text-indigo-800';
      case 'SHIPPED': return 'bg-purple-100 text-purple-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUnit = (unit: string | null) => {
    if (!unit) return "";
    if (unit === "кг") return t('products.unit_kg');
    if (unit === "шт") return t('products.unit_pc');
    if (unit === "л") return t('products.unit_l');
    return unit;
  };

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <Link href="/dashboard/orders" className="inline-flex items-center text-gray-600 hover:text-[color:var(--accent)] mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('dashboard_orders.back_to_orders')}
        </Link>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-serif font-semibold text-gray-900 mb-1">
                {t('dashboard_orders.order_number')} {order.orderNumber}
              </h1>
              <p className="text-gray-500">
                {format(new Date(order.createdAt), "d MMMM yyyy, HH:mm", { locale: locale === 'ru' ? ru : enUS })}
              </p>
            </div>
            <span className={`px-4 py-1.5 rounded-full text-sm font-medium self-start md:self-center ${getStatusColor(order.status)}`}>
              {t(`dashboard.recent_orders.status.${order.status}`)}
            </span>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                {t('dashboard_orders.shipping_details')}
              </h3>
              <div className="text-gray-600 space-y-1">
                <p>{order.shippingAddress || "-"}</p>
                <p>{order.shippingCity}</p>
                <p>{order.shippingPhone}</p>
                {order.shippingNotes && (
                  <p className="text-sm text-gray-500 mt-2 italic">{order.shippingNotes}</p>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-400" />
                {t('dashboard_orders.payment_details')}
              </h3>
              <div className="text-gray-600 space-y-1">
                <p>{order.paymentMethod || "Online Payment"}</p>
                <p className="text-sm text-gray-500">
                  Total: <span className="font-semibold text-gray-900 text-lg">{order.totalAmount} BYN</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">{t('dashboard_orders.items')}</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {order.items.map((item: any) => (
              <div key={item.id} className="p-6 flex items-center gap-4">
                <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.product.image ? (
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {locale === 'en' && item.product.name_en ? item.product.name_en : item.product.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {item.quantity} {getUnit(item.product.unit)} × {item.price} BYN
                  </p>
                </div>
                <div className="text-right font-medium text-gray-900">
                  {(item.quantity * item.price).toFixed(2)} BYN
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
            <span className="font-semibold text-gray-900">{t('dashboard_orders.total')}</span>
            <span className="text-xl font-bold text-[color:var(--accent)]">{order.totalAmount} BYN</span>
          </div>
        </div>
      </div>
    </div>
  );
}
