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
// факты сайта: замер 24 ч, план и КП в день замера, монтаж до 300 м² за день,
// гарантия 10 лет, 5 минут.

const TOTAL_DAYS = 7; // подтверждено Умидом 22.09: один срок на весь сайт
const STOCK_TONS = '150'; // подтверждено Умидом 22.09
const FACTORY_LEAD = '14–28'; // PLACEHOLDER
// Диаграмма сроков — одна шкала дней для обеих строк. PLACEHOLDER: завод 14 дней
// гарантированно + до 28 (неопределённость), потом монтаж 3; у нас 1+2+1+3 = 7.
const FACTORY_SEGMENTS = [
  { key: 'make', days: 14 },
  { key: 'wait', days: 14, uncertain: true },
  { key: 'mount', days: 3 },
];
const OUR_SEGMENTS = [
  { key: 'measure', days: 1 },
  { key: 'design', days: 2 },
  { key: 'stock', days: 1, dark: true },
  { key: 'mount', days: 3 },
];
const FACTORY_TOTAL = FACTORY_SEGMENTS.reduce((a, s) => a + s.days, 0);
const OUR_TOTAL = OUR_SEGMENTS.reduce((a, s) => a + s.days, 0);
const SCALE_DAYS = FACTORY_TOTAL + 1;
const TICKS = [0, 7, 14, 21, 28];

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
    cmpTitle: 'Сколько ждать склад, в днях',
    cmpDelta: `На ${FACTORY_TOTAL - OUR_TOTAL} дня раньше`,
    cmpFactory: 'Под заказ у производителя',
    cmpFactoryTotal: `до ${FACTORY_TOTAL} дня`,
    cmpUs: 'RaxPro · всё в наличии',
    cmpUsTotal: `${OUR_TOTAL} дней`,
    cmpTail: 'склад уже работает',
    cmpDays: 'дней',
    cmpTailDays: 'дня',
    seg: { make: `изготовление и доставка — ${FACTORY_LEAD} дней`, wait: 'возможная задержка завода', mount: 'монтаж', measure: 'замер', design: 'проект', stock: 'комплектация со склада' },
    dayLabels: ['День 1', 'Дни 2–3', 'День 4', 'Дни 5–7 · склад работает'],
    get: 'Вы получаете',
    inStock: 'Всё в наличии',
    steps: [
      { n: '01 · 1 день', t: 'Замер', d: 'Бесплатный выезд в течение 24 часов. Меряем помещение, высоту, проёмы и нагрузку на пол.', r: 'План помещения с размерами' },
      { n: '02 · в день замера', t: 'Проект и смета', d: 'Расставляем стеллажи под ваш товар и технику, считаем паллетоместа. План, 3D-модель и КП отдаём в тот же день.', r: '3D-расстановку и точную смету — сумма фиксируется в договоре' },
      { n: '03 · 1 день', t: 'Комплектация со склада', d: 'Собираем заказ с нашего склада в Ташкенте. Всё уже на месте — ждать нечего.', r: 'Комплект и доставку на объект' },
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
    cmpTitle: 'Omborni necha kun kutasiz',
    cmpDelta: `${FACTORY_TOTAL - OUR_TOTAL} kun oldin`,
    cmpFactory: 'Ishlab chiqaruvchiga buyurtma',
    cmpFactoryTotal: `${FACTORY_TOTAL} kungacha`,
    cmpUs: 'RaxPro · hammasi mavjud',
    cmpUsTotal: `${OUR_TOTAL} kun`,
    cmpTail: 'ombor allaqachon ishlayapti',
    cmpDays: 'kun',
    cmpTailDays: 'kun',
    seg: { make: `ishlab chiqarish va yetkazish — ${FACTORY_LEAD} kun`, wait: 'zavodning ehtimoliy kechikishi', mount: 'montaj', measure: 'oʻlchov', design: 'loyiha', stock: 'ombordan butlash' },
    dayLabels: ['1-kun', '2–3-kunlar', '4-kun', '5–7-kunlar · ombor ishlaydi'],
    get: 'Siz olasiz',
    inStock: 'Hammasi mavjud',
    steps: [
      { n: '01 · 1 kun', t: 'Oʻlchov', d: '24 soat ichida bepul chiqamiz. Xona, balandlik, oʻtish joylari va polga yuklamani oʻlchaymiz.', r: 'Oʻlchamlari bilan xona rejasi' },
      { n: '02 · oʻlchov kuni', t: 'Loyiha va smeta', d: 'Stellajlarni tovar va texnikangizga moslab joylashtiramiz, palleta oʻrinlarini hisoblaymiz. Reja, 3D model va tijorat taklifini oʻsha kuniyoq beramiz.', r: '3D joylashuv va aniq smeta — summa shartnomada qayd etiladi' },
      { n: '03 · 1 kun', t: 'Ombordan butlash', d: 'Buyurtmani Toshkentdagi omborimizdan yigʻamiz. Hammasi joyida — kutish shart emas.', r: 'Toʻliq komplekt va obyektga yetkazib berish' },
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

/** Стиль сегментов: завод — серые, штриховка = неопределённость; мы — синие, комплектация тёмная как её карточка. */
const SEG_CLASS = {
  make: 'bg-slate-300 text-slate-700',
  wait: 'text-slate-600',
  mount: 'bg-sky-600 text-white',
  measure: 'bg-sky-300 text-navy-900',
  design: 'bg-sky-400 text-navy-900',
  stock: 'bg-navy-900 text-white',
};
const HATCH = { backgroundImage: 'repeating-linear-gradient(135deg, #cbd5e1 0 5px, #e8eef5 5px 11px)' };

function LeadRow({ label, total, segments, tail, on, strong, c }) {
  let offset = 0;
  const parts = segments.map((seg, i) => {
    const left = (offset / SCALE_DAYS) * 100, width = (seg.days / SCALE_DAYS) * 100;
    offset += seg.days;
    const cls = seg.dark ? SEG_CLASS.stock : SEG_CLASS[seg.key];
    return (
      <div
        key={seg.key}
        className={`absolute top-0 bottom-0 flex items-center overflow-hidden text-[11px] font-semibold px-2 ${cls} ${i === 0 ? 'rounded-l-md' : ''} ${i === segments.length - 1 ? 'rounded-r-md' : ''}`}
        style={{ left: `${left}%`, width: `calc(${width}% - 2px)`, ...(seg.uncertain ? HATCH : {}), transform: on ? 'scaleX(1)' : 'scaleX(0)', transformOrigin: 'left', transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1)', transitionDelay: `${i * 160}ms` }}
        title={c.seg[seg.key]}
      >
        {seg.days >= 2 && <span className="truncate hidden sm:inline">{seg.days} {c.cmpDays}</span>}
      </div>
    );
  });
  const used = (offset / SCALE_DAYS) * 100;
  return (
    <div className="grid sm:grid-cols-[200px,1fr] gap-2 sm:gap-6 items-center">
      <div className={`flex items-baseline justify-between gap-3 text-sm ${strong ? 'font-semibold text-navy-900' : 'text-slate-500'}`}>
        {label}
        <span className={`sm:hidden shrink-0 whitespace-nowrap text-[11px] font-semibold ${strong ? 'text-sky-700' : 'text-slate-500'}`}>{total}</span>
      </div>
      <div className="relative h-10">
        {parts}
        {tail && (
          <div
            className="absolute top-0 bottom-0 rounded-md border border-dashed border-sky-400 text-sky-700 text-[11px] font-semibold flex items-center px-2 overflow-hidden"
            style={{ left: `calc(${used}% + 6px)`, right: 0, opacity: on ? 1 : 0, transition: 'opacity 0.6s', transitionDelay: `${segments.length * 160 + 200}ms` }}
          >
            <span className="truncate">{tail} · {FACTORY_TOTAL - OUR_TOTAL} {c.cmpTailDays}</span>
          </div>
        )}
        <span
          className={`hidden sm:block absolute -top-5 text-[11px] font-semibold whitespace-nowrap ${strong ? 'text-sky-700' : 'text-slate-500'}`}
          style={{ left: `${used}%`, transform: 'translateX(-100%)', opacity: on ? 1 : 0, transition: 'opacity 0.5s', transitionDelay: `${segments.length * 160}ms` }}
        >
          {total}
        </span>
      </div>
    </div>
  );
}

/** Две полосы на одной шкале дней: длина = срок, разница видна без чтения цифр. */
function LeadTimeChart({ c }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setOn(true); return; }
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); o.disconnect(); } }, { threshold: 0.4 });
    o.observe(el);
    return () => o.disconnect();
  }, []);
  const legend = ['make', 'wait', 'mount', 'measure', 'design', 'stock'];
  return (
    <div ref={ref} className="mt-10 rounded-xl2 bg-cloud-50 border border-cloud-200 p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-bold text-navy-900">{c.cmpTitle}</h3>
        <span className="rounded-full bg-sky-600 text-white text-sm font-semibold px-4 py-1.5">{c.cmpDelta}</span>
      </div>
      <div className="mt-6 sm:mt-8 grid gap-5 sm:gap-7">
        {/* Шкала дней и вертикальные линии — только там, где полосы */}
        <div className="grid sm:grid-cols-[200px,1fr] gap-2 sm:gap-6">
          <span className="hidden sm:block" />
          <div className="relative h-4 text-[10px] text-slate-400">
            {TICKS.map((d) => (
              <span key={d} className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: `${(d / SCALE_DAYS) * 100}%` }}>{d}</span>
            ))}
          </div>
        </div>
        <LeadRow c={c} label={c.cmpFactory} total={c.cmpFactoryTotal} segments={FACTORY_SEGMENTS} on={on} />
        <LeadRow c={c} label={c.cmpUs} total={c.cmpUsTotal} segments={OUR_SEGMENTS} tail={c.cmpTail} on={on} strong />
      </div>
      <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
        {legend.map((k) => (
          <li key={k} className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-sm ${k === 'wait' ? '' : SEG_CLASS[k].split(' ')[0]}`} style={k === 'wait' ? HATCH : undefined} />
            {c.seg[k]}
          </li>
        ))}
      </ul>
    </div>
  );
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

      {/* Сравнение сроков — диаграмма на общей шкале дней */}
      <LeadTimeChart c={c} />

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
