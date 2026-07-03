import Header from '../components/Header';
import Footer from '../components/Footer';
import LeadForm from '../components/LeadForm';
import Reveal from '../components/Reveal';
import ProductSlider from '../components/ProductSlider';
import { SplitHead, Eyebrow } from '../components/Section';
import { SITE, CLIENTS, ISO_CERTS } from '../lib/site';
import { getLatest } from '../lib/articles';
import {
  IcoRuler, IcoDraft, IcoFactory, IcoWrench, IcoShield, IcoWeight,
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
  { Ico: IcoDraft, t: 'Проектирование', d: 'Проектируем систему хранения под вашу задачу и считаем точную стоимость.' },
  { Ico: IcoFactory, t: 'Производство', d: 'Изготавливаем из металла 1 сорта: оцинковка и порошковая покраска.' },
  { Ico: IcoWrench, t: 'Монтаж', d: 'Доставляем и монтируем «под ключ». По Ташкенту — бесплатно.' },
];

const STATS = [
  { n: '4', s: 'года', l: 'на рынке систем хранения' },
  { n: '1000+', s: '', l: 'реализованных проектов' },
  { n: '10', s: 'лет', l: 'официальной гарантии по документу' },
  { n: '3.5', s: 'т', l: 'нагрузка на ярус' },
  { n: '15', s: '', l: 'специалистов в команде' },
  { n: '100%', s: '', l: 'под ключ: замер, проект, монтаж' },
];

// Types of shelving — the SINGLE place types are listed (links to detail pages)
const DIRECTIONS = [
  { Ico: IcoPallet, t: 'Паллетные (Mega) стеллажи', d: 'Для складов и логистики: хранение на паллетах, доступ погрузочной техникой.', img: IMG.pallet, href: '/napravleniya/palletnye-stellazhi' },
  { Ico: IcoLayers, t: 'Среднегрузовые стеллажи', d: 'Универсальные металлические стеллажи для склада, производства и подсобных помещений.', img: IMG.medium, href: '/napravleniya/srednegruzovye-stellazhi' },
  { Ico: IcoArchive, t: 'Архивные стеллажи', d: 'Системное и компактное хранение документов, коробов и архивов.', img: IMG.archive, href: '/napravleniya/arhivnye-stellazhi' },
  { Ico: IcoShop, t: 'Торговые стеллажи', d: 'Для магазинов, маркетов и торговых залов — презентабельный вид и удобная выкладка.', img: IMG.retail, href: '/napravleniya/torgovye-stellazhi' },
];

// Real projects (NOT a repeat of the types) — used in the slider
const PROJECTS = [
  { t: 'Super Pack', d: 'Паллетные стеллажи для крупнейшего в Узбекистане завода бумаги и упаковки. Безопасные сертифицированные системы под тяжёлую нагрузку.', load: 'Завод · паллетные', img: '/works/w1.jpg' },
  { t: 'JAC Motors', d: 'Паллетные стеллажи для склада автомобильного завода. Проектирование под интенсивную работу погрузочной техники.', load: 'Автозавод · паллетные', img: '/works/w2.jpg' },
  { t: 'Bloom Shop', d: '30 комплектов среднегрузовых стеллажей: высота 2.5 м, 5 ярусов, до 400 кг на ярус. Склад косметики для маркетплейса — под ключ.', load: 'Маркетплейс · 30 комплектов', img: '/works/retail.jpg' },
  { t: 'Caffelito Coffee', d: 'Стеллажи для склада кофейни: высота 4 м, 1.5 тонны на ярус. Поставлено и смонтировано за 12 часов.', load: 'HoReCa · 12 часов', img: '/works/w3.jpg' },
  { t: 'Sayqal Family Restaurant', d: 'Проектные стеллажи для складского помещения ресторана. Компактная и надёжная система хранения.', load: 'Ресторан · проект', img: '/works/w5.jpg' },
  { t: 'Discovery Invest', d: 'Системы хранения для складского комплекса. Полный цикл: замер, проектирование, поставка и монтаж.', load: 'Складской комплекс', img: '/works/medium.jpg' },
];

