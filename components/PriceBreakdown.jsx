import { SCOPE, TERMS } from "../lib/rack/company";
import { IcoArrow, IcoCheck } from "./Icons";
import { href } from "../lib/lang";

// «Из чего складывается цена» — снимает главный страх покупателя стеллажей:
// «назовут одну цену, а в договоре будет другая». Состав секции — из BOM
// движка lib/rack (рамы, балки, замки, анкеры, защита), условия — из
// lib/rack/company.ts. «Пример из прайса» (7 032 128 сум за секцию) убран
// по замечанию Умида 22.09: одна цифра без контекста пугала, а не объясняла.

const COPY = {
  ru: {
    eyebrow: "Цена",
    title: "Из чего складывается цена",
    text: "Стеллаж — это набор типовых элементов. Их количество считается по помещению, а цена каждого стоит в прайсе, поэтому спецификация и сумма прозрачны до договора.",
    parts: [
      { t: "Рамы", d: "Две на первую секцию ряда, дальше по одной: соседние секции делят раму." },
      { t: "Балки", d: "Две на каждый ярус секции. Длина 2700 мм — 3 паллеты, 3300 мм — 4." },
      { t: "Замки балок", d: "По одному на каждый конец балки — чтобы её не выбило погрузчиком." },
      { t: "Анкеры 120×12 мм", d: "Четыре на раму, крепление к бетонному полу." },
      { t: "Защита стоек", d: "Отбойники на рамы у проходов техники." },
    ],
    scope: "Что входит в цену",
    payment: "Схемы оплаты",
    installment: "Для частных и небольших заказов — рассрочка Uzum Nasiya до 25 млн сум, условия уточняем при заявке.",
    cta: "Посчитать свой склад",
  },
  uz: {
    eyebrow: "Narx",
    title: "Narx nimadan tashkil topadi",
    text: "Stellaj — tipik elementlar toʻplami. Ularning soni xona boʻyicha hisoblanadi, har birining narxi narxnomada turadi, shuning uchun spetsifikatsiya va summa shartnomagacha ochiq.",
    parts: [
      { t: "Ramalar", d: "Qatorning birinchi seksiyasiga ikkita, keyin bittadan: qoʻshni seksiyalar ramani boʻlishadi." },
      { t: "Balkalar", d: "Har bir yarusga ikkitadan. 2700 mm — 3 pallet, 3300 mm — 4 pallet." },
      { t: "Balka qulflari", d: "Har bir balka uchiga bittadan — yuklagich urib chiqarmasligi uchun." },
      { t: "Anker 120×12 mm", d: "Har ramaga toʻrttadan, beton polga mahkamlash." },
      { t: "Ustun himoyasi", d: "Texnika yoʻlaklari yonidagi ramalarga toʻsiqlar." },
    ],
    scope: "Narxga nima kiradi",
    payment: "Toʻlov sxemalari",
    installment: "Jismoniy shaxslar va kichik buyurtmalar uchun — Uzum Nasiya orqali 25 mln soʻmgacha boʻlib toʻlash, shartlarini ariza paytida aniqlaymiz.",
    cta: "Omborimni hisoblash",
  },
};

export default function PriceBreakdown({ lang = "ru" }) {
  const L = lang === "uz" ? "uz" : "ru";
  const c = COPY[L];
  const payments = Object.values(TERMS.payment).map((p) => p[L]);

  return (
    <section className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16 sm:py-20 border-b border-cloud-200" aria-labelledby="price-title">
      <div className="grid lg:grid-cols-[1fr,1fr] gap-12 lg:gap-16 items-start">
        <div>
          <h2 id="price-title" className="font-display font-medium text-3xl sm:text-4xl text-navy-800">{c.title}</h2>
          <p className="mt-4 text-slate-500 max-w-lg leading-relaxed">{c.text}</p>
          <ol className="mt-8 divide-y divide-cloud-200 border-y border-cloud-200">
            {c.parts.map((p) => (
              <li key={p.t} className="py-4 grid sm:grid-cols-[180px,1fr] gap-1 sm:gap-6">
                <span className="font-semibold text-navy-800">{p.t}</span>
                <span className="text-sm text-slate-500 leading-relaxed">{p.d}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-xl2 bg-cloud-50 border border-cloud-200 p-6 sm:p-8">
          <h3 className="font-bold text-navy-800">{c.scope}</h3>
          <ul className="mt-4 space-y-2.5">
            {SCOPE[L].map((s) => (
              <li key={s} className="flex items-start gap-3 text-sm text-slate-600">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-white border border-cloud-200 grid place-items-center text-sky-600 shrink-0"><IcoCheck className="w-3 h-3" /></span>
                {s}
              </li>
            ))}
          </ul>
          <h3 className="font-bold text-navy-800 mt-8">{c.payment}</h3>
          <ul className="mt-3 space-y-2">
            {payments.map((p) => (
              <li key={p} className="text-sm text-slate-600 pl-4 border-l-2 border-sky-500">{p}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-slate-500">{c.installment}</p>
          <a href={href(L, "/konstruktor")} className="mt-7 inline-flex items-center gap-2 bg-navy-800 hover:bg-sky-600 text-white font-semibold px-6 py-3 rounded-xl transition">
            {c.cta} <IcoArrow className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
