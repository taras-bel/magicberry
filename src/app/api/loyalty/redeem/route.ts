import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { spendLoyaltyPoints } from "@/lib/loyalty-service";
import { prisma } from "@/lib/prisma";

// POST /api/loyalty/redeem - Обмен баллов на награду
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { rewardId } = await request.json();

    if (!rewardId) {
      return NextResponse.json(
        { error: "Reward ID is required" },
        { status: 400 }
      );
    }

    // Проверяем, что награда существует и активна
    const reward = await prisma.loyaltyReward.findUnique({
      where: { id: rewardId }
    });

    if (!reward) {
      return NextResponse.json(
        { error: "Reward not found" },
        { status: 404 }
      );
    }

    if (!reward.isActive) {
      return NextResponse.json(
        { error: "Reward is not active" },
        { status: 400 }
      );
    }

    // Проверяем лимиты использования
    if (reward.maxUses && reward.usedCount >= reward.maxUses) {
      return NextResponse.json(
        { error: "Reward usage limit exceeded" },
        { status: 400 }
      );
    }

    // Проверяем срок действия
    if (reward.expiresAt && reward.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Reward has expired" },
        { status: 400 }
      );
    }

    // Обмениваем баллы
    const result = await spendLoyaltyPoints(session.user.id, rewardId, reward.pointsCost);

    // Создаем код купона или применяем награду в зависимости от типа
    let couponCode = null;
    let rewardResult = null;

    switch (reward.type) {
      case 'DISCOUNT_PERCENTAGE':
      case 'DISCOUNT_FIXED':
        // Создаем персональный купон для пользователя
        const coupon = await prisma.coupon.create({
          data: {
            code: `LOYALTY-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            description: `Награда программы лояльности: ${reward.title}`,
            type: reward.type === 'DISCOUNT_PERCENTAGE' ? 'PERCENTAGE' : 'FIXED',
            value: reward.value || 0,
            minOrderAmount: 1, // минимальная сумма для использования
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 дней
            isActive: true
          }
        });
        couponCode = coupon.code;
        rewardResult = { couponCode, discount: reward.value };
        break;

      case 'FREE_SHIPPING':
        // Создаем купон на бесплатную доставку
        const shippingCoupon = await prisma.coupon.create({
          data: {
            code: `FREE-SHIPPING-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            description: `Бесплатная доставка - награда программы лояльности`,
            type: 'FREE_SHIPPING',
            value: 0,
            minOrderAmount: 1,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 дней
            isActive: true
          }
        });
        couponCode = shippingCoupon.code;
        rewardResult = { couponCode, freeShipping: true };
        break;

      case 'BONUS_POINTS':
        // Начисляем дополнительные баллы
        await prisma.user.update({
          where: { id: session.user.id },
          data: { loyaltyPoints: { increment: reward.value || 0 } }
        });

        await prisma.loyaltyTransaction.create({
          data: {
            userId: session.user.id,
            type: 'BONUS',
            points: reward.value || 0,
            description: `Бонусные баллы за награду: ${reward.title}`,
            rewardId
          }
        });

        rewardResult = { bonusPoints: reward.value };
        break;

      case 'FREE_PRODUCT':
        // Для бесплатного продукта можно создать специальный купон
        // Логика зависит от конкретного продукта
        rewardResult = { message: "Свяжитесь с поддержкой для получения бесплатного продукта" };
        break;

      default:
        return NextResponse.json(
          { error: "Unsupported reward type" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `Успешно получена награда: ${reward.title}`,
      reward: {
        id: reward.id,
        title: reward.title,
        type: reward.type,
        pointsSpent: reward.pointsCost
      },
      result: rewardResult,
      remainingPoints: result.remainingPoints
    });

  } catch (error) {
    console.error("Loyalty redeem error:", error);

    // Специальная обработка ошибки недостатка баллов
    if (error instanceof Error && error.message.includes("Недостаточно баллов")) {
      return NextResponse.json(
        { error: "Недостаточно баллов для данной награды" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
