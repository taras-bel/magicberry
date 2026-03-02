import { recipes as mockRecipes } from "@/data/recipes";
import RecipeCard from "@/components/RecipeCard";
import TagFilterWrapper from "@/components/TagFilterWrapper";
import { getCmsRecipes } from "@/lib/cms";
import { recipeSearchService } from "@/lib/recipe-search-service";
import { createSlug } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Рецепты с вялеными ягодами",
  description: "Вкусные рецепты с натуральными вялеными ягодами и фруктами. Простые идеи для выпечки, десертов и напитков.",
};

type Props = { searchParams: { tag?: string } };

const recipeCategories = [
  {
    name: "Выпечка",
    description: "Пироги, печенье и торты с вялеными ягодами",
    icon: "🥧",
    tag: "выпечка",
    color: "bg-orange-100 text-orange-800"
  },
  {
    name: "Десерты",
    description: "Муссы, желе и другие сладкие блюда",
    icon: "🍰",
    tag: "десерты",
    color: "bg-pink-100 text-pink-800"
  },
  {
    name: "Напитки",
    description: "Компот, морс и коктейли",
    icon: "🧊",
    tag: "напитки",
    color: "bg-blue-100 text-blue-800"
  },
  {
    name: "Завтраки",
    description: "Каши, йогурты и полезные завтраки",
    icon: "🥣",
    tag: "завтраки",
    color: "bg-green-100 text-green-800"
  },
  {
    name: "Зимние блюда",
    description: "Рецепты для холодного времени года",
    icon: "❄️",
    tag: "зима",
    color: "bg-cyan-100 text-cyan-800"
  },
  {
    name: "Быстрые рецепты",
    description: "Простые идеи за 15-30 минут",
    icon: "⚡",
    tag: "быстро",
    color: "bg-yellow-100 text-yellow-800"
  }
];

const featuredRecipes = [
  {
    title: "Клюквенный пирог с корицей",
    description: "Нежный пирог с ароматом корицы и кисло-сладкой клюквой",
    time: "1 час",
    difficulty: "Средне",
    image: "/images/products/cranberry-1200.webp",
    tag: "выпечка"
  },
  {
    title: "Морс из вяленой брусники",
    description: "Классический рецепт витаминного напитка",
    time: "30 мин",
    difficulty: "Легко",
    image: "/images/products/fruit-mix-1200.webp",
    tag: "напитки"
  },
  {
    title: "Овсянка с вяленой клюквой",
    description: "Полезный завтрак с антиоксидантами",
    time: "15 мин",
    difficulty: "Легко",
    image: "/images/products/cranberry-heap-1200.webp",
    tag: "завтраки"
  }
];

