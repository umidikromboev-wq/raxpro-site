import Reveal from './Reveal';
import { SplitHead } from './Section';
import { IcoArrow, IcoCheck } from './Icons';
import { href } from '../lib/lang';

// «Заводские против кустарных» (разбор 22.09): таблица пар, а не два списка —
// каждая строка читается как одно сравнение. Две группы: материал и гарантия,
// и то, чего у сварного стеллажа нет по конструкции (это нельзя оспорить).
// Ниже — страх (безопасность) и честный ответ про цену с шагом в конструктор.
// Марка стали и толщина стойки — PLACEHOLDER до данных от клиента.

const MAX_LOAD_T = 4;

const COPY = {
  ru: {
    title: 'Заводские стеллажи RAXPRO против кустарных',
    text: 'Стеллажи от «сварщиков» кажутся дешевле. Вот что вы получаете на самом деле.',
    us: 'Заводские RAXPRO',
    them: 'Кустарные «сварщики»',
    groups: [
      {
        h: 'Материал и гарантия',
        rows: [
          { us: 'Сталь заводского проката, завод сертифицирован по ISO', them: 'Металл неизвестного происхождения, толщина «какая была»' },
          { us: 'Оцинковка + порошковая краска — не ржавеет и не облезает', them: 'Обычная краска — облезает и ржавеет' },
          { us: `Нагрузка рассчитана: до ${MAX_LOAD_T} т на ярус, расчёт в КП`, them: 'Нагрузку никто не считал' },
          { us: '10 лет гарантии по договору', them: 'Гарантия «на словах»' },
          { us: 'Всё в наличии в любом объёме — монтаж без ожидания', them: 'Изготовление под заказ, сроки срываются' },
        ],
      },
      {
        h: 'Чего у сварного стеллажа нет в принципе',
        rows: [
          { us: 'Ярусы переставляются: балку перевесили за минуту под новый товар', them: 'Навсегда такой, каким сварили' },
          { us: 'Разбирается и переезжает с вами на новый склад', them: 'При переезде — только резать' },
          { us: 'Наращивается: докупили секции — ряд вырос', them: 'Новый ряд — заказывать заново' },
          { us: 'Замки балок и отбойники стоек — балку не выбьет погрузчиком', them: 'Балка держится на сварном шве' },
        ],
      },
    ],
    safety: `Сварной стеллаж обычно никто не проверял на нагрузку. Когда на нём ${MAX_LOAD_T} тонны над головами людей — это уже не экономия, а риск.`,
    priceTitle: 'Да, сварной стеллаж дешевле на старте.',
    priceText:
      'Но его нельзя переставить, расширить или забрать при переезде, а через пару лет краска облезет. Заводской стеллаж служит все 10 лет гарантии и дольше, сохраняет стоимость — его можно продать или перевезти.',
    cta: 'Сравнить стоимость для моего склада',
  },
  uz: {
    title: 'RAXPRO zavod stellajlari va hunarmand stellajlari',
    text: '«Payvandchilar»ning stellajlari arzonroq koʻrinadi. Aslida nima olasiz — mana.',
    us: 'RAXPRO zavod mahsuloti',
    them: 'Hunarmand «payvandchilar»',
    groups: [
      {
        h: 'Material va kafolat',
        rows: [
          { us: 'Zavod prokat poʻlati, zavod ISO boʻyicha sertifikatlangan', them: 'Kelib chiqishi nomaʼlum metall, qalinligi «qanday boʻlsa»' },
          { us: 'Sinklash + kukunli boʻyoq — zanglamaydi va koʻchmaydi', them: 'Oddiy boʻyoq — koʻchadi va zanglaydi' },
          { us: `Yuklama hisoblangan: har qavatga ${MAX_LOAD_T} t gacha, hisob tijorat taklifida`, them: 'Yuklamani hech kim hisoblamagan' },
          { us: 'Shartnoma boʻyicha 10 yil kafolat', them: 'Kafolat «ogʻzaki»' },
          { us: 'Hammasi istalgan hajmda mavjud — montaj kutmasdan', them: 'Buyurtmaga tayyorlanadi, muddat buziladi' },
        ],
      },
      {
        h: 'Payvandlangan stellajda umuman yoʻq narsalar',
        rows: [
          { us: 'Qavatlar oʻzgaradi: balkani yangi tovarga bir daqiqada koʻchirasiz', them: 'Qanday payvandlangan boʻlsa — abadiy shunday' },
          { us: 'Yigʻiladi va siz bilan yangi omborga koʻchadi', them: 'Koʻchishda — faqat kesish' },
          { us: 'Kengayadi: seksiya qoʻshdingiz — qator oʻsdi', them: 'Yangi qator — qaytadan buyurtma' },
          { us: 'Balka qulflari va ustun himoyasi — pogruzchik urib tushirmaydi', them: 'Balka payvand chokida turadi' },
        ],
      },
    ],
    safety: `Payvandlangan stellajni odatda hech kim yuklamaga tekshirmagan. Unda odamlar boshi ustida ${MAX_LOAD_T} tonna turganda — bu tejash emas, xavf.`,
    priceTitle: 'Ha, payvandlangan stellaj boshida arzonroq.',
    priceText:
      'Lekin uni koʻchirib, kengaytirib yoki koʻchishda olib boʻlmaydi, bir-ikki yilda boʻyogʻi koʻchadi. Zavod stellaji 10 yil kafolat va undan uzoq xizmat qiladi, qiymatini saqlaydi — sotish yoki koʻchirish mumkin.',
    cta: 'Omborim uchun narxni solishtirish',
  },
};

