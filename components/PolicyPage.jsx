import Header from './Header';
import Footer from './Footer';
import { IcoCheck } from './Icons';
import { SITE, siteLoc } from '../lib/site';
import { href } from '../lib/lang';
import { SHOP } from '../lib/shop';
import { breadcrumbSchema, JsonLd } from '../lib/schema';

// Общая обёртка информационных страниц: доставка, возврат, оферта.
// Требование Merchant Center — каждая политика доступна отдельным адресом.
export default function PolicyPage({ lang, slug, content }) {
  const L = lang;
  const t = SHOP[L];
  const loc = siteLoc(L);

  const crumbs = breadcrumbSchema(L, [
    { name: t.home, path: '/' },
    { name: content.title, path: `/${slug}` },
  ]);

  return (
    <div className="bg-white text-ink">
      <JsonLd data={crumbs} />
      <Header lang={L} />

      <section className="relative pt-28 pb-14 bg-navy-900 text-white overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-20" />
        <div className="relative w-full px-5 sm:px-8 lg:px-14 2xl:px-24">
          <nav className="text-sm text-cloud-200/60 mb-4">
            <a href={href(L, '/')} className="hover:text-sky-400">
              {t.home}
            </a>
            <span className="mx-1.5">/</span>
            <span className="text-cloud-200">{content.title}</span>
          </nav>
          <h1 className="font-display font-medium text-3xl sm:text-4xl lg:text-5xl tracking-tight max-w-3xl">
            {content.title}
          </h1>
          <p className="mt-5 text-lg text-cloud-200/85 max-w-2xl leading-relaxed">{content.lead}</p>
        </div>
      </section>

      <section className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-14">
        <div className="max-w-3xl space-y-10">
          {content.blocks.map((b) => (
            <article key={b.h}>
              <h2 className="font-display font-medium text-xl sm:text-2xl text-navy-800 tracking-tight">
                {b.h}
              </h2>
              {b.text && <p className="mt-3 text-slate-700 leading-relaxed">{b.text}</p>}
              {b.items && (
                <ul className="mt-4 space-y-3">
                  {b.items.map((it) => (
                    <li key={it} className="flex items-start gap-3 text-slate-700 leading-relaxed">
                      <span className="w-6 h-6 rounded-full bg-sky-600/10 text-sky-600 grid place-items-center shrink-0 mt-0.5">
                        <IcoCheck className="w-4 h-4" />
                      </span>
                      {it}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}

          <div className="rounded-xl2 bg-cloud-50 border border-cloud-200 p-6">
            <h2 className="font-display font-medium text-lg text-navy-800">
              {L === 'uz' ? 'Savol qoldimi?' : 'Остались вопросы?'}
            </h2>
            <p className="mt-2 text-slate-600 text-sm leading-relaxed">
              {loc.addressCity}, {loc.address} · {loc.hours}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={`tel:${SITE.phoneMain}`}
                className="inline-flex items-center gap-2 bg-brand-grad text-white font-semibold px-6 py-3 rounded-xl"
              >
                {SITE.phoneMainHuman}
              </a>
              <a
                href={SITE.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-navy-900/15 text-navy-800 hover:border-sky-500 hover:text-sky-600 font-semibold px-6 py-3 rounded-xl"
              >
                Telegram
              </a>
              <a
                href={href(L, '/kontakty')}
                className="inline-flex items-center gap-2 border border-navy-900/15 text-navy-800 hover:border-sky-500 hover:text-sky-600 font-semibold px-6 py-3 rounded-xl"
              >
                {L === 'uz' ? 'Barcha kontaktlar' : 'Все контакты'}
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer lang={L} />
    </div>
  );
}
