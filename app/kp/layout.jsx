import '../globals.css';
import './cabinet.css';
import './doc/document.css';
import { Golos_Text, Source_Serif_4 } from 'next/font/google';

// Пара шрифтов кабинета и документа: гротеск + сериф.
//
// Гротеск — Golos Text: кириллица родная (её рисовали для русского, а не
// достраивали к латинице), ровные цифры, читается в таблице спецификации
// на 10 px. Сериф — Source Serif 4: им набраны только лид, цитата основателя
// и подписи под кадрами, поэтому документ звучит редакторски, а не как
// очередная презентация системным шрифтом.
//
// Manrope, Geist и Inter здесь запрещены намеренно: по ним КП узнаётся
// как «сделано по умолчанию». Кириллица у обеих гарнитур проверена запросом
// к fonts.googleapis.com до установки — Bricolage Grotesque, например,
// её не везёт вовсе, и это выясняется уже на боевом.

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
  title: 'Кабинет КП · RAX PRO',
  robots: { index: false, follow: false },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#edeae4',
};

export default function KpLayout({ children }) {
  return (
    <html lang="ru" className={`${grotesk.variable} ${serif.variable}`}>
      <body
        className="antialiased"
        style={{
          background: '#edeae4',
          margin: 0,
          fontFamily: 'var(--font-grotesk), system-ui, sans-serif',
        }}
      >
        {children}
      </body>
    </html>
  );
}
