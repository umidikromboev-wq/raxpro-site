import { SITE, NAV } from '../lib/site';
import { IcoPhone, IcoPin, IcoTg, IcoIg, IcoClock } from './Icons';

export default function Footer() {
  const year = 2026;
  return (
    <footer className="bg-navy-900 text-cloud-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="bg-white inline-block rounded-lg px-3 py-2">
            <img src="/brand/raxpro-logo.png" alt="RAXPRO" className="h-9 w-auto" />
          </div>
          <p className="mt-4 text-sm text-cloud-200/70 leading-relaxed">
            {SITE.legal} · Стеллажи и системы хранения полного цикла. Замер, проектирование, производство и монтаж по всему Узбекистану.
          </p>
          <div className="flex gap-2.5 mt-5">
            <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 grid place-items-center rounded-lg bg-white/5 hover:bg-sky-400 hover:text-navy-900 transition text-cloud-200">
              <IcoIg className="w-5 h-5" />
            </a>
            <a href={SITE.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="w-10 h-10 grid place-items-center rounded-lg bg-white/5 hover:bg-sky-400 hover:text-navy-900 transition text-cloud-200">
              <IcoTg className="w-5 h-5" />
            </a>
            <a href={`tel:${SITE.phoneMain}`} aria-label="Позвонить" className="w-10 h-10 grid place-items-center rounded-lg bg-white/5 hover:bg-sky-400 hover:text-navy-900 transition text-cloud-200">
              <IcoPhone className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Разделы</h4>
          <ul className="space-y-2.5 text-sm">
            {NAV.map((n) => (
              <li key={n.href}><a href={n.href} className="text-cloud-200/70 hover:text-sky-400">{n.label}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Продукция</h4>
          <ul className="space-y-2.5 text-sm text-cloud-200/70">
            <li><a href="/napravleniya/palletnye-stellazhi" className="hover:text-sky-400">Паллетные (Mega) стеллажи</a></li>
            <li><a href="/napravleniya/srednegruzovye-stellazhi" className="hover:text-sky-400">Среднегрузовые стеллажи</a></li>
            <li><a href="/napravleniya/arhivnye-stellazhi" className="hover:text-sky-400">Архивные стеллажи</a></li>
            <li><a href="/napravleniya/torgovye-stellazhi" className="hover:text-sky-400">Торговые стеллажи</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Контакты</h4>
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
            <li className="flex items-start gap-2.5 text-cloud-200/70">
              <IcoPin className="w-4 h-4 mt-0.5 text-sky-400 shrink-0" />
              <span>{SITE.addressCity}, {SITE.address}</span>
            </li>
            <li className="flex items-start gap-2.5 text-cloud-200/70">
              <IcoClock className="w-4 h-4 mt-0.5 text-sky-400 shrink-0" />
              <span>{SITE.hours}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row justify-between gap-2 text-xs text-cloud-200/50">
          <p>© {year} RAXPRO · {SITE.legal}. Все права защищены.</p>
          <p>Стеллажи и системы хранения · Ташкент, Узбекистан</p>
        </div>
      </div>
    </footer>
  );
}