const ADV = [
  { Ico: IcoShield, t: 'Гарантия 10 лет — по документу', d: 'Единственная компания на рынке Узбекистана, которая даёт 10 лет официальной гарантии в письменном виде.' },
  { Ico: IcoWeight, t: 'Металл 1 сорта + оцинковка', d: 'Сталь первого сорта, гальваническое покрытие и порошковая краска — прочность и срок службы десятилетиями.' },
  { Ico: IcoFactory, t: 'Собственное производство', d: 'Изготавливаем стеллажи любого объёма и габарита — от 1 секции до проектов на несколько миллиардов сум.' },
  { Ico: IcoWeight, t: 'Нагрузка 100 кг – 3.5 тонны', d: 'Рассчитываем конструкцию под вашу реальную нагрузку — от лёгких полок до тяжёлых паллетных систем.' },
  { Ico: IcoWrench, t: 'Полный цикл под ключ', d: 'Замер, проектирование, производство, доставка и монтаж. По Ташкенту все услуги бесплатно.' },
  { Ico: IcoClock, t: 'Бесплатный расчёт за 24 часа', d: 'Выезжаем, замеряем, проектируем и считаем стоимость — бесплатно и без обязательств.' },
];

export default function Home() {
  const latest = getLatest(3);
  return (
    <div className="bg-white text-ink">
      <Header />

      {/* ============ HERO — bottom-left, no form ============ */}
      <section className="relative min-h-svh flex flex-col justify-end overflow-hidden">
        <div className="absolute inset-0 bg-navy-900">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={IMG.hero}
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/70 to-navy-900/45" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900/70 to-transparent" />
        </div>

        <div className="relative w-full px-5 sm:px-8 lg:px-14 2xl:px-24 pb-14 sm:pb-16 pt-28">
          <div className="animate-fadeup max-w-3xl text-white">
            <Eyebrow light>Системы хранения · Ташкент</Eyebrow>
            <h1 className="mt-5 font-display font-medium text-4xl sm:text-5xl lg:text-[3.7rem] leading-[1.08]">
              Стеллажи и системы<br />хранения <span className="text-sky-400">полного цикла</span>
            </h1>
            <p className="mt-5 text-lg text-cloud-200/85 max-w-xl leading-relaxed">
              Производим и монтируем стеллажи любого типа по всему Узбекистану. Нагрузка до 3.5 тонн · гарантия 10 лет · бесплатный замер за 24 часа.
            </p>
            <div className="flex flex-wrap gap-3 mt-7">
              <a href="#zayavka" className="inline-flex items-center gap-2 bg-brand-grad text-white font-bold px-7 py-3.5 rounded-xl shadow-glow hover:brightness-110">
                Обсудить проект <IcoArrow className="w-5 h-5" />
              </a>
              <a href="#napravleniya" className="inline-flex items-center gap-2 border border-white/30 hover:bg-white hover:text-navy-800 text-white px-7 py-3.5 rounded-xl font-semibold backdrop-blur-sm">
                Смотреть направления
              </a>
            </div>
            <div className="flex flex-wrap gap-x-7 gap-y-2 mt-8 text-sm text-cloud-200/80">
              {['Гарантия 10 лет', 'Металл 1 сорта', 'Бесплатный замер'].map((c) => (
                <span key={c} className="inline-flex items-center gap-1.5"><IcoCheck className="w-4 h-4 text-sky-400" /> {c}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ CLIENTS STRIP ============ */}
      <section className="border-b border-cloud-200 bg-cloud-50">
        <div className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-7">
          <p className="text-center text-slate-500 text-xs uppercase tracking-widest mb-4">Нам доверяют компании Узбекистана</p>
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3">
            {CLIENTS.map((c) => (
              <span key={c} className="text-navy-800/70 font-display font-bold text-lg">{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PROCESS ============ */}
      <section id="o-kompanii" className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16 sm:py-20">
        <SplitHead
          eyebrow="Циклы"
          title="Контроль на всех этапах — от замера до готового объекта"
          desc="RAXPRO — производитель полного цикла. Мы отвечаем за каждый этап: от выезда на объект до монтажа «под ключ», поэтому качество и сроки под нашим контролем."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
          {STEPS.map((s, i) => (
            <Reveal key={s.t} delay={i * 80}>
              <div className="relative h-full rounded-xl2 bg-cloud-50 border border-cloud-200 p-6 hover:bg-white hover:shadow-card transition">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-navy-900 text-white grid place-items-center">
                    <s.Ico className="w-6 h-6" />
                  </div>
                  <span className="font-display font-medium text-3xl text-cloud-300">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="font-bold text-lg text-navy-800 mt-4">{s.t}</h3>
                <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ METRICS BAND ============ */}
      <section className="relative bg-navy-900 text-white overflow-hidden notch-tr">
        <div className="absolute inset-0 grid-lines opacity-30" />
        <div className="relative w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16">
          <div className="grid lg:grid-cols-[1fr,1.5fr] gap-10 items-center">
            <div>
              <Eyebrow light>Цифры</Eyebrow>
              <h2 className="mt-4 font-display font-medium text-3xl sm:text-4xl">RAXPRO в цифрах</h2>
              <p className="mt-3 text-cloud-200/75 max-w-md">
                Мы построили системы хранения для складов, заводов, магазинов и маркетплейсов по всему Узбекистану.
              </p>
              <a href="#zayavka" className="inline-flex items-center gap-2 mt-6 bg-white text-navy-900 font-bold px-6 py-3 rounded-xl hover:bg-sky-400 hover:text-white transition">
                Связаться с нами <IcoArrow className="w-5 h-5" />
              </a>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-white/10 rounded-xl2 overflow-hidden border border-white/10">
              {STATS.map((s) => (
                <div key={s.l} className="bg-navy-900 p-6">
                  <div className="font-display font-medium text-4xl sm:text-5xl text-sky-400 leading-none">
                    {s.n}<span className="text-2xl text-sky-300 ml-1">{s.s}</span>
                  </div>
                  <div className="text-cloud-200/70 text-sm mt-2 leading-snug">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ DIRECTIONS — big 2-up overlay cards ============ */}
      <section id="napravleniya" className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16 sm:py-20">
        <SplitHead
          eyebrow="Направления"
          title="Наши основные направления работы"
          desc="Четыре ключевых типа стеллажей и системы хранения любого масштаба — от одной секции до проектов на несколько миллиардов сум."
        />
        <div className="grid md:grid-cols-2 gap-5 mt-10">
          {DIRECTIONS.map((d, i) => (
            <Reveal key={d.t} delay={i * 80}>
              <a href={d.href} className="group relative block rounded-xl2 overflow-hidden min-h-[320px] shadow-card">
                <img src={d.img} alt={d.t} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/95 via-navy-900/55 to-navy-900/20" />
                <div className="absolute top-4 left-4 w-11 h-11 rounded-xl bg-white/95 text-navy-800 grid place-items-center">
                  <d.Ico className="w-6 h-6" />
                </div>
                <div className="absolute top-4 right-4 w-11 h-11 rounded-full border border-white/40 text-white grid place-items-center group-hover:bg-white group-hover:text-navy-800 transition">
                  <IcoArrow className="w-5 h-5 -rotate-45" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <h3 className="font-display font-bold text-2xl">{d.t}</h3>
                  <p className="text-cloud-200/85 text-sm mt-2 max-w-md leading-relaxed">{d.d}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-300 group-hover:text-white">
                    Перейти <IcoArrow className="w-4 h-4" />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ INCOME / VALUE — quality shelving grows revenue ============ */}
      <section className="bg-cloud-50 border-y border-cloud-200">
        <div className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16 sm:py-20">
          <SplitHead
            eyebrow="Выгода"
            title="Качественные стеллажи увеличивают доход"
            desc="Хорошая система хранения — это не расход, а инвестиция, которая возвращается вместимостью, сроком службы и порядком."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
            {[
              { Ico: IcoLayers, t: 'Больше вместимости', d: 'Правильная система поднимает товар вверх и использует всю высоту помещения — вы храните в разы больше на той же площади и не платите за лишние метры.' },
              { Ico: IcoShield, t: 'Качество и долговечность', d: 'Металл 1 сорта, оцинковка и 10 лет гарантии. Стеллажи служат десятилетиями без замены и ремонта — экономия вместо постоянных трат.' },
              { Ico: IcoShop, t: 'Дизайн и порядок', d: 'Аккуратные, продуманные стеллажи улучшают вид склада и торгового зала, ускоряют выкладку и работу — а значит, повышают продажи.' },
            ].map((a, i) => (
              <Reveal key={a.t} delay={i * 70}>
                <div className="h-full rounded-xl2 bg-white border border-cloud-200 shadow-card p-6">
                  <div className="w-12 h-12 rounded-xl bg-brand-grad text-white grid place-items-center shadow-glow">
                    <a.Ico className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-navy-800 mt-4">{a.t}</h3>
                  <p className="text-slate-500 text-sm mt-2 leading-relaxed">{a.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PROJECTS SLIDER (real works, not a repeat of types) ============ */}
      <section id="proekty" className="bg-cloud-50 border-y border-cloud-200">
        <div className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16 sm:py-20">
          <SplitHead
            eyebrow="Проекты"
            title="Реальные объекты RAXPRO"
            desc="Спроектировано, изготовлено и смонтировано «под ключ» для заводов, складов, магазинов и маркетплейсов."
          />
          <div className="mt-10">
            <ProductSlider items={PROJECTS} />
          </div>
        </div>
      </section>

      {/* ============ WHY / ADVANTAGES ============ */}
      <section className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16 sm:py-20">
        <SplitHead
          eyebrow="Преимущества"
          title="Не обещания, а факты"
          desc="Что отличает RAXPRO от других поставщиков стеллажей на рынке Узбекистана."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
          {ADV.map((a, i) => (
            <Reveal key={a.t} delay={i * 70}>
              <div className="h-full rounded-xl2 bg-cloud-50 border border-cloud-200 p-6 hover:border-sky-300 hover:bg-white hover:shadow-card transition">
                <div className="w-12 h-12 rounded-xl bg-brand-grad text-white grid place-items-center shadow-glow">
                  <a.Ico className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-navy-800 mt-4">{a.t}</h3>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">{a.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ FOUNDER ============ */}
      <section id="osnovatel" className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16 sm:py-20">
        <div className="grid lg:grid-cols-[0.85fr,1.15fr] gap-10 lg:gap-14 items-center">
          <div className="relative">
            <div className="rounded-xl2 overflow-hidden border border-cloud-200 shadow-card max-w-md">
              <img src="/brand/founder.jpg" alt="Хуршид Касимов — основатель RAXPRO" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-4 left-6 bg-white rounded-xl shadow-card border border-cloud-200 px-5 py-3">
              <div className="font-display font-medium text-navy-800 text-lg leading-tight">Хуршид Касимов</div>
              <div className="text-sm text-sky-600">Основатель RAXPRO</div>
            </div>
          </div>
          <div>
            <Eyebrow>Основатель</Eyebrow>
            <h2 className="mt-4 font-display font-medium text-3xl sm:text-4xl text-navy-800 leading-tight">
              «Доверие и порядок клиента — моя главная ценность»
            </h2>
            <div className="mt-5 space-y-4 text-slate-600 leading-relaxed max-w-2xl">
              <p>
                Я из семьи предпринимателей и строителей, в бизнес пришёл в 16 лет. К 25 годам создал около 10 небольших сервисных компаний — и через множество ошибок и побед клиенты признали меня чемпионом по качественному сервису.
              </p>
              <p>
                Сегодня через RAXPRO я поставляю качественные, прочные и эстетичные металлические стеллажи — это часть моей жизни. За несколько лет мы стали одними из ведущих на рынке Узбекистана, предлагая готовые решения для магазинов, складов и фабрик.
              </p>
              <p>
                Как основатель, я лично отвечаю за каждый проект. Когда вижу упорядоченный, правильно систематизированный склад или магазин — получаю настоящее удовольствие. Буду искренне рад навести порядок и на вашем объекте.
              </p>
            </div>
            <div className="mt-7">
              <div className="text-slate-400 text-sm mb-2">Продукция сертифицирована по международным стандартам:</div>
              <div className="flex flex-wrap gap-2.5">
                {ISO_CERTS.map((c) => (
                  <span key={c} className="inline-flex items-center gap-2 rounded-lg bg-cloud-50 border border-cloud-200 px-3.5 py-2 text-sm font-semibold text-navy-800">
                    <IcoShield className="w-4 h-4 text-sky-600" /> {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ GUARANTEE BAND — solid gradient, high contrast ============ */}
      <section className="relative bg-navy-900 overflow-hidden">
        <div className="absolute inset-0 bg-brand-grad opacity-95" />
        <div className="absolute inset-0 grid-lines opacity-30" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center text-white">
          <Reveal>
            <div className="inline-flex items-center gap-3">
              <span className="w-16 h-16 rounded-2xl bg-white/15 grid place-items-center"><IcoShield className="w-9 h-9 text-white" /></span>
              <span className="font-display font-medium text-6xl sm:text-7xl">10 лет</span>
            </div>
            <h2 className="font-display font-medium text-2xl sm:text-3xl mt-4">официальной гарантии по документу</h2>
            <p className="text-white/90 mt-4 max-w-2xl mx-auto leading-relaxed">
              Сегодня на рынке Узбекистана только RAXPRO предоставляет 10 лет гарантии в письменном виде.
              Металл 1 сорта, оцинковка и порошковая краска — стеллаж служит десятилетиями.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ NEWS / BLOG (links to separate library page) ============ */}
      <section className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16 sm:py-20">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <Eyebrow>Новости и статьи</Eyebrow>
            <h2 className="mt-4 font-display font-medium text-3xl sm:text-4xl text-navy-800">Полезное о стеллажах</h2>
          </div>
          <a href="/blog" className="inline-flex items-center gap-2 text-navy-700 font-semibold hover:text-sky-600">
            Все статьи <IcoArrow className="w-5 h-5" />
          </a>
        </div>
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
      </section>

      {/* ============ CALLBACK FORM ============ */}
      <section id="zayavka" className="relative bg-navy-900 overflow-hidden notch-tr">
        <div className="absolute inset-0 grid-lines opacity-25" />
        <div className="relative w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16 sm:py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <Eyebrow light>Заявка</Eyebrow>
            <h2 className="mt-4 font-display font-medium text-3xl sm:text-4xl">
              Оставьте заявку — и мы свяжемся с вами
            </h2>
            <p className="mt-4 text-cloud-200/80 max-w-lg leading-relaxed">
              Бесплатный замер, проектирование и расчёт за 24 часа. Менеджер подберёт оптимальное решение под вашу задачу и подготовит коммерческое предложение.
            </p>
            <div className="mt-7 space-y-3 text-cloud-200/90">
              <a href={`tel:${SITE.phoneMain}`} className="flex items-center gap-3 font-semibold hover:text-sky-300">
                <span className="w-10 h-10 rounded-lg bg-white/10 grid place-items-center text-sky-300"><IcoPhone className="w-5 h-5" /></span>
                {SITE.phoneMainHuman}
              </a>
              <div className="flex items-center gap-3 text-cloud-200/70">
                <span className="w-10 h-10 rounded-lg bg-white/10 grid place-items-center text-sky-300"><IcoPin className="w-5 h-5" /></span>
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
      <section id="kontakty" className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16 sm:py-20 grid md:grid-cols-2 gap-10">
        <div>
          <Eyebrow>Контакты</Eyebrow>
          <h2 className="mt-4 font-display font-medium text-3xl sm:text-4xl text-navy-800">Свяжитесь с нами</h2>
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
