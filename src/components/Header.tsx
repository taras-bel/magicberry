"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useTranslations } from '@/lib/i18n';
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";
import AdvancedSearch from "./AdvancedSearch";
import NotificationBell from "./NotificationBell";
import { primaryNav } from "@/lib/routes";
import { ChevronDown } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: session, status } = useSession();
  const t = useTranslations();

  // State for mobile accordion
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleGroup = (label: string) => {
    setExpandedGroup(expandedGroup === label ? null : label);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 transition-all duration-300">
      <div className="container-custom">
        <div className="flex h-20 items-center justify-between">
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {primaryNav.map((item) => (
              <div key={item.label} className="relative group">
                {item.children ? (
                  <>
                    <button className="flex items-center gap-1.5 py-4 text-sm font-medium uppercase tracking-widest text-primary hover:text-berry transition-colors">
                      {t(`navigation.${item.label}`)}
                      <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180 text-gray-400 group-hover:text-berry" />
                    </button>
                    
                    {/* Dropdown Menu */}
                    <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 w-56">
                      <div className="bg-white border border-gray-100 shadow-elegant rounded-lg p-2 flex flex-col">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href || '#'}
                            className="px-4 py-3 text-sm text-gray-600 hover:text-berry hover:bg-gray-50 rounded-md transition-colors text-left"
                          >
                            {t(`navigation.${child.label}`)}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href || '#'}
                    className="text-sm font-medium uppercase tracking-widest text-primary hover:text-berry transition-colors"
                  >
                    {t(`navigation.${item.label}`)}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-6" suppressHydrationWarning>
            <AdvancedSearch />
            {mounted && <NotificationBell />}
            <LanguageSwitcher />
            
            <div className="pl-6 border-l border-gray-200 flex items-center gap-4">
              {!mounted || status === "loading" ? (
                <div className="h-5 w-20 animate-pulse bg-gray-100 rounded" />
              ) : session ? (
                <div className="flex items-center gap-4">
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium hover:text-berry transition-colors"
                  >
                    {session.user?.name || t('navigation.account')}
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="text-sm text-gray-500 hover:text-primary transition-colors"
                  >
                    {t('navigation.logout')}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-6">
                  <Link
                    href="/auth/signin"
                    className="text-sm font-medium hover:text-berry transition-colors"
                  >
                    {t('navigation.signin')}
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="btn btn-primary px-6 py-2 text-xs"
                  >
                    {t('navigation.signup')}
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button & Search */}
          <div className="flex items-center gap-4 lg:hidden">
            <AdvancedSearch />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-primary hover:text-berry transition-colors"
              aria-label="Меню"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white absolute w-full left-0 shadow-lg max-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="px-6 py-8 space-y-6">
            <nav className="flex flex-col space-y-2">
              {primaryNav.map((item) => (
                <div key={item.label}>
                  {item.children ? (
                    <div>
                      <button 
                        onClick={() => toggleGroup(item.label)}
                        className="flex items-center justify-between w-full py-3 text-lg font-serif font-medium text-primary hover:text-berry transition-colors"
                      >
                        {t(`navigation.${item.label}`)}
                        <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${expandedGroup === item.label ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {expandedGroup === item.label && (
                        <div className="pl-4 pb-2 space-y-2 border-l border-gray-100 ml-2">
                          {item.children.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href || '#'}
                              className="block py-2 text-base text-gray-600 hover:text-berry transition-colors"
                              onClick={() => setIsOpen(false)}
                            >
                              {t(`navigation.${child.label}`)}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href || '#'}
                      className="block py-3 text-lg font-serif font-medium text-primary hover:text-berry transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {t(`navigation.${item.label}`)}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
            
            <div className="pt-6 border-t border-gray-100 space-y-4">
              <div className="flex justify-center pb-4">
                <LanguageSwitcher />
              </div>
              
              {!mounted || status === "loading" ? (
                <div className="h-10 w-full animate-pulse bg-gray-100 rounded" />
              ) : session ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block w-full py-3 text-center text-primary border border-gray-200 rounded hover:border-berry transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {session.user?.name || t('navigation.account')}
                  </Link>
                  <button
                    onClick={() => {
                      signOut()
                      setIsOpen(false)
                    }}
                    className="block w-full py-3 text-center text-gray-500 hover:text-primary transition-colors"
                  >
                    {t('navigation.logout')}
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    href="/auth/signin"
                    className="btn btn-outline w-full py-3 text-center justify-center"
                    onClick={() => setIsOpen(false)}
                  >
                    {t('navigation.signin')}
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="btn btn-primary w-full py-3 text-center justify-center"
                    onClick={() => setIsOpen(false)}
                  >
                    {t('navigation.signup')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
