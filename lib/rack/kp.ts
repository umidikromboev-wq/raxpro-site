// Сборка коммерческого предложения. Текст документа собирается из констант,
// а не правится в Word: у RaxPro один шаблон дал семь КП, в которых
// разошлись год основания, число клиентов, номер ISO и условия оплаты.

import { COMPANY, TERMS, TIMEZONE, Lang, PaymentKey, yearsOnMarket } from "./company";
import { getProduct, Product } from "./catalog";
import { buildSpec, palletPositions, Geometry, SpecLine } from "./spec";
import { priceKp, PriceInput, PriceResult, fmtSum, DISCOUNT_REASON_TEXT } from "./pricing";
import { validateKp, canIssue, experienceLine, Issue } from "./validate";

export interface KpRequest {
  client: string;
  productKey: string;
  lang: Lang;
  geometry: Geometry;
  price: PriceInput;
  paymentKey: PaymentKey;
  deliveryHours: number;
  city?: string;
  date?: Date;
  planImage?: string | null;
  renderImage?: string | null;
  /** Раскладка посчитана — план рисуется генератором. */
  hasComputedPlan?: boolean;
  /** Только то, что действительно меняется от клиента к клиенту. */
  extraNote?: string;
}

export interface Kp {
  meta: { client: string; date: Date; lang: Lang; city: string; validUntil: Date; deliveryHours: number; number: string };
  product: Product;
  geometry: Geometry;
  spec: SpecLine[];
  positions: number | null;
  price: PriceResult;
  sections: KpSection[];
  bodyText: string;
  discountReason?: string;
  issues: Issue[];
  canIssue: boolean;
}

export interface KpSection { id: string; title: string; body: string[]; }

