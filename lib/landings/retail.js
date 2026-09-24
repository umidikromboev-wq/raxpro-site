// Торговые стеллажи — восемь подкатегорий по списку Муродбека (24.09.2026):
// oziq-ovqat, kosmetika, dorixona, texnika, xoʻjalik mollari, maishiy texnika,
// gipermarket, minimarket. Страница отвечает на вопрос владельца именно этого
// магазина; общие факты (гарантия 10 лет, металл 1 сорта, бесплатный замер)
// взяты с сайта. Цен на торговые в прайсе нет — на странице «цена по проекту».
// Типоразмеры — lib/rack/catalog.ts (RT-2000-900-500-5, RT-2200-1200-600-6).

const RETAIL_SPECS = {
  ru: [
    { k: "Высота", v: "2000–2200 мм" },
    { k: "Ширина секции", v: "900–1200 мм" },
    { k: "Глубина полки", v: "500–600 мм" },
    { k: "Гарантия", v: "10 лет по договору" },
  ],
  uz: [
    { k: "Balandligi", v: "2000–2200 mm" },
    { k: "Seksiya kengligi", v: "900–1200 mm" },
    { k: "Polka chuqurligi", v: "500–600 mm" },
    { k: "Kafolat", v: "shartnoma boʻyicha 10 yil" },
  ],
};

const base = (slug, extra) => ({
  group: "retail",
  parent: "torgovye-stellazhi",
  path: `/napravleniya/torgovye-stellazhi/${slug}`,
  slug,
  specs: RETAIL_SPECS,
  productSlugs: ["torgovyy-stellazh"],
  ...extra,
});