function Cross(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function PhotoHead({ src, label, dark, Icon, grayscale = false }) {
  return (
    <div className={`relative aspect-[4/3] sm:aspect-[16/9] overflow-hidden ${dark ? 'bg-navy-900' : 'bg-cloud-100'}`}>
      <img src={src} alt={label} width={1168} height={880} loading="lazy" decoding="async"
        className={`absolute inset-0 w-full h-full object-cover ${grayscale ? 'grayscale-[35%]' : ''}`} />
      <div className={`absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t ${dark ? 'from-navy-900/80' : 'from-white/80'} to-transparent`} />
      <div className={`absolute top-3 left-3 sm:top-4 sm:left-4 inline-flex items-center gap-1.5 rounded-full text-[11px] sm:text-xs font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 ${dark ? 'bg-white text-navy-900' : 'bg-slate-800 text-white'}`}>
        <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        {label}
      </div>
    </div>
  );
}

export default function Comparison({ lang = 'ru' }) {
  const L = lang;
  const c = COPY[L] || COPY.ru;

  return (
    <section className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-12 sm:py-20" aria-labelledby="cmp-title">
      <SplitHead title={c.title} desc={c.text} />

      <Reveal className="mt-6 sm:mt-10 rounded-xl2 border border-cloud-200 bg-white shadow-card overflow-hidden">
        {/* Две фотографии-заголовка колонок */}
        <div className="grid grid-cols-2">
          <PhotoHead src="/images/cmp-factory.jpg" label={c.us} dark Icon={IcoCheck} />
          <PhotoHead src="/images/cmp-crude.jpg" label={c.them} Icon={Cross} grayscale />
        </div>

        {/* Строки: на телефоне пара «наше / их» стоит столбиком, с sm — двумя колонками */}
        <div className="divide-y divide-cloud-200">
          {c.groups.map((g) => (
            <div key={g.h}>
              <div className="px-4 sm:px-6 lg:px-8 pt-5 pb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">{g.h}</div>
              <ul className="divide-y divide-cloud-100">
                {g.rows.map((r) => (
                  <li key={r.us} className="grid sm:grid-cols-2 gap-2 sm:gap-6 px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-600 grid place-items-center shrink-0 mt-0.5">
                        <IcoCheck className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-navy-900 font-semibold text-[15px] leading-snug">{r.us}</span>
                    </div>
                    <div className="flex items-start gap-3 pl-9 sm:pl-0">
                      <span className="hidden sm:grid w-6 h-6 rounded-full bg-cloud-100 text-slate-400 place-items-center shrink-0 mt-0.5">
                        <Cross className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-slate-500 text-sm sm:text-[15px] leading-snug">{r.them}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Безопасность — главный страх, одной строкой */}
        <p className="mx-4 sm:mx-6 lg:mx-8 my-5 sm:my-6 rounded-xl border-l-4 border-sky-500 bg-cloud-50 px-4 py-3 text-sm sm:text-[15px] text-navy-900 leading-relaxed">
          {c.safety}
        </p>
      </Reveal>

      {/* Честный ответ про цену + следующий шаг */}
      <Reveal delay={80} className="mt-4 sm:mt-5 rounded-xl2 bg-navy-900 text-white p-6 sm:p-8 lg:p-10 grid lg:grid-cols-[minmax(0,1fr),auto] gap-6 lg:gap-12 items-center notch-tr">
        <div>
          <h3 className="font-display font-medium text-xl sm:text-2xl lg:text-[28px] leading-tight">{c.priceTitle}</h3>
          <p className="mt-3 text-cloud-200/85 text-[15px] leading-relaxed max-w-2xl">{c.priceText}</p>
        </div>
        <a href={href(L, '/konstruktor')} className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-navy-900 font-bold px-5 py-3.5 transition whitespace-nowrap">
          {c.cta} <IcoArrow className="w-4 h-4" />
        </a>
      </Reveal>
    </section>
  );
}
