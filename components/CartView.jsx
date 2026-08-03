'use client';
import { useState } from 'react';
import { useCart } from './CartProvider';
import { PRODUCTS, formatPrice } from '../lib/products';
import { SHOP } from '../lib/shop';
import { normalizeLang } from '../lib/i18n';
import { href } from '../lib/lang';

const byslug = Object.fromEntries(PRODUCTS.map((p) => [p.slug, p]));

function QtyStepper({ value, onChange, label }) {
  return (
    <div className="inline-flex items-center rounded-xl border border-cloud-200 overflow-hidden" aria-label={label}>
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        className="w-10 h-10 grid place-items-center text-navy-800 hover:bg-cloud-50 disabled:opacity-30"
        disabled={value <= 1}
        aria-label="−"
      >
        −
      </button>
      <span className="w-10 text-center font-semibold text-navy-800">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="w-10 h-10 grid place-items-center text-navy-800 hover:bg-cloud-50"
        aria-label="+"
      >
        +
      </button>
    </div>
  );
}

export default function CartView({ lang = 'ru' }) {
  const L = normalizeLang(lang);
  const t = SHOP[L];
  const { items, setQty, remove, total, clear, ready } = useCart();
  const [form, setForm] = useState({ name: '', phone: '', city: '', comment: '' });
  const [state, setState] = useState({ sending: false, error: '' });

  const rows = items
    .map((i) => ({ ...i, product: byslug[i.slug] }))
    .filter((r) => r.product);

  async function submit(e) {
    e.preventDefault();
    if (form.phone.trim().length < 7) {
      setState({ sending: false, error: t.errPhone });
      return;
    }
    setState({ sending: true, error: '' });
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          lang: L,
          total,
          items: rows.map((r) => ({
            sku: r.product.sku,
            name: r.product[L].name,
            qty: r.qty,
            price: r.price,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error('failed');
      clear();
      window.location.href = `${href(L, '/zakaz-prinyat')}?n=${encodeURIComponent(data.orderNo || '')}`;
    } catch {
      setState({ sending: false, error: t.errSend });
    }
  }

  if (ready && rows.length === 0) {
    return (
      <div className="rounded-xl2 border border-cloud-200 bg-white shadow-card p-10 text-center">
        <h2 className="font-display font-medium text-2xl text-navy-800">{t.cartEmpty}</h2>
        <p className="mt-3 text-slate-600 max-w-md mx-auto">{t.cartEmptyText}</p>
        <a
          href={href(L, '/katalog')}
          className="mt-6 inline-flex items-center gap-2 bg-brand-grad text-white font-semibold px-7 py-3.5 rounded-xl"
        >
          {t.toCatalog}
        </a>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[1.4fr,1fr] gap-8 items-start">
      {/* Позиции */}
      <div className="rounded-xl2 border border-cloud-200 bg-white shadow-card divide-y divide-cloud-200">
        {!ready && <div className="p-8 text-slate-400">…</div>}
        {rows.map((r) => (
          <div key={r.slug} className="p-5 flex flex-col sm:flex-row gap-5">
            <a href={href(L, `/katalog/${r.slug}`)} className="shrink-0">
              <img
                src={r.product.image}
                alt={r.product[L].name}
                width={160}
                height={160}
                loading="lazy"
                className="w-full sm:w-28 h-28 object-contain bg-cloud-50 rounded-xl border border-cloud-200"
              />
            </a>
            <div className="flex-1 min-w-0">
              <a
                href={href(L, `/katalog/${r.slug}`)}
                className="font-semibold text-navy-800 hover:text-sky-600 leading-snug"
              >
                {r.product[L].name}
              </a>
              <div className="text-sm text-slate-400 mt-1">
                {t.sku}: {r.product.sku}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <QtyStepper value={r.qty} onChange={(v) => setQty(r.slug, v)} label={t.qty} />
                <button
                  type="button"
                  onClick={() => remove(r.slug)}
                  className="text-sm text-slate-400 hover:text-red-500 transition"
                >
                  {t.remove}
                </button>
              </div>
            </div>
            <div className="sm:text-right shrink-0">
              <div className="font-display font-medium text-xl text-navy-800 whitespace-nowrap">
                {formatPrice(r.price * r.qty, L)}
              </div>
              {r.qty > 1 && (
                <div className="text-sm text-slate-400 whitespace-nowrap mt-0.5">
                  {formatPrice(r.price, L)} × {r.qty}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Оформление */}
      <form
        onSubmit={submit}
        className="rounded-xl2 border border-cloud-200 bg-white shadow-card p-6 lg:sticky lg:top-28"
      >
        <div className="flex items-baseline justify-between gap-3 pb-5 border-b border-cloud-200">
          <span className="text-slate-500">{t.itemsTotal}</span>
          <span className="font-display font-medium text-2xl text-navy-800 whitespace-nowrap">
            {formatPrice(total, L)}
          </span>
        </div>

        <h2 className="font-display font-medium text-xl text-navy-800 mt-6">{t.checkout}</h2>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed">{t.checkoutNote}</p>

        <div className="mt-5 space-y-3">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder={t.fName}
            autoComplete="name"
            className="w-full rounded-xl border border-cloud-200 px-4 py-3 outline-none focus:border-sky-500"
          />
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder={`${t.fPhone} *`}
            type="tel"
            required
            autoComplete="tel"
            className="w-full rounded-xl border border-cloud-200 px-4 py-3 outline-none focus:border-sky-500"
          />
          <input
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            placeholder={t.fCity}
            className="w-full rounded-xl border border-cloud-200 px-4 py-3 outline-none focus:border-sky-500"
          />
          <textarea
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            placeholder={t.fCommentPh}
            rows={3}
            className="w-full rounded-xl border border-cloud-200 px-4 py-3 outline-none focus:border-sky-500 resize-none"
          />
        </div>

        {state.error && <p className="mt-3 text-sm text-red-600">{state.error}</p>}

        <button
          type="submit"
          disabled={state.sending}
          className="mt-5 w-full bg-brand-grad text-white font-semibold px-6 py-4 rounded-xl disabled:opacity-60"
        >
          {state.sending ? t.sending : t.submit}
        </button>

        <p className="mt-3 text-xs text-slate-400 leading-relaxed">
          {t.agree}{' '}
          <a href={href(L, '/publichnaya-oferta')} className="underline hover:text-sky-600">
            {t.agreeLink}
          </a>
          {t.agreeTail ? ` ${t.agreeTail}` : ''}
        </p>
      </form>
    </div>
  );
}
