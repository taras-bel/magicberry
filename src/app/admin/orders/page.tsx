"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Eye,
  Edit,
  MoreVertical,
  CheckCircle,
  Clock,
  Truck,
  XCircle
} from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  user: {
    name: string | null;
    email: string;
    phone: string | null;
  };
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    product: {
      name: string;
    };
  }>;
  coupon?: {
    code: string;
  };
}

const statusOptions = [
  { value: 'PENDING', label: 'Ожидает', color: 'bg-gray-100 text-gray-800' },
  { value: 'CONFIRMED', label: 'Подтвержден', color: 'bg-purple-100 text-purple-800' },
  { value: 'PROCESSING', label: 'В обработке', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'SHIPPED', label: 'Отправлен', color: 'bg-blue-100 text-blue-800' },
  { value: 'DELIVERED', label: 'Доставлен', color: 'bg-green-100 text-green-800' },
  // Без красного: отменённые делаем нейтральными
  { value: 'CANCELLED', label: 'Отменен', color: 'bg-gray-100 text-gray-700' }
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrder(orderId);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        // Обновляем статус в локальном состоянии
        setOrders(orders.map(order =>
          order.id === orderId
            ? { ...order, status: newStatus }
            : order
        ));
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
    } finally {
      setUpdatingOrder(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (order.user.name && order.user.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusInfo = (status: string) => {
    return statusOptions.find(option => option.value === status) || statusOptions[0];
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-2xl"></div>
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
        <h1 className="text-2xl font-bold text-[color:var(--foreground)]">Управление заказами</h1>
        <p className="mt-1 text-sm text-[color:var(--secondary-foreground)]">
          Просмотр и управление всеми заказами
        </p>
      </div>

      {/* Filters */}
      <div className="panel p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[color:var(--secondary-foreground)] h-4 w-4" />
              <input
                type="text"
                placeholder="Поиск по номеру заказа или email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl surface-glass border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/20 focus:border-[color:var(--accent)]"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl surface-glass border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/20 focus:border-[color:var(--accent)]"
            >
              <option value="">Все статусы</option>
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="panel overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border)]">
          <h2 className="text-lg font-medium text-[color:var(--foreground)]">
            Заказы ({filteredOrders.length})
          </h2>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="px-6 py-10 text-center text-[color:var(--secondary-foreground)]">
            <CheckCircle className="mx-auto h-12 w-12 text-[color:var(--secondary-foreground)]" />
            <h3 className="mt-2 text-sm font-medium text-[color:var(--foreground)]">Нет заказов</h3>
            <p className="mt-1 text-sm text-[color:var(--secondary-foreground)]">
              {searchTerm || statusFilter ? 'Попробуйте изменить фильтры поиска' : 'Заказы появятся здесь после оформления покупок'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-light)]">
            {filteredOrders.map((order) => (
              <div key={order.id} className="px-6 py-4 hover:bg-[var(--gray-50)] transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h3 className="text-sm font-medium text-[color:var(--foreground)]">
                          #{order.orderNumber}
                        </h3>
                        <p className="text-sm text-[color:var(--secondary-foreground)]">
                          {order.user.name || order.user.email}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusInfo(order.status).color}`}>
                        {getStatusInfo(order.status).label}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-[color:var(--secondary-foreground)]">
                      {order.items.length} товаров • {order.totalAmount} BYN • {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                    </div>
                    {order.coupon && (
                      <div className="mt-1 text-xs text-[color:var(--secondary-foreground)]">
                        Купон: {order.coupon.code}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Status Update Dropdown */}
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      disabled={updatingOrder === order.id}
                      className="text-sm px-3 py-2 rounded-xl surface-glass border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/20 focus:border-[color:var(--accent)] disabled:opacity-50"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>

                    {/* View Details */}
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="pill !p-2 !rounded-xl"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
