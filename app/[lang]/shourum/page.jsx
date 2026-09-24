import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import LeadForm from "../../../components/LeadForm";
import { IcoArrow, IcoPhone } from "../../../components/Icons";
import { SITE, siteLoc } from "../../../lib/site";
import { normalizeLang } from "../../../lib/i18n";
import { alternatesFor, href } from "../../../lib/lang";
import { breadcrumbSchema, JsonLd } from "../../../lib/schema";

// Шоурум (ТЗ 24.09, этап 4). Фото фасада — от Муродбека (msg 618398).
// Адрес — тот же, что на «Контактах» (вопрос 5 ТЗ, по умолчанию). Что стоит
// в зале, не выдумываем: галерея интерьера появится, когда придут 2–3 фото.
const INTERIOR = [];

const T = {
  ru: {
    home: "Главная",
    title: "Шоурум",
    h1: "Шоурум RAXPRO в Ташкенте",
    lead: "Приезжайте посмотреть стеллажи вживую до заказа: металл, покраску, замки балок. Менеджер ответит на вопросы и поможет с расчётом.",
    route: "Построить маршрут",
    call: "Позвонить",
    where: "Как нас найти",
    address: "Адрес",
    hours: "Часы работы",
    phone: "Телефон",
    why: "Зачем приезжать",
    points: [
      ["Потрогать металл", "Толщину стойки, покраску и замковое соединение лучше оценивать руками, а не по фото."],
      ["Сразу к расчёту", "Возьмите размеры помещения — менеджер прикинет расстановку и стоимость на месте."],
      ["Договор на месте", "Замер, сроки и гарантию 10 лет фиксируем в договоре."],
    ],
    photos: "Фото шоурума",
    formTitle: "Предупредите о визите",
    formText: "Оставьте телефон — менеджер перезвонит в рабочее время и согласует удобное время.",
    facadeAlt: "Вход в шоурум RAXPRO — вывеска «Стеллажи для складов и супермаркетов»",
    seoTitle: "Шоурум RAXPRO в Ташкенте — стеллажи вживую | ул. Турт Арык, 11/1",
    seoDesc: "Шоурум стеллажей RAXPRO в Ташкенте: посмотрите металл, покраску и замки до заказа. Мирзо-Улугбекский р-н, ул. Турт Арык, 11/1. Пн–Сб 9:00–18:00.",
  },
  uz: {
    home: "Bosh sahifa",
    title: "Shourum",
    h1: "Toshkentdagi RAXPRO shourumi",
    lead: "Buyurtmadan oldin stellajlarni jonli koʻrish uchun keling: metall, boʻyoq, balka qulflari. Menejer savollaringizga javob beradi va hisob-kitobda yordam beradi.",
    route: "Yoʻnalish qurish",
    call: "Qoʻngʻiroq qilish",
    where: "Bizni qanday topish mumkin",
    address: "Manzil",
    hours: "Ish vaqti",
    phone: "Telefon",
    why: "Nega kelish kerak",
    points: [
      ["Metallni ushlab koʻring", "Tayanch qalinligi, boʻyoq va qulfli birikmani suratdan emas, qoʻl bilan baholash yaxshiroq."],
      ["Darhol hisob-kitob", "Xona oʻlchamlarini olib keling — menejer joyida joylashtirish va narxni chamalab beradi."],
      ["Shartnoma joyida", "Oʻlchov, muddatlar va 10 yillik kafolat shartnomada belgilanadi."],
    ],
    photos: "Shourum suratlari",
    formTitle: "Tashrifingiz haqida xabar bering",
    formText: "Telefon raqamingizni qoldiring — menejer ish vaqtida qoʻngʻiroq qiladi va qulay vaqtni kelishadi.",
    facadeAlt: "RAXPRO shourumiga kirish — «Ombor va supermarketlar uchun stellajlar» peshlavhasi",
    seoTitle: "Toshkentdagi RAXPRO shourumi — stellajlarni jonli koʻring | Toʻrt Ariq, 11/1",
    seoDesc: "Toshkentdagi RAXPRO stellajlar shourumi: buyurtmadan oldin metall, boʻyoq va qulflarni koʻring. Mirzo Ulugʻbek tumani, Toʻrt Ariq koʻchasi, 11/1. Du–Sha 9:00–18:00.",
  },
};

export async function generateMetadata({ params }) {
  const L = normalizeLang((await params).lang);
  const t = T[L];
  return {
    title: t.seoTitle,
    description: t.seoDesc,
    alternates: alternatesFor("/shourum", L),
    openGraph: { title: t.seoTitle, description: t.seoDesc, type: "website", images: ["/showroom/fasad.jpg"] },
  };
}

