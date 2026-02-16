"use client";

import Link from "next/link";
import { useTranslations } from "@/lib/i18n";

type Document = {
  title: string;
  description: string;
  type: string;
  size: string;
  href: string;
};

type DocCategory = {
  title: string;
  description: string;
  icon: string;
  documents: Document[];
};

export default function DocsPageContent({ cmsDocs }: { cmsDocs?: any }) {
  const t = useTranslations();

  // Формируем структуру категорий из переводов
  const documentCategories: DocCategory[] = [
    {
      title: t('docs_page.categories.quality.title'),
      description: t('docs_page.categories.quality.desc'),
      icon: "🏆",
      documents: (t('docs_page.categories.quality.docs') as any as any[]).map((doc: any, i: number) => ({
        title: doc.title,
        description: doc.desc,
        type: "PDF",
        size: ["2.1 MB", "1.8 MB", "3.2 MB"][i] || "1.0 MB", // Mock sizes aligned with original
        href: "#"
      }))
    },
    {
      title: t('docs_page.categories.technical.title'),
      description: t('docs_page.categories.technical.desc'),
      icon: "📋",
      documents: (t('docs_page.categories.technical.docs') as any as any[]).map((doc: any, i: number) => ({
        title: doc.title,
        description: doc.desc,
        type: "PDF",
        size: ["945 KB", "756 KB", "1.3 MB"][i] || "1.0 MB",
        href: "#"
      }))
    },
    {
      title: t('docs_page.categories.protocols.title'),
      description: t('docs_page.categories.protocols.desc'),
      icon: "🔬",
      documents: (t('docs_page.categories.protocols.docs') as any as any[]).map((doc: any, i: number) => ({
        title: doc.title,
        description: doc.desc,
        type: "PDF",
        size: ["487 KB", "356 KB", "412 KB"][i] || "1.0 MB",
        href: "#"
      }))
    },
    {
      title: t('docs_page.categories.legal.title'),
      description: t('docs_page.categories.legal.desc'),
      icon: "⚖️",
      documents: (t('docs_page.categories.legal.docs') as any as any[]).map((doc: any, i: number) => ({
        title: doc.title,
        description: doc.desc,
        type: "PDF",
        size: ["234 KB", "1.1 MB"][i] || "1.0 MB",
        href: "#"
      }))
    }
  ];

  const infoList = (t('docs_page.info_usage_list') as any) as string[];

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-white via-gray-50 to-white py-20 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-5 justify-center">
              <div className="w-1 h-10 bg-gradient-to-b from-berry to-gold rounded-full"></div>
              <h1 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight">
                {t('docs_page.title')}
              </h1>
            </div>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-600 font-normal leading-relaxed">
              {t('docs_page.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Documents Categories */}
      <section className="py-20 border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="space-y-16">
            {documentCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{category.icon}</div>
                  <div>
                    <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">
                      {category.title}
                    </h2>
                    <p className="text-gray-600 font-normal mt-2">{category.description}</p>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {category.documents.map((doc, docIndex) => (
                    <div key={docIndex} className="card-premium p-6 group hover:shadow-lg transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-berry transition-colors">
                            {doc.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 font-normal">
                            {doc.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                          <span className="px-2.5 py-1 bg-gray-100 rounded-lg text-gray-700 font-semibold border border-gray-200">
                            {doc.type}
                          </span>
                          <span>{doc.size}</span>
                        </div>
                        <a
                          href={doc.href}
                          className="flex items-center gap-2 text-berry hover:text-berry-dark font-semibold text-sm transition-colors"
                        >
                          <span>{t('docs_page.download')}</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Request Section */}
      <section className="py-20 border-t border-gray-200 bg-gradient-to-b from-gray-50/30 to-white">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <div className="inline-flex items-center gap-3 mb-5 justify-center">
            <div className="w-1 h-10 bg-gradient-to-b from-berry to-gold rounded-full"></div>
            <h2 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight">
              {t('docs_page.cta_title')}
            </h2>
          </div>
          <p className="text-lg text-gray-600 mb-10 font-normal leading-relaxed">
            {t('docs_page.cta_desc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contacts" className="btn btn-primary">
              {t('docs_page.cta_contact')}
            </Link>
            <Link href="/about" className="btn btn-secondary">
              {t('docs_page.cta_about')}
            </Link>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20 border-t border-gray-200">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="card-premium p-10">
            <h2 className="text-3xl font-semibold text-gray-900 mb-8 tracking-tight">
              {t('docs_page.info_title')}
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 text-lg">{t('docs_page.info_usage_title')}</h3>
                <p className="text-gray-600 font-normal leading-relaxed mb-3">
                  {t('docs_page.info_usage_desc')}
                </p>
                <ul className="mt-3 space-y-2 text-gray-600 ml-4 font-normal">
                  {Array.isArray(infoList) && infoList.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-berry mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3 text-lg">{t('docs_page.info_originals_title')}</h3>
                <p className="text-gray-600 font-normal leading-relaxed">
                  {t('docs_page.info_originals_desc')}
                </p>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3 text-lg">{t('docs_page.info_validity_title')}</h3>
                <p className="text-gray-600 font-normal leading-relaxed">
                  {t('docs_page.info_validity_desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
