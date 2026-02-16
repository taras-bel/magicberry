"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Bell, Check } from "lucide-react";
import { useTranslations } from "@/lib/i18n";

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

export default function NotificationBell() {
  const { data: session } = useSession();
  const t = useTranslations();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetchNotifications();
    }
  }, [session]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications?limit=10');
      const data = await response.json();

      if (response.ok) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
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
      // Отметить все видимые непрочитанные уведомления
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Только что';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} ч назад`;
    } else {
      return date.toLocaleDateString('ru-RU');
    }
  };

  if (!session?.user) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pill !p-2 !rounded-xl"
        title="Уведомления"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[color:var(--accent-gold)] text-[color:var(--foreground)] text-xs rounded-full w-5 h-5 flex items-center justify-center border border-[var(--border)]">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 panel surface-glass z-50">
          <div className="p-4 border-b border-[var(--border)]">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-[color:var(--foreground)]">Уведомления</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  disabled={isLoading}
                  className="text-sm text-[color:var(--accent)] hover:opacity-80 disabled:opacity-50"
                >
                  {isLoading ? '...' : 'Отметить все прочитанными'}
                </button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-[color:var(--secondary-foreground)]">
                У вас нет уведомлений
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-[var(--border-light)] hover:bg-[var(--gray-50)] transition-colors ${
                    !notification.isRead ? 'bg-[rgba(212,175,55,0.10)]' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className={`font-medium text-sm ${
                          !notification.isRead ? 'text-[color:var(--foreground)]' : 'text-[color:var(--secondary-foreground)]'
                        }`}>
                          {notification.title}
                        </h4>
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="pill !p-2 !rounded-xl ml-2"
                            title="Отметить как прочитанное"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <p className="text-sm text-[color:var(--secondary-foreground)] mt-1 leading-relaxed">
                        {notification.message}
                      </p>

                      {notification.orderNumber && (
                        <p className="text-xs text-[color:var(--accent)] mt-2">
                          Заказ №{notification.orderNumber}
                          {notification.orderStatus && ` • ${notification.orderStatus}`}
                        </p>
                      )}

                      <p className="text-xs text-[color:var(--secondary-foreground)] mt-2">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t border-[var(--border)] text-center">
              <a
                href="/dashboard"
                className="text-sm text-[color:var(--accent)] hover:opacity-80"
                onClick={() => setIsOpen(false)}
              >
                Посмотреть все уведомления
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
