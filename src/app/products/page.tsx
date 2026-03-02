import { Suspense } from "react";
import { Product } from "@/types/catalog";
import ProductsPageContent from "./ProductsPageContent";
import { products as staticProducts } from "@/data/products";

export const metadata = {
  title: "Продукция | Latvbelfruits",
  description: "Каталог натуральных вяленых ягод, фруктов, овощей и сиропов Latvbelfruits. Без консервантов и красителей.",
};

type Props = {
  searchParams: { category?: string; search?: string };
};

async function getProducts(category?: string, search?: string) {
  try {
    const { prisma } = await import("@/lib/prisma")
    
    const where: any = {
      isActive: true,
      slug: { not: 'vialennaya-vishnya' }
    }

    if (category) {
      where.category = {
        slug: category
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } }
      ]
    }

    const dbProducts = await prisma.product.findMany({
      where,
      include: {
        category: true
      },
      orderBy: { createdAt: 'desc' }
    })

    // Merge DB data with static translations
    const mergedProducts = dbProducts.map((product: any) => {
      const staticData = staticProducts.find(p => p.slug === product.slug);
      return {
        id: product.id,
        name: product.name,
        name_en: staticData?.name_en, // Add translation
        slug: product.slug,
        shortDescription: product.shortDescription,
        shortDescription_en: staticData?.shortDescription_en, // Add translation
        description: product.description,
        description_en: staticData?.description_en, // Add translation
        priceFrom: product.price,
        unit: staticData?.unit || product.unit,
        image: staticData?.image || product.image,
        placeholder: staticData?.placeholder || product.placeholder,
        category: product.category ? {
          name: product.category.name,
          slug: product.category.slug
        } : undefined, // Adapt to fit Product type
        categorySlug: product.category?.slug,
        tags: product.tags ? JSON.parse(product.tags) : []
      } as unknown as Product; // Cast to Product type
    });

    return {
      products: mergedProducts,
      total: dbProducts.length,
      totalPages: 1
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    return { products: [], total: 0, totalPages: 0 }
  }
}

export default async function ProductsPage({ searchParams }: Props) {
  const { category, search } = searchParams
  const { products } = await getProducts(category, search)

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsPageContent products={products} category={category} search={search} />
    </Suspense>
  );
}
