import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/admin/dashboard - Статистика для админ дашборда
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Поскольку у нас проблема с Prisma клиентом, возвращаем тестовые данные
    return NextResponse.json({
      totalOrders: 0,
      totalRevenue: 0,
      totalCustomers: 0,
      pendingOrders: 0,
      recentOrders: [],
      message: "Dashboard statistics temporarily disabled due to Prisma client generation issues"
    });

  } catch (error) {
    console.error("Admin dashboard error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
