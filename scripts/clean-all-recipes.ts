// Скрипт для удаления всех рецептов из базы данных
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Очистка всех рецептов из базы данных...');

  try {
    // Удаляем все рецепты
    const result = await prisma.recipe.deleteMany({});
    console.log(`✅ Удалено рецептов: ${result.count}`);
    console.log('🎉 Очистка завершена!');

  } catch (error) {
    console.error('❌ Ошибка при очистке рецептов:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();

