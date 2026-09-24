// Стеллажи по назначению — /stellazhi/<slug> (ТЗ 24.09, этап 5), как раздел
// «по назначению» у Prostellaj. Факты только из lib/rack/catalog.ts и
// lib/products.js: среднегрузовые 300–400 кг на ярус, секции 1500/2000 мм;
// паллетные до 1000 кг на ярус; архивные 2000×1000×400, 3–6 полок.
// Цены не пишем в текст — они в карточках каталога (блок «Готовые позиции»).

const SPECS = {
  medium: {
    ru: [{ k: "Нагрузка", v: "300–400 кг на ярус" }, { k: "Длина секции", v: "1500 или 2000 мм" }, { k: "Высота", v: "2000–2500 мм" }, { k: "Гарантия", v: "10 лет по договору" }],
    uz: [{ k: "Yuklama", v: "har yarusga 300–400 kg" }, { k: "Seksiya uzunligi", v: "1500 yoki 2000 mm" }, { k: "Balandligi", v: "2000–2500 mm" }, { k: "Kafolat", v: "shartnoma boʻyicha 10 yil" }],
  },
  archive: {
    ru: [{ k: "Размер", v: "2000×1000×400 мм" }, { k: "Полок", v: "3–6 на выбор" }, { k: "Сборка", v: "болтовая, без сварки" }, { k: "Гарантия", v: "10 лет по договору" }],
    uz: [{ k: "Oʻlchami", v: "2000×1000×400 mm" }, { k: "Polkalar", v: "3–6, tanlov boʻyicha" }, { k: "Yigʻish", v: "boltli, payvandsiz" }, { k: "Kafolat", v: "shartnoma boʻyicha 10 yil" }],
  },
  pallet: {
    ru: [{ k: "Нагрузка", v: "до 1000 кг на ярус" }, { k: "Балка", v: "2700 мм под 3 европаллеты" }, { k: "Глубина", v: "1050 мм" }, { k: "Гарантия", v: "10 лет по договору" }],
    uz: [{ k: "Yuklama", v: "har yarusga 1000 kg gacha" }, { k: "Balka", v: "3 ta yevropallet uchun 2700 mm" }, { k: "Chuqurligi", v: "1050 mm" }, { k: "Kafolat", v: "shartnoma boʻyicha 10 yil" }],
  },
};

// Тип → направление: форма заявки подставит тип стеллажа (lib/leadProduct.js).
const DIR_OF = { medium: "srednegruzovye-stellazhi", archive: "arhivnye-stellazhi", pallet: "palletnye-stellazhi" };

const MEDIUM = "srednegruzovoy-stellazh-2000x2000x600";
const ARCHIVE = "arhivnyy-stellazh-2000x1000x400";
const PALLET = "palletnyy-stellazh-4000x2700x1050";

const FAQ_COMMON = {
  ru: { q: "Сколько стоит замер?", a: "Замер бесплатный. План расстановки и точная цена — в день замера." },
  uz: { q: "Oʻlchov qancha turadi?", a: "Oʻlchov bepul. Joylashtirish rejasi va aniq narx — oʻlchov kuni." },
};

function use(slug, { type, cover, caseKeys, reviewIds, productSlugs, ru, uz }) {
  return {
    group: "use",
    slug,
    path: `/stellazhi/${slug}`,
    dir: DIR_OF[type],
    cover,
    caseKeys,
    reviewIds,
    productSlugs,
    specs: SPECS[type],
    ru: { ...ru, faq: [...ru.faq, FAQ_COMMON.ru] },
    uz: { ...uz, faq: [...uz.faq, FAQ_COMMON.uz] },
  };
}

