import Header from "../../components/Header";
import { alternatesFor, href, absHref, LANGS } from "../../lib/lang";
import Footer from "../../components/Footer";
import LeadForm from "../../components/LeadForm";
import Calculator from "../../components/Calculator";
import Reveal from "../../components/Reveal";
import Parallax from "../../components/Parallax";
import RackHero from "../../components/hero/RackHero";
import { directionCards } from "../../lib/directionCards";
import VideoHero from "../../components/hero/VideoHero";
import VideoHeroMp4 from "../../components/hero/VideoHeroMp4";
import PriceBreakdown from "../../components/PriceBreakdown";
import { SplitHead, Eyebrow } from "../../components/Section";
import { SITE, CLIENT_LOGOS, ISO_CERTS, siteLoc } from "../../lib/site";
import { T, EXTRA, normalizeLang } from "../../lib/i18n";
import Faq from "../../components/Faq";
import { getLatest, localize } from "../../lib/articles";
import { organizationSchema, JsonLd } from "../../lib/schema";
import { REVIEWS, localizeReview } from "../../lib/reviews";
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
const STEP_ICONS = [IcoRuler, IcoDraft, IcoFactory, IcoWrench];
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
];
const ADV_ICONS = [
  IcoShield,
  IcoWeight,
  IcoFactory,
  IcoWeight,
  IcoWrench,
  IcoClock,
];
const INC_ICONS = [IcoLayers, IcoShield, IcoShop];

