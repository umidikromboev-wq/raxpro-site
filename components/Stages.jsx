'use client';
import { useEffect, useRef, useState } from 'react';
import { Eyebrow } from './Section';
import { IcoRuler, IcoDraft, IcoTruck, IcoWrench, IcoArrow } from './Icons';
import { href } from '../lib/lang';

// «Этапы и сроки» вместо блока «Циклы» (макет Умида 22.09): одна цифра срока
// в заголовке, сравнение «под заказ у производителя / у нас всё в наличии»,
// и четыре карточки этапов, которые проявляются по мере скролла — сначала
// заливается полоска дня, потом появляется карточка.
//
// Цифры в квадратных скобках макета — [7] дней, [N] тонн, [14–28] дней —
// PLACEHOLDER (Умид: «пока фейковые, потом заменим оригиналом»). Остальное —
// факты сайта: замер 24 ч, монтаж до 300 м² за день, гарантия 10 лет, 5 минут.

const TOTAL_DAYS = 7; // PLACEHOLDER
const STOCK_TONS = '150'; // PLACEHOLDER
const FACTORY_LEAD = '14–28'; // PLACEHOLDER

const COPY = {
  ru: {
    eyebrow: 'Этапы и сроки',
    title: `Склад под ключ за ${TOTAL_DAYS} дней.`,
    accent: 'Всё в наличии — завод не ждём.',
    text: 'Стеллажи и комплектующие в любом объёме уже лежат на нашем складе в Ташкенте. Поэтому сроки мы считаем в днях, а не в неделях.',
    photoAlt: 'Склад RAXPRO в Ташкенте — ряды рам и балок в упаковке',
    tons: `${STOCK_TONS} тонн`,
    tonsNote: 'комплектующих на нашем складе в Ташкенте — отгружаем любой объём',
    visit: 'Приезжайте посмотреть металл до договора',
    cmpFactory: 'Под заказ у производителя',
    cmpFactoryBar: `изготовление и доставка — ${FACTORY_LEAD} дней, потом монтаж`,
    cmpUs: 'RaxPro · всё в наличии',
    cmpUsBar: `${TOTAL_DAYS} дней под ключ`,
    cmpUsNote: '0 дней ожидания производства',
    dayLabels: ['День 1', 'Дни 2–3', 'День 4', 'Дни 5–7 · склад работает'],
    get: 'Вы получаете',
    inStock: 'Всё в наличии',
    steps: [
      { n: '01 · 1 день', t: 'Замер', d: 'Бесплатный выезд в течение 24 часов. Меряем помещение, высоту, проёмы и нагрузку на пол.', r: 'План помещения с размерами' },
      { n: '02 · 1–2 дня', t: 'Проект и смета', d: 'Расставляем стеллажи под ваш товар и технику, считаем паллетоместа.', r: '3D-расстановку и точную смету — сумма фиксируется в договоре' },
      { n: '03 · 1 день', t: 'Комплектация со склада', d: 'Собираем заказ с нашего склада в Ташкенте. Без производства, без растаможки, без ожидания.', r: 'Комплект и доставку на объект' },
      { n: '04 · 1–3 дня', t: 'Монтаж', d: 'Собираем и анкеруем к полу. До 300 м² — за 1 день. По Ташкенту бесплатно.', r: 'Акт сдачи, инструктаж персонала и гарантию 10 лет по договору' },
    ],
    cta: 'Записаться на бесплатный замер',
    ctaNote1: 'Замерщик приедет в течение 24 часов',
    ctaNote2: 'Ответим в Telegram за 5 минут',
  },
  uz: {
    eyebrow: 'Bosqichlar va muddatlar',
    title: `Ombor kalit topshirish — ${TOTAL_DAYS} kunda.`,
    accent: 'Hammasi mavjud — zavodni kutmaymiz.',
    text: 'Stellajlar va butlovchi qismlar istalgan hajmda Toshkentdagi omborimizda turibdi. Shuning uchun muddatni haftalarda emas, kunlarda hisoblaymiz.',
    photoAlt: 'RAXPRO ombori Toshkentda — qadoqlangan ramalar va balkalar qatori',
    tons: `${STOCK_TONS} tonna`,
    tonsNote: 'butlovchi qism Toshkentdagi omborimizda — istalgan hajmni joʻnatamiz',
    visit: 'Shartnomagacha kelib metallni koʻring',
    cmpFactory: 'Ishlab chiqaruvchiga buyurtma',
    cmpFactoryBar: `ishlab chiqarish va yetkazish — ${FACTORY_LEAD} kun, keyin montaj`,
    cmpUs: 'RaxPro · hammasi mavjud',
    cmpUsBar: `${TOTAL_DAYS} kunda kalit topshirish`,
    cmpUsNote: 'ishlab chiqarishni kutish — 0 kun',
    dayLabels: ['1-kun', '2–3-kunlar', '4-kun', '5–7-kunlar · ombor ishlaydi'],
    get: 'Siz olasiz',
    inStock: 'Hammasi mavjud',
    steps: [
      { n: '01 · 1 kun', t: 'Oʻlchov', d: '24 soat ichida bepul chiqamiz. Xona, balandlik, oʻtish joylari va polga yuklamani oʻlchaymiz.', r: 'Oʻlchamlari bilan xona rejasi' },
      { n: '02 · 1–2 kun', t: 'Loyiha va smeta', d: 'Stellajlarni tovar va texnikangizga moslab joylashtiramiz, palleta oʻrinlarini hisoblaymiz.', r: '3D joylashuv va aniq smeta — summa shartnomada qayd etiladi' },
      { n: '03 · 1 kun', t: 'Ombordan butlash', d: 'Buyurtmani Toshkentdagi omborimizdan yigʻamiz. Ishlab chiqarishsiz, bojxonasiz, kutishsiz.', r: 'Toʻliq komplekt va obyektga yetkazib berish' },
      { n: '04 · 1–3 kun', t: 'Montaj', d: 'Yigʻamiz va polga ankerlaymiz. 300 m² gacha — 1 kunda. Toshkent boʻylab bepul.', r: 'Topshirish dalolatnomasi, xodimlar uchun yoʻriqnoma va shartnoma boʻyicha 10 yil kafolat' },
    ],
    cta: 'Bepul oʻlchovga yozilish',
    ctaNote1: 'Oʻlchovchi 24 soat ichida keladi',
    ctaNote2: 'Telegramda 5 daqiqada javob beramiz',
  },
};

