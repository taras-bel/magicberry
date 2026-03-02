# Конфигурация Latvbelfruits

## Обзор

Этот файл содержит инструкции по настройке всех внешних сервисов и API ключей для проекта Latvbelfruits.

## Настройка переменных окружения

Создайте файл `.env.local` в корне проекта `latvbelfruits-site/` и заполните следующие переменные:

### Базовая настройка

```env
# NextAuth.js - обязательно для аутентификации
NEXTAUTH_SECRET=ваш-секретный-ключ-для-nextauth
NEXTAUTH_URL=http://localhost:3000

# База данных - обязательно
DATABASE_URL=file:./dev.db
```

### Социальная аутентификация (опционально)

#### Google OAuth
1. Перейдите на [Google Cloud Console](https://console.cloud.google.com/)
2. Создайте новый проект или выберите существующий
3. Включите Google+ API
4. Создайте учетные данные OAuth 2.0
5. Добавьте в `.env.local`:
```env
GOOGLE_CLIENT_ID=ваш-google-client-id
GOOGLE_CLIENT_SECRET=ваш-google-client-secret
```

#### Facebook OAuth
1. Перейдите на [Facebook Developers](https://developers.facebook.com/)
2. Создайте новое приложение
3. Настройте Facebook Login
4. Добавьте в `.env.local`:
```env
FACEBOOK_CLIENT_ID=ваш-facebook-client-id
FACEBOOK_CLIENT_SECRET=ваш-facebook-client-secret
```

#### GitHub OAuth
1. Перейдите в [GitHub Developer Settings](https://github.com/settings/developers)
2. Создайте новое OAuth App
3. Добавьте в `.env.local`:
```env
GITHUB_CLIENT_ID=ваш-github-client-id
GITHUB_CLIENT_SECRET=ваш-github-client-secret
```

### Email сервис (опционально)

Для отправки email уведомлений настройте SMTP:

```env
EMAIL_FROM=noreply@latvbelfruits.com
ADMIN_EMAIL=admin@latvbelfruits.com
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=ваш-email@gmail.com
EMAIL_SERVER_PASSWORD=ваш-app-password
```

### Аналитика (опционально)

#### Google Analytics 4
1. Перейдите в [Google Analytics](https://analytics.google.com/)
2. Создайте новый аккаунт GA4
3. Получите Tracking ID
4. Добавьте в `.env.local`:
```env
GA4_TRACKING_ID=GA-XXXXXXXXXX
```

### Поиск рецептов (опционально)

#### Spoonacular API
1. Зарегистрируйтесь на [Spoonacular](https://spoonacular.com/food-api)
2. Получите бесплатный API ключ
3. Добавьте в `.env.local`:
```env
SPOONACULAR_API_KEY=ваш-spoonacular-api-key
```

#### Google Custom Search API
1. В [Google Cloud Console](https://console.cloud.google.com/) включите Custom Search API
2. Создайте API ключ
3. Создайте [Custom Search Engine](https://cse.google.com/)
4. Добавьте в `.env.local`:
```env
GOOGLE_SEARCH_API_KEY=ваш-google-search-api-key
GOOGLE_SEARCH_ENGINE_ID=ваш-custom-search-engine-id
```

#### OpenAI API (опционально)
1. Зарегистрируйтесь на [OpenAI](https://platform.openai.com/)
2. Получите API ключ
3. Добавьте в `.env.local`:
```env
OPENAI_API_KEY=ваш-openai-api-key
```

### CMS (опционально)

Если используете Strapi:

```env
NEXT_PUBLIC_CMS_URL=http://localhost:1337
```

## Проверка конфигурации

После заполнения переменных окружения, при запуске сервера вы увидите в консоли статус всех сервисов:

```
🔧 Конфигурация сервисов:
✅ Google OAuth настроен
⚠️  Facebook OAuth не настроен - социальная аутентификация через Facebook недоступна
✅ Email сервис настроен
⚠️  Spoonacular API не настроен - поиск рецептов в интернете ограничен
✅ Google Analytics настроен
```

## Важные замечания

- **Обязательные** переменные: `NEXTAUTH_SECRET`, `DATABASE_URL`
- **Рекомендуемые**: Email сервис для уведомлений пользователей
- **Опциональные**: Все остальные сервисы работают в fallback режиме
- API ключи для рецептов нужны только если хотите расширенный поиск в интернете
- Локальная генерация рецептов работает без внешних API

## Безопасность

- Никогда не коммитите `.env.local` в Git
- Используйте сильные пароли для API ключей
- Регулярно обновляйте ключи безопасности
