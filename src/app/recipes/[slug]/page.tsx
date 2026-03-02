"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { Clock, Users, ChefHat, CheckCircle, ShoppingCart, ArrowLeft } from "lucide-react";
import { recipes, Recipe } from "@/data/recipes";
import { products } from "@/data/products";
import { recipeAssistant } from "@/lib/recipe-assistant";
import ProductRecommendations from "@/components/ProductRecommendations";
import { useTranslations } from "@/lib/i18n";
import { recipeSearchService } from "@/lib/recipe-search-service";
import { createSlug } from "@/lib/utils";

// Убираем generateStaticParams для поддержки динамических AI-сгенерированных рецептов

type Props = { params: { slug: string } };

export default function RecipePage({ params }: Props) {
  const t = useTranslations();

  // Клиентская загрузка данных
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        let foundRecipe = recipes.find((r) => r.slug === params.slug);

        // Если рецепт не найден среди статических, попробуем найти сгенерированный
        if (!foundRecipe && params.slug.startsWith('generated-')) {
          try {
            const generatedRecipes = await recipeSearchService.searchRecipes({
              query: 'рецепты с вялеными ягодами',
              maxResults: 20,
              focusOnSiteProducts: true
            });

            // Ищем рецепт по slug (удаляем префикс 'generated-' и сравниваем с slug из названия)
            const slugWithoutPrefix = params.slug.replace('generated-', '');
            const generatedRecipe = generatedRecipes
              .filter(r => r.generated)
              .find(r => createSlug(r.title) === slugWithoutPrefix);

            if (generatedRecipe) {
              // Преобразуем сгенерированный рецепт в формат Recipe
              foundRecipe = {
                slug: params.slug,
                title: generatedRecipe.title,
                time: generatedRecipe.prepTime ? `${generatedRecipe.prepTime} мин` : "30 мин",
                steps: generatedRecipe.instructions || [],
                tags: generatedRecipe.tags || [],
                ingredients: generatedRecipe.ingredients.map(ing => ({
                  name: ing,
                  amount: '',
                  required: true
                })),
                servings: generatedRecipe.servings || 4,
                difficulty: generatedRecipe.difficulty,
                generated: true,
                siteProductsUsed: generatedRecipe.siteProductsUsed
              };
            }
          } catch (error) {
            console.error('Error loading generated recipe:', error);
          }
        }

        if (!foundRecipe) {
          notFound();
          return;
        }

        setRecipe(foundRecipe);
      } catch (error) {
        console.error('Error loading recipe:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка рецепта...</p>
        </div>
      </div>
    );
  }

  // Получаем рекомендуемые продукты для покупки недостающих ингредиентов
  const match = recipe ? recipeAssistant.findMatchingRecipes({ productSlugs: [], customIngredients: [] })
    .find(m => m.recipe.slug === recipe.slug) : null;

  const recommendedProducts = match?.recommendedProducts || [];

  const getDifficultyText = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy': return t('assistant.difficulty_easy');
      case 'medium': return t('assistant.difficulty_medium');
      case 'hard': return t('assistant.difficulty_hard');
      default: return '';
    }
  };

  // Создаем расширенный JSON-LD с ингредиентами
  const jsonLd = recipe ? {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    description: recipe.ingredients?.map(ing => ing.name).join(", "),
    totalTime: recipe.time,
    recipeYield: recipe.servings,
    difficulty: recipe.difficulty,
    recipeIngredient: recipe.ingredients?.map(ing => `${ing.amount || ''} ${ing.name}`.trim()) || [],
    recipeInstructions: recipe.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      text: s
    })),
    keywords: recipe.tags?.join(", "),
  } : null;

  if (!recipe) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {jsonLd && (
        <Script
          id="recipe-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      )}

      {/* Навигация */}
      <div className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/recipes"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад к рецептам
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Заголовок и основная информация */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{recipe.title}</h1>
            {/* Индикатор AI-сгенерированного рецепта */}
            {recipe.generated && (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                  <ChefHat className="w-4 h-4" />
                  AI рецепт
                </span>
                {recipe.siteProductsUsed && recipe.siteProductsUsed.length > 0 && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 rounded-full text-sm font-medium border border-orange-200">
                    <CheckCircle className="w-4 h-4" />
                    Latvbelfruits
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {recipe.time}
            </div>

            {recipe.servings && (
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {recipe.servings} порций
              </div>
            )}

            {recipe.difficulty && (
              <div className="flex items-center gap-1">
                <ChefHat className="w-4 h-4" />
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  recipe.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  recipe.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {recipe.difficulty === 'easy' ? 'Легко' :
                   recipe.difficulty === 'medium' ? 'Средне' : 'Сложно'}
                </span>
              </div>
            )}
          </div>

          {recipe.tags && recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {recipe.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Основной контент */}
          <div className="lg:col-span-2 space-y-8">
            {/* Ингредиенты */}
            {recipe.ingredients && recipe.ingredients.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Ингредиенты</h2>
                <div className="space-y-3">
                  {recipe.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {ingredient.productSlug && (
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        )}
                        <span className={`text-gray-900 ${ingredient.productSlug ? 'font-medium' : ''}`}>
                          {ingredient.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {ingredient.amount && (
                          <span className="text-gray-600 text-sm">{ingredient.amount}</span>
                        )}
                        {ingredient.productSlug && (
                          <Link
                            href={`/products/${ingredient.productSlug}`}
                            className="text-accent hover:text-accent-dark text-sm font-medium"
                          >
                            Купить
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Шаги приготовления */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Приготовление</h2>
              <div className="space-y-4">
                {recipe.steps.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center text-sm font-semibold shadow-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-gray-700 leading-relaxed">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Боковая панель */}
          <div className="space-y-6">
            {/* Рекомендуемые продукты */}
            {recommendedProducts.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Нужно докупить:</h3>
                <div className="space-y-2">
                  {recommendedProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-white transition-colors"
                    >
                      {product.image && (
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="rounded object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          от {product.priceFrom} BYN
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Советы */}
            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Полезные советы:</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Замочите ягоды в теплой воде на 15-30 минут</li>
                <li>• Добавляйте ягоды в конце приготовления</li>
                <li>• Начните с 50-100г на порцию</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Похожие рецепты */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <ProductRecommendations
            title="Похожие рецепты"
            type="trending"
            limit={3}
          />
        </div>
      </div>
    </div>
  );
}


