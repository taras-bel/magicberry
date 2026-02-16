import { createRequire } from 'module';

const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Оптимизации изображений
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: (() => {
      const url = process.env.NEXT_PUBLIC_CMS_URL;
      if (!url) return [];
      try {
        const u = new URL(url);
        return [
          {
            protocol: u.protocol.replace(':', ''),
            hostname: u.hostname,
            pathname: '/**',
          },
        ];
      } catch {
        return [];
      }
    })(),
  },

  // SEO оптимизации
  experimental: {
    optimizeCss: false,
  },

  // Безопасность
  poweredByHeader: false,

  // Webpack конфигурация для ML моделей
  webpack: (config, { isServer }) => {
    // На сервере разрешаем нативные модули для ML
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        // Редирект нативных модулей для работы в Node.js
        'sharp': false,
        '@xenova/transformers': require.resolve('@xenova/transformers'),
      };

      // Разрешаем загрузку .node файлов
      config.externals.push({
        'onnxruntime-node': 'commonjs onnxruntime-node',
        'sharp': 'commonjs sharp',
      });
    }

    // Исключаем ML зависимости из клиентского бандла
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };

      config.externals = config.externals || [];
      config.externals.push({
        '@xenova/transformers': 'commonjs @xenova/transformers',
      });
    }

    return config;
  },

  // Кэширование
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
