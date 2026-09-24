// Хабы «Услуги» и «Покупателям» (ТЗ 24.09, этап 5) — как разделы Prostellaj.
// Ведут на уже существующие страницы сайта и на новые посадки из service.js.
// Тексты карточек — только факты, которые уже есть на сайте.

export const HUBS = {
  uslugi: {
    path: "/uslugi",
    cover: "/cases/star-1.jpg",
    ru: {
      title: "Услуги",
      h1: "Услуги RAXPRO: от замера до монтажа",
      lead: "Работаем полным циклом: замер, проект расстановки, комплектация со склада в Ташкенте, доставка и монтаж. По Ташкенту замер, доставка и монтаж бесплатны.",
      seoTitle: "Услуги RAXPRO — замер, проект, доставка и монтаж",
      seoDesc: "Полный цикл RAXPRO: бесплатный замер, проект расстановки, поставка со склада, доставка и монтаж стеллажей. По Ташкенту — бесплатно. Гарантия 10 лет.",
      formTitle: "Назначим бесплатный замер",
      items: [
        { t: "Монтаж стеллажей", d: "Свои монтажники, анкеровка и сборка по чертежу. По Ташкенту бесплатно.", path: "/uslugi/montazh-stellazhej" },
        { t: "Доставка и оплата", d: "По Ташкенту бесплатно и на следующий день, по регионам — до 7 рабочих дней.", path: "/dostavka-i-oplata" },
        { t: "Проект и расчёт онлайн", d: "Соберите стеллаж в конструкторе и получите предварительный расчёт.", path: "/konstruktor" },
        { t: "Шоурум", d: "Посмотрите металл, покраску и замки вживую до заказа.", path: "/shourum" },
      ],
    },
    uz: {
      title: "Xizmatlar",
      h1: "RAXPRO xizmatlari: oʻlchovdan montajgacha",
      lead: "Toʻliq sikl bilan ishlaymiz: oʻlchov, joylashtirish loyihasi, Toshkentdagi ombordan komplektatsiya, yetkazib berish va montaj. Toshkent boʻylab oʻlchov, yetkazish va montaj bepul.",
      seoTitle: "RAXPRO xizmatlari — oʻlchov, loyiha, yetkazish va montaj",
      seoDesc: "RAXPRO toʻliq sikli: bepul oʻlchov, joylashtirish loyihasi, ombordan yetkazib berish va stellajlarni montaj qilish. Toshkent boʻylab — bepul. 10 yil kafolat.",
      formTitle: "Bepul oʻlchovni belgilaymiz",
      items: [
        { t: "Stellajlarni montaj qilish", d: "Oʻz montajchilarimiz, chizma boʻyicha ankerlash va yigʻish. Toshkent boʻylab bepul.", path: "/uslugi/montazh-stellazhej" },
        { t: "Yetkazib berish va toʻlov", d: "Toshkent boʻylab bepul va ertasi kuni, viloyatlarga — 7 ish kunigacha.", path: "/dostavka-i-oplata" },
        { t: "Onlayn loyiha va hisob", d: "Konstruktorda stellajni yigʻing va dastlabki hisobni oling.", path: "/konstruktor" },
        { t: "Shourum", d: "Buyurtmadan oldin metall, boʻyoq va qulflarni jonli koʻring.", path: "/shourum" },
      ],
    },
  },
  pokupatelyam: {
    path: "/pokupatelyam",
    cover: "/cases/discovery-1.jpg",
    ru: {
      title: "Покупателям",
      h1: "Покупателям",
      lead: "Всё, что нужно знать до заказа: гарантия, доставка и оплата, возврат, договор-оферта и отзывы клиентов.",
      seoTitle: "Покупателям — гарантия, доставка, оплата и возврат | RAXPRO",
      seoDesc: "Информация для покупателей RAXPRO: гарантия 10 лет по договору, доставка по Ташкенту бесплатно, оплата, возврат и обмен, публичная оферта.",
      formTitle: "Остались вопросы?",
      items: [
        { t: "Гарантия 10 лет", d: "По договору, гарантийный документ после монтажа.", path: "/pokupatelyam/garantiya" },
        { t: "Доставка и оплата", d: "По Ташкенту бесплатно и на следующий день, по регионам — до 7 рабочих дней.", path: "/dostavka-i-oplata" },
        { t: "Возврат и обмен", d: "Условия возврата и обмена продукции.", path: "/vozvrat-i-obmen" },
        { t: "Публичная оферта", d: "Условия договора купли-продажи.", path: "/publichnaya-oferta" },
        { t: "Отзывы клиентов", d: "Видео и слова владельцев складов и магазинов.", path: "/otzyvy" },
        { t: "Портфолио", d: "Реализованные проекты с цифрами по каждому объекту.", path: "/portfolio" },
      ],
    },
    uz: {
      title: "Xaridorlarga",
      h1: "Xaridorlarga",
      lead: "Buyurtmadan oldin bilish kerak boʻlgan hamma narsa: kafolat, yetkazib berish va toʻlov, qaytarish, oferta shartnomasi va mijozlar fikrlari.",
      seoTitle: "Xaridorlarga — kafolat, yetkazib berish, toʻlov va qaytarish",
      seoDesc: "RAXPRO xaridorlari uchun maʼlumot: shartnoma boʻyicha 10 yil kafolat, Toshkent boʻylab bepul yetkazish, toʻlov, qaytarish va almashtirish, ommaviy oferta.",
      formTitle: "Savollar qoldimi?",
      items: [
        { t: "10 yillik kafolat", d: "Shartnoma boʻyicha, montajdan keyin kafolat hujjati.", path: "/pokupatelyam/garantiya" },
        { t: "Yetkazib berish va toʻlov", d: "Toshkent boʻylab bepul va ertasi kuni, viloyatlarga — 7 ish kunigacha.", path: "/dostavka-i-oplata" },
        { t: "Qaytarish va almashtirish", d: "Mahsulotni qaytarish va almashtirish shartlari.", path: "/vozvrat-i-obmen" },
        { t: "Ommaviy oferta", d: "Oldi-sotdi shartnomasi shartlari.", path: "/publichnaya-oferta" },
        { t: "Mijozlar fikrlari", d: "Ombor va doʻkon egalarining videolari va soʻzlari.", path: "/otzyvy" },
        { t: "Portfolio", d: "Har bir obyekt boʻyicha raqamlar bilan amalga oshirilgan loyihalar.", path: "/portfolio" },
      ],
    },
  },
};
