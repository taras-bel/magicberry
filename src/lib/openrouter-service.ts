// Сервис для работы с OpenRouter API
// Использует модель xiaomi/mimo-v2-flash:free

interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
}

interface OpenRouterResponse {
  id: string;
  model: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class OpenRouterService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://openrouter.ai/api/v1/chat/completions';
  private readonly model = 'xiaomi/mimo-v2-flash:free';

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || '';
    if (!this.apiKey) {
      console.warn('⚠️  OPENROUTER_API_KEY не установлен');
    }
  }

  async generateText(
    prompt: string,
    systemPrompt?: string,
    options: {
      temperature?: number;
      maxTokens?: number;
      topP?: number;
    } = {}
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key is not configured');
    }

    const messages: OpenRouterMessage[] = [];

    if (systemPrompt) {
      messages.push({
        role: 'system',
        content: systemPrompt,
      });
    }

    messages.push({
      role: 'user',
      content: prompt,
    });

    const requestBody: OpenRouterRequest = {
      model: this.model,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 2048,
      top_p: options.topP ?? 0.9,
    };

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': process.env.NEXTAUTH_URL || 'http://localhost:3000',
          'X-Title': 'Latvbelfruits Recipe Assistant',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenRouter API error:', response.status, errorText);
        throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
      }

      const data: OpenRouterResponse = await response.json();

      if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content;
      }

      throw new Error('No response from OpenRouter API');
    } catch (error) {
      console.error('Error calling OpenRouter API:', error);
      throw error;
    }
  }

  async generateRecipe(ingredients: string[], options: {
    cuisine?: string;
    difficulty?: string;
    timeLimit?: number;
    style?: string;
  } = {}): Promise<string> {
    const { cuisine = 'российская', difficulty = 'easy', timeLimit = 30, style } = options;

    const systemPrompt = `Ты профессиональный повар-консультант компании Latvbelfruits, специализирующейся на натуральных вяленых ягодах, фруктах и овощах. 

Твоя задача - создавать практичные, подробные и вкусные рецепты, которые подчеркивают качество натуральных продуктов Latvbelfruits.

ВАЖНЫЕ ТРЕБОВАНИЯ К ФОРМАТУ ОТВЕТА:
1. Название блюда - должно быть конкретным и привлекательным
2. Описание - краткое (1-2 предложения), описывающее блюдо
3. Ингредиенты - точный список с КОЛИЧЕСТВОМ (в граммах, штуках, столовых ложках и т.д.)
   - Если в списке есть продукты Latvbelfruits (вяленые ягоды, фрукты, овощи, сиропы), указывай их полное название: "Вяленая клюква от Latvbelfruits", "Натуральный ягодный сироп от Latvbelfruits"
   - Обычные ингредиенты (сахар, мука и т.д.) указывай без бренда
4. Инструкции - пошаговые, четкие и понятные
5. Время приготовления - в минутах (подготовка + готовка)
6. Количество порций - конкретное число
7. Сложность - легкий/средний/сложный

Стиль: практичный, понятный, с акцентом на натуральность и пользу продуктов.`;

    const difficultyText = {
      'easy': 'легкий',
      'medium': 'средний',
      'hard': 'сложный'
    }[difficulty] || 'легкий';

    const styleText = style ? {
      'dessert': 'десерт',
      'drink': 'напиток',
      'breakfast': 'завтрак',
      'baking': 'выпечка'
    }[style] || style : null;

    let userPrompt = `Создай детальный рецепт блюда используя следующие ингредиенты: ${ingredients.join(', ')}.

Требования:
- Кухня: ${cuisine}
- Сложность: ${difficultyText}
- Время приготовления: не более ${timeLimit} минут${styleText ? `\n- Тип блюда: ${styleText}` : ''}

ВАЖНО: Если в рецепте используются продукты Latvbelfruits (вяленые ягоды, фрукты, овощи или сиропы), обязательно указывай их с упоминанием бренда "от Latvbelfruits" в списке ингредиентов.

Создай рецепт в следующем формате:

Название: [название блюда]
Описание: [краткое описание]

Ингредиенты:
- [ингредиент с количеством]
- [если продукт Latvbelfruits, то: Вяленая клюква от Latvbelfruits - 50г]
- [и так далее]

Инструкции:
1. [первый шаг]
2. [второй шаг]
[и так далее]

Время приготовления: [X] минут
Порций: [X]
Сложность: [${difficultyText}]`;

    return this.generateText(userPrompt, systemPrompt, {
      temperature: 0.7,
      maxTokens: 2500,
    });
  }

  async processChatMessage(
    message: string,
    context?: string[]
  ): Promise<string> {
    const systemPrompt = `Ты виртуальный помощник Latvbelfruits - магазина натуральных вяленых ягод, фруктов и овощей. 

Твоя задача:
- Помогать пользователям с выбором продуктов
- Предлагать рецепты на основе доступных продуктов
- Отвечать на вопросы о здоровом питании
- Быть дружелюбным, профессиональным и полезным

Всегда старайся быть конкретным и практичным в советах.`;

    let userPrompt = message;

    if (context && context.length > 0) {
      userPrompt = `Контекст: ${context.join('; ')}\n\nВопрос: ${message}`;
    }

    return this.generateText(userPrompt, systemPrompt, {
      temperature: 0.7,
      maxTokens: 1024,
    });
  }
}

export const openRouterService = new OpenRouterService();