const ICONS = [IcoRuler, IcoDraft, IcoTruck, IcoWrench];
// Доля каждого этапа в полоске дней: 1 + 2 + 1 + 3 = 7
const DAY_SHARE = [1, 2, 1, 3];
const HIGHLIGHT = 2; // карточка «Комплектация со склада» — тёмная, это и есть отличие

/** 0…1 — насколько ряд карточек прошёл через нижнюю половину экрана. */
function rowProgress(el) {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight;
  const start = vh * 0.92, end = vh * 0.38;
  return Math.min(1, Math.max(0, (start - rect.top) / Math.max(1, start - end)));
}

export default function Stages({ lang = 'ru' }) {
  const L = lang === 'uz' ? 'uz' : 'ru';
  const c = COPY[L];
  const rowRef = useRef(null);
  const [shown, setShown] = useState(0); // сколько карточек уже проявлено

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setShown(c.steps.length); return; }
    const wide = window.matchMedia('(min-width: 1024px)');
    let raf = 0;
    const update = () => {
      raf = 0;
      if (wide.matches) {
        // Ряд в одну линию: карточки идут по одной, каждая занимает свою долю прогресса
        const p = rowProgress(el);
        setShown(Math.min(c.steps.length, Math.floor(p * c.steps.length + 0.35)));
        return;
      }
      // Карточки столбиком: каждая проявляется, когда её верх входит в экран
      const line = window.innerHeight * 0.88;
      const cards = el.querySelectorAll('li');
      let n = 0;
      cards.forEach((card, i) => { if (card.getBoundingClientRect().top < line) n = i + 1; });
      setShown(n);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', kick);
    return () => { window.removeEventListener('scroll', kick); window.removeEventListener('resize', kick); if (raf) cancelAnimationFrame(raf); };
  }, [c.steps.length]);

  return (
    <section id="o-kompanii" className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16 sm:py-20" aria-labelledby="stages-title">
      {/* Заголовок + тёмная карточка склада */}
      <div className="grid lg:grid-cols-[minmax(0,1.3fr),minmax(0,1fr)] gap-10 lg:gap-16 items-start">
        <div>
          <Eyebrow>{c.eyebrow}</Eyebrow>
          <h2 id="stages-title" className="mt-4 font-display font-medium text-3xl sm:text-4xl lg:text-5xl tracking-tight text-navy-900 text-balance">
            {c.title}
            <br />
            <span className="text-sky-600">{c.accent}</span>
          </h2>
          <p className="mt-5 text-slate-600 max-w-lg leading-relaxed">{c.text}</p>
        </div>
        <div className="rounded-xl2 bg-navy-900 text-white p-5 sm:p-6">
          <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-navy-800">
            <img loading="lazy" decoding="async" src="/images/stock.jpg" alt={c.photoAlt} width={1168} height={657} className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div className="mt-5 font-display font-medium text-4xl sm:text-5xl tracking-tight">{c.tons}</div>
          <p className="mt-2 text-sm text-sky-100/80 max-w-sm leading-relaxed">{c.tonsNote}</p>
          <a href={href(L, '/kontakty')} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sky-300 hover:text-white transition">
            {c.visit} <IcoArrow className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Сравнение сроков */}
      <div className="mt-10 rounded-xl2 bg-cloud-50 border border-cloud-200 p-5 sm:p-6 grid gap-4">
        <div className="grid sm:grid-cols-[220px,1fr] gap-2 sm:gap-6 items-center">
          <span className="text-sm text-slate-500">{c.cmpFactory}</span>
          <span className="rounded-lg bg-cloud-200 text-slate-600 text-sm px-4 py-2.5">{c.cmpFactoryBar}</span>
        </div>
        <div className="grid sm:grid-cols-[220px,1fr] gap-2 sm:gap-6 items-center">
          <span className="text-sm font-semibold text-navy-900">{c.cmpUs}</span>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="rounded-lg bg-sky-600 text-white text-sm font-semibold px-4 py-2.5">{c.cmpUsBar}</span>
            <span className="text-sm text-navy-900">{c.cmpUsNote}</span>
          </div>
        </div>
      </div>

      {/* Полоска дней + карточки этапов; появляются по скроллу */}
      <div ref={rowRef} className="mt-10">
        <div className="hidden lg:grid gap-4" style={{ gridTemplateColumns: DAY_SHARE.map((s) => `${s}fr`).join(' ') }} aria-hidden="true">
          {c.dayLabels.map((label, i) => (
            <div key={label}>
              <div className="text-[11px] font-semibold text-navy-900 mb-2">{label}</div>
              <div className="h-1.5 rounded-full bg-cloud-200 overflow-hidden">
                <div className="h-full rounded-full bg-sky-500 transition-transform duration-700 ease-out origin-left" style={{ transform: `scaleX(${i < shown ? 1 : 0})` }} />
              </div>
            </div>
          ))}
        </div>
        <ol className="mt-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {c.steps.map((s, i) => {
            const Ico = ICONS[i];
            const dark = i === HIGHLIGHT;
            const on = i < shown;
            return (
              <li
                key={s.t}
                className={`flex flex-col rounded-xl2 border p-5 sm:p-6 transition-all duration-700 ease-out ${dark ? 'bg-navy-900 border-navy-900 text-white' : 'bg-white border-cloud-200 text-navy-900'}`}
                style={{ opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(28px)', transitionDelay: on ? '120ms' : '0ms' }}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className={`text-xs font-semibold ${dark ? 'text-sky-200' : 'text-slate-500'}`}>{s.n}</span>
                  <Ico className={`w-5 h-5 ${dark ? 'text-sky-300' : 'text-sky-600'}`} />
                </div>
                <h3 className="mt-4 font-bold text-xl leading-snug">{s.t}</h3>
                {dark && <span className="mt-3 self-start rounded-full bg-sky-600 text-white text-xs font-semibold px-3 py-1">{c.inStock}</span>}
                <p className={`mt-3 text-sm leading-relaxed ${dark ? 'text-sky-100/85' : 'text-slate-600'}`}>{s.d}</p>
                <div className={`mt-auto pt-5 border-t ${dark ? 'border-white/15' : 'border-cloud-200'}`}>
                  <div className={`text-[11px] font-semibold uppercase tracking-wider ${dark ? 'text-sky-200/80' : 'text-slate-400'}`}>{c.get}</div>
                  <div className={`mt-2 text-sm font-semibold leading-snug ${dark ? 'text-white' : 'text-navy-900'}`}>{s.r}</div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* CTA */}
      <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
        <a href="#zayavka" className="inline-flex items-center gap-3 bg-navy-900 hover:bg-sky-600 text-white font-semibold px-7 py-4 rounded-full transition">
          {c.cta} <IcoArrow className="w-4 h-4" />
        </a>
        <div className="text-sm text-slate-500 leading-relaxed">
          {c.ctaNote1}
          <br />
          {c.ctaNote2}
        </div>
      </div>
    </section>
  );
}
