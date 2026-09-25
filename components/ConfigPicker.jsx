"use client";
// Конфигуратор паллетного и среднегрузового (правки Муродбека 25.09): высота,
// число полок, нагрузка. Цена есть только у базовой сборки из прайса — для
// остальных сочетаний показываем «посчитаем», а выбор уходит менеджеру в заявку
// (событие CONFIG_EVENT подхватывает ConfigLeadForm).
import { useEffect, useState } from "react";
import LeadForm from "./LeadForm";
import { formatPrice } from "../lib/format";

export const CONFIG_EVENT = "raxpro:config";

const T = {
  ru: {
    h: "Высота", levels: "Количество полок", load: "Нагрузка на ярус",
    base: "Цена этой сборки", other: "Цена по вашей сборке",
    otherNote: "Посчитаем и пришлём в течение рабочего дня — оставьте заявку ниже.",
    picked: "Выбрано",
  },
  uz: {
    h: "Balandligi", levels: "Polkalar soni", load: "Har yarusga yuklama",
    base: "Ushbu yigʻmaning narxi", other: "Sizning yigʻmangiz narxi",
    otherNote: "Ish kuni davomida hisoblab yuboramiz — pastda ariza qoldiring.",
    picked: "Tanlandi",
  },
};

const UNIT = {
  h: (v, L) => `${String(v / 1000).replace(".", ",")} ${L === "uz" ? "m" : "м"}`,
  levels: (v) => String(v),
  load: (v, L) => (v >= 1000 ? `${String(v / 1000).replace(".", ",")} ${L === "uz" ? "t" : "т"}` : `${v} ${L === "uz" ? "kg" : "кг"}`),
};

export function describe(config, sel, L = "ru") {
  return config.params.map((k) => `${T[L][k]}: ${UNIT[k](sel[k], L)}`).join(" · ");
}

function isBase(config, sel) {
  return config.params.every((k) => sel[k] === config.base[k]);
}

function Chips({ name, values, value, onChange, L }) {
  return (
    <div>
      <div className="text-sm text-slate-500 mb-2">{T[L][name]}</div>
      <div role="radiogroup" aria-label={T[L][name]} className="flex flex-wrap gap-2">
        {values.map((v) => {
          const isOn = v === value;
          return (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={isOn}
              onClick={() => onChange(v)}
              className={`min-w-[44px] h-11 px-3 rounded-xl border font-semibold tabular-nums transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-500 ${isOn ? "bg-navy-900 border-navy-900 text-white" : "bg-white border-cloud-200 text-navy-800 hover:border-sky-400"}`}
            >
              {UNIT[name](v, L)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** @param {{ config: {params: string[], values: Record<string, number[]>, base: Record<string, number>}, price: number, lang: "ru"|"uz", stockNote?: string }} props */
export default function ConfigPicker({ config, price, lang, stockNote }) {
  const L = lang === "uz" ? "uz" : "ru";
  const [sel, setSel] = useState(config.base);

  const pick = (k, v) => {
    const next = { ...sel, [k]: v };
    setSel(next);
    window.dispatchEvent(new CustomEvent(CONFIG_EVENT, { detail: next }));
  };

  const base = isBase(config, sel);
  return (
    <div className="space-y-4">
      {config.params.map((k) => (
        <Chips key={k} name={k} values={config.values[k]} value={sel[k]} onChange={(v) => pick(k, v)} L={L} />
      ))}
      <div className="pt-2">
        <div className="text-sm text-slate-400">{base ? T[L].base : T[L].other}</div>
        {base ? (
          <>
            <div className="font-display font-medium text-4xl text-navy-800 mt-1">{formatPrice(price, L)}</div>
            {stockNote && <div className="mt-2 text-sm text-slate-500">{stockNote}</div>}
          </>
        ) : (
          <div className="mt-1 text-navy-800 font-medium leading-snug">{T[L].otherNote}</div>
        )}
      </div>
    </div>
  );
}

/** Заявка со страницы товара: менеджер видит выбранную сборку. */
export function ConfigLeadForm({ lang, initialProduct, config, productName }) {
  const [sel, setSel] = useState(config.base);
  useEffect(() => {
    const on = (e) => setSel(e.detail);
    window.addEventListener(CONFIG_EVENT, on);
    return () => window.removeEventListener(CONFIG_EVENT, on);
  }, []);
  const context = `${T.ru.picked}: ${productName} · ${describe(config, sel, "ru")}${isBase(config, sel) ? "" : " · нужен расчёт цены"}`;
  return <LeadForm lang={lang} initialProduct={initialProduct} context={context} />;
}
