import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import { I18nProvider } from '@/lib/i18n';
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SessionProvider } from "@/components/SessionProvider";
import ServiceWorker from "@/components/ServiceWorker";
import Analytics from "@/components/Analytics";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { Suspense } from "react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  display: 'swap',
});

const isProduction = process.env.NODE_ENV === "production";

export const metadata: Metadata = {
  title: {
    template: "%s | Latvbelfruits",
    default: "Latvbelfruits — вяленые ягоды, фрукты, овощи и сиропы",
  },
  description:
    "Производство натуральных вяленых ягод, фруктов и овощей, а также сиропов. Без консервантов, красителей и диоксида серы. Основаны в 2014 году.",
  metadataBase: new URL("https://latvbelfruits.by"),
         icons: {
           icon: "/favicon.ico",
           apple: [
             { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
             { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" }
           ]
         },
         manifest: "/manifest.json",
         appleWebApp: {
           capable: true,
           statusBarStyle: "default",
           title: "Latvbelfruits",
           startupImage: [
             {
               url: "/icons/icon-512x512.png",
               media: "(device-width: 768px) and (device-height: 1024px)"
             }
           ]
         },
  keywords: [
    "вяленые ягоды",
    "вяленые фрукты",
    "вяленые овощи",
    "натуральные сиропы",
    "без консервантов",
  ],
  other: {
    "mobile-web-app-capable": "yes",
  },
  openGraph: {
    title: "Latvbelfruits — натуральные вяленые ягоды и сиропы",
    description:
      "Запатентованная технология бережного вяления. Натурально и вкусно.",
    url: "https://latvbelfruits.by",
    siteName: "Latvbelfruits",
    images: [{ url: "/images/products/cranberry-1600.webp", width: 1600, height: 1200 }],
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Latvbelfruits — натуральные вяленые ягоды и сиропы",
    description: "Запатентованная технология бережного вяления.",
    images: ["/images/products/cranberry-1600.webp"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} ${cormorant.variable} antialiased`}>
        <I18nProvider>
          <SessionProvider>
            {isProduction && <ServiceWorker />}
            {isProduction && <Analytics />}
            {isProduction && (
              <Suspense fallback={null}>
                <GoogleAnalytics />
              </Suspense>
            )}
            <Header />
            <main className="bg-[var(--background)]">{children}</main>
            <Footer />
          </SessionProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
