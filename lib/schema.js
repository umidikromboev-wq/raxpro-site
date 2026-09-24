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
        ? 'Toshkentda metall stellajlar va saqlash tizimlari: oʻlchov, loyiha, ombordan yetkazish va montaj. 10 yil kafolat.'
        : 'Металлические стеллажи и системы хранения в Ташкенте: замер, проект, поставка со склада и монтаж. Гарантия 10 лет.',
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
    geo: { '@type': 'GeoCoordinates', latitude: SITE.geo.lat, longitude: SITE.geo.lng },
    hasMap: SITE.mapUrl,
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: SITE.hoursSchema.days,
      opens: SITE.hoursSchema.opens,
      closes: SITE.hoursSchema.closes,
    },
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
    category: lang === 'uz' ? 'Stellajlar va saqlash tizimlari' : 'Стеллажи и системы хранения',
    ...(product.dims
      ? {
          width: { '@type': 'QuantitativeValue', value: product.dims.w, unitCode: 'MMT' },
          height: { '@type': 'QuantitativeValue', value: product.dims.h, unitCode: 'MMT' },
          depth: { '@type': 'QuantitativeValue', value: product.dims.d, unitCode: 'MMT' },
        }
      : {}),
    // Позиции «по проекту» без цены: Offer без price Google не принимает,
    // поэтому размечаем их как товар без предложения.
    ...(typeof product.price === 'number'
      ? {
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
        }
      : {}),
  };
}

// Товар с выбором числа полок: ProductGroup + вариант на каждый SKU.
// URL варианта = ?polki=N — тот же, что в фиде, чтобы Google сверил цену.
export function productGroupSchema(lang, product, variants, nameOf) {
  const base = productOfferSchema(lang, { ...product, price: null });
  const url = absHref(lang, `/katalog/${product.slug}`);
  return {
    '@context': 'https://schema.org',
    '@type': 'ProductGroup',
    name: base.name,
    description: base.description,
    image: base.image,
    brand: base.brand,
    productGroupID: product.slug,
    variesBy: 'https://schema.org/size',
    hasVariant: variants.map((v) => ({
      '@type': 'Product',
      name: nameOf(v.levels),
      sku: v.sku,
      mpn: v.sku,
      image: v.image ? `${SITE_ORIGIN}${v.image}` : base.image[0],
      size: String(v.levels),
      offers: {
        '@type': 'Offer',
        url: `${url}?polki=${v.levels}`,
        priceCurrency: 'UZS',
        price: v.price,
        availability: 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition',
        seller: { '@id': ORG_ID },
      },
    })),
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
