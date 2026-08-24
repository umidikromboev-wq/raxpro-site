// Цена КП. Раньше скидку ставили в документе руками: BLOOMSHOP −15 %,
// Lion Print 843 → 800 млн, Sika 35 → 28 млн — без строки о том, за что.
// Здесь скидка обязана иметь причину, а НДС считается, а не вписывается.

import { COMPANY } from "./company";
import type { SpecLine } from "./spec";

export type DiscountReason =
  | "volume"        // объём заказа
  | "prepay"        // 100 % предоплата
  | "deadline"      // подписание до даты
  | "repeat"        // повторный клиент
  | "manual";       // решение директора — требует комментария

export interface PriceInput {
  /** Цена за единицу по каждой позиции спецификации, сум без НДС. */
  unitPrices: Partial<Record<SpecLine["item"], number>>;
  discountPercent?: number;
  discountReason?: DiscountReason;
  discountNote?: string;
  /** Для комплектных продуктов (архивный): цена за комплект × количество. */
  kitPrice?: number;
  kitQty?: number;
}

export interface PriceRow {
  labelRu: string;
  labelUz: string;
  qty: number;
  unitPrice: number;
  sum: number;
}

export interface PriceResult {
  rows: PriceRow[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  totalNoVat: number;
  vat: number;
  totalWithVat: number;
  /** Цена одного паллето-места — единственная величина, сравнимая с конкурентом. */
  perPalletPosition: number | null;
}

export function priceKp(
  spec: SpecLine[],
  input: PriceInput,
  palletPositions?: number
): PriceResult {
  let rows: PriceRow[];
  let subtotal: number;

  if (input.kitPrice != null && input.kitQty != null) {
    subtotal = input.kitPrice * input.kitQty;
    rows = [{
      labelRu: "Комплект стеллажа", labelUz: "Stellaj toʻplami",
      qty: input.kitQty, unitPrice: input.kitPrice, sum: subtotal,
    }];
  } else {
    rows = spec.map((l) => {
      const unitPrice = input.unitPrices[l.item] ?? 0;
      return {
        labelRu: l.labelRu, labelUz: l.labelUz,
        qty: l.qty, unitPrice, sum: unitPrice * l.qty,
      };
    });
    subtotal = rows.reduce((s, r) => s + r.sum, 0);
  }

  const discountPercent = input.discountPercent ?? 0;
  const discountAmount = Math.round(subtotal * discountPercent / 100);
  const totalNoVat = subtotal - discountAmount;
  const vat = Math.round(totalNoVat * COMPANY.vatRate);

  return {
    rows,
    subtotal,
    discountPercent,
    discountAmount,
    totalNoVat,
    vat,
    totalWithVat: totalNoVat + vat,
    perPalletPosition: palletPositions ? Math.round(totalNoVat / palletPositions) : null,
  };
}

export function fmtSum(n: number, lang: "ru" | "uz" = "ru"): string {
  const s = Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return lang === "uz" ? `${s} soʻm` : `${s} сум`;
}

export const DISCOUNT_REASON_TEXT: Record<DiscountReason, { ru: string; uz: string }> = {
  volume:   { ru: "за объём заказа", uz: "buyurtma hajmi uchun" },
  prepay:   { ru: "за 100 % предоплату", uz: "100 % oldindan toʻlov uchun" },
  deadline: { ru: "при подписании договора в указанный срок", uz: "shartnoma koʻrsatilgan muddatda imzolansa" },
  repeat:   { ru: "как постоянному клиенту", uz: "doimiy mijoz sifatida" },
  manual:   { ru: "по решению директора", uz: "direktor qarori bilan" },
};
