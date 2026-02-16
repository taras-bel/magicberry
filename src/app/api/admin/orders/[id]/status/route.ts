import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email-service";

// PUT /api/admin/orders/[id]/status - Обновить статус заказа
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { status } = body;

    // Валидация статуса
    const validStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // Найти заказ
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { user: true }
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    const oldStatus = order.status;

    // Обновить статус заказа
    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: { status }
    });

    // Создать уведомление для пользователя
    const statusMessages = {
      CONFIRMED: {
        title: "Заказ подтвержден",
        message: `Ваш заказ №${order.orderNumber} был подтвержден и готовится к отправке.`
      },
      PROCESSING: {
        title: "Заказ в обработке",
        message: `Ваш заказ №${order.orderNumber} находится в обработке.`
      },
      SHIPPED: {
        title: "Заказ отправлен",
        message: `Ваш заказ №${order.orderNumber} был отправлен. Ожидайте доставку в ближайшее время.`
      },
      DELIVERED: {
        title: "Заказ доставлен",
        message: `Ваш заказ №${order.orderNumber} успешно доставлен. Спасибо за покупку!`
      },
      CANCELLED: {
        title: "Заказ отменен",
        message: `Ваш заказ №${order.orderNumber} был отменен. Свяжитесь с нами для получения дополнительной информации.`
      }
    };

    if (statusMessages[status as keyof typeof statusMessages] && oldStatus !== status) {
      await prisma.notification.create({
        data: {
          userId: order.userId,
          title: statusMessages[status as keyof typeof statusMessages].title,
          message: statusMessages[status as keyof typeof statusMessages].message,
          type: 'ORDER_UPDATE',
          orderId: order.id
        }
      });

      // Отправляем email уведомление
      sendEmail(order.user.email, 'orderStatusUpdate', [order.orderNumber, statusMessages[status as keyof typeof statusMessages].title])
        .catch(error => console.error('Failed to send status update email:', error));
    }

    return NextResponse.json({ order: updatedOrder });

  } catch (error) {
    console.error("Update order status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
