'use client';
// Корзина живёт в localStorage: онлайн-оплаты нет, аккаунтов нет,
// поэтому сервер о ней узнаёт только в момент оформления заказа.
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const KEY = 'raxpro_cart_v1';
const CartContext = createContext(null);

function read() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((i) => i && i.slug) : [];
  } catch {
    // Повреждённое хранилище не должно ронять страницу — начинаем с пустой корзины.
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  // До гидратации корзина пуста, иначе разметка сервера и клиента разойдётся.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(read());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      // Переполненное или отключённое хранилище — корзина просто не переживёт перезагрузку.
    }
  }, [items, ready]);

  const api = useMemo(() => {
    const add = (product, qty = 1) =>
      setItems((prev) => {
        const found = prev.find((i) => i.slug === product.slug);
        if (found) {
          return prev.map((i) =>
            i.slug === product.slug ? { ...i, qty: i.qty + qty } : i,
          );
        }
        return [
          ...prev,
          {
            slug: product.slug,
            sku: product.sku,
            price: product.price,
            qty,
          },
        ];
      });

    const setQty = (slug, qty) =>
      setItems((prev) =>
        prev
          .map((i) => (i.slug === slug ? { ...i, qty: Math.max(1, qty) } : i))
          .filter((i) => i.qty > 0),
      );

    const remove = (slug) => setItems((prev) => prev.filter((i) => i.slug !== slug));
    const clear = () => setItems([]);

    const count = items.reduce((n, i) => n + i.qty, 0);
    const total = items.reduce((n, i) => n + i.price * i.qty, 0);

    return { items, add, setQty, remove, clear, count, total, ready };
  }, [items, ready]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used inside <CartProvider>');
  }
  return ctx;
}
