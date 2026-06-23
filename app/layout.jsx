import './globals.css';

export const metadata = {
  title: 'RAXPRO — стеллажи и системы хранения в Ташкенте | гарантия 10 лет',
  description: 'RAXPRO (RAPID SALES) — производство и монтаж стеллажей в Ташкенте: паллетные, среднегрузовые, архивные, торговые. Нагрузка до 3.5т, гарантия 10 лет, бесплатный замёр и расчёт. 1000+ проектов.',
  keywords: 'стеллажи Ташкент, паллетные стеллажи, складские стеллажи, металлические стеллажи под заказ, системы хранения Узбекистан',
  openGraph: { title: 'RAXPRO — стеллажи и системы хранения', description: 'Гарантия 10 лет · нагрузка до 3.5т · 1000+ проектов · бесплатный замёр', type: 'website', locale: 'ru_RU' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
