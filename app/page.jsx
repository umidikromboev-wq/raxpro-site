import Header from '../components/Header';
import Footer from '../components/Footer';
import LeadForm from '../components/LeadForm';
import Reveal from '../components/Reveal';
import ProductSlider from '../components/ProductSlider';
import { SITE, CLIENTS } from '../lib/site';
import { getLatest } from '../lib/articles';
import {
  IcoRuler, IcoDraft, IcoFactory, IcoWrench, IcoShield, IcoWeight, IcoTruck,
  IcoLayers, IcoPallet, IcoArchive, IcoShop, IcoClock, IcoCheck, IcoArrow, IcoPin, IcoPhone,
} from '../components/Icons';

const IMG = {
  hero: '/works/hero.jpg',
  pallet: '/works/pallet.jpg',
  medium: '/works/medium.jpg',
  archive: '/works/archive.jpg',
  retail: '/works/retail.jpg',
  welder: '/works/w6.jpg',
  design: '/works/w5.jpg',
};

const STEPS = [
  { Ico: IcoRuler, t: 'Замер', d: 'Бесплатно выезжаем на объект, замеряем помещение, проёмы и реальные нагрузки.' },
  { Ico: IcoDraft, t: 'Проектирование', d: 'Проектируем систему хранения под вашу задачу и считаем точную стоимость в Billz.' },
  { Ico: IcoFactory, t: 'Производство', d: 'Изготавливаем из металла 1 сорта: оцинковка и порошковая покраска.' },
  { Ico: IcoWrench, t: 'Монтаж', d: 'Доставляем и монтируем «под ключ». По Ташкенту — бесплатно.' },
];

const STATS = [
  { n: '4', s: 'года', l: 'на рынке систем хранения' },
  { n: '1000+', s: '', l: 'реализованных проектов' },
  { n: '10', s: 'лет', l: 'официальной гарантии по документу' },
  { n: '3.5', s: 'т', l: 'нагрузка на ярус' },
  { n: '15', s: '', l: 'специалистов в команде' },
];

const DIRECTIONS = [
  { Ico: IcoPallet, t: 'Паллетные (Mega) стеллажи', d: 'Для складов и логистики: хранение на паллетах, доступ погрузочной техникой, высокая ёмкость.', load: 'до 3 500 кг / ярус', img: IMG.pallet, href: '/napravleniya/palletnye-stellazhi' },
  { Ico: IcoLayers, t: 'Среднегрузовые стеллажи', d: 'Универсальные металлические стеллажи для склада, производства и подсобных помещений.', load: '300–800 кг / полка', img: IMG.medium, href: '/napravleniya/srednegruzovye-stellazhi' },
  { Ico: IcoArchive, t: 'Архивные стеллажи', d: 'Компактное и системное хранение документов, коробов и архивов на любой высоте.', load: '100–300 кг / полка', img: IMG.archive, href: '/napravleniya/arhivnye-stellazhi' },
  { Ico: IcoShop, t: 'Торговые стеллажи', d: 'Для магазинов, маркетов и торговых залов — презентабельный вид и удобная выкладка.', load: 'под товар', img: IMG.retail, href: '/napravleniya/torgovye-stellazhi' },
];

const PRODUCTS = [
  { t: 'Паллетные стеллажи', d: 'Рамы и балки под евро- и финпаллеты. Расчёт под вашу технику.', load: 'до 3.5 т / ярус', img: IMG.pallet },
  { t: 'Среднегрузовые стеллажи', d: 'Болтовые и сборные системы для склада и производства.', load: '300–800 кг', img: IMG.medium },
  { t: 'Архивные стеллажи', d: 'Полки под короба и документы, любые типоразмеры.', load: '100–300 кг', img: IMG.archive },
  { t: 'Торговые стеллажи', d: 'Пристенные и островные для торговых залов.', load: 'под товар', img: IMG.retail },
  { t: 'Мезонинные системы', d: 'Многоэтажные конструкции для максимума площади.', load: 'проектно', img: IMG.welder },
  { t: 'Гаражные и кладовые', d: 'Прочные стеллажи для дома, гаража и кладовой.', load: '100–400 кг', img: IMG.design },
];

