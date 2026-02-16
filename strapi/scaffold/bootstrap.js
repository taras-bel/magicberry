// Выполняется при старте develop/build. Добавляет тестовые записи, если коллекции пустые.

module.exports = async ({ strapi }) => {
  const ensure = async (uid, data) => {
    const count = await strapi.entityService.count(uid);
    if (count > 0) return;
    for (const item of data) {
      await strapi.entityService.create(uid, { data: item });
    }
  };

  await ensure("api::product.product", [
    { name: "Вяленая клюква", shortDescription: "Яркая ягода", category: "packaged", priceFrom: 6.5, unit: "г", tags: ["ягоды"] },
    { name: "Вяленая вишня", shortDescription: "Насыщенный вкус", category: "weight", priceFrom: 18, unit: "кг", tags: ["ягоды"] }
  ]);

  await ensure("api::post.post", [
    { title: "Как мы вялим ягоды", excerpt: "Бережная технология", date: "2025-01-12", tags: ["технология"] },
    { title: "Сиропы для напитков", excerpt: "HoReCa", date: "2025-02-03", tags: ["напитки"] }
  ]);

  await ensure("api::recipe.recipe", [
    { title: "Маффины с клюквой", time: "35 мин", steps: ["Разогрейте духовку", "Смешайте тесто", "Добавьте клюкву"] , tags: ["выпечка"]},
    { title: "Лимонад с сиропом", time: "10 мин", steps: ["Вода со льдом", "Добавьте сироп", "Перемешайте"], tags: ["напитки"] }
  ]);

  await ensure("api::document.document", [
    { title: "Свидетельство соответствия" },
    { title: "Технические условия (ТУ)" }
  ]);

  await ensure("api::store.store", [
    { title: "Минск, магазин пример", lat: 53.9022, lng: 27.5619, address: "Минск" },
    { title: "Пинск, точка продаж", lat: 52.121, lng: 26.0951, address: "Пинск" }
  ]);
};


