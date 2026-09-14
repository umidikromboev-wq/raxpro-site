'use client';

import { buildKp } from '@/lib/rack/kp';
import { getProduct } from '@/lib/rack/catalog';
import { design, roomWithColumns } from '@/lib/rack/layout';

// Одна сборка документа из сохранённого состояния формы.
//
// Раньше она была написана трижды: в кабинете, на странице клиента и в режиме
// печати. Числа расходились — клиент по ссылке видел 60 секций там, где
// менеджер видел 58. Теперь ветка одна, и разойтись нечему.

export function layoutFromState(state) {
  if (!state?.room || !state?.hasLayout) return null;
  try {
    const room = state.room.polygon ? state.room : roomWithColumns(state.room);
    return { ...design(room), room };
  } catch {
    // Без плана документ всё равно читается — сумма и спецификация не зависят
    // от того, удалось ли пересчитать расстановку.
    return null;
  }
}

export function kpFromState(state, layout) {
  const product = getProduct(state.productKey);
  return buildKp({
    client: state.client || '—',
    productKey: state.productKey,
    lang: state.lang === 'uz' ? 'uz' : 'ru',
    geometry: state.geometry,
    price: {
      unitPrices: state.unitPrices || {},
      discountPercent: Number(state.discountPercent) || 0,
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
    deliveryHours: Number(state.deliveryHours) || 0,
    extraNote: state.extraNote,
    planImage: state.planImage ?? null,
    renderImage: state.renderImage ?? null,
    hasComputedPlan: Boolean(layout) || Boolean(state.planImage),
    date: state.date ? new Date(state.date) : undefined,
  });
}
