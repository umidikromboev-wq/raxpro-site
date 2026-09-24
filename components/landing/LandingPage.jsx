// Шаблон посадочной страницы по порядку блоков Prostellaj (ТЗ 24.09.2026):
// герой с формой → реализованные проекты → что важно → параметры и готовые
// позиции → другие виды → этапы → отзывы → FAQ → заявка.
// Серверный компонент: клиентские только CaseSlider, Reviews, Faq, LeadForm.
import { href } from "../../lib/lang";
import { breadcrumbSchema, JsonLd } from "../../lib/schema";
import Header from "../Header";
import Footer from "../Footer";
import LeadForm from "../LeadForm";
import CaseSlider from "../CaseSlider";
import Reviews from "../Reviews";
import Stages from "../Stages";
import Faq from "../Faq";
import { SplitHead } from "../Section";
import { IcoArrow } from "../Icons";
import { CASES, localizeCase } from "../../lib/cases";
import { REVIEWS, localizeReview } from "../../lib/reviews";
import { getProduct, formatPrice, variantsOf } from "../../lib/products";
import { LANDING_UI } from "../../lib/landings";

const WRAP = "w-full px-5 sm:px-8 lg:px-14 2xl:px-24";

function pickCases(keys, L) {
  return keys
    .map((k) => CASES.find((c) => c.key === k))
    .filter(Boolean)
    .map((c) => localizeCase(c, L));
}

function pickReviews(ids, L) {
  return ids
    .map((id) => REVIEWS.find((r) => r.id === id))
    .filter(Boolean)
    .map((r) => localizeReview(r, L));
}

// Бейдж героя: если у готовых позиций страницы есть цена из каталога —
// «от <минимальная>», иначе подпись группы («по проекту», «бесплатно»…).
const PRICED_GROUPS = ["use", "retail", "type"];

function heroBadge(landing, ui, L) {
  if (!PRICED_GROUPS.includes(landing.group)) return ui.price;
  const prices = (landing.productSlugs || [])
    .map((slug) => getProduct(slug))
    .filter(Boolean)
    .flatMap((p) => variantsOf(p).map((v) => v.price))
    .filter((v) => typeof v === "number");
  if (!prices.length) return ui.price;
  const from = formatPrice(Math.min(...prices), L);
  return L === "uz" ? `${from}dan · oʻlchov bepul` : `от ${from} · замер бесплатно`;
}

function faqSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

function Hero({ L, landing, c, ui, crumbs, leadProduct }) {
  return (
    <section className="relative pt-24 bg-navy-900 text-white overflow-hidden">
      <div className="absolute inset-0">
        <img loading="eager" fetchPriority="high" decoding="async" src={landing.cover} alt={c.name} width={1600} height={1200} className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/92 to-navy-900/60" />
        <div className="absolute inset-0 grid-lines opacity-25" />
      </div>
      <div className={`relative ${WRAP} py-14 sm:py-16 grid lg:grid-cols-[1.1fr,0.9fr] gap-10 items-center`}>
        <div>
          <nav aria-label="breadcrumbs" className="text-sm text-cloud-200/60 mb-4 flex flex-wrap gap-x-1">
            {crumbs.map((cr, i) =>
              i < crumbs.length - 1 ? (
                <span key={cr.path}><a href={href(L, cr.path)} className="hover:text-sky-400">{cr.name}</a> <span className="mx-1">/</span></span>
              ) : (
                <span key={cr.path} className="text-cloud-200">{cr.name}</span>
              ),
            )}
          </nav>
          <h1 className="font-display font-medium text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-[1.08]">{c.name}</h1>
          <p className="mt-5 text-lg text-cloud-200/85 max-w-xl leading-relaxed">{c.lead}</p>
          <p className="mt-5 inline-flex items-center rounded-full bg-white text-navy-900 font-semibold text-sm px-4 py-2">{heroBadge(landing, ui, L)}</p>
          <div className="flex flex-wrap gap-3 mt-6">
            <a href="#zayavka" className="inline-flex items-center gap-2 bg-sky-400 hover:bg-sky-600 text-navy-900 font-bold px-7 py-3.5 rounded-xl">
              {ui.cta} <IcoArrow className="w-5 h-5" />
            </a>
            <a href="#proekty" className="inline-flex items-center gap-2 border border-white/25 hover:border-sky-400 text-white px-7 py-3.5 rounded-xl font-semibold">{ui.cases}</a>
          </div>
        </div>
        <div className="w-full max-w-md lg:justify-self-end">
          <LeadForm compact lang={L} initialProduct={leadProduct} context={`Страница: ${landing.ru.name}`} />
        </div>
      </div>
    </section>
  );
}

