// Скрипт для удаления старых сгенерированных рецептов из базы данных
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Очистка старых сгенерированных рецептов...');

  try {
    // Находим все рецепты, которые начинаются с 'generated-' или содержат теги с 'AI' или 'локальная модель'
    const allRecipes = await prisma.recipe.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        tags: true,
      }
    });

    console.log(`📋 Найдено рецептов в базе: ${allRecipes.length}`);

    const recipesToDelete = allRecipes.filter(recipe => {
      const slugMatch = recipe.slug?.startsWith('generated-') || false;
      let tagsMatch = false;
      if (recipe.tags) {
        try {
          const tags = typeof recipe.tags === 'string' ? JSON.parse(recipe.tags) : recipe.tags;
          const tagsArray = Array.isArray(tags) ? tags : [];
          tagsMatch = tagsArray.some(tag => 
            typeof tag === 'string' && (
              tag.includes('AI') || 
              tag.includes('локальная модель') || 
              tag.includes('AI рецепт')
            )
          );
        } catch (e) {
          // Если не JSON, проверяем как строку
          const tagsStr = String(recipe.tags);
          tagsMatch = tagsStr.includes('AI') || tagsStr.includes('локальная модель');
        }
      }
      return slugMatch || tagsMatch;
    });

    console.log(`🗑️  Найдено сгенерированных рецептов для удаления: ${recipesToDelete.length}`);

    if (recipesToDelete.length > 0) {
      for (const recipe of recipesToDelete) {
        console.log(`  - Удаление: ${recipe.title} (${recipe.slug})`);
        await prisma.recipe.delete({
          where: { id: recipe.id }
        });
      }
      console.log(`✅ Удалено ${recipesToDelete.length} сгенерированных рецептов`);
    } else {
      console.log('✨ Сгенерированных рецептов не найдено');
    }

    console.log('🎉 Очистка завершена!');

  } catch (error) {
    console.error('❌ Ошибка при очистке рецептов:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();

