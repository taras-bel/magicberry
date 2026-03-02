import nodemailer from 'nodemailer';
import { config, isConfigured } from './config';

// Настройка транспорта
const transporter = isConfigured.email()
  ? nodemailer.createTransport({
      host: config.email.server.host,
      port: config.email.server.port,
      secure: config.email.server.port === 465, // true for 465, false for other ports
      auth: {
        user: config.email.server.user,
        pass: config.email.server.password,
      },
    })
  : null;

// Шаблоны email
export const emailTemplates = {
  welcome: (userName: string) => ({
    subject: 'Добро пожаловать в Latvbelfruits!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #8B5A3C;">Добро пожаловать, ${userName}!</h1>
        <p>Спасибо за регистрацию на нашем сайте. Теперь вы можете:</p>
        <ul>
          <li>Просматривать каталог натуральных продуктов</li>
          <li>Оставлять отзывы о товарах</li>
          <li>Получать персональные скидки</li>
          <li>Отслеживать статус заказов</li>
        </ul>
        <p>Начните с просмотра нашей <a href="${process.env.NEXTAUTH_URL}/products">продукции</a>.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          Если вы не регистрировались на нашем сайте, просто проигнорируйте это письмо.
        </p>
      </div>
    `
  }),

  orderConfirmation: (orderNumber: string, total: number, items: any[]) => ({
    subject: `Заказ №${orderNumber} подтвержден`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #8B5A3C;">Заказ подтвержден!</h1>
        <p>Ваш заказ <strong>№${orderNumber}</strong> успешно оформлен и передан в обработку.</p>

        <h2>Детали заказа:</h2>
        <div style="border: 1px solid #eee; padding: 15px; margin: 10px 0;">
          ${items.map(item => `
            <div style="display: flex; justify-content: space-between; margin: 5px 0;">
              <span>${item.product.name} x ${item.quantity}</span>
              <span>${item.price * item.quantity} BYN</span>
            </div>
          `).join('')}
          <hr style="border: none; border-top: 1px solid #eee; margin: 10px 0;">
          <div style="display: flex; justify-content: space-between; font-weight: bold;">
            <span>Итого:</span>
            <span>${total} BYN</span>
          </div>
        </div>

        <p>Мы свяжемся с вами в ближайшее время для уточнения деталей доставки.</p>
        <p>Отследить статус заказа можно в <a href="${process.env.NEXTAUTH_URL}/dashboard/orders">личном кабинете</a>.</p>
      </div>
    `
  }),

  orderStatusUpdate: (orderNumber: string, newStatus: string) => {
    const statusMessages = {
      CONFIRMED: 'подтвержден и готовится к отправке',
      PROCESSING: 'находится в обработке',
      SHIPPED: 'отправлен',
      DELIVERED: 'доставлен',
      CANCELLED: 'отменен'
    };

    return {
      subject: `Статус заказа №${orderNumber} изменен`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8B5A3C;">Обновление статуса заказа</h1>
          <p>Статус вашего заказа <strong>№${orderNumber}</strong> изменен на: <strong>${newStatus}</strong></p>

          ${newStatus === 'DELIVERED' ? `
            <p>🎉 Спасибо за покупку! Мы надеемся, что наши натуральные продукты вам понравятся.</p>
            <p>Будем рады видеть вас снова. Не забудьте оставить <a href="${process.env.NEXTAUTH_URL}/products">отзыв</a> о товарах.</p>
          ` : newStatus === 'CANCELLED' ? `
            <p>К сожалению, ваш заказ был отменен. Свяжитесь с нами для получения дополнительной информации.</p>
          ` : `
            <p>Отследить статус заказа можно в <a href="${process.env.NEXTAUTH_URL}/dashboard/orders">личном кабинете</a>.</p>
          `}
        </div>
      `
    };
  },

  passwordReset: (resetLink: string) => ({
    subject: 'Восстановление пароля',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #8B5A3C;">Восстановление пароля</h1>
        <p>Вы запросили восстановление пароля для аккаунта на сайте Latvbelfruits.</p>
        <p>Для сброса пароля перейдите по ссылке:</p>
        <a href="${resetLink}" style="display: inline-block; background: #8B5A3C; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 10px 0;">
          Сбросить пароль
        </a>
        <p><small>Ссылка действительна в течение 1 часа.</small></p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          Если вы не запрашивали восстановление пароля, просто проигнорируйте это письмо.
        </p>
      </div>
    `
  }),

  newsletter: (content: string, unsubscribeLink: string) => ({
    subject: 'Новости от Latvbelfruits',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #8B5A3C;">Новости от Latvbelfruits</h1>
        <div style="margin: 20px 0;">
          ${content}
        </div>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          Вы получили это письмо, потому что подписаны на рассылку Latvbelfruits.
          <a href="${unsubscribeLink}">Отписаться от рассылки</a>
        </p>
      </div>
    `
  })
};

// Функция отправки email
export async function sendEmail(
  to: string,
  template: keyof typeof emailTemplates,
  ...params: any[]
) {
  if (!isConfigured.email() || !transporter) {
    console.warn('Email service not configured, skipping email send');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    let subject: string;
    let html: string;

    switch (template) {
      case 'welcome':
        ({ subject, html } = emailTemplates.welcome(params[0]));
        break;
      case 'orderConfirmation':
        ({ subject, html } = emailTemplates.orderConfirmation(params[0], params[1], params[2]));
        break;
      case 'orderStatusUpdate':
        ({ subject, html } = emailTemplates.orderStatusUpdate(params[0], params[1]));
        break;
      case 'passwordReset':
        ({ subject, html } = emailTemplates.passwordReset(params[0]));
        break;
      case 'newsletter':
        ({ subject, html } = emailTemplates.newsletter(params[0], params[1]));
        break;
      default:
        throw new Error(`Unknown email template: ${template}`);
    }

    const mailOptions = {
      from: `"Latvbelfruits" <${config.email.from}>`,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Функция отправки массовой рассылки
export async function sendBulkEmail(
  recipients: string[],
  template: keyof typeof emailTemplates,
  ...params: any[]
) {
  const results = [];

  for (const email of recipients) {
    const result = await sendEmail(email, template, ...params);
    results.push({ email, ...result });

    // Небольшая задержка между отправками
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return results;
}

// Функция отправки уведомления администратору
export async function sendAdminNotification(
  subject: string,
  content: string,
  orderId?: string
) {
  if (!isConfigured.email() || !config.email.adminEmail || !transporter) {
    console.warn('Email service or admin email not configured');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const mailOptions = {
      from: `"Latvbelfruits System" <${config.email.from}>`,
      to: config.email.adminEmail,
      subject: `[Latvbelfruits] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8B5A3C;">${subject}</h2>
          <div style="margin: 20px 0;">
            ${content}
          </div>
          ${orderId ? `<p><strong>Заказ:</strong> <a href="${process.env.NEXTAUTH_URL}/dashboard/orders/${orderId}">№${orderId}</a></p>` : ''}
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            Это автоматическое уведомление системы Latvbelfruits.
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Admin notification sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Admin notification error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