function Points({ c, ui }) {
  return (
    <section aria-labelledby="points" className={`${WRAP} py-14 sm:py-20`}>
      <h2 id="points" className="font-display font-medium text-3xl sm:text-4xl text-navy-800 tracking-tight max-w-2xl">{ui.points}</h2>
      <ol className="mt-10 grid md:grid-cols-2 gap-x-12 gap-y-8">
        {c.points.map((p, i) => (
          <li key={p.t} className="flex gap-5 border-t border-cloud-200 pt-6">
            <span className="font-display text-3xl text-sky-600 tabular-nums leading-none">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h3 className="font-semibold text-lg text-navy-800">{p.t}</h3>
              <p className="mt-2 text-slate-600 leading-relaxed">{p.d}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Specs({ L, specs, products, ui }) {
  return (
    <section aria-labelledby="specs" className="bg-cloud-50 border-y border-cloud-200">
      <div className={`${WRAP} py-14 sm:py-16 grid lg:grid-cols-[0.8fr,1.2fr] gap-10`}>
        <div>
          <h2 id="specs" className="font-display font-medium text-2xl sm:text-3xl text-navy-800 tracking-tight">{ui.specs}</h2>
          <dl className="mt-6 divide-y divide-cloud-200 border-y border-cloud-200">
            {specs.map((s) => (
              <div key={s.k} className="flex justify-between gap-4 py-3">
                <dt className="text-slate-500">{s.k}</dt>
                <dd className="font-semibold text-navy-800 text-right">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
        {products.length > 0 && (
          <div>
            <h2 className="font-display font-medium text-2xl sm:text-3xl text-navy-800 tracking-tight">{ui.products}</h2>
            <div className="mt-6 grid sm:grid-cols-2 gap-5">
              {products.map((p) => (
                <a key={p.slug} href={href(L, `/katalog/${p.slug}`)} className="group flex flex-col rounded-xl2 overflow-hidden bg-white border border-cloud-200 hover:border-sky-300 transition">
                  <div className="aspect-[4/3] overflow-hidden bg-cloud-100">
                    <img loading="lazy" decoding="async" src={p.image} alt={p[L].name} width={1168} height={880} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-semibold text-navy-800 group-hover:text-sky-600">{p[L].name}</h3>
                    <div className="mt-auto pt-3 flex items-center justify-between gap-3">
                      <span className="font-bold text-navy-900">{typeof p.price === "number" ? formatPrice(p.price, L) : ui.price.split(" · ")[0]}</span>
                      <IcoArrow className="w-5 h-5 text-navy-700" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Siblings({ L, items, title }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="siblings" className={`${WRAP} py-14`}>
      <h2 id="siblings" className="font-display font-medium text-2xl sm:text-3xl text-navy-800 tracking-tight">{title}</h2>
      <ul className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((s) => (
          <li key={s.path}>
            <a href={href(L, s.path)} className="group block rounded-xl2 overflow-hidden bg-white border border-cloud-200 hover:border-sky-300 transition">
              <div className="aspect-[16/10] overflow-hidden bg-cloud-100">
                <img loading="lazy" decoding="async" src={s.cover} alt={s[L].name} width={800} height={500} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <div className="px-4 py-3 flex items-center justify-between gap-2">
                <span className="font-semibold text-navy-800 text-sm sm:text-base group-hover:text-sky-600">{s[L].short}</span>
                <IcoArrow className="w-4 h-4 text-navy-700 shrink-0" />
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * @param {{ lang: "ru"|"uz", landing: object, crumbs: {name:string,path:string}[],
 *   siblings?: object[], siblingsTitle?: string, leadProduct: string }} props
 */
export default function LandingPage({ lang: L, landing, crumbs, siblings = [], siblingsTitle, leadProduct }) {
  const c = landing[L];
  // Подписи блоков: торговые — «для вашего магазина», остальные группы — свои.
  const ui = { ...LANDING_UI[L], ...(LANDING_UI[L].byGroup[landing.group] || {}) };
  const cases = pickCases(landing.caseKeys || [], L);
  const reviews = pickReviews(landing.reviewIds || [], L);
  const products = (landing.productSlugs || []).map(getProduct).filter(Boolean);
  const specs = landing.specs?.[L] || [];

  return (
    <div className="bg-white text-ink">
      <JsonLd data={breadcrumbSchema(L, crumbs)} />
      <JsonLd data={faqSchema(c.faq)} />
      <Header lang={L} />
      <main>
        <Hero L={L} landing={landing} c={c} ui={ui} crumbs={crumbs} leadProduct={leadProduct} />

        {cases.length > 0 && (
          <section id="proekty" className={`${WRAP} py-12 sm:py-20`}>
            <SplitHead title={ui.cases} desc={ui.casesText} hideDescOnMobile />
            <div className="mt-6 sm:mt-10"><CaseSlider items={cases} lang={L} /></div>
          </section>
        )}

        <Points c={c} ui={ui} />
        <Specs L={L} specs={specs} products={products} ui={ui} />
        <Siblings L={L} items={siblings} title={siblingsTitle || ui.others} />
        <Stages lang={L} />

        {reviews.length > 0 && (
          <section className="bg-cloud-50 border-y border-cloud-200 overflow-hidden">
            <div className={`${WRAP} py-16 sm:py-20`}>
              <h2 className="font-display font-medium text-3xl sm:text-4xl text-navy-800">{ui.reviews}</h2>
              <p className="mt-3 text-slate-500 max-w-xl">{ui.reviewsText}</p>
              <Reviews items={reviews} lang={L} allHref={href(L, "/otzyvy")} total={REVIEWS.length} />
            </div>
          </section>
        )}

        <section className={`${WRAP} py-16 sm:py-20`}>
          <h2 className="font-display font-medium text-3xl sm:text-4xl text-navy-800">{ui.faq}</h2>
          <Faq items={c.faq} />
        </section>

        <section id="zayavka" className="relative bg-navy-900 overflow-hidden">
          <div className="absolute inset-0 grid-lines opacity-20" />
          <div className={`relative ${WRAP} py-14 grid lg:grid-cols-2 gap-10 items-center`}>
            <div className="text-white">
              <h2 className="font-display font-medium text-3xl sm:text-4xl tracking-tight">{ui.formTitle}</h2>
              <p className="mt-4 text-cloud-200/80 max-w-lg">{ui.formText}</p>
            </div>
            <div className="w-full max-w-md lg:justify-self-end"><LeadForm lang={L} initialProduct={leadProduct} context={`Страница: ${landing.ru.name}`} /></div>
          </div>
        </section>
      </main>
      <Footer lang={L} />
    </div>
  );
}
