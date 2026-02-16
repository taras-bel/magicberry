// AI система рекомендаций на основе предпочтений пользователя

import { products } from '@/data/products';

// Типы для рекомендаций
export interface ProductRecommendation {
  product: typeof products[0];
  score: number;
  reason: string;
}

export interface UserPreferences {
  viewedProducts: string[];
  purchasedProducts: string[];
  favoriteCategories: string[];
  averageRating: number;
  priceRange: { min: number; max: number };
}

// Класс для рекомендаций
class AIRecommendationService {
  private isInitialized = false;

  // Инициализация (просто установка флага)
  async initialize() {
    if (this.isInitialized) return;
    this.isInitialized = true;
    console.log('Система рекомендаций готова');
  }

  // Получение предпочтений пользователя
  async getUserPreferences(userId: string): Promise<UserPreferences> {
    // В реальном приложении здесь был бы запрос к базе данных
    // Пока возвращаем тестовые данные
    return {
      viewedProducts: [],
      purchasedProducts: [],
      favoriteCategories: ['berries', 'dried-fruits'],
      averageRating: 4.5,
      priceRange: { min: 5, max: 50 }
    };
  }

  // Основная функция рекомендаций
  async getRecommendations(
    userId: string,
    currentProductId?: string,
    limit: number = 6
  ): Promise<ProductRecommendation[]> {
    try {
      // Пытаемся использовать ML API
      const mlResponse = await this.getMLRecommendations(userId, limit);

      if (mlResponse && mlResponse.length > 0) {
        return mlResponse.map(rec => ({
          product: rec.product,
          score: rec.score,
          reason: rec.reason
        }));
      }
    } catch (error) {
      console.error('ML recommendations failed, using fallback:', error);
    }

    // Fallback к rule-based системе
    await this.initialize();

    try {
      const userPrefs = await this.getUserPreferences(userId);

      if (this.isInitialized) {
        return this.getSmartRecommendations(userPrefs, currentProductId, limit);
      } else {
        return this.getFallbackRecommendations(userPrefs, currentProductId, limit);
      }
    } catch (error) {
      console.error('Ошибка получения рекомендаций:', error);
      return this.getFallbackRecommendations(await this.getUserPreferences(userId), currentProductId, limit);
    }
  }

