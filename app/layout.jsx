import "./globals.css";
import { Manrope, Onest } from "next/font/google";
import Script from "next/script";
import FloatingContact from "../components/FloatingContact";
import SmoothScroll from "../components/SmoothScroll";
import ScrollProgress from "../components/ScrollProgress";

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

export const metadata = {
  metadataBase: new URL("https://raxpro.uz"),
  title:
    "Стеллажи в Ташкенте от производителя — Купить металлические стеллажи для склада и магазина | RaxPro",
  description:
    "Завод RaxPro: производство и продажа металлических стеллажей в Ташкенте. Складские, торговые, паллетные и архивные стеллажные системы под ключ. Быстрая доставка, бесплатный замер и расчёт нагрузок по Узбекистану!",
  keywords:
    "стеллажи ташкент, металлические стеллажи, купить стеллаж в ташкенте, стеллаж металлический цена в ташкенте, стеллажи для склада, стеллаж для магазина, заказать стеллаж на заказ, RaxPro",
  authors: [{ name: "RAXPRO" }],
  openGraph: {
    title: "RAXPRO — стеллажи и системы хранения полного цикла",
    description:
      "Замер · проектирование · производство · монтаж. Гарантия 10 лет · нагрузка до 4 т · 1000+ проектов.",
    type: "website",
    locale: "ru_RU",
    siteName: "RAXPRO",
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  other: {
    "google-site-verification": "3j10nRub3ShhVaxFP7G4_ant8G7QzhxdrBAIJqabAaw",
  },
};

export const viewport = { themeColor: "#00a2eb" };

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={`${manrope.variable} ${onest.variable}`}>
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
      </body>
    </html>
  );
}
