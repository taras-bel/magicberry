import { getServerSession } from "next-auth/next"
import { redirect, notFound } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import OrderDetailContent from "./OrderDetailContent"
import { products as staticProducts } from "@/data/products"

interface Props {
  params: {
    orderId: string
  }
}

async function getOrder(orderId: string, userId: string) {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
      userId: userId
    },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  })

  return order
}

export default async function OrderPage({ params }: Props) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const order = await getOrder(params.orderId, session.user.id)

  if (!order) {
    notFound()
  }

  // Обогащаем товары переводами из статического файла
  const enrichedItems = order.items.map((item: any) => {
    const staticProduct = staticProducts.find(p => p.slug === item.product.slug)
    return {
      ...item,
      product: {
        ...item.product,
        name_en: staticProduct?.name_en || item.product.name,
        unit: staticProduct?.unit || item.product.unit,
        image: staticProduct?.image || item.product.image
      }
    }
  })

  const enrichedOrder = {
    ...order,
    items: enrichedItems
  }

  return <OrderDetailContent order={enrichedOrder} />
}