export const USE_LANDINGS = [
  use("na-sklad", {
    type: "pallet", cover: "/landings/use-na-sklad.jpg", caseKeys: ["avtozapchast", "mirvali", "caffelito"], reviewIds: ["sobirjon", "muhriddin", "nurbek"], productSlugs: [PALLET, MEDIUM],
    ru: {
      name: "Стеллажи на склад", short: "На склад",
      lead: "Паллетные — под погрузчик, среднегрузовые — под ручную выкладку коробок. Подбираем тип под товар и технику, а не наоборот.",
      points: [
        { t: "Тип под товар", d: "Паллеты и погрузчик — паллетные до 1000 кг на ярус. Коробки и штучный товар — среднегрузовые 300–400 кг на ярус." },
        { t: "Высота склада работает", d: "Ярусы до потолка: на складе автозапчастей вместимость выросла со 120 до 460 паллет." },
        { t: "Проходы под технику", d: "Ширину проходов считаем под ваш погрузчик или тележку до монтажа." },
        { t: "Докупка секциями", d: "Ряды продлеваются секциями, когда растёт товарный запас." },
      ],
      faq: [{ q: "Какой стеллаж выбрать для склада?", a: "Если товар на паллетах и есть погрузчик — паллетный. Если коробки берут руками — среднегрузовой. На замере подберём смешанный вариант." }],
      seoTitle: "Стеллажи на склад в Ташкенте — паллетные и среднегрузовые",
      seoDesc: "Складские стеллажи RAXPRO: паллетные до 1000 кг на ярус, среднегрузовые 300–400 кг. Бесплатный замер, монтаж, гарантия 10 лет. Кейсы: вместимость ×3,8 и ×5.",
    },
    uz: {
      name: "Ombor uchun stellajlar", short: "Omborga",
      lead: "Palletli — yuklagich uchun, oʻrta yuklamali — qutilarni qoʻlda terish uchun. Turini tovar va texnikaga qarab tanlaymiz, aksincha emas.",
      points: [
        { t: "Tovarga mos tur", d: "Palletlar va yuklagich — har yarusga 1000 kg gacha palletli. Qutilar va dona tovar — har yarusga 300–400 kg oʻrta yuklamali." },
        { t: "Ombor balandligi ishlaydi", d: "Shiftgacha yaruslar: avtoehtiyot qismlar omborida sigʻim 120 dan 460 palletga oshdi." },
        { t: "Texnika uchun yoʻlaklar", d: "Yoʻlaklar kengligini montajdan oldin yuklagich yoki aravachangizga qarab hisoblaymiz." },
        { t: "Seksiyalab qoʻshish", d: "Tovar zaxirasi oʻsganda qatorlar seksiyalar bilan uzaytiriladi." },
      ],
      faq: [{ q: "Ombor uchun qaysi stellajni tanlash kerak?", a: "Tovar palletda boʻlsa va yuklagich bor boʻlsa — palletli. Qutilar qoʻlda olinsa — oʻrta yuklamali. Oʻlchovda aralash variantni tanlab beramiz." }],
      seoTitle: "Ombor uchun stellajlar — palletli va oʻrta yuklamali",
      seoDesc: "RAXPRO ombor stellajlari: har yarusga 1000 kg gacha palletli, 300–400 kg oʻrta yuklamali. Bepul oʻlchov, montaj, 10 yil kafolat. Keyslar: sigʻim ×3,8 va ×5.",
    },
  }),
  use("dlya-pvz", {
    type: "medium", cover: "/landings/use-dlya-pvz.jpg", caseKeys: ["bloom"], reviewIds: ["rastalar", "vitrina", "nurbek"], productSlugs: [MEDIUM, ARCHIVE],
    ru: {
      name: "Стеллажи для пункта выдачи заказов", short: "Для ПВЗ",
      lead: "Пункт выдачи живёт скоростью поиска посылки: ячейки по номерам, свободный проход, полки под коробки разного размера.",
      points: [
        { t: "Ячейки под адресное хранение", d: "Каждая секция и полка получают номер — посылку находят по адресу, а не по памяти." },
        { t: "Коробки разного размера", d: "Шаг полок меняется: крупные коробки внизу, пакеты и мелочь выше." },
        { t: "Узкий зал — выше ряды", d: "На маленькой площади выигрывает высота: 2000–2500 мм." },
        { t: "Рост без переделки", d: "Больше заказов — больше секций в тот же ряд." },
      ],
      faq: [{ q: "Подойдут ли стеллажи для Uzum и других маркетплейсов?", a: "Да, это обычные полочные стеллажи под коробки. Кейс склада маркетплейса — выше на странице." }],
      seoTitle: "Стеллажи для ПВЗ в Ташкенте — пункт выдачи заказов | RAXPRO",
      seoDesc: "Стеллажи для пункта выдачи заказов: адресные ячейки, полки 300–400 кг, секции 1500/2000 мм. Бесплатный замер, монтаж, гарантия 10 лет.",
    },
    uz: {
      name: "Buyurtmalarni topshirish punkti uchun stellajlar", short: "Topshirish punktiga",
      lead: "Topshirish punkti posilkani tez topishga bogʻliq: raqamlangan kataklar, erkin yoʻlak, turli oʻlchamdagi qutilar uchun polkalar.",
      points: [
        { t: "Manzilli saqlash kataklari", d: "Har bir seksiya va polka raqam oladi — posilka xotiradan emas, manzil boʻyicha topiladi." },
        { t: "Turli oʻlchamdagi qutilar", d: "Polkalar oraligʻi oʻzgaradi: katta qutilar pastda, paketlar va mayda narsalar yuqorida." },
        { t: "Tor zal — baland qatorlar", d: "Kichik maydonda balandlik yutadi: 2000–2500 mm." },
        { t: "Qayta qurmasdan oʻsish", d: "Buyurtmalar koʻpaysa — oʻsha qatorga koʻproq seksiya." },
      ],
      faq: [{ q: "Uzum va boshqa marketpleyslar uchun mos keladimi?", a: "Ha, bu qutilar uchun oddiy polkali stellajlar. Marketpleys ombori keysi sahifada yuqorida." }],
      seoTitle: "Toshkentda topshirish punkti (PVZ) uchun stellajlar | RAXPRO",
      seoDesc: "Buyurtmalarni topshirish punkti uchun stellajlar: manzilli kataklar, 300–400 kg polkalar, 1500/2000 mm seksiyalar. Bepul oʻlchov, montaj, 10 yil kafolat.",
    },
  }),
  use("dlya-korobok", {
    type: "medium", cover: "/landings/use-dlya-korobok.jpg", caseKeys: ["bloom", "cold", "caffelito"], reviewIds: ["muhriddin", "sobirjon", "rastalar"], productSlugs: [MEDIUM],
    ru: {
      name: "Стеллажи для коробок", short: "Для коробок",
      lead: "Среднегрузовые полочные стеллажи: коробки стоят в один-два ряда по глубине, каждую видно и можно достать без перекладывания.",
      points: [
        { t: "300–400 кг на ярус", d: "Полка держит полную выкладку коробок и не прогибается." },
        { t: "Глубина под коробку", d: "600 мм — стандартная коробка стоит целиком, не свисает в проход." },
        { t: "Шаг под высоту коробки", d: "Ярусы переставляются — меньше пустого воздуха над товаром." },
        { t: "Без пола под ногами", d: "Коробки больше не стоят стопками на полу — нижние не мнутся." },
      ],
      faq: [{ q: "Сколько коробок поместится на секцию?", a: "Зависит от размера коробки. Пришлите размер — посчитаем раскладку по секции." }],
      seoTitle: "Стеллажи для коробок в Ташкенте — 300–400 кг на полку",
      seoDesc: "Полочные стеллажи для хранения коробок: 300–400 кг на ярус, глубина 600 мм, переставные полки. Бесплатный замер и монтаж, гарантия 10 лет.",
    },
    uz: {
      name: "Qutilar uchun stellajlar", short: "Qutilar uchun",
      lead: "Oʻrta yuklamali polkali stellajlar: qutilar chuqurlik boʻyicha bir-ikki qatorda turadi, har biri koʻrinadi va boshqasini surmasdan olinadi.",
      points: [
        { t: "Har yarusga 300–400 kg", d: "Polka qutilar bilan toʻla terilganda ham egilmaydi." },
        { t: "Quti chuqurligiga mos", d: "600 mm — standart quti toʻliq sigʻadi, yoʻlakka osilib turmaydi." },
        { t: "Quti balandligiga mos oraliq", d: "Yaruslar qayta oʻrnatiladi — tovar ustida boʻsh joy kamroq." },
        { t: "Polda emas", d: "Qutilar endi polda ustma-ust turmaydi — pastdagilar ezilmaydi." },
      ],
      faq: [{ q: "Bir seksiyaga nechta quti sigʻadi?", a: "Quti oʻlchamiga bogʻliq. Oʻlchamni yuboring — seksiya boʻyicha joylashtirishni hisoblaymiz." }],
      seoTitle: "Toshkentda qutilar uchun stellajlar — polkaga 300–400 kg",
      seoDesc: "Qutilarni saqlash uchun polkali stellajlar: har yarusga 300–400 kg, 600 mm chuqurlik, qayta oʻrnatiladigan polkalar. Bepul oʻlchov va montaj, 10 yil kafolat.",
    },
  }),
  use("dlya-dokumentov", {
    type: "archive", cover: "/landings/use-dlya-dokumentov.jpg", caseKeys: ["discovery"], reviewIds: ["prilavok", "vitrina", "nurbek"], productSlugs: [ARCHIVE],
    ru: {
      name: "Стеллажи для документов", short: "Для документов",
      lead: "Архивные стеллажи 2000×1000×400 мм под папки-регистраторы и архивные короба. Число полок — от трёх до шести, цена в каталоге.",
      points: [
        { t: "Глубина 400 мм", d: "Точно под папку-регистратор: не выступает и не проваливается." },
        { t: "3–6 полок", d: "Выбираете число полок — цена пересчитывается прямо в карточке каталога." },
        { t: "Светлая окраска", d: "Не пылит и не оставляет следов на бумаге." },
        { t: "Ряд без зазоров", d: "Секции стыкуются в непрерывный архивный ряд вдоль стены." },
      ],
      faq: [{ q: "Можно ли потом добавить полки?", a: "Да, полки докупаются и ставятся на те же стойки." }],
      seoTitle: "Стеллажи для документов и архива — от 1 000 000 сум",
      seoDesc: "Архивные стеллажи для документов 2000×1000×400 мм, 3–6 полок, от 1 000 000 сум. Под папки и архивные короба. Доставка по Ташкенту, гарантия 10 лет.",
    },
    uz: {
      name: "Hujjatlar uchun stellajlar", short: "Hujjatlar uchun",
      lead: "Registrator papkalar va arxiv qutilari uchun 2000×1000×400 mm arxiv stellajlari. Polkalar soni — uchtadan oltitagacha, narxi katalogda.",
      points: [
        { t: "Chuqurligi 400 mm", d: "Registrator papkaga aniq mos: chiqib turmaydi va tushib ketmaydi." },
        { t: "3–6 polka", d: "Polkalar sonini tanlaysiz — narx katalog kartochkasida darhol qayta hisoblanadi." },
        { t: "Och rangli boʻyoq", d: "Chang chiqarmaydi va qogʻozda iz qoldirmaydi." },
        { t: "Boʻshliqsiz qator", d: "Seksiyalar devor boʻylab uzluksiz arxiv qatoriga ulanadi." },
      ],
      faq: [{ q: "Keyin polka qoʻshsa boʻladimi?", a: "Ha, polkalar alohida sotib olinadi va oʻsha tayanchlarga qoʻyiladi." }],
      seoTitle: "Hujjatlar va arxiv uchun stellajlar — 1 000 000 soʻmdan",
      seoDesc: "Hujjatlar uchun arxiv stellajlari 2000×1000×400 mm, 3–6 polka, 1 000 000 soʻmdan. Papkalar va arxiv qutilari uchun. Toshkent boʻylab yetkazib berish, 10 yil kafolat.",
    },
  }),
  use("dlya-ofisa", {
    type: "archive", cover: "/landings/use-dlya-ofisa.jpg", caseKeys: ["discovery"], reviewIds: ["prilavok", "nurbek", "vitrina"], productSlugs: [ARCHIVE, MEDIUM],
    ru: {
      name: "Стеллажи для офиса", short: "Для офиса",
      lead: "Офисный архив, склад канцелярии и подсобка при офисе: аккуратные светлые стеллажи, которые не стыдно поставить в кабинете.",
      points: [
        { t: "Выглядят аккуратно", d: "Светлая порошковая окраска, ровные ряды без торчащего крепежа." },
        { t: "Архив рядом с работой", d: "Папки на стеллаже в кабинете — не нужно ходить в подвал." },
        { t: "Запас канцелярии", d: "Для коробок с бумагой и водой — среднегрузовые, 300–400 кг на ярус." },
        { t: "Переезд без потерь", d: "Болтовая сборка: стеллаж разбирается и едет с вами." },
      ],
      faq: [{ q: "Можно ли разобрать стеллаж при переезде офиса?", a: "Да, соединения болтовые — разбирается и собирается заново." }],
      seoTitle: "Стеллажи для офиса в Ташкенте — архив и склад канцелярии",
      seoDesc: "Офисные металлические стеллажи: архив документов, запас бумаги и воды. Светлая окраска, болтовая сборка, гарантия 10 лет. Замер бесплатно.",
    },
    uz: {
      name: "Ofis uchun stellajlar", short: "Ofis uchun",
      lead: "Ofis arxivi, kanselyariya ombori va ofis orqa xonasi: kabinetga qoʻysa uyalmaydigan ozoda och rangli stellajlar.",
      points: [
        { t: "Ozoda koʻrinadi", d: "Och rangli kukunli boʻyoq, chiqib turgan mahkamlagichsiz tekis qatorlar." },
        { t: "Arxiv ish joyi yonida", d: "Papkalar kabinetdagi stellajda — yertoʻlaga borish shart emas." },
        { t: "Kanselyariya zaxirasi", d: "Qogʻoz va suv qutilari uchun — har yarusga 300–400 kg oʻrta yuklamali." },
        { t: "Yoʻqotishsiz koʻchish", d: "Boltli yigʻish: stellaj qismlarga ajraladi va siz bilan koʻchadi." },
      ],
      faq: [{ q: "Ofis koʻchganda stellajni qismlarga ajratsa boʻladimi?", a: "Ha, birikmalar boltli — ajratiladi va qaytadan yigʻiladi." }],
      seoTitle: "Ofis uchun stellajlar — arxiv va kanselyariya ombori",
      seoDesc: "Ofis uchun metall stellajlar: hujjatlar arxivi, qogʻoz va suv zaxirasi. Och rang, boltli yigʻish, 10 yil kafolat. Oʻlchov bepul.",
    },
  }),
  use("dlya-podsobki", {
    type: "medium", cover: "/landings/use-dlya-podsobki.jpg", caseKeys: ["sayqal", "xonadon", "elite"], reviewIds: ["muhriddin", "nurbek", "salohiddin"], productSlugs: [MEDIUM, ARCHIVE],
    ru: {
      name: "Стеллажи для подсобки", short: "Для подсобки",
      lead: "Подсобка магазина, кафе или ресторана: мало места, помещение неправильной формы, товар разного веса. Стеллажи под размер комнаты, а не типовой набор.",
      points: [
        { t: "Под форму помещения", d: "Сначала план расстановки, потом комплектация — угол и простенки тоже работают." },
        { t: "Разный вес на одной стене", d: "Тяжёлое — на усиленные нижние ярусы, лёгкое — выше." },
        { t: "До потолка", d: "Верхние ярусы — под редкий запас, чтобы освободить проход." },
        { t: "Монтаж в выходной", d: "Дату и время монтажа согласуем так, чтобы не останавливать работу." },
      ],
      faq: [{ q: "У меня комната неправильной формы — подойдёт?", a: "Да, как в кейсе ресторана Sayqal: сначала проект под помещение, потом монтаж по чертежу." }],
      seoTitle: "Стеллажи для подсобки магазина и кафе в Ташкенте | RAXPRO",
      seoDesc: "Стеллажи для подсобного помещения: под форму комнаты, до потолка, 300–400 кг на ярус. Проект расстановки, монтаж, гарантия 10 лет.",
    },
    uz: {
      name: "Orqa xona uchun stellajlar", short: "Orqa xona uchun",
      lead: "Doʻkon, kafe yoki restoranning orqa xonasi: joy kam, xona notoʻgʻri shaklda, tovar ogʻirligi har xil. Stellajlar tipik toʻplam emas, xona oʻlchamiga mos.",
      points: [
        { t: "Xona shakliga mos", d: "Avval joylashtirish rejasi, keyin komplektatsiya — burchak va devor oraliqlari ham ishlaydi." },
        { t: "Bir devorda turli ogʻirlik", d: "Ogʻir narsalar — kuchaytirilgan pastki yaruslarda, yengillari yuqorida." },
        { t: "Shiftgacha", d: "Yuqori yaruslar — kam ishlatiladigan zaxira uchun, yoʻlak boʻshaydi." },
        { t: "Dam olish kuni montaj", d: "Montaj sanasi va vaqtini ishni toʻxtatmaydigan qilib kelishamiz." },
      ],
      faq: [{ q: "Xonam notoʻgʻri shaklda — mos keladimi?", a: "Ha, Sayqal restorani keysidagidek: avval xonaga mos loyiha, keyin chizma boʻyicha montaj." }],
      seoTitle: "Toshkentda doʻkon va kafe orqa xonasi uchun stellajlar",
      seoDesc: "Orqa xona uchun stellajlar: xona shakliga mos, shiftgacha, har yarusga 300–400 kg. Joylashtirish loyihasi, montaj, 10 yil kafolat.",
    },
  }),
  use("hozyajstvennye", {
    type: "medium", cover: "/landings/use-hozyajstvennye.jpg", caseKeys: ["xonadon", "sayqal"], reviewIds: ["xonadon", "salohiddin", "muhriddin", "nurbek"], productSlugs: [MEDIUM, ARCHIVE],
    ru: {
      name: "Хозяйственные стеллажи", short: "Хозяйственные",
      lead: "Для кладовой, гаража, балкона и хозблока: металлические полки, которые выдерживают банки, инструмент и сезонные вещи.",
      points: [
        { t: "Держат тяжёлое", d: "Консервация, инструмент, мешки — нижние ярусы на 300–400 кг." },
        { t: "Угловой ряд", d: "Стеллажи вдоль двух стен используют угол кладовой полностью." },
        { t: "Не ржавеют", d: "Порошковая окраска выдерживает влажность подвала и балкона." },
        { t: "Собираются без сварки", d: "Болтовая сборка — можно переставить или перевезти." },
      ],
      faq: [{ q: "Подойдут ли для квартиры?", a: "Да. Размер секции подбираем под кладовую; кейс кладовой в доме — выше на странице." }],
      seoTitle: "Хозяйственные стеллажи в Ташкенте — для кладовой и гаража",
      seoDesc: "Металлические хозяйственные стеллажи для кладовой, гаража и балкона: 300–400 кг на ярус, порошковая окраска, болтовая сборка. Гарантия 10 лет.",
    },
    uz: {
      name: "Xoʻjalik stellajlari", short: "Xoʻjalik",
      lead: "Omborxona, garaj, balkon va xoʻjalik bloki uchun: banka, asbob-uskuna va mavsumiy narsalarni koʻtaradigan metall polkalar.",
      points: [
        { t: "Ogʻirni koʻtaradi", d: "Konserva, asbob, qoplar — pastki yaruslar 300–400 kg ga." },
        { t: "Burchakli qator", d: "Ikki devor boʻylab stellajlar omborxona burchagidan toʻliq foydalanadi." },
        { t: "Zanglamaydi", d: "Kukunli boʻyoq yertoʻla va balkon namligiga chidaydi." },
        { t: "Payvandsiz yigʻiladi", d: "Boltli yigʻish — joyini oʻzgartirish yoki koʻchirish mumkin." },
      ],
      faq: [{ q: "Kvartira uchun mos keladimi?", a: "Ha. Seksiya oʻlchamini omborxonaga qarab tanlaymiz; uydagi xoʻjalik xonasi keysi sahifada yuqorida." }],
      seoTitle: "Toshkentda xoʻjalik stellajlari — omborxona va garaj uchun",
      seoDesc: "Omborxona, garaj va balkon uchun metall xoʻjalik stellajlari: har yarusga 300–400 kg, kukunli boʻyoq, boltli yigʻish. 10 yil kafolat.",
    },
  }),
  use("dlya-bibliotek", {
    type: "archive", cover: "/landings/use-dlya-bibliotek.jpg", caseKeys: ["discovery"], reviewIds: ["prilavok", "vitrina", "nurbek"], productSlugs: [ARCHIVE],
    ru: {
      name: "Стеллажи для библиотек и книжных складов", short: "Для библиотек",
      lead: "Книги тяжёлые и занимают всю длину полки. Металлические стеллажи 2000×1000×400 мм держат плотную выкладку и стыкуются в длинные ряды.",
      points: [
        { t: "Плотная выкладка", d: "Полка длиной 1000 мм заполняется корешками без прогиба." },
        { t: "3–6 полок", d: "Больше полок — ниже шаг, под обычные книги; меньше — под альбомы и подшивки." },
        { t: "Ряды вдоль зала", d: "Секции стыкуются, проход между рядами — по плану." },
        { t: "Книжный склад", d: "Для пачек из типографии — среднегрузовые на 300–400 кг." },
      ],
      faq: [{ q: "Сколько книг помещается на полку?", a: "Зависит от формата. На замере посчитаем по вашему фонду." }],
      seoTitle: "Стеллажи для библиотек и книжных складов в Ташкенте | RAXPRO",
      seoDesc: "Металлические библиотечные стеллажи 2000×1000×400 мм, 3–6 полок, стыкуются в ряды. Книжный склад — среднегрузовые 300–400 кг. Гарантия 10 лет.",
    },
    uz: {
      name: "Kutubxona va kitob omborlari uchun stellajlar", short: "Kutubxona uchun",
      lead: "Kitoblar ogʻir va polkaning butun uzunligini egallaydi. 2000×1000×400 mm metall stellajlar zich terishni koʻtaradi va uzun qatorlarga ulanadi.",
      points: [
        { t: "Zich terish", d: "1000 mm uzunlikdagi polka egilmasdan kitoblar bilan toʻladi." },
        { t: "3–6 polka", d: "Koʻproq polka — oddiy kitoblar uchun kichik oraliq; kamroq — albom va tikilgan jurnallar uchun." },
        { t: "Zal boʻylab qatorlar", d: "Seksiyalar ulanadi, qatorlar orasidagi yoʻlak — reja boʻyicha." },
        { t: "Kitob ombori", d: "Bosmaxonadan kelgan pachkalar uchun — 300–400 kg oʻrta yuklamali." },
      ],
      faq: [{ q: "Polkaga nechta kitob sigʻadi?", a: "Formatga bogʻliq. Oʻlchovda fondingiz boʻyicha hisoblaymiz." }],
      seoTitle: "Toshkentda kutubxona va kitob omborlari uchun stellajlar",
      seoDesc: "2000×1000×400 mm metall kutubxona stellajlari, 3–6 polka, qatorlarga ulanadi. Kitob ombori — 300–400 kg oʻrta yuklamali. 10 yil kafolat.",
    },
  }),
  use("dlya-shin", {
    type: "medium", cover: "/landings/use-dlya-shin.jpg", caseKeys: ["avtozapchast", "jac"], reviewIds: ["avtoservis", "sobirjon", "muhriddin"], productSlugs: [MEDIUM, PALLET],
    ru: {
      name: "Стеллажи для шин и колёс", short: "Для шин",
      lead: "Шины хранят стоя, в один ряд — так они не деформируются. Подбираем глубину и шаг ярусов под диаметр, чтобы колесо не свисало и не упиралось.",
      points: [
        { t: "Хранение стоя", d: "Шина стоит на протекторе в ряд — без стопок, которые давят нижние." },
        { t: "Шаг под диаметр", d: "Ярусы ставятся под ваш размер: легковые, внедорожные, грузовые." },
        { t: "300–400 кг на ярус", d: "Ряд колёс в сборе на полке — не проблема." },
        { t: "Склад шин — паллетные", d: "Если шины приходят на паллетах, ставим паллетные стеллажи до 1000 кг на ярус." },
      ],
      faq: [{ q: "Сколько шин на одну полку?", a: "Зависит от ширины шины и длины секции (1500 или 2000 мм). Назовите размер — посчитаем." }],
      seoTitle: "Стеллажи для шин и колёс в Ташкенте — шиномонтаж и склад",
      seoDesc: "Стеллажи для хранения шин и колёс: шаг под диаметр, 300–400 кг на ярус, секции 1500/2000 мм. Для шиномонтажа, СТО и склада. Гарантия 10 лет.",
    },
    uz: {
      name: "Shina va gʻildiraklar uchun stellajlar", short: "Shinalar uchun",
      lead: "Shinalar tik holda, bir qatorda saqlanadi — shunda deformatsiya boʻlmaydi. Gʻildirak osilib turmasligi va tiqilmasligi uchun chuqurlik va yarus oraligʻini diametrga qarab tanlaymiz.",
      points: [
        { t: "Tik saqlash", d: "Shina protektorda qatorda turadi — pastdagilarni bosadigan ustma-ust uyumlarsiz." },
        { t: "Diametrga mos oraliq", d: "Yaruslar oʻlchamingizga qarab qoʻyiladi: yengil, yoʻltanlamas, yuk mashinalari." },
        { t: "Har yarusga 300–400 kg", d: "Polkada yigʻilgan gʻildiraklar qatori — muammo emas." },
        { t: "Shina ombori — palletli", d: "Shinalar palletda kelsa, har yarusga 1000 kg gacha palletli stellajlar qoʻyamiz." },
      ],
      faq: [{ q: "Bitta polkaga nechta shina sigʻadi?", a: "Shina kengligi va seksiya uzunligiga (1500 yoki 2000 mm) bogʻliq. Oʻlchamni ayting — hisoblaymiz." }],
      seoTitle: "Toshkentda shina va gʻildiraklar uchun stellajlar",
      seoDesc: "Shina va gʻildiraklarni saqlash uchun stellajlar: diametrga mos oraliq, har yarusga 300–400 kg, 1500/2000 mm seksiyalar. Shinomontaj, STO va ombor uchun. 10 yil kafolat.",
    },
  }),
  use("dlya-sto", {
    type: "medium", cover: "/landings/use-dlya-sto.jpg", caseKeys: ["avtozapchast", "jac"], reviewIds: ["avtoservis", "sobirjon", "muhriddin"], productSlugs: [MEDIUM],
    ru: {
      name: "Стеллажи для СТО и автосервиса", short: "Для СТО",
      lead: "Запчасти, масла, шины и инструмент в одном помещении: стеллажи с разной нагрузкой по ярусам и понятной адресацией.",
      points: [
        { t: "Запчасти по адресам", d: "Номер секции и полки — мастер находит деталь без поиска." },
        { t: "Масла и жидкости внизу", d: "Канистры и бочки — на нижних усиленных ярусах." },
        { t: "Шины отдельно", d: "Секция с шагом под диаметр колеса." },
        { t: "Стойкая покраска", d: "Порошковая окраска выдерживает масло и мойку." },
      ],
      faq: [{ q: "Можно совместить шины и запчасти в одном ряду?", a: "Да, ярусы в каждой секции ставятся со своим шагом." }],
      seoTitle: "Стеллажи для СТО и автосервиса в Ташкенте | RAXPRO",
      seoDesc: "Стеллажи для автосервиса: запчасти, масла и шины в одном ряду, 300–400 кг на ярус, адресное хранение. Бесплатный замер, гарантия 10 лет.",
    },
    uz: {
      name: "STO va avtoservis uchun stellajlar", short: "STO uchun",
      lead: "Ehtiyot qismlar, moylar, shinalar va asboblar bitta xonada: yaruslar boʻyicha turli yuklamali va tushunarli manzillangan stellajlar.",
      points: [
        { t: "Ehtiyot qismlar manzil boʻyicha", d: "Seksiya va polka raqami — usta detalni qidirmasdan topadi." },
        { t: "Moy va suyuqliklar pastda", d: "Kanistr va bochkalar — kuchaytirilgan pastki yaruslarda." },
        { t: "Shinalar alohida", d: "Gʻildirak diametriga mos oraliqli seksiya." },
        { t: "Chidamli boʻyoq", d: "Kukunli boʻyoq moy va yuvishga chidaydi." },
      ],
      faq: [{ q: "Shina va ehtiyot qismlarni bitta qatorda saqlasa boʻladimi?", a: "Ha, har bir seksiyadagi yaruslar oʻz oraligʻi bilan qoʻyiladi." }],
      seoTitle: "Toshkentda STO va avtoservis uchun stellajlar | RAXPRO",
      seoDesc: "Avtoservis uchun stellajlar: ehtiyot qismlar, moylar va shinalar bitta qatorda, har yarusga 300–400 kg, manzilli saqlash. Bepul oʻlchov, 10 yil kafolat.",
    },
  }),
  use("dlya-garazha", {
    type: "medium", cover: "/landings/use-dlya-garazha.jpg", caseKeys: ["xonadon"], reviewIds: ["avtoservis", "salohiddin", "nurbek"], productSlugs: [MEDIUM, ARCHIVE],
    ru: {
      name: "Стеллажи для гаража", short: "Для гаража",
      lead: "Колёса, инструмент, канистры и всё, что копится годами: металлические стеллажи вдоль стен освобождают место под машину.",
      points: [
        { t: "Место под машину", d: "Всё уходит на стены — пол свободен." },
        { t: "Колёса на полке", d: "Нижний ярус под комплект шин." },
        { t: "Тяжёлое держит", d: "300–400 кг на ярус — инструмент и канистры без прогиба." },
        { t: "Не боится сырости", d: "Порошковая окраска по металлу 1 сорта." },
      ],
      faq: [{ q: "Какой размер секции выбрать для гаража?", a: "Обычно 1500 или 2000 мм в длину и 600 мм в глубину. Пришлите размер стены — подберём." }],
      seoTitle: "Стеллажи для гаража в Ташкенте — металлические, 300–400 кг",
      seoDesc: "Металлические стеллажи для гаража: колёса, инструмент, канистры. 300–400 кг на ярус, порошковая окраска, гарантия 10 лет. Доставка по Ташкенту.",
    },
    uz: {
      name: "Garaj uchun stellajlar", short: "Garaj uchun",
      lead: "Gʻildiraklar, asbob-uskunalar, kanistrlar va yillar davomida yigʻilgan hamma narsa: devor boʻylab metall stellajlar mashina uchun joy boʻshatadi.",
      points: [
        { t: "Mashina uchun joy", d: "Hammasi devorlarga chiqadi — pol boʻsh." },
        { t: "Gʻildiraklar polkada", d: "Pastki yarus — shinalar toʻplami uchun." },
        { t: "Ogʻirni koʻtaradi", d: "Har yarusga 300–400 kg — asbob va kanistrlar egilmasdan." },
        { t: "Namlikdan qoʻrqmaydi", d: "1-nav metall ustidan kukunli boʻyoq." },
      ],
      faq: [{ q: "Garaj uchun qaysi seksiya oʻlchamini tanlash kerak?", a: "Odatda uzunligi 1500 yoki 2000 mm, chuqurligi 600 mm. Devor oʻlchamini yuboring — tanlab beramiz." }],
      seoTitle: "Toshkentda garaj uchun stellajlar — metall, 300–400 kg",
      seoDesc: "Garaj uchun metall stellajlar: gʻildiraklar, asboblar, kanistrlar. Har yarusga 300–400 kg, kukunli boʻyoq, 10 yil kafolat. Toshkent boʻylab yetkazib berish.",
    },
  }),
];
