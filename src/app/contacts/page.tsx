"use client";

import { useState } from "react";
import { useTranslations } from "@/lib/i18n";

export default function ContactsPage() {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage(t('contacts_page.form.success'));
        e.currentTarget.reset();
      } else {
        setMessage(t('contacts_page.form.error'));
      }
    } catch {
      setMessage(t('contacts_page.form.error'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-0 px-6 py-20 lg:px-8">
      <div className="mb-16">
        <div className="inline-flex items-center gap-3 mb-5">
          <div className="w-1 h-10 bg-gradient-to-b from-accent to-accent-gold rounded-full"></div>
          <h1 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight">{t('contacts_page.title')}</h1>
        </div>
        <p className="text-lg text-gray-600 font-normal leading-relaxed max-w-2xl">
          {t('contacts_page.subtitle')}
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div className="card-premium p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">{t('contacts_page.details_title')}</h2>
            <ul className="space-y-4">
              <li className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent/20 to-accent/10">
                  <span className="text-lg">📞</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{t('contacts_page.details.phone')}</p>
                  <p className="text-gray-600 font-normal">+375 (29) 347-74-70</p>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent/20 to-accent/10">
                  <span className="text-lg">✉️</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{t('contacts_page.details.email')}</p>
                  <p className="text-gray-600 font-normal">Latvbelfruits@mail.ru</p>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent/20 to-accent/10">
                  <span className="text-lg">📍</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{t('contacts_page.details.address')}</p>
                  <p className="text-gray-600 font-normal">{t('contacts_page.details.address_val')}</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="card-premium p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">{t('contacts_page.hours_title')}</h2>
            <div className="space-y-2 text-sm text-gray-600 font-normal">
              <p>{t('contacts_page.hours.weekdays')}</p>
              <p>{t('contacts_page.hours.weekends')}</p>
              <p className="text-xs text-gray-500 mt-4 font-normal">
                {t('contacts_page.hours.urgent')}
              </p>
            </div>
          </div>
        </div>
        <div className="card-premium p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">{t('contacts_page.form_title')}</h2>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">{t('contacts_page.form.name')}</label>
                <input
                  name="name"
                  placeholder={t('contacts_page.form.name_ph')}
                  className="w-full px-4 py-3 rounded-xl surface-glass border border-[var(--border)] text-[color:var(--foreground)] placeholder-[color:var(--secondary-foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/20 focus:border-[color:var(--accent)] transition-all"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">{t('contacts_page.form.email')}</label>
                <input
                  name="email"
                  type="email"
                  placeholder={t('contacts_page.form.email_ph')}
                  className="w-full px-4 py-3 rounded-xl surface-glass border border-[var(--border)] text-[color:var(--foreground)] placeholder-[color:var(--secondary-foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/20 focus:border-[color:var(--accent)] transition-all"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">{t('contacts_page.form.phone')}</label>
              <input
                name="phone"
                type="tel"
                placeholder={t('contacts_page.form.phone_ph')}
                className="w-full px-4 py-3 rounded-xl surface-glass border border-[var(--border)] text-[color:var(--foreground)] placeholder-[color:var(--secondary-foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/20 focus:border-[color:var(--accent)] transition-all"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">{t('contacts_page.form.message')}</label>
              <textarea
                name="message"
                placeholder={t('contacts_page.form.message_ph')}
                rows={4}
                className="w-full px-4 py-3 rounded-xl surface-glass border border-[var(--border)] text-[color:var(--foreground)] placeholder-[color:var(--secondary-foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/20 focus:border-[color:var(--accent)] transition-all resize-none"
                required
                disabled={isSubmitting}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn btn-primary disabled:opacity-50"
            >
              {isSubmitting ? t('contacts_page.form.sending') : t('contacts_page.form.submit')}
            </button>
          </form>
          {message && (
            <div className={`mt-5 p-4 rounded-xl text-sm font-medium ${
              message.includes(t('contacts_page.form.error').split('.')[0]) || message.includes("ошибка") || message.includes("error")
                ? "bg-[rgba(214,48,49,0.08)] text-[color:var(--accent)] border border-[rgba(214,48,49,0.20)]" 
                : "bg-green-50 text-green-700 border border-green-200"
            }`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
