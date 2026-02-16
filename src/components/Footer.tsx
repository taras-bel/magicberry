"use client";

import Link from "next/link";
import { useTranslations } from "@/lib/i18n";

export default function Footer() {
  const t = useTranslations();

  return (
    <footer className="bg-primary text-white">
      <div className="container-custom py-16 lg:py-24">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-6">
            <h3 className="font-serif text-xl font-medium tracking-wide">
              {t('footer.about_title')}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              {t('footer.about_text')}
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="font-serif text-lg font-medium tracking-wide">
              {t('navigation.products_group')}
            </h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="/products" className="hover:text-white transition-colors">{t('navigation.products')}</Link></li>
              <li><Link href="/b2b" className="hover:text-white transition-colors">{t('navigation.b2b')}</Link></li>
              <li><Link href="/gifts" className="hover:text-white transition-colors">{t('navigation.gifts')}</Link></li>
              <li><Link href="/stores" className="hover:text-white transition-colors">{t('navigation.stores')}</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="font-serif text-lg font-medium tracking-wide">
              {t('navigation.company_group')}
            </h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-white transition-colors">{t('hero.about')}</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">{t('navigation.blog')}</Link></li>
              <li><Link href="/contacts" className="hover:text-white transition-colors">{t('navigation.contacts')}</Link></li>
              <li><Link href="/docs" className="hover:text-white transition-colors">{t('navigation.docs')}</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="font-serif text-lg font-medium tracking-wide">
              {t('footer.contact_title')}
            </h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="leading-relaxed">+375 (29) 347-74-70</li>
              <li className="leading-relaxed">Latvbelfruits@mail.ru</li>
              <li className="leading-relaxed">Пинский район, Беларусь</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-xs text-gray-500 uppercase tracking-widest">
              {t('footer.copyright')}
            </div>
            <div className="flex items-center gap-8 text-xs text-gray-500 uppercase tracking-widest">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
