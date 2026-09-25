import Header from "../../components/Header";
import { alternatesFor, href, absHref, LANGS } from "../../lib/lang";
import Footer from "../../components/Footer";
import LeadForm from "../../components/LeadForm";
import Reveal from "../../components/Reveal";
import Parallax from "../../components/Parallax";
import RackHero from "../../components/hero/RackHero";
import { directionCards } from "../../lib/directionCards";
import VideoHero from "../../components/hero/VideoHero";
import VideoHeroMp4 from "../../components/hero/VideoHeroMp4";
import PriceBreakdown from "../../components/PriceBreakdown";
import Stages from "../../components/Stages";
import WhyRaxPro from "../../components/WhyRaxPro";
import Comparison from "../../components/Comparison";
import { SplitHead } from "../../components/Section";
import { SITE, CLIENT_LOGOS, ISO_CERTS, siteLoc } from "../../lib/site";
import { T, EXTRA, normalizeLang } from "../../lib/i18n";
import Faq from "../../components/Faq";
import { getLatest, localize } from "../../lib/articles";

import { REVIEWS, featuredReviews, localizeReview } from "../../lib/reviews";
import CaseSlider from "../../components/CaseSlider";
import Reviews from "../../components/Reviews";
import { CASES, localizeCase } from "../../lib/cases";

import LogoMarquee from "../../components/LogoMarquee";
import {
  IcoRuler,
  IcoDraft,
  IcoFactory,
  IcoWrench,
  IcoShield,
  IcoWeight,
  IcoLayers,
  IcoPallet,
  IcoArchive,
  IcoShop,
  IcoClock,
  IcoCheck,
  IcoArrow,
  IcoPin,
  IcoPhone,
} from "../../components/Icons";

const IMG = {
  hero: "/works/hero.jpg",
  pallet: "/directions/pallet.jpg",
  medium: "/directions/medium.jpg",
  archive: "/directions/archive.jpg",
  retail: "/directions/retail.jpg",
  drivein: "/directions/drive-in.jpg",
  welder: "/works/w6.jpg",
};
const DIR_META = [
  {
    Ico: IcoPallet,
    img: IMG.pallet,
    href: "/napravleniya/palletnye-stellazhi",
  },
  {
    Ico: IcoLayers,
    img: IMG.medium,
    href: "/napravleniya/srednegruzovye-stellazhi",
  },
  {
    Ico: IcoArchive,
    img: IMG.archive,
    href: "/napravleniya/arhivnye-stellazhi",
  },
  { Ico: IcoShop, img: IMG.retail, href: "/napravleniya/torgovye-stellazhi" },
  {
    Ico: IcoPallet,
    img: IMG.drivein,
    href: "/napravleniya/nabivnye-stellazhi",
  },
  // Шестая карточка — мезонин: страницы направления нет, ведёт в карточку каталога
  { Ico: IcoLayers, img: "/products/gen/mezzanine-1.jpg", href: "/katalog/mezonin" },
];

