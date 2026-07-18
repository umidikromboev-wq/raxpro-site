/** @type {import('next').NextConfig} */
module.exports = {
  images: { remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }] },
  async redirects() {
    return [
      // Ads and search were surfacing the raw *.vercel.app deployment host instead of
      // raxpro.uz. Sending every vercel.app host to the real domain keeps ads, links
      // and indexing on one origin.
      {
        source: '/:path*',
        has: [{ type: 'host', value: '(?<vercelHost>.*\\.vercel\\.app)' }],
        destination: 'https://raxpro.uz/:path*',
        permanent: true,
      },
    ];
  },
};
