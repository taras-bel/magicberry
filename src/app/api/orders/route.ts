import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendEmail, sendAdminNotification } from "@/lib/email-service"
import { earnLoyaltyPoints } from "@/lib/loyalty-service"

// Временная заглушка для аналитики (в браузере это будет работать через gtag)
const trackPurchase = (orderData: any) => {
  // Эта функция будет вызвана на клиенте через window.postMessage или другой механизм
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('purchase', { detail: orderData }));
  }
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const {
      shippingName,
      shippingPhone,
      shippingAddress,
      shippingCity,
      shippingNotes,
      paymentMethod,
      items,
      totalAmount
    } = await request.json()

    // Генерируем номер заказа
    const orderNumber = `MB-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`

    // Получаем информацию о пользователе
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Создаем заказ в транзакции
    const result = await prisma.$transaction(async (tx) => {
      // Создаем заказ
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: session.user.id,
          totalAmount,
          shippingAddress,
          shippingCity,
          shippingPhone,
          shippingNotes,
          paymentMethod,
          status: "PENDING",
        }
      })

      // Создаем элементы заказа
      for (const item of items) {
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }
        })
      }

      // Очищаем корзину пользователя
      await tx.cartItem.deleteMany({
        where: {
          cart: { userId: session.user.id }
        }
      })

      return order
    })

    // Начисляем баллы лояльности (асинхронно)
    earnLoyaltyPoints(session.user.id, result.id, totalAmount)
      .then(result => {
        if (result.points > 0) {
          console.log(`Earned ${result.points} loyalty points for user ${session.user.id}`);
        }
      })
      .catch(error => {
        console.error('Failed to earn loyalty points:', error);
      });

    // Отправляем email уведомления (асинхронно, не блокируем ответ)
    Promise.all([
      // Получаем полную информацию о товарах для email
      prisma.orderItem.findMany({
        where: { orderId: result.id },
        include: { product: true }
      }).then(orderItems => {
        const items = orderItems.map((item: any) => ({
          product: { name: item.product.name },
          quantity: item.quantity,
          price: item.price
        }));

        // Отправляем email подтверждение клиенту
        sendEmail(user.email, 'orderConfirmation', [orderNumber, totalAmount, items]);

        // Отправляем уведомление администратору
        const adminContent = `
          <p><strong>Новый заказ:</strong> ${orderNumber}</p>
          <p><strong>Клиент:</strong> ${user.name || 'Не указано'} (${user.email})</p>
          <p><strong>Сумма:</strong> ${totalAmount} BYN</p>
          <p><strong>Телефон:</strong> ${shippingPhone}</p>
          <p><strong>Адрес:</strong> ${shippingAddress}, ${shippingCity}</p>
          <p><strong>Способ оплаты:</strong> ${paymentMethod}</p>
          <h3>Товары:</h3>
          <ul>
            ${items.map((item: any) => `<li>${item.product.name} x ${item.quantity} = ${item.price * item.quantity} BYN</li>`).join('')}
          </ul>
        `;

        sendAdminNotification('Новый заказ', adminContent, result.id);
      })
    ]).catch(emailError => {
      console.error("Failed to send order emails:", emailError)
      // Не возвращаем ошибку, так как заказ уже создан
    });

    return NextResponse.json({
      success: true,
      orderId: result.id,
      orderNumber: result.orderNumber
    })
  } catch (error) {
    console.error("Create order error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