const T = {
  ru: {
    intro: "Коммерческое предложение",
    to: "Кому", from: "От", date: "Дата",
    greeting: (c: string) => (/[«»"]/.test(c) ? `Уважаемая команда ${c},` : `Уважаемая команда «${c}»,`),
    product: "Описание продукта",
    delivery: "Доставка и монтаж",
    spec: "Спецификация и стоимость",
    terms: "Условия",
    why: "Почему RAX PRO",
    contacts: "Контакты",
    signatures: "Подписи",
    type: "Тип", load: "Нагрузка на ярус", material: "Материал",
    paint: "Покрытие", warranty: "Гарантия",
    materialV: "Холоднокатаная и оцинкованная сталь, технология RollForm",
    paintV: "Порошковая окраска, песочный цвет",
    positions: "Паллето-мест",
    perPosition: "Цена за одно паллето-место",
    subtotal: "Сумма", discount: "Скидка",
    totalNoVat: "Итого без НДС", vat: "НДС 12 %", totalVat: "Итого с НДС",
    deliveryTerm: "Срок поставки", payment: "Условия оплаты",
    warrantyTerm: "Гарантийный срок", validity: "Срок действия предложения",
    months: "месяцев", days: "календарных дней", hours: "часов",
    director: "Директор", manager: "Менеджер по продажам",
  },
  uz: {
    intro: "Tijorat taklifi",
    to: "Kimga", from: "Kimdan", date: "Sana",
    greeting: (c: string) => (/[«»"]/.test(c) ? `Hurmatli ${c} jamoasi,` : `Hurmatli "${c}" jamoasi,`),
    product: "Mahsulot tavsifi",
    delivery: "Yetkazib berish va oʻrnatish",
    spec: "Spetsifikatsiya va narx",
    terms: "Shartlar",
    why: "Nega aynan RAX PRO",
    contacts: "Aloqa",
    signatures: "Imzolar",
    type: "Turi", load: "Har bir yarusga yuk", material: "Material",
    paint: "Qoplama", warranty: "Kafolat",
    materialV: "Sovuq prokat va otsinkovka poʻlat, RollForm texnologiyasi",
    paintV: "Kukunli boʻyoq, qumli rang",
    positions: "Palet oʻrinlari",
    perPosition: "Bitta palet oʻrni narxi",
    subtotal: "Summa", discount: "Chegirma",
    totalNoVat: "Jami QQSsiz", vat: "QQS 12 %", totalVat: "Jami QQS bilan",
    deliveryTerm: "Yetkazib berish muddati", payment: "Toʻlov shartlari",
    warrantyTerm: "Kafolat muddati", validity: "Taklif amal qilish muddati",
    months: "oy", days: "kalendar kun", hours: "soat",
    director: "Direktor", manager: "Sotuvchi menejer",
  },
} as const;

export function buildKp(req: KpRequest): Kp {
  const lang = req.lang;
  const t = T[lang];
  const product = getProduct(req.productKey);
  const date = req.date ?? new Date();
  const city = req.city ?? (lang === "uz" ? "Toshkent" : "Ташкент");
  const validUntil = new Date(date.getTime() + COMPANY.offerValidDays * 864e5);

  const spec = buildSpec(product, req.geometry);
  const positions = product.key.startsWith("pallet") ? palletPositions(req.geometry) : null;
  const price = priceKp(spec, req.price, positions ?? undefined);

  const loadRu = `${product.loadPerLevelKg[0]}–${product.loadPerLevelKg[1]} кг`;
  const y = yearsOnMarket(date);

  const sections: KpSection[] = [
    {
      id: "intro",
      title: t.intro,
      body: [
        `${t.to}: ${req.client}`,
        `${t.from}: ${lang === "uz" ? COMPANY.legalUz : COMPANY.legalRu} (${COMPANY.brand}), ИНН ${COMPANY.inn}`,
        `${t.date}: ${fmtDate(date)}`,
        "",
        t.greeting(req.client),
        lang === "uz"
          ? `${COMPANY.brand} kompaniyasi sizga ${product.uz.name} boʻyicha taklif beradi. ${experienceLine("uz", date)}. Mahsulotlarimiz ${COMPANY.factory.country.uz}da, ${COMPANY.factory.name} zavodida ishlab chiqariladi.`
          : `Компания ${COMPANY.brand} предлагает вам ${product.ru.name.toLowerCase()}. ${experienceLine("ru", date)}. Продукция производится в ${COMPANY.factory.country.ru}е на заводе ${COMPANY.factory.name}.`,
        lang === "uz"
          ? `Bizga ishonch bildirgan kompaniyalar ${COMPANY.clientsCount} dan ortiq. Sertifikatlar: ${COMPANY.certificates.join(", ")}.`
          : `Нам доверили свои проекты более ${COMPANY.clientsCount} компаний. Сертификаты: ${COMPANY.certificates.join(", ")}.`,
      ],
    },
    {
      id: "product",
      title: t.product,
      body: [
        `${t.type}: ${lang === "uz" ? product.uz.name : product.ru.name}`,
        `${t.load}: ${lang === "uz" ? `${product.loadPerLevelKg[0]}–${product.loadPerLevelKg[1]} kg` : loadRu}`,
        `${t.material}: ${t.materialV}`,
        `${t.paint}: ${t.paintV}`,
        `${t.warranty}: ${COMPANY.warrantyMonths} ${t.months}`,
      ],
    },
    {
      id: "delivery",
      title: t.delivery,
      body: [TERMS.delivery[lang].tashkent, TERMS.delivery[lang].regions],
    },
    {
      id: "terms",
      title: t.terms,
      body: [
        `${t.deliveryTerm}: ${req.deliveryHours} ${t.hours}`,
        `${t.payment}: ${TERMS.payment[req.paymentKey][lang]}`,
        `${t.warrantyTerm}: ${COMPANY.warrantyMonths} ${t.months}`,
        `${t.validity}: ${COMPANY.offerValidDays} ${t.days} (${fmtDate(validUntil)})`,
      ],
    },
    {
      id: "contacts",
      title: t.contacts,
      body: [
        lang === "uz" ? COMPANY.addressUz : COMPANY.addressRu,
        `${COMPANY.phone} · ${COMPANY.phoneAlt}`,
        COMPANY.site,
      ],
    },
    {
      id: "next",
      title: lang === "uz" ? "Keyingi qadam" : "Следующий шаг",
      body: [
        lang === "uz"
          ? `Taklifni tasdiqlang — biz obyektga oʻlchovchini yuboramiz va shartnoma loyihasini tayyorlaymiz. Oʻlchov bepul va hech narsaga majbur qilmaydi.`
          : `Подтвердите предложение — мы направим замерщика на объект и подготовим проект договора. Замер бесплатный и ни к чему не обязывает.`,
        lang === "uz"
          ? `${COMPANY.manager.uz}, ${COMPANY.phone}`
          : `${COMPANY.manager.ru}, ${COMPANY.phone}`,
      ],
    },
    {
      id: "signatures",
      title: t.signatures,
      body: [
        `${t.director}: ${COMPANY.director[lang]}`,
        `${t.manager}: ${COMPANY.manager[lang]}`,
      ],
    },
  ];

  if (req.extraNote?.trim()) {
    sections.splice(4, 0, { id: "note", title: lang === "uz" ? "Qoʻshimcha" : "Дополнительно", body: [req.extraNote.trim()] });
  }

  const bodyText = sections.flatMap((s) => [s.title, ...s.body]).join("\n");

  const draft = {
    client: req.client, date, lang, product,
    geometry: req.geometry, spec, price,
    paymentKey: req.paymentKey, deliveryHours: req.deliveryHours,
    bodyText,
    freeText: [req.client, req.extraNote ?? ""].join("\n"),
    discountReason: req.price.discountReason
      ? DISCOUNT_REASON_TEXT[req.price.discountReason][lang] + (req.price.discountNote ? ` — ${req.price.discountNote}` : "")
      : undefined,
    planImage: req.planImage ?? null,
    renderImage: req.renderImage ?? null,
    hasComputedPlan: Boolean(req.hasComputedPlan),
  };
  const issues = validateKp(draft);

  return {
    meta: { client: req.client, date, lang, city, validUntil, deliveryHours: req.deliveryHours, number: kpNumber(req.client, date) },
    product, geometry: req.geometry, spec, positions, price,
    sections, bodyText, discountReason: draft.discountReason, issues, canIssue: canIssue(issues),
  };
}

/** Номер КП. В фактических документах номера не было вовсе — вернуться
 *  к конкретному предложению по переписке было нечем. */
export function kpNumber(client: string, date: Date): string {
  const p = dateParts(date);
  const ymd = `${p.y.slice(2)}${p.m}${p.d}`;
  let h = 0;
  for (const ch of client) h = (h * 31 + ch.charCodeAt(0)) % 997;
  return `KP-${ymd}-${String(h).padStart(3, "0")}`;
}

/** Дата всегда считается по Ташкенту.
 *  Сервер Vercel живёт в UTC, браузер менеджера — в Asia/Tashkent: после
 *  19:00 UTC они расходятся на сутки, и React ронял гидратацию (ошибка 418).
 *  Заодно в документе стоит дата рабочего дня клиента, а не серверная. */
const TZ = TIMEZONE;

export function dateParts(d: Date) {
  const f = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit",
  });
  const [y, m, day] = f.format(d).split("-");
  return { y, m, d: day };
}

export function fmtDate(d: Date) {
  const p = dateParts(d);
  return `${p.d}.${p.m}.${p.y}`;
}

export { fmtSum };
