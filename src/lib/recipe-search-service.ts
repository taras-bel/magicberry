// Сервис для поиска рецептов в интернете
// Использует внешние API для поиска свежих рецептов
import { products } from '@/data/products';
// RecipeGenerator теперь импортируется динамически в generateRecipeWithAI
import { config, isConfigured } from './config';

interface RecipeSearchResult {
  title: string;
  description: string;
  source: string;
  url?: string;
  ingredients: string[];
  instructions?: string[];
  image?: string;
  prepTime?: number; // в минутах
  cookTime?: number; // в минутах
  servings?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  siteProductsUsed?: string[]; // Продукты с сайта, использованные в рецепте
  generated?: boolean; // Является ли рецепт сгенерированным
}

interface SearchFilters {
  query: string;
  ingredients?: string[]; // обязательные ингредиенты
  excludeIngredients?: string[]; // исключить эти ингредиенты
  cuisine?: string; // тип кухни (итальянская, азиатская и т.д.)
  diet?: string; // диета (вегетарианская, без глютена и т.д.)
  maxPrepTime?: number; // максимальное время подготовки
  difficulty?: string;
  maxResults?: number;
  focusOnSiteProducts?: boolean; // Фокус на продуктах с сайта
}

class RecipeSearchService {
  private readonly SPOONACULAR_API_KEY = config.recipes.spoonacular.apiKey;
  private readonly GOOGLE_SEARCH_API_KEY = config.recipes.googleSearch.apiKey;
  private readonly GOOGLE_SEARCH_ENGINE_ID = config.recipes.googleSearch.searchEngineId;

  // Поиск рецептов через Spoonacular API
  async searchSpoonacularRecipes(filters: SearchFilters): Promise<RecipeSearchResult[]> {
    if (!isConfigured.spoonacular()) {
      console.warn('Spoonacular API not configured');
      return [];
    }

    try {
      const params = new URLSearchParams({
        apiKey: this.SPOONACULAR_API_KEY,
        query: filters.query,
        number: (filters.maxResults || 10).toString(),
        instructionsRequired: 'true',
        addRecipeInformation: 'true',
        fillIngredients: 'true',
      });

      if (filters.ingredients && filters.ingredients.length > 0) {
        params.append('includeIngredients', filters.ingredients.join(','));
      }

      if (filters.excludeIngredients && filters.excludeIngredients.length > 0) {
        params.append('excludeIngredients', filters.excludeIngredients.join(','));
      }

      if (filters.cuisine) {
        params.append('cuisine', filters.cuisine);
      }

      if (filters.diet) {
        params.append('diet', filters.diet);
      }

      if (filters.maxPrepTime) {
        params.append('maxReadyTime', filters.maxPrepTime.toString());
      }

      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?${params}`,
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Spoonacular API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformSpoonacularResults(data.results || []);

    } catch (error) {
      console.error('Error searching Spoonacular:', error);
      return [];
    }
  }

  // Поиск рецептов через Google Custom Search
  async searchGoogleRecipes(filters: SearchFilters): Promise<RecipeSearchResult[]> {
    if (!isConfigured.googleSearch()) {
      console.warn('Google Search API not configured');
      return [];
    }

    try {
      const searchQuery = this.buildGoogleSearchQuery(filters);

      const params = new URLSearchParams({
        key: this.GOOGLE_SEARCH_API_KEY,
        cx: this.GOOGLE_SEARCH_ENGINE_ID,
        q: searchQuery,
        num: (filters.maxResults || 10).toString(),
        safe: 'active',
        fields: 'items(title,link,snippet,pagemap)',
      });

      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?${params}`,
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Google Search API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformGoogleResults(data.items || []);

    } catch (error) {
      console.error('Error searching Google:', error);
      return [];
    }
  }

