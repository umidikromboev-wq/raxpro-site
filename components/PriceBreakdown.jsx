import { IcoArrow, IcoCheck } from "./Icons";
import { href } from "../lib/lang";

// «Из чего складывается цена» — снимает страх «назовут одну цену, а в договоре
// будет другая». Упрощено по замечанию Умида 22.09 («слишком много информации»):
// таблица элементов (рамы, балки, замки, анкеры) и три схемы оплаты убраны,
// осталось три факта — прозрачная спецификация, что включено, как платить.
// Состав из lib/rack/company (SCOPE/TERMS) здесь больше не читается: там
// формулировки для КП, в том числе про завод-партнёр.

const COPY = {
  ru: {
    title: "Из чего складывается цена",
    text: "Стеллаж — набор типовых элементов. Их количество считается по вашему помещению, цена каждого стоит в прайсе — спецификация и сумма видны до договора.",
    included: "В цене уже есть",
    items: ["Замер и проект расстановки", "Доставка и разгрузка", "Монтаж и анкеровка к полу", "Гарантия 10 лет по договору"],
    payTitle: "Оплата",
    pay: "50 % при подписании, 50 % после монтажа.",
    installment: "Для частных и небольших заказов — рассрочка Uzum Nasiya до 25 млн сум.",
    cta: "Посчитать свой склад",
  },
  uz: {
    title: "Narx nimadan tashkil topadi",
    text: "Stellaj — tipik elementlar toʻplami. Ularning soni xonangiz boʻyicha hisoblanadi, har birining narxi narxnomada — spetsifikatsiya va summa shartnomagacha koʻrinadi.",
    included: "Narxga allaqachon kiradi",
    items: ["Oʻlchov va joylashuv loyihasi", "Yetkazib berish va tushirish", "Montaj va polga ankerlash", "Shartnoma boʻyicha 10 yil kafolat"],
    payTitle: "Toʻlov",
    pay: "Imzolashda 50 %, montajdan soʻng 50 %.",
    installment: "Jismoniy shaxslar va kichik buyurtmalar uchun — Uzum Nasiya orqali 25 mln soʻmgacha boʻlib toʻlash.",
    cta: "Omborimni hisoblash",
  },
};

export default function PriceBreakdown({ lang = "ru" }) {
  const L = lang === "uz" ? "uz" : "ru";
  const c = COPY[L];

  return (
    <section className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16 sm:py-20 border-b border-cloud-200" aria-labelledby="price-title">
      <div className="grid lg:grid-cols-[1fr,1fr] gap-10 lg:gap-16 items-start">
        <div>
          <h2 id="price-title" className="font-display font-medium text-3xl sm:text-4xl text-navy-800">{c.title}</h2>
          <p className="mt-4 text-slate-500 max-w-lg leading-relaxed">{c.text}</p>
          <a href={href(L, "/konstruktor")} className="mt-8 inline-flex items-center gap-2 bg-navy-800 hover:bg-sky-600 text-white font-semibold px-6 py-3 rounded-xl transition">
            {c.cta} <IcoArrow className="w-4 h-4" />
          </a>
        </div>

        <div className="rounded-xl2 bg-cloud-50 border border-cloud-200 p-6 sm:p-8 grid sm:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-navy-800">{c.included}</h3>
            <ul className="mt-4 space-y-2.5">
              {c.items.map((s) => (
                <li key={s} className="flex items-start gap-3 text-sm text-slate-600">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-white border border-cloud-200 grid place-items-center text-sky-600 shrink-0"><IcoCheck className="w-3 h-3" /></span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="sm:border-l sm:border-cloud-200 sm:pl-8">
            <h3 className="font-bold text-navy-800">{c.payTitle}</h3>
            <div className="mt-3 font-display font-medium text-4xl text-navy-900 tracking-tight">50 / 50</div>
            <p className="mt-2 text-sm text-slate-600">{c.pay}</p>
            <p className="mt-3 text-sm text-slate-500">{c.installment}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