  // Получение рекомендаций через ML API
  private async getMLRecommendations(userId: string, limit: number): Promise<any[]> {
    try {
      // Получаем доступные продукты пользователя
      const userPrefs = await this.getUserPreferences(userId);
      const userProducts = userPrefs.purchasedProducts; // Можно расширить для корзины и избранного

      const response = await fetch('/api/ml/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProducts,
          userPreferences: {
            categories: userPrefs.favoriteCategories,
            priceRange: userPrefs.priceRange
          },
          limit
        })
      });

      if (!response.ok) {
        throw new Error('ML API request failed');
      }

      const data = await response.json();
      return data.recommendations || [];
    } catch (error) {
      console.error('Error calling ML API:', error);
      throw error;
    }
  }

  // Умные рекомендации на основе предпочтений
  private getSmartRecommendations(
    userPrefs: UserPreferences,
    currentProductId?: string,
    limit: number = 6
  ): ProductRecommendation[] {
    const recommendations: ProductRecommendation[] = [];
    const usedProducts = new Set([currentProductId]);

    // 1. Рекомендуем продукты из любимых категорий
    for (const category of userPrefs.favoriteCategories) {
      const categoryProducts = products
        .filter(p => p.category === category && !usedProducts.has(p.id))
        .sort((a, b) => (b.rating || 0) - (a.rating || 0)); // Сортируем по рейтингу

      for (const product of categoryProducts.slice(0, 2)) {
        recommendations.push({
          product,
          score: 0.9,
          reason: `Рекомендуем из любимой категории "${category}"`
        });
        usedProducts.add(product.id);

        if (recommendations.length >= limit) break;
      }

      if (recommendations.length >= limit) break;
    }

    // 2. Добавляем продукты в подходящем ценовом диапазоне
    if (recommendations.length < limit) {
      const priceProducts = products
        .filter(p =>
          !usedProducts.has(p.id) &&
          p.priceFrom !== undefined &&
          p.priceFrom >= userPrefs.priceRange.min &&
          p.priceFrom <= userPrefs.priceRange.max
        )
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, limit - recommendations.length);

      for (const product of priceProducts) {
        recommendations.push({
          product,
          score: 0.7,
          reason: 'В вашем ценовом диапазоне'
        });
      }
    }

    // 3. Добавляем популярные продукты, если не хватает
    if (recommendations.length < limit) {
      const popularProducts = products
        .filter(p => !usedProducts.has(p.id))
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, limit - recommendations.length);

      for (const product of popularProducts) {
        recommendations.push({
          product,
          score: 0.5,
          reason: 'Популярный продукт среди покупателей'
        });
      }
    }

    return recommendations;
  }

  // Fallback рекомендации без AI
  private getFallbackRecommendations(
    userPrefs: UserPreferences,
    currentProductId?: string,
    limit: number = 6
  ): ProductRecommendation[] {
    const recommendations: ProductRecommendation[] = [];
    const usedProducts = new Set([currentProductId]);

    // Рекомендуем продукты из любимых категорий
    for (const category of userPrefs.favoriteCategories) {
      const categoryProducts = products.filter(p =>
        p.category === category && !usedProducts.has(p.id)
      );

      for (const product of categoryProducts.slice(0, 2)) {
        recommendations.push({
          product,
          score: 0.8,
          reason: `Популярный продукт из категории "${category}"`
        });
        usedProducts.add(product.id);

        if (recommendations.length >= limit) break;
      }

      if (recommendations.length >= limit) break;
    }

    // Добавляем популярные продукты, если не хватает
    if (recommendations.length < limit) {
      const popularProducts = products
        .filter(p => !usedProducts.has(p.id))
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, limit - recommendations.length);

      for (const product of popularProducts) {
        recommendations.push({
          product,
          score: 0.6,
          reason: 'Популярный продукт среди покупателей'
        });
      }
    }

    return recommendations;
  }

  // Получение похожих продуктов (для страницы продукта)
  async getSimilarProducts(productId: string, limit: number = 4): Promise<ProductRecommendation[]> {
    await this.initialize();

    const currentProduct = products.find(p => p.id === productId);
    if (!currentProduct) return [];

    // Рекомендуем продукты из той же категории
    const similarProducts = products
      .filter(p => p.id !== productId && p.category === currentProduct.category)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0)) // Сортируем по рейтингу
      .slice(0, limit)
      .map(product => ({
        product,
        score: 0.8,
        reason: `Похожий продукт из категории "${currentProduct.category}"`
      }));

    // Если не хватает похожих продуктов, добавляем популярные из других категорий
    if (similarProducts.length < limit) {
      const additionalProducts = products
        .filter(p => p.id !== productId && p.category !== currentProduct.category)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, limit - similarProducts.length)
        .map(product => ({
          product,
          score: 0.5,
          reason: 'Популярный продукт'
        }));

      similarProducts.push(...additionalProducts);
    }

    return similarProducts;
  }

  // Получение персональных рекомендаций для главной страницы
  async getPersonalizedRecommendations(userId: string, limit: number = 8): Promise<ProductRecommendation[]> {
    return await this.getRecommendations(userId, undefined, limit);
  }

  // Обновление предпочтений пользователя (вызывается при взаимодействии)
  async updateUserPreferences(
    userId: string,
    action: 'view' | 'purchase' | 'like' | 'review',
    productId: string
  ) {
    // В реальном приложении здесь сохранялись бы данные в базу
    console.log(`User ${userId} ${action} product ${productId}`);
  }
}

// Экспорт единственного экземпляра сервиса
export const aiRecommendationService = new AIRecommendationService();