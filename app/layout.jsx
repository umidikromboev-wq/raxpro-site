import './globals.css';
import { Manrope, Onest } from 'next/font/google';
import FloatingContact from '../components/FloatingContact';
import SmoothScroll from '../components/SmoothScroll';
import ScrollProgress from '../components/ScrollProgress';

const manrope = Manrope({ subsets: ['latin', 'cyrillic'], variable: '--font-manrope', display: 'swap' });
// Display font: Onest — clean, elegant, lighter weights (thin look, not heavy/bold)
const onest = Onest({ subsets: ['latin', 'cyrillic'], weight: ['300', '400', '500', '600'], variable: '--font-unbounded', display: 'swap' });

export const metadata = {
  metadataBase: new URL('https://raxpro.uz'),
  title: 'Стеллажи в Ташкенте от производителя — Купить металлические стеллажи для склада и магазина | RaxPro',
  description:
    'Завод RaxPro: производство и продажа металлических стеллажей в Ташкенте. Складские, торговые, паллетные и архивные стеллажные системы под ключ. Быстрая доставка, бесплатный замер и расчёт нагрузок по Узбекистану!',
  keywords:
    'стеллажи ташкент, металлические стеллажи, купить стеллаж в ташкенте, стеллаж металлический цена в ташкенте, стеллажи для склада, стеллаж для магазина, заказать стеллаж на заказ, RaxPro',
  authors: [{ name: 'RAXPRO' }],
  openGraph: {
    title: 'RAXPRO — стеллажи и системы хранения полного цикла',
    description: 'Замер · проектирование · производство · монтаж. Гарантия 10 лет · нагрузка до 4 т · 1000+ проектов.',
    type: 'website',
    locale: 'ru_RU',
    siteName: 'RAXPRO',
  },
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
};

export const viewport = { themeColor: '#00a2eb' };

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={`${manrope.variable} ${onest.variable}`}>
      <body>
        <SmoothScroll />
        <ScrollProgress />
        {children}
        <FloatingContact />
      </body>
    </html>
  );
}
