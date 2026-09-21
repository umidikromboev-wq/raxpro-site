import { SITE } from '../lib/site';
import { NAV_T, normalizeLang } from '../lib/i18n';
import { IcoTg, IcoIg, IcoArrow } from './Icons';
import { href } from '../lib/lang';

// Футер: большая типографическая фраза с одним действием, волосяные колонки
// ссылок, соцсети и юридическая строка. Телефонов и адреса здесь нет —
// они живут в блоке «Контакты» и на /kontakty, чтобы не дублироваться.

const FT = {
  ru: {
    statement: ['Соберём', 'ваш склад.'],
    sub: 'Замер, проект, производство и монтаж по всему Узбекистану.',
    cta: 'Рассчитать стоимость',
    sections: 'Разделы', products: 'Продукция', info: 'Покупателю', follow: 'Мы в соцсетях',
    prod: ['Паллетные (Mega) стеллажи', 'Среднегрузовые стеллажи', 'Архивные стеллажи', 'Торговые стеллажи', 'Набивные (Drive-in) стеллажи'],
    rights: 'Все права защищены.', tail: 'Стеллажи и системы хранения · Ташкент, Узбекистан', madeBy: 'Сделано в', reviews: 'Отзывы клиентов',
    infoLinks: [
      { label: 'Каталог с ценами', href: '/katalog' },
      { label: 'Доставка и оплата', href: '/dostavka-i-oplata' },
      { label: 'Возврат и обмен', href: '/vozvrat-i-obmen' },
      { label: 'Публичная оферта', href: '/publichnaya-oferta' },
      { label: 'Политика конфиденциальности', href: '/politika-konfidencialnosti' },
      { label: 'О компании', href: '/o-kompanii' },
      { label: 'Контакты', href: '/kontakty' },
    ],
  },
  uz: {
    statement: ['Omboringizni', 'yigʻib beramiz.'],
    sub: 'Butun Oʻzbekiston boʻylab oʻlchov, loyiha, ishlab chiqarish va montaj.',
    cta: 'Narxni hisoblash',
    sections: 'Boʻlimlar', products: 'Mahsulotlar', info: 'Xaridorga', follow: 'Ijtimoiy tarmoqlarda',
    prod: ['Palletli (Mega) stellajlar', 'Oʻrta yuklamali stellajlar', 'Arxiv stellajlari', 'Savdo stellajlari', 'Zich (Drive-in) stellajlar'],
    rights: 'Barcha huquqlar himoyalangan.', tail: 'Stellajlar va saqlash tizimlari · Toshkent, Oʻzbekiston', madeBy: 'Ishlab chiqildi', reviews: 'Mijozlar sharhlari',
    infoLinks: [
      { label: 'Narxlar bilan katalog', href: '/katalog' },
      { label: 'Yetkazib berish va toʻlov', href: '/dostavka-i-oplata' },
      { label: 'Qaytarish va almashtirish', href: '/vozvrat-i-obmen' },
      { label: 'Ommaviy oferta', href: '/publichnaya-oferta' },
      { label: 'Maxfiylik siyosati', href: '/politika-konfidencialnosti' },
      { label: 'Kompaniya haqida', href: '/o-kompanii' },
      { label: 'Aloqa', href: '/kontakty' },
    ],
  },
};

const PROD_HREFS = [
  '/napravleniya/palletnye-stellazhi', '/napravleniya/srednegruzovye-stellazhi',
  '/napravleniya/arhivnye-stellazhi', '/napravleniya/torgovye-stellazhi',
  '/napravleniya/nabivnye-stellazhi',
];

