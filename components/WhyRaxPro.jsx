import Reveal from './Reveal';
import { IcoArrow } from './Icons';
import { CapacityFigure, TierFigure } from './RackFigures';

// «Почему RaxPro» — bento по макету Умида (22.09): одна крупная карточка
// вместимости с рисунком «пол vs стеллаж», рядом наличие и гарантия, ниже
// безопасность, окупаемость, доступ, удобство, гибкость, металл, оплата и
// полоса CTA. Заменил блоки «Выгода» и «Не обещания, а факты».
//
// PLACEHOLDER — цифры-заглушки до фактов клиента (Умид разрешил 22.09):
const CAPACITY_X = '×3';     // = (RACK_LEVELS + 1); во сколько раз больше паллет на той же площади
const FLOOR_PALLETS = 4;     // паллет на полу в рисунке
const RACK_LEVELS = 2;       // ярусов в рисунке → паллетомест = FLOOR_PALLETS × (RACK_LEVELS + 1)
const PAYBACK_MONTHS = '6';  // месяцев до того, как стеллажи дешевле аренды второго склада
const TIER_STEP_MM = '50';   // шаг регулировки яруса
const STEEL_GRADE = 'Сталь 08ПС · 1,5 мм';
const STEEL_GRADE_UZ = 'Poʻlat 08PS · 1,5 mm';
const DAYS = '7';            // склад под ключ — как в блоке «Этапы»

const RACK_PLACES = FLOOR_PALLETS * (RACK_LEVELS + 1);

const COPY = {
  ru: {
    eyebrow: 'Почему RaxPro',
    title: 'Стеллажи, которые работают на вас.',
    text: 'Больше товара, меньше аренды, ноль ожидания. И ни одного повода переживать за склад.',
    cap: { k: 'Вместимость', t: 'Больше паллет. Та же площадь.', n: CAPACITY_X, sub: 'на весь склад', before: `Без стеллажей: ${FLOOR_PALLETS} паллеты`, after: `Со стеллажами: ${RACK_PLACES} паллетомест` },
    stock: { k: 'Наличие', t: 'В наличии. Всегда.', d: 'Любой объём — на нашем складе в Ташкенте. Производство ждать не нужно.' },
    war: { k: 'Гарантия', n: '10', t: 'лет по договору.', d: 'На рынке обычно — до 5.' },
    safe: { k: 'Безопасность', n: '4 т', d: 'на ярус — и защита от главной причины аварий: удара погрузчиком.', list: ['Замки балок — не выбить вилами', 'Отбойники у проходов техники', 'Анкеровка к бетонному полу', 'Табличка нагрузки на каждом ряду', 'Инструктаж вашего персонала'] },
    pay: { k: 'Окупаемость', n: `${PAYBACK_MONTHS} мес`, d: 'и стеллажи дешевле, чем аренда второго склада. Дальше — чистая экономия.' },
    acc: { k: 'Доступ', t: 'Любая паллета — за минуту.', d: 'В штабеле нижнюю не достать. В стеллаже у каждой свой адрес.' },
    conv: { k: 'Удобство', t: 'Товар поменялся? Ярусы тоже.', d: `Высота каждого яруса регулируется с шагом ${TIER_STEP_MM} мм. Переставили балку — и готово. Без сварки.` },
    flex: { k: 'Гибкость', t: 'Разбираются. Переезжают. Растут.', d: 'Переехали — забрали с собой. Нужно больше — докупили секции.' },
    metal: { k: 'Металл', layers: ['Порошковая краска', 'Оцинковка', STEEL_GRADE], t: 'Не ржавеет. Не облезает.' },
    money: { k: 'Оплата', n: '50/50', d: 'Половина сейчас, половина после монтажа. Для небольших заказов — рассрочка Uzum Nasiya.' },
    cta: { t: 'Сколько поместится в ваш склад?', d: `Замер и расчёт — бесплатно. Склад под ключ — за ${DAYS} дней.`, btn: 'Записаться на замер', note: 'Приедем в течение 24 часов' },
  },
  uz: {
    eyebrow: 'Nega RaxPro',
    title: 'Siz uchun ishlaydigan stellajlar.',
    text: 'Koʻproq tovar, kamroq ijara, kutish yoʻq. Va ombor uchun tashvishlanishga birorta sabab yoʻq.',
    cap: { k: 'Sigʻim', t: 'Koʻproq pallet. Oʻsha maydon.', n: CAPACITY_X, sub: 'butun ombor boʻyicha', before: `Stellajsiz: ${FLOOR_PALLETS} ta pallet`, after: `Stellaj bilan: ${RACK_PLACES} ta pallet joyi` },
    stock: { k: 'Mavjudlik', t: 'Doim mavjud.', d: 'Istalgan hajm — Toshkentdagi omborimizda. Ishlab chiqarishni kutish shart emas.' },
    war: { k: 'Kafolat', n: '10', t: 'yil shartnoma boʻyicha.', d: 'Bozorda odatda — 5 yilgacha.' },
    safe: { k: 'Xavfsizlik', n: '4 t', d: 'har yarusga — va avariyalarning asosiy sababi, yuklagich zarbasidan himoya.', list: ['Balka qulflari — vilka bilan urib boʻlmaydi', 'Texnika yoʻlaklarida himoya toʻsiqlari', 'Beton polga ankerlash', 'Har qatorda yuklama jadvali', 'Xodimlaringizga yoʻriqnoma'] },
    pay: { k: 'Oʻzini oqlash', n: `${PAYBACK_MONTHS} oy`, d: 'va stellajlar ikkinchi ombor ijarasidan arzon tushadi. Keyin — sof tejamkorlik.' },
    acc: { k: 'Kirish', t: 'Istalgan pallet — bir daqiqada.', d: 'Shtabelda pastkisini ololmaysiz. Stellajda har birining oʻz manzili bor.' },
    conv: { k: 'Qulaylik', t: 'Tovar oʻzgardimi? Yaruslar ham.', d: `Har yarus balandligi ${TIER_STEP_MM} mm qadam bilan sozlanadi. Balkani koʻchirdingiz — tayyor. Payvandlashsiz.` },
    flex: { k: 'Moslashuvchanlik', t: 'Yigʻiladi. Koʻchadi. Oʻsadi.', d: 'Koʻchdingiz — oʻzingiz bilan oldingiz. Koʻproq kerak — seksiya qoʻshdingiz.' },
    metal: { k: 'Metall', layers: ['Kukunli boʻyoq', 'Sinklash', STEEL_GRADE_UZ], t: 'Zanglamaydi. Koʻchmaydi.' },
    money: { k: 'Toʻlov', n: '50/50', d: 'Yarmi hozir, yarmi montajdan keyin. Kichik buyurtmalar uchun — Uzum Nasiya boʻlib toʻlash.' },
    cta: { t: 'Omboringizga qancha sigʻadi?', d: `Oʻlchov va hisob-kitob — bepul. Ombor kalit topshirish sharti bilan — ${DAYS} kunda.`, btn: 'Oʻlchovga yozilish', note: '24 soat ichida kelamiz' },
  },
};

