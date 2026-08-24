// Единственный источник правды о компании для коммерческих предложений.
//
// В семи фактических КП RaxPro одни и те же факты расходились между документами:
// «ISO g001» вместо 9001 во всех семи, опыт 2/3/4 года, клиентов 150/200/300,
// в шапке узбекских КП чужое юрлицо. Причина одна — факты жили в теле Word-файла
// и правились вручную. Здесь они лежат в одном месте, и генератор не даёт
// вписать их руками: любое расхождение ловит validate.ts.

export const FOUNDED_YEAR = 2022;

/** Опыт считается от года основания, а не пишется руками. */
export function yearsOnMarket(now: Date = new Date()): number {
  return Math.max(1, now.getFullYear() - FOUNDED_YEAR);
}

export const COMPANY = {
  brand: "RAX PRO",
  legalRu: 'ООО «RAPID SALES»',
  legalUz: '"RAPID SALES" MCHJ',
  inn: "311710154",
  phone: "+998 78 555 1 555",
  phoneAlt: "+998 90 986 65 44",
  site: "raxpro.uz",
  addressRu: "г. Ташкент, рядом с рынком Паркент, офис RAX PRO",
  addressUz: "Toshkent shahri, Parkent bozori yonida, RAX PRO ofisi",
  director: { ru: "Касимов Хуршидбек Хасанбаевич", uz: "Qosimov Xurshidbek Xasanbayevich" },
  manager: { ru: "Ганиходжаева Шахзода", uz: "Gʻanixoʻjayeva Shahzoda" },
  clientsCount: 200,
  factory: { name: "SAMAN POUYESH TAMIN CO. (SPOT)", country: { ru: "Иран", uz: "Eron" } },
  /** Номера сертификатов — только отсюда. В КП была опечатка «g001». */
  certificates: ["ISO 9001:2015", "ISO 14001:2015", "ISO 45001:2018"],
  vatRate: 0.12,
  warrantyMonths: 120,
  offerValidDays: 5,
} as const;

export const TERMS = {
  delivery: {
    ru: {
      tashkent: "По городу Ташкенту — доставка и монтаж в течение 24 часов, бесплатно.",
      regions: "В регионы — доставка 1–2 дня.",
    },
    uz: {
      tashkent: "Toshkent shahri boʻylab — 24 soat ichida yetkazib berish va oʻrnatish, bepul.",
      regions: "Viloyatlarga — 1–2 kun ichida yetkazib berish.",
    },
  },
  /** Схемы оплаты — выбор одной. В КП Fathulla на соседних страницах стояли обе сразу. */
  payment: {
    prepay100: {
      ru: "100 % предоплата в течение 5 банковских дней с даты подписания договора.",
      uz: "Shartnoma imzolangan kundan boshlab 5 bank kuni ichida 100 % oldindan toʻlov.",
    },
    split5050: {
      ru: "50 % предоплата, оставшиеся 50 % — после завершения монтажных работ.",
      uz: "50 % oldindan toʻlov, qolgan 50 % — montaj ishlari tugagandan soʻng.",
    },
    installment: {
      ru: "50 % предоплата, оставшиеся 50 % — рассрочкой на 3 месяца.",
      uz: "50 % oldindan toʻlov, qolgan 50 % — 3 oyga boʻlib toʻlash.",
    },
  },
} as const;

/** Что входит в поставку. В фактических КП этого блока не было вовсе:
 *  клиент видел цену, но не видел границу работ — и торговался по сумме,
 *  а не по объёму. Список общий для всех продуктов; отличия — в catalog. */
export const SCOPE = {
  ru: [
    "Замер объекта и проектная расстановка под ваше помещение",
    "Изготовление на заводе-партнёре и таможенное оформление",
    "Доставка до объекта и разгрузка",
    "Монтаж и анкеровка к полу силами наших бригад",
    "Инструктаж персонала по эксплуатации и допустимым нагрузкам",
    "Гарантийный документ на 120 месяцев",
  ],
  uz: [
    "Obyektni oʻlchash va binoingizga moslab loyihalash",
    "Hamkor zavodda ishlab chiqarish va bojxona rasmiylashtiruvi",
    "Obyektgacha yetkazib berish va tushirish",
    "Oʻz brigadalarimiz kuchi bilan montaj va polga ankerlash",
    "Xodimlarni ekspluatatsiya va ruxsat etilgan yuk boʻyicha oʻqitish",
    "120 oylik kafolat hujjati",
  ],
} as const;

export type PaymentKey = keyof typeof TERMS.payment;
export type Lang = "ru" | "uz";
