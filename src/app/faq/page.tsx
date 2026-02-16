"use client";

import { useState } from "react";
import { useTranslations } from "@/lib/i18n";
import Link from "next/link";

type FAQItem = {
  q: string;
  a: string;
};

function FAQItemComponent({ faq, isOpen, onToggle }: {
  faq: FAQItem,
  isOpen: boolean,
  onToggle: () => void
}) {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors rounded-xl"
      >
        <span className="font-semibold text-gray-900 pr-4 text-lg">{faq.q}</span>
        <span className={`transform transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      {isOpen && (
        <div className="px-6 pb-6">
          <p className="text-gray-600 leading-relaxed font-normal">{faq.a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const t = useTranslations();

  const faqs = (t('faq_page.questions') as any) as FAQItem[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: Array.isArray(faqs) ? faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })) : [],
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-20 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-3 mb-5 justify-center">
          <div className="w-1 h-10 bg-gradient-to-b from-berry to-gold rounded-full"></div>
          <h1 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight">
            {t('faq_page.title')}
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto font-normal leading-relaxed">
          {t('faq_page.subtitle')}
        </p>
      </div>

      <div className="card-premium overflow-hidden mb-12">
        {Array.isArray(faqs) && faqs.map((faq, index) => (
          <FAQItemComponent
            key={index}
            faq={faq}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
          />
        ))}
      </div>

      <div className="text-center card-premium p-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 tracking-tight">
          {t('faq_page.cta_title')}
        </h2>
        <p className="text-gray-600 mb-8 font-normal leading-relaxed">
          {t('faq_page.cta_desc')}
        </p>
        <Link href="/contacts" className="btn btn-primary">
          {t('faq_page.cta_button')}
        </Link>
      </div>
    </div>
  );
}
