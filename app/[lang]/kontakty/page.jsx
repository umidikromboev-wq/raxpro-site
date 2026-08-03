import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import LeadForm from '../../../components/LeadForm';
import { IcoPhone, IcoPin, IcoClock, IcoTg, IcoIg } from '../../../components/Icons';
import { SITE, siteLoc } from '../../../lib/site';
import { SHOP } from '../../../lib/shop';
import { normalizeLang } from '../../../lib/i18n';
import { alternatesFor, href } from '../../../lib/lang';
import { breadcrumbSchema, organizationSchema, JsonLd } from '../../../lib/schema';

const K = {
  ru: {
    title: 'Контакты',
    seoTitle: 'Контакты RAXPRO — стеллажи в Ташкенте: адрес, телефон, часы работы',
    seoDesc:
      'Контакты компании RAXPRO: телефоны, e-mail, адрес офиса и производства в Ташкенте, режим работы, Telegram и WhatsApp. Отвечаем в течение 5 минут в рабочее время.',
    lead: 'Позвоните, напишите в мессенджер или приезжайте — покажем продукцию и посчитаем проект на месте.',
    phones: 'Телефоны',
    email: 'Электронная почта',
    address: 'Адрес',
    hours: 'Режим работы',
    messengers: 'Мессенджеры и соцсети',
    formTitle: 'Написать нам',
    formText: 'Оставьте номер — перезвоним в рабочее время и ответим на вопросы по заказу, доставке или расчёту.',
    mapTitle: 'Мы на карте',
    reviews: 'Канал отзывов',
  },
  uz: {
    title: 'Aloqa',
    seoTitle: 'RAXPRO kontaktlari — Toshkentda stellajlar: manzil, telefon, ish vaqti',
    seoDesc:
      'RAXPRO kompaniyasi kontaktlari: telefonlar, e-mail, Toshkentdagi ofis va ishlab chiqarish manzili, ish vaqti, Telegram va WhatsApp. Ish vaqtida 5 daqiqada javob beramiz.',
    lead: 'Qoʻngʻiroq qiling, messenjerga yozing yoki tashrif buyuring — mahsulotni koʻrsatamiz va loyihani joyida hisoblab beramiz.',
    phones: 'Telefonlar',
    email: 'Elektron pochta',
    address: 'Manzil',
    hours: 'Ish vaqti',
    messengers: 'Messenjerlar va ijtimoiy tarmoqlar',
    formTitle: 'Bizga yozing',
    formText: 'Raqamingizni qoldiring — ish vaqtida qoʻngʻiroq qilamiz va buyurtma, yetkazish yoki hisob-kitob boʻyicha savollarga javob beramiz.',
    mapTitle: 'Xaritada',
    reviews: 'Sharhlar kanali',
  },
};

export async function generateMetadata({ params }) {
  const L = normalizeLang((await params).lang);
  const k = K[L];
  return { title: k.seoTitle, description: k.seoDesc, alternates: alternatesFor('/kontakty', L) };
}

function Card({ icon, title, children }) {
  return (
    <div className="rounded-xl2 border border-cloud-200 bg-white shadow-card p-6">
      <div className="flex items-center gap-2.5 text-sky-600">
        {icon}
        <h2 className="font-semibold text-navy-800">{title}</h2>
      </div>
      <div className="mt-3 space-y-1.5 text-slate-700">{children}</div>
    </div>
  );
}

