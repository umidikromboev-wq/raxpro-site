// Разметка schema.org. Держим в одном месте, чтобы данные о компании
// не расходились между страницами.
import { SITE, siteLoc } from './site';
import { absHref, SITE_ORIGIN } from './lang';

const ORG_ID = `${SITE_ORIGIN}/#organization`;

export function organizationSchema(lang) {
  const loc = siteLoc(lang);
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': ORG_ID,
    name: 'RAXPRO',
    url: absHref(lang, '/'),
    logo: `${SITE_ORIGIN}/brand/raxpro-logo.png`,
    image: `${SITE_ORIGIN}/works/hero.jpg`,
    description:
      lang === 'uz'
        ? 'Toshkentda metall stellajlar va saqlash tizimlari: oʻlchov, loyihalash, ishlab chiqarish va montaj. 10 yil kafolat.'
        : 'Металлические стеллажи и системы хранения в Ташкенте: замер, проектирование, производство и монтаж. Гарантия 10 лет.',
    telephone: SITE.phoneMain,
    email: SITE.emails[0],
    priceRange: 'UZS',
    address: {
      '@type': 'PostalAddress',
      streetAddress: loc.address,
      addressLocality: loc.addressCity,
      addressCountry: 'UZ',
    },
    areaServed: { '@type': 'Country', name: 'Uzbekistan' },
    openingHours: 'Mo-Sa 09:00-18:00',
    sameAs: [SITE.instagram, SITE.telegram, SITE.reviewsChannel],
  };
}

// Хлебные крошки: items — [{ name, path }], path без языкового префикса.
export function breadcrumbSchema(lang, items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absHref(lang, it.path),
    })),
  };
}

export function productSchema(lang, direction) {
  const c = direction[lang];
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: c.name,
    description: c.seoDesc,
    image: `${SITE_ORIGIN}${direction.cover}`,
    brand: { '@type': 'Brand', name: 'RAXPRO' },
    manufacturer: { '@id': ORG_ID },
    category: lang === 'uz' ? 'Stellajlar va saqlash tizimlari' : 'Стеллажи и системы хранения',
  };
}

// Товар каталога с ценой. Цена и наличие здесь обязаны совпадать с фидом
// Merchant Center и с тем, что видит покупатель на странице, иначе
// Google снимает товар с показа.
export function productOfferSchema(lang, product) {
  const c = product[lang];
  const images = [product.image, ...(product.gallery || [])].map((src) => `${SITE_ORIGIN}${src}`);

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: c.name,
    description: c.description,
    image: images,
    sku: product.sku,
    mpn: product.sku,
    brand: { '@type': 'Brand', name: 'RAXPRO' },
    manufacturer: { '@id': ORG_ID },
    category: lang === 'uz' ? 'Stellajlar va saqlash tizimlari' : 'Стеллажи и системы хранения',
    width: { '@type': 'QuantitativeValue', value: product.dims.w, unitCode: 'MMT' },
    height: { '@type': 'QuantitativeValue', value: product.dims.h, unitCode: 'MMT' },
    depth: { '@type': 'QuantitativeValue', value: product.dims.d, unitCode: 'MMT' },
    offers: {
      '@type': 'Offer',
      url: absHref(lang, `/katalog/${product.slug}`),
      priceCurrency: 'UZS',
      price: product.price,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@id': ORG_ID },
      areaServed: { '@type': 'Country', name: 'Uzbekistan' },
    },
  };
}

export function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
