"use client";

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Объявляем gtag и dataLayer глобально
declare global {
  function gtag(...args: any[]): void;
  interface Window {
    dataLayer?: unknown[];
  }
}

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Загружаем Google Analytics только на клиенте
    const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

    if (!GA_MEASUREMENT_ID) {
      return; // Silent return if not configured
    }

    // Инициализация gtag (только один раз)
    if (!window.dataLayer) {
      const script1 = document.createElement('script');
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(script1);

      const script2 = document.createElement('script');
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
      `;
      document.head.appendChild(script2);
    }

    // Отслеживание просмотров страниц
    if (typeof gtag !== 'undefined') {
      const searchString = searchParams ? (searchParams.toString() ? `?${searchParams.toString()}` : '') : '';
      gtag('config', GA_MEASUREMENT_ID, {
        page_path: pathname + searchString,
        page_title: document.title,
        page_location: window.location.href
      });
    }
  }, [pathname, searchParams]);

  return null;
}

// E-commerce события
export const analytics = {
  // Просмотр товара
  viewItem: (product: {
    id: string;
    name: string;
    category?: string;
    price?: number;
    currency?: string;
  }) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'view_item', {
        currency: product.currency || 'BYN',
        value: product.price,
        items: [{
          item_id: product.id,
          item_name: product.name,
          category: product.category,
          price: product.price,
          quantity: 1
        }]
      });
    }
  },

  // Добавление в корзину
  addToCart: (product: {
    id: string;
    name: string;
    category?: string;
    price?: number;
    quantity?: number;
    currency?: string;
  }) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'add_to_cart', {
        currency: product.currency || 'BYN',
        value: (product.price || 0) * (product.quantity || 1),
        items: [{
          item_id: product.id,
          item_name: product.name,
          category: product.category,
          price: product.price,
          quantity: product.quantity || 1
        }]
      });
    }
  },

  // Удаление из корзины
  removeFromCart: (product: {
    id: string;
    name: string;
    category?: string;
    price?: number;
    quantity?: number;
    currency?: string;
  }) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'remove_from_cart', {
        currency: product.currency || 'BYN',
        value: (product.price || 0) * (product.quantity || 1),
        items: [{
          item_id: product.id,
          item_name: product.name,
          category: product.category,
          price: product.price,
          quantity: product.quantity || 1
        }]
      });
    }
  },

  // Просмотр корзины
  viewCart: (items: Array<{
    id: string;
    name: string;
    category?: string;
    price?: number;
    quantity: number;
  }>, currency = 'BYN') => {
    if (typeof gtag !== 'undefined') {
      const value = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

      gtag('event', 'view_cart', {
        currency,
        value,
        items: items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          category: item.category,
          price: item.price,
          quantity: item.quantity
        }))
      });
    }
  },

  // Начало оформления заказа
  beginCheckout: (items: Array<{
    id: string;
    name: string;
    category?: string;
    price?: number;
    quantity: number;
  }>, coupon?: string, currency = 'BYN') => {
    if (typeof gtag !== 'undefined') {
      const value = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

      gtag('event', 'begin_checkout', {
        currency,
        value,
        coupon,
        items: items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          category: item.category,
          price: item.price,
          quantity: item.quantity
        }))
      });
    }
  },

  // Завершение покупки
  purchase: (orderData: {
    transactionId: string;
    value: number;
    currency?: string;
    coupon?: string;
    shipping?: number;
    tax?: number;
    items: Array<{
      id: string;
      name: string;
      category?: string;
      price?: number;
      quantity: number;
    }>;
  }) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'purchase', {
        transaction_id: orderData.transactionId,
        currency: orderData.currency || 'BYN',
        value: orderData.value,
        coupon: orderData.coupon,
        shipping: orderData.shipping,
        tax: orderData.tax,
        items: orderData.items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          category: item.category,
          price: item.price,
          quantity: item.quantity
        }))
      });
    }
  },

  // Регистрация
  signUp: (method = 'email') => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'sign_up', {
        method
      });
    }
  },

  // Вход в систему
  login: (method = 'email') => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'login', {
        method
      });
    }
  },

  // Поиск
  search: (searchTerm: string) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'search', {
        search_term: searchTerm
      });
    }
  },

  // Отзыв
  review: (productId: string, rating: number) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'generate_lead', {
        content_type: 'review',
        content_id: productId,
        value: rating
      });
    }
  },

  // Подписка на рассылку
  subscribe: (method = 'newsletter') => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'generate_lead', {
        content_type: 'newsletter',
        method
      });
    }
  }
};