const SAFE_ICONS = [
  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>,
  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" {...p}><path d="M12 3 4 6v6c0 4.5 3.4 7.8 8 9 4.6-1.2 8-4.5 8-9V6z" /></svg>,
  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}><path d="M12 3v12m0 0-4-4m4 4 4-4M4 20h16" /></svg>,
  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M7 10h10M7 14h6" /></svg>,
  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>,
];

function Kicker({ children, light = false }) {
  return <div className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${light ? 'text-cloud-200/70' : 'text-slate-500'}`}>{children}</div>;
}

const card = 'h-full rounded-xl2 bg-white border border-cloud-200 shadow-card p-6 sm:p-7';

/* Рисунок: паллеты на полу слева, тот же товар на стеллаже справа */
/* Рисунок: две стойки, балка сдвинута вверх, старое место — пунктиром */

export default function WhyRaxPro({ lang = 'ru' }) {
  const c = COPY[lang] || COPY.ru;
  return (
    <section id="pochemu" className="bg-cloud-50 border-y border-cloud-200" aria-labelledby="why-title">
      <div className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16 sm:py-20">
        <Reveal className="text-center max-w-2xl mx-auto">
          <div className="text-sm font-semibold text-sky-600">{c.eyebrow}</div>
          <h2 id="why-title" className="mt-3 font-display font-medium text-3xl sm:text-[2.6rem] lg:text-5xl leading-[1.08] tracking-tight text-navy-900 text-balance">{c.title}</h2>
          <p className="mt-4 text-slate-500 text-[15px] sm:text-base leading-relaxed">{c.text}</p>
        </Reveal>

        <div className="mt-10 sm:mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Вместимость — крупная, 2 колонки × 2 ряда */}
          <Reveal className="sm:col-span-2 lg:row-span-2" delay={0}>
            <div className={`${card} flex flex-col`}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <Kicker>{c.cap.k}</Kicker>
                  <h3 className="mt-2 font-display font-medium text-2xl sm:text-3xl leading-tight text-navy-900 max-w-[13ch]">{c.cap.t}</h3>
                </div>
                <div className="sm:text-right">
                  <div className="font-display font-medium text-5xl sm:text-6xl leading-none text-sky-600 tracking-tight">{c.cap.n}</div>
                  <div className="text-xs text-slate-500 mt-1">{c.cap.sub}</div>
                </div>
              </div>
              <div className="mt-6 sm:mt-auto pt-4"><CapacityFigure before={c.cap.before} after={c.cap.after} floorPallets={FLOOR_PALLETS} levels={RACK_LEVELS} /></div>
            </div>
          </Reveal>

          <Reveal delay={60}>
            <div className="h-full rounded-xl2 bg-navy-900 text-white p-6 sm:p-7">
              <Kicker light>{c.stock.k}</Kicker>
              <h3 className="mt-2 font-display font-medium text-2xl leading-tight">{c.stock.t}</h3>
              <p className="mt-3 text-cloud-200/80 text-sm leading-relaxed">{c.stock.d}</p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className={card}>
              <Kicker>{c.war.k}</Kicker>
              <div className="mt-3 flex items-end gap-3">
                <span className="font-display font-medium text-6xl sm:text-7xl leading-none text-navy-900 tracking-tight">{c.war.n}</span>
                <span className="pb-1 text-sm leading-snug"><b className="text-navy-900">{c.war.t}</b><br /><span className="text-slate-500">{c.war.d}</span></span>
              </div>
            </div>
          </Reveal>

          {/* Безопасность — высокая, 2 ряда */}
          <Reveal className="lg:row-span-2" delay={0}>
            <div className={`${card} flex flex-col`}>
              <Kicker>{c.safe.k}</Kicker>
              <div className="mt-2 font-display font-medium text-5xl sm:text-6xl leading-none text-navy-900 tracking-tight">{c.safe.n}</div>
              <p className="mt-2 text-slate-500 text-sm leading-relaxed">{c.safe.d}</p>
              <ul className="mt-6 lg:mt-auto lg:pt-6 space-y-2.5 text-sm text-navy-800">
                {c.safe.list.map((s, i) => {
                  const Ico = SAFE_ICONS[i];
                  return <li key={s} className="flex items-center gap-2.5"><Ico className="w-4 h-4 text-sky-600 shrink-0" />{s}</li>;
                })}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={60}>
            <div className={card}>
              <Kicker>{c.pay.k}</Kicker>
              <div className="mt-2 font-display font-medium text-4xl sm:text-5xl leading-none text-sky-600 tracking-tight">{c.pay.n}</div>
              <p className="mt-3 text-slate-500 text-sm leading-relaxed">{c.pay.d}</p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className={card}>
              <Kicker>{c.acc.k}</Kicker>
              <h3 className="mt-2 font-display font-medium text-2xl leading-tight text-navy-900">{c.acc.t}</h3>
              <p className="mt-3 text-slate-500 text-sm leading-relaxed">{c.acc.d}</p>
            </div>
          </Reveal>

          {/* Удобство — 2 колонки, с рисунком балки */}
          <Reveal className="sm:col-span-2" delay={60}>
            <div className={`${card} flex items-center gap-6`}>
              <div className="flex-1 min-w-0">
                <Kicker>{c.conv.k}</Kicker>
                <h3 className="mt-2 font-display font-medium text-2xl leading-tight text-navy-900">{c.conv.t}</h3>
                <p className="mt-3 text-slate-500 text-sm leading-relaxed max-w-md">{c.conv.d}</p>
              </div>
              <div className="w-[128px] sm:w-[180px] shrink-0"><TierFigure /></div>
            </div>
          </Reveal>

          <Reveal delay={0}>
            <div className={card}>
              <Kicker>{c.flex.k}</Kicker>
              <h3 className="mt-2 font-display font-medium text-2xl leading-[1.15] text-navy-900">{c.flex.t.split('. ').map((w, i, a) => <span key={w} className="block">{w}{i < a.length - 1 ? '.' : ''}</span>)}</h3>
              <p className="mt-3 text-slate-500 text-sm leading-relaxed">{c.flex.d}</p>
            </div>
          </Reveal>

          <Reveal delay={60}>
            <div className={card}>
              <Kicker>{c.metal.k}</Kicker>
              <div className="mt-3 space-y-1.5">
                {c.metal.layers.map((l, i) => (
                  <div key={l} className={`rounded-md px-3 py-1.5 text-xs font-semibold ${['bg-sky-600 text-white', 'bg-cloud-200 text-navy-800', 'bg-slate-600 text-white'][i]}`}>{l}</div>
                ))}
              </div>
              <h3 className="mt-4 font-display font-medium text-2xl leading-[1.15] text-navy-900">{c.metal.t.split('. ').map((w, i, a) => <span key={w} className="block">{w}{i < a.length - 1 ? '.' : ''}</span>)}</h3>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className={card}>
              <Kicker>{c.money.k}</Kicker>
              <div className="mt-2 font-display font-medium text-5xl sm:text-6xl leading-none text-navy-900 tracking-tight">{c.money.n}</div>
              <p className="mt-3 text-slate-500 text-sm leading-relaxed">{c.money.d}</p>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-4" delay={0}>
          <div className="rounded-xl2 bg-navy-900 text-white p-7 sm:p-10 flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
            <div className="flex-1">
              <h3 className="font-display font-medium text-2xl sm:text-3xl lg:text-4xl leading-tight text-balance">{c.cta.t}</h3>
              <p className="mt-3 text-cloud-200/80">{c.cta.d}</p>
            </div>
            <div className="shrink-0 text-center">
              <a href="#zayavka" className="btn-11 inline-flex items-center justify-center gap-2 bg-white text-navy-900 font-semibold px-6 py-3.5 rounded-xl hover:bg-sky-400 hover:text-white transition">
                {c.cta.btn} <IcoArrow className="w-4 h-4" />
              </a>
              <div className="mt-2 text-xs text-cloud-200/60">{c.cta.note}</div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
