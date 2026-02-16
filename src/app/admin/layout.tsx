"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  Ticket,
  Mail,
  BarChart3,
  Settings,
  LogOut
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

const adminNavigation = [
  { name: "Обзор", href: "/admin", icon: LayoutDashboard },
  { name: "Заказы", href: "/admin/orders", icon: ShoppingCart },
  { name: "Пользователи", href: "/admin/users", icon: Users },
  { name: "Продукты", href: "/admin/products", icon: Package },
  { name: "Купоны", href: "/admin/coupons", icon: Ticket },
  { name: "Рассылки", href: "/admin/newsletters", icon: Mail },
  { name: "Аналитика", href: "/admin/analytics", icon: BarChart3 },
  { name: "Настройки", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.user.role !== 'ADMIN') {
      router.push('/');
      return;
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--gray-50)]">
        <div className="surface-glass rounded-2xl border border-[var(--border)] p-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border border-[var(--border)] border-t-[var(--accent)]" />
            <div className="text-sm text-[color:var(--secondary-foreground)]">Загрузка…</div>
          </div>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      {/* Header */}
      <header className="surface-glass border-b border-[var(--border)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-[color:var(--foreground)]">Админ-панель</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-[color:var(--secondary-foreground)]">
                Привет, {session.user.name || session.user.email}
              </span>
              <button
                onClick={() => router.push('/')}
                className="btn btn-secondary !py-2 !px-3 !text-sm"
              >
                На сайт
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl">
        {/* Sidebar */}
        <aside className="w-72 border-r border-[var(--border)] surface-glass min-h-[calc(100vh-64px)]">
          <nav className="p-4">
            <div className="space-y-2">
              {adminNavigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`pill w-full justify-start gap-3 ${
                      isActive ? "pill-active" : ""
                    }`}
                  >
                    <item.icon
                      className={`h-5 w-5 flex-shrink-0 ${
                        isActive
                          ? "text-white/90"
                          : "text-[color:var(--secondary-foreground)] group-hover:text-[color:var(--foreground)]"
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
