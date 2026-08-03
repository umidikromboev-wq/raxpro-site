// Каталог товаров с точными ценами — основа для Google Shopping.
// Merchant Center сверяет цену в фиде с ценой на странице товара, поэтому
// цена живёт ровно в одном месте: здесь. Никаких «от» и «договорная».
//
// Цены получены от клиента (Xurshidbek Kasimov, 02.08.2026) и обновляются
// по его сообщению — при изменении правим price и переотправляем фид.

export const GOOGLE_CATEGORY_ID = 5833;
export const CURRENCY = "UZS";

export const PRODUCTS = [
  {
    slug: "palletnyy-stellazh-4000x2700x1050",
    sku: "RX-PAL-4027-3",
    price: 7032128,
    directionSlug: "palletnye-stellazhi",
    image: "/products/product1.png",
    gallery: ["/works/pallet.jpg", "/works/w1.jpg"],
    dims: { h: 4000, w: 2700, d: 1050 },
    levels: 3,
    loadKg: 1000,
    ru: {
      name: "Паллетный стеллаж 4000×2700×1050 мм, 3 яруса",
      short: "Паллетный стеллаж, 3 яруса",
      lead: "Фронтальный паллетный стеллаж для склада с погрузочной техникой. Секция высотой 4 метра на три яруса, до 1 тонны груза на ярус.",
      description:
        "Паллетная (фронтальная) стеллажная секция RAXPRO собственного производства. Рама высотой 4000 мм, балки длиной 2700 мм, глубина 1050 мм под европаллету — три яруса хранения с прямым доступом погрузчиком к каждому месту. Металл 1 сорта, оцинковка и порошковая окраска, замковое соединение балок с фиксаторами, защита стоек в базовой комплектации. Гарантия 10 лет по документу.",
      bullets: [
        "Прямой доступ погрузчиком к каждой паллете",
        "Замковое соединение балок с предохранителями от выбивания",
        "Защита стоек от удара техникой в комплекте",
        "Анкеровка к полу и расчёт устойчивости под ваше помещение",
      ],
      specs: [
        { k: "Высота рамы", v: "4000 мм" },
        { k: "Длина балки", v: "2700 мм" },
        { k: "Глубина", v: "1050 мм" },
        { k: "Ярусов", v: "3" },
        { k: "Нагрузка на ярус", v: "до 1000 кг" },
        { k: "Материал", v: "сталь 1 сорта, порошковая окраска" },
        { k: "Гарантия", v: "10 лет по документу" },
      ],
      seoTitle:
        "Паллетный стеллаж 4000×2700×1050 мм, 3 яруса — цена в Ташкенте | RAXPRO",
      seoDesc:
        "Паллетный стеллаж RAXPRO 4000×2700×1050 мм на 3 яруса, до 1000 кг на ярус — 7 032 128 сум. Собственное производство, гарантия 10 лет, доставка по Ташкенту бесплатно.",
    },
    uz: {
      name: "Palletli stellaj 4000×2700×1050 mm, 3 yarus",
      short: "Palletli stellaj, 3 yarus",
      lead: "Pogruzchik ishlaydigan ombor uchun frontal palletli stellaj. Balandligi 4 metr, uch yarus, har yarusga 1 tonnagacha yuk.",
      description:
        "RAXPRO oʻz ishlab chiqarishidagi palletli (frontal) stellaj seksiyasi. Ramka balandligi 4000 mm, balka uzunligi 2700 mm, chuqurligi yevropallet oʻlchamiga mos 1050 mm — uchta saqlash yarusi va har bir joyga pogruzchik bilan toʻgʻridan-toʻgʻri kirish. 1-nav metall, sinklash va kukunli boʻyoq, balkalarning qulfli birikmasi va mahkamlagichlari, bazaviy komplektda tayanch himoyasi. Hujjat asosida 10 yil kafolat.",
      bullets: [
        "Har bir palletga pogruzchik bilan toʻgʻridan-toʻgʻri kirish",
        "Balkalarning qulfli birikmasi va chiqib ketishdan saqlagichlari",
        "Komplektda texnika zarbasidan tayanch himoyasi",
        "Polga ankerlash va binongizga moslab barqarorlik hisobi",
      ],
      specs: [
        { k: "Ramka balandligi", v: "4000 mm" },
        { k: "Balka uzunligi", v: "2700 mm" },
        { k: "Chuqurligi", v: "1050 mm" },
        { k: "Yaruslar soni", v: "3" },
        { k: "Har yarusga yuklama", v: "1000 kg gacha" },
        { k: "Material", v: "1-nav poʻlat, kukunli boʻyoq" },
        { k: "Kafolat", v: "hujjat asosida 10 yil" },
      ],
      seoTitle:
        "Palletli stellaj 4000×2700×1050 mm, 3 yarus — Toshkentda narxi | RAXPRO",
      seoDesc:
        "RAXPRO palletli stellaji 4000×2700×1050 mm, 3 yarus, har yarusga 1000 kg gacha — 7 032 128 soʻm. Oʻz ishlab chiqarishimiz, 10 yil kafolat, Toshkent boʻylab yetkazib berish bepul.",
    },
  },
  {
    slug: "srednegruzovoy-stellazh-2000x2000x600",
    sku: "RX-SRG-2020-4",
    price: 3620000,
    directionSlug: "srednegruzovye-stellazhi",
    image: "/products/product3.jpg",
    gallery: ["/works/medium-1.jpg", "/works/medium-2.jpg"],
    dims: { h: 2000, w: 2000, d: 600 },
    levels: 4,
    loadKg: 400,
    ru: {
      name: "Среднегрузовой стеллаж 2000×2000×600 мм, 4 полки",
      short: "Среднегрузовой стеллаж, 4 полки",
      lead: "Универсальный полочный стеллаж для склада, производства и подсобных помещений. Четыре полки, до 400 кг на полку, ручная комплектация без техники.",
      description:
        "Среднегрузовой полочный стеллаж RAXPRO высотой 2000 мм и длиной 2000 мм, глубина 600 мм. Четыре яруса со сплошным металлическим настилом — удобно для адресного хранения и ручной сборки заказов. Перфорированные стойки позволяют переставлять полки по высоте под ваш товар. Металл 1 сорта, порошковая окраска, гарантия 10 лет по документу.",
      bullets: [
        "До 400 кг равномерной нагрузки на полку",
        "Полки переставляются по высоте с шагом перфорации",
        "Сплошной металлический настил — ничего не проваливается",
        "Быстрый монтаж, секции стыкуются в непрерывный ряд",
      ],
      specs: [
        { k: "Высота", v: "2000 мм" },
        { k: "Длина", v: "2000 мм" },
        { k: "Глубина", v: "600 мм" },
        { k: "Полок", v: "4" },
        { k: "Нагрузка на полку", v: "до 400 кг" },
        { k: "Материал", v: "сталь 1 сорта, порошковая окраска" },
        { k: "Гарантия", v: "10 лет по документу" },
      ],
      seoTitle:
        "Среднегрузовой стеллаж 2000×2000×600 мм, 4 полки — цена в Ташкенте | RAXPRO",
      seoDesc:
        "Среднегрузовой стеллаж RAXPRO 2000×2000×600 мм на 4 полки, до 400 кг на полку — 3 620 000 сум. Собственное производство, гарантия 10 лет, бесплатная доставка по Ташкенту.",
    },
    uz: {
      name: "Oʻrta yuklamali stellaj 2000×2000×600 mm, 4 polka",
      short: "Oʻrta yuklamali stellaj, 4 polka",
      lead: "Ombor, ishlab chiqarish va yordamchi xonalar uchun universal polkali stellaj. Toʻrt polka, har biriga 400 kg gacha, texnikasiz qoʻlda yigʻish.",
      description:
        "RAXPRO oʻrta yuklamali polkali stellaji: balandligi 2000 mm, uzunligi 2000 mm, chuqurligi 600 mm. Toʻliq metall qoplamali toʻrtta yarus — manzilli saqlash va buyurtmalarni qoʻlda yigʻish uchun qulay. Teshikli tayanchlar polkalarni tovaringiz balandligiga moslab qayta joylashtirishga imkon beradi. 1-nav metall, kukunli boʻyoq, hujjat asosida 10 yil kafolat.",
      bullets: [
        "Har polkaga 400 kg gacha bir tekis yuklama",
        "Polkalar teshik qadamiga koʻra balandlik boʻyicha qayta oʻrnatiladi",
        "Toʻliq metall qoplama — hech narsa tushib ketmaydi",
        "Tez montaj, seksiyalar uzluksiz qatorga ulanadi",
      ],
      specs: [
        { k: "Balandligi", v: "2000 mm" },
        { k: "Uzunligi", v: "2000 mm" },
        { k: "Chuqurligi", v: "600 mm" },
        { k: "Polkalar soni", v: "4" },
        { k: "Har polkaga yuklama", v: "400 kg gacha" },
        { k: "Material", v: "1-nav poʻlat, kukunli boʻyoq" },
        { k: "Kafolat", v: "hujjat asosida 10 yil" },
      ],
      seoTitle:
        "Oʻrta yuklamali stellaj 2000×2000×600 mm, 4 polka — Toshkentda narxi | RAXPRO",
      seoDesc:
        "RAXPRO oʻrta yuklamali stellaji 2000×2000×600 mm, 4 polka, har biriga 400 kg gacha — 3 620 000 soʻm. Oʻz ishlab chiqarishimiz, 10 yil kafolat, Toshkent boʻylab bepul yetkazish.",
    },
  },
  {
    slug: "arhivnyy-stellazh-2000x1000x400",
    sku: "RX-ARH-2010-4",
    price: 1200000,
    directionSlug: "arhivnye-stellazhi",
    image: "/products/product2.jpg",
    gallery: ["/works/archive-1.jpg", "/works/archive-2.jpg"],
    dims: { h: 2000, w: 1000, d: 400 },
    levels: 4,
    loadKg: 300,
    ru: {
      name: "Архивный стеллаж 2000×1000×400 мм, 4 полки",
      short: "Архивный стеллаж, 4 полки",
      lead: "Компактный стеллаж для документов, папок и архивных коробов. Четыре полки, ставится вплотную к стене и стыкуется в ряд.",
      description:
        "Архивный стеллаж RAXPRO высотой 2000 мм, длиной 1000 мм и глубиной 400 мм — под стандартные архивные короба и папки-регистраторы. Четыре полки на болтовом соединении, перфорированные стойки для перестановки по высоте. Светлая порошковая окраска не пылит и не пачкает документы. Металл 1 сорта, гарантия 10 лет по документу.",
      bullets: [
        "Глубина 400 мм точно под папку-регистратор",
        "Секции стыкуются в непрерывный архивный ряд",
        "Болтовая сборка — можно разобрать и перевезти",
        "Светлая окраска, не пылит и не оставляет следов на бумаге",
      ],
      specs: [
        { k: "Высота", v: "2000 мм" },
        { k: "Длина", v: "1000 мм" },
        { k: "Глубина", v: "400 мм" },
        { k: "Полок", v: "4" },
        { k: "Нагрузка на полку", v: "до 300 кг" },
        { k: "Материал", v: "сталь 1 сорта, порошковая окраска" },
        { k: "Гарантия", v: "10 лет по документу" },
      ],
      seoTitle:
        "Архивный стеллаж 2000×1000×400 мм, 4 полки — цена в Ташкенте | RAXPRO",
      seoDesc:
        "Архивный стеллаж RAXPRO 2000×1000×400 мм на 4 полки, до 300 кг на полку — 1 200 000 сум. Под архивные короба и папки. Гарантия 10 лет, бесплатная доставка по Ташкенту.",
    },
    uz: {
      name: "Arxiv stellaji 2000×1000×400 mm, 4 polka",
      short: "Arxiv stellaji",
      lead: "Hujjatlar, papkalar va arxiv qutilari uchun ixcham stellaj. Toʻrt polka, devorga tegizib qoʻyiladi va qatorga ulanadi.",
      description:
        "RAXPRO arxiv stellaji: balandligi 2000 mm, uzunligi 1000 mm, chuqurligi 400 mm — standart arxiv qutilari va registrator papkalarga moslangan. Boltli birikmadagi toʻrtta polka, balandlik boʻyicha qayta oʻrnatish uchun teshikli tayanchlar. Ochiq rangli kukunli boʻyoq chang chiqarmaydi va hujjatlarni ifloslantirmaydi. 1-nav metall, hujjat asosida 10 yil kafolat.",
      bullets: [
        "Chuqurligi 400 mm — registrator papkaga aniq mos",
        "Seksiyalar uzluksiz arxiv qatoriga ulanadi",
        "Boltli yigʻish — qismlarga ajratib koʻchirish mumkin",
        "Ochiq rang, chang chiqarmaydi va qogʻozda iz qoldirmaydi",
      ],
      specs: [
        { k: "Balandligi", v: "2000 mm" },
        { k: "Uzunligi", v: "1000 mm" },
        { k: "Chuqurligi", v: "400 mm" },
        { k: "Polkalar soni", v: "4" },
        { k: "Har polkaga yuklama", v: "300 kg gacha" },
        { k: "Material", v: "1-nav poʻlat, kukunli boʻyoq" },
        { k: "Kafolat", v: "hujjat asosida 10 yil" },
      ],
      seoTitle:
        "Arxiv stellaji 2000×1000×400 mm, 4 polka — Toshkentda narxi | RAXPRO",
      seoDesc:
        "RAXPRO arxiv stellaji 2000×1000×400 mm, 4 polka, har biriga 300 kg gacha — 1 200 000 soʻm. Arxiv qutilari va papkalar uchun. 10 yil kafolat, Toshkent boʻylab bepul yetkazish.",
    },
  },
];

export function getProduct(slug) {
  return PRODUCTS.find((p) => p.slug === slug) || null;
}

// «7032128» → «7 032 128». Неразрывные пробелы, чтобы цена не рвалась
// по строкам в карточке.
export function formatPrice(value, lang = "ru") {
  const digits = String(Math.round(value)).replace(
    /\B(?=(\d{3})+(?!\d))/g,
    " ",
  );
  return `${digits} ${lang === "uz" ? "soʻm" : "сум"}`;
}

// Формат для фида Merchant Center: «7032128 UZS».
export function feedPrice(value) {
  return `${Math.round(value)} ${CURRENCY}`;
}
