// Генератор фида Google Merchant Center (RSS 2.0 + пространство имён g:).
// Цена, наличие и ссылка обязаны совпадать со страницей товара — иначе
// Merchant Center снимает позицию с показа при сверке.
//
// Доставку намеренно не пишем в фид: g:region принимает только регионы,
// заведённые в Merchant Center, а свободный текст даёт ошибку. Правило
// «Ташкент бесплатно, регионы по расчёту» настраивается в самом аккаунте.
import { PRICED_PRODUCTS, feedPrice, GOOGLE_CATEGORY_ID, variantsOf, variantName } from './products';
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

// v — вариант по числу полок; у товара без variants он один и совпадает с товаром.
function item(product, v, lang, meta) {
  const c = product[lang];
  const isGroup = variantsOf(product).length > 1;
  const base = absHref(lang, `/katalog/${product.slug}`);
  const link = isGroup ? `${base}?polki=${v.levels}` : base;
  const extra = (product.gallery || [])
    .slice(0, 10)
    .map((src) => `      <g:additional_image_link>${esc(SITE_ORIGIN + src)}</g:additional_image_link>`)
    .join('\n');

  // Характеристики уходят отдельными product_detail — Google использует их
  // в карточке товара и для уточняющих фильтров.
  const details = c.specs
    .map((s) => (s.levels ? { ...s, v: String(v.levels) } : s))
    .map(
      (s) =>
        `      <g:product_detail>\n        <g:section_name>${esc(meta.specSection)}</g:section_name>\n        <g:attribute_name>${esc(s.k)}</g:attribute_name>\n        <g:attribute_value>${esc(s.v)}</g:attribute_value>\n      </g:product_detail>`,
    )
    .join('\n');

  return `    <item>
      <g:id>${esc(v.sku)}</g:id>
${isGroup ? `      <g:item_group_id>${esc(product.slug)}</g:item_group_id>\n` : ''}      <g:title>${esc(variantName(product, lang, v.levels).slice(0, 150))}</g:title>
      <g:description>${esc(c.description.slice(0, 5000))}</g:description>
      <g:link>${esc(link)}</g:link>
      <g:image_link>${esc(SITE_ORIGIN + (v.image || product.image))}</g:image_link>
${extra}
      <g:availability>in_stock</g:availability>
      <g:price>${esc(feedPrice(v.price))}</g:price>
      <g:condition>new</g:condition>
      <g:brand>RAXPRO</g:brand>
      <g:mpn>${esc(v.sku)}</g:mpn>
      <g:google_product_category>${GOOGLE_CATEGORY_ID}</g:google_product_category>
      <g:product_type>${esc(meta.productType)}</g:product_type>
${details}
    </item>`;
}

export function buildFeed(lang) {
  const meta = FEED_META[lang] || FEED_META.ru;
  const items = PRICED_PRODUCTS.flatMap((p) => variantsOf(p).map((v) => item(p, v, lang, meta))).join('\n');

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
