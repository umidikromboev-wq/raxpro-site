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
  /** Модель sectionList: цена отдельно стоящей секции по прайсу и цена рамы.
   *  Ряд делит рамы между соседними секциями, поэтому сумма меньше,
   *  чем «секции × прайс». */
  sectionPrice?: number;
  framePrice?: number;
  sizeCode?: string;
}

export interface PriceRow {
  labelRu: string;
  labelUz: string;
  qty: number;
  unitPrice: number;
  sum: number;
}

export interface PriceResult {
  mode: "components" | "sectionList";
  rows: PriceRow[];
  sectionPrice?: number;
  sections?: number;
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

  if (input.sectionPrice != null) {
    const sections = spec.length ? sectionsFromSpec(spec) : 0;
    const rowsCount = rowsFromSpec(spec, sections);
    subtotal = Math.max(
      0,
      sections * input.sectionPrice - (sections - rowsCount) * (input.framePrice ?? 0)
    );
    rows = spec.map((l) => ({
      labelRu: l.labelRu, labelUz: l.labelUz,
      qty: l.qty, unitPrice: 0, sum: 0,
    }));
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
    mode: input.sectionPrice != null ? "sectionList" : "components",
    sectionPrice: input.sectionPrice,
    sections: input.sectionPrice != null ? sectionsFromSpec(spec) : undefined,
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

/** Секции и ряды восстанавливаются из самой спецификации: рамы = секции + ряды,
 *  балки = секции × ярусы × 2 — обе величины уже посчитаны в spec. */
function sectionsFromSpec(spec: SpecLine[]): number {
  const beams = spec.find((l) => l.item === "beam")?.qty ?? 0;
  const m = spec.find((l) => l.item === "beam")?.formula.match(/ярусы (\d+)/);
  const levels = m ? Number(m[1]) : 1;
  return levels ? beams / (levels * 2) : 0;
}
function rowsFromSpec(spec: SpecLine[], sections: number): number {
  const frames = spec.find((l) => l.item === "frame")?.qty ?? 0;
  return Math.max(0, frames - sections);
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
