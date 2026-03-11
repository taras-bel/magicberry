import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { productJsonLd } from "@/lib/seo";
import ProductReviews from "@/components/ProductReviews";
import ProductRecommendations from "@/components/ProductRecommendations";
import { findStaticProduct, getCanonicalSlug } from "@/lib/staticProductLookup";

type Props = { params: { slug: string } };

async function getProduct(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        reviews: {
          include: {
            user: {
              select: { name: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!product || !product.isActive) {
      return null;
    }

    // Рассчитать средний рейтинг
    const averageRating = product.reviews.length > 0
      ? product.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / product.reviews.length
      : 0;

    const staticData = findStaticProduct(product.slug);

    // Преобразуем slug категории в тип Category
    const categorySlug = product.category?.slug || '';
    let category: 'weight' | 'packaged' | 'syrup' | 'must' = 'packaged';
    
    if (categorySlug === 'dried-berries' || categorySlug === 'dried-fruits' || categorySlug === 'dried-vegetables') {
      category = 'weight';
    } else if (categorySlug === 'syrups') {
      category = 'syrup';
    } else if (categorySlug === 'mixes') {
      category = 'packaged';
    }

    return {
      id: product.id,
      name: product.name,
      slug: getCanonicalSlug(product.slug),
      description: product.description || undefined,
      shortDescription: product.shortDescription || undefined,
      price: product.price || undefined,
      priceFrom: product.price || undefined,
      unit: staticData?.unit || product.unit || undefined,
      image: staticData?.image || product.image || undefined,
      placeholder: staticData?.placeholder || product.placeholder || undefined,
      category,
      categorySlug,
      tags: product.tags ? JSON.parse(product.tags) : [],
      averageRating,
      reviewsCount: product.reviews.length,
      rating: averageRating > 0 ? averageRating : undefined,
      wildberriesUrl: staticData?.wildberriesUrl
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.slug);
  
  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: productJsonLd(product) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Продукция", item: "https://example.com/products" },
              { "@type": "ListItem", position: 2, name: product.name, item: `https://example.com/products/${product.slug}` },
            ],
          }),
        }}
      />
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              placeholder={product.placeholder ? "blur" : "empty"}
              blurDataURL={product.placeholder}
              unoptimized
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <div className="text-4xl text-gray-300">📦</div>
            </div>
          )}
        </div>
        <div className="space-y-5">
          <nav className="text-sm text-gray-500">
            <Link href="/products" className="hover:text-accent transition-colors">Продукция</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700">{product.name}</span>
          </nav>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900">{product.name}</h1>
          {product.shortDescription && (
            <p className="text-lg text-gray-600 leading-relaxed">{product.shortDescription}</p>
          )}
          {product.description && (
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          )}
          <ul className="list-inside list-disc text-gray-700 space-y-1">
            <li>Без консервантов и красителей</li>
            <li>Без диоксида серы</li>
            <li>Сохранение витаминов и микроэлементов</li>
          </ul>
          <div className="panel p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Характеристики</h3>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <dt className="text-gray-600 font-medium">Категория</dt>
              <dd className="text-gray-900">{product.category}</dd>
              {product.unit && (
                <>
                  <dt className="text-gray-600 font-medium">Единица</dt>
                  <dd className="text-gray-900">{product.unit}</dd>
                </>
              )}
            </dl>
          </div>
          <div className="sticky top-24 z-10 space-y-3">
            {product.wildberriesUrl ? (
              <a
                href={product.wildberriesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary w-full text-center"
              >
                Купить тут
              </a>
            ) : null}
            <a href="/contacts" className="btn btn-primary w-full text-center">
              Запросить опт / уточнить наличие
            </a>
          </div>
        </div>
      </div>

      {/* Отзывы */}
      <div className="mt-16 border-t border-gray-200 pt-16">
        <ProductReviews productSlug={product.slug} />
      </div>

      {/* Похожие товары */}
      <div className="mt-16 border-t border-gray-200 pt-16">
        <ProductRecommendations
          type="similar"
          productId={product.id}
          limit={4}
        />
      </div>
    </div>
  );
}
