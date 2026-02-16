"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Users,
  DollarSign,
  Package,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  pendingOrders: number;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    totalAmount: number;
    status: string;
    customer: string;
    createdAt: string;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'text-green-700 bg-green-100';
      case 'SHIPPED':
        return 'text-blue-700 bg-blue-100';
      case 'PROCESSING':
        return 'text-yellow-800 bg-yellow-100';
      case 'CONFIRMED':
        return 'text-purple-700 bg-purple-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[color:var(--foreground)]">Обзор</h1>
        <p className="mt-1 text-sm text-[color:var(--secondary-foreground)]">
          Общая статистика и последние активности
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-premium p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-2xl bg-gray-100">
              <ShoppingCart className="h-6 w-6 text-[color:var(--foreground)]" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[color:var(--secondary-foreground)]">Всего заказов</p>
              <p className="text-2xl font-bold text-[color:var(--foreground)]">
                {stats?.totalOrders || 0}
              </p>
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
              <p className="text-2xl font-bold text-[color:var(--foreground)]">
                {stats?.totalRevenue?.toFixed(2) || '0.00'} BYN
              </p>
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
              <p className="text-2xl font-bold text-[color:var(--foreground)]">
                {stats?.totalCustomers || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card-premium p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-2xl bg-gray-100">
              <AlertCircle className="h-6 w-6 text-[color:var(--foreground)]" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[color:var(--secondary-foreground)]">Ожидают обработки</p>
              <p className="text-2xl font-bold text-[color:var(--foreground)]">
                {stats?.pendingOrders || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/admin/orders"
          className="card-premium p-6"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-2xl bg-gray-100">
              <ShoppingCart className="h-6 w-6 text-[color:var(--foreground)]" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-[color:var(--foreground)]">Управление заказами</h3>
              <p className="text-sm text-[color:var(--secondary-foreground)]">Просмотр и обработка заказов</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/products"
          className="card-premium p-6"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-2xl bg-gray-100">
              <Package className="h-6 w-6 text-[color:var(--foreground)]" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-[color:var(--foreground)]">Управление продуктами</h3>
              <p className="text-sm text-[color:var(--secondary-foreground)]">Добавление и редактирование товаров</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/coupons"
          className="card-premium p-6"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-2xl bg-gray-100">
              <TrendingUp className="h-6 w-6 text-[color:var(--foreground)]" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-[color:var(--foreground)]">Скидки и купоны</h3>
              <p className="text-sm text-[color:var(--secondary-foreground)]">Создание промокодов</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="panel">
        <div className="px-6 py-4 border-b border-[var(--border)]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-[color:var(--foreground)]">Недавние заказы</h2>
            <Link
              href="/admin/orders"
              className="text-sm font-medium text-[color:var(--accent)] hover:opacity-80"
            >
              Смотреть все
            </Link>
          </div>
        </div>
        <div className="divide-y divide-[var(--border-light)]">
          {stats?.recentOrders?.length ? (
            stats.recentOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium text-[color:var(--foreground)]">
                        #{order.orderNumber}
                      </span>
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-sm text-[color:var(--secondary-foreground)]">
                      {order.customer} • {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-[color:var(--foreground)]">
                      {order.totalAmount} BYN
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-[color:var(--secondary-foreground)]">
              <ShoppingCart className="mx-auto h-12 w-12 text-[color:var(--secondary-foreground)]" />
              <h3 className="mt-2 text-sm font-medium text-[color:var(--foreground)]">Нет заказов</h3>
              <p className="mt-1 text-sm text-[color:var(--secondary-foreground)]">
                Заказы появятся здесь после оформления покупок
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
