// Кейсы для блока «Проекты». Структура — история клиента, а не техпаспорт
// (разбор 22.09): задача → решение → 3–4 цифры → цитата → «Хочу так же».
// Факты — из постов канала @RaxPro_otziv (id поста в `src`) или с raxpro.uz.
// Цифры с пометкой PLACEHOLDER — заглушки до данных клиента (Умид разрешил
// 22.09): площадь, срок от замера до сдачи и цитаты у первых четырёх кейсов.
// Если факта нет и заглушка не поставлена — строки просто нет.
// Порядок = порядок показа: узнаваемые бренды первыми.
// Фото: public/cases/* — кадры из тех же постов.
//
// segment: warehouse · shop · marketplace · production — чипсы-фильтры в блоке.

export const SEGMENTS = ["warehouse", "shop", "marketplace", "production"];

export const CASES = [
  {
    key: "discovery",
    src: [72, 135],
    segment: "warehouse",
    logo: "/clients/logo_04.png",
    img: "/cases/discovery-1.jpg",
    gallery: [],
    ru: {
      client: "Discovery Invest × Radisson",
      title: "Складские и архивные стеллажи для гостиничной сети",
      task: "Хозяйственные склады девелопера и отелей Radisson: бельё, инвентарь и документы хранились в коробках на полу, найти нужное быстро не получалось.",
      solution: "Складские стеллажи для хозблоков и отдельная партия архивных — под коробки с документами.",
      stats: [
        ["59", "комплектов смонтировано"],
        ["5", "дней от замера до сдачи"], // PLACEHOLDER
        ["2", "заказа: склад + архив"],
      ],
      quote: { text: "Порядок в хозблоке появился за неделю — теперь всё на полках, а не по коробкам.", who: "Служба эксплуатации" }, // PLACEHOLDER
    },
    uz: {
      client: "Discovery Invest × Radisson",
      title: "Mehmonxona tarmogʻi uchun ombor va arxiv stellajlari",
      task: "Developer va Radisson mehmonxonalarining xoʻjalik omborlari: choyshab, inventar va hujjatlar polda qutilarda turardi, keraklisini tez topib boʻlmasdi.",
      solution: "Xoʻjalik bloklari uchun ombor stellajlari va hujjat qutilari uchun alohida arxiv stellajlari partiyasi.",
      stats: [
        ["59", "komplekt oʻrnatildi"],
        ["5", "kun oʻlchovdan topshirishgacha"], // PLACEHOLDER
        ["2", "buyurtma: ombor + arxiv"],
      ],
      quote: { text: "Xoʻjalik blokida tartib bir haftada paydo boʻldi — endi hammasi qutilarda emas, polkalarda.", who: "Ekspluatatsiya xizmati" }, // PLACEHOLDER
    },
  },
  {
    key: "bloom",
    src: [225, 272],
    segment: "marketplace",
    logo: null,
    img: "/cases/bloom-1.jpg",
    gallery: ["/cases/bloom-2.jpg", "/cases/bloom-3.jpg"],
    ru: {
      client: "Bloom Shop",
      title: "Склад косметики для маркетплейса",
      task: "Интернет-магазин косметики рос быстрее склада: мелкий товар в коробках на полу, сборка заказов замедлялась с каждой новой поставкой.",
      solution: "Среднегрузовые стеллажи 2,5 м, 5 ярусов, до 400 кг на ярус — под коробки и ручной сбор заказов.",
      stats: [
        ["30", "комплектов под ключ"],
        ["3", "дня от замера до сдачи"], // PLACEHOLDER
        ["180 м²", "площадь склада"], // PLACEHOLDER
        ["×2", "повторный заказ холдинга"],
      ],
      quote: { text: "После этого склада холдинг передал нам следующий проект — STAR DISTRIBUTION в Самарканде.", who: "RAXPRO о результате" },
    },
    uz: {
      client: "Bloom Shop",
      title: "Marketpleys uchun kosmetika ombori",
      task: "Kosmetika internet-doʻkoni ombordan tezroq oʻsdi: mayda tovar polda qutilarda, har yangi yetkazmada buyurtma yigʻish sekinlashardi.",
      solution: "2,5 m, 5 yarusli, har yarusga 400 kg gacha oʻrta yuklamali stellajlar — qutilar va qoʻlda buyurtma yigʻish uchun.",
      stats: [
        ["30", "komplekt kalit topshirish sharti bilan"],
        ["3", "kun oʻlchovdan topshirishgacha"], // PLACEHOLDER
        ["180 m²", "ombor maydoni"], // PLACEHOLDER
        ["×2", "xoldingning takroriy buyurtmasi"],
      ],
      quote: { text: "Shu ombordan keyin xolding bizga keyingi loyihani ham ishondi — Samarqanddagi STAR DISTRIBUTION.", who: "RAXPRO natija haqida" },
    },
  },
  {
    key: "star",
    src: [242],
    segment: "warehouse",
    logo: null,
    img: "/cases/star-1.jpg",
    gallery: ["/cases/star-2.jpg"],
    ru: {
      client: "STAR DISTRIBUTION",
      title: "Новый склад дистрибьютора в Самарканде",
      task: "Новый склад в Самарканде надо было запустить сразу: без стеллажей — без приёмки товара.",
      solution: "10 комплектов среднегрузовых стеллажей со склада в Ташкенте — доставка и монтаж в один день.",
      stats: [
        ["10", "комплектов"],
        ["7 ч", "доставка и монтаж"],
        ["300 км", "Ташкент → Самарканд"],
        ["2-й", "проект холдинга"],
      ],
      quote: { text: "Утром выехали из Ташкента — к вечеру склад уже принимал товар.", who: "Монтажная бригада RAXPRO" }, // PLACEHOLDER
    },
    uz: {
      client: "STAR DISTRIBUTION",
      title: "Distribyutorning Samarqanddagi yangi ombori",
      task: "Samarqanddagi yangi omborni darhol ishga tushirish kerak edi: stellajsiz — tovar qabul qilib boʻlmaydi.",
      solution: "Toshkentdagi ombordan 10 komplekt oʻrta yuklamali stellaj — yetkazish va montaj bir kunda.",
      stats: [
        ["10", "komplekt"],
        ["7 soat", "yetkazish va montaj"],
        ["300 km", "Toshkent → Samarqand"],
        ["2-chi", "xolding loyihasi"],
      ],
      quote: { text: "Ertalab Toshkentdan chiqdik — kechqurun ombor allaqachon tovar qabul qilardi.", who: "RAXPRO montaj brigadasi" }, // PLACEHOLDER
    },
  },
  {
    key: "caffelito",
    src: [182, 73, 68],
    segment: "warehouse",
    logo: null,
    img: "/cases/caffelito-1.jpg",
    gallery: ["/cases/caffelito-2.jpg", "/cases/caffelito-3.jpg"],
    ru: {
      client: "Caffelito Coffee",
      title: "Склад сети кофеен — постоянный клиент",
      task: "Паллеты с кофе и расходниками для сети кофеен стояли на полу — склад заканчивался раньше, чем поставки.",
      solution: "Паллетные стеллажи 4 м, глубина 105 см, 1,5 т на ярус — паллеты поднялись вверх.",
      stats: [
        ["4 м", "высота стеллажей"],
        ["12 ч", "поставка и монтаж"],
        ["1,5 т", "на ярус"],
        ["3", "проекта для одного клиента"],
      ],
      quote: { text: "Возвращаемся к RAXPRO с каждым новым складом — знаем, что соберут за день.", who: "Caffelito Coffee" }, // PLACEHOLDER
    },
    uz: {
      client: "Caffelito Coffee",
      title: "Kofexonalar tarmogʻi ombori — doimiy mijoz",
      task: "Kofexonalar tarmogʻi uchun kofe va sarf materiallari palletlari polda turardi — ombor yetkazmalardan oldin tugab qolardi.",
      solution: "4 m, chuqurligi 105 sm, har yarusga 1,5 t palletli stellajlar — palletlar yuqoriga koʻtarildi.",
      stats: [
        ["4 m", "stellaj balandligi"],
        ["12 soat", "yetkazish va montaj"],
        ["1,5 t", "har yarusga"],
        ["3", "loyiha bitta mijoz uchun"],
      ],
      quote: { text: "Har yangi ombor bilan RAXPROga qaytamiz — bir kunda yigʻib berishini bilamiz.", who: "Caffelito Coffee" }, // PLACEHOLDER
    },
  },
  {
    key: "cold",
    src: [79],
    segment: "warehouse",
    logo: null,
    img: "/cases/cold-1.jpg",
    gallery: ["/cases/cold-2.jpg"],
    ru: {
      client: "Холодильный склад мясной продукции",
      title: "Паллетные стеллажи в морозильной камере",
      task: "Морозильная камера заполнялась по полу — половина объёма под потолком пустовала, а расширять холод дорого.",
      solution: "Паллетные стеллажи 4 м, до 3 т на ярус — использовали высоту камеры, а не пол.",
      stats: [
        ["×2", "площадь хранения"],
        ["4 м", "высота стеллажей"],
        ["3 т", "на ярус"],
      ],
    },
    uz: {
      client: "Goʻsht mahsulotlari sovuq ombori",
      title: "Muzlatkich kamerasida palletli stellajlar",
      task: "Muzlatkich kamerasi pol boʻylab toʻlardi — shift ostidagi hajmning yarmi boʻsh turardi, sovuqni kengaytirish esa qimmat.",
      solution: "4 m, har yarusga 3 t gacha palletli stellajlar — poldan emas, kamera balandligidan foydalandik.",
      stats: [
        ["×2", "saqlash maydoni"],
        ["4 m", "stellaj balandligi"],
        ["3 t", "har yarusga"],
      ],
    },
  },
  {
    key: "elite",
    src: [234, 235],
    segment: "shop",
    logo: null,
    img: "/cases/elite-1.jpg",
    gallery: ["/cases/elite-2.jpg"],
    ru: {
      client: "Elite Sport",
      title: "Склад магазина спортивной одежды",
      task: "Коробки с одеждой на складе магазина лежали штабелями — за нужным размером приходилось разбирать стопку.",
      solution: "Среднегрузовые стеллажи под коробки — каждый артикул на своей полке.",
      stats: [
        ["6", "комплектов"],
        ["+2", "докупили на следующий день"],
        ["1", "день монтажа"],
      ],
      quote: { text: "Через день после монтажа клиент докупил ещё два комплекта.", who: "RAXPRO о результате" },
    },
    uz: {
      client: "Elite Sport",
      title: "Sport kiyimlari doʻkoni ombori",
      task: "Doʻkon omborida kiyim qutilari ustma-ust turardi — kerakli oʻlchamni topish uchun butun toʻplamni ochish kerak edi.",
      solution: "Qutilar uchun oʻrta yuklamali stellajlar — har artikul oʻz polkasida.",
      stats: [
        ["6", "komplekt"],
        ["+2", "ertasi kuni qoʻshib oldi"],
        ["1", "kun montaj"],
      ],
      quote: { text: "Montajdan bir kun oʻtib mijoz yana ikki komplekt qoʻshib oldi.", who: "RAXPRO natija haqida" },
    },
  },
  {
    key: "arzon",
    src: [52, 47],
    segment: "shop",
    logo: null,
    img: "/cases/arzon-1.jpg",
    gallery: ["/cases/arzon-2.jpg"],
    ru: {
      client: "Arzon Market",
      title: "Торговый зал продуктового магазина в Паркенте",
      task: "Товар в продуктовом магазине стоял на паллетах и в коробках на полу — покупатели рылись, проходы забиты.",
      solution: "Торговые стеллажи по всему залу: товар на витрине, проход посередине свободен.",
      stats: [
        ["20", "комплектов торговых стеллажей"],
        ["1", "торговый зал целиком"],
      ],
      quote: { text: "Товар разложен, покупателей и выручки стало больше.", who: "Владелец Arzon Market" },
    },
    uz: {
      client: "Arzon Market",
      title: "Parkentdagi oziq-ovqat doʻkoni savdo zali",
      task: "Oziq-ovqat doʻkonida tovar palletlarda va polda qutilarda turardi — xaridorlar titkilardi, yoʻlaklar band edi.",
      solution: "Butun zal boʻylab savdo stellajlari: tovar vitrinada, oʻrtadagi yoʻlak boʻsh.",
      stats: [
        ["20", "komplekt savdo stellaji"],
        ["1", "savdo zali toʻliq"],
      ],
      quote: { text: "Tovar tartibga keldi, xaridor va daromad oshdi.", who: "Arzon Market egasi" },
    },
  },
  {
    key: "alkan",
    src: [74],
    segment: "production",
    logo: null,
    img: "/cases/alkan-1.jpg",
    gallery: ["/cases/alkan-2.jpg"],
    ru: {
      client: "Alkan Stone",
      title: "Склад литьевого камня",
      task: "Тяжёлый штучный товар — плиты и заготовки — лежал на полу: нижние портились под весом, нужную позицию было не достать.",
      solution: "Полочные стеллажи под тяжёлый штучный груз: до 400 кг на полку, высота 2–2,5 м.",
      stats: [
        ["400 кг", "на полку"],
        ["2,5 м", "высота"],
      ],
    },
    uz: {
      client: "Alkan Stone",
      title: "Quyma tosh ombori",
      task: "Ogʻir dona tovar — plitalar va zagotovkalar — polda turardi: pastdagilar ogʻirlikdan buzilardi, keraklisini olib boʻlmasdi.",
      solution: "Ogʻir dona yuk uchun polkali stellajlar: har polkaga 400 kg gacha, balandligi 2–2,5 m.",
      stats: [
        ["400 kg", "har polkaga"],
        ["2,5 m", "balandligi"],
      ],
    },
  },
  {
    key: "superpack",
    src: [156, "tg:618414", "tg:618424"],
    segment: "production",
    logo: null,
    img: "/cases/superpack-1.jpg",
    gallery: ["/cases/superpack-2.jpg", "/cases/superpack-3.jpg", "/cases/superpack-4.jpg"],
    ru: {
      client: "Super Pack",
      title: "Паллетные стеллажи для завода бумаги и упаковки",
      task: "Крупнейшему в Узбекистане заводу упаковки нужна была сертифицированная система под тяжёлые паллеты с рулонами.",
      solution: "Паллетные стеллажи под тяжёлую нагрузку — с расчётом и сертификатом на систему.",
      stats: [
        ["№1", "завод упаковки в Узбекистане"],
        ["850 т", "новой ёмкости хранения"],
        ["4 т", "расчётная нагрузка на ярус"],
      ],
    },
    uz: {
      client: "Super Pack",
      title: "Qogʻoz va qadoqlash zavodi uchun palletli stellajlar",
      task: "Oʻzbekistondagi eng yirik qadoqlash zavodiga rulonli ogʻir palletlar uchun sertifikatlangan tizim kerak edi.",
      solution: "Ogʻir yuklamaga moʻljallangan palletli stellajlar — hisob-kitob va tizim sertifikati bilan.",
      stats: [
        ["№1", "Oʻzbekistondagi qadoqlash zavodi"],
        ["850 t", "yangi saqlash sigʻimi"],
        ["4 t", "har yarusga hisobiy yuklama"],
      ],
    },
  },
  {
    key: "jac",
    src: [94, "tg:618428", "tg:618433"],
    segment: "production",
    logo: null,
    img: "/cases/jac-1.jpg",
    gallery: ["/cases/jac-2.jpg", "/cases/jac-3.jpg"],
    ru: {
      client: "JAC Motors",
      title: "Склад автомобильного завода",
      task: "Склад запчастей автозавода с интенсивной работой погрузчиков: стеллажи должны держать не только вес, но и удары техники.",
      solution: "Паллетные стеллажи с защитой стоек и отбойниками у проходов — под постоянное движение погрузчиков.",
      stats: [
        ["300 т", "новой ёмкости хранения"],
        ["24/7", "работа погрузчиков"],
        ["4 т", "на ярус"],
      ],
    },
    uz: {
      client: "JAC Motors",
      title: "Avtomobil zavodi ombori",
      task: "Yuklagichlar jadal ishlaydigan avtozavod ehtiyot qismlar ombori: stellajlar faqat ogʻirlikni emas, texnika zarbalariga ham bardosh berishi kerak.",
      solution: "Tayanchlar himoyasi va yoʻlaklarda toʻsiqlar bilan palletli stellajlar — yuklagichlarning doimiy harakati uchun.",
      stats: [
        ["300 t", "yangi saqlash sigʻimi"],
        ["24/7", "yuklagichlar ishi"],
        ["4 t", "har yarusga"],
      ],
    },
  },
  {
    key: "sayqal",
    src: [176, 178],
    segment: "warehouse",
    logo: null,
    img: "/cases/sayqal-2.jpg",
    gallery: ["/cases/sayqal-1.jpg"],
    ru: {
      client: "Sayqal Family Restaurant",
      title: "Склад ресторана по индивидуальному проекту",
      task: "Складское помещение ресторана неправильной формы: типовые секции не вставали, место под потолком пропадало.",
      solution: "Сначала проект расстановки под помещение, потом комплектация со склада и монтаж по чертежу.",
      stats: [
        ["3", "этапа: проект → комплектация → монтаж"],
        ["100 %", "площади под хранение"],
      ],
    },
    uz: {
      client: "Sayqal Family Restaurant",
      title: "Restoran ombori — individual loyiha boʻyicha",
      task: "Restoranning notoʻgʻri shakldagi ombor xonasi: tipik seksiyalar sigʻmasdi, shift ostidagi joy bekor ketardi.",
      solution: "Avval xonaga mos joylashtirish loyihasi, keyin ombordan komplektatsiya va chizma boʻyicha montaj.",
      stats: [
        ["3", "bosqich: loyiha → komplektatsiya → montaj"],
        ["100 %", "maydon saqlash uchun"],
      ],
    },
  },
  // Три кейса от Муродбека 24.09.2026 (личка @TohirovMurodbek, id сообщений в src).
  // Цифры — только его: «было / стало» паллетомест. Имя автосклада не названо —
  // кейс без имени; Mirvali Group названа в их же публичном посте.
  {
    key: "avtozapchast",
    src: ["tg:618402", "tg:618409"],
    segment: "warehouse",
    logo: null,
    img: "/cases/avtozapchast-1.jpg",
    gallery: ["/cases/avtozapchast-2.jpg", "/cases/avtozapchast-3.jpg"],
    ru: {
      client: "Склад автозапчастей",
      title: "Паллетный склад дистрибьютора автозапчастей",
      task: "На складе помещалось 120 паллет: товар стоял на полу, высота ангара пропадала.",
      solution: "Паллетные стеллажи в несколько ярусов по всему складу — доставка и монтаж бесплатно.",
      stats: [
        ["120 → 460", "паллетомест"],
        ["×3,8", "вместимость склада"],
      ],
    },
    uz: {
      client: "Avtoehtiyot qismlar ombori",
      title: "Avtoehtiyot qismlar distribyutorining palletli ombori",
      task: "Omborga 120 ta pallet sigʻardi: tovar polda turardi, angar balandligi bekor ketardi.",
      solution: "Butun ombor boʻylab koʻp yarusli palletli stellajlar — yetkazib berish va montaj bepul.",
      stats: [
        ["120 → 460", "pallet oʻrni"],
        ["×3,8", "ombor sigʻimi"],
      ],
    },
  },
  {
    key: "mirvali",
    src: ["tg:618410", "tg:618413"],
    segment: "warehouse",
    logo: null,
    img: "/cases/mirvali-1.jpg",
    gallery: ["/cases/mirvali-2.jpg", "/cases/mirvali-3.jpg"],
    ru: {
      client: "Mirvali Group",
      title: "Склад дистрибьютора моторных масел",
      task: "Компания торгует моторными маслами. До стеллажей склад вмещал 60 паллет.",
      solution: "Паллетные стеллажи на всю высоту склада: товар разложен по ячейкам, у каждой паллеты своё место.",
      stats: [
        ["60 → 300", "паллетомест"],
        ["×5", "вместимость склада"],
      ],
    },
    uz: {
      client: "Mirvali Group",
      title: "Motor moylari distribyutori ombori",
      task: "Kompaniya motor moylari sotadi. Stellajlar oʻrnatilgunga qadar omborga 60 ta pallet sigʻardi.",
      solution: "Omborning butun balandligiga palletli stellajlar: tovar kataklarga joylangan, har bir palletning oʻz joyi bor.",
      stats: [
        ["60 → 300", "pallet oʻrni"],
        ["×5", "ombor sigʻimi"],
      ],
    },
  },
  {
    key: "xonadon",
    src: ["tg:618425"],
    segment: "warehouse",
    logo: null,
    img: "/cases/xonadon-1.jpg",
    gallery: ["/cases/xonadon-2.jpg"],
    ru: {
      client: "Частный дом",
      title: "Кладовая в доме",
      task: "Хозяйственную кладовую нужно было занять полками от пола до потолка, не теряя угол.",
      solution: "Угловой ряд полочных стеллажей вдоль двух стен — в фирменных цветах RAXPRO.",
      stats: [
        ["2", "стены — угловой ряд"],
        ["10 лет", "гарантия по договору"],
      ],
    },
    uz: {
      client: "Xususiy uy",
      title: "Uydagi xoʻjalik xonasi",
      task: "Xoʻjalik xonasini burchakni yoʻqotmasdan, poldan shiftgacha polkalar bilan toʻldirish kerak edi.",
      solution: "Ikki devor boʻylab burchakli polkali stellajlar qatori — RAXPRO brend ranglarida.",
      stats: [
        ["2", "devor — burchakli qator"],
        ["10 yil", "shartnoma boʻyicha kafolat"],
      ],
    },
  },
];

export function localizeCase(c, lang) {
  const l = c[lang === "uz" ? "uz" : "ru"];
  return { key: c.key, segment: c.segment, logo: c.logo, img: c.img, gallery: c.gallery, ...l };
}