export default async function RecipesPage({ searchParams }: Props) {
  const cms = await getCmsRecipes();
  let recipes = cms.length
    ? cms.map((r) => ({
        slug: r.slug,
        title: r.title,
        time: r.time || "",
        steps: r.steps || [],
        tags: r.tags || [],
        ingredients: [], // CMS рецепты пока без ингредиентов
      }))
    : mockRecipes;

  // Генерируем новые рецепты с продуктами сайта
  try {
    console.log('🔍 Запуск генерации рецептов...');
    const generatedRecipes = await recipeSearchService.searchRecipes({
      query: 'рецепты с вялеными ягодами',
      maxResults: 8,
      focusOnSiteProducts: true
    });

    console.log(`📋 Получено рецептов: ${generatedRecipes.length}`);
    const generatedOnly = generatedRecipes.filter(recipe => recipe.generated);
    console.log(`✨ AI-сгенерированных рецептов: ${generatedOnly.length}`);

    // Преобразуем сгенерированные рецепты в формат, совместимый с RecipeCard
    const formattedGeneratedRecipes = generatedOnly.map((recipe) => ({
      slug: `generated-${createSlug(recipe.title)}`,
      title: recipe.title,
      time: recipe.prepTime ? `${recipe.prepTime} мин` : "30 мин",
      steps: recipe.instructions || [],
      tags: recipe.tags || [],
      ingredients: recipe.ingredients.map(ing => ({
        name: ing,
        amount: '',
        required: true
      })),
      generated: true,
      siteProductsUsed: recipe.siteProductsUsed
    }));

    console.log(`✅ Оформлено рецептов: ${formattedGeneratedRecipes.length}`);
    
    // Фильтруем старые рецепты, начинающиеся с 'generated-' (старые AI-рецепты)
    const existingRecipes = recipes.filter(r => !r.slug?.startsWith('generated-'));
    
    // Добавляем новые сгенерированные рецепты
    recipes = [...existingRecipes, ...formattedGeneratedRecipes];
    console.log(`🎉 Всего рецептов после генерации: ${recipes.length}`);
  } catch (error) {
    console.error('❌ Ошибка генерации рецептов:', error);
  }

  const tag = searchParams.tag;
  const list = tag ? recipes.filter((r) => (r.tags || []).includes(tag)) : recipes;
  const allTags = Array.from(new Set(recipes.flatMap((r) => r.tags || [])));

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-white via-gray-50 to-white py-20 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-1 h-10 bg-gradient-to-b from-accent to-accent-gold rounded-full"></div>
                <h1 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight">
                  Вкусные рецепты с нашими ягодами
                </h1>
              </div>
              <p className="text-xl text-gray-600 font-normal leading-relaxed mb-8">
                Простые и вкусные рецепты с натуральными вялеными ягодами и фруктами.
                От классических пирогов до современных десертов — все для вашего вдохновения.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#categories" className="btn btn-primary">
                  Смотреть категории
                </a>
                <Link href="#recipes" className="btn btn-secondary">
                  Все рецепты
                </Link>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/products/fruit-mix-1200.webp"
                alt="Рецепты с вялеными ягодами"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="py-20 border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-3 mb-5 justify-center">
              <div className="w-1 h-10 bg-gradient-to-b from-accent to-accent-gold rounded-full"></div>
              <h2 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight">
                Популярные рецепты
              </h2>
            </div>
            <p className="text-lg text-gray-600 font-normal leading-relaxed">
              Любимые рецепты наших клиентов
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {featuredRecipes.map((recipe, index) => (
              <div key={index} className="card-premium overflow-hidden group">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={recipe.image}
                    alt={recipe.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 border border-gray-200">
                      {recipe.difficulty}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1.5 bg-accent text-white rounded-full text-sm font-semibold shadow-sm">
                      {recipe.time}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-accent transition-colors">
                    {recipe.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 font-normal">{recipe.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${recipe.tag === 'выпечка' ? 'bg-orange-50 text-orange-700 border-orange-200' : recipe.tag === 'напитки' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                      {recipe.tag}
                    </span>
                    <button className="text-accent hover:text-accent-dark font-semibold text-sm transition-colors">
                      Посмотреть рецепт →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-20 border-t border-gray-200 bg-gradient-to-b from-gray-50/30 to-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-3 mb-5 justify-center">
              <div className="w-1 h-10 bg-gradient-to-b from-accent to-accent-gold rounded-full"></div>
              <h2 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight">
                Категории рецептов
              </h2>
            </div>
            <p className="text-lg text-gray-600 font-normal leading-relaxed">
              Выберите категорию по вашему вкусу
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recipeCategories.map((category, index) => (
              <Link
                key={index}
                href={`/recipes?tag=${category.tag}`}
                className="card-premium p-6 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">{category.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-accent transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 text-sm font-normal">{category.description}</p>
                  </div>
                </div>
                <div className="text-right pt-4 border-t border-gray-200">
                  <span className="text-accent group-hover:text-accent-dark font-semibold transition-colors">
                    Смотреть рецепты →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Recipes Section */}
      <section id="recipes" className="py-20 border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-1 h-10 bg-gradient-to-b from-accent to-accent-gold rounded-full"></div>
                <h2 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight">
                  {tag ? `Рецепты: ${tag}` : "Все рецепты"}
                </h2>
              </div>
              <p className="text-lg text-gray-600 font-normal leading-relaxed">
                {tag
                  ? `Найдено ${list.length} ${list.length === 1 ? "рецепт" : list.length < 5 ? "рецепта" : "рецептов"}`
                  : "Простые идеи с нашими вялеными ягодами и сиропами"
                }
              </p>
            </div>

            <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
              <TagFilterWrapper tags={allTags} />
            </div>
          </div>

          {list.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {list.map((r) => (
                <RecipeCard key={r.slug} recipe={r} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-[color:var(--foreground)] mb-2">
                Рецепты не найдены
              </h3>
              <p className="text-[color:var(--secondary-foreground)] mb-6">
                В выбранной категории пока нет рецептов
              </p>
              <Link href="/recipes" className="btn btn-primary">
                Смотреть все рецепты
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-20 border-t border-gray-200 bg-gradient-to-b from-gray-50/30 to-white">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <div className="inline-flex items-center gap-3 mb-5 justify-center">
            <div className="w-1 h-10 bg-gradient-to-b from-accent to-accent-gold rounded-full"></div>
            <h2 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight">
              Советы по приготовлению
            </h2>
          </div>
          <p className="text-lg text-gray-600 mb-12 font-normal leading-relaxed">
            Несколько простых советов для вкусных блюд с вялеными ягодами
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 text-left">
            <div className="card-premium p-6">
              <div className="text-3xl mb-4">💧</div>
              <h3 className="font-semibold text-gray-900 mb-2">Замачивание</h3>
              <p className="text-gray-600 text-sm font-normal">
                Замочите ягоды в теплой воде на 15-30 минут для восстановления мягкости
              </p>
            </div>

            <div className="card-premium p-6">
              <div className="text-3xl mb-4">⏱️</div>
              <h3 className="font-semibold text-gray-900 mb-2">Время приготовления</h3>
              <p className="text-gray-600 text-sm font-normal">
                Добавляйте ягоды в конце приготовления, чтобы сохранить максимум пользы
              </p>
            </div>

            <div className="card-premium p-6">
              <div className="text-3xl mb-4">⚖️</div>
              <h3 className="font-semibold text-gray-900 mb-2">Количество</h3>
              <p className="text-gray-600 text-sm font-normal">
                Начните с 50-100г на порцию — вкус ягод очень насыщенный
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-gray-200 bg-gradient-to-br from-accent via-accent-dark to-accent-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10"></div>
        <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-semibold text-white mb-6 tracking-tight">
            Присоединяйтесь к сообществу
          </h2>
          <p className="text-white/90 mb-10 text-xl font-normal leading-relaxed">
            Делитесь своими рецептами с вялеными ягодами Latvbelfruits
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="btn btn-secondary bg-white text-accent hover:bg-gray-50">
              Купить продукты
            </Link>
            <Link href="/contacts" className="btn bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/20">
              Предложить рецепт
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


