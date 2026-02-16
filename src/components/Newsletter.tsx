"use client";

import { useState } from "react";
import { useTranslations } from "@/lib/i18n";
import { analytics } from "./GoogleAnalytics";

export default function Newsletter() {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Спасибо за подписку!");
        e.currentTarget.reset();
        analytics.subscribe('newsletter');
      } else {
        setMessage(data.error || "Произошла ошибка. Попробуйте позже.");
      }
    } catch {
      setMessage("Произошла ошибка. Попробуйте позже.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full">
      <form
        className="flex flex-col sm:flex-row items-stretch gap-0 border-b border-white/20 focus-within:border-white transition-colors"
        onSubmit={handleSubmit}
      >
        <input
          type="email"
          name="email"
          required
          placeholder={t("footer.email_placeholder") || "Ваш email"}
          className="flex-1 bg-transparent px-0 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-0 text-base"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-4 text-sm font-medium uppercase tracking-widest text-white hover:text-gray-300 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "..." : t("footer.subscribe_button") || "Подписаться"}
        </button>
      </form>
      {message && (
        <p className="mt-4 text-sm text-gray-400">
          {message}
        </p>
      )}
    </div>
  );
}
