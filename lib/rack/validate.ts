// Приёмка КП перед выпуском. Каждое правило здесь родилось из конкретной
// ошибки в фактических КП RaxPro — рядом с правилом указано, где она была.
// Уровень "block" не даёт выпустить документ, "warn" требует осознанного «да».

import { COMPANY, TERMS, yearsOnMarket } from "./company";
import type { Product } from "./catalog";
import type { Geometry, SpecLine } from "./spec";
import type { PriceResult } from "./pricing";

export type Severity = "block" | "warn";
export interface Issue { severity: Severity; code: string; message: string; }

export interface KpDraft {
  client: string;
  date: Date;
  lang: "ru" | "uz";
  product: Product;
  geometry: Geometry;
  spec: SpecLine[];
  price: PriceResult;
  paymentKey: keyof typeof TERMS.payment;
  deliveryHours: number;
  bodyText: string;          // весь текст документа — для проверки согласованности
  freeText: string;          // только то, что менеджер вписал руками
  discountReason?: string;
  planImage?: string | null; // план объекта
  renderImage?: string | null;
}

const BAD_FACTS: Array<[RegExp, string]> = [
  // «ISO g001:2015» стоит во всех семи фактических КП.
  [/ISO\s*g\s*001/i, "Опечатка в номере сертификата: ISO g001 вместо ISO 9001."],
  // Опыт вписывали руками: 2, 3 и 4 года в документах одного месяца.
  [/(\d+)\s*(лет|года|год|yil(?:lik)?)\s*(опыт|tajriba)/i, "Опыт указан числом в тексте — подставляйте COMPANY/yearsOnMarket()."],
  // Клиентов было 150 / 200 / 300 в разных КП.
  [/(более|dan ortiq)?\s*(\d{3})\s*(компаний|kompaniya)/i, "Число клиентов вписано в текст — берите COMPANY.clientsCount."],
  // У Sika вместо стажа появился «вековой завод».
  [/asrlik|вековой/i, "Формулировка «вековой завод» не подтверждена — уберите."],
];

