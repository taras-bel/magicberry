// ML сервис с использованием OpenRouter API
// Заменен с локальных моделей на xiaomi/mimo-v2-flash:free через OpenRouter
import { products } from '@/data/products';
import { recipes } from '@/data/recipes';
import { recipeSearchService } from '@/lib/recipe-search-service';

// Типы для ML обработки
export interface MLRecommendationRequest {
  userProducts: string[]; // slugs доступных продуктов
  userPreferences?: {
    categories: string[];
    priceRange: { min: number; max: number };
  };
  limit?: number;
}

export interface MLChatRequest {
  message: string;
  userProducts: string[];
  context?: string[];
  searchInternet?: boolean; // разрешить поиск в интернете
}

export interface MLRecipeSearchRequest {
  query: string;
  ingredients: string[]; // доступные ингредиенты
  preferences?: {
    cuisine?: string;
    difficulty?: string;
    maxTime?: number;
    diet?: string;
  };
  searchInternet?: boolean;
}

export interface MLRecommendation {
  product: typeof products[0];
  score: number;
  reason: string;
  confidence: number;
}

export interface MLChatResponse {
  response: string;
  suggestions: Array<{
    type: 'recipe' | 'product' | 'tip';
    title: string;
    description: string;
    data?: any;
  }>;
  confidence: number;
}

export interface MLRecipeSearchResponse {
  recipes: Array<{
    title: string;
    description: string;
    source: string;
    url?: string;
    ingredients: string[];
    instructions?: string[];
    image?: string;
    prepTime?: number;
    cookTime?: number;
    servings?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
    nutrition?: any;
    tags?: string[];
  }>;
  totalFound: number;
  searchQuery: string;
}

// Класс ML сервиса
class MLService {
  // Получение рекомендаций продуктов (упрощенная версия без эмбеддингов)
  async getProductRecommendations(request: MLRecommendationRequest): Promise<MLRecommendation[]> {

    const { userProducts, userPreferences, limit = 6 } = request;

    try {
      const userProductObjects = products.filter(p => userProducts.includes(p.slug || ''));
      const userCategories = [...new Set(userProductObjects.map(p => p.category))];

      const similarities: Array<{
        product: typeof products[0];
        similarity: number;
        reason: string;
      }> = [];

      for (const product of products) {
        if (userProducts.includes(product.slug || '')) continue;

        let similarity = 0;
        let reason = 'Популярный продукт';

        // Совпадение категории
        if (userCategories.includes(product.category)) {
          similarity += 0.4;
          reason = `Из вашей любимой категории ${product.category}`;
        }
        // Рейтинг продукта
        if (product.rating) {
          similarity += (product.rating / 5) * 0.3;
        }
        // Базовый скор для разнообразия
        similarity += 0.3 + Math.random() * 0.1;

        reason = this.getRecommendationReason(product, userPreferences, Math.min(similarity, 1));

        similarities.push({ product, similarity, reason });
      }

      similarities.sort((a, b) => b.similarity - a.similarity);

      return similarities.slice(0, limit).map(({ product, similarity, reason }) => ({
        product,
        score: similarity,
        reason,
        confidence: similarity
      }));

    } catch (error) {
      console.error('Error getting ML recommendations:', error);
      return this.getFallbackRecommendations(request);
    }
  }

  // Поиск рецептов в интернете
  async searchInternetRecipes(request: MLRecipeSearchRequest): Promise<MLRecipeSearchResponse> {
    try {
      const searchFilters = {
        query: request.query,
        ingredients: request.ingredients,
        cuisine: request.preferences?.cuisine,
        diet: request.preferences?.diet,
        maxPrepTime: request.preferences?.maxTime,
        difficulty: request.preferences?.difficulty,
        maxResults: 20,
        focusOnSiteProducts: true, // Всегда фокусируемся на продуктах сайта
      };

      const foundRecipes = await recipeSearchService.searchRecipes(searchFilters);

      return {
        recipes: foundRecipes,
        totalFound: foundRecipes.length,
        searchQuery: request.query,
      };
    } catch (error) {
      console.error('Error searching internet recipes:', error);
      return {
        recipes: [],
        totalFound: 0,
        searchQuery: request.query,
      };
    }
  }

