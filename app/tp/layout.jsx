import '../globals.css';
import { Manrope, Onest } from 'next/font/google';

const manrope = Manrope({ subsets: ['latin', 'cyrillic'], display: 'swap', variable: '--font-manrope' });
const onest = Onest({ subsets: ['latin', 'cyrillic'], display: 'swap', variable: '--font-unbounded' });

// Страница КП для клиента. Открыта без пароля — ссылку присылает менеджер,
// и она должна открываться в один тап с телефона, без входа и установок.
// Данные лежат во фрагменте адреса, поэтому индексировать тут нечего.
export const metadata = {
  title: 'Коммерческое предложение · RAX PRO',
  robots: { index: false, follow: false },
};

export default function TpLayout({ children }) {
  return (
    <html lang="ru" className={`${manrope.variable} ${onest.variable}`}>
      <body className="bg-cloud-50 font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
