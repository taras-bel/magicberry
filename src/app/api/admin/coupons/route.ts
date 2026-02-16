import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/admin/coupons - Получить все купоны
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Поскольку у нас проблема с Prisma клиентом, возвращаем пустой массив
    // В реальном приложении здесь был бы запрос к базе данных
    return NextResponse.json({
      coupons: [],
      message: "Coupons management temporarily disabled due to Prisma client generation issues"
    });

  } catch (error) {
    console.error("Admin coupons GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/admin/coupons - Создать новый купон
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Поскольку у нас проблема с Prisma клиентом, возвращаем ошибку
    return NextResponse.json(
      { error: "Coupons management temporarily disabled due to Prisma client generation issues" },
      { status: 501 }
    );

  } catch (error) {
    console.error("Admin coupons POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
