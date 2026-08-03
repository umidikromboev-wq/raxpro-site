'use client';
import { useEffect, useState } from 'react';
import { useCart } from './CartProvider';
import { SHOP } from '../lib/shop';
import { normalizeLang } from '../lib/i18n';

// Кнопка «В корзину». Отдельный клиентский островок — страница товара
// остаётся серверной и статической, чтобы цену видел и поисковик, и Merchant.
export default function AddToCart({ product, lang = 'ru', qty = 1, className = '', variant = 'solid' }) {
  const L = normalizeLang(lang);
  const t = SHOP[L];
  const { add } = useCart();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!done) return undefined;
    const id = setTimeout(() => setDone(false), 2000);
    return () => clearTimeout(id);
  }, [done]);

  const base =
    variant === 'outline'
      ? 'border border-navy-900/15 text-navy-800 hover:border-sky-500 hover:text-sky-600 bg-white'
      : 'bg-brand-grad text-white hover:opacity-95';

  return (
    <button
      type="button"
      onClick={() => {
        add({ slug: product.slug, sku: product.sku, price: product.price }, qty);
        setDone(true);
      }}
      aria-live="polite"
      className={`inline-flex items-center justify-center gap-2 font-semibold rounded-xl px-6 py-3.5 transition ${base} ${className}`}
    >
      {done ? t.added : t.addToCart}
    </button>
  );
}
