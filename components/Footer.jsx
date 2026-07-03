import { SITE } from '../lib/site';
import { NAV_T, normalizeLang } from '../lib/i18n';
import { IcoPhone, IcoPin, IcoTg, IcoIg, IcoClock } from './Icons';

const FT = {
  ru: {
    tagline: 'Стеллажи и системы хранения полного цикла. Замер, проектирование, производство и монтаж по всему Узбекистану.',
    sections: 'Разделы', products: 'Продукция', contacts: 'Контакты',
    prod: ['Паллетные (Mega) стеллажи', 'Среднегрузовые стеллажи', 'Архивные стеллажи', 'Торговые стеллажи'],
    rights: 'Все права защищены.', tail: 'Стеллажи и системы хранения · Ташкент, Узбекистан', madeBy: 'Сделано в', reviews: 'Отзывы',
  },
  uz: {
    tagline: 'Toʻliq sikl stellajlar va saqlash tizimlari. Butun Oʻzbekiston boʻylab oʻlchov, loyihalash, ishlab chiqarish va montaj.',
    sections: 'Boʻlimlar', products: 'Mahsulotlar', contacts: 'Aloqa',
    prod: ['Palletli (Mega) stellajlar', 'Oʻrta yuklamali stellajlar', 'Arxiv stellajlari', 'Savdo stellajlari'],
    rights: 'Barcha huquqlar himoyalangan.', tail: 'Stellajlar va saqlash tizimlari · Toshkent, Oʻzbekiston', madeBy: 'Ishlab chiqildi', reviews: 'Sharhlar',
  },
};

const PROD_HREFS = [
  '/napravleniya/palletnye-stellazhi', '/napravleniya/srednegruzovye-stellazhi',
  '/napravleniya/arhivnye-stellazhi', '/napravleniya/torgovye-stellazhi',
];

export default function Footer({ lang = 'ru' }) {
  const L = normalizeLang(lang);
  const t = FT[L];
  const nav = NAV_T[L];
  const year = 2026;

  return (
    <footer className="bg-navy-900 text-cloud-200">
      <div className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="bg-white inline-block rounded-lg px-3 py-2">
            <img src="/brand/raxpro-logo.png" alt="RAXPRO" className="h-9 w-auto" />
          </div>
          <p className="mt-4 text-sm text-cloud-200/70 leading-relaxed">{t.tagline}</p>
          <div className="flex gap-2.5 mt-5">
            <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 grid place-items-center rounded-lg bg-white/5 hover:bg-sky-400 hover:text-navy-900 transition text-cloud-200"><IcoIg className="w-5 h-5" /></a>
            <a href={SITE.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="w-10 h-10 grid place-items-center rounded-lg bg-white/5 hover:bg-sky-400 hover:text-navy-900 transition text-cloud-200"><IcoTg className="w-5 h-5" /></a>
            <a href={`tel:${SITE.phoneMain}`} aria-label="Phone" className="w-10 h-10 grid place-items-center rounded-lg bg-white/5 hover:bg-sky-400 hover:text-navy-900 transition text-cloud-200"><IcoPhone className="w-5 h-5" /></a>
            <a href={SITE.reviewsChannel} target="_blank" rel="noopener noreferrer" aria-label={t.reviews} className="inline-flex items-center gap-1.5 h-10 px-3 rounded-lg bg-white/5 hover:bg-sky-400 hover:text-navy-900 transition text-cloud-200 text-sm font-semibold">★ {t.reviews}</a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">{t.sections}</h4>
          <ul className="space-y-2.5 text-sm">
            {nav.map((n) => <li key={n.href}><a href={n.href} className="text-cloud-200/70 hover:text-sky-400">{n.label}</a></li>)}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">{t.products}</h4>
          <ul className="space-y-2.5 text-sm text-cloud-200/70">
            {t.prod.map((p, i) => <li key={p}><a href={PROD_HREFS[i]} className="hover:text-sky-400">{p}</a></li>)}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">{t.contacts}</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a href={`tel:${SITE.phoneMain}`} className="flex items-start gap-2.5 text-white font-semibold hover:text-sky-400">
                <IcoPhone className="w-4 h-4 mt-0.5 text-sky-400 shrink-0" /> {SITE.phoneMainHuman}
              </a>
              <div className="pl-6.5 mt-1 space-y-1 text-cloud-200/60">
                <a href={`tel:${SITE.phoneAlt}`} className="block hover:text-sky-400">{SITE.phoneAltHuman}</a>
                <a href={`tel:${SITE.landline}`} className="block hover:text-sky-400">{SITE.landlineHuman}</a>
              </div>
            </li>
            <li className="flex items-start gap-2.5 text-cloud-200/70"><IcoPin className="w-4 h-4 mt-0.5 text-sky-400 shrink-0" /><span>{SITE.addressCity}, {SITE.address}</span></li>
            <li className="flex items-start gap-2.5 text-cloud-200/70"><IcoClock className="w-4 h-4 mt-0.5 text-sky-400 shrink-0" /><span>{SITE.hours}</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-cloud-200/50">
          <p>© {year} RAXPRO. {t.rights}</p>
          <p>{t.tail}</p>
          <a href="https://umid-site.vercel.app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-cloud-200/60 hover:text-white transition">
            {t.madeBy} <span className="font-semibold text-white">Prototype</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