export default async function ShowroomPage({ params }) {
  const L = normalizeLang((await params).lang);
  const t = T[L];
  const loc = siteLoc(L);
  const mapQuery = encodeURIComponent(`${loc.addressCity}, ${loc.address}`);
  const crumbs = [
    { name: t.home, path: "/" },
    { name: t.title, path: "/shourum" },
  ];
  const WRAP = "w-full px-5 sm:px-8 lg:px-14 2xl:px-24";
  return (
    <div className="bg-white text-ink">
      <JsonLd data={breadcrumbSchema(L, crumbs)} />
      <Header lang={L} />
      <main>
        <section className="relative pt-24 bg-navy-900 text-white overflow-hidden">
          <div className="absolute inset-0 grid-lines opacity-20" />
          <div className={`relative ${WRAP} py-12 sm:py-16 grid lg:grid-cols-[1fr,0.8fr] gap-10 items-center`}>
            <div>
              <nav aria-label="breadcrumbs" className="text-sm text-cloud-200/60 mb-4">
                <a href={href(L, "/")} className="hover:text-sky-400">{t.home}</a> <span className="mx-1">/</span>
                <span className="text-cloud-200">{t.title}</span>
              </nav>
              <h1 className="font-display font-medium text-3xl sm:text-5xl tracking-tight leading-[1.08]">{t.h1}</h1>
              <p className="mt-5 text-lg text-cloud-200/85 max-w-xl leading-relaxed">{t.lead}</p>
              <dl className="mt-8 grid sm:grid-cols-2 gap-x-8 gap-y-4 max-w-xl">
                <div className="sm:col-span-2">
                  <dt className="text-sm text-cloud-200/60">{t.address}</dt>
                  <dd className="mt-1 font-semibold">{loc.addressCity}, {loc.address}<div className="font-normal text-cloud-200/70 text-sm mt-0.5">{loc.landmark}</div></dd>
                </div>
                <div><dt className="text-sm text-cloud-200/60">{t.hours}</dt><dd className="mt-1 font-semibold">{loc.hours}</dd></div>
                <div><dt className="text-sm text-cloud-200/60">{t.phone}</dt><dd className="mt-1 font-semibold"><a href={`tel:${SITE.phoneMain}`} className="hover:text-sky-300">{SITE.phoneMainHuman}</a></dd></div>
              </dl>
              <div className="flex flex-wrap gap-3 mt-8">
                <a href={SITE.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-sky-400 hover:bg-sky-600 text-navy-900 font-bold px-7 py-3.5 rounded-xl">{t.route} <IcoArrow className="w-5 h-5" /></a>
                <a href={`tel:${SITE.phoneMain}`} className="inline-flex items-center gap-2 border border-white/25 hover:border-sky-400 text-white px-7 py-3.5 rounded-xl font-semibold"><IcoPhone className="w-4 h-4" /> {t.call}</a>
              </div>
            </div>
            <div className="rounded-xl2 overflow-hidden border border-white/10 max-w-md w-full lg:justify-self-end">
              <img loading="eager" fetchPriority="high" decoding="async" src="/showroom/fasad.jpg" alt={t.facadeAlt} width={900} height={1200} className="w-full h-auto" />
            </div>
          </div>
        </section>

        <section aria-labelledby="why" className={`${WRAP} py-14 sm:py-20`}>
          <h2 id="why" className="font-display font-medium text-3xl sm:text-4xl text-navy-800 tracking-tight">{t.why}</h2>
          <ol className="mt-10 grid md:grid-cols-3 gap-x-10 gap-y-8">
            {t.points.map(([title, text], i) => (
              <li key={title} className="border-t border-cloud-200 pt-6">
                <span className="font-display text-3xl text-sky-600 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 font-semibold text-lg text-navy-800">{title}</h3>
                <p className="mt-2 text-slate-600 leading-relaxed">{text}</p>
              </li>
            ))}
          </ol>
        </section>

        {INTERIOR.length > 0 && (
          <section aria-labelledby="photos" className={`${WRAP} pb-14`}>
            <h2 id="photos" className="font-display font-medium text-2xl sm:text-3xl text-navy-800 tracking-tight">{t.photos}</h2>
            <ul className="mt-6 grid grid-cols-2 lg:grid-cols-3 gap-4">
              {INTERIOR.map((src, i) => (
                <li key={src} className="rounded-xl2 overflow-hidden bg-cloud-100 border border-cloud-200">
                  <img loading="lazy" decoding="async" src={src} alt={`${t.title} RAXPRO — ${i + 1}`} width={800} height={600} className="w-full aspect-[4/3] object-cover" />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="where" className="bg-cloud-50 border-y border-cloud-200">
          <div className={`${WRAP} py-14`}>
            <h2 id="where" className="font-display font-medium text-2xl sm:text-3xl text-navy-800 tracking-tight">{t.where}</h2>
            <div className="mt-6 rounded-xl2 overflow-hidden border border-cloud-200 bg-white">
              <iframe title={t.where} src={`https://maps.google.com/maps?q=${mapQuery}&z=16&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="w-full h-[380px] border-0" />
            </div>
          </div>
        </section>

        <section id="zayavka" className="relative bg-navy-900 overflow-hidden">
          <div className="absolute inset-0 grid-lines opacity-20" />
          <div className={`relative ${WRAP} py-14 grid lg:grid-cols-2 gap-10 items-center`}>
            <div className="text-white">
              <h2 className="font-display font-medium text-3xl sm:text-4xl tracking-tight">{t.formTitle}</h2>
              <p className="mt-4 text-cloud-200/80 max-w-lg">{t.formText}</p>
            </div>
            <div className="w-full max-w-md lg:justify-self-end"><LeadForm lang={L} context="Страница: шоурум (визит)" /></div>
          </div>
        </section>
      </main>
      <Footer lang={L} />
    </div>
  );
}
