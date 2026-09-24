// Каталог товаров — основа для Google Shopping.
// Merchant Center сверяет цену в фиде с ценой на странице товара, поэтому
// цена живёт ровно в одном месте: здесь. Никаких «от» и «договорная» у позиций
// с ценой; позиции «по проекту» (price: null) в фид и корзину не попадают.
//
// Цены получены от клиента (Xurshidbek Kasimov, 02.08.2026) и обновляются
// по его сообщению — при изменении правим price и переотправляем фид.

export const GOOGLE_CATEGORY_ID = 5833;
export const CURRENCY = "UZS";

// Фото карточек — три кадра на продукт в одном стиле (общий план / крупнее / деталь), 4:3, 1168×880.
export const PRODUCTS = [
  {
    slug: "palletnyy-stellazh-4000x2700x1050",
    sku: "RX-PAL-4027-3",
    price: 7032128,
    directionSlug: "palletnye-stellazhi",
    image: "/products/gen/pallet-1.jpg",
    gallery: ["/products/gen/pallet-2.jpg", "/products/gen/pallet-3.jpg"],
    dims: { h: 4000, w: 2700, d: 1050 },
    levels: 3,
    loadKg: 1000,
    ru: {
      name: "Паллетный стеллаж 4000×2700×1050 мм, 3 яруса",
      short: "Паллетный стеллаж, 3 яруса",
      lead: "Фронтальный паллетный стеллаж для склада с погрузочной техникой. Секция высотой 4 метра на три яруса, до 1 тонны груза на ярус.",
      description:
        "Паллетная (фронтальная) стеллажная секция RAXPRO со склада в Ташкенте. Рама высотой 4000 мм, балки длиной 2700 мм, глубина 1050 мм под европаллету — три яруса хранения с прямым доступом погрузчиком к каждому месту. Металл 1 сорта, оцинковка и порошковая окраска, замковое соединение балок с фиксаторами, защита стоек в базовой комплектации. Гарантия 10 лет по договору.",
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
        { k: "Гарантия", v: "10 лет по договору" },
      ],
      seoTitle:
        "Паллетный стеллаж 4000×2700×1050 мм, 3 яруса — цена в Ташкенте | RAXPRO",
      seoDesc:
        "Паллетный стеллаж RAXPRO 4000×2700×1050 мм на 3 яруса, до 1000 кг на ярус — 7 032 128 сум. Всё в наличии на складе, гарантия 10 лет, доставка по Ташкенту бесплатно.",
    },
    uz: {
      name: "Palletli stellaj 4000×2700×1050 mm, 3 yarus",
      short: "Palletli stellaj, 3 yarus",
      lead: "Pogruzchik ishlaydigan ombor uchun frontal palletli stellaj. Balandligi 4 metr, uch yarus, har yarusga 1 tonnagacha yuk.",
      description:
        "RAXPRO Toshkentdagi omboridan palletli (frontal) stellaj seksiyasi. Ramka balandligi 4000 mm, balka uzunligi 2700 mm, chuqurligi yevropallet oʻlchamiga mos 1050 mm — uchta saqlash yarusi va har bir joyga pogruzchik bilan toʻgʻridan-toʻgʻri kirish. 1-nav metall, sinklash va kukunli boʻyoq, balkalarning qulfli birikmasi va mahkamlagichlari, bazaviy komplektda tayanch himoyasi. Shartnoma boʻyicha 10 yil kafolat.",
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
        { k: "Kafolat", v: "shartnoma boʻyicha 10 yil" },
      ],
      seoTitle:
        "Palletli stellaj 4000×2700×1050 mm, 3 yarus — Toshkentda narxi | RAXPRO",
      seoDesc:
        "RAXPRO palletli stellaji 4000×2700×1050 mm, 3 yarus, har yarusga 1000 kg gacha — 7 032 128 soʻm. Omborda doim mavjud, 10 yil kafolat, Toshkent boʻylab yetkazib berish bepul.",
    },
  },
  {
    slug: "srednegruzovoy-stellazh-2000x2000x600",
    sku: "RX-SRG-2020-4",
    price: 3620000,
    directionSlug: "srednegruzovye-stellazhi",
    image: "/products/gen/medium-1.jpg",
    gallery: ["/products/gen/medium-2.jpg", "/products/gen/medium-3.jpg"],
    dims: { h: 2000, w: 2000, d: 600 },
    levels: 4,
    loadKg: 400,
    ru: {
      name: "Среднегрузовой стеллаж 2000×2000×600 мм, 4 полки",
      short: "Среднегрузовой стеллаж, 4 полки",
      lead: "Универсальный полочный стеллаж для склада, производства и подсобных помещений. Четыре полки, до 400 кг на полку, ручная комплектация без техники.",
      description:
        "Среднегрузовой полочный стеллаж RAXPRO высотой 2000 мм и длиной 2000 мм, глубина 600 мм. Четыре яруса со сплошным металлическим настилом — удобно для адресного хранения и ручной сборки заказов. Перфорированные стойки позволяют переставлять полки по высоте под ваш товар. Металл 1 сорта, порошковая окраска, гарантия 10 лет по договору.",
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
        { k: "Гарантия", v: "10 лет по договору" },
      ],
      seoTitle:
        "Среднегрузовой стеллаж 2000×2000×600 мм, 4 полки — цена в Ташкенте | RAXPRO",
      seoDesc:
        "Среднегрузовой стеллаж RAXPRO 2000×2000×600 мм на 4 полки, до 400 кг на полку — 3 620 000 сум. Всё в наличии на складе, гарантия 10 лет, бесплатная доставка по Ташкенту.",
    },
    uz: {
      name: "Oʻrta yuklamali stellaj 2000×2000×600 mm, 4 polka",
      short: "Oʻrta yuklamali stellaj, 4 polka",
      lead: "Ombor, ishlab chiqarish va yordamchi xonalar uchun universal polkali stellaj. Toʻrt polka, har biriga 400 kg gacha, texnikasiz qoʻlda yigʻish.",
      description:
        "RAXPRO oʻrta yuklamali polkali stellaji: balandligi 2000 mm, uzunligi 2000 mm, chuqurligi 600 mm. Toʻliq metall qoplamali toʻrtta yarus — manzilli saqlash va buyurtmalarni qoʻlda yigʻish uchun qulay. Teshikli tayanchlar polkalarni tovaringiz balandligiga moslab qayta joylashtirishga imkon beradi. 1-nav metall, kukunli boʻyoq, shartnoma boʻyicha 10 yil kafolat.",
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
        { k: "Kafolat", v: "shartnoma boʻyicha 10 yil" },
      ],
      seoTitle:
        "Oʻrta yuklamali stellaj 2000×2000×600 mm, 4 polka — Toshkentda narxi | RAXPRO",
      seoDesc:
        "RAXPRO oʻrta yuklamali stellaji 2000×2000×600 mm, 4 polka, har biriga 400 kg gacha — 3 620 000 soʻm. Omborda doim mavjud, 10 yil kafolat, Toshkent boʻylab bepul yetkazish.",
    },
  },
  {
    slug: "arhivnyy-stellazh-2000x1000x400",
    sku: "RX-ARH-2010-4",
    price: 1200000,
    directionSlug: "arhivnye-stellazhi",
    image: "/products/gen/archive-1.jpg",
    gallery: ["/products/gen/archive-2.jpg", "/products/gen/archive-3.jpg"],
    dims: { h: 2000, w: 1000, d: 400 },
    levels: 4,
    loadKg: 300,
    // Число полок выбирает покупатель (ТЗ 24.09). Прайс 22.08, msg 91 —
    // сверено с lib/rack/catalog.ts (AR-2000-1000-400-3…6). Каждый вариант —
    // отдельная позиция фида с общим item_group_id; «4 полки» сохраняет старый SKU.
    variants: [
      { levels: 3, sku: "RX-ARH-2010-3", price: 1000000 },
      { levels: 4, sku: "RX-ARH-2010-4", price: 1200000 },
      { levels: 5, sku: "RX-ARH-2010-5", price: 1400000 },
      { levels: 6, sku: "RX-ARH-2010-6", price: 1600000 },
    ],
    ru: {
      name: "Архивный стеллаж 2000×1000×400 мм, 3–6 полок",
      nameBase: "Архивный стеллаж 2000×1000×400 мм",
      short: "Архивный стеллаж",
      lead: "Компактный стеллаж для документов, папок и архивных коробов. От трёх до шести полок — выберите нужное число, цена пересчитается сразу. Ставится вплотную к стене и стыкуется в ряд.",
      description:
        "Архивный стеллаж RAXPRO высотой 2000 мм, длиной 1000 мм и глубиной 400 мм — под стандартные архивные короба и папки-регистраторы. От трёх до шести полок на болтовом соединении, перфорированные стойки для перестановки по высоте. Светлая порошковая окраска не пылит и не пачкает документы. Металл 1 сорта, гарантия 10 лет по договору.",
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
        { k: "Полок", v: "3–6 на выбор", levels: true },
        { k: "Нагрузка на полку", v: "до 300 кг" },
        { k: "Материал", v: "сталь 1 сорта, порошковая окраска" },
        { k: "Гарантия", v: "10 лет по договору" },
      ],
      seoTitle:
        "Архивный стеллаж 2000×1000×400 мм, 3–6 полок — цена от 1 000 000 сум | RAXPRO",
      seoDesc:
        "Архивный стеллаж RAXPRO 2000×1000×400 мм: 3 полки — 1 000 000 сум, 4 — 1 200 000, 5 — 1 400 000, 6 — 1 600 000. До 300 кг на полку. Под архивные короба и папки. Гарантия 10 лет, бесплатная доставка по Ташкенту.",
    },
    uz: {
      name: "Arxiv stellaji 2000×1000×400 mm, 3–6 polka",
      nameBase: "Arxiv stellaji 2000×1000×400 mm",
      short: "Arxiv stellaji",
      lead: "Hujjatlar, papkalar va arxiv qutilari uchun ixcham stellaj. Uchtadan oltitagacha polka — kerakli sonini tanlang, narx darhol qayta hisoblanadi. Devorga tegizib qoʻyiladi va qatorga ulanadi.",
      description:
        "RAXPRO arxiv stellaji: balandligi 2000 mm, uzunligi 1000 mm, chuqurligi 400 mm — standart arxiv qutilari va registrator papkalarga moslangan. Boltli birikmadagi uchtadan oltitagacha polka, balandlik boʻyicha qayta oʻrnatish uchun teshikli tayanchlar. Ochiq rangli kukunli boʻyoq chang chiqarmaydi va hujjatlarni ifloslantirmaydi. 1-nav metall, shartnoma boʻyicha 10 yil kafolat.",
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
        { k: "Polkalar soni", v: "3–6, tanlov boʻyicha", levels: true },
        { k: "Har polkaga yuklama", v: "300 kg gacha" },
        { k: "Material", v: "1-nav poʻlat, kukunli boʻyoq" },
        { k: "Kafolat", v: "shartnoma boʻyicha 10 yil" },
      ],
      seoTitle:
        "Arxiv stellaji 2000×1000×400 mm, 3–6 polka — narxi 1 000 000 soʻmdan | RAXPRO",
      seoDesc:
        "RAXPRO arxiv stellaji 2000×1000×400 mm: 3 polka — 1 000 000 soʻm, 4 — 1 200 000, 5 — 1 400 000, 6 — 1 600 000. Har polkaga 300 kg gacha. Arxiv qutilari va papkalar uchun. 10 yil kafolat, Toshkent boʻylab bepul yetkazish.",
    },
  },
  // Позиции «по проекту»: цены нет, в фид Merchant Center не попадают
  // (PRICED_PRODUCTS), в корзину не кладутся. Размеры и нагрузки — из lib/rack/catalog.ts.
  {
    slug: "nabivnoy-stellazh-drive-in",
    sku: "RX-DRV-PROJECT",
    price: null,
    priceMode: "project",
    konType: "pallet",
    directionSlug: "nabivnye-stellazhi",
    image: "/products/gen/drivein-1.jpg",
    gallery: ["/products/gen/drivein-2.jpg", "/products/gen/drivein-3.jpg"],
    dims: { h: 4000, w: 1200, d: 2700 },
    levels: 3,
    loadKg: 1500,
    ru: {
      name: "Паллетный стеллаж набивной (drive-in)",
      short: "Набивной стеллаж drive-in",
      lead: "Въездной стеллаж для однотипного товара большими партиями: погрузчик заезжает внутрь канала и ставит паллеты вглубь. Каждый набивной стеллаж проектируется и считается индивидуально.",
      description:
        "Набивная (drive-in) стеллажная система RAXPRO со склада в Ташкенте. Стойки через каждые 1200 мм — по ширине паллеты, паллеты опираются на боковые направляющие, глубина канала кратна 2700 мм. Хранение по принципу LIFO: последний пришёл — первый ушёл. Металл 1 сорта, оцинковка и порошковая окраска, защита стоек и направляющие для заезда погрузчика. Гарантия 10 лет по договору.",
      bullets: [
        "Плотность хранения выше фронтальных стеллажей примерно на 60%",
        "Максимум паллет на минимальной площади склада",
        "Направляющие для безопасного заезда погрузчика",
        "Оптимальны для холодильных и морозильных камер",
      ],
      specs: [
        { k: "Высота рамы", v: "от 4000 мм" },
        { k: "Шаг стоек", v: "1200 мм" },
        { k: "Глубина канала", v: "2700 мм и кратно, до 8 паллет" },
        { k: "Ярусов", v: "от 3" },
        { k: "Нагрузка на паллету", v: "до 1500 кг" },
        { k: "Материал", v: "сталь 1 сорта, порошковая окраска" },
        { k: "Гарантия", v: "10 лет по договору" },
      ],
      seoTitle: "Набивной стеллаж drive-in — проект и расчёт в Ташкенте | RAXPRO",
      seoDesc:
        "Набивные (drive-in) паллетные стеллажи RAXPRO: до 1500 кг на паллету, глубина канала до 8 паллет, плотность хранения выше на 60%. Проект и расчёт под ваш склад в день замера, гарантия 10 лет.",
    },
    uz: {
      name: "Zich paletli stellaj (drive-in)",
      short: "Zich stellaj drive-in",
      lead: "Katta partiyalarda saqlanadigan bir xil tovar uchun kiriladigan stellaj: pogruzchik kanal ichiga kirib palletlarni ichkariga joylaydi. Har bir zich stellaj alohida loyihalanadi va hisoblanadi.",
      description:
        "RAXPRO Toshkentdagi omboridan zich (drive-in) stellaj tizimi. Tayanchlar har 1200 mm da — pallet kengligi boʻyicha, palletlar yon yoʻnaltiruvchilarga tayanadi, kanal chuqurligi 2700 mm ga karrali. LIFO tamoyili: oxirgi kirgan — birinchi chiqadi. 1-nav metall, sinklash va kukunli boʻyoq, tayanch himoyasi va pogruzchik kirishi uchun yoʻnaltiruvchilar. Shartnoma boʻyicha 10 yil kafolat.",
      bullets: [
        "Saqlash zichligi frontal stellajlarga nisbatan taxminan 60% yuqori",
        "Eng kichik maydonda maksimal pallet soni",
        "Pogruzchik xavfsiz kirishi uchun yoʻnaltiruvchilar",
        "Sovutish va muzlatish kameralari uchun ideal",
      ],
      specs: [
        { k: "Ramka balandligi", v: "4000 mm dan" },
        { k: "Tayanchlar qadami", v: "1200 mm" },
        { k: "Kanal chuqurligi", v: "2700 mm va karrali, 8 palletgacha" },
        { k: "Yaruslar soni", v: "3 dan" },
        { k: "Har palletga yuklama", v: "1500 kg gacha" },
        { k: "Material", v: "1-nav poʻlat, kukunli boʻyoq" },
        { k: "Kafolat", v: "shartnoma boʻyicha 10 yil" },
      ],
      seoTitle: "Zich stellaj drive-in — Toshkentda loyiha va hisob | RAXPRO",
      seoDesc:
        "RAXPRO zich (drive-in) paletli stellajlari: har palletga 1500 kg gacha, kanal chuqurligi 8 palletgacha, saqlash zichligi 60% yuqori. Omboringiz uchun oʻlchov kuni loyiha va hisob, 10 yil kafolat.",
    },
  },
  {
    slug: "torgovyy-stellazh",
    sku: "RX-TRG-PROJECT",
    price: null,
    priceMode: "project",
    konType: "retail",
    directionSlug: "torgovye-stellazhi",
    image: "/products/gen/retail-1.jpg",
    gallery: ["/products/gen/retail-2.jpg", "/products/gen/retail-3.jpg"],
    dims: { h: 2000, w: 900, d: 500 },
    levels: 5,
    loadKg: 150,
    ru: {
      name: "Торговый стеллаж",
      short: "Торговый стеллаж",
      lead: "Пристенные и островные стеллажи для магазинов, маркетов и шоурумов — презентабельный вид и удобная выкладка. Считаем по планировке зала: ряды, проходы, кассовая и овощная зоны.",
      description:
        "Торговые стеллажи RAXPRO со склада в Ташкенте для торговых залов. Пристенный ряд и островные двусторонние секции под ваш ассортимент, типовые секции 2000×900×500 и 2200×1200×600 мм с 5–6 полками, проход 1200 мм. Металл 1 сорта, порошковая окраска, регулируемые полки. Планировка и цена — по замеру зала. Гарантия 10 лет по договору.",
      bullets: [
        "Аккуратный презентабельный внешний вид",
        "Удобная выкладка и доступ к товару",
        "Любые размеры под планировку зала",
        "Прочный металл 1 сорта — надолго",
      ],
      specs: [
        { k: "Тип", v: "пристенные / островные" },
        { k: "Типовые секции", v: "2000×900×500, 2200×1200×600 мм" },
        { k: "Полок", v: "5–6" },
        { k: "Нагрузка на полку", v: "до 150 кг" },
        { k: "Глубина", v: "400 / 500 / 600 мм" },
        { k: "Материал", v: "сталь 1 сорта, порошковая окраска" },
        { k: "Гарантия", v: "10 лет по договору" },
      ],
      seoTitle: "Торговые стеллажи для магазина — проект и расчёт в Ташкенте | RAXPRO",
      seoDesc:
        "Торговые стеллажи RAXPRO для магазинов и торговых залов: пристенные и островные, полки до 150 кг, любой размер под планировку. Замер бесплатно, расчёт в день замера, гарантия 10 лет.",
    },
    uz: {
      name: "Savdo stellaji",
      short: "Savdo stellaji",
      lead: "Doʻkon, market va shourumlar uchun devoriy va orol stellajlar — chiroyli koʻrinish va qulay joylashtirish. Zal tartibi boʻyicha hisoblaymiz: qatorlar, yoʻlaklar, kassa va sabzavot zonalari.",
      description:
        "RAXPRO Toshkentdagi omboridan savdo zallari uchun stellajlar. Assortimentingizga mos devoriy qator va ikki tomonlama orol seksiyalar, tipovoy seksiyalar 2000×900×500 va 2200×1200×600 mm, 5–6 polka, yoʻlak 1200 mm. 1-nav metall, kukunli boʻyoq, sozlanadigan polkalar. Tartib va narx — zal oʻlchovidan keyin. Shartnoma boʻyicha 10 yil kafolat.",
      bullets: [
        "Ozoda va chiroyli tashqi koʻrinish",
        "Tovarni qulay joylashtirish va unga kirish",
        "Zal tartibiga mos istalgan oʻlcham",
        "Mustahkam 1-nav metall — uzoq muddatga",
      ],
      specs: [
        { k: "Turi", v: "devoriy / orol" },
        { k: "Tipovoy seksiyalar", v: "2000×900×500, 2200×1200×600 mm" },
        { k: "Polkalar soni", v: "5–6" },
        { k: "Har polkaga yuklama", v: "150 kg gacha" },
        { k: "Chuqurligi", v: "400 / 500 / 600 mm" },
        { k: "Material", v: "1-nav poʻlat, kukunli boʻyoq" },
        { k: "Kafolat", v: "shartnoma boʻyicha 10 yil" },
      ],
      seoTitle: "Doʻkon uchun savdo stellajlari — Toshkentda loyiha va hisob | RAXPRO",
      seoDesc:
        "Doʻkon va savdo zallari uchun RAXPRO savdo stellajlari: devoriy va orol, polkalar 150 kg gacha, tartibga mos istalgan oʻlcham. Oʻlchov bepul, hisob oʻlchov kuni, 10 yil kafolat.",
    },
  },
  {
    slug: "mezonin",
    sku: "RX-MEZ-PROJECT",
    price: null,
    priceMode: "project",
    konType: null,
    directionSlug: null,
    image: "/products/gen/mezzanine-1.jpg",
    gallery: ["/products/gen/mezzanine-2.jpg", "/products/gen/mezzanine-3.jpg"],
    dims: null,
    levels: 2,
    loadKg: 500,
    ru: {
      name: "Мезонин",
      short: "Мезонин",
      lead: "Второй этаж внутри склада: многоярусная конструкция создаёт дополнительную полезную площадь на той же коробке здания. Каждый мезонин проектируется индивидуально.",
      description:
        "Мезонинная система RAXPRO — стальная платформа на стеллажных стойках с настилом, лестницей и ограждением второго уровня. Под платформой — паллетные или полочные стеллажи, наверху — зона хранения или комплектации. Шаг стоек 2700 мм, глубина 1050 мм, нагрузка на ярус 300–500 кг. Проектируется под высоту помещения, нагрузку и логистику склада; металл 1 сорта, порошковая окраска, анкеровка к полу. Гарантия 10 лет по договору.",
      bullets: [
        "Дополнительный «этаж» без стройки и аренды новой площади",
        "Лестница и ограждение второго уровня в комплекте",
        "Под платформой — стеллажи, наверху — хранение или сборка заказов",
        "Расчёт устойчивости и нагрузки под ваше здание",
      ],
      specs: [
        { k: "Шаг стоек", v: "2700 мм" },
        { k: "Глубина", v: "1050 мм" },
        { k: "Нагрузка на ярус", v: "300–500 кг" },
        { k: "Комплект", v: "настил, лестница, ограждение" },
        { k: "Материал", v: "сталь 1 сорта, порошковая окраска" },
        { k: "Гарантия", v: "10 лет по договору" },
      ],
      seoTitle: "Мезонин для склада — проект и расчёт в Ташкенте | RAXPRO",
      seoDesc:
        "Мезонинные системы RAXPRO: второй этаж внутри склада на стеллажных стойках, настил, лестница и ограждение, нагрузка 300–500 кг на ярус. Индивидуальный проект в день замера, гарантия 10 лет.",
    },
    uz: {
      name: "Mezonin",
      short: "Mezonin",
      lead: "Ombor ichida ikkinchi qavat: koʻp yarusli konstruksiya oʻsha bino ichida qoʻshimcha foydali maydon yaratadi. Har bir mezonin alohida loyihalanadi.",
      description:
        "RAXPRO mezonin tizimi — stellaj tayanchlaridagi poʻlat platforma, ikkinchi daraja uchun toʻshama, zinapoya va toʻsiq bilan. Platforma ostida — paletli yoki polkali stellajlar, yuqorida — saqlash yoki buyurtma yigʻish zonasi. Tayanchlar qadami 2700 mm, chuqurligi 1050 mm, har yarusga 300–500 kg yuklama. Bino balandligi, yuklama va ombor logistikasiga moslab loyihalanadi; 1-nav metall, kukunli boʻyoq, polga ankerlash. Shartnoma boʻyicha 10 yil kafolat.",
      bullets: [
        "Qurilishsiz va yangi maydon ijarasisiz qoʻshimcha «qavat»",
        "Komplektda zinapoya va ikkinchi daraja toʻsigʻi",
        "Platforma ostida — stellajlar, yuqorida — saqlash yoki buyurtma yigʻish",
        "Binongizga moslab barqarorlik va yuklama hisobi",
      ],
      specs: [
        { k: "Tayanchlar qadami", v: "2700 mm" },
        { k: "Chuqurligi", v: "1050 mm" },
        { k: "Har yarusga yuklama", v: "300–500 kg" },
        { k: "Komplekt", v: "toʻshama, zinapoya, toʻsiq" },
        { k: "Material", v: "1-nav poʻlat, kukunli boʻyoq" },
        { k: "Kafolat", v: "shartnoma boʻyicha 10 yil" },
      ],
      seoTitle: "Ombor uchun mezonin — Toshkentda loyiha va hisob | RAXPRO",
      seoDesc:
        "RAXPRO mezonin tizimlari: stellaj tayanchlarida ombor ichidagi ikkinchi qavat, toʻshama, zinapoya va toʻsiq, har yarusga 300–500 kg. Oʻlchov kuni individual loyiha, 10 yil kafolat.",
    },
  },
];

