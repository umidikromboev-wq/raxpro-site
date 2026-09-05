import HeaderV2 from "../../components/v2/HeaderV2";
import Hero from "../../components/v2/Hero";
import Clients from "../../components/v2/Clients";
import Products from "../../components/v2/Products";
import Builder from "../../components/v2/Builder";
import Objects from "../../components/v2/Objects";
import Fears from "../../components/v2/Fears";
import Process from "../../components/v2/Process";
import Reviews from "../../components/v2/Reviews";
import Contact from "../../components/v2/Contact";
import Faq from "../../components/v2/Faq";
import Footer from "../../components/Footer";
import { alternatesFor, href, absHref, LANGS } from "../../lib/lang";
import { siteLoc } from "../../lib/site";
import { EXTRA, normalizeLang } from "../../lib/i18n";
import { V2 } from "../../lib/v2-copy";
import { organizationSchema, JsonLd } from "../../lib/schema";

// Главная v2 (ветка site-v2). Прежняя версия лежит в research/v1-snapshot/page.v1.jsx.
// Порядок секций — из RESEARCH.md: результат → продукция → 3D-модуль → объекты →
// страхи → процесс → отзывы → заявка → FAQ.

const HOME_META = {
  ru: {
    title: "RAXPRO — стеллажи для склада в Ташкенте. 3D-расчёт за минуту",
    description:
      "Паллетные, полочные, архивные и торговые стеллажи со склада в Ташкенте. Соберите склад в 3D, получите расчёт за 24 часа. Монтаж по Ташкенту бесплатно, гарантия 10 лет.",
  },
  uz: {
    title: "RAXPRO — Toshkentda ombor stellajlari. 3D-hisob bir daqiqada",
    description:
      "Toshkentdagi ombordan pallet, polkali, arxiv va savdo stellajlari. Omboringizni 3D da yigʻing, 24 soatda hisob oling. Toshkent boʻylab montaj bepul, 10 yil kafolat.",
  },
};

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }) {
  const L = normalizeLang((await params).lang);
  const m = HOME_META[L];
  return {
    title: m.title,
    description: m.description,
    alternates: alternatesFor("/", L),
    openGraph: {
      title: m.title,
      description: m.description,
      url: absHref(L, "/"),
      images: [{ url: "/works/hero.jpg", width: 1600, height: 1000 }],
      locale: L === "uz" ? "uz_UZ" : "ru_RU",
      type: "website",
    },
  };
}

export default async function Home({ params }) {
  const L = normalizeLang((await params).lang);
  const t = V2[L];
  const loc = siteLoc(L);
  const x = EXTRA[L];
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: x.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <JsonLd data={organizationSchema(L)} />
      <JsonLd data={faqJsonLd} />
      <HeaderV2 lang={L} />
      <main className="v2">
        <Hero lang={L} t={t} />
        <Clients t={t} />
        <Products lang={L} t={t} />
        <Builder lang={L} t={t} />
        <Objects t={t} />
        <Fears t={t} />
        <Process lang={L} t={t} />
        <Reviews lang={L} t={t} />
        <Contact lang={L} t={t} loc={loc} />
        <Faq t={t} items={x.faq} />
      </main>
      <Footer lang={L} />
    </>
  );
}
