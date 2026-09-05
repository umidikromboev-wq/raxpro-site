/** @type {import('next').NextConfig} */
module.exports = {
  // chromium для выпуска PDF не должен попадать в бандл: это бинарник,
  // Next обязан подключить его как внешний пакет на сервере.
  serverExternalPackages: ['@sparticuz/chromium', 'puppeteer-core'],
  // Трассировка не видит бинарник chromium: он лежит архивом в bin/ и
  // подключается по строке пути, а не импортом. Без явного include функция
  // уезжает на Vercel без браузера.
  outputFileTracingIncludes: {
    '/api/kp/pdf': ['./node_modules/@sparticuz/chromium/bin/**'],
  },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      // Реклама и выдача показывали сырой хост *.vercel.app вместо raxpro.uz.
      // Отправляем любой такой хост на настоящий домен, чтобы ссылки,
      // объявления и индексация жили на одном адресе.
      // Только для боевой сборки: preview-деплои веток должны открываться
      // по своему адресу, иначе их нельзя проверить до выката.
      ...(process.env.VERCEL_ENV === 'production'
        ? [
            {
              source: '/:path*',
              has: [{ type: 'host', value: '(?<vercelHost>.*\\.vercel\\.app)' }],
              destination: 'https://raxpro.uz/:path*',
              permanent: true,
            },
          ]
        : []),
      // Язык переехал в путь. Старые проиндексированные адреса без префикса
      // ведут на русскую версию — вес и позиции переходят вместе с 308.
      { source: '/', destination: '/ru', permanent: true },
      { source: '/blog', destination: '/ru/blog', permanent: true },
      { source: '/blog/:slug', destination: '/ru/blog/:slug', permanent: true },
      { source: '/napravleniya/:slug', destination: '/ru/napravleniya/:slug', permanent: true },
      { source: '/experts', destination: '/ru/experts', permanent: true },
      { source: '/thank-you', destination: '/ru/thank-you', permanent: true },
    ];
  },
};
