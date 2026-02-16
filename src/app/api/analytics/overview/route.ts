import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/analytics/overview - Общая статистика для админов
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Получаем статистику за последние 30 дней
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      totalOrders,
      totalRevenue,
      totalCustomers,
      recentOrders,
      topProducts,
      orderStatusStats,
      dailyRevenue
    ] = await Promise.all([
      // Общее количество заказов
      prisma.order.count(),

      // Общая выручка
      prisma.order.aggregate({
        _sum: { totalAmount: true }
      }),

      // Количество уникальных клиентов
      prisma.user.count({
        where: { orders: { some: {} } }
      }),

      // Недавние заказы
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
          items: { include: { product: { select: { name: true } } } }
        }
      }),

      // Популярные товары
      prisma.orderItem.groupBy({
        by: ['productId'],
        _count: { productId: true },
        orderBy: { _count: { productId: 'desc' } },
        take: 5
      }).then(async (groups: any) => {
        const productIds = groups.map((g: any) => g.productId);
        const products = await prisma.product.findMany({
          where: { id: { in: productIds } },
          select: { id: true, name: true, image: true }
        });

        return groups.map(group => ({
          product: products.find(p => p.id === group.productId),
          count: group._count.productId
        }));
      }),

      // Статистика по статусам заказов
      prisma.order.groupBy({
        by: ['status'],
        _count: { status: true }
      }),

      // Выручка по дням (последние 7 дней)
      prisma.$queryRaw`
        SELECT
          DATE(createdAt) as date,
          SUM(totalAmount) as revenue,
          COUNT(*) as orders
        FROM orders
        WHERE createdAt >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        GROUP BY DATE(createdAt)
        ORDER BY date DESC
      `
    ]);

    return NextResponse.json({
      overview: {
        totalOrders,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        totalCustomers,
        averageOrderValue: totalOrders > 0 ? (totalRevenue._sum.totalAmount || 0) / totalOrders : 0
      },
      recentOrders: recentOrders.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
        customer: {
          name: order.user.name,
          email: order.user.email
        },
        itemsCount: order.items.length
      })),
      topProducts,
      orderStatusStats: orderStatusStats.map(stat => ({
        status: stat.status,
        count: stat._count.status
      })),
      dailyRevenue
    });

  } catch (error) {
    console.error("Analytics overview error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