const ADV = [
  { Ico: IcoShield, t: 'Гарантия 10 лет — по документу', d: 'Единственная компания на рынке Узбекистана, которая даёт 10 лет официальной гарантии в письменном виде.' },
  { Ico: IcoWeight, t: 'Металл 1 сорта + оцинковка', d: 'Сталь первого сорта, гальваническое покрытие и порошковая краска — прочность и срок службы десятилетиями.' },
  { Ico: IcoFactory, t: 'Нагрузка 100 кг – 3.5 тонны', d: 'Рассчитываем конструкцию под вашу реальную нагрузку — от лёгких полок до тяжёлых паллетных систем.' },
  { Ico: IcoRuler, t: 'Любой размер под заказ', d: 'Изготовим стеллажи любого объёма и габарита — от 1 секции до проектов на несколько миллиардов сум.' },
  { Ico: IcoTruck, t: 'Замер, проект, монтаж, доставка', d: 'Полный цикл «под ключ». По Ташкенту все услуги бесплатно, по регионам — по объёму проекта.' },
  { Ico: IcoClock, t: 'Бесплатный расчёт за 24 часа', d: 'Выезжаем, замеряем, проектируем и считаем стоимость — бесплатно и без обязательств.' },
];

const CASES = [
  { c: 'Super Pack', t: 'Паллетные стеллажи для завода упаковки', d: 'Крупнейший производитель бумаги и упаковки в Узбекистане. Безопасные и сертифицированные паллетные системы.', img: '/works/w1.jpg' },
  { c: 'JAC Motors', t: 'Стеллажи для автомобильного завода', d: 'Паллетные стеллажи для склада автопроизводителя. Проектирование под тяжёлую нагрузку.', img: '/works/w2.jpg' },
  { c: 'Bloom Shop', t: 'Склад косметики для маркетплейса', d: '30 комплектов среднегрузовых стеллажей · высота 2.5 м · 5 ярусов · до 400 кг на ярус. «Под ключ».', img: '/works/retail.jpg' },
  { c: 'Caffelito Coffee', t: 'Стеллажи для склада кофейни', d: 'Высота 4 м · ширина 105 см · 1.5 тонны на ярус. Поставлено и смонтировано за 12 часов.', img: '/works/w3.jpg' },
];

const GALLERY = ['/works/w1.jpg', '/works/w2.jpg', '/works/w3.jpg', '/works/w4.jpg', '/works/pallet.jpg', '/works/medium.jpg'];

