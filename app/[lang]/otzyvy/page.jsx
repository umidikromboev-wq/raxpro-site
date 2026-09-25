import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Reviews from '../../../components/Reviews';
import { IcoArrow, IcoTg } from '../../../components/Icons';
import { REVIEWS, localizeReview } from '../../../lib/reviews';
import { SITE } from '../../../lib/site';
import { SHOP } from '../../../lib/shop';
import { normalizeLang } from '../../../lib/i18n';
import { alternatesFor, href } from '../../../lib/lang';
import { breadcrumbSchema, JsonLd } from '../../../lib/schema';

// Все отзывы клиентов: видеоинтервью + переписки + голосовые. На главной —
// только отобранные (lib/reviews.js FEATURED_IDS), здесь — полный список.

const K = {
  ru: {
    title: 'Отзывы клиентов',
    seoTitle: 'Отзывы клиентов RAXPRO — видео, переписки и голосовые о стеллажах',
    seoDesc:
      'Все отзывы клиентов RAXPRO: видеоинтервью владельцев складов и магазинов, цитаты из переписок и голосовых сообщений. Без купюр — из канала отзывов в Telegram.',
    lead: 'Видеоинтервью, переписки и голосовые — как есть, из нашего канала отзывов. Имена только тех, кто подписался в чате; фотографии переписок не публикуем.',
    kinds: (v, t, a) => `${v} видео · ${t} из переписок · ${a} голосовых`,
    channel: 'Канал отзывов в Telegram',
    ctaTitle: 'Хотите так же?',
    ctaText: 'Приедем на замер, посчитаем и соберём склад со стеллажей в наличии.',
    cta: 'Записаться на замер',
  },
  uz: {
    title: 'Mijozlar sharhlari',
    seoTitle: 'RAXPRO mijozlari sharhlari — stellajlar haqida video, yozishma va ovozli xabarlar',
    seoDesc:
      'RAXPRO mijozlarining barcha sharhlari: ombor va doʻkon egalarining video intervyulari, yozishmalar va ovozli xabarlardan iqtiboslar. Telegram sharhlar kanalidan — toʻliq.',
    lead: 'Video intervyular, yozishmalar va ovozli xabarlar — sharhlar kanalimizdan, oʻzgartirishsiz. Ismlar faqat chatda imzo qoldirganlarniki; yozishma suratlarini chop etmaymiz.',
    kinds: (v, t, a) => `${v} ta video · ${t} ta yozishma · ${a} ta ovozli`,
    channel: 'Telegramdagi sharhlar kanali',
    ctaTitle: 'Sizga ham shunday kerakmi?',
    ctaText: 'Oʻlchovga kelamiz, hisoblaymiz va omboringizni mavjud stellajlar bilan tizimlashtirib beramiz.',
    cta: 'Oʻlchovga yozilish',
  },
};

export async function generateMetadata({ params }) {
  const L = normalizeLang((await params).lang);
  const k = K[L];
  return { title: k.seoTitle, description: k.seoDesc, alternates: alternatesFor('/otzyvy', L) };
}

export default async function ReviewsPage({ params }) {
  const L = normalizeLang((await params).lang);
  const k = K[L];
  const t = SHOP[L];
  const items = REVIEWS.map((r) => localizeReview(r, L));
  const count = (kind) => items.filter((r) => r.kind === kind).length;

  const crumbs = breadcrumbSchema(L, [
    { name: t.home, path: '/' },
    { name: k.title, path: '/otzyvy' },
  ]);

  return (
    <div className="bg-white text-ink">
      <JsonLd data={crumbs} />
      <Header lang={L} />

      <section className="relative pt-28 pb-14 bg-navy-900 text-white overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-20" />
        <div className="relative w-full px-5 sm:px-8 lg:px-14 2xl:px-24">
          <nav className="text-sm text-cloud-200/60 mb-4">
            <a href={href(L, '/')} className="hover:text-sky-400">{t.home}</a>
            <span className="mx-1.5">/</span>
            <span className="text-cloud-200">{k.title}</span>
          </nav>
          <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
            <span className="font-display font-medium text-[88px] sm:text-[120px] leading-none tracking-tight">{items.length}</span>
            <h1 className="font-display font-medium text-3xl sm:text-4xl lg:text-5xl tracking-tight pb-2 sm:pb-4">{k.title}</h1>
          </div>
          <p className="mt-5 text-lg text-cloud-200/85 max-w-2xl leading-relaxed">{k.lead}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-cloud-200/70">
            <span>{k.kinds(count('video'), count('text'), count('voice'))}</span>
            {SITE.reviewsChannel && (
              <a href={SITE.reviewsChannel} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-sky-400 hover:text-white transition">
                <IcoTg className="w-4 h-4" /> {k.channel}
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="bg-cloud-50 border-b border-cloud-200 overflow-hidden">
        <div className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 pb-16 sm:pb-20">
          <Reviews items={items} lang={L} />
        </div>
      </section>

      <section className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-14">
        <div className="rounded-xl2 bg-navy-900 text-white p-8 sm:p-10 flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
          <div className="flex-1">
            <h2 className="font-display font-medium text-2xl sm:text-3xl">{k.ctaTitle}</h2>
            <p className="mt-2 text-cloud-200/80 max-w-xl">{k.ctaText}</p>
          </div>
          <a href={href(L, '/#zayavka')} className="btn-11 inline-flex items-center justify-center gap-2 bg-white text-navy-900 font-semibold px-6 py-3.5 rounded-xl hover:bg-sky-400 hover:text-white transition shrink-0">
            {k.cta} <IcoArrow className="w-4 h-4" />
          </a>
        </div>
      </section>

      <Footer lang={L} />
    </div>
  );
}
