"use client";
// Форма заявки на странице товара с вариантами: менеджер получает не просто
// «архивный стеллаж», а выбранный вариант — число полок, артикул и цену.
import { useEffect, useState } from "react";
import LeadForm from "./LeadForm";
import { VARIANT_EVENT, levelsFromUrl } from "./ShelfPicker";
import { formatPrice } from "../lib/format";

/**
 * @param {{ lang: "ru"|"uz", initialProduct: string, compact?: boolean,
 *   variants: {levels:number, sku:string, price:number, name:string}[], defaultLevels: number }} props
 */
export default function VariantLeadForm({ lang, initialProduct, compact = false, variants, defaultLevels }) {
  const [levels, setLevels] = useState(defaultLevels);

  useEffect(() => {
    const fromUrl = levelsFromUrl(variants);
    if (fromUrl) setLevels(fromUrl);
    const onPick = (e) => setLevels(e.detail.levels);
    window.addEventListener(VARIANT_EVENT, onPick);
    return () => window.removeEventListener(VARIANT_EVENT, onPick);
  }, [variants]);

  const v = variants.find((x) => x.levels === levels) || variants[0];
  const context = `Выбрано: ${v.name} · ${v.sku} · ${formatPrice(v.price, "ru")}`;
  return <LeadForm lang={lang} compact={compact} initialProduct={initialProduct} context={context} />;
}