/** «32 отзыва» / «21 отзыв» / «5 отзывов»; uz — без склонений. */
function reviewsWord(n, lang) {
  if (lang === "uz") return "ta mijoz sharhi";
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "отзыв клиентов";
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return "отзыва клиентов";
  return "отзывов клиентов";
}

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
  const steps = t.steps.map((s, i) => ({ ...s, Ico: STEP_ICONS[i] }));
  const cards = directionCards(L);
  const directions = t.directions.map((d, i) => ({ ...d, ...DIR_META[i], ...cards[i] }));
  const adv = t.adv.map((a, i) => ({ ...a, Ico: ADV_ICONS[i] }));
  const income = t.income.map((a, i) => ({ ...a, Ico: INC_ICONS[i] }));
  const cases = CASES.map((c) => localizeCase(c, L));
  const reviews = REVIEWS.map((r) => localizeReview(r, L));

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

      {/* HERO — скролл-сцена: замер → проект → сборка → загрузка (components/hero) */}
      {heroMode === "mp4"
        ? <VideoHeroMp4 lang={L} ctaHref="#kalkulyator" cta2Href="#napravleniya" />
        : heroMode === "video"
          ? <VideoHero lang={L} ctaHref="#kalkulyator" cta2Href="#napravleniya" />
          : <RackHero lang={L} ctaHref={href(L, "/konstruktor")} konHref={href(L, "/konstruktor")} cta2Href={href(L, "/katalog")} />}

      {/* CLIENTS + NUMBERS — один белый блок: кому сделали и в каких цифрах */}
      <section className="bg-white border-b border-cloud-200" aria-labelledby="clients-title">
        <div className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 pt-16 sm:pt-20">
          <div className="grid lg:grid-cols-[minmax(0,1fr),minmax(0,1.5fr)] gap-10 lg:gap-20 items-end">
            <div>
              <Eyebrow>{t.numsEyebrow}</Eyebrow>
              <h2 id="clients-title" className="mt-4 font-display font-medium text-3xl sm:text-4xl lg:text-5xl tracking-tight text-navy-900">
                {t.clients}
              </h2>
              <p className="mt-5 text-slate-600 max-w-md leading-relaxed">
                <strong className="text-navy-900 font-semibold">{t.clientsCount}</strong> {t.clientsText}. {t.numsText}
              </p>
            </div>
            <Reveal as="dl" variant="fade" stagger={60} className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-cloud-200 border-y border-cloud-200">
              {t.stats.map((s) => (
                <div key={s.l} className="bg-white py-6 px-5 sm:px-6">
                  <dd className="font-display font-medium text-4xl sm:text-[44px] leading-none text-navy-900 tracking-tight">
                    {s.n}
                    {s.s && <span className="text-xl text-sky-600 ml-1">{s.s}</span>}
                  </dd>
                  <dt className="mt-2 text-sm text-slate-500 leading-snug max-w-[180px]">{s.l}</dt>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
        <div className="mt-12 sm:mt-16 pb-16 sm:pb-20">
          <LogoMarquee logos={CLIENT_LOGOS} />
        </div>
      </section>

      {/* CALCULATOR */}
      <section
        id="kalkulyator"
        className="relative bg-navy-900 overflow-hidden"
      >
        <div className="absolute inset-0 grid-lines opacity-20" />
        <div className="relative w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16 sm:py-20 grid lg:grid-cols-[1fr,1.1fr] gap-12 items-center">
          <div className="text-white">
            <Eyebrow light>{t.calcEyebrow}</Eyebrow>
            <h2 className="mt-4 font-display font-medium text-3xl sm:text-4xl leading-tight">
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
          <div className="w-full max-w-xl lg:justify-self-end">
            <Calculator lang={L} />
          </div>
        </div>
      </section>

      {/* PRICE — из чего складывается цена: состав секции, что входит, оплата */}
      <PriceBreakdown lang={L} />

      {/* PROCESS */}
      <section
        id="o-kompanii"
        className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16 sm:py-20"
      >
        <SplitHead
          eyebrow={t.procEyebrow}
          title={t.procTitle}
          desc={t.procText}
        />
        {/* Editorial numbered timeline (not uniform cards) */}
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 relative">
          {steps.map((s, i) => (
            <Reveal key={s.t} delay={i * 90}>
              <div className="relative">
                {/* connector line */}
                {i < steps.length - 1 && (
                  <span className="hidden lg:block absolute top-7 left-16 right-[-2rem] h-px bg-gradient-to-r from-cloud-300 to-transparent" />
                )}
                <div className="flex items-end gap-3">
                  <span className="font-display text-6xl leading-[0.8] text-navy-800/12">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <s.Ico className="w-8 h-8 text-sky-600 mb-1" />
                </div>
                <h3 className="font-bold text-xl text-navy-800 mt-5">{s.t}</h3>
                <p className="text-slate-500 text-[15px] mt-2 leading-relaxed max-w-xs">
                  {s.d}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* DIRECTIONS */}
      <section
        id="napravleniya"
        className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16 sm:py-20"
      >
        <SplitHead eyebrow={t.dirEyebrow} title={t.dirTitle} desc={t.dirText} />
        <div className="grid md:grid-cols-2 gap-5 mt-10">
          {directions.map((d, i) => (
            <Reveal
              key={d.t}
              delay={i * 80}
              className={
                i === directions.length - 1 && directions.length % 2
                  ? "md:col-span-2"
                  : undefined
              }
            >
              <div className="group relative rounded-xl2 overflow-hidden shadow-card bg-navy-900">
                <img loading="lazy" decoding="async"
                  src={d.img}
                  alt={d.t}
                  width={1280}
                  height={960}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/80 to-navy-900/5" />
                {/* Вся карточка — ссылка на страницу направления; кнопка конструктора лежит поверх */}
                <a href={href(L, d.href)} className="absolute inset-0 z-[1]" aria-label={`${d.t} — ${d.more}`} />
                <div className="absolute top-4 left-4 w-11 h-11 rounded-xl bg-white/95 text-navy-800 grid place-items-center pointer-events-none">
                  <d.Ico className="w-6 h-6" />
                </div>
                <div className="absolute top-4 right-4 w-11 h-11 rounded-full border border-white/40 text-white grid place-items-center group-hover:bg-white group-hover:text-navy-800 transition pointer-events-none">
                  <IcoArrow className="w-5 h-5 -rotate-45" />
                </div>
                {/* Текст в потоке, а не absolute: на 320px контент выше 400px и раньше вылезал за верх карточки */}
                <div className="relative pt-44 sm:pt-56 p-6 text-white pointer-events-none">
                  <h3 className="font-display font-bold text-2xl">{d.t}</h3>
                  <p className="text-cloud-200/85 text-sm mt-2 max-w-md leading-relaxed">{d.d}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-white text-navy-900 font-semibold px-3 py-1.5">{d.price}</span>
                    {d.specs.map((sp) => (
                      <span key={sp.k} className="rounded-full border border-white/25 px-3 py-1.5 text-white/90">{sp.k}: {sp.v}</span>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-cloud-200/75 max-w-md"><b className="text-white/90 font-semibold">{d.forWhom}:</b> {d.useCases}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 pointer-events-auto">
                    <a href={d.cta.href} className="relative z-[2] inline-flex items-center gap-2 bg-sky-500 hover:bg-white hover:text-navy-900 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition">
                      {d.cta.label} <IcoArrow className="w-4 h-4" />
                    </a>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-sky-300 group-hover:text-white">
                      {d.more} <IcoArrow className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* INCOME */}
      <section className="bg-cloud-50 border-y border-cloud-200">
        <div className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16 sm:py-20">
          <SplitHead
            eyebrow={t.incEyebrow}
            title={t.incTitle}
            desc={t.incText}
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
            {income.map((a, i) => (
              <Reveal key={a.t} delay={i * 70}>
                <div className="h-full rounded-xl2 bg-white border border-cloud-200 shadow-card p-6">
                  <div className="w-12 h-12 rounded-xl bg-brand-grad text-white grid place-items-center shadow-glow">
                    <a.Ico className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-navy-800 mt-4">
                    {a.t}
                  </h3>
                  <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                    {a.d}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON — factory vs artisan: два крупных плана узла, под каждым — своя колонка */}
      <section className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16 sm:py-20">
        <SplitHead eyebrow={x.cmpEyebrow} title={x.cmpTitle} desc={x.cmpText} />
        <div className="grid md:grid-cols-2 gap-4 mt-10">
          <Reveal className="rounded-xl2 bg-navy-900 text-white overflow-hidden flex flex-col">
            <div className="relative aspect-[4/3] md:aspect-[16/10] overflow-hidden">
              <img
                src="/images/cmp-factory.jpg"
                alt={x.cmpUs}
                width={1168}
                height={880}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-navy-900 to-transparent" />
              <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-white text-navy-900 text-xs font-bold px-3 py-1.5">
                <IcoCheck className="w-3.5 h-3.5" />
                {x.cmpUs}
              </div>
            </div>
            <div className="relative p-6 sm:p-8 -mt-6">
              <div className="font-display font-medium text-xl sm:text-2xl">
                {x.cmpUs}
              </div>
              <ul className="mt-5 space-y-3">
                {x.cmpRows.map((r) => (
                  <li key={r.us} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-sky-500/25 grid place-items-center shrink-0 mt-0.5">
                      <IcoCheck className="w-4 h-4 text-sky-300" />
                    </span>
                    <span className="text-white/95">{r.us}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={80} className="rounded-xl2 bg-white border border-cloud-200 shadow-card overflow-hidden flex flex-col">
            <div className="relative aspect-[4/3] md:aspect-[16/10] overflow-hidden">
              <img
                src="/images/cmp-crude.jpg"
                alt={x.cmpThem}
                width={1168}
                height={880}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover grayscale-[35%]"
              />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
              <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-slate-800 text-white text-xs font-bold px-3 py-1.5">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
                {x.cmpThem}
              </div>
            </div>
            <div className="relative p-6 sm:p-8 -mt-6">
              <div className="font-display font-medium text-xl sm:text-2xl text-slate-500">
                {x.cmpThem}
              </div>
              <ul className="mt-5 space-y-3">
                {x.cmpRows.map((r) => (
                  <li key={r.them} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-cloud-100 grid place-items-center shrink-0 mt-0.5 text-slate-400">
                      <svg
                        viewBox="0 0 24 24"
                        width="14"
                        height="14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                      >
                        <path d="M6 6l12 12M18 6L6 18" />
                      </svg>
                    </span>
                    <span className="text-slate-500">{r.them}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PROJECTS SLIDER */}
      <section
        id="proekty"
        className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16 sm:py-20"
      >
        <SplitHead
          eyebrow={t.projEyebrow}
          title={t.projTitle}
          desc={t.projText}
        />
        <div className="mt-10">
          <CaseSlider items={cases} lang={L} />
        </div>
      </section>

      {/* ADVANTAGES */}
      <section
        id="preimushchestva"
        className="bg-cloud-50 border-y border-cloud-200"
      >
        <div className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16 sm:py-20">
          <SplitHead
            eyebrow={t.advEyebrow}
            title={t.advTitle}
            desc={t.advText}
          />
          {/* Bento — first advantage is a large dark feature card, rest varied */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10 lg:auto-rows-[1fr]">
            {adv.map((a, i) => {
              const big = i === 0;
              return (
                <Reveal
                  key={a.t}
                  delay={i * 60}
                  className={big ? "sm:col-span-2 lg:row-span-2" : ""}
                >
                  {big ? (
                    <div className="relative h-full rounded-xl2 bg-navy-900 text-white p-8 overflow-hidden flex flex-col justify-between min-h-[240px]">
                      <div className="absolute inset-0 bg-brand-grad opacity-90" />
                      <div className="absolute inset-0 grid-lines opacity-25" />
                      <div className="relative">
                        <a.Ico className="w-10 h-10 text-white" />
                        <h3 className="font-display font-medium text-2xl sm:text-3xl mt-6 leading-tight">
                          {a.t}
                        </h3>
                      </div>
                      <p className="relative text-white/85 mt-4 leading-relaxed max-w-md">
                        {a.d}
                      </p>
                    </div>
                  ) : (
                    <div className="h-full rounded-xl2 bg-white border border-cloud-200 p-6 hover:border-sky-300 hover:shadow-card transition">
                      <a.Ico className="w-8 h-8 text-sky-600" />
                      <h3 className="font-bold text-navy-800 mt-4">{a.t}</h3>
                      <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                        {a.d}
                      </p>
                    </div>
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

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
            <Eyebrow>{t.founderEyebrow}</Eyebrow>
            <h2 className="mt-4 font-display font-medium text-3xl sm:text-4xl text-navy-800 leading-tight">
              {t.founderQuote}
            </h2>
            <div className="mt-5 space-y-4 text-slate-600 leading-relaxed max-w-2xl">
              {t.founderP.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="mt-7">
              <div className="text-slate-400 text-sm mb-2">{t.certsLabel}</div>
              <div className="flex flex-wrap gap-2.5">
                {ISO_CERTS.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-2 rounded-lg bg-cloud-50 border border-cloud-200 px-3.5 py-2 text-sm font-semibold text-navy-800"
                  >
                    <IcoShield className="w-4 h-4 text-sky-600" /> {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GUARANTEE */}
      <section className="relative bg-navy-900 overflow-hidden">
        <div className="absolute inset-0 bg-brand-grad opacity-95" />
        <div className="absolute inset-0 grid-lines opacity-30" />
        <div className="relative w-full px-5 sm:px-8 lg:px-14 2xl:px-24 max-w-4xl mx-auto py-20 text-center text-white">
          <Reveal>
            <div className="inline-flex items-center gap-3">
              <span className="w-16 h-16 rounded-2xl bg-white/15 grid place-items-center">
                <IcoShield className="w-9 h-9 text-white" />
              </span>
              <span className="font-display font-medium text-6xl sm:text-7xl">
                10 {t.yil}
              </span>
            </div>
            <h2 className="font-display font-medium text-2xl sm:text-3xl mt-4">
              {t.guaranteeTitle}
            </h2>
            <p className="text-white/90 mt-4 max-w-2xl mx-auto leading-relaxed">
              {t.guaranteeText}
            </p>
          </Reveal>
        </div>
      </section>

      {/* REVIEWS — один блок: видеоинтервью + цитаты из переписок и голосовых с фото объекта */}
      <section id="otzyvy" className="bg-cloud-50 border-y border-cloud-200 overflow-hidden">
        <div className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16 sm:py-20">
          <div className="grid lg:grid-cols-[auto,1fr] gap-8 lg:gap-14 items-end">
            <div className="flex items-baseline gap-3">
              <span className="font-display font-medium text-[88px] sm:text-[120px] leading-none tracking-tight text-navy-900">{reviews.length}</span>
              <span className="text-slate-500 text-lg leading-tight max-w-[120px]">{reviewsWord(reviews.length, L)}</span>
            </div>
            <div>
              <Eyebrow>{t.revEyebrow}</Eyebrow>
              <h2 className="mt-4 font-display font-medium text-3xl sm:text-4xl text-navy-800">
                {t.revTitle}
              </h2>
              <p className="mt-3 text-slate-500 max-w-xl">{t.revText}</p>
            </div>
          </div>
          <Reviews items={reviews} lang={L} />
        </div>
      </section>

      {/* NEW CERTIFICATES SECTION */}
      <section className="w-full px-5 sm:px-8  py-16 sm:py-20 bg-[#f8fafc]">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h2 className="font-display font-medium text-3xl sm:text-4xl text-navy-800 tracking-tight">
            {L === "uz" ? "Bizning Sertifikatlar" : "Наши Сертификаты"}
          </h2>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1340px] mx-auto">
          {certificates.map((cert, idx) => (
            <Reveal key={cert.id} delay={idx * 60}>
              <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col justify-between h-full group hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
                <div className="w-full aspect-[4/5] bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center border border-slate-200/60">
                  <img loading="lazy" decoding="async"
                    src={cert.img}
                    alt={cert.title}
                    width={1336}
                    height={1670}
                    className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>


      {/* BLOG */}
      <section className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16 sm:py-20">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <Eyebrow>{t.blogEyebrow}</Eyebrow>
            <h2 className="mt-4 font-display font-medium text-3xl sm:text-4xl text-navy-800">
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
        <div className="grid md:grid-cols-3 gap-5 mt-10">
          {latest.map((a, i) => (
            <Reveal key={a.slug} delay={i * 80}>
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
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-cloud-50 border-y border-cloud-200">
        <div className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16 sm:py-20">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
          />
          <JsonLd data={organizationSchema(L)} />
          <Eyebrow>{x.faqEyebrow}</Eyebrow>
          <h2 className="mt-4 font-display font-medium text-3xl sm:text-4xl text-navy-800">
            {x.faqTitle}
          </h2>
          <Faq items={x.faq} />
        </div>
      </section>

      {/* WHAT HAPPENS AFTER — removes the "scary to leave a request" fear */}
      <section className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16 sm:py-20">
        <div className="max-w-2xl">
          <Eyebrow>{x.afterEyebrow}</Eyebrow>
          <h2 className="mt-4 font-display font-medium text-3xl sm:text-4xl text-navy-800">
            {x.afterTitle}
          </h2>
          <p className="mt-3 text-slate-500">{x.afterText}</p>
        </div>
        <ol className="grid sm:grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-8 mt-10 border-t border-cloud-200 pt-8">
          {x.afterSteps.map((s, i) => (
            <li key={s.t}>
              <Reveal delay={i * 80}>
                <span className="font-display text-sky-600 text-xl sm:text-2xl tracking-tight">{s.time}</span>
                <h3 className="font-bold text-navy-800 mt-3">{s.t}</h3>
                <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">{s.d}</p>
              </Reveal>
            </li>
          ))}
        </ol>
        {/* Что клиент получает физически — снимает вопрос «а что мне дадут за бесплатно» */}
        <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="text-sm font-semibold text-navy-800 mr-1">{x.afterHandsTitle}:</span>
          {x.afterHands.map((h) => (
            <span key={h} className="text-sm text-navy-800 bg-cloud-100 border border-cloud-200 rounded-full px-3.5 py-1.5">{h}</span>
          ))}
        </div>
      </section>

      {/* CALLBACK FORM */}
      <section
        id="zayavka"
        className="relative bg-navy-900 overflow-hidden notch-tr"
      >
        <div className="absolute inset-0 grid-lines opacity-25" />
        <div className="relative w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16 sm:py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <Eyebrow light>{t.formEyebrow}</Eyebrow>
            <h2 className="mt-4 font-display font-medium text-3xl sm:text-4xl">
              {t.formTitle}
            </h2>
            <p className="mt-4 text-cloud-200/80 max-w-lg leading-relaxed">
              {t.formText}
            </p>
            <div className="mt-7 space-y-3 text-cloud-200/90">
              <a
                href={`tel:${SITE.phoneMain}`}
                className="flex items-center gap-3 font-semibold hover:text-sky-300"
              >
                <span className="w-10 h-10 rounded-lg bg-white/10 grid place-items-center text-sky-300">
                  <IcoPhone className="w-5 h-5" />
                </span>
                {SITE.phoneMainHuman}
              </a>
              <div className="flex items-center gap-3 text-cloud-200/70">
                <span className="w-10 h-10 rounded-lg bg-white/10 grid place-items-center text-sky-300">
                  <IcoPin className="w-5 h-5" />
                </span>
                {loc.addressCity}, {loc.address}
              </div>
            </div>
          </div>
          <div className="w-full max-w-md lg:justify-self-end">
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
              <Eyebrow light>{t.contEyebrow}</Eyebrow>
              <h2 className="mt-3 font-display font-medium text-3xl sm:text-4xl">{t.contTitle}</h2>
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
                src="https://maps.google.com/maps?q=Стеллажи%20в%20Ташкенте%20от%20RaxPro,%20Тоshkent&z=15&output=embed"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer lang={L} />
    </div>
  );
}
