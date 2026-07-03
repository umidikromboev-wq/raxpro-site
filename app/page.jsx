import { cookies } from 'next/headers';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LeadForm from '../components/LeadForm';
import Calculator from '../components/Calculator';
import Reveal from '../components/Reveal';
import ProductSlider from '../components/ProductSlider';
import { SplitHead, Eyebrow } from '../components/Section';
import { SITE, CLIENT_LOGOS, ISO_CERTS } from '../lib/site';
import { T, EXTRA, normalizeLang } from '../lib/i18n';
import Faq from '../components/Faq';
import { getLatest, localize } from '../lib/articles';
import {
  IcoRuler, IcoDraft, IcoFactory, IcoWrench, IcoShield, IcoWeight,
  IcoLayers, IcoPallet, IcoArchive, IcoShop, IcoClock, IcoCheck, IcoArrow, IcoPin, IcoPhone, IcoTg,
} from '../components/Icons';

const REVIEWS = ['/reviews/r1.jpg', '/reviews/r2.jpg', '/reviews/r3.jpg', '/reviews/r4.jpg', '/reviews/r5.jpg', '/reviews/r6.jpg'];

const IMG = { hero: '/works/hero.jpg', pallet: '/works/pallet.jpg', medium: '/works/medium.jpg', archive: '/works/archive.jpg', retail: '/works/retail.jpg', welder: '/works/w6.jpg' };
const STEP_ICONS = [IcoRuler, IcoDraft, IcoFactory, IcoWrench];
const DIR_META = [
  { Ico: IcoPallet, img: IMG.pallet, href: '/napravleniya/palletnye-stellazhi' },
  { Ico: IcoLayers, img: IMG.medium, href: '/napravleniya/srednegruzovye-stellazhi' },
  { Ico: IcoArchive, img: IMG.archive, href: '/napravleniya/arhivnye-stellazhi' },
  { Ico: IcoShop, img: IMG.retail, href: '/napravleniya/torgovye-stellazhi' },
];
const ADV_ICONS = [IcoShield, IcoWeight, IcoFactory, IcoWeight, IcoWrench, IcoClock];
const INC_ICONS = [IcoLayers, IcoShield, IcoShop];

const PROJECTS = {
  ru: [
    { t: 'Super Pack', d: 'Паллетные стеллажи для крупнейшего в Узбекистане завода бумаги и упаковки. Безопасные сертифицированные системы под тяжёлую нагрузку.', load: 'Завод · паллетные', img: '/works/w1.jpg' },
    { t: 'JAC Motors', d: 'Паллетные стеллажи для склада автомобильного завода. Проектирование под интенсивную работу погрузочной техники.', load: 'Автозавод · паллетные', img: '/works/w2.jpg' },
    { t: 'Bloom Shop', d: '30 комплектов среднегрузовых стеллажей: высота 2.5 м, 5 ярусов, до 400 кг на ярус. Склад косметики для маркетплейса — под ключ.', load: 'Маркетплейс · 30 комплектов', img: '/works/retail.jpg' },
    { t: 'Caffelito Coffee', d: 'Стеллажи для склада кофейни: высота 4 м, 1.5 тонны на ярус. Поставлено и смонтировано за 12 часов.', load: 'HoReCa · 12 часов', img: '/works/w3.jpg' },
    { t: 'Sayqal Family Restaurant', d: 'Проектные стеллажи для складского помещения ресторана. Компактная и надёжная система хранения.', load: 'Ресторан · проект', img: '/works/w5.jpg' },
    { t: 'Discovery Invest', d: 'Системы хранения для складского комплекса. Полный цикл: замер, проектирование, поставка и монтаж.', load: 'Складской комплекс', img: '/works/medium.jpg' },
  ],
  uz: [
    { t: 'Super Pack', d: 'Oʻzbekistondagi eng yirik qogʻoz va qadoqlash zavodi uchun palletli stellajlar. Ogʻir yuklamaga moʻljallangan xavfsiz sertifikatlangan tizimlar.', load: 'Zavod · palletli', img: '/works/w1.jpg' },
    { t: 'JAC Motors', d: 'Avtomobil zavodi ombori uchun palletli stellajlar. Texnikaning jadal ishlashiga moslab loyihalangan.', load: 'Avtozavod · palletli', img: '/works/w2.jpg' },
    { t: 'Bloom Shop', d: '30 komplekt oʻrta yuklamali stellaj: balandligi 2.5 m, 5 qavat, har qavatga 400 kg gacha. Marketpleys uchun kosmetika ombori — kalit topshirish.', load: 'Marketpleys · 30 komplekt', img: '/works/retail.jpg' },
    { t: 'Caffelito Coffee', d: 'Kafe ombori uchun stellajlar: balandligi 4 m, har qavatga 1.5 tonna. 12 soatda yetkazilib oʻrnatildi.', load: 'HoReCa · 12 soat', img: '/works/w3.jpg' },
    { t: 'Sayqal Family Restaurant', d: 'Restoran ombor xonasi uchun loyihaviy stellajlar. Ixcham va ishonchli saqlash tizimi.', load: 'Restoran · loyiha', img: '/works/w5.jpg' },
    { t: 'Discovery Invest', d: 'Ombor majmuasi uchun saqlash tizimlari. Toʻliq sikl: oʻlchov, loyiha, yetkazish va montaj.', load: 'Ombor majmuasi', img: '/works/medium.jpg' },
  ],
};

