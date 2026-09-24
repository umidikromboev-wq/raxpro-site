import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { IcoArrow } from "../../../components/Icons";
import { CASES, SEGMENTS, localizeCase } from "../../../lib/cases";
import { PORTFOLIO_T } from "../../../lib/portfolio";
import { normalizeLang } from "../../../lib/i18n";
import { alternatesFor, href, absHref } from "../../../lib/lang";
import { breadcrumbSchema, JsonLd } from "../../../lib/schema";

export async function generateMetadata({ params }) {
  const L = normalizeLang((await params).lang);
  const t = PORTFOLIO_T[L];
  return {
    title: t.seoTitle,
    description: t.seoDesc,
    alternates: alternatesFor("/portfolio", L),
    openGraph: { title: t.seoTitle, description: t.seoDesc, type: "website", images: [CASES[0].img] },
  };
}

function CaseCard({ L, c, t }) {
  const [value, label] = c.stats[0] || [];
  return (
    <a href={href(L, `/portfolio/${c.key}`)} className="group flex flex-col h-full rounded-xl2 overflow-hidden bg-white border border-cloud-200 hover:border-sky-300 transition">
      <div className="relative aspect-[4/3] overflow-hidden bg-cloud-100">
        <img loading="lazy" decoding="async" src={c.img} alt={`${c.client} — ${c.title}`} width={800} height={600} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="text-xs font-semibold tracking-wider uppercase text-sky-600">{c.client}</div>
        <h2 className="mt-1.5 font-semibold text-lg text-navy-800 leading-snug group-hover:text-sky-600">{c.title}</h2>
        {value && (
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-2xl text-navy-900 tabular-nums">{value}</span>
            <span className="text-sm text-slate-500">{label}</span>
          </div>
        )}
        <span className="mt-auto pt-4 inline-flex items-center gap-2 text-sm font-semibold text-navy-800">{t.open} <IcoArrow className="w-4 h-4" /></span>
      </div>
    </a>
  );
}

export default async function PortfolioPage({ params }) {
  const L = normalizeLang((await params).lang);
  const t = PORTFOLIO_T[L];
  const cases = CASES.map((c) => localizeCase(c, L));
  const crumbs = [
    { name: t.home, path: "/" },
    { name: t.title, path: "/portfolio" },
  ];
  const list = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: cases.map((c, i) => ({ "@type": "ListItem", position: i + 1, url: absHref(L, `/portfolio/${c.key}`), name: `${c.client} — ${c.title}` })),
  };
  return (
    <div className="bg-white text-ink">
      <JsonLd data={breadcrumbSchema(L, crumbs)} />
      <JsonLd data={list} />
      <Header lang={L} />
      <main>
        <section className="relative pt-28 pb-14 bg-navy-900 text-white overflow-hidden">
          <div className="absolute inset-0 grid-lines opacity-20" />
          <div className="relative w-full px-5 sm:px-8 lg:px-14 2xl:px-24">
            <nav aria-label="breadcrumbs" className="text-sm text-cloud-200/60 mb-4">
              <a href={href(L, "/")} className="hover:text-sky-400">{t.home}</a> <span className="mx-1">/</span>
              <span className="text-cloud-200">{t.title}</span>
            </nav>
            <h1 className="font-display font-medium text-3xl sm:text-5xl tracking-tight">{t.h1}</h1>
            <p className="mt-4 text-lg text-cloud-200/85 max-w-2xl">{t.lead}</p>
          </div>
        </section>

        {SEGMENTS.map((s) => {
          const group = cases.filter((c) => c.segment === s);
          if (group.length === 0) return null;
          return (
            <section key={s} aria-labelledby={`seg-${s}`} className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 pt-14 last-of-type:pb-14">
              <h2 id={`seg-${s}`} className="font-display font-medium text-2xl sm:text-3xl text-navy-800 tracking-tight">
                {t.seg[s]} <span className="text-slate-400 tabular-nums">· {group.length}</span>
              </h2>
              <ul className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {group.map((c) => <li key={c.key}><CaseCard L={L} c={c} t={t} /></li>)}
              </ul>
            </section>
          );
        })}
        <div className="h-14" />
      </main>
      <Footer lang={L} />
    </div>
  );
}
