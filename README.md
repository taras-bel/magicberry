Проект корпоративного сайта Magic berry на базе Next.js 14 (App Router) и Tailwind CSS.

## Запуск (Windows / PowerShell)

1. Установите зависимости:

```bash
npm install
```

2. Запустите dev-сервер:

```bash
npm run dev
```

Откройте `http://localhost:3000`.

## Структура

- Основные страницы: `/`, `/about`, `/products`, `/products/[slug]`, `/b2b`, `/gifts`, `/docs`, `/stores`, `/contacts`.
- Дополнительно: `/recipes`, `/reviews`, `/process`.
- API формы: `/api/contact`, `/api/gift-request`, `/api/subscribe`.

## Примечания

- Карта в разделе «Где купить» пока заглушка (интеграция Leaflet будет добавлена отдельно).
- Данные каталога — мок (файлы `src/types` и `src/data`), готовы к подключению Headless CMS (например, Strapi).

## Сборка и прод

```bash
npm run build
npm run start
```
