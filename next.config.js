/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      // Реклама и выдача показывали сырой хост *.vercel.app вместо raxpro.uz.
      // Отправляем любой такой хост на настоящий домен, чтобы ссылки,
      // объявления и индексация жили на одном адресе.
      {
        source: '/:path*',
        has: [{ type: 'host', value: '(?<vercelHost>.*\\.vercel\\.app)' }],
        destination: 'https://raxpro.uz/:path*',
        permanent: true,
      },
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
