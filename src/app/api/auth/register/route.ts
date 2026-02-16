import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email-service"

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, company, password } = await request.json()

    // Проверяем, существует ли пользователь
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "Пользователь с таким email уже существует" },
        { status: 400 }
      )
    }

    // Создаем пользователя
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        company,
        password, // уже захеширован на клиенте
      }
    })

    // Отправляем приветственное письмо (асинхронно, не блокируем ответ)
    sendEmail(user.email, 'welcome', [user.name || 'Пользователь']).catch(error => {
      console.error('Failed to send welcome email:', error)
    })

    return NextResponse.json(
      { message: "Пользователь успешно зарегистрирован", userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { message: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}
