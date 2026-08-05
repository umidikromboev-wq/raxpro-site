import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import LeadForm from "../../../components/LeadForm";
import AddToCart from "../../../components/AddToCart";
import { IcoArrow, IcoCheck } from "../../../components/Icons";
import { PRODUCTS, formatPrice } from "../../../lib/products";
import { SHOP } from "../../../lib/shop";
import { normalizeLang } from "../../../lib/i18n";
import { alternatesFor, href, absHref } from "../../../lib/lang";
import { breadcrumbSchema, JsonLd } from "../../../lib/schema";

export async function generateMetadata({ params }) {
  const L = normalizeLang((await params).lang);
  const t = SHOP[L];
  return {
    title: t.catalogSeoTitle,
    description: t.catalogSeoDesc,
    alternates: alternatesFor("/katalog", L),
    openGraph: {
      title: t.catalogSeoTitle,
      description: t.catalogSeoDesc,
      type: "website",
      images: [PRODUCTS[0].image],
    },
  };
}

// Список товаров размечаем ItemList — так Google связывает страницы каталога
// с позициями фида Merchant Center.
function itemListSchema(lang) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: PRODUCTS.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absHref(lang, `/katalog/${p.slug}`),
      name: p[lang].name,
    })),
  };
}

export default async function CatalogPage({ params }) {
  const L = normalizeLang((await params).lang);
  const t = SHOP[L];

  const crumbs = breadcrumbSchema(L, [
    { name: t.home, path: "/" },
    { name: t.catalog, path: "/katalog" },
  ]);

  return (
    <div className="bg-white text-ink">
      <JsonLd data={crumbs} />
      <JsonLd data={itemListSchema(L)} />
      <Header lang={L} />

      <section className="relative pt-28 pb-14 bg-navy-900 text-white overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-20" />
        <div className="relative w-full px-5 sm:px-8 lg:px-14 2xl:px-24">
          <nav className="text-sm text-cloud-200/60 mb-4">
            <a href={href(L, "/")} className="hover:text-sky-400">
              {t.home}
            </a>
            <span className="mx-1.5">/</span>
            <span className="text-cloud-200">{t.catalog}</span>
          </nav>
          <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-8 items-end">
            <h1 className="font-display font-medium text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-[1.08]">
              {t.catalogTitle}
            </h1>
            <p className="text-lg text-cloud-200/85 leading-relaxed">
              {t.catalogLead}
            </p>
          </div>
        </div>
      </section>

      {/* Сетка товаров */}
      <section className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-14">
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {PRODUCTS.map((p) => {
            const c = p[L];
            return (
              <article
                key={p.slug}
                className="group flex flex-col rounded-xl2 bg-white border border-cloud-200 shadow-card hover:shadow-card-hover transition overflow-hidden"
              >
                <a
                  href={href(L, `/katalog/${p.slug}`)}
                  className="block bg-cloud-50 p-6"
                >
                  <img
                    src={p.image}
                    alt={c.name}
                    width={1200}
                    height={1200}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-56 object-contain group-hover:scale-[1.04] transition duration-500"
                  />
                </a>

                <div className="flex flex-col flex-1 p-6">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {t.inStock}
                    </span>
                    <span className="text-slate-400">
                      {t.sku}: {p.sku}
                    </span>
                  </div>

                  <h2 className="mt-3 font-semibold text-navy-800 leading-snug">
                    <a
                      href={href(L, `/katalog/${p.slug}`)}
                      className="hover:text-sky-600"
                    >
                      {c.name}
                    </a>
                  </h2>

                  <dl className="mt-4 space-y-1.5 text-sm">
                    {c.specs.slice(0, 4).map((s) => (
                      <div key={s.k} className="flex items-baseline gap-2">
                        <dt className="text-slate-400 shrink-0">{s.k}</dt>
                        <span className="flex-1 border-b border-dashed border-cloud-200 translate-y-[-3px]" />
                        <dd className="text-navy-800 font-medium shrink-0">
                          {s.v}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-auto pt-6">
                    <div className="font-display font-medium text-2xl text-navy-800">
                      {formatPrice(p.price, L)}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2.5">
                      <AddToCart
                        product={p}
                        lang={L}
                        className="flex-1 min-w-[140px] !py-3"
                      />
                      <a
                        href={href(L, `/katalog/${p.slug}`)}
                        className="inline-flex items-center justify-center gap-2 border border-navy-900/15 text-navy-800 hover:border-sky-500 hover:text-sky-600 font-semibold px-5 py-3 rounded-xl transition"
                      >
                        {t.more}
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Что входит в цену — снимает главный вопрос перед заказом */}
        <div className="mt-12 rounded-xl2 bg-cloud-50 border border-cloud-200 p-7">
          <h2 className="font-display font-medium text-xl text-navy-800">
            {t.whatIncluded}
          </h2>
          <ul className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {t.included.map((i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-slate-700 text-sm leading-relaxed"
              >
                <span className="w-6 h-6 rounded-full bg-sky-600/10 text-sky-600 grid place-items-center shrink-0">
                  <IcoCheck className="w-4 h-4" />
                </span>
                {i}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Нестандартный размер */}
      <section id="zayavka" className="relative bg-navy-900 overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-20" />
        <div className="relative w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-14 grid lg:grid-cols-2 gap-10 items-center">
          <div className="text-white">
            <h2 className="font-display font-medium text-3xl sm:text-4xl tracking-tight">
              {t.otherSize}
            </h2>
            <p className="mt-4 text-cloud-200/80 max-w-lg leading-relaxed">
              {t.otherSizeText}
            </p>
            <a
              href={href(L, "/") + "#napravleniya"}
              className="mt-6 inline-flex items-center gap-2 text-sky-300 hover:text-white font-semibold"
            >
              {L === "uz" ? "Barcha stellaj turlari" : "Все типы стеллажей"}
              <IcoArrow className="w-5 h-5" />
            </a>
          </div>
          <div className="w-full max-w-md lg:justify-self-end">
            <LeadForm lang={L} />
          </div>
        </div>
      </section>

      <Footer lang={L} />
    </div>
  );
}