  // Поиск рецептов через DuckDuckGo Instant Answers API
  async searchDuckDuckGoRecipes(filters: SearchFilters): Promise<RecipeSearchResult[]> {
    try {
      const searchQuery = `${filters.query} recipe site:foodnetwork.com OR site:allrecipes.com OR site:epicurious.com`;

      const response = await fetch(
        `https://api.duckduckgo.com/?q=${encodeURIComponent(searchQuery)}&format=json&no_html=1&skip_disambig=1`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Latvbelfruits-RecipeBot/1.0',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`DuckDuckGo API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformDuckDuckGoResults(data, filters);

    } catch (error) {
      console.error('Error searching DuckDuckGo:', error);
      return [];
    }
  }

  // Генерация рецептов с помощью OpenRouter AI модели
  async generateRecipeWithAI(ingredients: string[], preferences?: {
    cuisine?: string;
    difficulty?: string;
    timeLimit?: number;
    style?: string;
  }): Promise<RecipeSearchResult | null> {
    try {
      console.log(`🤖 Генерация рецепта с OpenRouter AI... Ингредиенты: ${ingredients.join(', ')}`);

      // Используем генератор рецептов через OpenRouter
      const { recipeGenerator } = await import('./recipe-generator');
      const generatedRecipe = await recipeGenerator.generateRecipe(ingredients, preferences);

      if (!generatedRecipe) {
        console.warn('⚠️ OpenRouter не вернул рецепт, используем fallback');
        return this.createFallbackRecipe(ingredients, preferences);
      }

      console.log(`✅ Рецепт сгенерирован: "${generatedRecipe.title}"`);

      // Конвертируем в формат RecipeSearchResult
      return {
        title: generatedRecipe.title,
        description: generatedRecipe.description,
        source: 'Latvbelfruits AI (OpenRouter)',
        ingredients: generatedRecipe.ingredients,
        instructions: generatedRecipe.instructions,
        prepTime: generatedRecipe.prepTime,
        cookTime: generatedRecipe.cookTime,
        servings: generatedRecipe.servings,
        difficulty: generatedRecipe.difficulty,
        tags: ['AI рецепт', 'OpenRouter', preferences?.style || 'рецепт'].filter(Boolean),
        generated: true
      };

    } catch (error) {
      console.error('❌ Ошибка генерации рецепта с OpenRouter AI:', error);
      return this.createFallbackRecipe(ingredients, preferences);
    }
  }

  // Создание fallback рецепта при ошибке генерации
  private createFallbackRecipe(ingredients: string[], preferences?: {
    cuisine?: string;
    difficulty?: string;
    timeLimit?: number;
    style?: string;
  }): RecipeSearchResult {
    const mainIngredients = ingredients.slice(0, 2).join(' и ');

    return {
      title: `Простое блюдо с ${mainIngredients}`,
      description: `Легкий рецепт с использованием ${mainIngredients}`,
      source: 'Latvbelfruits (Fallback)',
      ingredients: ingredients.map(ing => `${ing} - по вкусу`),
      instructions: [
        'Подготовьте все ингредиенты',
        'Смешайте основные ингредиенты',
        'Приготовьте по вашему усмотрению',
        'Подавайте к столу'
      ],
      prepTime: preferences?.timeLimit || 30,
      cookTime: 0,
      servings: 4,
      difficulty: 'easy',
      tags: ['простой рецепт', preferences?.style || 'блюдо'].filter(Boolean),
      generated: true
    };
  }

  // Основная функция поиска рецептов
  async searchRecipes(filters: SearchFilters): Promise<RecipeSearchResult[]> {
    const allResults: RecipeSearchResult[] = [];

    // Если фокус на продуктах сайта, генерируем рецепты с ними
    if (filters.focusOnSiteProducts) {
      const siteProductRecipes = await this.generateRecipesWithSiteProducts(filters);
      allResults.push(...siteProductRecipes);
    }

    // Параллельный поиск из разных источников
    const searchPromises = [
      this.searchSpoonacularRecipes(filters),
      this.searchGoogleRecipes(filters),
      this.searchDuckDuckGoRecipes(filters),
    ];

    // Если есть ингредиенты, попробуем сгенерировать рецепт
    if (filters.ingredients && filters.ingredients.length > 0) {
      const aiRecipe = await this.generateRecipeWithAI(filters.ingredients, {
        cuisine: filters.cuisine,
        difficulty: filters.difficulty,
        timeLimit: filters.maxPrepTime,
      });

      if (aiRecipe) {
        allResults.push(aiRecipe);
      }
    }

    try {
      const results = await Promise.allSettled(searchPromises);

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          allResults.push(...result.value);
        } else {
          console.warn(`Search source ${index} failed:`, result.reason);
        }
      });
    } catch (error) {
      console.error('Error in parallel search:', error);
    }

    // Удаляем дубликаты и сортируем по релевантности
    return this.deduplicateAndSortResults(allResults, filters);
  }

  // Преобразование результатов Spoonacular
  private transformSpoonacularResults(results: any[]): RecipeSearchResult[] {
    return results.map(result => ({
      title: result.title,
      description: result.summary?.replace(/<[^>]*>/g, '') || '',
      source: 'Spoonacular',
      url: result.sourceUrl,
      ingredients: result.extendedIngredients?.map((ing: any) => ing.original) || [],
      instructions: result.analyzedInstructions?.[0]?.steps?.map((step: any) => step.step) || [],
      image: result.image,
      prepTime: result.preparationMinutes,
      cookTime: result.cookingMinutes,
      servings: result.servings,
      difficulty: this.estimateDifficulty(result.preparationMinutes, result.cookingMinutes),
      tags: result.cuisines || [],
      nutrition: result.nutrition ? {
        calories: result.nutrition.nutrients?.find((n: any) => n.name === 'Calories')?.amount,
        protein: result.nutrition.nutrients?.find((n: any) => n.name === 'Protein')?.amount,
        carbs: result.nutrition.nutrients?.find((n: any) => n.name === 'Carbohydrates')?.amount,
        fat: result.nutrition.nutrients?.find((n: any) => n.name === 'Fat')?.amount,
      } : undefined,
    }));
  }

  // Преобразование результатов Google
  private transformGoogleResults(items: any[]): RecipeSearchResult[] {
    return items
      .filter(item => item.title && item.link && this.isRecipeUrl(item.link))
      .map(item => ({
        title: item.title.replace(/\s*\|\s*.*$/, '').trim(), // Убираем " | Allrecipes" и т.д.
        description: item.snippet || '',
        source: 'Google Search',
        url: item.link,
        ingredients: [], // Не можем извлечь из сниппета
        instructions: [],
        image: item.pagemap?.cse_image?.[0]?.src,
        difficulty: 'medium', // По умолчанию
        tags: [],
      }));
  }

  // Преобразование результатов DuckDuckGo
  private transformDuckDuckGoResults(data: any, filters: SearchFilters): RecipeSearchResult[] {
    const results: RecipeSearchResult[] = [];

    if (data.RelatedTopics) {
      data.RelatedTopics.forEach((topic: any) => {
        if (topic.Text && topic.FirstURL && this.isRecipeUrl(topic.FirstURL)) {
          results.push({
            title: topic.Text.split(' - ')[0]?.trim() || topic.Text,
            description: topic.Text,
            source: 'DuckDuckGo',
            url: topic.FirstURL,
            ingredients: [],
            instructions: [],
            difficulty: 'medium',
            tags: [],
          });
        }
      });
    }

    return results.slice(0, filters.maxResults || 5);
  }

  // Построение запроса для Google
  private buildGoogleSearchQuery(filters: SearchFilters): string {
    let query = `${filters.query} рецепт`;

    if (filters.ingredients && filters.ingredients.length > 0) {
      query += ` ${filters.ingredients.join(' ')}`;
    }

    if (filters.cuisine) {
      query += ` ${filters.cuisine}`;
    }

    if (filters.difficulty) {
      query += ` ${filters.difficulty}`;
    }

    // Ограничиваем поиск надежными сайтами рецептов
    query += ` site:allrecipes.com OR site:foodnetwork.com OR site:epicurious.com OR site:bonappetit.com OR site:delish.com`;

    return query;
  }

  // Построение промпта для генерации рецепта
  private buildRecipeGenerationPrompt(ingredients: string[], preferences?: any): string {
    let prompt = `Создай подробный рецепт блюда, используя следующие ингредиенты: ${ingredients.join(', ')}.

Требования к рецепту:
- Название блюда
- Список ингредиентов с точными количествами
- Пошаговые инструкции приготовления
- Время приготовления
- Количество порций
- Пищевая ценность (калории, белки, углеводы, жиры на порцию)
- Советы по приготовлению

`;

    if (preferences?.cuisine) {
      prompt += `Стиль кухни: ${preferences.cuisine}. `;
    }

    if (preferences?.difficulty) {
      prompt += `Сложность: ${preferences.difficulty}. `;
    }

    if (preferences?.timeLimit) {
      prompt += `Максимальное время приготовления: ${preferences.timeLimit} минут. `;
    }

    if (preferences?.style) {
      prompt += `Тип блюда: ${preferences.style}. `;
    }

    prompt += '\nОтветь на русском языке в структурированном формате.';

    return prompt;
  }

  // Парсинг сгенерированного рецепта
  private parseGeneratedRecipe(content: string, ingredients: string[]): RecipeSearchResult {
    // Простой парсер для структурированного ответа AI
    const lines = content.split('\n');
    let title = 'Сгенерированный рецепт';
    let description = '';
    const parsedIngredients: string[] = [];
    const instructions: string[] = [];
    let prepTime = 30;
    let servings = 4;

    for (const line of lines) {
      const trimmed = line.trim();

      if (trimmed.startsWith('Название:') || trimmed.startsWith('Рецепт:')) {
        title = trimmed.split(':')[1]?.trim() || title;
      } else if (trimmed.startsWith('Ингредиенты:') || trimmed.includes('ингредиенты')) {
        // Следующие строки до пустой - ингредиенты
        let i = lines.indexOf(line) + 1;
        while (i < lines.length && lines[i].trim()) {
          parsedIngredients.push(lines[i].trim());
          i++;
        }
      } else if (trimmed.startsWith('Инструкции:') || trimmed.includes('приготовление')) {
        // Следующие строки - инструкции
        let i = lines.indexOf(line) + 1;
        while (i < lines.length && lines[i].trim()) {
          instructions.push(lines[i].trim());
          i++;
        }
      } else if (trimmed.includes('Время:') || trimmed.includes('время')) {
        const timeMatch = trimmed.match(/(\d+)/);
        if (timeMatch) {
          prepTime = parseInt(timeMatch[1]);
        }
      } else if (trimmed.includes('Порций:') || trimmed.includes('порции')) {
        const servingMatch = trimmed.match(/(\d+)/);
        if (servingMatch) {
          servings = parseInt(servingMatch[1]);
        }
      }
    }

    return {
      title,
      description: `Рецепт на основе ингредиентов: ${ingredients.join(', ')}`,
      source: 'AI Generated',
      ingredients: parsedIngredients.length > 0 ? parsedIngredients : ingredients,
      instructions,
      prepTime,
      servings,
      difficulty: 'medium',
      tags: ['AI', 'generated'],
    };
  }

  // Оценка сложности рецепта
  private estimateDifficulty(prepTime?: number, cookTime?: number): 'easy' | 'medium' | 'hard' {
    const totalTime = (prepTime || 0) + (cookTime || 0);

    if (totalTime <= 30) return 'easy';
    if (totalTime <= 60) return 'medium';
    return 'hard';
  }

  // Проверка, является ли URL рецептом
  private isRecipeUrl(url: string): boolean {
    const recipeDomains = [
      'allrecipes.com',
      'foodnetwork.com',
      'epicurious.com',
      'bonappetit.com',
      'delish.com',
      'tasty.co',
      'seriouseats.com',
      'cooking.nytimes.com',
    ];

    return recipeDomains.some(domain => url.includes(domain));
  }

  // Генерация рецептов с продуктами сайта
  private async generateRecipesWithSiteProducts(filters: SearchFilters): Promise<RecipeSearchResult[]> {
    const generatedRecipes: RecipeSearchResult[] = [];

    // Выбираем случайные продукты с сайта (максимум 3-4 продукта)
    const availableProducts = products.filter(p => p.category === 'packaged' || p.category === 'syrup' || p.category === 'weight');
    const selectedProducts = this.getRandomProducts(availableProducts, 3);

    if (selectedProducts.length === 0) {
      console.log('⚠️ Нет доступных продуктов для генерации рецептов');
      return [];
    }

    console.log(`🍓 Выбрано продуктов для генерации: ${selectedProducts.map(p => p.name).join(', ')}`);

    // Генерируем рецепты для разных комбинаций продуктов (меньше, чтобы быстрее генерировать)
    const recipeIdeas = [
      {
        title: `Десерт с ${selectedProducts.map(p => p.name.toLowerCase()).join(' и ')}`,
        type: 'dessert',
        baseIngredients: ['сахар', 'яйца', 'мука', 'сливочное масло']
      },
      {
        title: `Напиток на основе ${selectedProducts[0].name.toLowerCase()}`,
        type: 'drink',
        baseIngredients: ['вода', 'мед', 'лимон']
      },
      {
        title: `Завтрак с ${selectedProducts.map(p => p.name.toLowerCase()).slice(0, 2).join(' и ')}`,
        type: 'breakfast',
        baseIngredients: ['овсянка', 'молоко', 'орехи']
      }
    ];

    console.log(`📝 Генерация ${recipeIdeas.length} рецептов...`);
    for (const idea of recipeIdeas) {
      try {
        const recipe = await this.generateRecipeWithSiteProducts(idea, selectedProducts, filters);
        if (recipe) {
          console.log(`✅ Сгенерирован рецепт: ${recipe.title}`);
          generatedRecipes.push(recipe);
        } else {
          console.log(`⚠️ Не удалось сгенерировать рецепт: ${idea.title}`);
        }
      } catch (error) {
        console.error(`❌ Ошибка генерации рецепта "${idea.title}":`, error);
      }
    }

    console.log(`🎉 Сгенерировано рецептов: ${generatedRecipes.length}`);
    return generatedRecipes.slice(0, filters.maxResults || 5);
  }

  // Генерация одного рецепта с продуктами сайта
  private async generateRecipeWithSiteProducts(
    idea: { title: string; type: string; baseIngredients: string[] },
    siteProducts: typeof products,
    filters: SearchFilters
  ): Promise<RecipeSearchResult | null> {
    try {
      // Создаем ингредиенты: продукты сайта с указанием бренда + базовые ингредиенты
      const allIngredients = [
        ...siteProducts.map(p => {
          // Формируем название продукта с брендом
          let productName = p.name;
          // Добавляем "от Latvbelfruits" если это продукт сайта
          if (!productName.toLowerCase().includes('latvbelfruits') && !productName.toLowerCase().includes('от latvbelfruits')) {
            productName = `${productName} от Latvbelfruits`;
          }
          return productName;
        }),
        ...idea.baseIngredients
      ];

      // Генерируем рецепт через AI
      const aiRecipe = await this.generateRecipeWithAI(allIngredients, {
        cuisine: filters.cuisine || 'российская',
        difficulty: filters.difficulty || 'easy',
        timeLimit: filters.maxPrepTime || 30,
        style: idea.type
      });

      if (aiRecipe) {
        return {
          ...aiRecipe,
          title: idea.title,
          siteProductsUsed: siteProducts.map(p => p.name),
          generated: true,
          source: 'Latvbelfruits AI',
          tags: [...(aiRecipe.tags || []), 'с продуктами latvbelfruits', idea.type]
        };
      }
    } catch (error) {
      console.error('Error generating recipe with site products:', error);
    }

    return null;
  }

  // Выбор случайных продуктов
  private getRandomProducts(productList: typeof products, count: number): typeof products {
    const shuffled = [...productList].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, productList.length));
  }

  // Удаление дубликатов и сортировка результатов
  private deduplicateAndSortResults(results: RecipeSearchResult[], filters: SearchFilters): RecipeSearchResult[] {
    // Удаляем дубликаты по названию
    const uniqueResults = results.filter((result, index, self) =>
      index === self.findIndex(r => r.title.toLowerCase() === result.title.toLowerCase())
    );

    // Сортируем по релевантности (простая логика)
    return uniqueResults
      .sort((a, b) => {
        // Предпочитаем результаты с полными данными
        const aScore = (a.ingredients.length > 0 ? 1 : 0) + (a.instructions?.length || 0 > 0 ? 1 : 0);
        const bScore = (b.ingredients.length > 0 ? 1 : 0) + (b.instructions?.length || 0 > 0 ? 1 : 0);
        return bScore - aScore;
      })
      .slice(0, filters.maxResults || 20);
  }
}

// Экспорт единственного экземпляра сервиса
export const recipeSearchService = new RecipeSearchService();
