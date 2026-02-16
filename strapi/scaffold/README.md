Готовый каркас для Strapi v4 (коллекции, схемы и сиды). Как развернуть:

1) Создайте Strapi-проект (SQLite, быстро):
   npx create-strapi-app@latest cms --quickstart

2) Скопируйте содержимое папки scaffold в корень проекта Strapi:
   - из strapi/scaffold/api/* в cms/src/api/*
   - файл strapi/scaffold/bootstrap.js в cms/src/bootstrap.js (перезаписать если файла нет)

Итоговая структура:
cms/
  src/
    api/
      product/content-types/product/schema.json
      post/content-types/post/schema.json
      recipe/content-types/recipe/schema.json
      document/content-types/document/schema.json
      store/content-types/store/schema.json
    bootstrap.js

3) Запустите Strapi:
   cd cms
   npm run develop
   (создайте администратора при первом запуске)

4) Разрешите публичный доступ (если без токена):
   Settings → Users & Permissions → Roles → Public
   Включите find / findOne для collections: products, posts, recipes, documents, stores.
   Либо создайте API Token (Settings → API Tokens) и используйте его в NEXT_PUBLIC_CMS_URL / CMS_API_TOKEN.

5) Сидинг (по желанию):
   При первом старте bootstrap.js создаст по нескольку тестовых записей в каждой коллекции, если они пусты.
   Если записи уже есть — сид не выполнится.

После этого фронт (Next.js) начнёт брать данные из Strapi (переменные окружения указаны ранее).