/** «32 отзыва» / «21 отзыв» / «5 отзывов»; uz — без склонений. */
export default async function Home({ params, searchParams }) {
  const L = normalizeLang((await params).lang);
  // Сравнение методов первого экрана на одном preview: ?hero=video (кадры), ?hero=mp4 (ролик), по умолчанию 3D.
  const heroMode = (await searchParams)?.hero;
  const t = T[L];
  const loc = siteLoc(L);
  const x = EXTRA[L];
  const latest = getLatest(3).map((a) => localize(a, L));
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: x.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const cards = directionCards(L);
  const directions = t.directions.map((d, i) => ({ ...d, ...DIR_META[i], ...cards[i] }));
  const cases = CASES.map((c) => localizeCase(c, L));
  // На главной — только отзывы с конкретикой; все 31 — на /otzyvy
  const reviewsTotal = REVIEWS.length;
  const reviews = featuredReviews().map((r) => localizeReview(r, L));

  const certificates = [
    {
      id: 1,
      img: "/images/ser1.png",
      title: "ISO 14001:2015",
    },
    {
      id: 2,
      img: "/images/ser2.png",
      title: "ISO 45001:2018",
    },
    {
      id: 3,
      img: "/images/ser3.png",
      title: "ISO 9001:2015",
    },
    {
      id: 4,
      img: "/images/ser4.png",
      title: "ISO 9001:2015 Quality Management",
    },
    {
      id: 5,
      img: "/images/ser5.png",
      title: "ISO 9001:2015 Quality Management",
    },
    {
      id: 6,
      img: "/images/ser6.png",
      title: "ISO 9001:2015 Quality Management",
    },
  ];

  return (
    <div className="bg-white text-ink">
      <Header lang={L} />

      {/* HERO — скролл-сцена: замер → проект → сборка → загрузка (components/hero).
          Главная кнопка ведёт в форму заявки, а не в конструктор (Умид, 22.09):
          с первого экрана человек оставляет контакт, а не уходит считать сам. */}
      {heroMode === "mp4"
        ? <VideoHeroMp4 lang={L} ctaHref="#kalkulyator" cta2Href="#napravleniya" />
        : heroMode === "video"
          ? <VideoHero lang={L} ctaHref="#kalkulyator" cta2Href="#napravleniya" />
          : <RackHero lang={L} ctaHref="#zayavka" cta2Href={href(L, "/katalog")} />}

      {/* CLIENTS + NUMBERS — один белый блок: цифра в заголовке, факты сеткой, логотипы как мини-кейсы */}
      <section className="bg-white border-b border-cloud-200" aria-labelledby="clients-title">
        <div className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 pt-12 sm:pt-20">
          <div className="grid lg:grid-cols-[minmax(0,1fr),minmax(0,1.5fr)] gap-8 lg:gap-20 items-end">
            <div>
              <h2 id="clients-title" className="font-display font-medium text-3xl sm:text-4xl lg:text-5xl tracking-tight text-navy-900 text-balance">
                {t.trustTitle.before}
                <span className="text-sky-600">{t.trustTitle.n}</span>
                {t.trustTitle.after}
              </h2>
              <p className="mt-4 sm:mt-5 text-slate-600 max-w-md leading-relaxed">{t.trustText}</p>
            </div>
            <Reveal as="dl" variant="fade" stagger={60} className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-cloud-200 border-y border-cloud-200">
              {t.trustStats.map((s) => (
                <div key={s.l} className="bg-white py-4 sm:py-6 px-4 sm:px-6">
                  <dd className="font-display font-medium text-3xl sm:text-[44px] leading-none text-navy-900 tracking-tight whitespace-nowrap">
                    {s.n}
                    {s.s && <span className="text-xl text-sky-600 ml-1">{s.s}</span>}
                  </dd>
                  <dt className="mt-1.5 sm:mt-2 text-[13px] sm:text-sm text-slate-500 leading-snug max-w-[200px]">{s.l}</dt>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
        <div className="mt-8 sm:mt-16 pb-12 sm:pb-20">
          <LogoMarquee logos={CLIENT_LOGOS} lang={L} />
        </div>
      </section>

      {/* DIRECTIONS — сразу после цифр: фото отдельно от описания, чтобы оба читались */}
      <section
        id="napravleniya"
        className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16 sm:py-20"
      >
        <SplitHead title={t.dirTitle} desc={t.dirText} hideDescOnMobile />
        {/* На телефоне — горизонтальная лента с прилипанием: одна карточка на экран,
            край следующей виден. С md — сетка 2 колонки. */}
        {/* Один Reveal на всю ленту со stagger: карточки не «подпрыгивают» по одной при боковом свайпе */}
        <Reveal
          variant="fade"
          stagger={80}
          className="flex md:grid md:grid-cols-2 gap-4 md:gap-5 mt-6 md:mt-10 overflow-x-auto md:overflow-visible snap-x snap-mandatory overscroll-x-contain -mx-5 px-5 scroll-pl-5 md:mx-0 md:px-0 md:scroll-pl-0 pb-2 md:pb-0 scrollbar-none"
        >
          {directions.map((d, i) => (
            <div
              key={d.t}
              className={`shrink-0 w-[82vw] max-w-[360px] snap-start md:shrink md:w-auto md:max-w-none ${
                i === directions.length - 1 && directions.length % 2
                  ? "md:col-span-2"
                  : ""
              }`}
            >
              <div className="group relative h-full flex flex-col rounded-xl2 overflow-hidden bg-white border border-cloud-200 shadow-card hover:shadow-card-hover transition">
                {/* Вся карточка — ссылка на страницу направления; кнопка конструктора лежит поверх */}
                <a href={href(L, d.href)} className="absolute inset-0 z-[1]" aria-label={`${d.t} — ${d.more}`} />
                {/* Фото — своя зона без текста поверх */}
                <div className="relative aspect-[16/10] overflow-hidden bg-cloud-100">
                  <img loading="lazy" decoding="async"
                    src={d.img}
                    alt={d.t}
                    width={1280}
                    height={960}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute top-4 left-4 w-11 h-11 rounded-xl bg-white/95 text-navy-800 grid place-items-center pointer-events-none shadow-card">
                    <d.Ico className="w-6 h-6" />
                  </div>
                  <span className="absolute bottom-4 left-4 rounded-full bg-white text-navy-900 text-xs font-semibold px-3 py-1.5 shadow-card pointer-events-none">{d.price}</span>
                  <div className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/90 text-navy-800 grid place-items-center group-hover:bg-navy-900 group-hover:text-white transition pointer-events-none">
                    <IcoArrow className="w-5 h-5 -rotate-45" />
                  </div>
                </div>
                {/* Описание — отдельная белая панель */}
                <div className="relative flex-1 flex flex-col p-5 md:p-6 pointer-events-none">
                  <h3 className="font-display font-bold text-xl md:text-2xl text-navy-800">{d.t}</h3>
                  <p className="text-slate-600 text-sm mt-2 max-w-md leading-relaxed line-clamp-3 md:line-clamp-none">{d.d}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    {d.specs.map((sp) => (
                      <span key={sp.k} className="rounded-full border border-cloud-200 bg-cloud-50 px-3 py-1.5 text-navy-800">{sp.k}: {sp.v}</span>
                    ))}
                  </div>
                  <p className="hidden md:block mt-3 text-xs text-slate-500 max-w-md"><b className="text-navy-800 font-semibold">{d.forWhom}:</b> {d.useCases}</p>
                  {/* Две кнопки на карточке (правка Умида 22.09): заявка и страница типа */}
                  <div className="mt-auto pt-4 md:pt-5 grid grid-cols-2 gap-2.5 md:flex md:flex-wrap md:items-center pointer-events-auto">
                    <a href={d.cta.href} className="relative z-[2] inline-flex items-center justify-center md:justify-start gap-2 bg-navy-900 hover:bg-sky-600 text-white text-[13px] md:text-sm font-semibold px-3 md:px-4 py-2.5 rounded-xl transition">
                      {d.cta.label} <IcoArrow className="hidden md:block w-4 h-4" />
                    </a>
                    <a href={href(L, d.href)} className="relative z-[2] inline-flex items-center justify-center md:justify-start gap-2 border border-navy-900/15 text-navy-800 hover:border-sky-500 hover:text-sky-600 text-[13px] md:text-sm font-semibold px-3 md:px-4 py-2.5 rounded-xl transition">
                      {/* на телефоне ярлык короче — иначе кнопка ломается на две строки */}
                      <span className="md:hidden">{d.moreShort}</span>
                      <span className="hidden md:inline">{d.more}</span>
                      <IcoArrow className="hidden md:block w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Reveal>
      </section>

      {/* PRICE — из чего складывается цена: состав секции, что входит, оплата */}
      <PriceBreakdown lang={L} />

      {/* STAGES — «Этапы и сроки»: карточки проявляются по скроллу (components/Stages) */}
      <Stages lang={L} />

      {/* PROJECTS SLIDER — кейсы перед «Стеллажи, которые работают на вас» (правка 22.09) */}
      <section
        id="proekty"
        className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-12 sm:py-20"
      >
        <SplitHead
          title={t.projTitle}
          desc={t.projText}
          hideDescOnMobile
        />
        <div className="mt-6 sm:mt-10">
          <CaseSlider items={cases} lang={L} />
        </div>
      </section>

      {/* WHY RAXPRO — bento по макету: вместимость, наличие, гарантия, безопасность… + CTA (components/WhyRaxPro) */}
      <WhyRaxPro lang={L} />

      {/* CALCULATOR */}
      <section
        id="kalkulyator"
        className="relative bg-navy-900 overflow-hidden"
      >
        <div className="absolute inset-0 grid-lines opacity-20" />
        <div className="relative w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16 sm:py-20 grid lg:grid-cols-[1fr,1.1fr] gap-12 items-center">
          <div className="text-white">
            <h2 className="font-display font-medium text-3xl sm:text-4xl leading-tight">
              {t.calcTitle1}{" "}
              <span className="text-sky-400">{t.calcTitleAccent}</span>
            </h2>
            <p className="mt-4 text-cloud-200/80 max-w-lg leading-relaxed">
              {t.calcText}
            </p>
            <ul className="mt-6 space-y-2.5">
              {t.calcFeatures.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-3 text-cloud-200/90"
                >
                  <span className="w-6 h-6 rounded-full bg-white/10 grid place-items-center text-sky-300 shrink-0">
                    <IcoCheck className="w-4 h-4" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          {/* Опросник переехал в поп-ап (правка 22.09): здесь — приглашение и список
              вопросов, чтобы было видно, на что уходит минута. Кнопка — обычная
              ссылка на #kalkulyator, модалка (components/CalcModal) ловит клик. */}
          <div className="w-full max-w-xl lg:justify-self-end">
            <div className="rounded-xl2 bg-white/[0.06] border border-white/15 p-6 sm:p-8 backdrop-blur-sm">
              {/* На телефоне список вопросов скрыт: секция и так длинная, а сами
                  вопросы названы в тексте слева. */}
              <ol className="hidden sm:block space-y-3">
                {t.calcSteps.map((q, i) => (
                  <li key={q} className="flex items-center gap-3.5 text-cloud-200/90">
                    <span className="w-8 h-8 shrink-0 rounded-full border border-white/20 text-sky-300 text-sm font-semibold grid place-items-center tabular-nums">
                      {i + 1}
                    </span>
                    {q}
                  </li>
                ))}
              </ol>
              <a
                href="#kalkulyator"
                className="sm:mt-7 w-full inline-flex items-center justify-center gap-3 bg-brand-grad text-white font-bold text-base sm:text-lg px-6 py-4 rounded-xl shadow-glow hover:brightness-110 transition"
              >
                {t.calcOpen} <IcoArrow className="w-5 h-5" />
              </a>
              <p className="mt-3 text-center text-cloud-200/60 text-sm">{t.calcOpenNote}</p>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON — заводские против кустарных: таблица пар, безопасность, честно про цену */}
      <Comparison lang={L} />

      {/* FOUNDER */}
      <section
        id="osnovatel"
        className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16 sm:py-20"
      >
        <div className="grid lg:grid-cols-[0.85fr,1.15fr] gap-10 lg:gap-14 items-center">
          <div className="relative">
            <div className="rounded-xl2 overflow-hidden border border-cloud-200 shadow-card max-w-md">
              <img loading="lazy" decoding="async"
                src="/brand/founder.jpg"
                alt={t.founderName}
                width={640}
                height={640}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 left-6 bg-white rounded-xl shadow-card border border-cloud-200 px-5 py-3">
              <div className="font-display font-medium text-navy-800 text-lg leading-tight">
                {t.founderName}
              </div>
              <div className="text-sm text-sky-600">{t.founderRole}</div>
            </div>
          </div>
          <div>
            <h2 className="font-display font-medium text-3xl sm:text-4xl text-navy-800 leading-tight">
              {t.founderQuote}
            </h2>
            <div className="mt-5 space-y-4 text-slate-600 leading-relaxed max-w-2xl">
              {t.founderP.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              <span className="inline-flex items-center gap-2 text-slate-600"><IcoShield className="w-4 h-4 text-sky-600 shrink-0" /> {t.certsLabel}</span>
              <a href="#sertifikaty" className="inline-flex items-center gap-1.5 font-bold text-navy-900 border-b-2 border-sky-500 pb-0.5 hover:text-sky-600 transition">
                {t.certsLink} <IcoArrow className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS — витрина: отобранные видео и цитаты без фото, ссылка на страницу всех отзывов */}
      <section id="otzyvy" className="bg-cloud-50 border-y border-cloud-200 overflow-hidden">
        <div className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16 sm:py-20">
          <div className="max-w-3xl">
            <h2 className="font-display font-medium text-3xl sm:text-4xl text-navy-800">
              {t.revTitle}
            </h2>
            <p className="mt-3 text-slate-500 max-w-xl">{t.revText}</p>
          </div>
          <Reviews items={reviews} lang={L} allHref={href(L, "/otzyvy")} total={reviewsTotal} />
        </div>
      </section>

      {/* CERTIFICATES — одна строка про завод-производитель, сканы раскрываются по кнопке */}
      <section id="sertifikaty" className="bg-white border-y border-cloud-200">
        <details className="group/certs w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-8 sm:py-10">
          <summary className="list-none cursor-pointer flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 [&::-webkit-details-marker]:hidden">
            <span className="flex items-center gap-3 flex-1">
              <span className="w-10 h-10 rounded-xl bg-cloud-50 border border-cloud-200 grid place-items-center text-sky-600 shrink-0"><IcoShield className="w-5 h-5" /></span>
              <span className="font-semibold text-navy-900">{t.certsLabel}</span>
            </span>
            <span className="btn-11 inline-flex items-center gap-2 border border-navy-800 text-navy-800 font-semibold px-5 py-2.5 rounded-xl group-hover/certs:bg-navy-800 group-hover/certs:text-white transition shrink-0">
              <span className="group-open/certs:hidden">{t.certsLink}</span>
              <span className="hidden group-open/certs:inline">{t.certsHide}</span>
              <IcoArrow className="w-4 h-4 group-open/certs:-rotate-90 transition" />
            </span>
          </summary>
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {certificates.map((cert) => (
              <a key={cert.id} href={cert.img} target="_blank" rel="noopener" className="block rounded-xl border border-cloud-200 bg-cloud-50 overflow-hidden hover:border-sky-300 hover:shadow-card transition" title={cert.title}>
                <img loading="lazy" decoding="async" src={cert.img} alt={cert.title} width={1336} height={1670} className="w-full h-auto object-contain" />
              </a>
            ))}
          </div>
        </details>
      </section>

      {/* FAQ */}
      <section className="bg-cloud-50 border-y border-cloud-200">
        <div className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16 sm:py-20">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
          />
          <h2 className="font-display font-medium text-3xl sm:text-4xl text-navy-800">
            {x.faqTitle}
          </h2>
          <Faq items={x.faq} />
        </div>
      </section>

      {/* CALLBACK FORM */}
      <section
        id="zayavka"
        className="relative bg-navy-900 overflow-hidden notch-tr"
      >
        <div className="absolute inset-0 grid-lines opacity-25" />
        <div className="relative w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-12 sm:py-20 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="text-white">
            <h2 className="font-display font-medium text-3xl sm:text-4xl">
              {t.formTitle}
            </h2>
            <p className="mt-4 text-cloud-200/80 max-w-lg leading-relaxed">
              {t.formText}
            </p>
            {/* «После заявки» — короткой колонкой у полей: страх оставить заявку снимается там, где он возникает */}
            <div className="mt-6 sm:mt-8 max-w-lg border-t border-white/10 pt-5 sm:pt-6">
              <div className="text-xs font-bold uppercase tracking-wider text-sky-300">{x.afterTitle}</div>
              <ol className="mt-4 space-y-3">
                {x.afterSteps.map((s) => (
                  <li key={s.time} className="grid grid-cols-[72px,1fr] sm:grid-cols-[84px,1fr] gap-3 items-baseline">
                    <span className="font-display text-white text-lg sm:text-xl tracking-tight whitespace-nowrap">{s.time}</span>
                    <span className="text-cloud-200/85 text-sm leading-relaxed">{s.d}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-white font-semibold text-sm">{x.afterNote}</p>
            </div>
            <a
              href={`tel:${SITE.phoneMain}`}
              className="mt-7 inline-flex items-center gap-3 font-semibold text-cloud-200/90 hover:text-sky-300"
            >
              <span className="w-10 h-10 rounded-lg bg-white/10 grid place-items-center text-sky-300">
                <IcoPhone className="w-5 h-5" />
              </span>
              {SITE.phoneMainHuman}
            </a>
          </div>
          <div className="w-full max-w-md lg:max-w-lg lg:justify-self-start">
            <LeadForm lang={L} />
          </div>
        </div>
      </section>

      {/* CONTACTS — фото офиса + телефоны/адрес + карта; соцсети живут только в футере */}
      <section
        id="kontakty"
        className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16 sm:py-20"
      >
        <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-6 lg:gap-8 items-stretch">
          <div className="relative rounded-xl2 overflow-hidden bg-navy-900 min-h-[360px] lg:min-h-[520px]">
            <img
              src="/images/office.jpg"
              alt={`RAXPRO — ${loc.addressCity}, ${loc.address}`}
              width={1168}
              height={880}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/85 via-navy-900/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 text-white">
              <h2 className="font-display font-medium text-3xl sm:text-4xl">{t.contTitle}</h2>
              <p className="mt-3 text-white/80 max-w-md">
                {loc.addressCity}, {loc.address}
                <span className="block text-white/55 text-sm mt-1">{loc.landmark}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-rows-[auto,1fr] gap-6 lg:gap-8">
            <div className="rounded-xl2 border border-cloud-200 bg-white shadow-card p-6 sm:p-8 grid sm:grid-cols-2 gap-6">
              <div>
                <div className="text-slate-400 text-sm">{t.phones}</div>
                <a href={`tel:${SITE.phoneMain}`} className="block mt-1 text-2xl font-display font-medium text-navy-900 hover:text-sky-600">
                  {SITE.phoneMainHuman}
                </a>
                <a href={`tel:${SITE.phoneAlt}`} className="block mt-1 text-navy-700 hover:text-sky-600">{SITE.phoneAltHuman}</a>
                <a href={`tel:${SITE.landline}`} className="block text-navy-700 hover:text-sky-600">{SITE.landlineHuman}</a>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-slate-400 text-sm">Email</div>
                  {SITE.emails.map((e) => (
                    <a key={e} href={`mailto:${e}`} className="block text-navy-700 hover:text-sky-600 break-all">{e}</a>
                  ))}
                </div>
                <div>
                  <div className="text-slate-400 text-sm">{t.hours}</div>
                  <p className="text-navy-700">{loc.hours}</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl2 overflow-hidden border border-cloud-200 shadow-card min-h-[260px]">
              <iframe
                title="RAXPRO"
                className="w-full h-full min-h-[260px]"
                src={SITE.yandexMapEmbed}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16 sm:py-20">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h2 className="font-display font-medium text-3xl sm:text-4xl text-navy-800">
              {t.blogTitle}
            </h2>
          </div>
          <a
            href={href(L, "/blog")}
            className="btn-11 inline-flex items-center gap-2 border border-navy-800 text-navy-800 font-semibold px-5 py-2.5 rounded-xl hover:bg-navy-800 hover:text-white transition"
          >
            {t.blogAll} <IcoArrow className="w-5 h-5" />
          </a>
        </div>
        {/* На телефоне — лента со снапом, с md сетка 3 колонки */}
        <Reveal
          variant="fade"
          stagger={80}
          className="flex md:grid md:grid-cols-3 gap-4 md:gap-5 mt-6 md:mt-10 overflow-x-auto md:overflow-visible snap-x snap-mandatory overscroll-x-contain -mx-5 px-5 scroll-pl-5 md:mx-0 md:px-0 md:scroll-pl-0 pb-2 md:pb-0 scrollbar-none"
        >
          {latest.map((a) => (
            <div key={a.slug} className="snap-start shrink-0 w-[82vw] max-w-[360px] md:shrink md:w-auto md:max-w-none">
              <a
                href={href(L, `/blog/${a.slug}`)}
                className="group block h-full rounded-xl2 overflow-hidden bg-white border border-cloud-200 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition"
              >
                <div className="aspect-[16/9] overflow-hidden bg-cloud-100">
                  <img loading="lazy" decoding="async"
                    src={a.cover}
                    alt={a.title}
                    width={1280}
                    height={853}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="p-5">
                  <span className="text-xs font-semibold text-sky-600">
                    {a.category}
                  </span>
                  <h3 className="font-bold text-navy-800 mt-1.5 leading-snug group-hover:text-sky-600">
                    {a.title}
                  </h3>
                  <p className="text-slate-500 text-sm mt-2 line-clamp-2">
                    {a.excerpt}
                  </p>
                </div>
              </a>
            </div>
          ))}
        </Reveal>
      </section>

      <Footer lang={L} />
    </div>
  );
}
