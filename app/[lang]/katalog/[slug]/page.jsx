import { notFound } from "next/navigation";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import AddToCart from "../../../../components/AddToCart";
import LeadForm from "../../../../components/LeadForm";
import { IcoCheck, IcoArrow } from "../../../../components/Icons";
import { PRODUCTS, getProduct, formatPrice } from "../../../../lib/products";
import { getDirection } from "../../../../lib/directions";
import { SHOP } from "../../../../lib/shop";
import { normalizeLang } from "../../../../lib/i18n";
import { alternatesFor, href, LANGS } from "../../../../lib/lang";
import {
  breadcrumbSchema,
  productOfferSchema,
  JsonLd,
} from "../../../../lib/schema";

export function generateStaticParams() {
  return LANGS.flatMap((lang) => PRODUCTS.map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({ params }) {
  const { slug, lang } = await params;
  const p = getProduct(slug);
  if (!p) return { title: "Страница не найдена | RAXPRO" };
  const L = normalizeLang(lang);
  const c = p[L];
  return {
    title: c.seoTitle,
    description: c.seoDesc,
    alternates: alternatesFor(`/katalog/${p.slug}`, L),
    openGraph: {
      title: c.seoTitle,
      description: c.seoDesc,
      type: "website",
      images: [p.image],
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug, lang } = await params;
  const p = getProduct(slug);
  if (!p) notFound();

  const L = normalizeLang(lang);
  const c = p[L];
  const t = SHOP[L];
  const direction = getDirection(p.directionSlug);
  const others = PRODUCTS.filter((x) => x.slug !== p.slug);

  const crumbs = breadcrumbSchema(L, [
    { name: t.home, path: "/" },
    { name: t.catalog, path: "/katalog" },
    { name: c.short, path: `/katalog/${p.slug}` },
  ]);

  return (
    <div className="bg-white text-ink">
      <JsonLd data={crumbs} />
      <JsonLd data={productOfferSchema(L, p)} />
      <Header lang={L} />

      <div className="pt-24">
        <div className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-5">
          <nav className="text-sm text-slate-400">
            <a href={href(L, "/")} className="hover:text-sky-600">
              {t.home}
            </a>
            <span className="mx-1.5">/</span>
            <a href={href(L, "/katalog")} className="hover:text-sky-600">
              {t.catalog}
            </a>
            <span className="mx-1.5">/</span>
            <span className="text-navy-800">{c.short}</span>
          </nav>
        </div>
      </div>

      {/* ГЛАВНЫЙ БЛОК: фото + цена + покупка */}
      <section className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 pb-14 grid lg:grid-cols-[1fr,0.85fr] gap-10 items-start">
        <div>
          <div className="rounded-xl2 bg-cloud-50 border border-cloud-200 p-8">
            <img
              src={p.image}
              alt={c.name}
              width={1200}
              height={1200}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="w-full h-auto max-h-[520px] object-contain"
            />
          </div>
          {p.gallery?.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              {p.gallery.map((src, i) => (
                <div
                  key={src}
                  className="rounded-xl2 overflow-hidden border border-cloud-200 bg-cloud-100"
                >
                  <img
                    src={src}
                    alt={`${c.name} — ${i + 1}`}
                    width={1200}
                    height={900}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-48 object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-28">
          <div className="flex items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {t.inStock}
            </span>
            <span className="text-slate-400">
              {t.sku}: {p.sku}
            </span>
          </div>

          <h1 className="mt-3 font-display font-medium text-2xl sm:text-3xl lg:text-4xl text-navy-800 tracking-tight leading-[1.12]">
            {c.name}
          </h1>
          <p className="mt-4 text-slate-600 leading-relaxed">{c.lead}</p>

          <div className="mt-7 rounded-xl2 border border-cloud-200 bg-white shadow-card p-6">
            <div className="text-sm text-slate-400">{t.from}</div>
            <div className="font-display font-medium text-4xl text-navy-800 mt-1">
              {L === "ru"
                ? `от ${formatPrice(p.price, L)}`
                : `${formatPrice(p.price, L)} dan boshlanadi`}
            </div>
            <div className="mt-2 text-sm text-slate-500">{t.madeDays}</div>

            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <AddToCart product={p} lang={L} className="flex-1" />
              {/* Форма заявки живёт на этой же странице — уводить на главную
                  значит терять покупателя, который уже выбрал товар. */}
              <a
                href="#zayavka"
                className="flex-1 inline-flex items-center justify-center gap-2 border border-navy-900/15 text-navy-800 hover:border-sky-500 hover:text-sky-600 font-semibold px-6 py-3.5 rounded-xl transition"
              >
                {t.buyNow}
              </a>
            </div>

            <ul className="mt-6 space-y-2.5 border-t border-cloud-200 pt-5">
              {t.included.map((i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-sm text-slate-700"
                >
                  <span className="w-5 h-5 rounded-full bg-sky-600/10 text-sky-600 grid place-items-center shrink-0 mt-0.5">
                    <IcoCheck className="w-3.5 h-3.5" />
                  </span>
                  {i}
                </li>
              ))}
            </ul>

            <p className="mt-5 text-sm text-slate-500 leading-relaxed">
              {t.deliveryShort}{" "}
              <a
                href={href(L, "/dostavka-i-oplata")}
                className="text-sky-600 hover:underline"
              >
                {t.delivery}
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Характеристики и описание */}
      <section className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 pb-14 grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <h2 className="font-display font-medium text-2xl text-navy-800 tracking-tight">
            {t.specs}
          </h2>
          <dl className="mt-5 rounded-xl2 border border-cloud-200 bg-white shadow-card divide-y divide-cloud-200">
            {c.specs.map((s) => (
              <div
                key={s.k}
                className="flex items-baseline justify-between gap-4 px-5 py-3.5"
              >
                <dt className="text-slate-500">{s.k}</dt>
                <dd className="font-medium text-navy-800 text-right">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <h2 className="font-display font-medium text-2xl text-navy-800 tracking-tight">
            {t.description}
          </h2>
          <p className="mt-5 text-slate-700 leading-relaxed">{c.description}</p>
          <ul className="mt-5 space-y-3">
            {c.bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-slate-700">
                <span className="w-6 h-6 rounded-full bg-sky-600/10 text-sky-600 grid place-items-center shrink-0 mt-0.5">
                  <IcoCheck className="w-4 h-4" />
                </span>
                {b}
              </li>
            ))}
          </ul>

          {direction && (
            <a
              href={href(L, `/napravleniya/${direction.slug}`)}
              className="group mt-7 flex items-center justify-between gap-4 rounded-xl2 bg-cloud-50 border border-cloud-200 p-5 hover:border-sky-400 transition"
            >
              <div>
                <div className="text-xs font-semibold text-sky-600">
                  {t.aboutType}
                </div>
                <div className="font-bold text-navy-800 mt-1 group-hover:text-sky-600">
                  {direction[L].name}
                </div>
              </div>
              <IcoArrow className="w-6 h-6 text-navy-700 shrink-0" />
            </a>
          )}
        </div>
      </section>

      {/* Нужен другой размер */}
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
          </div>
          <div className="w-full max-w-md lg:justify-self-end">
            <LeadForm lang={L} />
          </div>
        </div>
      </section>

      {/* Другие товары */}
      {others.length > 0 && (
        <section className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-14">
          <h2 className="font-display font-medium text-2xl text-navy-800 tracking-tight">
            {t.relatedTitle}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {others.map((o) => (
              <a
                key={o.slug}
                href={href(L, `/katalog/${o.slug}`)}
                className="group rounded-xl2 overflow-hidden bg-white border border-cloud-200 shadow-card hover:shadow-card-hover transition"
              >
                <div className="bg-cloud-50 p-5">
                  <img
                    src={o.image}
                    alt={o[L].name}
                    width={1200}
                    height={1200}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-40 object-contain group-hover:scale-[1.04] transition duration-500"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-navy-800 group-hover:text-sky-600 leading-snug">
                    {o[L].short}
                  </h3>
                  <div className="mt-2 font-display font-medium text-xl text-navy-800">
                    {formatPrice(o.price, L)}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      <Footer lang={L} />
    </div>
  );
}
