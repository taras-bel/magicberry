"use client";

import { useState, useEffect } from "react";
import { useTranslations, useI18n } from "@/lib/i18n";
import { Bell, Check, CheckCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ru, enUS } from "date-fns/locale";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'ORDER_UPDATE';
  isRead: boolean;
  orderId?: string;
  orderNumber?: string;
  orderStatus?: string;
  createdAt: string;
}

export default function NotificationsPage() {
  const t = useTranslations();
  const { locale } = useI18n();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    fetchNotifications();
  }, [page, filter]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(filter === 'unread' && { unread: 'true' })
      });

      const response = await fetch(`/api/notifications?${params}`);
      const data = await response.json();

      if (response.ok) {
        setNotifications(data.notifications);
        setTotalPages(data.totalPages);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST'
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(n =>
            n.id === notificationId ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    setIsLoading(true);
    try {
      const unreadNotifications = notifications.filter(n => !n.isRead);
      await Promise.all(
        unreadNotifications.map(n => markAsRead(n.id))
      );
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS':
        return '✅';
      case 'WARNING':
        return '⚠️';
      case 'ERROR':
        return '❌';
      case 'ORDER_UPDATE':
        return '📦';
      default:
        return 'ℹ️';
    }
  };

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case 'SUCCESS':
        return 'text-green-600 bg-green-50';
      case 'WARNING':
        return 'text-yellow-600 bg-yellow-50';
      case 'ERROR':
        return 'text-red-600 bg-red-50';
      case 'ORDER_UPDATE':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        {/* Заголовок */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="inline-flex items-center gap-3">
              <div className="w-1 h-10 bg-gradient-to-b from-accent to-accent-gold rounded-full"></div>
              <h1 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight font-serif">
                {t('dashboard_notifications.title')}
              </h1>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFilter('all')}
                className={`pill ${filter === 'all' ? 'pill-active' : ''}`}
              >
                {t('dashboard_notifications.all')} ({notifications.length + (filter === 'all' ? 0 : unreadCount)})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`pill ${filter === 'unread' ? 'pill-active' : ''}`}
              >
                {t('dashboard_notifications.unread')} ({unreadCount})
              </button>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                disabled={isLoading}
                className="btn btn-secondary inline-flex items-center gap-2 disabled:opacity-50"
              >
                <CheckCheck className="w-4 h-4" />
                {t('dashboard_notifications.mark_all_read')}
              </button>
            )}
          </div>
        </div>

        {/* Список уведомлений */}
        <div className="card-premium overflow-hidden">
          {isLoading ? (
            <div className="p-8">
              <div className="animate-pulse space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-4 p-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Bell className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('dashboard_notifications.empty')}
              </h3>
              <p className="text-gray-600 font-normal">
                {t('dashboard_notifications.empty_desc')}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-gray-50 transition-colors ${
                    !notification.isRead ? 'bg-blue-50/50' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-full ${getNotificationTypeColor(notification.type)}`}>
                      <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className={`font-semibold text-gray-900 mb-2 ${
                            !notification.isRead ? 'font-bold' : ''
                          }`}>
                            {notification.title}
                          </h3>

                          <div className="text-gray-700 leading-relaxed font-normal mb-3">
                            {notification.message}
                          </div>

                          {notification.orderNumber && (
                            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 font-medium mb-3">
                              {locale === 'en' ? 'Order #' : 'Заказ №'}{notification.orderNumber}
                              {notification.orderStatus && ` • ${notification.orderStatus}`}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-3 ml-4">
                          <span className="text-sm text-gray-500 whitespace-nowrap font-medium">
                            {formatDistanceToNow(new Date(notification.createdAt), {
                              addSuffix: true,
                              locale: locale === 'en' ? enUS : ru
                            })}
                          </span>

                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1.5 text-gray-400 hover:text-accent transition-colors rounded-lg hover:bg-gray-100"
                              title={locale === 'en' ? "Mark as read" : "Отметить как прочитанное"}
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Пагинация */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center gap-2">
              <button
                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                disabled={page === 1}
                className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('common.previous')}
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => Math.abs(p - page) <= 2 || p === 1 || p === totalPages)
                  .map((p, index, arr) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                        p === page
                          ? 'bg-accent text-white'
                          : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
              </div>

              <button
                onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                disabled={page === totalPages}
                className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('common.next')}
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
