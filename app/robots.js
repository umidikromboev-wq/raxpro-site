import { SITE_ORIGIN } from '../lib/lang';

export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
  };
}
