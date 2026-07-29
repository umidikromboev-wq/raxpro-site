import "../globals.css";
import { Manrope, Onest } from "next/font/google";
import Script from "next/script";
import FloatingContact from "../../components/FloatingContact";
import SmoothScroll from "../../components/SmoothScroll";
import ScrollProgress from "../../components/ScrollProgress";
import MobileCta from "../../components/MobileCta";
import { alternatesFor, normalizeLang, href, LANGS, SITE_ORIGIN } from "../../lib/lang";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});
const onest = Onest({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-unbounded",
  display: "swap",
});

const HOME_META = {
  ru: {
    title:
      "Стеллажи в Ташкенте от производителя — Купить металлические стеллажи для склада и магазина | RaxPro",
    description:
      "Завод RaxPro: производство и продажа металлических стеллажей в Ташкенте. Складские, торговые, паллетные и архивные стеллажные системы под ключ. Быстрая доставка, бесплатный замер и расчёт нагрузок по Узбекистану!",
    keywords:
      "стеллажи ташкент, металлические стеллажи, купить стеллаж в ташкенте, стеллаж металлический цена в ташкенте, стеллажи для склада, стеллаж для магазина, заказать стеллаж на заказ, RaxPro",
    ogTitle: "RAXPRO — стеллажи и системы хранения полного цикла",
    ogDescription:
      "Замер · проектирование · производство · монтаж. Гарантия 10 лет · нагрузка до 4 т · 1000+ проектов.",
    ogLocale: "ru_RU",
  },
  uz: {
    title:
      "Toshkentda stellajlar ishlab chiqaruvchidan — Ombor va doʻkon uchun metall stellajlar | RaxPro",
    description:
      "RaxPro: Toshkentda metall stellajlar ishlab chiqarish va sotish. Ombor, savdo, palletli va arxiv stellaj tizimlari kalit topshirish shartida. Tez yetkazib berish, bepul oʻlchov va yuklama hisobi — butun Oʻzbekiston boʻylab.",
    keywords:
      "stellaj toshkent, metall stellajlar, stellaj sotib olish toshkent, stellaj narxi toshkent, ombor uchun stellaj, doʻkon uchun stellaj, buyurtma asosida stellaj, RaxPro",
    ogTitle: "RAXPRO — toʻliq sikl stellaj va saqlash tizimlari",
    ogDescription:
      "Oʻlchov · loyihalash · ishlab chiqarish · montaj. 10 yil kafolat · 4 tonnagacha yuklama · 1000+ loyiha.",
    ogLocale: "uz_UZ",
  },
};

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

// Неизвестный языковой префикс — 404, а не «русская страница по адресу /en».
export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const L = normalizeLang((await params).lang);
  const m = HOME_META[L];
  return {
    metadataBase: new URL(SITE_ORIGIN),
    title: m.title,
    description: m.description,
    keywords: m.keywords,
    authors: [{ name: "RAXPRO" }],
    openGraph: {
      title: m.ogTitle,
      description: m.ogDescription,
      type: "website",
      locale: m.ogLocale,
      siteName: "RAXPRO",
    },
    alternates: alternatesFor("/", L),
    robots: { index: true, follow: true },
    other: {
      "google-site-verification": "3j10nRub3ShhVaxFP7G4_ant8G7QzhxdrBAIJqabAaw",
    },
  };
}

export const viewport = { themeColor: "#00a2eb" };

export default async function RootLayout({ children, params }) {
  const lang = normalizeLang((await params).lang);
  return (
    <html lang={lang} className={`${manrope.variable} ${onest.variable}`}>
      <head>
        {/* Google Tag Manager - Head Script */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-W25KKCT7');`}
        </Script>

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XZ0K3N301W"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XZ0K3N301W');
          `}
        </Script>

        <Script id="phone-click-tracker" strategy="afterInteractive">
          {`
            document.addEventListener("click", function(e) {
              const link = e.target.closest('a[href^="tel:"]');
              if (link && typeof gtag === 'function') {
                gtag('event', 'phone_click', {
                  'event_category': 'Contact',
                  'event_label': link.href,
                  'transport_type': 'beacon'
                });
              }
            });
          `}
        </Script>
      </head>
      <body>
        {/* Google Tag Manager (noscript) - Body Element */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-W25KKCT7"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        <SmoothScroll />
        <ScrollProgress />
        {children}
        <FloatingContact />
        <MobileCta lang={lang} calcHref={href(lang, '/') + '#kalkulyator'} />
      </body>
    </html>
  );
}
