import { products } from "@/data/products";

const slugAliases: Record<string, string> = {
  "vialennaya-vishnya": "vialenaya-vishnya",
  "vialennaya-klyukva": "vialenaya-klyukva",
};

export function getCanonicalSlug(slug: string) {
  return slugAliases[slug] ?? slug;
}

export function findStaticProduct(slug: string) {
  const canonicalSlug = getCanonicalSlug(slug);
  return products.find((product) => product.slug === canonicalSlug);
}

export function getSlugAlias(slug: string) {
  return slugAliases[slug];
}
