import type { Product } from "@/types/catalog";

export function productJsonLd(p: Product) {
  const data = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: p.name,
    description: p.shortDescription ?? p.description ?? "",
    image: p.image ? [absoluteUrl(p.image)] : [],
    brand: {
      "@type": "Brand",
      name: "Magic berry",
    },
    offers: p.priceFrom
      ? {
          "@type": "Offer",
          priceCurrency: "BYN",
          price: p.priceFrom,
          availability: "https://schema.org/InStock",
        }
      : undefined,
  };
  return JSON.stringify(data);
}

export function absoluteUrl(path: string) {
  if (path.startsWith("http")) return path;
  const base =
    typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL
      ? process.env.NEXT_PUBLIC_SITE_URL
      : "https://example.com";
  return new URL(path, base).toString();
}


