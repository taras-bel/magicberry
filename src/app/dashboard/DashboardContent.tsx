"use client";

import Link from "next/link";
import { ShoppingBag, Package, Heart, Bell, Gift, Star, LogOut } from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import { signOut } from "next-auth/react";

interface DashboardContentProps {
  user: {
    name?: string | null;
    email?: string | null;
    loyaltyPoints: number;
  };
  orders: any[];
  cartItemsCount: number;
  reviewsCount: number;
}

export default function DashboardContent({ user, orders, cartItemsCount, reviewsCount }: DashboardContentProps) {
  const t = useTranslations();

  const stats = [
    { label: t('dashboard.stats.orders'), value: orders.length, icon: ShoppingBag },
    { label: t('dashboard.stats.cart'), value: cartItemsCount, icon: Package },
    { label: t('dashboard.stats.reviews'), value: reviewsCount, icon: Heart },
    { label: t('dashboard.stats.points'), value: user.loyaltyPoints, icon: Star },
  ];

  const quickActions = [
    {
      title: (t('dashboard.quick_actions.continue_shopping') as any).title,
      desc: (t('dashboard.quick_actions.continue_shopping') as any).desc,
      href: "/products",
      icon: ShoppingBag,
    },
    {
      title: (t('dashboard.quick_actions.cart') as any).title,
      desc: (t('dashboard.quick_actions.cart') as any).desc,
      href: "/cart",
      icon: Package,
    },
    {
      title: (t('dashboard.quick_actions.my_orders') as any).title,
      desc: (t('dashboard.quick_actions.my_orders') as any).desc,
      href: "/dashboard/orders",
      icon: Heart,
    },
    {
      title: (t('dashboard.quick_actions.loyalty') as any).title,
      desc: (t('dashboard.quick_actions.loyalty') as any).desc,
      href: "/dashboard/loyalty",
      icon: Gift,
    },
    {
      title: (t('dashboard.quick_actions.notifications') as any).title,
      desc: (t('dashboard.quick_actions.notifications') as any).desc,
      href: "/dashboard/notifications",
      icon: Bell,
    },
  ];

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-1 h-10 bg-gradient-to-b from-accent to-accent-gold rounded-full"></div>
              <h1 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight font-serif">
                {t('dashboard.welcome')} {user.name || t('dashboard.user_fallback')}!
              </h1>
            </div>
            <p className="text-lg text-gray-600 font-normal">
              {t('dashboard.subtitle')}
            </p>
          </div>
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="btn btn-outline flex items-center gap-2 text-sm px-6 py-2.5 rounded-xl border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            <LogOut className="w-4 h-4" />
            {t('navigation.logout')}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="mb-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="p-6 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-lg hover:border-gray-200 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600 font-medium text-sm">{stat.label}</span>
                <div className="p-2 rounded-lg bg-white shadow-sm text-gray-400 group-hover:text-accent transition-colors">
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-16">
          <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-8 flex items-center gap-3">
            {t('dashboard.quick_actions.title')}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className="group p-6 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:border-gray-200 transition-all duration-300 flex items-start gap-5"
              >
                <div className="p-3 rounded-xl bg-gray-50 group-hover:bg-accent/5 transition-colors">
                  <action.icon className="w-6 h-6 text-gray-400 group-hover:text-accent transition-colors" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-accent transition-colors mb-1">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-500 font-normal">
                    {action.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif font-semibold text-gray-900">
              {t('dashboard.recent_orders.title')}
            </h2>
            <Link
              href="/dashboard/orders"
              className="text-sm font-medium text-accent hover:text-accent-dark transition-colors"
            >
              {t('dashboard.recent_orders.view_all')} →
            </Link>
          </div>

          {orders.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-gray-100">
              <div className="divide-y divide-gray-100">
                {orders.map((order: any) => (
                  <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-gray-50/50 transition-colors gap-4">
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-900">
                        {t('dashboard.recent_orders.order_prefix')}{order.orderNumber}
                      </p>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span>{order.items.length} {t('dashboard.recent_orders.items_suffix')}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                      <p className="font-bold text-gray-900 whitespace-nowrap">
                        {order.totalAmount} BYN
                      </p>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                        order.status === 'DELIVERED'
                          ? 'bg-green-50 text-green-700 border-green-100'
                          : order.status === 'PROCESSING'
                          ? 'bg-blue-50 text-blue-700 border-blue-100'
                          : 'bg-gray-50 text-gray-600 border-gray-100'
                      }`}>
                        {(t('dashboard.recent_orders.status') as any)[order.status] || order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-sm mb-4">
                <Package className="h-8 w-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('dashboard.recent_orders.no_orders')}</h3>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                {t('dashboard.recent_orders.no_orders_desc')}
              </p>
              <Link
                href="/products"
                className="btn btn-primary"
              >
                {t('dashboard.recent_orders.start_shopping')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
