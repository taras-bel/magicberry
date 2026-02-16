"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  ShoppingCart,
  Users,
  DollarSign,
  Package,
  Eye,
  BarChart3
} from "lucide-react";

interface AnalyticsData {
  overview: {
    totalOrders: number;
    totalRevenue: number;
    totalCustomers: number;
    averageOrderValue: number;
  };
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    customer: {
      name: string | null;
      email: string;
    };
    itemsCount: number;
  }>;
  topProducts: Array<{
    product: {
      id: string;
      name: string;
      image: string | null;
    } | undefined;
    count: number;
  }>;
  orderStatusStats: Array<{
    status: string;
    count: number;
  }>;
  dailyRevenue: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.user.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    fetchAnalytics();
  }, [session, status, router]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics/overview');
      if (response.ok) {
        const analyticsData = await response.json();
        setData(analyticsData);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800';
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="panel p-6 text-center">
        <p className="text-[color:var(--secondary-foreground)]">Не удалось загрузить данные аналитики</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div>
        <div className="flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-[color:var(--accent)]" />
          <h1 className="text-3xl font-bold text-[color:var(--foreground)]">Аналитика продаж</h1>
        </div>
        <p className="mt-2 text-[color:var(--secondary-foreground)]">
          Обзор ключевых метрик и статистики продаж
        </p>
      </div>

      {/* Основные метрики */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-premium p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-2xl bg-gray-100">
              <ShoppingCart className="h-6 w-6 text-[color:var(--foreground)]" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[color:var(--secondary-foreground)]">Всего заказов</p>
              <p className="text-2xl font-bold text-[color:var(--foreground)]">{data.overview.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="card-premium p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-2xl bg-gray-100">
              <DollarSign className="h-6 w-6 text-[color:var(--foreground)]" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[color:var(--secondary-foreground)]">Общая выручка</p>
              <p className="text-2xl font-bold text-[color:var(--foreground)]">{data.overview.totalRevenue.toFixed(2)} BYN</p>
            </div>
          </div>
        </div>

        <div className="card-premium p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-2xl bg-gray-100">
              <Users className="h-6 w-6 text-[color:var(--foreground)]" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[color:var(--secondary-foreground)]">Клиентов</p>
              <p className="text-2xl font-bold text-[color:var(--foreground)]">{data.overview.totalCustomers}</p>
            </div>
          </div>
        </div>

        <div className="card-premium p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-2xl bg-gray-100">
              <TrendingUp className="h-6 w-6 text-[color:var(--foreground)]" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[color:var(--secondary-foreground)]">Средний чек</p>
              <p className="text-2xl font-bold text-[color:var(--foreground)]">{data.overview.averageOrderValue.toFixed(2)} BYN</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Недавние заказы */}
        <div className="panel p-6">
          <h2 className="text-lg font-semibold text-[color:var(--foreground)] mb-4">Недавние заказы</h2>
          <div className="space-y-4">
            {data.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border border-[var(--border)] rounded-2xl surface-glass">
                <div>
                  <div className="font-medium text-[color:var(--foreground)]">#{order.orderNumber}</div>
                  <div className="text-sm text-[color:var(--secondary-foreground)]">
                    {order.customer.name || order.customer.email}
                  </div>
                  <div className="text-sm text-[color:var(--secondary-foreground)]">
                    {order.itemsCount} товаров • {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-[color:var(--foreground)]">{order.totalAmount} BYN</div>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Популярные товары */}
        <div className="panel p-6">
          <h2 className="text-lg font-semibold text-[color:var(--foreground)] mb-4">Популярные товары</h2>
          <div className="space-y-4">
            {data.topProducts.map((item, index) => (
              item.product && (
                <div key={item.product.id} className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden">
                    {item.product.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-6 h-6 text-[color:var(--secondary-foreground)]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-[color:var(--foreground)]">{item.product.name}</div>
                    <div className="text-sm text-[color:var(--secondary-foreground)]">Продано: {item.count} шт.</div>
                  </div>
                  <div className="text-lg font-bold gradient-text">#{index + 1}</div>
                </div>
              )
            ))}
          </div>
        </div>
      </div>

      {/* Статистика по статусам заказов */}
      <div className="panel p-6">
        <h2 className="text-lg font-semibold text-[color:var(--foreground)] mb-4">Статусы заказов</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {data.orderStatusStats.map((stat) => (
            <div key={stat.status} className="text-center">
              <div className={`inline-block px-3 py-2 rounded-2xl ${getStatusColor(stat.status)} font-medium`}>
                {stat.status}
              </div>
              <div className="mt-2 text-2xl font-bold text-[color:var(--foreground)]">{stat.count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
