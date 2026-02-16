import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/subscribe - Подписка на рассылку
export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: "Email обязателен" },
        { status: 400 }
      );
    }

    // Проверяем валидность email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Неверный формат email" },
        { status: 400 }
      );
    }

    // Проверяем, не подписан ли уже пользователь
    const existingSubscriber = await prisma.newsletter.findUnique({
      where: { email: email.trim().toLowerCase() }
    });

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return NextResponse.json(
          { error: "Вы уже подписаны на рассылку" },
          { status: 400 }
        );
      } else {
        // Реактивируем подписку
        await prisma.newsletter.update({
          where: { email: email.trim().toLowerCase() },
          data: { isActive: true, name }
        });

        return NextResponse.json({
          message: "Подписка успешно возобновлена",
          subscriber: { email, name }
        });
      }
    }

    // Создаем новую подписку
    const subscriber = await prisma.newsletter.create({
      data: {
        email: email.trim().toLowerCase(),
        name: name?.trim()
      }
    });

    return NextResponse.json(
      {
        message: "Вы успешно подписались на рассылку",
        subscriber: { email: subscriber.email, name: subscriber.name }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/subscribe - Отписка от рассылки
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    if (!email) {
      return NextResponse.json(
        { error: "Email обязателен" },
        { status: 400 }
      );
    }

    // Находим подписчика
    const subscriber = await prisma.newsletter.findUnique({
      where: { email: email.trim().toLowerCase() }
    });

    if (!subscriber) {
      return NextResponse.json(
        { error: "Подписчик не найден" },
        { status: 404 }
      );
    }

    if (!subscriber.isActive) {
      return NextResponse.json(
        { message: "Вы уже отписаны от рассылки" }
      );
    }

    // Деактивируем подписку
    await prisma.newsletter.update({
      where: { email: email.trim().toLowerCase() },
      data: { isActive: false }
    });

    return NextResponse.json({
      message: "Вы успешно отписались от рассылки"
    });

  } catch (error) {
    console.error("Unsubscribe error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}