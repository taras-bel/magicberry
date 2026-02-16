import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Обновить количество товара в корзине
export async function PUT(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { quantity } = await request.json()

    if (typeof quantity !== 'number' || quantity < 0) {
      return NextResponse.json({ error: "Invalid quantity" }, { status: 400 })
    }

    // Проверить, что элемент принадлежит пользователю
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: params.itemId,
        cart: { userId: session.user.id }
      }
    })

    if (!cartItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    if (quantity === 0) {
      // Удалить элемент
      await prisma.cartItem.delete({
        where: { id: params.itemId }
      })
    } else {
      // Обновить количество
      await prisma.cartItem.update({
        where: { id: params.itemId },
        data: { quantity }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update cart item error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Удалить товар из корзины
export async function DELETE(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Проверить, что элемент принадлежит пользователю
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: params.itemId,
        cart: { userId: session.user.id }
      }
    })

    if (!cartItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    await prisma.cartItem.delete({
      where: { id: params.itemId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete cart item error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
