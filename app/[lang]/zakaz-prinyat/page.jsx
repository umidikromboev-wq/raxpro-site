import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import OrderNumber from '../../../components/OrderNumber';
import { IcoCheck } from '../../../components/Icons';
import { SITE } from '../../../lib/site';
import { SHOP } from '../../../lib/shop';
import { normalizeLang } from '../../../lib/i18n';
import { alternatesFor, href } from '../../../lib/lang';

export async function generateMetadata({ params }) {
  const L = normalizeLang((await params).lang);
  const t = SHOP[L];
  return {
    title: `${t.thanksTitle} — RAXPRO`,
    description: t.thanksText,
    robots: { index: false, follow: false },
    alternates: alternatesFor('/zakaz-prinyat', L),
  };
}

export default async function OrderAcceptedPage({ params }) {
  const L = normalizeLang((await params).lang);
  const t = SHOP[L];

  return (
    <div className="bg-white text-ink min-h-screen flex flex-col">
      <Header lang={L} />

      <main className="flex-1 pt-32 pb-20 w-full px-5 sm:px-8 lg:px-14 2xl:px-24">
        <div className="max-w-2xl">
          <span className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 grid place-items-center">
            <IcoCheck className="w-8 h-8" />
          </span>
          <h1 className="mt-6 font-display font-medium text-3xl sm:text-4xl text-navy-800 tracking-tight">
            {t.thanksTitle}
          </h1>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed">{t.thanksText}</p>

          <OrderNumber label={t.orderNo} />

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={href(L, '/katalog')}
              className="inline-flex items-center gap-2 bg-brand-grad text-white font-semibold px-7 py-3.5 rounded-xl"
            >
              {t.thanksBack}
            </a>
            <a
              href={`tel:${SITE.phoneMain}`}
              className="inline-flex items-center gap-2 border border-navy-900/15 text-navy-800 hover:border-sky-500 hover:text-sky-600 font-semibold px-7 py-3.5 rounded-xl transition"
            >
              {SITE.phoneMainHuman}
            </a>
          </div>
        </div>
      </main>

      <Footer lang={L} />
    </div>
  );
}
