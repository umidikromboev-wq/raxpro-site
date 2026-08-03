import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import LogoMarquee from '../../../components/LogoMarquee';
import { IcoCheck, IcoArrow } from '../../../components/Icons';
import { SITE, siteLoc, ISO_CERTS, CLIENT_LOGOS } from '../../../lib/site';
import { SHOP } from '../../../lib/shop';
import { normalizeLang } from '../../../lib/i18n';
import { alternatesFor, href } from '../../../lib/lang';
import { breadcrumbSchema, organizationSchema, JsonLd } from '../../../lib/schema';

const A = {
  ru: {
    title: 'О компании RAXPRO',
    seoTitle: 'О компании RAXPRO — производитель стеллажей в Ташкенте с 2021 года',
    seoDesc:
      'RAXPRO — производство металлических стеллажей и систем хранения в Ташкенте: 1000+ реализованных проектов, сертификаты ISO, гарантия 10 лет по документу, полный цикл от замера до монтажа.',
    lead: 'Мы производим и монтируем металлические стеллажи и системы хранения в Узбекистане. Полный цикл: замер, проект, изготовление, доставка и монтаж — без подрядчиков-посредников.',
    stats: [
      { v: '1000+', k: 'реализованных проектов' },
      { v: '10 лет', k: 'гарантия по документу' },
      { v: 'до 4 т', k: 'нагрузка на ярус' },
      { v: 'с 2021', k: 'года на рынке' },
    ],
    whoTitle: 'Чем мы занимаемся',
    who: [
      'Проектируем стеллажные системы под конкретное помещение, технику и товар.',
      'Производим паллетные, среднегрузовые, архивные, торговые и набивные стеллажи.',
      'Делаем бесплатный замер и расчёт нагрузок по Ташкенту и регионам.',
      'Доставляем и монтируем своей бригадой, передаём гарантийный документ.',
    ],
    whyTitle: 'Почему заводское, а не «сварщик в гараже»',
    why: [
      'Металл 1 сорта, оцинковка и порошковая окраска вместо кустарной покраски по ржавчине.',
      'Расчётная нагрузка подтверждена конструктивом, а не «на глаз».',
      'Гарантия 10 лет оформляется документом — единственные на рынке Узбекистана.',
      'Одинаковая геометрия секций: ряд собирается ровно и не «ведёт» со временем.',
    ],
    isoTitle: 'Сертификация',
    isoText:
      'Производство работает по международным стандартам качества, экологии и охраны труда. Сертификаты подтверждены органом IQNET / CISQ.',
    clientsTitle: 'Нам доверяют',
    teamTitle: 'Команда',
    teamText: 'Стеллажную систему ведёт не менеджер, а инженер: от замера до подписанного акта.',
    teamCta: 'Познакомиться с командой',
    catalogCta: 'Смотреть каталог с ценами',
    contactsCta: 'Контакты и адрес',
    reqTitle: 'Реквизиты и адрес',
  },
  uz: {
    title: 'RAXPRO kompaniyasi haqida',
    seoTitle: 'RAXPRO haqida — 2021 yildan Toshkentda stellaj ishlab chiqaruvchi',
    seoDesc:
      'RAXPRO — Toshkentda metall stellajlar va saqlash tizimlari ishlab chiqarish: 1000+ amalga oshirilgan loyiha, ISO sertifikatlari, hujjat asosida 10 yil kafolat, oʻlchovdan montajgacha toʻliq sikl.',
    lead: 'Biz Oʻzbekistonda metall stellajlar va saqlash tizimlarini ishlab chiqaramiz va oʻrnatamiz. Toʻliq sikl: oʻlchov, loyiha, tayyorlash, yetkazish va montaj — vositachi pudratchilarsiz.',
    stats: [
      { v: '1000+', k: 'amalga oshirilgan loyiha' },
      { v: '10 yil', k: 'hujjat asosida kafolat' },
      { v: '4 t gacha', k: 'har yarusga yuklama' },
      { v: '2021 yildan', k: 'bozorda' },
    ],
    whoTitle: 'Biz nima qilamiz',
    who: [
      'Stellaj tizimlarini aniq xona, texnika va tovarga moslab loyihalaymiz.',
      'Palletli, oʻrta yuklamali, arxiv, savdo va zich stellajlarni ishlab chiqaramiz.',
      'Toshkent va viloyatlar boʻylab bepul oʻlchov va yuklama hisobini bajaramiz.',
      'Oʻz brigadamiz bilan yetkazamiz va montaj qilamiz, kafolat hujjatini topshiramiz.',
    ],
    whyTitle: 'Nega zavod mahsuloti, «garajdagi payvandchi» emas',
    why: [
      'Zang ustidan qoʻlbola boʻyash oʻrniga 1-nav metall, sinklash va kukunli boʻyoq.',
      'Hisoblangan yuklama «koʻz bilan» emas, konstruksiya bilan tasdiqlangan.',
      'Hujjat bilan rasmiylashtirilgan 10 yillik kafolat — Oʻzbekiston bozorida yagona.',
      'Seksiyalarning bir xil geometriyasi: qator tekis yigʻiladi va vaqt oʻtib qiyshaymaydi.',
    ],
    isoTitle: 'Sertifikatlash',
    isoText:
      'Ishlab chiqarish sifat, ekologiya va mehnat muhofazasi boʻyicha xalqaro standartlar asosida ishlaydi. Sertifikatlar IQNET / CISQ organi tomonidan tasdiqlangan.',
    clientsTitle: 'Bizga ishonishadi',
    teamTitle: 'Jamoa',
    teamText: 'Stellaj tizimini menejer emas, muhandis olib boradi: oʻlchovdan imzolangan dalolatnomagacha.',
    teamCta: 'Jamoa bilan tanishish',
    catalogCta: 'Narxlar bilan katalogni koʻrish',
    contactsCta: 'Kontaktlar va manzil',
    reqTitle: 'Rekvizitlar va manzil',
  },
};

