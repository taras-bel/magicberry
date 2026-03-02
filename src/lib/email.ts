import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

export async function sendOrderConfirmationEmail(orderData: {
  orderNumber: string
  customerEmail: string
  customerName: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  totalAmount: number
  shippingAddress: string
  shippingPhone: string
}) {
  const itemsHtml = orderData.items.map(item =>
    `<tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.price} BYN</td>
    </tr>`
  ).join('')

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Подтверждение заказа ${orderData.orderNumber}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h1 style="color: #2d5a27; margin: 0;">Latvbelfruits</h1>
        <p style="margin: 5px 0 0 0; color: #666;">Натуральные вяленые продукты</p>
      </div>

      <h2>Заказ подтвержден!</h2>

      <div style="background: #fff; border: 1px solid #eee; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h3>Детали заказа</h3>
        <p><strong>Номер заказа:</strong> ${orderData.orderNumber}</p>
        <p><strong>Получатель:</strong> ${orderData.customerName}</p>
        <p><strong>Email:</strong> ${orderData.customerEmail}</p>
        <p><strong>Телефон:</strong> ${orderData.shippingPhone}</p>
        <p><strong>Адрес доставки:</strong> ${orderData.shippingAddress}</p>
      </div>

      <div style="background: #fff; border: 1px solid #eee; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h3>Состав заказа</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f8f9fa;">
              <th style="padding: 10px; text-align: left; border-bottom: 1px solid #eee;">Товар</th>
              <th style="padding: 10px; text-align: center; border-bottom: 1px solid #eee;">Кол-во</th>
              <th style="padding: 10px; text-align: right; border-bottom: 1px solid #eee;">Цена</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr style="background: #f8f9fa; font-weight: bold;">
              <td colspan="2" style="padding: 15px; text-align: right;">Итого:</td>
              <td style="padding: 15px; text-align: right;">${orderData.totalAmount} BYN</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div style="background: #e8f5e8; border: 1px solid #c8e6c9; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h3 style="color: #2e7d32; margin-top: 0;">Что происходит дальше?</h3>
        <ol style="margin: 0; padding-left: 20px;">
          <li>Мы обработаем ваш заказ в течение 1-2 рабочих дней</li>
          <li>Менеджер свяжется с вами для подтверждения деталей</li>
          <li>Вы получите уведомление о готовности к отправке</li>
          <li>Доставка осуществляется в согласованные сроки</li>
        </ol>
      </div>

      <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 20px 0;">
        <p style="margin: 0; color: #856404;">
          <strong>Вопросы?</strong> Свяжитесь с нами по телефону +375 (00) 000-00-00 или email info@latvbelfruits.by
        </p>
      </div>

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
        <p>© 2024 Latvbelfruits. Все права защищены.</p>
        <p>Этот email отправлен автоматически, пожалуйста, не отвечайте на него.</p>
      </div>
    </body>
    </html>
  `

  try {
    await transporter.sendMail({
      from: `"Latvbelfruits" <${process.env.EMAIL_FROM}>`,
      to: orderData.customerEmail,
      subject: `Подтверждение заказа ${orderData.orderNumber}`,
      html,
    })

    console.log(`Order confirmation email sent to ${orderData.customerEmail}`)
  } catch (error) {
    console.error('Failed to send order confirmation email:', error)
    throw error
  }
}

export async function sendOrderNotificationToAdmin(orderData: {
  orderNumber: string
  customerEmail: string
  customerName: string
  shippingPhone: string
  shippingAddress: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  totalAmount: number
  paymentMethod: string
}) {
  const itemsText = orderData.items.map(item =>
    `${item.name} - ${item.quantity} шт. × ${item.price} BYN = ${item.quantity * item.price} BYN`
  ).join('\n')

  const text = `
Новый заказ на сайте Latvbelfruits!

Номер заказа: ${orderData.orderNumber}
Дата: ${new Date().toLocaleString('ru-RU')}

Информация о покупателе:
Имя: ${orderData.customerName}
Email: ${orderData.customerEmail}
Телефон: ${orderData.shippingPhone}
Адрес: ${orderData.shippingAddress}

Способ оплаты: ${orderData.paymentMethod === 'cash' ? 'Наличными' : orderData.paymentMethod === 'card' ? 'Картой' : 'Перевод'}

Состав заказа:
${itemsText}

Итого: ${orderData.totalAmount} BYN

Ссылка на заказ: ${process.env.NEXTAUTH_URL}/dashboard/orders/${orderData.orderNumber}
`

  try {
    await transporter.sendMail({
      from: `"Latvbelfruits" <${process.env.EMAIL_FROM}>`,
      to: 'Latvbelfruits@mail.ru', // Отправляем администратору
      subject: `Новый заказ ${orderData.orderNumber}`,
      text,
    })

    console.log(`Order notification sent to admin`)
  } catch (error) {
    console.error('Failed to send order notification to admin:', error)
    throw error
  }
}

export async function sendNewsletterWelcomeEmail(email: string, name?: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Добро пожаловать в рассылку Latvbelfruits!</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h1 style="color: #2d5a27; margin: 0;">Latvbelfruits</h1>
        <p style="margin: 5px 0 0 0; color: #666;">Натуральные вяленые продукты</p>
      </div>

      <h2>Добро пожаловать в нашу рассылку!</h2>

      <p>Здравствуйте${name ? `, ${name}` : ''}!</p>

      <p>Спасибо за подписку на новости Latvbelfruits! Теперь вы будете первыми узнавать о:</p>

      <ul style="padding-left: 20px;">
        <li>Новых поступлениях натуральных вяленых продуктов</li>
        <li>Акциях и специальных предложениях</li>
        <li>Полезных рецептах с нашими продуктами</li>
        <li>Новостях компании и технологиях производства</li>
      </ul>

      <div style="background: #fff; border: 1px solid #eee; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h3>Попробуйте наши хиты продаж:</h3>
        <ul style="padding-left: 20px;">
          <li><a href="${process.env.NEXTAUTH_URL}/products?category=dried-berries" style="color: #2d5a27;">Вяленая клюква</a></li>
          <li><a href="${process.env.NEXTAUTH_URL}/products?category=syrups" style="color: #2d5a27;">Натуральные сиропы</a></li>
          <li><a href="${process.env.NEXTAUTH_URL}/recipes" style="color: #2d5a27;">Рецепты с нашими продуктами</a></li>
        </ul>
      </div>

      <p>Если вы больше не хотите получать наши письма, вы можете <a href="${process.env.NEXTAUTH_URL}/unsubscribe?email=${encodeURIComponent(email)}" style="color: #dc3545;">отписаться</a> в любое время.</p>

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
        <p>© 2024 Latvbelfruits. Все права защищены.</p>
      </div>
    </body>
    </html>
  `

  try {
    await transporter.sendMail({
      from: `"Latvbelfruits" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Добро пожаловать в рассылку Latvbelfruits!",
      html,
    })

    console.log(`Newsletter welcome email sent to ${email}`)
  } catch (error) {
    console.error('Failed to send newsletter welcome email:', error)
    throw error
  }
}
