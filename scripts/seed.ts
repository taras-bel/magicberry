import { PrismaClient } from '@prisma/client'
import { products } from '../src/data/products'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Создать категории
  const categories = [
    { name: 'Вяленые ягоды', slug: 'dried-berries' },
    { name: 'Вяленые фрукты', slug: 'dried-fruits' },
    { name: 'Вяленые овощи', slug: 'dried-vegetables' },
    { name: 'Сиропы', slug: 'syrups' },
    { name: 'Разнообразие Миксов', slug: 'mixes' }
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category
    })
  }

  console.log('✅ Categories created')

  // Создать продукты
  for (const product of products) {
    // Определить категорию
    let categorySlug = 'dried-berries'
    if (product.name.toLowerCase().includes('сироп')) {
      categorySlug = 'syrups'
    } else if (product.name.toLowerCase().includes('смесь') || product.name.toLowerCase().includes('микс')) {
      categorySlug = 'mixes'
    } else if (product.name.toLowerCase().includes('фрукт')) {
      categorySlug = 'dried-fruits'
    } else if (product.name.toLowerCase().includes('овощ')) {
      categorySlug = 'dried-vegetables'
    }

    const category = await prisma.category.findUnique({
      where: { slug: categorySlug }
    })

    if (!category) continue

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        shortDescription: product.shortDescription,
        price: product.priceFrom || null,
        unit: product.unit || 'кг',
        image: product.image,
        placeholder: product.placeholder,
        categoryId: category.id,
        tags: JSON.stringify(product.tags || [])
      }
    })
  }

  console.log('✅ Products created')

  // Создать тестового пользователя
  const hashedPassword = await bcrypt.hash('password123', 12)

  await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Тестовый Пользователь',
      password: hashedPassword,
      phone: '+375 (00) 000-00-00',
      company: 'Тестовая Компания'
    }
  })

  console.log('✅ Test user created')
  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