// Только позиции с фиксированной ценой — фид Merchant Center, корзина, заказ.
export const PRICED_PRODUCTS = PRODUCTS.filter((p) => typeof p.price === "number");

export function isProjectPriced(p) {
  return typeof p.price !== "number";
}

// Варианты по числу полок. У товара без variants — один вариант из него самого,
// чтобы карточка, фид и заказ работали одинаково.
export function variantsOf(p) {
  if (Array.isArray(p.variants) && p.variants.length > 0) return p.variants;
  return [{ levels: p.levels, sku: p.sku, price: p.price }];
}

export function defaultVariant(p) {
  const all = variantsOf(p);
  return all.find((v) => v.sku === p.sku) || all[0];
}

export function variantByLevels(p, levels) {
  return variantsOf(p).find((v) => v.levels === Number(levels)) || null;
}

function shelvesRu(n) {
  const d = n % 10;
  const dd = n % 100;
  if (d === 1 && dd !== 11) return "полка";
  if (d >= 2 && d <= 4 && (dd < 12 || dd > 14)) return "полки";
  return "полок";
}

export function shelvesLabel(n, lang = "ru") {
  return lang === "uz" ? `${n} polka` : `${n} ${shelvesRu(n)}`;
}

// «Архивный стеллаж 2000×1000×400 мм, 5 полок» — название конкретного варианта.
export function variantName(p, lang, levels) {
  const c = p[lang];
  if (!c.nameBase) return c.name;
  return `${c.nameBase}, ${shelvesLabel(levels, lang)}`;
}

// Все продаваемые позиции по SKU — для сборки заказа на сервере.
export const OFFERS_BY_SKU = Object.fromEntries(
  PRICED_PRODUCTS.flatMap((p) =>
    variantsOf(p).map((v) => [v.sku, { product: p, ...v, name: variantName(p, "ru", v.levels) }]),
  ),
);

export function getProduct(slug) {
  return PRODUCTS.find((p) => p.slug === slug) || null;
}

// formatPrice живёт в lib/format.js — его импортируют и клиентские компоненты.
import { formatPrice } from "./format";
export { formatPrice };

// Формат для фида Merchant Center: «7032128 UZS».
export function feedPrice(value) {
  return `${Math.round(value)} ${CURRENCY}`;
}
