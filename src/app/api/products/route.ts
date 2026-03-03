import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { findStaticProduct, getCanonicalSlug } from "@/lib/staticProductLookup"

export const dynamic = 'force-dynamic'

// Получить все продукты
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const offset = (page - 1) * limit

    // Построить условия фильтрации
    const where: any = {
      isActive: true
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

    // Получить продукты с категориями
    const [dbProducts, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit
      }),
      prisma.product.count({ where })
    ])

    const products = dbProducts.map((product: any) => {
      const staticData = findStaticProduct(product.slug);
      
      return {
        id: product.id,
        name: product.name,
        name_en: staticData?.name_en, // Add translation
        slug: getCanonicalSlug(product.slug),
        shortDescription: product.shortDescription,
        shortDescription_en: staticData?.shortDescription_en, // Add translation
        description: product.description,
        description_en: staticData?.description_en, // Add translation
        price: product.price,
        priceFrom: product.price,
        unit: staticData?.unit || product.unit,
        image: staticData?.image || product.image,
        placeholder: staticData?.placeholder || product.placeholder,
        category: product.category ? {
          name: product.category.name,
          slug: product.category.slug
        } : undefined,
        categorySlug: product.category?.slug,
        tags: product.tags ? JSON.parse(product.tags) : []
      };
    });

    return NextResponse.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error("Get products error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
