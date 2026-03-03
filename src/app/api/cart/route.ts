import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { findStaticProduct, getCanonicalSlug } from "@/lib/staticProductLookup"

// Получить корзину пользователя
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: { product: true }
        }
      }
    })

    if (!cart) {
      return NextResponse.json({ items: [], total: 0 })
    }

    // Обогащаем товары данными из статического файла (переводы)
    const items = cart.items.map((item: any) => {
      const staticProduct = findStaticProduct(item.product.slug)
      return {
        ...item,
        product: {
          ...item.product,
          slug: getCanonicalSlug(item.product.slug),
          name_en: staticProduct?.name_en || item.product.name,
          unit: staticProduct?.unit || item.product.unit,
          image: staticProduct?.image || item.product.image
        }
      }
    })

    const total = items.reduce((sum: number, item: any) => {
      return sum + (item.product.price || 0) * item.quantity
    }, 0)

    return NextResponse.json({
      items,
      total
    })
  } catch (error) {
    console.error("Get cart error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Добавить товар в корзину
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { productId, quantity = 1 } = await request.json()

    if (!productId || typeof quantity !== 'number' || quantity < 1) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    }

    // Проверить, существует ли продукт
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product || !product.isActive) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Найти или создать корзину
    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id }
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.user.id }
      })
    }

    // Проверить, есть ли уже этот товар в корзине
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId
        }
      }
    })

    if (existingItem) {
      // Обновить количество
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      })
    } else {
      // Создать новый элемент
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Add to cart error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
