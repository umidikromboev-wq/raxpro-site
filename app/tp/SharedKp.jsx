'use client';

import { useEffect, useState } from 'react';
import { buildKp } from '@/lib/rack/kp';
import { design, roomWithColumns } from '@/lib/rack/layout';
import { getProduct } from '@/lib/rack/catalog';
import { decodeShare } from '@/lib/rack/share';
import KpPreview from '../kp/KpPreview';

// КП по ссылке. Всё, что нужно для документа, приезжает во фрагменте адреса,
// раскладка пересчитывается тем же ядром — поэтому клиент видит ровно то же,
// что менеджер, и ссылка не протухает вместе с чьей-то базой.

export default function SharedKp() {
  const [state, setState] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const hash = location.hash.replace(/^#/, '');
    if (!hash) {
      setError('Ссылка неполная — похоже, при пересылке потерялась её часть после знака #.');
      return;
    }
    decodeShare(hash)
      .then(setState)
      .catch((e) => setError(`Не удалось прочитать предложение: ${e.message}`));
  }, []);

  if (error) {
    return (
      <main className="grid min-h-screen place-items-center px-6">
        <div className="max-w-md text-center">
          <p className="font-display text-lg">RAX PRO</p>
          <p className="mt-3 text-sm text-slate-600">{error}</p>
          <p className="mt-4 text-sm">
            Напишите нам, и мы пришлём предложение заново:{' '}
            <a className="text-sky-700 underline-offset-2 hover:underline" href="tel:+998785551555">
              +998 78 555 1 555
            </a>
          </p>
        </div>
      </main>
    );
  }

  if (!state) {
    return (
      <main className="grid min-h-screen place-items-center">
        <p className="text-sm text-slate-500">Открываем предложение…</p>
      </main>
    );
  }

  let layout = null;
  if (state.room) {
    try {
      const r = roomWithColumns(state.room);
      layout = { ...design(r), room: r };
    } catch {
      layout = null; // без плана документ всё равно читается
    }
  }

  const product = getProduct(state.productKey);
  const kp = buildKp({
    client: state.client || '—',
    productKey: state.productKey,
    lang: state.lang,
    geometry: state.geometry,
    price: {
      unitPrices: state.unitPrices || {},
      discountPercent: state.discountPercent,
      discountReason: state.discountReason || undefined,
      discountNote: state.discountNote,
      ...(product.pricingModel === 'sectionList'
        ? {
            sectionPrice: product.sizes.find((x) => x.code === state.sizeCode)?.price ?? 0,
            framePrice: state.framePrice,
            sizeCode: state.sizeCode,
          }
        : {}),
    },
    paymentKey: state.paymentKey,
    deliveryHours: state.deliveryHours,
    extraNote: state.extraNote,
    hasComputedPlan: Boolean(layout),
    date: state.date ? new Date(state.date) : undefined,
  });

  return (
    <main className="mx-auto max-w-[210mm] px-4 py-8 print:max-w-none print:p-0">
      <KpPreview kp={kp} layout={layout} planImage={null} renderImage={null} />
      <div className="mt-6 flex justify-center gap-3 print:hidden">
        <button onClick={() => window.print()} className="bg-ink px-4 py-2 text-sm text-white hover:bg-sky-700">
          Распечатать или сохранить в PDF
        </button>
        <a href="tel:+998785551555" className="border border-ink px-4 py-2 text-sm hover:bg-cloud-100">
          Позвонить
        </a>
      </div>
    </main>
  );
}