export default async function ContactsPage({ params }) {
  const L = normalizeLang((await params).lang);
  const k = K[L];
  const t = SHOP[L];
  const loc = siteLoc(L);

  const crumbs = breadcrumbSchema(L, [
    { name: t.home, path: '/' },
    { name: k.title, path: '/kontakty' },
  ]);

  const mapQuery = encodeURIComponent(`${loc.addressCity}, ${loc.address}`);

  return (
    <div className="bg-white text-ink">
      <JsonLd data={crumbs} />
      <JsonLd data={organizationSchema(L)} />
      <Header lang={L} />

      <section className="relative pt-28 pb-14 bg-navy-900 text-white overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-20" />
        <div className="relative w-full px-5 sm:px-8 lg:px-14 2xl:px-24">
          <nav className="text-sm text-cloud-200/60 mb-4">
            <a href={href(L, '/')} className="hover:text-sky-400">
              {t.home}
            </a>
            <span className="mx-1.5">/</span>
            <span className="text-cloud-200">{k.title}</span>
          </nav>
          <h1 className="font-display font-medium text-3xl sm:text-4xl lg:text-5xl tracking-tight">
            {k.title}
          </h1>
          <p className="mt-5 text-lg text-cloud-200/85 max-w-2xl leading-relaxed">{k.lead}</p>
        </div>
      </section>

      <section className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-14">
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <Card icon={<IcoPhone className="w-5 h-5" />} title={k.phones}>
            <a href={`tel:${SITE.phoneMain}`} className="block font-semibold text-navy-800 hover:text-sky-600">
              {SITE.phoneMainHuman}
            </a>
            <a href={`tel:${SITE.phoneAlt}`} className="block hover:text-sky-600">
              {SITE.phoneAltHuman}
            </a>
            <a href={`tel:${SITE.landline}`} className="block hover:text-sky-600">
              {SITE.landlineHuman}
            </a>
          </Card>

          <Card icon={<IcoTg className="w-5 h-5" />} title={k.email}>
            {SITE.emails.map((e) => (
              <a key={e} href={`mailto:${e}`} className="block break-all hover:text-sky-600">
                {e}
              </a>
            ))}
          </Card>

          <Card icon={<IcoPin className="w-5 h-5" />} title={k.address}>
            <p className="font-semibold text-navy-800">{loc.addressCity}</p>
            <p>{loc.address}</p>
            <p className="text-sm text-slate-500">{loc.landmark}</p>
          </Card>

          <Card icon={<IcoClock className="w-5 h-5" />} title={k.hours}>
            <p className="font-semibold text-navy-800">{loc.hours}</p>
            <p className="text-sm text-slate-500">
              {L === 'uz'
                ? 'Yakshanba — dam olish kuni. Messenjerlarda kechroq ham javob beramiz.'
                : 'Воскресенье — выходной. В мессенджерах отвечаем и позже.'}
            </p>
          </Card>
        </div>

        <div className="mt-8 rounded-xl2 border border-cloud-200 bg-cloud-50 p-6">
          <h2 className="font-semibold text-navy-800">{k.messengers}</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={SITE.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-white border border-cloud-200 px-5 py-3 font-semibold text-navy-800 hover:border-sky-400 hover:text-sky-600 transition"
            >
              <IcoTg className="w-5 h-5" /> Telegram
            </a>
            <a
              href={SITE.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-white border border-cloud-200 px-5 py-3 font-semibold text-navy-800 hover:border-sky-400 hover:text-sky-600 transition"
            >
              WhatsApp
            </a>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-white border border-cloud-200 px-5 py-3 font-semibold text-navy-800 hover:border-sky-400 hover:text-sky-600 transition"
            >
              <IcoIg className="w-5 h-5" /> Instagram
            </a>
            <a
              href={SITE.reviewsChannel}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-white border border-cloud-200 px-5 py-3 font-semibold text-navy-800 hover:border-sky-400 hover:text-sky-600 transition"
            >
              ★ {k.reviews}
            </a>
          </div>
        </div>

        <div className="mt-10 grid lg:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="font-display font-medium text-2xl text-navy-800 tracking-tight">
              {k.mapTitle}
            </h2>
            <div className="mt-5 rounded-xl2 overflow-hidden border border-cloud-200 shadow-card">
              <iframe
                title={k.mapTitle}
                src={`https://maps.google.com/maps?q=${mapQuery}&z=16&output=embed`}
                width="100%"
                height="380"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ border: 0 }}
              />
            </div>
          </div>

          <div className="rounded-xl2 border border-cloud-200 bg-white shadow-card p-6">
            <h2 className="font-display font-medium text-2xl text-navy-800 tracking-tight">
              {k.formTitle}
            </h2>
            <p className="mt-3 text-slate-600 leading-relaxed">{k.formText}</p>
            <div className="mt-5">
              <LeadForm compact lang={L} />
            </div>
          </div>
        </div>
      </section>

      <Footer lang={L} />
    </div>
  );
}
