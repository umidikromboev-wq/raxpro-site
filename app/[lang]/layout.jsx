import "../globals.css";
import { Manrope, Onest } from "next/font/google";
import Script from "next/script";
import FloatingContact from "../../components/FloatingContact";
import SmoothScroll from "../../components/SmoothScroll";
import ScrollProgress from "../../components/ScrollProgress";
import { CartProvider } from "../../components/CartProvider";
import CalcModal from "../../components/CalcModal";
import { organizationSchema, JsonLd } from "../../lib/schema";
import {
  alternatesFor,
  normalizeLang,
  LANGS,
  SITE_ORIGIN,
} from "../../lib/lang";

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
      "Стеллажи в Ташкенте со склада — 150 тонн в наличии, доставка завтра | RaxPro",
    description:
      "RaxPro: импортные металлические стеллажи со склада в Ташкенте — 150 тонн в наличии, привезём завтра. Складские, торговые, паллетные и архивные системы. Замер и проект бесплатно, монтаж по Ташкенту бесплатно, гарантия 10 лет.",
    keywords:
      "стеллажи ташкент, металлические стеллажи, купить стеллаж в ташкенте, стеллаж металлический цена в ташкенте, стеллажи для склада, стеллаж для магазина, заказать стеллаж на заказ, RaxPro",
    ogTitle: "RAXPRO — стеллажи и системы хранения полного цикла",
    ogDescription:
      "150 тонн на складе в Ташкенте — привезём завтра. Замер и проект бесплатно · гарантия 10 лет · 1000+ проектов.",
    ogLocale: "ru_RU",
  },
  uz: {
    title:
      "Toshkentda ombordan stellajlar — 150 tonna mavjud, ertaga yetkazamiz | RaxPro",
    description:
      "RaxPro: Toshkent omboridan import metall stellajlar — 150 tonna mavjud, ertaga yetkazamiz. Ombor, savdo, palletli va arxiv tizimlari. Bepul oʻlchov va loyiha, Toshkent boʻyicha montaj bepul, 10 yil kafolat.",
    keywords:
      "stellaj toshkent, metall stellajlar, stellaj sotib olish toshkent, stellaj narxi toshkent, ombor uchun stellaj, doʻkon uchun stellaj, buyurtma asosida stellaj, RaxPro",
    ogTitle: "RAXPRO — toʻliq sikl stellaj va saqlash tizimlari",
    ogDescription:
      "Toshkent omborida 150 tonna — ertaga yetkazamiz. Oʻlchov va loyiha bepul · 10 yil kafolat · 1000+ loyiha.",
    ogLocale: "uz_UZ",
  },
};

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const L = normalizeLang((await params).lang);
  const m = HOME_META[L] || HOME_META.ru;

  return {
    metadataBase: new URL(SITE_ORIGIN),
    title: m.title,
    description: m.description,
    keywords: m.keywords,
    authors: [{ name: "RAXPRO", url: SITE_ORIGIN }],
    creator: "RAXPRO",
    publisher: "RAXPRO",
    formatDetection: {
      telephone: true,
      address: true,
      email: true,
    },
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
      shortcut: ["/favicon.ico"],
    },
    manifest: "/site.webmanifest",
    openGraph: {
      title: m.ogTitle,
      description: m.ogDescription,
      url: `${SITE_ORIGIN}/${L}`,
      siteName: "RAXPRO",
      locale: m.ogLocale,
      type: "website",
      images: [
        {
          url: `${SITE_ORIGIN}/works/hero.jpg`,
          width: 1200,
          height: 630,
          alt: m.ogTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: m.ogTitle,
      description: m.ogDescription,
      images: [`${SITE_ORIGIN}/works/hero.jpg`],
    },
    alternates: alternatesFor("/", L),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    other: {
      "google-site-verification": "3j10nRub3ShhVaxFP7G4_ant8G7QzhxdrBAIJqabAaw",
    },
  };
}

export const viewport = {
  themeColor: "#00a2eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({ children, params }) {
  const lang = normalizeLang((await params).lang);

  return (
    <html lang={lang} className={`${manrope.variable} ${onest.variable}`}>
      <head>
        {/* Schema.org: один источник на весь сайт — lib/schema.js.
            Раньше здесь лежала вторая копия LocalBusiness со своими часами,
            телефоном, адресом и мёртвой ссылкой t.me/raxproo. */}
        <JsonLd data={organizationSchema(lang)} />

        {/* Google Tag Manager - Head Script */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-W25KKCT7');`}
        </Script>

        {/* Google Analytics GA4 */}
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

        {/* Phone Click Tracker */}
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
        {/* Google Tag Manager (noscript) */}
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
        {/* Корзина общая для всех страниц языка: счётчик в шапке должен
            переживать переходы между каталогом и карточкой товара. */}
        <CartProvider>
          {children}
          {/* Фиксированная панель «Рассчитать / Позвонить» на телефоне убрана (Умид, 22.09) — остаётся только виджет */}
          <FloatingContact />
          {/* Опросник расчёта — поп-ап на весь сайт: любая ссылка на #kalkulyator
              (блок на главной, футер, карточки) открывает одни и те же вопросы. */}
          <CalcModal lang={lang} />
        </CartProvider>
      </body>
    </html>
  );
}
