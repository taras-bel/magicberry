import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Список всех продуктов
const productsList = [
  // Ягоды
  { name: 'Клюква', category: 'dried-berries', unit: 'г', price: 6.5 },
  { name: 'Вишня', category: 'dried-berries', unit: 'кг', price: 18 },
  { name: 'Крыжовник', category: 'dried-berries', unit: 'г', price: 7.5 },
  { name: 'Черная смородина', category: 'dried-berries', unit: 'г', price: 8.0 },
  { name: 'Черноплодная рябина', category: 'dried-berries', unit: 'г', price: 7.0 },
  { name: 'Калина', category: 'dried-berries', unit: 'г', price: 7.5 },
  { name: 'Облепиха', category: 'dried-berries', unit: 'г', price: 9.0 },
  { name: 'Брусника', category: 'dried-berries', unit: 'г', price: 8.5 },
  { name: 'Голубика', category: 'dried-berries', unit: 'г', price: 10.0 },
  { name: 'Малина', category: 'dried-berries', unit: 'г', price: 9.5 },
  { name: 'Ежевика', category: 'dried-berries', unit: 'г', price: 9.5 },
  
  // Фрукты
  { name: 'Айва', category: 'dried-fruits', unit: 'кг', price: 15 },
  { name: 'Слива', category: 'dried-fruits', unit: 'кг', price: 16 },
  { name: 'Яблоко', category: 'dried-fruits', unit: 'кг', price: 12 },
  
  // Овощи
  { name: 'Тыква в клюквенном соке', category: 'dried-vegetables', unit: 'г', price: 5.9 },
  { name: 'Морковь', category: 'dried-vegetables', unit: 'кг', price: 10 },
  { name: 'Кабачок', category: 'dried-vegetables', unit: 'кг', price: 11 },
  { name: 'Патиссон', category: 'dried-vegetables', unit: 'кг', price: 11 },
  { name: 'Ревень', category: 'dried-vegetables', unit: 'кг', price: 13 },
  { name: 'Свекла', category: 'dried-vegetables', unit: 'кг', price: 9 },
]

// Функция для создания slug из названия
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[а-яё]/g, (char) => {
      const map: { [key: string]: string } = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
        'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
      }
      return map[char] || char
    })
    .replace(/[^a-z0-9-]/g, '')
}

async function main() {
  console.log('🌱 Добавление продуктов в базу данных...')

  // Получить все категории
  const categories = await prisma.category.findMany()
  const categoryMap = new Map(categories.map(c => [c.slug, c.id]))

  let added = 0
  let updated = 0

  for (const productData of productsList) {
    const categoryId = categoryMap.get(productData.category)
    
    if (!categoryId) {
      console.warn(`⚠️  Категория ${productData.category} не найдена для продукта ${productData.name}`)
      continue
    }

    const slug = `vialenaya-${createSlug(productData.name)}`
    
    // Определить описание в зависимости от категории
    let shortDescription = ''
    if (productData.category === 'dried-berries') {
      shortDescription = `Натуральная вяленая ягода ${productData.name.toLowerCase()}, без консервантов`
    } else if (productData.category === 'dried-fruits') {
      shortDescription = `Вяленый фрукт ${productData.name.toLowerCase()}, сохраняет все полезные свойства`
    } else if (productData.category === 'dried-vegetables') {
      shortDescription = `Вяленый овощ ${productData.name.toLowerCase()}, идеален для здорового питания`
    }

    const result = await prisma.product.upsert({
      where: { slug },
      update: {
        name: productData.name,
        price: productData.price,
        unit: productData.unit,
        shortDescription,
        categoryId,
        isActive: true,
      },
      create: {
        name: productData.name,
        slug,
        shortDescription,
        price: productData.price,
        unit: productData.unit,
        categoryId,
        isActive: true,
        tags: JSON.stringify([productData.category === 'dried-berries' ? 'ягоды' : productData.category === 'dried-fruits' ? 'фрукты' : 'овощи']),
      }
    })

    if (result) {
      added++
      console.log(`✅ ${productData.name} - добавлен/обновлен`)
    }
  }

  console.log(`\n🎉 Готово! Добавлено/обновлено продуктов: ${added}`)
}

main()
  .catch((e) => {
    console.error('❌ Ошибка:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

