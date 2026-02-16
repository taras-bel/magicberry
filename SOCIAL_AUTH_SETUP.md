# Настройка социальной аутентификации

## Переменные окружения

Добавьте следующие переменные в файл `.env.local`:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Facebook OAuth
FACEBOOK_CLIENT_ID=your_facebook_app_id
FACEBOOK_CLIENT_SECRET=your_facebook_app_secret

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# NextAuth Secret (генерируйте случайную строку)
NEXTAUTH_SECRET=your_random_secret_string
NEXTAUTH_URL=http://localhost:3000
```

## Настройка Google OAuth

1. Перейдите на [Google Cloud Console](https://console.cloud.google.com/)
2. Создайте новый проект или выберите существующий
3. Включите Google+ API
4. Создайте OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

## Настройка Facebook OAuth

1. Перейдите на [Facebook Developers](https://developers.facebook.com/)
2. Создайте новое приложение
3. Добавьте продукт "Facebook Login"
4. В настройках Facebook Login добавьте:
   - Valid OAuth Redirect URIs: `http://localhost:3000/api/auth/callback/facebook`
5. Получите App ID и App Secret

## Настройка GitHub OAuth

1. Перейдите в Settings → Developer settings → OAuth Apps на GitHub
2. Создайте новое OAuth App:
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
3. Получите Client ID и Client Secret

## Генерация NEXTAUTH_SECRET

```bash
# Сгенерируйте случайную строку
openssl rand -base64 32
# или используйте онлайн генератор
```

## Тестирование

После настройки всех переменных окружения и OAuth приложений, перезапустите сервер разработки:

```bash
npm run dev
```

Перейдите на страницу авторизации `/auth/signin` - там должны появиться кнопки для входа через социальные сети.
