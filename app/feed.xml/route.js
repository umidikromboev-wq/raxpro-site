import { buildFeed } from '../../lib/feed';

// Русский фид товаров для Google Merchant Center: https://raxpro.uz/feed.xml
export const dynamic = 'force-static';

export function GET() {
  return new Response(buildFeed('ru'), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
