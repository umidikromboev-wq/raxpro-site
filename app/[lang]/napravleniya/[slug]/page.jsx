import { notFound } from 'next/navigation';
import { alternatesFor, href, absHref, LANGS } from "../../../../lib/lang";
import { breadcrumbSchema, productSchema, JsonLd } from "../../../../lib/schema";
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';
import LeadForm from '../../../../components/LeadForm';
import { DIRECTIONS, DIR_UI, getDirection } from '../../../../lib/directions';
import { getArticle, localize } from '../../../../lib/articles';
import { normalizeLang } from '../../../../lib/i18n';
import { IcoCheck, IcoArrow } from '../../../../components/Icons';
import { leadProductFor } from "../../../../lib/leadProduct";
import { directionCards, directionSizes, SIZES_T } from '../../../../lib/directionCards';

export function generateStaticParams() {
  return LANGS.flatMap((lang) => DIRECTIONS.map((d) => ({ lang, slug: d.slug })));
}

export async function generateMetadata({ params }) {
  const { slug, lang } = await params;
  const d = getDirection(slug);
  if (!d) return { title: 'Страница не найдена | RAXPRO' };
  const L = normalizeLang(lang);
  const c = d[L];
  return {
    title: c.seoTitle,
    description: c.seoDesc,
    alternates: alternatesFor(`/napravleniya/${d.slug}`, L),
    openGraph: { title: c.seoTitle, description: c.seoDesc, type: 'website', images: [d.cover] },
  };
}

