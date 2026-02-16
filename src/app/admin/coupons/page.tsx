"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Copy,
  CheckCircle,
  XCircle,
  Percent,
  DollarSign
} from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  description: string | null;
  type: 'PERCENTAGE' | 'FIXED' | 'FREE_SHIPPING';
  value: number;
  minOrderAmount: number | null;
  maxDiscount: number | null;
  usageLimit: number | null;
  usageCount: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    type: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED' | 'FREE_SHIPPING',
    value: '',
    minOrderAmount: '',
    maxDiscount: '',
    usageLimit: '',
    expiresAt: ''
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await fetch('/api/admin/coupons');
      if (response.ok) {
        const data = await response.json();
        setCoupons(data.coupons || []);
      }
    } catch (error) {
      console.error('Failed to fetch coupons:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const method = editingCoupon ? 'PUT' : 'POST';
      const url = editingCoupon ? `/api/admin/coupons/${editingCoupon.id}` : '/api/admin/coupons';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          value: parseFloat(formData.value),
          minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : null,
          maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
          usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
          expiresAt: formData.expiresAt || null
        })
      });

      if (response.ok) {
        fetchCoupons();
        resetForm();
      }
    } catch (error) {
      console.error('Failed to save coupon:', error);
    }
  };

  const handleDelete = async (couponId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот купон?')) return;

    try {
      const response = await fetch(`/api/admin/coupons/${couponId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setCoupons(coupons.filter(c => c.id !== couponId));
      }
    } catch (error) {
      console.error('Failed to delete coupon:', error);
    }
  };

  const toggleStatus = async (couponId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/coupons/${couponId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (response.ok) {
        setCoupons(coupons.map(c =>
          c.id === couponId ? { ...c, isActive: !currentStatus } : c
        ));
      }
    } catch (error) {
      console.error('Failed to toggle coupon status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      type: 'PERCENTAGE',
      value: '',
      minOrderAmount: '',
      maxDiscount: '',
      usageLimit: '',
      expiresAt: ''
    });
    setEditingCoupon(null);
    setShowCreateForm(false);
  };

  const startEdit = (coupon: Coupon) => {
    setFormData({
      code: coupon.code,
      description: coupon.description || '',
      type: coupon.type,
      value: coupon.value.toString(),
      minOrderAmount: coupon.minOrderAmount?.toString() || '',
      maxDiscount: coupon.maxDiscount?.toString() || '',
      usageLimit: coupon.usageLimit?.toString() || '',
      expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().slice(0, 16) : ''
    });
    setEditingCoupon(coupon);
    setShowCreateForm(true);
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    // Можно добавить уведомление об успешном копировании
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PERCENTAGE':
        return <Percent className="h-4 w-4" />;
      case 'FIXED':
        return <DollarSign className="h-4 w-4" />;
      case 'FREE_SHIPPING':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'PERCENTAGE':
        return 'Процентная скидка';
      case 'FIXED':
        return 'Фиксированная сумма';
      case 'FREE_SHIPPING':
        return 'Бесплатная доставка';
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[color:var(--foreground)]">Управление купонами</h1>
          <p className="mt-1 text-sm text-[color:var(--secondary-foreground)]">
            Создание и управление промокодами
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn btn-primary !py-2 !px-4 !text-sm flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Создать купон
        </button>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="panel p-6">
          <h2 className="text-lg font-medium text-[color:var(--foreground)] mb-4">
            {editingCoupon ? 'Редактировать купон' : 'Создать новый купон'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[color:var(--secondary-foreground)]">Код купона</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="mt-1 block w-full rounded-xl surface-glass border border-[var(--border)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/20 focus:border-[color:var(--accent)]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[color:var(--secondary-foreground)]">Тип скидки</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="mt-1 block w-full rounded-xl surface-glass border border-[var(--border)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/20 focus:border-[color:var(--accent)]"
                >
                  <option value="PERCENTAGE">Процентная скидка</option>
                  <option value="FIXED">Фиксированная сумма</option>
                  <option value="FREE_SHIPPING">Бесплатная доставка</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[color:var(--secondary-foreground)]">
                  Значение {formData.type === 'PERCENTAGE' ? '(%)' : formData.type === 'FIXED' ? '(BYN)' : ''}
                </label>
                <input
                  type="number"
                  step={formData.type === 'PERCENTAGE' ? '0.01' : '0.01'}
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className="mt-1 block w-full rounded-xl surface-glass border border-[var(--border)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/20 focus:border-[color:var(--accent)]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[color:var(--secondary-foreground)]">Мин. сумма заказа (BYN)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.minOrderAmount}
                  onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                  className="mt-1 block w-full rounded-xl surface-glass border border-[var(--border)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/20 focus:border-[color:var(--accent)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.type === 'PERCENTAGE' && (
                <div>
                  <label className="block text-sm font-medium text-[color:var(--secondary-foreground)]">Макс. скидка (BYN)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    className="mt-1 block w-full rounded-xl surface-glass border border-[var(--border)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/20 focus:border-[color:var(--accent)]"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-[color:var(--secondary-foreground)]">Лимит использований</label>
                <input
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                  className="mt-1 block w-full rounded-xl surface-glass border border-[var(--border)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/20 focus:border-[color:var(--accent)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[color:var(--secondary-foreground)]">Дата истечения</label>
              <input
                type="datetime-local"
                value={formData.expiresAt}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                className="mt-1 block w-full rounded-xl surface-glass border border-[var(--border)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/20 focus:border-[color:var(--accent)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[color:var(--secondary-foreground)]">Описание</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-xl surface-glass border border-[var(--border)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/20 focus:border-[color:var(--accent)]"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="btn btn-secondary !py-2 !px-4 !text-sm"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="btn btn-primary !py-2 !px-4 !text-sm"
              >
                {editingCoupon ? 'Сохранить' : 'Создать'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Coupons List */}
      <div className="panel overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border)]">
          <h2 className="text-lg font-medium text-[color:var(--foreground)]">
            Купоны ({coupons.length})
          </h2>
        </div>

        {coupons.length === 0 ? (
          <div className="px-6 py-10 text-center text-[color:var(--secondary-foreground)]">
            <CheckCircle className="mx-auto h-12 w-12 text-[color:var(--secondary-foreground)]" />
            <h3 className="mt-2 text-sm font-medium text-[color:var(--foreground)]">Нет купонов</h3>
            <p className="mt-1 text-sm text-[color:var(--secondary-foreground)]">
              Создайте свой первый купон для скидок
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-light)]">
            {coupons.map((coupon) => (
              <div key={coupon.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(coupon.type)}
                      <span className="font-medium text-[color:var(--foreground)]">{coupon.code}</span>
                      <button
                        onClick={() => copyToClipboard(coupon.code)}
                        className="pill !p-2 !rounded-xl"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="text-sm text-[color:var(--secondary-foreground)]">
                      {getTypeLabel(coupon.type)} • {coupon.value}{coupon.type === 'PERCENTAGE' ? '%' : coupon.type === 'FIXED' ? ' BYN' : ''}
                    </div>
                    <div className="text-sm text-[color:var(--secondary-foreground)]">
                      Использован {coupon.usageCount} раз
                      {coupon.usageLimit && ` из ${coupon.usageLimit}`}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleStatus(coupon.id, coupon.isActive)}
                      className={`p-1 rounded-full ${
                        coupon.isActive ? 'text-green-600' : 'text-gray-400'
                      }`}
                    >
                      {coupon.isActive ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                    </button>
                    <button
                      onClick={() => startEdit(coupon)}
                      className="pill !p-2 !rounded-xl"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(coupon.id)}
                      className="pill !p-2 !rounded-xl hover:text-[color:var(--accent)]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {coupon.description && (
                  <div className="mt-2 text-sm text-[color:var(--secondary-foreground)]">
                    {coupon.description}
                  </div>
                )}

                <div className="mt-2 flex items-center space-x-4 text-xs text-[color:var(--secondary-foreground)]">
                  {coupon.expiresAt && (
                    <span>Истекает: {new Date(coupon.expiresAt).toLocaleDateString('ru-RU')}</span>
                  )}
                  {coupon.minOrderAmount && (
                    <span>Мин. сумма: {coupon.minOrderAmount} BYN</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