export const RETAIL_LANDINGS = [
  base("produktovyj-magazin", {
    cover: "/landings/retail-produktovyj-magazin.jpg",
    caseKeys: ["arzon", "elite"],
    reviewIds: ["nurbek", "muhriddin", "vitrina"],
    ru: {
      name: "Стеллажи для продуктового магазина",
      short: "Продуктовый магазин",
      lead: "Пристенные и островные стеллажи под продукты: тяжёлые упаковки внизу, ходовой товар на уровне глаз, ценники на каждой полке. Проект зала — в день замера.",
      points: [
        { t: "Выдерживают воду и крупы мешками", d: "Нижние полки рассчитаны под упаковки воды, масла и муки — полка не прогибается под полной выкладкой." },
        { t: "Выкладка по уровням", d: "Шаг полок меняется без инструмента: под банки, бутылки и пачки в одном стеллаже." },
        { t: "Проходы под тележку", d: "Расставляем ряды так, чтобы покупатель с корзиной и продавец с тележкой расходились." },
        { t: "Моется и не ржавеет", d: "Порошковая окраска по металлу 1 сорта — влажная уборка каждый день стеллажу не вредит." },
      ],
      faq: [
        { q: "Сколько стеллажей нужно на мой магазин?", a: "Считаем по плану зала: пришлите размеры или вызовите замерщика — замер бесплатный, план расстановки и цена готовы в день замера." },
        { q: "Можно ли совместить пристенные и островные?", a: "Да. Обычно у стен — высокие пристенные, в центре — островные пониже, чтобы зал просматривался." },
        { q: "Что с гарантией?", a: "10 лет по договору — вдвое больше, чем обычно на рынке." },
      ],
      seoTitle: "Стеллажи для продуктового магазина в Ташкенте — RAXPRO",
      seoDesc: "Торговые стеллажи для продуктового магазина: пристенные и островные, под воду, крупы и консервы. Бесплатный замер, план зала в день замера, гарантия 10 лет.",
    },
    uz: {
      name: "Oziq-ovqat doʻkoni uchun stellajlar",
      short: "Oziq-ovqat doʻkoni",
      lead: "Oziq-ovqat uchun devoriy va orol stellajlar: ogʻir qadoqlar pastda, tez sotiladigan tovar koʻz darajasida, har bir polkada narx yorligʻi. Zal loyihasi — oʻlchov kuni.",
      points: [
        { t: "Suv va qoplardagi yormani koʻtaradi", d: "Pastki polkalar suv, yogʻ va un qadoqlariga hisoblangan — toʻliq terilganda ham egilmaydi." },
        { t: "Darajalar boʻyicha terish", d: "Polkalar oraligʻi asbobsiz oʻzgaradi: bitta stellajda banka, shisha va pachkalar uchun." },
        { t: "Aravacha uchun yoʻlaklar", d: "Qatorlarni savatli xaridor va aravachali sotuvchi bemalol oʻtadigan qilib joylashtiramiz." },
        { t: "Yuviladi va zanglamaydi", d: "1-nav metall ustidan kukunli boʻyoq — har kungi hoʻl tozalash stellajga zarar qilmaydi." },
      ],
      faq: [
        { q: "Doʻkonimga nechta stellaj kerak?", a: "Zal rejasi boʻyicha hisoblaymiz: oʻlchamlarni yuboring yoki oʻlchovchini chaqiring — oʻlchov bepul, joylashtirish rejasi va narx oʻlchov kuni tayyor." },
        { q: "Devoriy va orol stellajlarni birga qoʻysa boʻladimi?", a: "Ha. Odatda devor boʻylab baland devoriy, oʻrtada esa zal koʻrinib turishi uchun pastroq orol stellajlar qoʻyiladi." },
        { q: "Kafolat qanday?", a: "Shartnoma boʻyicha 10 yil — bozordagi odatdagidan ikki barobar koʻp." },
      ],
      seoTitle: "Oziq-ovqat doʻkoni uchun stellajlar Toshkentda — RAXPRO",
      seoDesc: "Oziq-ovqat doʻkoni uchun savdo stellajlari: devoriy va orol, suv, yorma va konservalar uchun. Oʻlchov bepul, zal rejasi oʻlchov kuni, 10 yil kafolat.",
    },
  }),
  base("kosmetika", {
    cover: "/landings/retail-kosmetika.jpg",
    caseKeys: ["bloom", "elite"],
    reviewIds: ["vitrina", "rastalar", "prilavok"],
    ru: {
      name: "Стеллажи для магазина косметики",
      short: "Магазин косметики",
      lead: "Частые полки под мелкий товар, светлый цвет и аккуратная выкладка лицом к покупателю. Отдельно — складские стеллажи под коробки в подсобке.",
      points: [
        { t: "Мелкий шаг полок", d: "Больше ярусов на ту же высоту — флаконы и тюбики стоят в один ряд и не теряются в глубине." },
        { t: "Светлый цвет", d: "Белая или светло-серая покраска не спорит с упаковкой и делает зал светлее." },
        { t: "Зал и подсобка одним проектом", d: "В зале — торговые, в подсобке — среднегрузовые под коробки поставок. Один замер, один договор." },
        { t: "Ровная линия выкладки", d: "Полки одной глубины по всему ряду — товар стоит по линии, как на витрине." },
      ],
      faq: [
        { q: "Можно ли сделать полки для очень мелкого товара?", a: "Да, шаг полок подбирается под товар. Скажите, что будет стоять на полках, — предложим расстановку." },
        { q: "Какие стеллажи ставить в подсобку?", a: "Для коробок подходят среднегрузовые: 300–400 кг на ярус, секции 1500 или 2000 мм. Подберём на замере." },
        { q: "Сколько стоит?", a: "Торговые считаем по проекту зала: план и точная цена — в день бесплатного замера." },
      ],
      seoTitle: "Стеллажи для магазина косметики в Ташкенте — RAXPRO",
      seoDesc: "Стеллажи для магазина косметики: частые полки под мелкий товар, светлый цвет, склад в подсобке одним проектом. Замер бесплатно, гарантия 10 лет.",
    },
    uz: {
      name: "Kosmetika doʻkoni uchun stellajlar",
      short: "Kosmetika doʻkoni",
      lead: "Mayda tovar uchun zich polkalar, och rang va xaridorga yuzi bilan qaragan ozoda terish. Alohida — orqa xonadagi qutilar uchun ombor stellajlari.",
      points: [
        { t: "Polkalar oraligʻi kichik", d: "Oʻsha balandlikka koʻproq yarus — flakon va tyubiklar bir qatorda turadi, ichkarida yoʻqolib ketmaydi." },
        { t: "Och rang", d: "Oq yoki och kulrang boʻyoq qadoq bilan bahslashmaydi va zalni yorugʻroq qiladi." },
        { t: "Zal va orqa xona bitta loyihada", d: "Zalda — savdo stellajlari, orqa xonada — yetkazib berilgan qutilar uchun oʻrta yuklamali. Bitta oʻlchov, bitta shartnoma." },
        { t: "Terish chizigʻi tekis", d: "Butun qatorda polkalar chuqurligi bir xil — tovar vitrinadagidek bir chiziqda turadi." },
      ],
      faq: [
        { q: "Juda mayda tovar uchun polka qilsa boʻladimi?", a: "Ha, polkalar oraligʻi tovarga qarab tanlanadi. Polkada nima turishini ayting — joylashtirishni taklif qilamiz." },
        { q: "Orqa xonaga qanday stellaj qoʻyiladi?", a: "Qutilar uchun oʻrta yuklamali mos: har yarusga 300–400 kg, seksiyalar 1500 yoki 2000 mm. Oʻlchovda tanlab beramiz." },
        { q: "Narxi qancha?", a: "Savdo stellajlarini zal loyihasi boʻyicha hisoblaymiz: reja va aniq narx — bepul oʻlchov kuni." },
      ],
      seoTitle: "Kosmetika doʻkoni uchun stellajlar Toshkentda — RAXPRO",
      seoDesc: "Kosmetika doʻkoni uchun stellajlar: mayda tovar uchun zich polkalar, och rang, orqa xonadagi ombor bitta loyihada. Oʻlchov bepul, 10 yil kafolat.",
    },
  }),
  base("apteka", {
    cover: "/landings/retail-apteka.jpg",
    caseKeys: ["bloom"],
    reviewIds: ["prilavok", "vitrina", "rastalar"],
    ru: {
      name: "Стеллажи для аптеки",
      short: "Аптека",
      lead: "Стеллажи за прилавок и в торговый зал: много невысоких ярусов, разделители между препаратами, быстрый доступ провизора к любой полке.",
      points: [
        { t: "Много ярусов", d: "Невысокие ярусы под коробки препаратов — на той же стене помещается больше наименований." },
        { t: "Порядок по группам", d: "Разделители на полках держат препараты по группам, провизор не ищет упаковку по всей полке." },
        { t: "Зона за прилавком", d: "Глубину и высоту подбираем так, чтобы до верхнего яруса дотягивались без стремянки." },
        { t: "Склад аптеки", d: "Для запаса в подсобке — среднегрузовые или архивные стеллажи того же цвета." },
      ],
      faq: [
        { q: "Какой глубины полки нужны для аптеки?", a: "Обычно хватает неглубоких полок: коробки препаратов небольшие. Точную глубину подбираем на замере под ваш ассортимент." },
        { q: "Делаете ли стеллажи под прилавок?", a: "Ставим стеллажи за прилавком и в зале. Сам прилавок не изготавливаем." },
        { q: "Как быстро смонтируете?", a: "Срок зависит от объёма; план и цена — в день замера, дату монтажа согласуем в договоре." },
      ],
      seoTitle: "Стеллажи для аптеки в Ташкенте — за прилавок и в зал",
      seoDesc: "Аптечные стеллажи: много невысоких ярусов, разделители, зона за прилавком и склад аптеки. Бесплатный замер, металл 1 сорта, гарантия 10 лет.",
    },
    uz: {
      name: "Dorixona uchun stellajlar",
      short: "Dorixona",
      lead: "Peshtaxta ortiga va savdo zaliga stellajlar: koʻp past yaruslar, dorilar orasida ajratgichlar, farmatsevt istalgan polkaga tez yetadi.",
      points: [
        { t: "Koʻp yarus", d: "Dori qutilari uchun past yaruslar — oʻsha devorga koʻproq nomdagi dori sigʻadi." },
        { t: "Guruhlar boʻyicha tartib", d: "Polkadagi ajratgichlar dorilarni guruhlarda ushlab turadi, farmatsevt qadoqni butun polkadan qidirmaydi." },
        { t: "Peshtaxta orti", d: "Chuqurlik va balandlikni yuqori yarusga narvonsiz qoʻl yetadigan qilib tanlaymiz." },
        { t: "Dorixona ombori", d: "Orqa xonadagi zaxira uchun — shu rangdagi oʻrta yuklamali yoki arxiv stellajlari." },
      ],
      faq: [
        { q: "Dorixona uchun polka chuqurligi qancha boʻladi?", a: "Odatda sayoz polkalar yetarli: dori qutilari kichik. Aniq chuqurlikni oʻlchovda assortimentingizga qarab tanlaymiz." },
        { q: "Peshtaxta uchun stellaj qilasizlarmi?", a: "Stellajlarni peshtaxta ortiga va zalga oʻrnatamiz. Peshtaxtaning oʻzini tayyorlamaymiz." },
        { q: "Qancha vaqtda oʻrnatasizlar?", a: "Muddat hajmga bogʻliq; reja va narx — oʻlchov kuni, oʻrnatish sanasi shartnomada kelishiladi." },
      ],
      seoTitle: "Dorixona uchun stellajlar Toshkentda — peshtaxta orti va zal",
      seoDesc: "Dorixona stellajlari: koʻp past yaruslar, ajratgichlar, peshtaxta orti va dorixona ombori. Oʻlchov bepul, 1-nav metall, 10 yil kafolat.",
    },
  }),
  base("magazin-elektroniki", {
    cover: "/landings/retail-magazin-elektroniki.jpg",
    caseKeys: ["elite"],
    reviewIds: ["vitrina", "avtoservis", "prilavok"],
    ru: {
      name: "Стеллажи для магазина электроники",
      short: "Магазин электроники",
      lead: "Витринная выкладка телефонов, аксессуаров и мелкой техники: товар лицом к покупателю, коробки — в закрытых нижних ярусах или на складе.",
      points: [
        { t: "Витрина на уровне глаз", d: "Образцы — на средних полках, где их берут в руки; верх и низ — под запас." },
        { t: "Коробки не на виду", d: "Нижние ярусы и склад при магазине держат упаковки, зал остаётся чистым." },
        { t: "Под проводку и подсветку", d: "Оставляем зазоры у стены для кабелей зарядки и подсветки — согласуем на замере." },
        { t: "Одна линия по залу", d: "Секции одной высоты и цвета — магазин выглядит как фирменный, а не собранный по частям." },
      ],
      faq: [
        { q: "Подходят ли стеллажи для тяжёлой техники?", a: "Для крупной бытовой техники есть отдельная страница — там полки усиленные. Для телефонов и аксессуаров хватает торговых." },
        { q: "Можно ли добавить секции потом?", a: "Да, секции докупаются и пристыковываются к ряду." },
        { q: "Сколько стоит?", a: "Цена по проекту зала — в день бесплатного замера." },
      ],
      seoTitle: "Стеллажи для магазина электроники и телефонов в Ташкенте",
      seoDesc: "Стеллажи для магазина электроники: витрина на уровне глаз, запас в нижних ярусах, зазоры под проводку. Бесплатный замер, гарантия 10 лет.",
    },
    uz: {
      name: "Texnika doʻkoni uchun stellajlar",
      short: "Texnika doʻkoni",
      lead: "Telefon, aksessuar va mayda texnikani vitrina usulida terish: tovar xaridorga yuzi bilan, qutilar — yopiq pastki yaruslarda yoki omborda.",
      points: [
        { t: "Koʻz darajasida vitrina", d: "Namunalar — qoʻlga olinadigan oʻrta polkalarda; yuqori va past — zaxira uchun." },
        { t: "Qutilar koʻrinmaydi", d: "Pastki yaruslar va doʻkon qoshidagi ombor qadoqlarni ushlaydi, zal toza qoladi." },
        { t: "Sim va yoritish uchun", d: "Zaryad va yoritish simlari uchun devor yonida boʻshliq qoldiramiz — oʻlchovda kelishamiz." },
        { t: "Zal boʻylab bir chiziq", d: "Bir xil balandlik va rangdagi seksiyalar — doʻkon qismlardan yigʻilgandek emas, brend doʻkondek koʻrinadi." },
      ],
      faq: [
        { q: "Ogʻir texnika uchun mos keladimi?", a: "Yirik maishiy texnika uchun alohida sahifa bor — u yerda polkalar kuchaytirilgan. Telefon va aksessuarlar uchun savdo stellajlari yetarli." },
        { q: "Keyin seksiya qoʻshsa boʻladimi?", a: "Ha, seksiyalar alohida sotib olinadi va qatorga ulanadi." },
        { q: "Narxi qancha?", a: "Narx zal loyihasi boʻyicha — bepul oʻlchov kuni." },
      ],
      seoTitle: "Texnika va telefon doʻkoni uchun stellajlar Toshkentda",
      seoDesc: "Texnika doʻkoni uchun stellajlar: koʻz darajasida vitrina, zaxira pastki yaruslarda, sim uchun boʻshliq. Oʻlchov bepul, 10 yil kafolat.",
    },
  }),
  base("hoztovary", {
    cover: "/landings/retail-hoztovary.jpg",
    caseKeys: ["arzon", "sayqal"],
    reviewIds: ["muhriddin", "nurbek", "rastalar"],
    ru: {
      name: "Стеллажи для магазина хозтоваров",
      short: "Хозтовары",
      lead: "Смешанный ассортимент — от вёдер и бытовой химии до инструмента: полки разной глубины и нагрузки в одном ряду, крупное внизу, мелочь на уровне глаз.",
      points: [
        { t: "Разный вес в одном ряду", d: "Под краску и мешки — усиленные нижние полки, под мелочь — обычные сверху." },
        { t: "Крупногабарит без хаоса", d: "Вёдра, тазы и сушилки стоят на своих полках, а не стопками в проходе." },
        { t: "Бытовая химия отдельно", d: "Химию держим на отдельных стеллажах, подальше от продуктовой зоны, если она есть." },
        { t: "Покраска, которая не облезает", d: "Порошковая окраска выдерживает трение вёдер и коробок." },
      ],
      faq: [
        { q: "Выдержат ли полки банки с краской?", a: "Да, нижние ярусы рассчитываем под тяжёлый товар. Назовите самый тяжёлый товар — подберём нагрузку." },
        { q: "Нужен ли склад при магазине?", a: "Если товар приходит паллетами или крупными партиями — да. Проектируем зал и склад одним заказом." },
        { q: "Как заказать?", a: "Оставьте заявку или позвоните — замер бесплатный, план и цена в день замера." },
      ],
      seoTitle: "Стеллажи для магазина хозтоваров в Ташкенте — RAXPRO",
      seoDesc: "Стеллажи для хозяйственного магазина: усиленные полки под краску и мешки, мелочь на уровне глаз, склад при магазине. Замер бесплатно, гарантия 10 лет.",
    },
    uz: {
      name: "Xoʻjalik mollari doʻkoni uchun stellajlar",
      short: "Xoʻjalik mollari",
      lead: "Aralash assortiment — chelak va maishiy kimyodan asbob-uskunagacha: bitta qatorda turli chuqurlik va yuklamali polkalar, yirik narsalar pastda, mayda tovar koʻz darajasida.",
      points: [
        { t: "Bitta qatorda turli ogʻirlik", d: "Boʻyoq va qoplar uchun — kuchaytirilgan pastki polkalar, mayda tovar uchun — yuqorida oddiylari." },
        { t: "Yirik tovar tartibli", d: "Chelak, togʻora va quritgichlar yoʻlakda ustma-ust emas, oʻz polkalarida turadi." },
        { t: "Maishiy kimyo alohida", d: "Kimyoni alohida stellajlarda, oziq-ovqat boʻlimi boʻlsa undan uzoqroqda saqlaymiz." },
        { t: "Koʻchmaydigan boʻyoq", d: "Kukunli boʻyoq chelak va qutilar ishqalanishiga chidaydi." },
      ],
      faq: [
        { q: "Polkalar boʻyoq bankalarini koʻtaradimi?", a: "Ha, pastki yaruslar ogʻir tovarga hisoblanadi. Eng ogʻir tovaringizni ayting — yuklamani tanlab beramiz." },
        { q: "Doʻkon qoshida ombor kerakmi?", a: "Tovar palletlarda yoki katta partiyalarda kelsa — ha. Zal va omborni bitta buyurtmada loyihalaymiz." },
        { q: "Qanday buyurtma beriladi?", a: "Ariza qoldiring yoki qoʻngʻiroq qiling — oʻlchov bepul, reja va narx oʻlchov kuni." },
      ],
      seoTitle: "Xoʻjalik mollari doʻkoni uchun stellajlar Toshkentda",
      seoDesc: "Xoʻjalik doʻkoni uchun stellajlar: boʻyoq va qoplar uchun kuchaytirilgan polkalar, mayda tovar koʻz darajasida, doʻkon qoshida ombor. Oʻlchov bepul, 10 yil kafolat.",
    },
  }),
  base("bytovaya-tehnika", {
    cover: "/landings/retail-bytovaya-tehnika.jpg",
    caseKeys: ["star", "bloom"],
    reviewIds: ["sobirjon", "vitrina", "muhriddin"],
    productSlugs: ["torgovyy-stellazh", "srednegruzovoy-stellazh-2000x2000x600"],
    ru: {
      name: "Стеллажи для магазина бытовой техники",
      short: "Бытовая техника",
      lead: "Крупные коробки — чайники, микроволновки, пылесосы — на усиленных полках в зале и на складе при магазине. Холодильники и стиральные машины — на полу, стеллажи — вокруг.",
      points: [
        { t: "Усиленные полки", d: "В зале и на складе ставим среднегрузовые: 300–400 кг на ярус, коробки с техникой полку не гнут." },
        { t: "Глубина под коробку", d: "Полки глубиной 600 мм — коробка микроволновки стоит целиком, не свисает в проход." },
        { t: "Склад за стеной", d: "Запас держим на складе при магазине, в зале — по одному образцу." },
        { t: "Проходы под тележку", d: "Расстановка оставляет место для тележки с крупной коробкой." },
      ],
      faq: [
        { q: "Какую нагрузку держит полка?", a: "Среднегрузовые — 300–400 кг на ярус по прайсу. Для паллет с техникой на складе — паллетные стеллажи до 1000 кг на ярус." },
        { q: "Есть ли готовые размеры с ценой?", a: "Да, среднегрузовые 2000×2000×600 есть в каталоге с ценой. Остальное — по проекту." },
        { q: "Делаете склад и зал вместе?", a: "Да, один замер и один проект на зал и склад." },
      ],
      seoTitle: "Стеллажи для магазина бытовой техники в Ташкенте — RAXPRO",
      seoDesc: "Стеллажи для магазина бытовой техники: усиленные полки 300–400 кг на ярус, глубина 600 мм под коробки, склад при магазине. Замер бесплатно, гарантия 10 лет.",
    },
    uz: {
      name: "Maishiy texnika doʻkoni uchun stellajlar",
      short: "Maishiy texnika",
      lead: "Yirik qutilar — choynak, mikrotoʻlqinli pech, changyutgich — zalda va doʻkon omborida kuchaytirilgan polkalarda. Muzlatkich va kir yuvish mashinalari polda, stellajlar — atrofida.",
      points: [
        { t: "Kuchaytirilgan polkalar", d: "Zal va omborga oʻrta yuklamali qoʻyamiz: har yarusga 300–400 kg, texnika qutilari polkani egmaydi." },
        { t: "Quti chuqurligiga mos", d: "600 mm chuqurlikdagi polkalar — mikrotoʻlqinli pech qutisi toʻliq sigʻadi, yoʻlakka osilib turmaydi." },
        { t: "Devor ortida ombor", d: "Zaxira doʻkon omborida, zalda esa bittadan namuna." },
        { t: "Aravacha uchun yoʻlak", d: "Joylashtirish katta qutili aravachaga joy qoldiradi." },
      ],
      faq: [
        { q: "Polka qancha yuk koʻtaradi?", a: "Oʻrta yuklamali — narxnoma boʻyicha har yarusga 300–400 kg. Omborda texnikali palletlar uchun — har yarusga 1000 kg gacha palletli stellajlar." },
        { q: "Narxi aniq tayyor oʻlchamlar bormi?", a: "Ha, 2000×2000×600 oʻrta yuklamali stellaj katalogda narxi bilan bor. Qolgani — loyiha boʻyicha." },
        { q: "Ombor va zalni birga qilasizlarmi?", a: "Ha, zal va ombor uchun bitta oʻlchov va bitta loyiha." },
      ],
      seoTitle: "Maishiy texnika doʻkoni uchun stellajlar Toshkentda — RAXPRO",
      seoDesc: "Maishiy texnika doʻkoni uchun stellajlar: har yarusga 300–400 kg, qutilar uchun 600 mm chuqurlik, doʻkon qoshida ombor. Oʻlchov bepul, 10 yil kafolat.",
    },
  }),
  base("gipermarket", {
    cover: "/landings/retail-gipermarket.jpg",
    caseKeys: ["star", "arzon", "caffelito"],
    reviewIds: ["sobirjon", "nurbek", "muhriddin"],
    productSlugs: ["torgovyy-stellazh", "palletnyy-stellazh-4000x2700x1050"],
    ru: {
      name: "Стеллажи для гипермаркета",
      short: "Гипермаркет",
      lead: "Торговый зал, бэк-офис и склад приёмки одним проектом: торговые стеллажи в зале, паллетные — на складе, среднегрузовые — в подсобках отделов.",
      points: [
        { t: "Три зоны — один подрядчик", d: "Зал, склад и подсобки проектируем вместе: проходы, погрузчик и поток товара сходятся на плане." },
        { t: "Паллеты на складе", d: "Паллетные стеллажи до 1000 кг на ярус с доступом погрузчиком к каждому месту." },
        { t: "Единый вид зала", d: "Секции одной серии и цвета по всем отделам." },
        { t: "Расширение без переделки", d: "Ряды достраиваются секциями, когда открываются новые отделы." },
      ],
      faq: [
        { q: "Вы работаете с крупными объектами?", a: "Да, среди клиентов — дистрибьюторы и производства. Посмотрите кейсы выше." },
        { q: "Сколько занимает проект?", a: "План и КП — в день замера для небольших объектов; для гипермаркета срок называем после замера." },
        { q: "Как проходит оплата?", a: "Условия оплаты и график фиксируем в договоре — обсудим на замере." },
      ],
      seoTitle: "Стеллажи для гипермаркета и супермаркета в Ташкенте — RAXPRO",
      seoDesc: "Стеллажи для гипермаркета: торговый зал, склад приёмки и подсобки одним проектом. Паллетные до 1000 кг на ярус, гарантия 10 лет, бесплатный замер.",
    },
    uz: {
      name: "Gipermarket uchun stellajlar",
      short: "Gipermarket",
      lead: "Savdo zali, bek-ofis va qabul ombori bitta loyihada: zalda savdo stellajlari, omborda palletli, boʻlimlarning orqa xonalarida oʻrta yuklamali.",
      points: [
        { t: "Uch zona — bitta pudratchi", d: "Zal, ombor va orqa xonalarni birga loyihalaymiz: yoʻlaklar, pogruzchik va tovar oqimi rejada mos keladi." },
        { t: "Omborda palletlar", d: "Har yarusga 1000 kg gacha palletli stellajlar, har bir joyga pogruzchik bilan kirish." },
        { t: "Zalning yagona koʻrinishi", d: "Barcha boʻlimlarda bitta seriya va rangdagi seksiyalar." },
        { t: "Qayta qurmasdan kengaytirish", d: "Yangi boʻlimlar ochilganda qatorlar seksiyalar bilan davom ettiriladi." },
      ],
      faq: [
        { q: "Katta obyektlar bilan ishlaysizlarmi?", a: "Ha, mijozlar orasida distribyutorlar va ishlab chiqarish korxonalari bor. Yuqoridagi keyslarni koʻring." },
        { q: "Loyiha qancha vaqt oladi?", a: "Kichik obyektlar uchun reja va tijoriy taklif oʻlchov kuni; gipermarket uchun muddatni oʻlchovdan keyin aytamiz." },
        { q: "Toʻlov qanday amalga oshiriladi?", a: "Toʻlov shartlari va jadvali shartnomada belgilanadi — oʻlchovda kelishamiz." },
      ],
      seoTitle: "Gipermarket va supermarket uchun stellajlar Toshkentda",
      seoDesc: "Gipermarket uchun stellajlar: savdo zali, qabul ombori va orqa xonalar bitta loyihada. Har yarusga 1000 kg gacha palletli, 10 yil kafolat, oʻlchov bepul.",
    },
  }),
  base("minimarket", {
    cover: "/landings/retail-minimarket.jpg",
    caseKeys: ["arzon"],
    reviewIds: ["nurbek", "muhriddin", "salohiddin"],
    ru: {
      name: "Стеллажи для минимаркета",
      short: "Минимаркет",
      lead: "На маленькой площади выигрывает высота: пристенные стеллажи под потолок, узкие островные в центре и запас на верхних ярусах. Монтаж — без закрытия магазина надолго.",
      points: [
        { t: "Высота вместо площади", d: "Пристенные до 2200 мм: верхний ярус — под запас, зал не заставлен коробками." },
        { t: "Узкие острова", d: "В центре — невысокие островные, чтобы продавец видел весь зал с кассы." },
        { t: "Быстрый монтаж", d: "Секции собираются на месте; план и цена — в день бесплатного замера." },
        { t: "Докупка по мере роста", d: "Новые секции пристыковываются к ряду, когда растёт ассортимент." },
      ],
      faq: [
        { q: "Сколько секций поместится в мой зал?", a: "Пришлите размеры зала — посчитаем. Или вызовите замерщика: бесплатно, план в тот же день." },
        { q: "Можно ли закрыть магазин на один день?", a: "Монтаж небольшого зала обычно укладывается в короткий срок; точную дату и длительность согласуем в договоре." },
        { q: "Какая гарантия?", a: "10 лет по договору." },
      ],
      seoTitle: "Стеллажи для минимаркета в Ташкенте — пристенные и островные",
      seoDesc: "Стеллажи для минимаркета: пристенные под потолок, узкие островные, запас на верхних ярусах. Бесплатный замер, план в день замера, гарантия 10 лет.",
    },
    uz: {
      name: "Minimarket uchun stellajlar",
      short: "Minimarket",
      lead: "Kichik maydonda balandlik yutadi: shiftgacha devoriy stellajlar, oʻrtada tor orol stellajlar va yuqori yaruslarda zaxira. Oʻrnatish — doʻkonni uzoq yopmasdan.",
      points: [
        { t: "Maydon oʻrniga balandlik", d: "2200 mm gacha devoriy: yuqori yarus — zaxira uchun, zal qutilar bilan toʻlmaydi." },
        { t: "Tor orollar", d: "Oʻrtada — past orol stellajlar, sotuvchi kassadan butun zalni koʻradi." },
        { t: "Tez oʻrnatish", d: "Seksiyalar joyida yigʻiladi; reja va narx — bepul oʻlchov kuni." },
        { t: "Oʻsishga qarab qoʻshish", d: "Assortiment kengayganda yangi seksiyalar qatorga ulanadi." },
      ],
      faq: [
        { q: "Zalimga nechta seksiya sigʻadi?", a: "Zal oʻlchamlarini yuboring — hisoblaymiz. Yoki oʻlchovchini chaqiring: bepul, reja shu kuni." },
        { q: "Doʻkonni bir kunga yopsa boʻladimi?", a: "Kichik zalni oʻrnatish odatda qisqa muddatda bajariladi; aniq sana va davomiylik shartnomada kelishiladi." },
        { q: "Kafolat qanday?", a: "Shartnoma boʻyicha 10 yil." },
      ],
      seoTitle: "Minimarket uchun stellajlar Toshkentda — devoriy va orol",
      seoDesc: "Minimarket uchun stellajlar: shiftgacha devoriy, tor orol, yuqori yaruslarda zaxira. Oʻlchov bepul, reja oʻlchov kuni, 10 yil kafolat.",
    },
  }),
];
