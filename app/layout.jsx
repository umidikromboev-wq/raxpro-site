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
  title: 'RAXPRO — стеллажи и системы хранения в Ташкенте | гарантия 10 лет',
  description:
    'RAXPRO — производство и монтаж стеллажей в Ташкенте: паллетные, среднегрузовые, архивные, торговые. Нагрузка до 3.5 т, официальная гарантия 10 лет, бесплатный замер и расчёт за 24 часа. 1000+ проектов по Узбекистану.',
  keywords:
    'стеллажи Ташкент, паллетные стеллажи, складские стеллажи, металлические стеллажи под заказ, торговые стеллажи, архивные стеллажи, системы хранения Узбекистан, стеллаж для склада, RAXPRO',
  authors: [{ name: 'RAXPRO' }],
  openGraph: {
    title: 'RAXPRO — стеллажи и системы хранения полного цикла',
    description: 'Замер · проектирование · производство · монтаж. Гарантия 10 лет · нагрузка до 3.5 т · 1000+ проектов.',
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
