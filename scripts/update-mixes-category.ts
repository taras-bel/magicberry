import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Обновление категории "Смеси" на "Разнообразие Миксов"...')

  await prisma.category.update({
    where: { slug: 'mixes' },
    data: {
      name: 'Разнообразие Миксов'
    }
  })

  console.log('✅ Категория обновлена!')
}

main()
  .catch((e) => {
    console.error('❌ Ошибка:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

