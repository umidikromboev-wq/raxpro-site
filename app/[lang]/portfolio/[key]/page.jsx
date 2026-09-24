import { notFound } from "next/navigation";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import LeadForm from "../../../../components/LeadForm";
import { IcoArrow } from "../../../../components/Icons";
import { CASES, localizeCase } from "../../../../lib/cases";
import { PORTFOLIO_T } from "../../../../lib/portfolio";
import { normalizeLang } from "../../../../lib/i18n";
import { alternatesFor, href, LANGS } from "../../../../lib/lang";
import { breadcrumbSchema, JsonLd } from "../../../../lib/schema";

export const dynamicParams = false;

export function generateStaticParams() {
  return LANGS.flatMap((lang) => CASES.map((c) => ({ lang, key: c.key })));
}

function find(key, L) {
  const raw = CASES.find((c) => c.key === key);
  return raw ? localizeCase(raw, L) : null;
}

export async function generateMetadata({ params }) {
  const { key, lang } = await params;
  const L = normalizeLang(lang);
  const c = find(key, L);
  if (!c) return { title: "Страница не найдена | RAXPRO" };
  const t = PORTFOLIO_T[L];
  const title = t.caseSeo(c);
  const description = `${c.task} ${c.solution}`.slice(0, 160);
  return {
    title,
    description,
    alternates: alternatesFor(`/portfolio/${c.key}`, L),
    openGraph: { title, description, type: "article", images: [c.img] },
  };
}

export default async function CasePage({ params }) {
  const { key, lang } = await params;
  const L = normalizeLang(lang);
  const c = find(key, L);
  if (!c) notFound();
  const t = PORTFOLIO_T[L];
  const photos = [c.img, ...(c.gallery || [])];
  const others = CASES.filter((x) => x.key !== c.key && x.segment === c.segment)
    .concat(CASES.filter((x) => x.key !== c.key && x.segment !== c.segment))
    .slice(0, 3)
    .map((x) => localizeCase(x, L));
  const crumbs = [
    { name: t.home, path: "/" },
    { name: t.title, path: "/portfolio" },
    { name: c.client, path: `/portfolio/${c.key}` },
  ];
  const WRAP = "w-full px-5 sm:px-8 lg:px-14 2xl:px-24";
  return (
    <div className="bg-white text-ink">
      <JsonLd data={breadcrumbSchema(L, crumbs)} />
      <Header lang={L} />
      <main className="pt-24">
        <div className={`${WRAP} py-5`}>
          <nav aria-label="breadcrumbs" className="text-sm text-slate-400">
            <a href={href(L, "/")} className="hover:text-sky-600">{t.home}</a> <span className="mx-1">/</span>
            <a href={href(L, "/portfolio")} className="hover:text-sky-600">{t.title}</a> <span className="mx-1">/</span>
            <span className="text-navy-800">{c.client}</span>
          </nav>
        </div>

        <article className={`${WRAP} pb-14 grid lg:grid-cols-[1.15fr,0.85fr] gap-10 items-start`}>
          <div className="rounded-xl2 overflow-hidden bg-cloud-100 border border-cloud-200">
            <img loading="eager" fetchPriority="high" decoding="async" src={c.img} alt={`${c.client} — ${c.title}`} width={1200} height={900} className="w-full h-auto max-h-[640px] object-cover" />
          </div>
          <div className="lg:sticky lg:top-28">
            <div className="text-xs font-semibold tracking-wider uppercase text-sky-600">{t.seg[c.segment]} · {c.client}</div>
            <h1 className="mt-2 font-display font-medium text-3xl sm:text-4xl text-navy-800 tracking-tight leading-[1.1]">{c.title}</h1>
            <dl className="mt-6 space-y-4">
              <div><dt className="font-bold text-navy-900">{t.task}</dt><dd className="mt-1 text-slate-600 leading-relaxed">{c.task}</dd></div>
              <div><dt className="font-bold text-navy-900">{t.solution}</dt><dd className="mt-1 text-slate-600 leading-relaxed">{c.solution}</dd></div>
            </dl>
            <ul className="mt-7 grid grid-cols-2 gap-3">
              {c.stats.map(([v, l]) => (
                <li key={l} className="rounded-xl2 border border-cloud-200 p-4">
                  <div className="font-display text-2xl text-navy-900 tabular-nums">{v}</div>
                  <div className="mt-1 text-sm text-slate-500">{l}</div>
                </li>
              ))}
            </ul>
            {c.quote && (
              <figure className="mt-6 border-l-2 border-sky-500 pl-4">
                <blockquote className="text-slate-700 italic">«{c.quote.text}»</blockquote>
                {c.quote.who && <figcaption className="mt-1 text-sm text-slate-500">— {c.quote.who}</figcaption>}
              </figure>
            )}
            <a href="#zayavka" className="mt-7 inline-flex items-center gap-2 bg-navy-900 text-white hover:bg-sky-600 font-semibold px-6 py-3.5 rounded-xl transition">{t.formTitle} <IcoArrow className="w-5 h-5" /></a>
          </div>
        </article>

        {photos.length > 1 && (
          <section aria-labelledby="photos" className={`${WRAP} pb-14`}>
            <h2 id="photos" className="font-display font-medium text-2xl sm:text-3xl text-navy-800 tracking-tight">{t.photos}</h2>
            <ul className="mt-6 grid grid-cols-2 lg:grid-cols-3 gap-4">
              {photos.slice(1).map((src, i) => (
                <li key={src} className="rounded-xl2 overflow-hidden bg-cloud-100 border border-cloud-200">
                  <img loading="lazy" decoding="async" src={src} alt={`${c.client} — ${i + 2}`} width={800} height={600} className="w-full aspect-[4/3] object-cover" />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section id="zayavka" className="relative bg-navy-900 overflow-hidden">
          <div className="absolute inset-0 grid-lines opacity-20" />
          <div className={`relative ${WRAP} py-14 grid lg:grid-cols-2 gap-10 items-center`}>
            <div className="text-white">
              <h2 className="font-display font-medium text-3xl sm:text-4xl tracking-tight">{t.formTitle}</h2>
              <p className="mt-4 text-cloud-200/80 max-w-lg">{t.formText}</p>
            </div>
            <div className="w-full max-w-md lg:justify-self-end"><LeadForm lang={L} context={`Страница кейса: ${c.client}`} /></div>
          </div>
        </section>

        <section aria-labelledby="others" className={`${WRAP} py-14`}>
          <h2 id="others" className="font-display font-medium text-2xl text-navy-800 tracking-tight">{t.others}</h2>
          <ul className="mt-6 grid sm:grid-cols-3 gap-5">
            {others.map((o) => (
              <li key={o.key}>
                <a href={href(L, `/portfolio/${o.key}`)} className="group block rounded-xl2 overflow-hidden bg-white border border-cloud-200 hover:border-sky-300 transition">
                  <div className="aspect-[16/10] overflow-hidden bg-cloud-100">
                    <img loading="lazy" decoding="async" src={o.img} alt={o.client} width={800} height={500} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  </div>
                  <div className="p-4">
                    <div className="text-xs font-semibold uppercase tracking-wider text-sky-600">{o.client}</div>
                    <div className="mt-1 font-semibold text-navy-800 group-hover:text-sky-600">{o.title}</div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer lang={L} />
    </div>
  );
}