export default async function Home() {
  const store = await cookies();
  const L = normalizeLang(store.get('lang')?.value);
  const t = T[L];
  const x = EXTRA[L];
  const latest = getLatest(3).map((a) => localize(a, L));
  const faqJsonLd = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: x.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  const steps = t.steps.map((s, i) => ({ ...s, Ico: STEP_ICONS[i] }));
  const directions = t.directions.map((d, i) => ({ ...d, ...DIR_META[i] }));
  const adv = t.adv.map((a, i) => ({ ...a, Ico: ADV_ICONS[i] }));
  const income = t.income.map((a, i) => ({ ...a, Ico: INC_ICONS[i] }));
  const projects = PROJECTS[L];

  return (
    <div className="bg-white text-ink">
      <Header lang={L} />

      {/* HERO */}
      <section className="relative min-h-svh flex flex-col justify-end overflow-hidden">
        <div className="absolute inset-0 bg-navy-900">
          <video autoPlay muted loop playsInline preload="auto" poster={IMG.hero} className="absolute inset-0 w-full h-full object-cover">
            <source src="/hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/70 to-navy-900/45" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900/70 to-transparent" />
        </div>

        <div className="relative w-full px-5 sm:px-8 lg:px-14 2xl:px-24 pb-14 sm:pb-16 pt-28">
          <div className="animate-fadeup max-w-3xl text-white">
            <Eyebrow light>{t.heroEyebrow}</Eyebrow>
            <h1 className="mt-5 font-display font-medium text-4xl sm:text-5xl lg:text-[3.7rem] leading-[1.08]">
              {t.heroTitle1}<br />{t.heroTitle2} <span className="text-sky-400">{t.heroTitleAccent}</span>
            </h1>
            <p className="mt-5 text-lg text-cloud-200/85 max-w-xl leading-relaxed">{t.heroText}</p>
            <div className="flex flex-wrap gap-3 mt-7">
              <a href="#kalkulyator" className="inline-flex items-center gap-2 bg-brand-grad text-white font-bold px-7 py-3.5 rounded-xl shadow-glow hover:brightness-110">
                {t.heroCta1} <IcoArrow className="w-5 h-5" />
              </a>
              <a href="#napravleniya" className="inline-flex items-center gap-2 border border-white/30 hover:bg-white hover:text-navy-800 text-white px-7 py-3.5 rounded-xl font-semibold backdrop-blur-sm">
                {t.heroCta2}
              </a>
            </div>
            <div className="flex flex-wrap gap-x-7 gap-y-2 mt-8 text-sm text-cloud-200/80">
              {t.heroChips.map((c) => (
                <span key={c} className="inline-flex items-center gap-1.5"><IcoCheck className="w-4 h-4 text-sky-400" /> {c}</span>
              ))}
            </div>
            <div className="mt-4 inline-block text-sm font-semibold text-sky-300 border border-sky-400/30 bg-sky-500/10 rounded-lg px-3.5 py-2">{t.heroPrice}</div>
          </div>
        </div>
      </section>

      {/* CLIENTS */}
      <section className="border-b border-cloud-200 bg-cloud-50">
        <div className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-8">
          <p className="text-center text-slate-500 text-xs uppercase tracking-widest mb-6">{t.clients}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-x-6 gap-y-6 items-center">
            {CLIENT_LOGOS.map((c) => (
              <div key={c.alt} className="flex items-center justify-center h-12">
                <img src={c.src} alt={c.alt} className="max-h-11 max-w-[120px] w-auto object-contain opacity-70 hover:opacity-100 transition grayscale hover:grayscale-0" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
      <section id="kalkulyator" className="relative bg-navy-900 overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-20" />
        <div className="relative w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16 sm:py-20 grid lg:grid-cols-[1fr,1.1fr] gap-12 items-center">
          <div className="text-white">
            <Eyebrow light>{t.calcEyebrow}</Eyebrow>
            <h2 className="mt-4 font-display font-medium text-3xl sm:text-4xl leading-tight">
              {t.calcTitle1} <span className="text-sky-400">{t.calcTitleAccent}</span>
            </h2>
            <p className="mt-4 text-cloud-200/80 max-w-lg leading-relaxed">{t.calcText}</p>
            <ul className="mt-6 space-y-2.5">
              {t.calcFeatures.map((f) => (
                <li key={f} className="flex items-center gap-3 text-cloud-200/90">
                  <span className="w-6 h-6 rounded-full bg-white/10 grid place-items-center text-sky-300 shrink-0"><IcoCheck className="w-4 h-4" /></span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full max-w-xl lg:justify-self-end"><Calculator lang={L} /></div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="o-kompanii" className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16 sm:py-20">
        <SplitHead eyebrow={t.procEyebrow} title={t.procTitle} desc={t.procText} />
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
                  <span className="font-display text-6xl leading-[0.8] text-navy-800/12">{String(i + 1).padStart(2, '0')}</span>
                  <s.Ico className="w-8 h-8 text-sky-600 mb-1" />
                </div>
                <h3 className="font-bold text-xl text-navy-800 mt-5">{s.t}</h3>
                <p className="text-slate-500 text-[15px] mt-2 leading-relaxed max-w-xs">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* METRICS */}
      <section className="relative bg-navy-900 text-white overflow-hidden notch-tr">
        <div className="absolute inset-0 grid-lines opacity-30" />
        <div className="relative w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16">
          <div className="grid lg:grid-cols-[1fr,1.5fr] gap-10 items-center">
            <div>
              <Eyebrow light>{t.numsEyebrow}</Eyebrow>
              <h2 className="mt-4 font-display font-medium text-3xl sm:text-4xl">{t.numsTitle}</h2>
              <p className="mt-3 text-cloud-200/75 max-w-md">{t.numsText}</p>
              <a href="#zayavka" className="inline-flex items-center gap-2 mt-6 bg-white text-navy-900 font-bold px-6 py-3 rounded-xl hover:bg-sky-400 hover:text-white transition">
                {t.numsCta} <IcoArrow className="w-5 h-5" />
              </a>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-white/10 rounded-xl2 overflow-hidden border border-white/10">
              {t.stats.map((s) => (
                <div key={s.l} className="bg-navy-900 p-6">
                  <div className="font-display font-medium text-4xl sm:text-5xl text-sky-400 leading-none">{s.n}<span className="text-2xl text-sky-300 ml-1">{s.s}</span></div>
                  <div className="text-cloud-200/70 text-sm mt-2 leading-snug">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DIRECTIONS */}
      <section id="napravleniya" className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16 sm:py-20">
        <SplitHead eyebrow={t.dirEyebrow} title={t.dirTitle} desc={t.dirText} />
        <div className="grid md:grid-cols-2 gap-5 mt-10">
          {directions.map((d, i) => (
            <Reveal key={d.t} delay={i * 80}>
              <a href={d.href} className="group relative block rounded-xl2 overflow-hidden min-h-[320px] shadow-card">
                <img src={d.img} alt={d.t} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/95 via-navy-900/55 to-navy-900/20" />
                <div className="absolute top-4 left-4 w-11 h-11 rounded-xl bg-white/95 text-navy-800 grid place-items-center"><d.Ico className="w-6 h-6" /></div>
                <div className="absolute top-4 right-4 w-11 h-11 rounded-full border border-white/40 text-white grid place-items-center group-hover:bg-white group-hover:text-navy-800 transition"><IcoArrow className="w-5 h-5 -rotate-45" /></div>
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <h3 className="font-display font-bold text-2xl">{d.t}</h3>
                  <p className="text-cloud-200/85 text-sm mt-2 max-w-md leading-relaxed">{d.d}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-300 group-hover:text-white">{t.goto} <IcoArrow className="w-4 h-4" /></span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* INCOME */}
      <section className="bg-cloud-50 border-y border-cloud-200">
        <div className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16 sm:py-20">
          <SplitHead eyebrow={t.incEyebrow} title={t.incTitle} desc={t.incText} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
            {income.map((a, i) => (
              <Reveal key={a.t} delay={i * 70}>
                <div className="h-full rounded-xl2 bg-white border border-cloud-200 shadow-card p-6">
                  <div className="w-12 h-12 rounded-xl bg-brand-grad text-white grid place-items-center shadow-glow"><a.Ico className="w-6 h-6" /></div>
                  <h3 className="font-bold text-lg text-navy-800 mt-4">{a.t}</h3>
                  <p className="text-slate-500 text-sm mt-2 leading-relaxed">{a.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON — factory vs artisan */}
      <section className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16 sm:py-20">
        <SplitHead eyebrow={x.cmpEyebrow} title={x.cmpTitle} desc={x.cmpText} />
        <div className="grid md:grid-cols-2 gap-4 mt-10">
          <div className="rounded-xl2 bg-navy-900 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-brand-grad opacity-90" />
            <div className="relative p-6 sm:p-8">
              <div className="font-display font-medium text-xl sm:text-2xl">{x.cmpUs}</div>
              <ul className="mt-5 space-y-3">
                {x.cmpRows.map((r) => (
                  <li key={r.us} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-white/20 grid place-items-center shrink-0 mt-0.5"><IcoCheck className="w-4 h-4 text-white" /></span>
                    <span className="text-white/95">{r.us}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="rounded-xl2 bg-white border border-cloud-200 shadow-card p-6 sm:p-8">
            <div className="font-display font-medium text-xl sm:text-2xl text-slate-500">{x.cmpThem}</div>
            <ul className="mt-5 space-y-3">
              {x.cmpRows.map((r) => (
                <li key={r.them} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-cloud-100 grid place-items-center shrink-0 mt-0.5 text-slate-400">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
                  </span>
                  <span className="text-slate-500">{r.them}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* PROJECTS SLIDER */}
      <section id="proekty" className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16 sm:py-20">
        <SplitHead eyebrow={t.projEyebrow} title={t.projTitle} desc={t.projText} />
        <div className="mt-10"><ProductSlider items={projects} /></div>
      </section>

      {/* ADVANTAGES */}
      <section id="produkciya" className="bg-cloud-50 border-y border-cloud-200">
        <div className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16 sm:py-20">
          <SplitHead eyebrow={t.advEyebrow} title={t.advTitle} desc={t.advText} />
          {/* Bento — first advantage is a large dark feature card, rest varied */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10 lg:auto-rows-[1fr]">
            {adv.map((a, i) => {
              const big = i === 0;
              return (
                <Reveal key={a.t} delay={i * 60} className={big ? 'sm:col-span-2 lg:row-span-2' : ''}>
                  {big ? (
                    <div className="relative h-full rounded-xl2 bg-navy-900 text-white p-8 overflow-hidden flex flex-col justify-between min-h-[240px]">
                      <div className="absolute inset-0 bg-brand-grad opacity-90" />
                      <div className="absolute inset-0 grid-lines opacity-25" />
                      <div className="relative">
                        <a.Ico className="w-10 h-10 text-white" />
                        <h3 className="font-display font-medium text-2xl sm:text-3xl mt-6 leading-tight">{a.t}</h3>
                      </div>
                      <p className="relative text-white/85 mt-4 leading-relaxed max-w-md">{a.d}</p>
                    </div>
                  ) : (
                    <div className="h-full rounded-xl2 bg-white border border-cloud-200 p-6 hover:border-sky-300 hover:shadow-card transition">
                      <a.Ico className="w-8 h-8 text-sky-600" />
                      <h3 className="font-bold text-navy-800 mt-4">{a.t}</h3>
                      <p className="text-slate-500 text-sm mt-2 leading-relaxed">{a.d}</p>
                    </div>
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section id="osnovatel" className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16 sm:py-20">
        <div className="grid lg:grid-cols-[0.85fr,1.15fr] gap-10 lg:gap-14 items-center">
          <div className="relative">
            <div className="rounded-xl2 overflow-hidden border border-cloud-200 shadow-card max-w-md">
              <img src="/brand/founder.jpg" alt={t.founderName} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-4 left-6 bg-white rounded-xl shadow-card border border-cloud-200 px-5 py-3">
              <div className="font-display font-medium text-navy-800 text-lg leading-tight">{t.founderName}</div>
              <div className="text-sm text-sky-600">{t.founderRole}</div>
            </div>
          </div>
          <div>
            <Eyebrow>{t.founderEyebrow}</Eyebrow>
            <h2 className="mt-4 font-display font-medium text-3xl sm:text-4xl text-navy-800 leading-tight">{t.founderQuote}</h2>
            <div className="mt-5 space-y-4 text-slate-600 leading-relaxed max-w-2xl">
              {t.founderP.map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <div className="mt-7">
              <div className="text-slate-400 text-sm mb-2">{t.certsLabel}</div>
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

      {/* GUARANTEE */}
      <section className="relative bg-navy-900 overflow-hidden">
        <div className="absolute inset-0 bg-brand-grad opacity-95" />
        <div className="absolute inset-0 grid-lines opacity-30" />
        <div className="relative w-full px-5 sm:px-8 lg:px-14 2xl:px-24 max-w-4xl mx-auto py-20 text-center text-white">
          <Reveal>
            <div className="inline-flex items-center gap-3">
              <span className="w-16 h-16 rounded-2xl bg-white/15 grid place-items-center"><IcoShield className="w-9 h-9 text-white" /></span>
              <span className="font-display font-medium text-6xl sm:text-7xl">10 {t.yil}</span>
            </div>
            <h2 className="font-display font-medium text-2xl sm:text-3xl mt-4">{t.guaranteeTitle}</h2>
            <p className="text-white/90 mt-4 max-w-2xl mx-auto leading-relaxed">{t.guaranteeText}</p>
          </Reveal>
        </div>
      </section>

      {/* REVIEWS — real screenshots from the Telegram channel */}
      <section className="bg-cloud-50 border-y border-cloud-200 overflow-hidden">
        <div className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16 sm:py-20">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <Eyebrow>{t.revEyebrow}</Eyebrow>
              <h2 className="mt-4 font-display font-medium text-3xl sm:text-4xl text-navy-800">{t.revTitle}</h2>
              <p className="mt-3 text-slate-500 max-w-xl">{t.revText}</p>
            </div>
            <a href={SITE.reviewsChannel} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold px-5 py-2.5 rounded-xl transition">
              <IcoTg className="w-5 h-5" /> {t.revCta}
            </a>
          </div>
          <div className="flex gap-5 overflow-x-auto no-scrollbar mt-10 pb-2 snap-x-mandatory">
            {REVIEWS.map((src, i) => (
              <div key={src} className="snap-start shrink-0 w-[260px] sm:w-[280px] rounded-xl2 bg-white border border-cloud-200 shadow-card overflow-hidden">
                <div className="h-[400px] bg-cloud-100 overflow-hidden flex items-start justify-center">
                  <img src={src} alt={`Отзыв клиента RAXPRO ${i + 1}`} className="w-full object-cover object-top" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16 sm:py-20">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <Eyebrow>{t.blogEyebrow}</Eyebrow>
            <h2 className="mt-4 font-display font-medium text-3xl sm:text-4xl text-navy-800">{t.blogTitle}</h2>
          </div>
          <a href="/blog" className="inline-flex items-center gap-2 text-navy-700 font-semibold hover:text-sky-600">{t.blogAll} <IcoArrow className="w-5 h-5" /></a>
        </div>
        <div className="grid md:grid-cols-3 gap-5 mt-10">
          {latest.map((a, i) => (
            <Reveal key={a.slug} delay={i * 80}>
              <a href={`/blog/${a.slug}`} className="group block h-full rounded-xl2 overflow-hidden bg-white border border-cloud-200 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition">
                <div className="aspect-[16/9] overflow-hidden bg-cloud-100"><img src={a.cover} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" /></div>
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

      {/* FAQ */}
      <section className="bg-cloud-50 border-y border-cloud-200">
        <div className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16 sm:py-20">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
          <Eyebrow>{x.faqEyebrow}</Eyebrow>
          <h2 className="mt-4 font-display font-medium text-3xl sm:text-4xl text-navy-800">{x.faqTitle}</h2>
          <Faq items={x.faq} />
        </div>
      </section>

      {/* WHAT HAPPENS AFTER — removes the "scary to leave a request" fear */}
      <section className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16 sm:py-20">
        <div className="max-w-2xl">
          <Eyebrow>{x.afterEyebrow}</Eyebrow>
          <h2 className="mt-4 font-display font-medium text-3xl sm:text-4xl text-navy-800">{x.afterTitle}</h2>
          <p className="mt-3 text-slate-500">{x.afterText}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {x.afterSteps.map((s, i) => (
            <Reveal key={s.t} delay={i * 80}>
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-brand-grad text-white grid place-items-center font-display font-medium text-lg shadow-glow">{i + 1}</div>
                <h3 className="font-bold text-navy-800 mt-4">{s.t}</h3>
                <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CALLBACK FORM */}
      <section id="zayavka" className="relative bg-navy-900 overflow-hidden notch-tr">
        <div className="absolute inset-0 grid-lines opacity-25" />
        <div className="relative w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16 sm:py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <Eyebrow light>{t.formEyebrow}</Eyebrow>
            <h2 className="mt-4 font-display font-medium text-3xl sm:text-4xl">{t.formTitle}</h2>
            <p className="mt-4 text-cloud-200/80 max-w-lg leading-relaxed">{t.formText}</p>
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
          <div className="w-full max-w-md lg:justify-self-end"><LeadForm lang={L} /></div>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="kontakty" className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16 sm:py-20 grid md:grid-cols-2 gap-10">
        <div>
          <Eyebrow>{t.contEyebrow}</Eyebrow>
          <h2 className="mt-4 font-display font-medium text-3xl sm:text-4xl text-navy-800">{t.contTitle}</h2>
          <div className="mt-6 space-y-5">
            <div>
              <div className="text-slate-400 text-sm">{t.phones}</div>
              <a href={`tel:${SITE.phoneMain}`} className="block text-xl font-bold text-navy-800 hover:text-sky-600">{SITE.phoneMainHuman}</a>
              <a href={`tel:${SITE.phoneAlt}`} className="block text-navy-700 hover:text-sky-600">{SITE.phoneAltHuman}</a>
              <a href={`tel:${SITE.landline}`} className="block text-navy-700 hover:text-sky-600">{SITE.landlineHuman}</a>
            </div>
            <div>
              <div className="text-slate-400 text-sm">Email</div>
              <p className="text-navy-700">{SITE.emails.join(' · ')}</p>
            </div>
            <div>
              <div className="text-slate-400 text-sm">{t.address}</div>
              <p className="text-navy-700">{SITE.addressCity}, {SITE.address}</p>
              <p className="text-slate-400 text-sm">{SITE.landmark}</p>
            </div>
            <div>
              <div className="text-slate-400 text-sm">{t.socials}</div>
              <div className="flex gap-3 mt-1">
                <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="text-navy-700 font-semibold hover:text-sky-600">Instagram</a>
                <a href={SITE.telegram} target="_blank" rel="noopener noreferrer" className="text-navy-700 font-semibold hover:text-sky-600">Telegram</a>
                <a href={SITE.reviewsChannel} target="_blank" rel="noopener noreferrer" className="text-navy-700 font-semibold hover:text-sky-600">{t.reviews}</a>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-xl2 overflow-hidden border border-cloud-200 shadow-card min-h-[340px]">
          <iframe title="RAXPRO" className="w-full h-full min-h-[340px]" src="https://maps.google.com/maps?q=%D0%A2%D1%83%D1%80%D1%82%20%D0%90%D1%80%D1%8B%D0%BA%2011/1%20%D0%A2%D0%B0%D1%88%D0%BA%D0%B5%D0%BD%D1%82&z=15&output=embed" loading="lazy" />
        </div>
      </section>

      <Footer lang={L} />
    </div>
  );
}