export default function Home() {
  const latest = getLatest(3);
  return (
    <div className="bg-white text-ink">
      <Header />

      {/* ============ HERO ============ */}
      <section className="relative pt-[68px] overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMG.hero} alt="Складские стеллажи RAXPRO" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/92 to-navy-900/55" />
          <div className="absolute inset-0 grid-lines opacity-30" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-16 lg:pt-20 lg:pb-24 grid lg:grid-cols-[1.15fr,0.85fr] gap-12 items-center">
          <div className="animate-fadeup text-white">
            <span className="eyebrow text-gold-400 text-sm font-semibold tracking-wide uppercase">
              <span className="w-8 h-px bg-gold-400" /> {SITE.legal} · системы хранения
            </span>
            <h1 className="mt-5 font-display font-extrabold text-4xl sm:text-5xl lg:text-[3.55rem] leading-[1.05] tracking-tight">
              Производство и монтаж стеллажей <span className="text-gold-400">полного цикла</span>
            </h1>
            <p className="mt-6 text-lg text-cloud-200/85 max-w-xl leading-relaxed">
              Проектируем, производим и монтируем складские, паллетные, архивные и торговые стеллажи в Ташкенте и по всему Узбекистану.
              Нагрузка до 3.5 тонн, официальная гарантия 10 лет, бесплатный замер и расчёт за 24 часа.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <a href="#zayavka" className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold px-7 py-3.5 rounded-xl shadow-band">
                Обсудить проект <IcoArrow className="w-5 h-5" />
              </a>
              <a href="#napravleniya" className="inline-flex items-center gap-2 border border-white/25 hover:border-gold-400 text-white px-7 py-3.5 rounded-xl font-semibold backdrop-blur-sm">
                Смотреть направления
              </a>
            </div>
            <div className="flex flex-wrap gap-x-7 gap-y-2 mt-8 text-sm text-cloud-200/80">
              {['Гарантия 10 лет', 'Металл 1 сорта', 'Бесплатный замер'].map((c) => (
                <span key={c} className="inline-flex items-center gap-1.5"><IcoCheck className="w-4 h-4 text-gold-400" /> {c}</span>
              ))}
            </div>
          </div>

          <div className="animate-fadeup lg:justify-self-end w-full max-w-md">
            <div className="text-sm font-semibold mb-3 text-white/90">Бесплатный замер и расчёт за 24 часа:</div>
            <LeadForm compact />
          </div>
        </div>
      </section>

      {/* ============ CLIENTS STRIP ============ */}
      <section className="border-b border-cloud-200 bg-cloud-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7">
          <p className="text-center text-slate-500 text-xs uppercase tracking-widest mb-4">Нам доверяют компании Узбекистана</p>
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3">
            {CLIENTS.map((c) => (
              <span key={c} className="text-navy-800/70 font-display font-bold text-lg">{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PROCESS — контроль на всех этапах ============ */}
      <section id="o-kompanii" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <Reveal>
          <span className="eyebrow text-sky-600 text-sm font-semibold uppercase tracking-wide"><span className="w-8 h-px bg-sky-600" /> Как мы работаем</span>
          <h2 className="mt-3 font-display font-extrabold text-3xl sm:text-4xl text-navy-800 tracking-tight max-w-2xl">
            Контроль на всех этапах — от замера до готового объекта
          </h2>
          <p className="mt-3 text-slate-600 max-w-2xl">
            RAXPRO — производитель полного цикла. Мы отвечаем за каждый этап: от выезда на объект до монтажа «под ключ», поэтому качество и сроки под нашим контролем.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
          {STEPS.map((s, i) => (
            <Reveal key={s.t} delay={i * 80}>
              <div className="relative h-full rounded-xl2 bg-white border border-cloud-200 shadow-card p-6 hover:shadow-card-hover hover:-translate-y-1 transition">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-navy-700/8 text-navy-700 grid place-items-center">
                    <s.Ico className="w-7 h-7" />
                  </div>
                  <span className="font-display font-extrabold text-4xl text-cloud-200">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="font-bold text-lg text-navy-800 mt-4">{s.t}</h3>
                <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ METRICS BAND ============ */}
      <section className="relative bg-navy-900 text-white overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-25" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid lg:grid-cols-[1fr,1.4fr] gap-10 items-center">
            <div>
              <span className="eyebrow text-gold-400 text-sm font-semibold uppercase tracking-wide"><span className="w-8 h-px bg-gold-400" /> Показатели</span>
              <h2 className="mt-3 font-display font-extrabold text-3xl sm:text-4xl tracking-tight">RAXPRO в цифрах</h2>
              <p className="mt-3 text-cloud-200/75 max-w-md">
                За годы работы мы построили системы хранения для складов, заводов, магазинов и маркетплейсов по всему Узбекистану.
              </p>
              <a href="#zayavka" className="inline-flex items-center gap-2 mt-6 bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold px-6 py-3 rounded-xl">
                Связаться с нами <IcoArrow className="w-5 h-5" />
              </a>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-white/10 rounded-xl2 overflow-hidden border border-white/10">
              {STATS.map((s) => (
                <div key={s.l} className="bg-navy-900 p-6">
                  <div className="font-display font-extrabold text-4xl sm:text-5xl text-gold-400 leading-none">
                    {s.n}<span className="text-2xl text-gold-400/80 ml-1">{s.s}</span>
                  </div>
                  <div className="text-cloud-200/70 text-sm mt-2 leading-snug">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ DIRECTIONS — основные направления ============ */}
      <section id="napravleniya" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <Reveal>
          <span className="eyebrow text-sky-600 text-sm font-semibold uppercase tracking-wide"><span className="w-8 h-px bg-sky-600" /> Направления</span>
          <h2 className="mt-3 font-display font-extrabold text-3xl sm:text-4xl text-navy-800 tracking-tight max-w-2xl">
            Наши основные направления работы
          </h2>
          <p className="mt-3 text-slate-600 max-w-2xl">
            Изготавливаем четыре ключевых типа стеллажей и системы хранения любого масштаба — от одной секции до проектов на несколько миллиардов сум.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
          {DIRECTIONS.map((d, i) => (
            <Reveal key={d.t} delay={i * 80}>
              <div className="group h-full rounded-xl2 overflow-hidden bg-white border border-cloud-200 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition flex flex-col">
                <div className="aspect-[4/3] overflow-hidden bg-cloud-100 relative">
                  <img src={d.img} alt={d.t} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <div className="absolute top-3 left-3 w-11 h-11 rounded-xl bg-white/95 text-navy-700 grid place-items-center shadow-card">
                    <d.Ico className="w-6 h-6" />
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-navy-800">{d.t}</h3>
                  <p className="text-slate-500 text-sm mt-1.5 flex-1 leading-relaxed">{d.d}</p>
                  <div className="text-xs font-semibold text-sky-600 mt-3">{d.load}</div>
                  <a href={d.href} className="mt-4 inline-flex items-center justify-between gap-2 text-sm font-semibold text-navy-700 border border-cloud-200 hover:border-navy-700 hover:bg-navy-700 hover:text-white rounded-lg px-4 py-2.5 transition">
                    Перейти <IcoArrow className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ PRODUCTS SLIDER ============ */}
      <section id="produkciya" className="bg-cloud-50 border-y border-cloud-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <Reveal>
            <span className="eyebrow text-sky-600 text-sm font-semibold uppercase tracking-wide"><span className="w-8 h-px bg-sky-600" /> Продукция</span>
            <h2 className="mt-3 font-display font-extrabold text-3xl sm:text-4xl text-navy-800 tracking-tight max-w-2xl">
              Материалы и изделия для проектов разного масштаба
            </h2>
            <p className="mt-3 text-slate-600 max-w-2xl">
              Стандартные решения и изготовление под заказ — под вашу нагрузку, габариты и задачу хранения.
            </p>
          </Reveal>
          <div className="mt-10">
            <ProductSlider items={PRODUCTS} />
          </div>
        </div>
      </section>

      {/* ============ WHY / ADVANTAGES ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <Reveal>
          <span className="eyebrow text-sky-600 text-sm font-semibold uppercase tracking-wide"><span className="w-8 h-px bg-sky-600" /> Почему RAXPRO</span>
          <h2 className="mt-3 font-display font-extrabold text-3xl sm:text-4xl text-navy-800 tracking-tight max-w-2xl">
            Не обещания, а факты, которые отличают нас от других
          </h2>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
          {ADV.map((a, i) => (
            <Reveal key={a.t} delay={i * 70}>
              <div className="h-full rounded-xl2 bg-white border border-cloud-200 shadow-card p-6 hover:border-sky-300 transition">
                <div className="w-12 h-12 rounded-xl bg-gold-500/12 text-gold-600 grid place-items-center">
                  <a.Ico className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-lg text-navy-800 mt-4">{a.t}</h3>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">{a.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ GUARANTEE BAND ============ */}
      <section className="relative py-20">
        <div className="absolute inset-0">
          <img src={IMG.welder} alt="Производство стеллажей RAXPRO" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-navy-900/88" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center text-white">
          <Reveal>
            <div className="inline-flex items-center gap-3 text-gold-400">
              <IcoShield className="w-12 h-12" />
              <span className="font-display font-extrabold text-6xl sm:text-7xl">10 лет</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl mt-3">официальной гарантии по документу</h2>
            <p className="text-cloud-200/80 mt-4 max-w-2xl mx-auto leading-relaxed">
              Сегодня на рынке Узбекистана только RAXPRO предоставляет 10 лет гарантии в письменном виде.
              Металл 1 сорта, оцинковка и порошковая краска — стеллаж служит десятилетиями.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ PROJECTS / CASES ============ */}
      <section id="proekty" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <Reveal>
          <span className="eyebrow text-sky-600 text-sm font-semibold uppercase tracking-wide"><span className="w-8 h-px bg-sky-600" /> Проекты</span>
          <h2 className="mt-3 font-display font-extrabold text-3xl sm:text-4xl text-navy-800 tracking-tight max-w-2xl">
            Реальные объекты, спроектированные и смонтированные «под ключ»
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-5 mt-10">
          {CASES.map((k, i) => (
            <Reveal key={k.c} delay={i * 70}>
              <article className="group rounded-xl2 overflow-hidden bg-white border border-cloud-200 shadow-card hover:shadow-card-hover transition flex flex-col sm:flex-row">
                <div className="sm:w-52 shrink-0 aspect-[4/3] sm:aspect-auto overflow-hidden bg-cloud-100">
                  <img src={k.img} alt={`${k.c} — ${k.t}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                </div>
                <div className="p-5 flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider text-gold-600">{k.c}</span>
                  <h3 className="font-bold text-navy-800 mt-1">{k.t}</h3>
                  <p className="text-slate-500 text-sm mt-2 leading-relaxed">{k.d}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
          {GALLERY.map((src, i) => (
            <Reveal key={src} delay={i * 50}>
              <div className="rounded-xl2 overflow-hidden border border-cloud-200 aspect-[4/3] bg-cloud-100">
                <img src={src} alt={`Объект RAXPRO ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ NEWS / BLOG ============ */}
      <section className="bg-cloud-50 border-y border-cloud-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <Reveal>
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div>
                <span className="eyebrow text-sky-600 text-sm font-semibold uppercase tracking-wide"><span className="w-8 h-px bg-sky-600" /> Новости и статьи</span>
                <h2 className="mt-3 font-display font-extrabold text-3xl sm:text-4xl text-navy-800 tracking-tight">Полезное о стеллажах</h2>
              </div>
              <a href="/blog" className="inline-flex items-center gap-2 text-navy-700 font-semibold hover:text-sky-600">
                Все статьи <IcoArrow className="w-5 h-5" />
              </a>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-5 mt-10">
            {latest.map((a, i) => (
              <Reveal key={a.slug} delay={i * 80}>
                <a href={`/blog/${a.slug}`} className="group block h-full rounded-xl2 overflow-hidden bg-white border border-cloud-200 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition">
                  <div className="aspect-[16/9] overflow-hidden bg-cloud-100">
                    <img src={a.cover} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-semibold text-sky-600">{a.category}</span>
                    <h3 className="font-bold text-navy-800 mt-1.5 leading-snug group-hover:text-sky-600">{a.title}</h3>
                    <p className="text-slate-500 text-sm mt-2 line-clamp-2">{a.excerpt}</p>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CALLBACK FORM ============ */}
      <section id="zayavka" className="relative bg-navy-900 overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <span className="eyebrow text-gold-400 text-sm font-semibold uppercase tracking-wide"><span className="w-8 h-px bg-gold-400" /> Заявка</span>
            <h2 className="mt-3 font-display font-extrabold text-3xl sm:text-4xl tracking-tight">
              Оставьте заявку — и мы свяжемся с вами в ближайшее время
            </h2>
            <p className="mt-4 text-cloud-200/80 max-w-lg leading-relaxed">
              Бесплатный замер, проектирование и расчёт за 24 часа. Менеджер подберёт оптимальное решение под вашу задачу и подготовит коммерческое предложение.
            </p>
            <div className="mt-7 space-y-3 text-cloud-200/90">
              <a href={`tel:${SITE.phoneMain}`} className="flex items-center gap-3 font-semibold hover:text-gold-400">
                <span className="w-10 h-10 rounded-lg bg-white/10 grid place-items-center text-gold-400"><IcoPhone className="w-5 h-5" /></span>
                {SITE.phoneMainHuman}
              </a>
              <div className="flex items-center gap-3 text-cloud-200/70">
                <span className="w-10 h-10 rounded-lg bg-white/10 grid place-items-center text-gold-400"><IcoPin className="w-5 h-5" /></span>
                {SITE.addressCity}, {SITE.address}
              </div>
            </div>
          </div>
          <div className="w-full max-w-md lg:justify-self-end">
            <LeadForm />
          </div>
        </div>
      </section>

      {/* ============ CONTACTS + MAP ============ */}
      <section id="kontakty" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 grid md:grid-cols-2 gap-10">
        <div>
          <span className="eyebrow text-sky-600 text-sm font-semibold uppercase tracking-wide"><span className="w-8 h-px bg-sky-600" /> Контакты</span>
          <h2 className="mt-3 font-display font-extrabold text-3xl sm:text-4xl text-navy-800 tracking-tight">Свяжитесь с нами</h2>
          <div className="mt-6 space-y-5">
            <div>
              <div className="text-slate-400 text-sm">Телефоны</div>
              <a href={`tel:${SITE.phoneMain}`} className="block text-xl font-bold text-navy-800 hover:text-sky-600">{SITE.phoneMainHuman}</a>
              <a href={`tel:${SITE.phoneAlt}`} className="block text-navy-700 hover:text-sky-600">{SITE.phoneAltHuman}</a>
              <a href={`tel:${SITE.landline}`} className="block text-navy-700 hover:text-sky-600">{SITE.landlineHuman}</a>
            </div>
            <div>
              <div className="text-slate-400 text-sm">Email</div>
              <p className="text-navy-700">{SITE.emails.join(' · ')}</p>
            </div>
            <div>
              <div className="text-slate-400 text-sm">Адрес</div>
              <p className="text-navy-700">{SITE.addressCity}, {SITE.address}</p>
              <p className="text-slate-400 text-sm">{SITE.landmark}</p>
            </div>
            <div>
              <div className="text-slate-400 text-sm">Соцсети</div>
              <div className="flex gap-3 mt-1">
                <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="text-navy-700 font-semibold hover:text-sky-600">Instagram</a>
                <a href={SITE.telegram} target="_blank" rel="noopener noreferrer" className="text-navy-700 font-semibold hover:text-sky-600">Telegram</a>
                <a href={SITE.reviewsChannel} target="_blank" rel="noopener noreferrer" className="text-navy-700 font-semibold hover:text-sky-600">Отзывы</a>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-xl2 overflow-hidden border border-cloud-200 shadow-card min-h-[340px]">
          <iframe
            title="RAXPRO на карте"
            className="w-full h-full min-h-[340px]"
            src="https://maps.google.com/maps?q=%D0%A2%D1%83%D1%80%D1%82%20%D0%90%D1%80%D1%8B%D0%BA%2011/1%20%D0%A2%D0%B0%D1%88%D0%BA%D0%B5%D0%BD%D1%82&z=15&output=embed"
            loading="lazy"
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}