  // Обработка сообщений чата с OpenRouter AI
  async processChatMessage(request: MLChatRequest): Promise<MLChatResponse> {
    const { message, userProducts, searchInternet, context } = request;

    try {
      // Сначала проверяем, есть ли в запросе упоминание ингредиентов для генерации рецепта
      const mentionedIngredients = this.extractIngredientsFromMessage(message);
      const lowerMessage = message.toLowerCase();
      // Нормализуем сообщение (убираем пунктуацию для более гибкой проверки)
      const normalizedMessage = lowerMessage.replace(/[.,!?;:]/g, ' ');
      const recipeIntentKeywords = ['что приготовить', 'что можно приготовить', 'рецепт', 'как приготовить', 'приготовить из', 'подскажи что', 'подскажи'];
      const isRecipeRequest = mentionedIngredients.length > 0 && recipeIntentKeywords.some(keyword => {
        // Проверяем как полное вхождение, так и отдельные части для "подскажи что"
        if (keyword === 'подскажи') {
          return normalizedMessage.includes('подскажи') && (normalizedMessage.includes('что') || normalizedMessage.includes('рецепт'));
        }
        return normalizedMessage.includes(keyword);
      });

      console.log('ML Service - Recipe check:', { mentionedIngredients, isRecipeRequest, message });

      if (isRecipeRequest && mentionedIngredients.length > 0) {
        console.log('ML Service - Generating recipe for ingredients:', mentionedIngredients);
        // Генерируем рецепт на основе упомянутых ингредиентов
        return await this.generateRecipeResponse(mentionedIngredients, userProducts, message);
      }

      // Используем OpenRouter для генерации ответа
      const { openRouterService } = await import('./openrouter-service');
      
      const contextMessages = context || [];
      if (userProducts.length > 0) {
        contextMessages.push(`У пользователя есть продукты: ${userProducts.join(', ')}`);
      }

      const aiResponse = await openRouterService.processChatMessage(message, contextMessages);

      // Пытаемся извлечь предложения из ответа AI
      const suggestions = this.extractSuggestionsFromResponse(aiResponse, userProducts);

      return {
        response: aiResponse,
        suggestions,
        confidence: 0.8
      };

    } catch (error) {
      console.error('Error processing chat message with OpenRouter:', error);
      // Fallback к простому анализу
      return this.getFallbackChatResponse(request);
    }
  }

  // Извлечение ингредиентов из сообщения
  private extractIngredientsFromMessage(message: string): string[] {
    const lowerMessage = message.toLowerCase();
    const allIngredients: string[] = [];

    // Список возможных ингредиентов (расширенный)
    const ingredientPatterns = [
      'клюква', 'вишня', 'тыква', 'яблоко', 'груша', 'слива',
      'малина', 'клубника', 'черника', 'смородина', 'крыжовник',
      'сироп', 'ягоды', 'фрукты', 'овощи',
      'овсянка', 'мука', 'сахар', 'мед', 'молоко', 'яйца',
      'орехи', 'миндаль', 'грецкие', 'кешью',
      'шоколад', 'корица', 'ваниль', 'имбирь'
    ];

    // Проверяем упоминания ингредиентов в сообщении
    for (const ingredient of ingredientPatterns) {
      if (lowerMessage.includes(ingredient)) {
        allIngredients.push(ingredient);
      }
    }

    // Также проверяем продукты из каталога
    for (const product of products) {
      const productName = product.name.toLowerCase();
      if (lowerMessage.includes(productName)) {
        // Если это продукт Latvbelfruits, добавляем его с указанием бренда
        if (productName.includes('вялен') || productName.includes('сироп')) {
          allIngredients.push(`${product.name} от Latvbelfruits`);
        } else {
          allIngredients.push(product.name);
        }
      }
    }

    return [...new Set(allIngredients)]; // Удаляем дубликаты
  }

