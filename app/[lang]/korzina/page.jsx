import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import CartView from '../../../components/CartView';
import { SHOP } from '../../../lib/shop';
import { normalizeLang } from '../../../lib/i18n';
import { alternatesFor, href } from '../../../lib/lang';

// Корзина у каждого своя — в выдаче ей делать нечего.
export async function generateMetadata({ params }) {
  const L = normalizeLang((await params).lang);
  const t = SHOP[L];
  return {
    title: `${t.cart} — RAXPRO`,
    description: t.checkoutNote,
    robots: { index: false, follow: true },
    alternates: alternatesFor('/korzina', L),
  };
}

export default async function CartPage({ params }) {
  const L = normalizeLang((await params).lang);
  const t = SHOP[L];

  return (
    <div className="bg-white text-ink min-h-screen flex flex-col">
      <Header lang={L} />

      <main className="flex-1 pt-28 pb-16 w-full px-5 sm:px-8 lg:px-14 2xl:px-24">
        <nav className="text-sm text-slate-400">
          <a href={href(L, '/')} className="hover:text-sky-600">
            {t.home}
          </a>
          <span className="mx-1.5">/</span>
          <a href={href(L, '/katalog')} className="hover:text-sky-600">
            {t.catalog}
          </a>
          <span className="mx-1.5">/</span>
          <span className="text-navy-800">{t.cart}</span>
        </nav>

        <h1 className="mt-4 font-display font-medium text-3xl sm:text-4xl text-navy-800 tracking-tight">
          {t.cartTitle}
        </h1>

        <div className="mt-8">
          <CartView lang={L} />
        </div>
      </main>

      <Footer lang={L} />
    </div>
  );
}
