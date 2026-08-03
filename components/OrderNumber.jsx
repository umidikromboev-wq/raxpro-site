'use client';
import { useEffect, useState } from 'react';

// Номер заказа приходит в адресе (?n=RX-...). Читаем его на клиенте,
// чтобы страница осталась статической и не уходила в серверный рендер.
export default function OrderNumber({ label }) {
  const [no, setNo] = useState('');

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get('n');
    if (value && /^RX-\d{6}-\d{4}$/.test(value)) setNo(value);
  }, []);

  if (!no) return null;

  return (
    <div className="mt-6 inline-flex items-baseline gap-3 rounded-xl bg-cloud-50 border border-cloud-200 px-5 py-3">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="font-display font-medium text-lg text-navy-800">{no}</span>
    </div>
  );
}