function IcoWa(p) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 1.8a8.2 8.2 0 1 1-4.2 15.3l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 0 1 12 3.8Zm-3.1 4.4c-.2 0-.5 0-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.2 5 4.4 2.5 1 3 .8 3.5.7.5 0 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3l-2-1c-.3-.1-.5-.1-.7.1l-.9 1.1c-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.5-.9-.8-1.5-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5.3-.5c.1-.2 0-.4 0-.5l-.9-2.2c-.2-.5-.4-.5-.6-.5h-.6Z" />
    </svg>
  );
}
function IcoStar(p) { return <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" /></svg>; }

export default function Footer({ lang = 'ru' }) {
  const L = normalizeLang(lang);
  const t = FT[L];
  const nav = NAV_T[L];
  const year = 2026;
  const home = href(L, '/');
  const navHref = (h) => (h.startsWith('/#') ? home + h.slice(1) : href(L, h));
  const socials = [
    { href: SITE.instagram, label: 'Instagram', Ico: IcoIg },
    { href: SITE.telegram, label: 'Telegram', Ico: IcoTg },
    { href: SITE.whatsapp, label: 'WhatsApp', Ico: IcoWa },
    { href: SITE.reviewsChannel, label: t.reviews, Ico: IcoStar },
  ].filter((s) => s.href);

  return (
    <footer className="relative bg-navy-900 text-cloud-200 overflow-hidden">
      <div className="absolute inset-0 grid-lines opacity-15 pointer-events-none" />

      {/* Фраза + одно действие */}
      <div className="relative w-full px-5 sm:px-8 lg:px-14 2xl:px-24 pt-16 sm:pt-24 pb-12 sm:pb-16 grid lg:grid-cols-[1fr,auto] gap-10 items-end border-b border-white/10">
        <div>
          <h2 className="font-display font-medium text-white leading-[0.95] tracking-[-0.02em] text-[44px] sm:text-[72px] lg:text-[96px] 2xl:text-[112px]">
            {t.statement[0]}
            <br />
            <span className="text-sky-300">{t.statement[1]}</span>
          </h2>
          <p className="mt-6 text-cloud-200/65 max-w-md text-base sm:text-lg">{t.sub}</p>
        </div>
        <a href={home + '#kalkulyator'} className="inline-flex items-center gap-4 self-start lg:self-end rounded-full bg-white text-navy-900 font-bold text-sm sm:text-base pl-7 pr-1.5 py-1.5 hover:bg-sky-100 transition">
          {t.cta}
          <span className="w-12 h-12 rounded-full bg-navy-900 text-white grid place-items-center"><IcoArrow className="w-5 h-5" /></span>
        </a>
      </div>

      {/* Колонки ссылок — волосяные разделители */}
      <div className="relative w-full px-5 sm:px-8 lg:px-14 2xl:px-24 grid sm:grid-cols-2 lg:grid-cols-4 border-b border-white/10">
        <div className="py-10 lg:pr-10">
          <img loading="lazy" decoding="async" src="/brand/raxpro-logo-white.png" alt="RAXPRO" width={790} height={363} className="h-10 w-auto" />
          <div className="mt-8 text-[11px] font-semibold uppercase tracking-[0.16em] text-cloud-200/45">{t.follow}</div>
          <div className="flex flex-wrap gap-2.5 mt-4">
            {socials.map(({ href: h, label, Ico }) => (
              <a key={label} href={h} target="_blank" rel="noopener noreferrer" aria-label={label} title={label} className="w-11 h-11 grid place-items-center rounded-full border border-white/15 text-cloud-200 hover:bg-white hover:text-navy-900 hover:border-white transition">
                <Ico className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        <FooterCol title={t.sections}>
          {nav.map((n) => <li key={n.href}><a href={navHref(n.href)} className="hover:text-white transition">{n.label}</a></li>)}
        </FooterCol>
        <FooterCol title={t.products}>
          {t.prod.map((p, i) => <li key={p}><a href={href(L, PROD_HREFS[i])} className="hover:text-white transition">{p}</a></li>)}
        </FooterCol>
        {/* Требование Merchant Center: доставка, возврат, оферта и контакты доступны с любой страницы. */}
        <FooterCol title={t.info}>
          {t.infoLinks.map((l) => <li key={l.href}><a href={href(L, l.href)} className="hover:text-white transition">{l.label}</a></li>)}
        </FooterCol>
      </div>

      <div className="relative w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-cloud-200/45">
        <p>© {year} RAXPRO. {t.rights}</p>
        <p>{t.tail}</p>
        <a href="https://umid-site.vercel.app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-white transition">
          {t.madeBy} <span className="font-semibold text-cloud-200">Prototype</span>
        </a>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }) {
  return (
    <div className="py-10 lg:px-10 border-t sm:border-t-0 border-white/10 lg:border-l">
      <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cloud-200/45 mb-5">{title}</h4>
      <ul className="space-y-3 text-sm text-cloud-200/80">{children}</ul>
    </div>
  );
}
