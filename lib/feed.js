// Генератор фида Google Merchant Center (RSS 2.0 + пространство имён g:).
// Цена, наличие и ссылка обязаны совпадать со страницей товара — иначе
// Merchant Center снимает позицию с показа при сверке.
//
// Доставку намеренно не пишем в фид: g:region принимает только регионы,
// заведённые в Merchant Center, а свободный текст даёт ошибку. Правило
// «Ташкент бесплатно, регионы по расчёту» настраивается в самом аккаунте.
import { PRODUCTS, feedPrice, GOOGLE_CATEGORY_ID } from './products';
import { absHref, SITE_ORIGIN } from './lang';

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const FEED_META = {
  ru: {
    title: 'RAXPRO — стеллажи и системы хранения',
    description: 'Каталог металлических стеллажей RAXPRO с ценами. Ташкент, Узбекистан.',
    productType: 'Стеллажи и системы хранения',
    specSection: 'Характеристики',
  },
  uz: {
    title: 'RAXPRO — stellajlar va saqlash tizimlari',
    description: 'RAXPRO metall stellajlari katalogi va narxlari. Toshkent, Oʻzbekiston.',
    productType: 'Stellajlar va saqlash tizimlari',
    specSection: 'Xususiyatlari',
  },
};

function item(product, lang, meta) {
  const c = product[lang];
  const link = absHref(lang, `/katalog/${product.slug}`);
  const extra = (product.gallery || [])
    .slice(0, 10)
    .map((src) => `      <g:additional_image_link>${esc(SITE_ORIGIN + src)}</g:additional_image_link>`)
    .join('\n');

  // Характеристики уходят отдельными product_detail — Google использует их
  // в карточке товара и для уточняющих фильтров.
  const details = c.specs
    .map(
      (s) =>
        `      <g:product_detail>\n        <g:section_name>${esc(meta.specSection)}</g:section_name>\n        <g:attribute_name>${esc(s.k)}</g:attribute_name>\n        <g:attribute_value>${esc(s.v)}</g:attribute_value>\n      </g:product_detail>`,
    )
    .join('\n');

  return `    <item>
      <g:id>${esc(product.sku)}</g:id>
      <g:title>${esc(c.name.slice(0, 150))}</g:title>
      <g:description>${esc(c.description.slice(0, 5000))}</g:description>
      <g:link>${esc(link)}</g:link>
      <g:image_link>${esc(SITE_ORIGIN + product.image)}</g:image_link>
${extra}
      <g:availability>in_stock</g:availability>
      <g:price>${esc(feedPrice(product.price))}</g:price>
      <g:condition>new</g:condition>
      <g:brand>RAXPRO</g:brand>
      <g:mpn>${esc(product.sku)}</g:mpn>
      <g:google_product_category>${GOOGLE_CATEGORY_ID}</g:google_product_category>
      <g:product_type>${esc(meta.productType)}</g:product_type>
${details}
    </item>`;
}

export function buildFeed(lang) {
  const meta = FEED_META[lang] || FEED_META.ru;
  const items = PRODUCTS.map((p) => item(p, lang, meta)).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${esc(meta.title)}</title>
    <link>${esc(absHref(lang, '/katalog'))}</link>
    <description>${esc(meta.description)}</description>
${items}
  </channel>
</rss>
`;
}