export default async function DirectionPage({ params }) {
  const { slug, lang } = await params;
  const d = getDirection(slug);
  if (!d) notFound();
  const L = normalizeLang(lang);
  const c = d[L];
  const ui = DIR_UI[L];
  const related = d.relatedSlug ? localize(getArticle(d.relatedSlug), L) : null;
  const relatedTitle = related ? related.title : null;
  const others = DIRECTIONS.filter((x) => x.slug !== d.slug);
  const card = directionCards(L).find((x) => x.slug === d.slug);
  const sizes = directionSizes(d.slug);
  const st = SIZES_T[L];

  const crumbs = breadcrumbSchema(L, [
    { name: ui.home, path: '/' },
    { name: ui.dirs, path: '/' },
    { name: c.short, path: `/napravleniya/${d.slug}` },
  ]);

  return (
    <div className="bg-white text-ink">
      <JsonLd data={crumbs} />
      <JsonLd data={productSchema(L, d)} />
      <Header lang={L} />

      {/* HERO */}
      <section className="relative pt-24 bg-navy-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img loading="lazy" decoding="async" src={d.cover} alt={c.name} className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/92 to-navy-900/60" />
          <div className="absolute inset-0 grid-lines opacity-25" />
        </div>
        <div className="relative w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-14 sm:py-16 grid lg:grid-cols-[1.1fr,0.9fr] gap-10 items-center">
          <div>
            <nav className="text-sm text-cloud-200/60 mb-4">
              <a href={href(L, "/")} className="hover:text-sky-400">{ui.home}</a> <span className="mx-1">/</span>
              <a href={href(L, "/") + "#napravleniya"} className="hover:text-sky-400"> {ui.dirs}</a> <span className="mx-1">/</span>
              <span className="text-cloud-200"> {c.short}</span>
            </nav>
            <h1 className="font-display font-medium text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-[1.08]">{c.name}</h1>
            <p className="mt-5 text-lg text-cloud-200/85 max-w-xl leading-relaxed">{c.intro}</p>
            {/* Цена «от» — из прайса lib/products; там, где прайса нет, честное «цена по проекту» */}
            <p className="mt-5 inline-flex items-center rounded-full bg-white text-navy-900 font-semibold text-sm px-4 py-2">{card.price}</p>
            <div className="flex flex-wrap gap-3 mt-6">
              <a href={card.cta.href} className="inline-flex items-center gap-2 bg-sky-400 hover:bg-sky-600 text-navy-900 font-bold px-7 py-3.5 rounded-xl">
                {card.cta.label} <IcoArrow className="w-5 h-5" />
              </a>
              <a href={href(L, "/") + "#proekty"} className="inline-flex items-center gap-2 border border-white/25 hover:border-sky-400 text-white px-7 py-3.5 rounded-xl font-semibold">{ui.seeProjects}</a>
            </div>
          </div>
          <div className="w-full max-w-md lg:justify-self-end">
            <LeadForm compact lang={L} initialProduct={leadProductFor(L, { directionSlug: d.slug, fallback: c.name })} />
          </div>
        </div>
      </section>

      {/* SPECS */}
      <section className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {c.specs.map((s) => (
            <div key={s.k} className="rounded-xl2 bg-white border border-cloud-200 shadow-card p-5">
              <div className="text-slate-400 text-sm">{s.k}</div>
              <div className="font-display font-medium text-xl text-navy-800 mt-1">{s.v}</div>
            </div>
          ))}
        </div>

        {sizes && (
          <div className="mt-12">
            <h2 className="font-display font-medium text-2xl sm:text-3xl text-navy-800 tracking-tight">{st.title}</h2>
            <div className="mt-5 overflow-x-auto rounded-xl2 border border-cloud-200">
              <table className="w-full min-w-[420px] text-sm">
                <thead className="bg-cloud-50 text-slate-500 text-left">
                  <tr><th className="px-4 py-3 font-medium">{st.size}</th><th className="px-4 py-3 font-medium">{st.levels}</th><th className="px-4 py-3 font-medium text-right">{st.price}</th></tr>
                </thead>
                <tbody className="divide-y divide-cloud-200">
                  {sizes.rows.map((r) => (
                    <tr key={r.code}>
                      <td className="px-4 py-3 font-medium text-navy-800">{r.size}</td>
                      <td className="px-4 py-3">{r.levels}</td>
                      <td className="px-4 py-3 text-right font-semibold text-navy-800">{r.price ? r.price.toLocaleString('ru-RU') : <span className="font-normal text-slate-400">{st.byRequest}</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-slate-500">{sizes.rows.some((r) => r.price) ? st.note : st.noteNoPrice}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-10 mt-12 items-start">
          <div>
            <h2 className="font-display font-medium text-2xl sm:text-3xl text-navy-800 tracking-tight">{ui.advantages}</h2>
            <ul className="mt-5 space-y-3">
              {c.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-slate-700">
                  <span className="w-6 h-6 rounded-full bg-sky-600/10 text-sky-600 grid place-items-center shrink-0 mt-0.5"><IcoCheck className="w-4 h-4" /></span>
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-7 rounded-xl2 bg-cloud-50 border border-cloud-200 p-5">
              <div className="text-slate-400 text-sm">{ui.forWhom}</div>
              <p className="text-navy-800 font-medium mt-1">{c.useCases}</p>
            </div>
          </div>
          {/* Capped height + sticky: the image used to run far past the text column,
              forcing an extra scroll to reach the copy. */}
          <div className="rounded-xl2 overflow-hidden border border-cloud-200 shadow-card md:sticky md:top-28">
            <img loading="eager" fetchPriority="high" decoding="async"
              src={d.cover}
              alt={c.name}
              width={1200}
              height={900}
              className="w-full h-auto max-h-[420px] object-cover"
            />
          </div>
        </div>

        {d.gallery?.length > 1 && (
          <div className="mt-14">
            <h2 className="font-display font-medium text-2xl sm:text-3xl text-navy-800 tracking-tight">{ui.gallery}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
              {d.gallery.map((src, i) => (
                <div key={src} className="rounded-xl2 overflow-hidden border border-cloud-200 shadow-card bg-cloud-100">
                  <img
                    src={src}
                    alt={`${c.name} — ${ui.galleryAlt} ${i + 1}`}
                    width={1200}
                    height={900}
                    loading="lazy"
                    className="w-full h-[280px] object-cover hover:scale-105 transition duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {related && (
          <a href={href(L, `/blog/${related.slug}`)} className="group mt-10 flex items-center justify-between gap-4 rounded-xl2 bg-white border border-cloud-200 shadow-card p-5 hover:shadow-card-hover transition">
            <div>
              <div className="text-xs font-semibold text-sky-600">{ui.relatedArticle}</div>
              <div className="font-bold text-navy-800 mt-1 group-hover:text-sky-600">{relatedTitle}</div>
            </div>
            <IcoArrow className="w-6 h-6 text-navy-700 shrink-0" />
          </a>
        )}
      </section>

      {/* CTA FORM */}
      <section id="zayavka" className="relative bg-navy-900 overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-20" />
        <div className="relative w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-14 grid lg:grid-cols-2 gap-10 items-center">
          <div className="text-white">
            <h2 className="font-display font-medium text-3xl sm:text-4xl tracking-tight">{ui.calcShort} {c.short.toLowerCase()}</h2>
            <p className="mt-4 text-cloud-200/80 max-w-lg">{ui.formText}</p>
          </div>
          <div className="w-full max-w-md lg:justify-self-end"><LeadForm lang={L} initialProduct={leadProductFor(L, { directionSlug: d.slug, fallback: c.name })} /></div>
        </div>
      </section>

      {/* OTHER DIRECTIONS */}
      <section className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-14">
        <h2 className="font-display font-medium text-2xl text-navy-800 tracking-tight">{ui.other}</h2>
        <div className="grid sm:grid-cols-3 gap-5 mt-6">
          {others.map((o) => (
            <a key={o.slug} href={href(L, `/napravleniya/${o.slug}`)} className="group block rounded-xl2 overflow-hidden bg-white border border-cloud-200 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition">
              <div className="aspect-[16/9] overflow-hidden bg-cloud-100">
                <img loading="lazy" decoding="async" src={o.cover} alt={o[L].name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <div className="p-5 flex items-center justify-between gap-2">
                <h3 className="font-bold text-navy-800 group-hover:text-sky-600">{o[L].short}</h3>
                <IcoArrow className="w-5 h-5 text-navy-700" />
              </div>
            </a>
          ))}
        </div>
      </section>

      <Footer lang={L} />
    </div>
  );
}
