// Кейсы для блока «Проекты». Каждая цифра здесь — из постов канала
// @RaxPro_otziv (id поста в `src`) или с raxpro.uz. Ничего не досчитано:
// если у проекта нет объёма или срока — строки просто нет.
// Фото: public/cases/* — кадры из тех же постов.

export const CASES = [
  {
    key: "bloom",
    src: [225, 272],
    logo: null,
    img: "/cases/bloom-1.jpg",
    gallery: ["/cases/bloom-2.jpg", "/cases/bloom-3.jpg"],
    ru: {
      client: "Bloom Shop",
      title: "Склад косметики для маркетплейса",
      lead: "30 комплектов среднегрузовых стеллажей под ключ — холдинг после этого передал нам следующий проект.",
      rows: [
        ["Объект", "Склад интернет-магазина косметики, Ташкент"],
        ["Продукт", "Среднегрузовые стеллажи"],
        ["Объём", "30 комплектов"],
        ["Параметры", "Высота 2,5 м · 5 ярусов · до 400 кг на ярус"],
        ["Результат", "Повторный заказ холдинга — STAR DISTRIBUTION, Самарканд"],
      ],
    },
    uz: {
      client: "Bloom Shop",
      title: "Marketpleys uchun kosmetika ombori",
      lead: "30 komplekt oʻrta yuklamali stellaj kalit topshirish sharti bilan — shundan soʻng xolding bizga keyingi loyihasini ham ishondi.",
      rows: [
        ["Obyekt", "Kosmetika internet-doʻkoni ombori, Toshkent"],
        ["Mahsulot", "Oʻrta yuklamali stellajlar"],
        ["Hajm", "30 komplekt"],
        ["Parametrlar", "Balandligi 2,5 m · 5 yarus · har yarusga 400 kg gacha"],
        ["Natija", "Xoldingning takroriy buyurtmasi — STAR DISTRIBUTION, Samarqand"],
      ],
    },
  },
  {
    key: "star",
    src: [242],
    logo: null,
    img: "/cases/star-1.jpg",
    gallery: ["/cases/star-2.jpg"],
    ru: {
      client: "STAR DISTRIBUTION",
      title: "Новый склад дистрибьютора в Самарканде",
      lead: "10 комплектов доставлены из Ташкента и смонтированы за 7 часов.",
      rows: [
        ["Объект", "Склад дистрибуции, Самарканд"],
        ["Продукт", "Среднегрузовые стеллажи"],
        ["Объём", "10 комплектов"],
        ["Срок", "Доставка и монтаж — 7 часов"],
        ["Результат", "Второй проект холдинга после Bloom Shop"],
      ],
    },
    uz: {
      client: "STAR DISTRIBUTION",
      title: "Distribyutorning Samarqanddagi yangi ombori",
      lead: "10 komplekt Toshkentdan yetkazilib, 7 soat ichida oʻrnatildi.",
      rows: [
        ["Obyekt", "Distribusiya ombori, Samarqand"],
        ["Mahsulot", "Oʻrta yuklamali stellajlar"],
        ["Hajm", "10 komplekt"],
        ["Muddat", "Yetkazish va montaj — 7 soat"],
        ["Natija", "Bloom Shopdan keyin xoldingning ikkinchi loyihasi"],
      ],
    },
  },
  {
    key: "cold",
    src: [229],
    logo: null,
    img: "/cases/cold-1.jpg",
    gallery: ["/cases/cold-2.jpg"],
    ru: {
      client: "Холодильный склад мясной продукции",
      title: "Паллетные стеллажи в морозильной камере",
      lead: "Площадь хранения выросла вдвое — использовали высоту камеры, а не пол.",
      rows: [
        ["Объект", "Холодильная камера, Ташкент"],
        ["Продукт", "Паллетные стеллажи"],
        ["Параметры", "Высота 4 м · до 3 т на ярус"],
        ["Результат", "Площадь хранения ×2 при той же камере"],
      ],
    },
    uz: {
      client: "Goʻsht mahsulotlari sovuq ombori",
      title: "Muzlatkich kamerasida palletli stellajlar",
      lead: "Saqlash maydoni ikki baravar oshdi — poldan emas, kamera balandligidan foydalandik.",
      rows: [
        ["Obyekt", "Sovuq kamera, Toshkent"],
        ["Mahsulot", "Palletli stellajlar"],
        ["Parametrlar", "Balandligi 4 m · har yarusga 3 t gacha"],
        ["Natija", "Oʻsha kamerada saqlash maydoni ×2"],
      ],
    },
  },
  {
    key: "caffelito",
    src: [182, 73, 68],
    logo: "/clients/logo_02.png",
    img: "/cases/caffelito-1.jpg",
    gallery: ["/cases/caffelito-2.jpg", "/cases/caffelito-3.jpg"],
    ru: {
      client: "Caffelito Coffee",
      title: "Склад сети кофеен — постоянный клиент",
      lead: "Постоянный клиент: паллетные стеллажи 4 м поставлены и смонтированы за 12 часов.",
      rows: [
        ["Объект", "Склад кофейни, Ташкент"],
        ["Продукт", "Паллетные стеллажи"],
        ["Параметры", "Высота 4 м · глубина 105 см · 1,5 т на ярус"],
        ["Срок", "Поставка и монтаж — 12 часов"],
        ["Результат", "Несколько проектов для одного клиента"],
      ],
    },
    uz: {
      client: "Caffelito Coffee",
      title: "Kofexonalar tarmogʻi ombori — doimiy mijoz",
      lead: "Doimiy mijoz: 4 m palletli stellajlar 12 soat ichida yetkazilib oʻrnatildi.",
      rows: [
        ["Obyekt", "Kofexona ombori, Toshkent"],
        ["Mahsulot", "Palletli stellajlar"],
        ["Parametrlar", "Balandligi 4 m · chuqurligi 105 sm · har yarusga 1,5 t"],
        ["Muddat", "Yetkazish va montaj — 12 soat"],
        ["Natija", "Bitta mijoz uchun bir nechta loyiha"],
      ],
    },
  },
  {
    key: "discovery",
    src: [72, 135],
    logo: "/clients/logo_04.png",
    img: "/cases/discovery-1.jpg",
    gallery: [],
    ru: {
      client: "Discovery Invest × Radisson",
      title: "Складские и архивные стеллажи для гостиничной сети",
      lead: "59 комплектов складских стеллажей поставлены и смонтированы для Discovery Invest и отелей Radisson.",
      rows: [
        ["Объект", "Складские помещения девелопера и отелей Radisson"],
        ["Продукт", "Складские и архивные стеллажи"],
        ["Объём", "59 комплектов"],
        ["Результат", "Отдельный заказ на архивные стеллажи"],
      ],
    },
    uz: {
      client: "Discovery Invest × Radisson",
      title: "Mehmonxona tarmogʻi uchun ombor va arxiv stellajlari",
      lead: "Discovery Invest va Radisson mehmonxonalari uchun 59 komplekt ombor stellaji yetkazilib oʻrnatildi.",
      rows: [
        ["Obyekt", "Developer va Radisson mehmonxonalari ombor xonalari"],
        ["Mahsulot", "Ombor va arxiv stellajlari"],
        ["Hajm", "59 komplekt"],
        ["Natija", "Arxiv stellajlariga alohida buyurtma"],
      ],
    },
  },
  {
    key: "superpack",
    src: [156],
    logo: null,
    img: "/cases/superpack-1.jpg",
    gallery: [],
    ru: {
      client: "Super Pack",
      title: "Паллетные стеллажи для завода бумаги и упаковки",
      lead: "Крупнейший в Узбекистане завод упаковки — стеллажи под тяжёлую паллетную нагрузку.",
      rows: [
        ["Объект", "Производственный склад завода"],
        ["Продукт", "Паллетные стеллажи"],
        ["Задача", "Сертифицированная система под тяжёлую нагрузку"],
      ],
    },
    uz: {
      client: "Super Pack",
      title: "Qogʻoz va qadoqlash zavodi uchun palletli stellajlar",
      lead: "Oʻzbekistondagi eng yirik qadoqlash zavodi — ogʻir pallet yuklamasiga moʻljallangan stellajlar.",
      rows: [
        ["Obyekt", "Zavodning ishlab chiqarish ombori"],
        ["Mahsulot", "Palletli stellajlar"],
        ["Vazifa", "Ogʻir yuklamaga moʻljallangan sertifikatlangan tizim"],
      ],
    },
  },
  {
    key: "jac",
    src: [94],
    logo: null,
    img: "/cases/jac-1.jpg",
    gallery: [],
    ru: {
      client: "JAC Motors",
      title: "Склад автомобильного завода",
      lead: "Паллетные стеллажи под интенсивную работу погрузочной техники.",
      rows: [
        ["Объект", "Склад автозавода"],
        ["Продукт", "Паллетные стеллажи"],
        ["Задача", "Интенсивная работа погрузочной техники"],
      ],
    },
    uz: {
      client: "JAC Motors",
      title: "Avtomobil zavodi ombori",
      lead: "Yuklash texnikasining jadal ishlashiga moʻljallangan palletli stellajlar.",
      rows: [
        ["Obyekt", "Avtozavod ombori"],
        ["Mahsulot", "Palletli stellajlar"],
        ["Vazifa", "Yuklash texnikasining jadal ishlashi"],
      ],
    },
  },
  {
    key: "elite",
    src: [234, 235],
    logo: null,
    img: "/cases/elite-1.jpg",
    gallery: ["/cases/elite-2.jpg"],
    ru: {
      client: "Elite Sport",
      title: "Склад магазина спортивной одежды",
      lead: "6 комплектов — и через день клиент докупил ещё 2.",
      rows: [
        ["Объект", "Склад магазина, Ташкент"],
        ["Продукт", "Среднегрузовые стеллажи"],
        ["Объём", "6 комплектов + 2 повторно"],
        ["Результат", "Докупка на следующий день после монтажа"],
      ],
    },
    uz: {
      client: "Elite Sport",
      title: "Sport kiyimlari doʻkoni ombori",
      lead: "6 komplekt — ertasi kuniyoq mijoz yana 2 ta qoʻshib oldi.",
      rows: [
        ["Obyekt", "Doʻkon ombori, Toshkent"],
        ["Mahsulot", "Oʻrta yuklamali stellajlar"],
        ["Hajm", "6 komplekt + 2 takroriy"],
        ["Natija", "Montajdan keyingi kuni qoʻshimcha xarid"],
      ],
    },
  },
  {
    key: "arzon",
    src: [52, 47],
    logo: null,
    img: "/cases/arzon-1.jpg",
    gallery: ["/cases/arzon-2.jpg"],
    ru: {
      client: "Arzon Market",
      title: "Торговый зал продуктового магазина в Паркенте",
      lead: "20 комплектов торговых стеллажей — владелец отмечает больше покупателей и выручки.",
      rows: [
        ["Объект", "Продуктовый магазин, Паркентский район"],
        ["Продукт", "Торговые стеллажи"],
        ["Объём", "20 комплектов"],
        ["Результат", "Товар разложен, покупателей и выручки стало больше — со слов владельца"],
      ],
    },
    uz: {
      client: "Arzon Market",
      title: "Parkentdagi oziq-ovqat doʻkoni savdo zali",
      lead: "20 komplekt savdo stellaji — egasi xaridor va daromad oshganini aytadi.",
      rows: [
        ["Obyekt", "Oziq-ovqat doʻkoni, Parkent tumani"],
        ["Mahsulot", "Savdo stellajlari"],
        ["Hajm", "20 komplekt"],
        ["Natija", "Tovar tartibga keldi, xaridor va daromad oshdi — egasining soʻzlari"],
      ],
    },
  },
  {
    key: "alkan",
    src: [74],
    logo: null,
    img: "/cases/alkan-1.jpg",
    gallery: ["/cases/alkan-2.jpg"],
    ru: {
      client: "Alkan Stone",
      title: "Склад литьевого камня",
      lead: "Тяжёлый штучный товар — полки до 400 кг, высота 2–2,5 м.",
      rows: [
        ["Объект", "Склад производителя камня"],
        ["Продукт", "Складские стеллажи"],
        ["Параметры", "Высота 2–2,5 м · до 400 кг на полку"],
      ],
    },
    uz: {
      client: "Alkan Stone",
      title: "Quyma tosh ombori",
      lead: "Ogʻir dona tovar — 400 kg gacha polkalar, balandligi 2–2,5 m.",
      rows: [
        ["Obyekt", "Tosh ishlab chiqaruvchi ombori"],
        ["Mahsulot", "Ombor stellajlari"],
        ["Parametrlar", "Balandligi 2–2,5 m · har polkaga 400 kg gacha"],
      ],
    },
  },
  {
    key: "sayqal",
    src: [176, 178],
    logo: null,
    img: "/cases/sayqal-2.jpg",
    gallery: ["/cases/sayqal-1.jpg"],
    ru: {
      client: "Sayqal Family Restaurant",
      title: "Склад ресторана по индивидуальному проекту",
      lead: "Сначала проектный дизайн под помещение, потом монтаж по нему.",
      rows: [
        ["Объект", "Складское помещение ресторана"],
        ["Продукт", "Среднегрузовые стеллажи по проекту"],
        ["Этапы", "Проект → производство → монтаж"],
      ],
    },
    uz: {
      client: "Sayqal Family Restaurant",
      title: "Restoran ombori — individual loyiha boʻyicha",
      lead: "Avval xonaga mos loyiha dizayni, keyin shu boʻyicha montaj.",
      rows: [
        ["Obyekt", "Restoran ombor xonasi"],
        ["Mahsulot", "Loyiha boʻyicha oʻrta yuklamali stellajlar"],
        ["Bosqichlar", "Loyiha → ishlab chiqarish → montaj"],
      ],
    },
  },
];

export function localizeCase(c, lang) {
  const l = c[lang === "uz" ? "uz" : "ru"];
  return { key: c.key, logo: c.logo, img: c.img, gallery: c.gallery, ...l };
}
