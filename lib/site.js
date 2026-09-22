// Central site config — RAXPRO
export const SITE = {
  brand: "RAXPRO",
  phoneMain: "+998550555575",
  phoneMainHuman: "+998 55 055 55 75",
  phoneAlt: "+998909866544",
  phoneAltHuman: "+998 90 986 65 44",
  landline: "+998785551555",
  landlineHuman: "+998 78 555 15 55",
  emails: ["xurshidbekkasimov8@gmail.com", "m.toxirov@internet.ru"],
  instagram: "https://www.instagram.com/raxpro_stellaj/",
  telegram: "https://t.me/raxpro",
  whatsapp: "https://wa.me/998550555575",
  reviewsChannel: "https://t.me/RaxPro_otziv",
  addressCity: "г. Ташкент",
  address: "Мирзо-Улугбекский р-н, ул. Турт Арык, 11/1",
  landmark: "Ориентир: Паркентский, напротив Evos",
  hours: "Пн–Сб · 9:00–18:00",
};

// Uzbek versions of the location strings — SITE stays the RU source.
export const SITE_UZ = {
  addressCity: "Toshkent sh.",
  address: "Mirzo Ulugʻbek tumani, Toʻrt Ariq koʻchasi, 11/1",
  landmark: "Moʻljal: Parkent, Evos roʻparasida",
  hours: "Du–Sha · 9:00–18:00",
};

export function siteLoc(lang) {
  return lang === "uz" ? { ...SITE, ...SITE_UZ } : SITE;
}

export const NAV = [
  { label: "О компании", href: "/#o-kompanii" },
  { label: "Направления", href: "/#napravleniya" },
  { label: "Продукция", href: "/#napravleniya" },
  { label: "Проекты", href: "/#proekty" },
  { label: "Блог", href: "/blog" },
  { label: "Контакты", href: "/#kontakty" },
];

export const CLIENTS = [
  "Uzum",
  "Kapitalbank",
  "Radisson",
  "Wyndham",
  "JAC Motors",
  "Discovery Invest",
  "Julius Meinl",
  "Asaxiy Books",
  "IT Park",
  "Midex",
  "Pepsi",
  "Lay's",
  "Caffelito",
  "Ankara Picnic",
  "Golden Korn",
  "Chust Oshi",
  "Super Pack",
  "Bloom Shop",
  "Ishonch",
  "Chilon",
  "Tuning For Cars",
  "Tala Lux",
  "СтройДом",
  "Kafolat",
];

export const ISO_CERTS = ["ISO 9001:2015", "ISO 14001:2015", "ISO 45001:2018"];

// Под каждым логотипом — мини-кейс в одну строку (что именно сделали), иначе
// Radisson рядом со стеллажами вызывает вопрос «при чём тут отель».
// PLACEHOLDER: объекты и цифры временные (22.09), заменить фактами клиента.
export const CLIENT_LOGOS = [
  { src: "/clients/logo_03.png", alt: "Radisson", note: { ru: "склад хозблока, 180 м²", uz: "xoʻjalik ombori, 180 m²" } },
  { src: "/clients/logo_01.png", alt: "Asaxiy Books", note: { ru: "склад маркетплейса, 1 200 паллетомест", uz: "marketpleys ombori, 1 200 palleta oʻrni" } },
  { src: "/clients/logo_04.png", alt: "Discover Invest", note: { ru: "архив офиса, 60 м²", uz: "ofis arxivi, 60 m²" } },
  { src: "/clients/logo_00.png", alt: "Midex", note: { ru: "логистический склад, 800 паллетомест", uz: "logistika ombori, 800 palleta oʻrni" } },
  { src: "/clients/logo_02.png", alt: "Caffelito", note: { ru: "склад обжарки кофе, 120 м²", uz: "kofe qovurish ombori, 120 m²" } },
  { src: "/clients/logo_06.png", alt: "IT Park", note: { ru: "архив, 40 м²", uz: "arxiv, 40 m²" } },
  { src: "/clients/logo_05.png", alt: "Chilon", note: { ru: "склад производства, 500 паллетомест", uz: "ishlab chiqarish ombori, 500 palleta oʻrni" } },
  { src: "/clients/logo_07.png", alt: "СтройДом", note: { ru: "склад стройматериалов, 350 м²", uz: "qurilish mollari ombori, 350 m²" } },
];
