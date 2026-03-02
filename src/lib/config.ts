// Конфигурационный файл для всех API ключей и внешних сервисов
// Заполните значения ниже для включения соответствующих функций

export const config = {
  // NextAuth.js
  nextauth: {
    secret: process.env.NEXTAUTH_SECRET || 'your-nextauth-secret-here',
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  },

  // Google OAuth
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  },

  // Facebook OAuth
  facebook: {
    clientId: process.env.FACEBOOK_CLIENT_ID || '',
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
  },

  // GitHub OAuth
  github: {
    clientId: process.env.GITHUB_CLIENT_ID || '',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
  },

  // Email service
  email: {
    from: process.env.EMAIL_FROM || 'noreply@latvbelfruits.com',
    adminEmail: process.env.ADMIN_EMAIL || 'Latvbelfruits@mail.ru',
    server: {
      host: process.env.EMAIL_SERVER_HOST || '',
      port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
      user: process.env.EMAIL_SERVER_USER || '',
      password: process.env.EMAIL_SERVER_PASSWORD || '',
    },
  },

  // External recipe APIs
  recipes: {
    // Spoonacular API для поиска рецептов
    spoonacular: {
      apiKey: process.env.SPOONACULAR_API_KEY || '',
    },

    // Google Custom Search API
    googleSearch: {
      apiKey: process.env.GOOGLE_SEARCH_API_KEY || '',
      searchEngineId: process.env.GOOGLE_SEARCH_ENGINE_ID || '',
    },

    // OpenAI API (опционально, для улучшенной генерации)
    openai: {
      apiKey: process.env.OPENAI_API_KEY || '',
    },

    // OpenRouter API (для AI модели)
    openrouter: {
      apiKey: process.env.OPENROUTER_API_KEY || '',
    },
  },

  // Database
  database: {
    url: process.env.DATABASE_URL || 'file:./dev.db',
  },

  // CMS
  cms: {
    url: process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:1337',
  },

  // Analytics
  analytics: {
    ga4: process.env.GA4_TRACKING_ID || '',
  },
};

// Вспомогательные функции для проверки конфигурации
export const isConfigured = {
  googleOAuth: () => !!(config.google.clientId && config.google.clientSecret),
  facebookOAuth: () => !!(config.facebook.clientId && config.facebook.clientSecret),
  githubOAuth: () => !!(config.github.clientId && config.github.clientSecret),
  email: () => !!(config.email.server.host && config.email.server.user),
  spoonacular: () => !!config.recipes.spoonacular.apiKey,
  googleSearch: () => !!(config.recipes.googleSearch.apiKey && config.recipes.googleSearch.searchEngineId),
  openai: () => !!config.recipes.openai.apiKey,
  openrouter: () => !!config.recipes.openrouter.apiKey,
  analytics: () => !!config.analytics.ga4,
};

// Функции для логирования неподключенных сервисов
export const logMissingServices = () => {
  console.log('🔧 Конфигурация сервисов:');

  if (!isConfigured.googleOAuth()) {
    console.log('⚠️  Google OAuth не настроен - социальная аутентификация через Google недоступна');
  } else {
    console.log('✅ Google OAuth настроен');
  }

  if (!isConfigured.facebookOAuth()) {
    console.log('⚠️  Facebook OAuth не настроен - социальная аутентификация через Facebook недоступна');
  } else {
    console.log('✅ Facebook OAuth настроен');
  }

  if (!isConfigured.githubOAuth()) {
    console.log('⚠️  GitHub OAuth не настроен - социальная аутентификация через GitHub недоступна');
  } else {
    console.log('✅ GitHub OAuth настроен');
  }

  if (!isConfigured.email()) {
    console.log('⚠️  Email сервис не настроен - отправка писем недоступна');
  } else {
    console.log('✅ Email сервис настроен');
  }

  if (!isConfigured.spoonacular()) {
    console.log('⚠️  Spoonacular API не настроен - поиск рецептов в интернете ограничен');
  } else {
    console.log('✅ Spoonacular API настроен');
  }

  if (!isConfigured.googleSearch()) {
    console.log('⚠️  Google Search API не настроен - веб-поиск рецептов недоступен');
  } else {
    console.log('✅ Google Search API настроен');
  }

  if (!isConfigured.openai()) {
    console.log('⚠️  OpenAI API не настроен - используется локальная генерация рецептов');
  } else {
    console.log('✅ OpenAI API настроен');
  }

  if (!isConfigured.openrouter()) {
    console.log('⚠️  OpenRouter API не настроен - AI функции недоступны');
  } else {
    console.log('✅ OpenRouter API настроен (xiaomi/mimo-v2-flash:free)');
  }

  if (!isConfigured.analytics()) {
    console.log('⚠️  Google Analytics не настроен - аналитика не работает');
  } else {
    console.log('✅ Google Analytics настроен');
  }
};
