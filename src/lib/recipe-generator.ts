// Генератор рецептов с использованием OpenRouter API
// Замена локальной модели на xiaomi/mimo-v2-flash:free через OpenRouter

import { openRouterService } from './openrouter-service';

interface GenerationOptions {
  cuisine?: string;
  difficulty?: string;
  timeLimit?: number;
  style?: string;
}

interface GeneratedRecipe {
  title: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
}

export class RecipeGenerator {
  async generateRecipe(
    ingredients: string[],
    options: GenerationOptions = {}
  ): Promise<GeneratedRecipe | null> {
    try {
      const generatedText = await openRouterService.generateRecipe(ingredients, options);
      return this.parseGeneratedRecipe(generatedText, ingredients, options);
    } catch (error) {
      console.error('Error generating recipe with OpenRouter:', error);
      return this.generateFallbackRecipe(ingredients, options);
    }
  }

  private parseGeneratedRecipe(
    text: string,
    ingredients: string[],
    options: GenerationOptions
  ): GeneratedRecipe {
    const { difficulty = 'easy', timeLimit = 30 } = options;

    // Парсим сгенерированный текст
    const lines = text.split('\n').filter(line => line.trim());

    let title = 'Вкусное блюдо';
    let description = 'Рецепт с использованием натуральных продуктов';
    let parsedIngredients: string[] = [];
    let parsedInstructions: string[] = [];
    let prepTime = timeLimit;
    let cookTime = 0;
    let servings = 4;

    // Извлекаем название
    const titleMatch = text.match(/(?:Название|Title|Блюдо)[:\s]*(.+)/i) ||
                      text.match(/^(.+?)(?:$|\n)/);
    if (titleMatch) {
      title = titleMatch[1].trim().replace(/[#*]/g, '');
    }

    // Извлекаем описание
    const descMatch = text.match(/(?:Описание|Description)[:\s]*(.+?)(?:\n|$)/i);
    if (descMatch) {
      description = descMatch[1].trim();
    }

    // Извлекаем ингредиенты
    const ingredientsStart = text.search(/(?:Ингредиенты|Ingredients|Состав)[:]/i);
    if (ingredientsStart !== -1) {
      const ingredientsSection = text.substring(ingredientsStart);
      const ingredientsMatch = ingredientsSection.match(/(?:Ингредиенты|Ingredients|Состав)[:\s]*\n?([\s\S]+?)(?:\n\n|\n(?:Инструкция|Instructions|Приготовление)|$)/i);
      if (ingredientsMatch) {
        parsedIngredients = ingredientsMatch[1]
          .split('\n')
          .filter(line => line.trim() && !line.match(/^-+$/))
          .map(line => line.replace(/^[-•*]\s*/, '').trim())
          .filter(Boolean);
      }
    }

    // Если ингредиенты не найдены, используем предоставленные (уже с брендом "от Magic Berry")
    if (parsedIngredients.length === 0) {
      parsedIngredients = ingredients;
    }

    // Извлекаем инструкции
    const instructionsStart = text.search(/(?:Инструкция|Instructions|Приготовление|Шаги|Steps)[:]/i);
    if (instructionsStart !== -1) {
      const instructionsSection = text.substring(instructionsStart);
      const instructionsMatch = instructionsSection.match(/(?:Инструкция|Instructions|Приготовление|Шаги|Steps)[:\s]*\n?([\s\S]+?)(?:\n\n|$)/i);
      if (instructionsMatch) {
        parsedInstructions = instructionsMatch[1]
          .split(/\n(?=\d+[.)]|\d+[.)]|[-•*]|Шаг|Step)/i)
          .filter(line => line.trim())
          .map(line => line.replace(/^\d+[.)]\s*|^[-•*]\s*/, '').trim())
          .filter(Boolean);
      }
    }

    // Извлекаем время
    const timeMatch = text.match(/(?:Время|Time|Готовка)[:\s]*(\d+)[^\d]*(\d+)?/i);
    if (timeMatch) {
      prepTime = parseInt(timeMatch[1]) || prepTime;
      if (timeMatch[2]) {
        cookTime = parseInt(timeMatch[2]);
      }
    }

    // Извлекаем количество порций
    const servingsMatch = text.match(/(?:Порций|Servings|На)[:\s]*(\d+)/i);
    if (servingsMatch) {
      servings = parseInt(servingsMatch[1]) || servings;
    }

    return {
      title: title || 'Вкусное блюдо',
      description: description || 'Рецепт с использованием натуральных продуктов',
      ingredients: parsedIngredients.length > 0 ? parsedIngredients : ingredients,
      instructions: parsedInstructions.length > 0 ? parsedInstructions : this.generateFallbackInstructions(ingredients),
      prepTime: Math.min(prepTime, timeLimit),
      cookTime,
      servings,
      difficulty: difficulty as 'easy' | 'medium' | 'hard',
    };
  }

  private generateFallbackInstructions(ingredients: string[]): string[] {
    return [
      `Подготовьте все ингредиенты: ${ingredients.join(', ')}`,
      'Смешайте ингредиенты в подходящей посуде',
      'Приготовьте согласно вашим предпочтениям',
      'Подавайте блюдо к столу',
    ];
  }

  private generateFallbackRecipe(
    ingredients: string[],
    options: GenerationOptions
  ): GeneratedRecipe {
    const { difficulty = 'easy', timeLimit = 30 } = options;

    const recipeTemplates = {
      easy: {
        title: `Простое блюдо с ${ingredients[0]}`,
        description: `Быстрый и простой рецепт с использованием ${ingredients.join(' и ')}`,
        prepTime: Math.min(15, timeLimit),
        servings: 2,
      },
      medium: {
        title: `Гармоничное блюдо с ${ingredients.slice(0, 2).join(' и ')}`,
        description: `Сбалансированный рецепт с натуральными ингредиентами`,
        prepTime: Math.min(30, timeLimit),
        servings: 4,
      },
      hard: {
        title: `Изысканное блюдо`,
        description: `Сложный рецепт для опытных кулинаров`,
        prepTime: Math.min(60, timeLimit),
        servings: 6,
      },
    };

    const template = recipeTemplates[difficulty as keyof typeof recipeTemplates] || recipeTemplates.easy;

    return {
      title: template.title,
      description: template.description,
      ingredients,
      instructions: this.generateFallbackInstructions(ingredients),
      prepTime: template.prepTime,
      cookTime: 0,
      servings: template.servings,
      difficulty: difficulty as 'easy' | 'medium' | 'hard',
    };
  }
}

export const recipeGenerator = new RecipeGenerator();