  // Генерация ответа с рецептом
  private async generateRecipeResponse(
    ingredients: string[],
    userProducts: string[],
    originalMessage: string
  ): Promise<MLChatResponse> {
    try {
      const { recipeGenerator } = await import('./recipe-generator');
      const { recipeSearchService } = await import('./recipe-search-service');

      // Генерируем рецепт с помощью AI
      const generatedRecipe = await recipeGenerator.generateRecipe(ingredients, {
        difficulty: 'easy',
        timeLimit: 60,
        cuisine: 'российская'
      });

      if (generatedRecipe) {
        // Формируем список ингредиентов с брендом Latvbelfruits, если это наши продукты
        const formattedIngredients = generatedRecipe.ingredients.map(ing => {
          const lowerIng = ing.toLowerCase();
          if (lowerIng.includes('клюква') || lowerIng.includes('вишня') || lowerIng.includes('тыква') || lowerIng.includes('вялен')) {
            if (!ing.includes('от Latvbelfruits')) {
              return `${ing} от Latvbelfruits`;
            }
          }
          return ing;
        });

        // Создаем текст ответа
        const responseText = `Вот рецепт с использованием ${ingredients.slice(0, 2).join(' и ')}:\n\n**${generatedRecipe.title}**\n\n${generatedRecipe.description}\n\n**Ингредиенты:**\n${formattedIngredients.map(ing => `• ${ing}`).join('\n')}\n\n**Время приготовления:** ${generatedRecipe.prepTime} минут\n**Порций:** ${generatedRecipe.servings}\n**Сложность:** ${generatedRecipe.difficulty === 'easy' ? 'Легко' : generatedRecipe.difficulty === 'medium' ? 'Средне' : 'Сложно'}`;

        // Создаем предложение с рецептом
        const suggestions = [{
          type: 'recipe' as const,
          title: generatedRecipe.title,
          description: `${generatedRecipe.prepTime} мин • ${generatedRecipe.servings} порций • ${generatedRecipe.difficulty === 'easy' ? 'Легко' : generatedRecipe.difficulty === 'medium' ? 'Средне' : 'Сложно'}`,
          data: {
            generatedRecipe: {
              title: generatedRecipe.title,
              description: generatedRecipe.description,
              ingredients: formattedIngredients,
              instructions: generatedRecipe.instructions,
              prepTime: generatedRecipe.prepTime,
              servings: generatedRecipe.servings,
              difficulty: generatedRecipe.difficulty
            }
          }
        }];

        return {
          response: responseText,
          suggestions,
          confidence: 0.9
        };
      }
    } catch (error) {
      console.error('Error generating recipe:', error);
    }

    // Fallback: ищем рецепты через поиск
    try {
      const { recipeSearchService } = await import('./recipe-search-service');
      const searchResults = await recipeSearchService.searchRecipes({
        query: `рецепт с ${ingredients.slice(0, 2).join(' и ')}`,
        ingredients: ingredients,
        maxResults: 3,
        focusOnSiteProducts: true
      });

      if (searchResults.length > 0) {
        const suggestions = searchResults.slice(0, 2).map(recipe => ({
          type: 'recipe' as const,
          title: recipe.title,
          description: recipe.prepTime ? `${recipe.prepTime} мин` : recipe.description,
          data: { recipeSlug: (recipe as { slug?: string }).slug || undefined, generated: recipe.generated }
        }));

        return {
          response: `Вот рецепты с использованием ${ingredients.slice(0, 2).join(' и ')}:`,
          suggestions,
          confidence: 0.8
        };
      }
    } catch (error) {
      console.error('Error searching recipes:', error);
    }

    // Последний fallback
    return {
      response: `Я нашел упоминания ${ingredients.join(', ')} в вашем запросе. К сожалению, не удалось сгенерировать рецепт. Попробуйте переформулировать запрос или посмотрите наши готовые рецепты.`,
      suggestions: [],
      confidence: 0.5
    };
  }

  private extractSuggestionsFromResponse(response: string, userProducts: string[]): any[] {
    const suggestions: any[] = [];
    
    // Пытаемся найти упоминания рецептов или продуктов в ответе
    // Это базовая логика, можно улучшить
    
    return suggestions;
  }


