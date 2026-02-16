// Виртуальный помощник для выбора рецептов

import { recipes, Recipe, RecipeIngredient } from '@/data/recipes';
import { products } from '@/data/products';

// Типы для виртуального помощника
export interface UserAvailableProducts {
  productSlugs: string[]; // доступные продукты пользователя
  customIngredients: string[]; // пользовательские ингредиенты (не из каталога)
}

export interface RecipeMatch {
  recipe: Recipe;
  matchScore: number; // процент совпадения ингредиентов
  availableIngredients: RecipeIngredient[]; // доступные ингредиенты
  missingIngredients: RecipeIngredient[]; // недостающие ингредиенты
  canMake: boolean; // можно ли приготовить рецепт
  recommendedProducts: typeof products[0][]; // рекомендуемые продукты для покупки
}

export interface AssistantSuggestion {
  type: 'recipe' | 'product' | 'tip';
  title: string;
  description: string;
  action?: {
    type: 'view_recipe' | 'add_to_cart' | 'browse_products';
    data: any;
  };
}

class RecipeAssistant {
  // Анализ доступных продуктов и рекомендация рецептов
  findMatchingRecipes(userProducts: UserAvailableProducts): RecipeMatch[] {
    const matches: RecipeMatch[] = [];

    for (const recipe of recipes) {
      const match = this.analyzeRecipeMatch(recipe, userProducts);
      if (match.matchScore > 0) {
        matches.push(match);
      }
    }

    // Сортировка по степени совпадения
    matches.sort((a, b) => b.matchScore - a.matchScore);

    return matches;
  }

  // Анализ конкретного рецепта
  private analyzeRecipeMatch(recipe: Recipe, userProducts: UserAvailableProducts): RecipeMatch {
    const availableIngredients: RecipeIngredient[] = [];
    const missingIngredients: RecipeIngredient[] = [];

    let totalIngredients = recipe.ingredients.length;
    let availableCount = 0;

    for (const ingredient of recipe.ingredients) {
      const isAvailable = this.isIngredientAvailable(ingredient, userProducts);

      if (isAvailable) {
        availableIngredients.push(ingredient);
        availableCount++;
      } else {
        missingIngredients.push(ingredient);
      }
    }

    const matchScore = (availableCount / totalIngredients) * 100;
    const canMake = missingIngredients.filter(ing => ing.required).length === 0;

    // Рекомендуемые продукты для покупки недостающих ингредиентов
    const recommendedProducts = this.getRecommendedProducts(missingIngredients);

    return {
      recipe,
      matchScore,
      availableIngredients,
      missingIngredients,
      canMake,
      recommendedProducts
    };
  }

  // Проверка доступности ингредиента
  private isIngredientAvailable(ingredient: RecipeIngredient, userProducts: UserAvailableProducts): boolean {
    // Проверяем продукты из каталога
    if (ingredient.productSlug) {
      return userProducts.productSlugs.includes(ingredient.productSlug);
    }

    // Проверяем пользовательские ингредиенты (простое текстовое совпадение)
    const ingredientName = ingredient.name.toLowerCase();
    return userProducts.customIngredients.some(custom =>
      custom.toLowerCase().includes(ingredientName) ||
      ingredientName.includes(custom.toLowerCase())
    );
  }

  // Получение рекомендуемых продуктов для покупки
  private getRecommendedProducts(missingIngredients: RecipeIngredient[]): typeof products[0][] {
    const recommended: typeof products[0][] = [];

    for (const ingredient of missingIngredients) {
      if (ingredient.productSlug) {
        const product = products.find(p => p.slug === ingredient.productSlug);
        if (product) {
          recommended.push(product);
        }
      }
    }

    return recommended;
  }

  // Получение умных предложений для пользователя
  getSmartSuggestions(userProducts: UserAvailableProducts): AssistantSuggestion[] {
    const suggestions: AssistantSuggestion[] = [];
    const matches = this.findMatchingRecipes(userProducts);

    // Лучшие рецепты, которые можно приготовить
    const canMakeRecipes = matches.filter(m => m.canMake).slice(0, 3);
    for (const match of canMakeRecipes) {
      suggestions.push({
        type: 'recipe',
        title: `Попробуйте: ${match.recipe.title}`,
        description: `У вас есть все необходимые ингредиенты. Время приготовления: ${match.recipe.time}`,
        action: {
          type: 'view_recipe',
          data: { recipeSlug: match.recipe.slug }
        }
      });
    }

    // Рецепты с высокой степенью совпадения (нужно докупить немного)
    const almostReadyRecipes = matches
      .filter(m => !m.canMake && m.matchScore >= 70)
      .slice(0, 2);

    for (const match of almostReadyRecipes) {
      const missingCount = match.missingIngredients.filter(ing => ing.required).length;
      suggestions.push({
        type: 'recipe',
        title: `Почти готово: ${match.recipe.title}`,
        description: `Нужно докупить ${missingCount} ингредиент${missingCount > 1 ? 'ов' : ''}. Совпадение: ${Math.round(match.matchScore)}%`,
        action: {
          type: 'view_recipe',
          data: { recipeSlug: match.recipe.slug }
        }
      });
    }

    // Рекомендации продуктов для расширения возможностей
    if (userProducts.productSlugs.length < 3) {
      const popularProducts = products
        .filter(p => !userProducts.productSlugs.includes(p.slug))
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 3);

      for (const product of popularProducts) {
        suggestions.push({
          type: 'product',
          title: `Рекомендуем: ${product.name}`,
          description: `Популярный продукт, который откроет новые рецепты. Рейтинг: ${product.rating}/5`,
          action: {
            type: 'add_to_cart',
            data: { productId: product.id }
          }
        });
      }
    }

    // Советы по использованию
    if (suggestions.length < 3) {
      suggestions.push({
        type: 'tip',
        title: 'Совет от шеф-повара',
        description: 'Комбинируйте ягоды с сиропами для создания уникальных десертов и напитков'
      });

      suggestions.push({
        type: 'tip',
        title: 'Идея для завтрака',
        description: 'Добавьте вяленые ягоды в йогурт или кашу для натуральной сладости'
      });
    }

    return suggestions.slice(0, 6); // Максимум 6 предложений
  }

  // Поиск рецептов по ингредиентам
  searchRecipesByIngredients(availableIngredients: string[]): Recipe[] {
    const ingredientSet = new Set(availableIngredients.map(ing => ing.toLowerCase()));

    return recipes.filter(recipe => {
      return recipe.ingredients.some(ing => {
        const ingredientName = ing.name.toLowerCase();
        return ingredientSet.has(ingredientName) ||
               availableIngredients.some(avail => ingredientName.includes(avail.toLowerCase()));
      });
    });
  }

  // Получение рецептов по сложности
  getRecipesByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Recipe[] {
    return recipes.filter(recipe => recipe.difficulty === difficulty);
  }

  // Получение рецептов по времени приготовления
  getRecipesByTime(maxTime: number): Recipe[] {
    return recipes.filter(recipe => {
      const timeMatch = recipe.time.match(/(\d+)/);
      if (timeMatch) {
        const time = parseInt(timeMatch[1]);
        return time <= maxTime;
      }
      return false;
    });
  }

  // Получение случайных рецептов для вдохновения
  getRandomRecipes(count: number = 3): Recipe[] {
    const shuffled = [...recipes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}

// Экспорт единственного экземпляра помощника
export const recipeAssistant = new RecipeAssistant();
