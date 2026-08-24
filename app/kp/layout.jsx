import '../globals.css';
import { Manrope, Onest } from 'next/font/google';
import { cookies } from 'next/headers';

const manrope = Manrope({ subsets: ['latin', 'cyrillic'], display: 'swap', variable: '--font-manrope' });
const onest = Onest({ subsets: ['latin', 'cyrillic'], display: 'swap', variable: '--font-unbounded' });
import KpLogin from './KpLogin';

export const metadata = {
  title: 'Генератор КП · RaxPro',
  robots: { index: false, follow: false },
};

export default async function KpLayout({ children }) {
  const jar = await cookies();
  const token = jar.get('kp_auth')?.value;
  const expected = process.env.KP_PASSWORD?.slice(0, 8);
  const authed = Boolean(expected) && token === expected;

  return (
    <html lang="ru" className={`${manrope.variable} ${onest.variable}`}>
      <body className="bg-cloud-50 font-sans text-ink antialiased">
        {authed ? children : <KpLogin configured={Boolean(expected)} />}
      </body>
    </html>
  );
}