  // Генерация предложений рецептов
  private async generateRecipeSuggestions(
    userProducts: string[],
    filters: string[],
    searchInternet?: boolean
  ): Promise<{ text: string; suggestions: any[] }> {

    // Анализируем доступные продукты пользователя
    const availableProducts = products.filter(p => userProducts.includes(p.slug || ''));

    // Ищем подходящие рецепты из локальной базы
    const recipeMatches = recipes.map(recipe => {
      let matchScore = 0;
      let availableIngredients: any[] = [];
      let missingIngredients: any[] = [];

      // Для каждого ингредиента рецепта проверяем, есть ли он у пользователя
      recipe.ingredients.forEach(ing => {
        let isAvailable = false;

        // Проверяем по productSlug (если есть)
        if (ing.productSlug && userProducts.includes(ing.productSlug)) {
          isAvailable = true;
        }
        // Проверяем по названию ингредиента в списке продуктов пользователя
        else {
          const matchingProduct = availableProducts.find(p =>
            p.name.toLowerCase().includes(ing.name.toLowerCase()) ||
            ing.name.toLowerCase().includes(p.name.toLowerCase())
          );
          if (matchingProduct) {
            isAvailable = true;
          }
        }

        if (isAvailable) {
          availableIngredients.push(ing);
          // Даем больший вес обязательным ингредиентам
          matchScore += ing.required ? 1 : 0.5;
        } else {
          missingIngredients.push(ing);
        }
      });

      // Нормализуем скор по количеству обязательных ингредиентов
      const requiredIngredients = recipe.ingredients.filter(ing => ing.required);
      const availableRequired = availableIngredients.filter(ing => ing.required);
      matchScore = requiredIngredients.length > 0 ? availableRequired.length / requiredIngredients.length : matchScore;

      return {
        recipe,
        matchScore: Math.min(matchScore, 1), // ограничиваем 100%
        availableIngredients,
        missingIngredients
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    const bestLocalMatches = recipeMatches.slice(0, 3);

    let text = "На основе ваших продуктов, вот что я могу предложить:\n\n";
    let suggestions: any[] = bestLocalMatches.map(match => {
      const canMake = match.missingIngredients.filter(ing => ing.required).length === 0;

      text += `• ${match.recipe.title} (${Math.round(match.matchScore * 100)}% совпадение)\n`;

      if (canMake) {
        text += `  ✓ Можно приготовить сразу!\n`;
      } else {
        text += `  ⚠ Нужно докупить ${match.missingIngredients.filter(ing => ing.required).length} ингредиентов\n`;
      }

      return {
        type: 'recipe' as const,
        title: match.recipe.title,
        description: `${match.recipe.time} • ${Math.round(match.matchScore * 100)}% совпадение`,
        data: { recipeSlug: match.recipe.slug }
      };
    });

    // Если разрешено искать в интернете и локальных рецептов мало
    if (searchInternet && bestLocalMatches.length < 3) {
      try {
        text += "\n🔍 Ищу дополнительные рецепты в интернете...\n";

        const productNames = availableProducts.map(p => p.name);
        const searchQuery = productNames.length > 0
          ? `рецепт с ${productNames.slice(0, 3).join(', ')}`
          : 'рецепты';

        const internetResults = await this.searchInternetRecipes({
          query: searchQuery,
          ingredients: productNames,
          searchInternet: true,
        });

        const internetRecipes = internetResults.recipes.slice(0, 3 - bestLocalMatches.length);

        internetRecipes.forEach(internetRecipe => {
          text += `🌐 ${internetRecipe.title} (из интернета)\n`;

          if (internetRecipe.prepTime) {
            text += `  ⏱ ${internetRecipe.prepTime} мин\n`;
          }

          suggestions.push({
            type: 'recipe' as const,
            title: internetRecipe.title,
            description: `Из интернета • ${internetRecipe.source}`,
            data: {
              internetRecipe: internetRecipe
            }
          });
        });

      } catch (error) {
        console.error('Error searching internet recipes:', error);
        text += "\nНе удалось найти дополнительные рецепты в интернете.\n";
      }
    }

    return { text, suggestions };
  }

  // Генерация предложений на основе ингредиентов
  private async generateIngredientBasedSuggestions(
    mentionedProducts: string[],
    userProducts: string[],
    searchInternet?: boolean
  ): Promise<{ text: string; suggestions: any[] }> {

    const allAvailableProducts = [...new Set([...mentionedProducts, ...userProducts])];

    const suggestions = products
      .filter(p => !allAvailableProducts.includes(p.slug || ''))
      .slice(0, 3)
      .map(product => ({
        type: 'product' as const,
        title: product.name,
        description: `Дополнит вашу коллекцию • ${product.priceFrom} BYN`,
        data: { productId: product.id }
      }));

    return {
      text: `У вас есть ${allAvailableProducts.length} продуктов. Вот что можно добавить:`,
      suggestions
    };
  }

  // Генерация предложений по сложности
  private generateDifficultyBasedSuggestions(entities: string[], searchInternet?: boolean): { text: string; suggestions: any[] } {
    const isEasy = entities.some(e => e.includes('прост') || e.includes('легк'));

    const filteredRecipes = recipes.filter(r =>
      isEasy ? r.difficulty === 'easy' : r.difficulty !== 'hard'
    ).slice(0, 3);

    const suggestions = filteredRecipes.map(recipe => ({
      type: 'recipe' as const,
      title: recipe.title,
      description: `${recipe.time} • ${recipe.difficulty === 'easy' ? 'Легко' : recipe.difficulty === 'medium' ? 'Средне' : 'Сложно'}`,
      data: { recipeSlug: recipe.slug }
    }));

    return {
      text: `Вот ${isEasy ? 'простые' : 'доступные'} рецепты:`,
      suggestions
    };
  }

  // Генерация предложений по времени
  private generateTimeBasedSuggestions(entities: string[], searchInternet?: boolean): { text: string; suggestions: any[] } {
    const isQuick = entities.some(e => e.includes('быстр') || e.includes('минут'));

    const filteredRecipes = recipes.filter(r => {
      const timeMatch = r.time.match(/(\d+)/);
      if (timeMatch) {
        const minutes = parseInt(timeMatch[1]);
        return isQuick ? minutes <= 30 : minutes <= 60;
      }
      return false;
    }).slice(0, 3);

    const suggestions = filteredRecipes.map(recipe => ({
      type: 'recipe' as const,
      title: recipe.title,
      description: recipe.time,
      data: { recipeSlug: recipe.slug }
    }));

    return {
      text: `Вот ${isQuick ? 'быстрые' : 'не очень долгие'} рецепты:`,
      suggestions
    };
  }

  // Вспомогательные методы
  private createUserProfile(userProducts: string[], preferences?: any): string {
    const userProductObjects = products.filter(p => userProducts.includes(p.slug || ''));

    let profile = 'Пользователь имеет следующие продукты: ';

    // Добавляем названия продуктов
    profile += userProductObjects.map(p => p.name).join(', ');

    // Добавляем категории
    const categories = [...new Set(userProductObjects.map(p => p.category))];
    profile += '. Категории: ' + categories.join(', ');

    // Добавляем предпочтения по цене
    if (preferences?.priceRange) {
      profile += `. Предпочитает цены от ${preferences.priceRange.min} до ${preferences.priceRange.max} рублей.`;
    }

    return profile;
  }

  private createProductText(product: typeof products[0]): string {
    return `${product.name} ${product.description || ''} ${product.category || ''} ${product.tags?.join(' ') || ''}`.toLowerCase();
  }

  private getRecommendationReason(
    product: typeof products[0],
    preferences: any,
    similarity: number
  ): string {
    if (similarity > 0.8) {
      return 'Отлично подходит под ваши предпочтения';
    } else if (similarity > 0.6) {
      return 'Хорошее дополнение к вашей коллекции';
    } else if (preferences?.categories?.includes(product.category)) {
      return `Из вашей любимой категории ${product.category}`;
    } else {
      return 'Популярный продукт';
    }
  }

  private extractEntities(message: string, intentType: string): string[] {
    // Простая экстракция сущностей из сообщения
    const entities: string[] = [];

    switch (intentType) {
      case 'difficulty_filter':
        if (message.includes('прост') || message.includes('легк')) entities.push('easy');
        if (message.includes('сложн')) entities.push('hard');
        break;
      case 'time_filter':
        if (message.includes('быстр') || message.includes('минут')) entities.push('quick');
        break;
    }

    return entities;
  }

  private extractProductMentions(message: string): string[] {
    // Извлекаем упоминания продуктов из сообщения
    const productMentions: string[] = [];

    for (const product of products) {
      if (message.toLowerCase().includes(product.name.toLowerCase())) {
        productMentions.push(product.slug || '');
      }
    }

    return productMentions;
  }

  // Fallback методы на случай проблем с ML
  private getFallbackRecommendations(request: MLRecommendationRequest): MLRecommendation[] {
    const { userProducts, limit = 6 } = request;

    return products
      .filter(p => !userProducts.includes(p.slug || ''))
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit)
      .map(product => ({
        product,
        score: 0.5,
        reason: 'Популярный продукт',
        confidence: 0.5
      }));
  }

  private getFallbackChatResponse(request: MLChatRequest): MLChatResponse {
    return {
      response: "Извините, я временно не могу обработать ваш запрос. Попробуйте позже.",
      suggestions: [],
      confidence: 0
    };
  }
}

// Экспорт единственного экземпляра сервиса
export const mlService = new MLService();
