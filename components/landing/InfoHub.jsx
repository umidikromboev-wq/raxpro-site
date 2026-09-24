import Header from "../Header";
import Footer from "../Footer";
import LeadForm from "../LeadForm";
import { IcoArrow } from "../Icons";
import { HUBS } from "../../lib/landings/hubs";
import { LANDING_UI } from "../../lib/landings";
import { normalizeLang } from "../../lib/i18n";
import { alternatesFor, href } from "../../lib/lang";
import { breadcrumbSchema, JsonLd } from "../../lib/schema";

// Хаб раздела «Услуги» / «Покупателям»: карточки-ссылки + форма.
const WRAP = "w-full px-5 sm:px-8 lg:px-14 2xl:px-24";

export async function hubMetadata(key, params) {
  const hub = HUBS[key];
  const L = normalizeLang((await params).lang);
  const t = hub[L];
  return {
    title: t.seoTitle,
    description: t.seoDesc,
    alternates: alternatesFor(hub.path, L),
    openGraph: { title: t.seoTitle, description: t.seoDesc, type: "website", images: [hub.cover] },
  };
}

export default async function InfoHub({ hubKey, params }) {
  const hub = HUBS[hubKey];
  const L = normalizeLang((await params).lang);
  const t = hub[L];
  const ui = LANDING_UI[L];
  const crumbs = [
    { name: ui.home, path: "/" },
    { name: t.title, path: hub.path },
  ];
  return (
    <div className="bg-white text-ink">
      <JsonLd data={breadcrumbSchema(L, crumbs)} />
      <Header lang={L} />
      <main>
        <section className="relative pt-28 pb-14 bg-navy-900 text-white overflow-hidden">
          <img loading="eager" fetchPriority="high" decoding="async" src={hub.cover} alt="" width={1600} height={1200} className="absolute inset-0 w-full h-full object-cover opacity-20" />
          <div className={`relative ${WRAP}`}>
            <nav aria-label="breadcrumbs" className="text-sm text-cloud-200/60 mb-4">
              <a href={href(L, "/")} className="hover:text-sky-400">{ui.home}</a> <span className="mx-1">/</span>
              <span className="text-cloud-200">{t.title}</span>
            </nav>
            <h1 className="font-display font-medium text-3xl sm:text-5xl tracking-tight leading-[1.08]">{t.h1}</h1>
            <p className="mt-4 text-lg text-cloud-200/85 max-w-2xl leading-relaxed">{t.lead}</p>
          </div>
        </section>

        <section aria-label={t.title} className={`${WRAP} py-14`}>
          <ul className={`grid sm:grid-cols-2 ${t.items.length % 4 === 0 ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-5`}>
            {t.items.map((it, i) => (
              <li key={it.path}>
                <a href={href(L, it.path)} className="group h-full flex flex-col rounded-xl2 border border-cloud-200 hover:border-sky-300 p-6 transition">
                  <span className="font-display text-2xl text-sky-600 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span className="mt-3 font-semibold text-lg text-navy-800 group-hover:text-sky-600">{it.t}</span>
                  <span className="mt-2 text-slate-600 leading-relaxed flex-1">{it.d}</span>
                  <IcoArrow className="mt-4 w-5 h-5 text-navy-700" />
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section id="zayavka" className="relative bg-navy-900 overflow-hidden">
          <div className="absolute inset-0 grid-lines opacity-20" />
          <div className={`relative ${WRAP} py-14 grid lg:grid-cols-2 gap-10 items-center`}>
            <div className="text-white">
              <h2 className="font-display font-medium text-3xl sm:text-4xl tracking-tight">{t.formTitle}</h2>
              <p className="mt-4 text-cloud-200/80 max-w-lg">{ui.formText}</p>
            </div>
            <div className="w-full max-w-md lg:justify-self-end"><LeadForm lang={L} context={`Страница: ${hub.ru.title}`} /></div>
          </div>
        </section>
      </main>
      <Footer lang={L} />
    </div>
  );
}
