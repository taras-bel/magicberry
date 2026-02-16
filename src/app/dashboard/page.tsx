import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import DashboardContent from "./DashboardContent"

async function getDashboardData(userId: string) {
  const [orders, cartItems, reviews, user] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        items: {
          include: { product: true }
        }
      }
    }),
    prisma.cartItem.count({
      where: { cart: { userId } }
    }),
    prisma.review.count({
      where: { userId }
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { loyaltyPoints: true }
    })
  ])

  return {
    orders,
    cartItemsCount: cartItems,
    reviewsCount: reviews,
    loyaltyPoints: user?.loyaltyPoints || 0
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const { orders, cartItemsCount, reviewsCount, loyaltyPoints } = await getDashboardData(session.user.id)

  return (
    <DashboardContent 
      user={{
        name: session.user.name,
        email: session.user.email,
        loyaltyPoints
      }}
      orders={orders}
      cartItemsCount={cartItemsCount}
      reviewsCount={reviewsCount}
    />
  )
}
