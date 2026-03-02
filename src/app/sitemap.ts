import { MetadataRoute } from 'next';
import { products } from '@/data/products';
import { recipes } from '@/data/recipes';

const baseUrl = process.env.NEXTAUTH_URL || 'https://latvbelfruits.by';

export default function sitemap(): MetadataRoute.Sitemap {
  // Статические страницы
  const routes = [
    '',
    '/about',
    '/products',
    '/recipes',
    '/blog',
    '/contacts',
    '/stores',
    '/b2b',
    '/gifts',
    '/reviews',
    '/faq',
    '/docs',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Динамические страницы товаров
  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Динамические страницы рецептов
  const recipeRoutes = recipes.map((recipe) => ({
    url: `${baseUrl}/recipes/${recipe.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...routes, ...productRoutes, ...recipeRoutes];
}
