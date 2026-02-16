import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// Типы для результатов поиска
interface SearchResult {
  id: string;
  type: 'product' | 'recipe' | 'post';
  title: string;
  description: string;
  slug: string;
  image?: string;
  category?: string;
  price?: number;
  unit?: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category');
    const type = searchParams.get('type'); // 'product', 'recipe', 'post', or 'all'
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query.trim()) {
      return NextResponse.json({ results: [], total: 0 });
    }

    const results: SearchResult[] = [];

    // Поиск по продуктам
    if (!type || type === 'all' || type === 'product') {
      const products = await prisma.product.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: query } },
            { description: { contains: query } },
            { shortDescription: { contains: query } },
            { category: { name: { contains: query } } },
            { tags: { contains: query.toLowerCase() } }
          ],
          ...(category && category !== 'all' ? {
            category: { slug: category }
          } : {})
        },
        include: {
          category: true
        },
        take: Math.ceil(limit / 3), // Распределяем лимит между типами
        orderBy: { createdAt: 'desc' }
      });

      results.push(...products.map(product => ({
        id: product.id,
        type: 'product' as const,
        title: product.name,
        description: product.shortDescription || product.description || '',
        slug: product.slug,
        image: product.image || undefined,
        category: product.category?.name,
        price: product.price || undefined,
        unit: product.unit || undefined
      })));
    }

    // Поиск по рецептам (если есть таблица recipes)
    // Для простоты пока пропустим, так как рецепты в статических данных

    // Поиск по постам (если есть таблица posts)
    // Аналогично пропустим

    // Сортировка результатов по релевантности (простая реализация)
    results.sort((a, b) => {
      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();
      const queryLower = query.toLowerCase();

      // Точное совпадение в начале имеет приоритет
      if (aTitle.startsWith(queryLower) && !bTitle.startsWith(queryLower)) return -1;
      if (!aTitle.startsWith(queryLower) && bTitle.startsWith(queryLower)) return 1;

      // Затем по длине совпадения
      const aIndex = aTitle.indexOf(queryLower);
      const bIndex = bTitle.indexOf(queryLower);
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }

      return 0;
    });

    return NextResponse.json({
      results: results.slice(0, limit),
      total: results.length,
      query
    });

  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
