'use client';
import { useCart } from './CartProvider';
import { href } from '../lib/lang';
import { SHOP } from '../lib/shop';
import { normalizeLang } from '../lib/i18n';

// Иконка корзины в шапке. Счётчик появляется только после гидратации —
// до неё серверная и клиентская разметка обязаны совпадать.
export default function CartLink({ lang = 'ru', className = '' }) {
  const L = normalizeLang(lang);
  const { count, ready } = useCart();

  return (
    <a
      href={href(L, '/korzina')}
      aria-label={SHOP[L].cart}
      className={`relative grid place-items-center w-10 h-10 rounded-xl bg-white/12 border border-white/15 text-white hover:bg-sky-500 hover:border-sky-500 transition ${className}`}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.55L21 8H6" />
        <circle cx="10" cy="20" r="1.4" />
        <circle cx="18" cy="20" r="1.4" />
      </svg>
      {ready && count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 grid place-items-center rounded-full bg-sky-400 text-navy-900 text-[11px] font-bold">
          {count}
        </span>
      )}
    </a>
  );
}
