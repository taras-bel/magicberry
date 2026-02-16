import { NextRequest, NextResponse } from "next/server";

// Временно отключено - нужна генерация Prisma клиента
export async function POST(request: NextRequest) {
  // Заглушка для тестирования UI
  const body = await request.json();
  const { code } = body;

  if (code === 'TEST10') {
    return NextResponse.json({
      coupon: {
        id: '1',
        code: 'TEST10',
        description: 'Тестовая скидка 10%',
        type: 'PERCENTAGE',
        value: 10,
        discountAmount: 0, // будет рассчитано на клиенте
        minOrderAmount: 50
      }
    });
  }

  if (code === 'TEST50') {
    return NextResponse.json({
      coupon: {
        id: '2',
        code: 'TEST50',
        description: 'Скидка 50 BYN',
        type: 'FIXED',
        value: 50,
        discountAmount: 50,
        minOrderAmount: 100
      }
    });
  }

  return NextResponse.json(
    { error: "Промокод не найден. Попробуйте TEST10 или TEST50" },
    { status: 404 }
  );
}
