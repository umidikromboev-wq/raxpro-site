import '../globals.css';
import '../kp/doc/document.css';
import { Golos_Text, Source_Serif_4 } from 'next/font/google';

// Страница КП для клиента. Открыта без пароля — ссылку присылает менеджер,
// и она должна открываться в один тап с телефона, без входа и установок.
// Данные лежат во фрагменте адреса, поэтому индексировать тут нечего.
//
// Шрифты те же, что в кабинете: клиент и менеджер обязаны видеть один документ.

const grotesk = Golos_Text({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-grotesk',
});

const serif = Source_Serif_4({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-serif',
});

export const metadata = {
  title: 'Коммерческое предложение · RAX PRO',
  robots: { index: false, follow: false },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f2efe9',
};

export default function TpLayout({ children }) {
  return (
    <html lang="ru" className={`${grotesk.variable} ${serif.variable}`}>
      <body
        className="antialiased"
        style={{
          background: '#f2efe9',
          color: '#14181d',
          margin: 0,
          fontFamily: 'var(--font-grotesk), system-ui, sans-serif',
        }}
      >
        {children}
      </body>
    </html>
  );
}