export async function generateMetadata({ params }) {
  const L = normalizeLang((await params).lang);
  const a = A[L];
  return { title: a.seoTitle, description: a.seoDesc, alternates: alternatesFor('/o-kompanii', L) };
}

export default async function AboutPage({ params }) {
  const L = normalizeLang((await params).lang);
  const a = A[L];
  const t = SHOP[L];
  const loc = siteLoc(L);

  const crumbs = breadcrumbSchema(L, [
    { name: t.home, path: '/' },
    { name: a.title, path: '/o-kompanii' },
  ]);

  return (
    <div className="bg-white text-ink">
      <JsonLd data={crumbs} />
      <JsonLd data={organizationSchema(L)} />
      <Header lang={L} />

      <section className="relative pt-28 pb-14 bg-navy-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/works/hero.jpg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover opacity-25"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/92 to-navy-900/60" />
          <div className="absolute inset-0 grid-lines opacity-20" />
        </div>
        <div className="relative w-full px-5 sm:px-8 lg:px-14 2xl:px-24">
          <nav className="text-sm text-cloud-200/60 mb-4">
            <a href={href(L, '/')} className="hover:text-sky-400">
              {t.home}
            </a>
            <span className="mx-1.5">/</span>
            <span className="text-cloud-200">{a.title}</span>
          </nav>
          <h1 className="font-display font-medium text-3xl sm:text-4xl lg:text-5xl tracking-tight max-w-3xl leading-[1.08]">
            {a.title}
          </h1>
          <p className="mt-5 text-lg text-cloud-200/85 max-w-2xl leading-relaxed">{a.lead}</p>

          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {a.stats.map((s) => (
              <div key={s.k} className="rounded-xl2 bg-white/8 border border-white/12 p-5">
                <div className="font-display font-medium text-2xl sm:text-3xl">{s.v}</div>
                <div className="text-sm text-cloud-200/70 mt-1">{s.k}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-14 grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <h2 className="font-display font-medium text-2xl sm:text-3xl text-navy-800 tracking-tight">
            {a.whoTitle}
          </h2>
          <ul className="mt-5 space-y-3">
            {a.who.map((i) => (
              <li key={i} className="flex items-start gap-3 text-slate-700 leading-relaxed">
                <span className="w-6 h-6 rounded-full bg-sky-600/10 text-sky-600 grid place-items-center shrink-0 mt-0.5">
                  <IcoCheck className="w-4 h-4" />
                </span>
                {i}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-display font-medium text-2xl sm:text-3xl text-navy-800 tracking-tight">
            {a.whyTitle}
          </h2>
          <ul className="mt-5 space-y-3">
            {a.why.map((i) => (
              <li key={i} className="flex items-start gap-3 text-slate-700 leading-relaxed">
                <span className="w-6 h-6 rounded-full bg-sky-600/10 text-sky-600 grid place-items-center shrink-0 mt-0.5">
                  <IcoCheck className="w-4 h-4" />
                </span>
                {i}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 pb-14">
        <div className="rounded-xl2 border border-cloud-200 bg-cloud-50 p-7">
          <h2 className="font-display font-medium text-xl text-navy-800">{a.isoTitle}</h2>
          <p className="mt-3 text-slate-700 max-w-2xl leading-relaxed">{a.isoText}</p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {ISO_CERTS.map((c) => (
              <span
                key={c}
                className="inline-flex items-center rounded-lg bg-white border border-cloud-200 px-4 py-2 text-sm font-semibold text-navy-800"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 pb-14">
        <h2 className="font-display font-medium text-2xl sm:text-3xl text-navy-800 tracking-tight">
          {a.clientsTitle}
        </h2>
        <div className="mt-6">
          <LogoMarquee logos={CLIENT_LOGOS} />
        </div>
      </section>

      <section className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-xl2 border border-cloud-200 bg-white shadow-card p-7">
            <h2 className="font-display font-medium text-xl text-navy-800">{a.teamTitle}</h2>
            <p className="mt-3 text-slate-700 leading-relaxed">{a.teamText}</p>
            <a
              href={href(L, '/experts')}
              className="mt-5 inline-flex items-center gap-2 text-sky-600 font-semibold hover:text-navy-800"
            >
              {a.teamCta} <IcoArrow className="w-5 h-5" />
            </a>
          </div>

          <div className="rounded-xl2 border border-cloud-200 bg-white shadow-card p-7">
            <h2 className="font-display font-medium text-xl text-navy-800">{a.reqTitle}</h2>
            <p className="mt-3 text-slate-700">
              {loc.addressCity}, {loc.address}
            </p>
            <p className="text-slate-500 text-sm mt-1">{loc.landmark}</p>
            <p className="mt-3 text-slate-700">
              <a href={`tel:${SITE.phoneMain}`} className="font-semibold hover:text-sky-600">
                {SITE.phoneMainHuman}
              </a>{' '}
              · {loc.hours}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={href(L, '/katalog')}
                className="inline-flex items-center gap-2 bg-brand-grad text-white font-semibold px-6 py-3 rounded-xl"
              >
                {a.catalogCta}
              </a>
              <a
                href={href(L, '/kontakty')}
                className="inline-flex items-center gap-2 border border-navy-900/15 text-navy-800 hover:border-sky-500 hover:text-sky-600 font-semibold px-6 py-3 rounded-xl transition"
              >
                {a.contactsCta}
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer lang={L} />
    </div>
  );
}