export function validateKp(d: KpDraft): Issue[] {
  const out: Issue[] = [];
  const add = (severity: Severity, code: string, message: string) => out.push({ severity, code, message });

  if (!d.client.trim() || /^[«"'\s]*[«"'\s]*$/.test(d.client))
    add("block", "client-empty", "Не указан клиент. В КП Rapid Sales в шапке осталось пустое «К: \"    \"».");

  // ——— факты компании
  for (const [re, msg] of BAD_FACTS) if (re.test(d.freeText)) add("block", "fact", msg);
  for (const c of COMPANY.certificates)
    if (!d.bodyText.includes(c)) add("warn", "cert-missing", `В тексте нет сертификата ${c}.`);
  if (d.lang === "uz" && /Rapid Sales/i.test(d.bodyText) && !/RAPID SALES.*MCHJ/i.test(d.bodyText))
    add("warn", "legal-name", "В узбекском КП стоит «Rapid Sales» без формы юрлица — используйте COMPANY.legalUz.");

  // ——— условия оплаты
  // В КП Fathulla на стр. 9 «50 % + 50 %», на стр. 10 «100 % предоплата» — одновременно.
  const mentions = (Object.keys(TERMS.payment) as Array<keyof typeof TERMS.payment>)
    .filter((k) => d.bodyText.includes(TERMS.payment[k][d.lang]));
  if (mentions.length > 1)
    add("block", "payment-conflict", `В документе несколько схем оплаты сразу: ${mentions.join(", ")}. Оставьте одну.`);
  if (mentions.length === 0)
    add("block", "payment-missing", "Условия оплаты не указаны.");

  // ——— спецификация
  const s = d.spec;
  const q = (k: string) => s.find((x) => x.item === k)?.qty ?? 0;
  if (q("beam") && q("lock") && q("lock") !== q("beam") * 2)
    add("block", "lock-ratio", `Замков ${q("lock")} при ${q("beam")} балках — должно быть ${q("beam") * 2}.`);
  if (q("frame") && q("anchor") && ![4, 8].includes(q("anchor") / q("frame")))
    add("block", "anchor-ratio", `Анкеров ${q("anchor")} на ${q("frame")} рам — не 4 и не 8 на раму.`);
  for (const line of s)
    if (!Number.isInteger(line.qty) || line.qty <= 0)
      add("block", "qty", `Позиция «${line.labelRu}»: количество ${line.qty}.`);

  // ——— геометрия против типоразмеров продукта
  const p = d.product;
  if (d.geometry.rows > d.geometry.sections)
    add("block", "geometry", `Рядов ${d.geometry.rows} больше, чем секций ${d.geometry.sections}.`);
  if (d.geometry.levels < 1 || d.geometry.levels > 6)
    add("block", "levels", `Ярусов ${d.geometry.levels} — вне рабочего диапазона 1–6.`);
  // У Lion Print в КП на 843 млн стояла балка «33000×1200» — 33 метра.
  const maxBay = Math.max(...p.bayStepMm);
  if (/(\d{5,})\s*[x×]/.test(d.freeText))
    add("block", "dimension", `В тексте есть размер в пять и более цифр — проверьте: длина балки не бывает больше ${maxBay} мм.`);

  // ——— цена
  if (d.price.totalNoVat <= 0) add("block", "price-zero", "Итоговая сумма нулевая или отрицательная.");
  if (d.price.mode === "components") {
    for (const r of d.price.rows)
      if (r.unitPrice <= 0) add("block", "unit-price", `Нет цены за единицу: «${r.labelRu}».`);
  } else if (!d.price.sectionPrice) {
    add("block", "section-price", "Не выбран типоразмер из прайса — нет цены за секцию.");
  }
  const expectedVat = Math.round(d.price.totalNoVat * COMPANY.vatRate);
  if (Math.abs(d.price.vat - expectedVat) > 1)
    add("block", "vat", `НДС ${d.price.vat} не равен ${Math.round(COMPANY.vatRate * 100)} % от суммы (${expectedVat}).`);
  if (d.price.discountPercent > 0 && !d.discountReason)
    add("block", "discount-reason", `Скидка ${d.price.discountPercent} % без причины. В КП BLOOMSHOP, Lion Print и Sika скидка стояла без обоснования.`);
  if (d.price.discountPercent > 25)
    add("warn", "discount-size", `Скидка ${d.price.discountPercent} % — больше четверти суммы, нужно подтверждение директора.`);
  if (d.price.perPalletPosition == null && p.key.startsWith("pallet"))
    add("warn", "no-position-price", "Не посчитана цена за паллето-место — единственная величина, по которой клиент сравнит вас с конкурентом.");

  // ——— комплектность документа
  if (!d.planImage) add("warn", "no-plan", "Нет плана объекта. В фактических КП план — одна из двух уникальных страниц.");
  if (!d.renderImage) add("warn", "no-render", "Нет рендера расстановки.");
  if (p.priceMode === "project" && d.price.mode === "components" && d.price.rows.every((r) => r.unitPrice === 0))
    add("block", "project-price", `${p.ru.name} считается индивидуально — цены нужно ввести вручную.`);

  // ——— сроки
  if (d.deliveryHours < 12 || d.deliveryHours > 720)
    add("warn", "delivery", `Срок поставки ${d.deliveryHours} ч выглядит ошибочным.`);

  return out;
}

export function canIssue(issues: Issue[]) {
  return !issues.some((i) => i.severity === "block");
}

/** Строка «N лет на рынке» — единственный разрешённый способ её получить. */
export function experienceLine(lang: "ru" | "uz", now = new Date()) {
  const y = yearsOnMarket(now);
  return lang === "uz"
    ? `Biz Oʻzbekiston bozorida ${y} yildan beri faoliyat yuritamiz`
    : `Мы работаем на узбекском рынке ${y} ${y === 1 ? "год" : y < 5 ? "года" : "лет"}`;
}
