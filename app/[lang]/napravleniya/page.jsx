import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { IcoArrow } from "../../../components/Icons";
import { DIRECTIONS } from "../../../lib/directions";
import { retailSubs, LANDING_UI } from "../../../lib/landings";
import { normalizeLang } from "../../../lib/i18n";
import { alternatesFor, href } from "../../../lib/lang";
import { breadcrumbSchema, JsonLd } from "../../../lib/schema";

// Хаб «Стеллажи»: все виды и подкатегории торговых — вход в структуру как у Prostellaj.
export async function generateMetadata({ params }) {
  const L = normalizeLang((await params).lang);
  const ui = LANDING_UI[L];
  const title = `${ui.hubTitle} — RAXPRO`;
  return {
    title,
    description: ui.hubText,
    alternates: alternatesFor("/napravleniya", L),
    openGraph: { title, description: ui.hubText, type: "website", images: [DIRECTIONS[0].cover] },
  };
}

function Tile({ L, path, cover, name, large = false }) {
  return (
    <a href={href(L, path)} className="group block rounded-xl2 overflow-hidden bg-white border border-cloud-200 hover:border-sky-300 transition">
      <div className={`${large ? "aspect-[16/10]" : "aspect-[4/3]"} overflow-hidden bg-cloud-100`}>
        <img loading="lazy" decoding="async" src={cover} alt={name} width={800} height={600} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
      </div>
      <div className="px-5 py-4 flex items-center justify-between gap-2">
        <span className={`font-semibold text-navy-800 group-hover:text-sky-600 ${large ? "text-lg" : ""}`}>{name}</span>
        <IcoArrow className="w-5 h-5 text-navy-700 shrink-0" />
      </div>
    </a>
  );
}

export default async function DirectionsHub({ params }) {
  const L = normalizeLang((await params).lang);
  const ui = LANDING_UI[L];
  const crumbs = [
    { name: ui.home, path: "/" },
    { name: ui.dirs, path: "/napravleniya" },
  ];
  return (
    <div className="bg-white text-ink">
      <JsonLd data={breadcrumbSchema(L, crumbs)} />
      <Header lang={L} />
      <main>
        <section className="relative pt-28 pb-14 bg-navy-900 text-white overflow-hidden">
          <div className="absolute inset-0 grid-lines opacity-20" />
          <div className="relative w-full px-5 sm:px-8 lg:px-14 2xl:px-24">
            <nav aria-label="breadcrumbs" className="text-sm text-cloud-200/60 mb-4">
              <a href={href(L, "/")} className="hover:text-sky-400">{ui.home}</a> <span className="mx-1">/</span>
              <span className="text-cloud-200">{ui.dirs}</span>
            </nav>
            <h1 className="font-display font-medium text-3xl sm:text-5xl tracking-tight">{ui.hubTitle}</h1>
            <p className="mt-4 text-lg text-cloud-200/85 max-w-2xl">{ui.hubText}</p>
          </div>
        </section>

        <section className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-14">
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {DIRECTIONS.map((d) => (
              <li key={d.slug}><Tile L={L} path={`/napravleniya/${d.slug}`} cover={d.cover} name={d[L].short} large /></li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="trade" className="bg-cloud-50 border-y border-cloud-200">
          <div className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-14">
            <h2 id="trade" className="font-display font-medium text-2xl sm:text-3xl text-navy-800 tracking-tight">{ui.hubTrade}</h2>
            <ul className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
              {retailSubs().map((s) => (
                <li key={s.slug}><Tile L={L} path={s.path} cover={s.cover} name={s[L].short} /></li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer lang={L} />
    </div>
  );
}
