// Строки магазина: каталог, карточка товара, корзина, оформление заказа.
// Держим отдельно от lib/i18n.js — тот уже большой и отвечает за главную.
export const SHOP = {
  ru: {
    // Навигация и общие
    home: 'Главная',
    catalog: 'Каталог',
    catalogTitle: 'Каталог стеллажей с ценами',
    catalogLead:
      'Шесть видов стеллажей в наличии на складе в Ташкенте. Типовые секции — с точной ценой, размерами и нагрузкой; набивные, торговые и мезонины считаем по проекту под ваше помещение за 24 часа.',
    catalogSeoTitle: 'Каталог стеллажей в Ташкенте — цены со склада | RAXPRO',
    catalogSeoDesc:
      'Металлические стеллажи RAXPRO: паллетные, набивные drive-in, среднегрузовые, архивные, торговые и мезонины. Типовые секции с ценами, остальное — по проекту. 150 тонн в наличии на складе в Ташкенте, гарантия 10 лет.',

    // Карточка в списке
    more: 'Подробнее',
    addToCart: 'В корзину',
    added: 'Добавлено ✓',
    inStock: 'В наличии',
    sku: 'Артикул',
    from: 'Цена за эту конфигурацию',
    priceNote: 'Другие размеры и количество ярусов — считаем по замеру.',
    // Позиции без фиксированной цены (набивные, торговые, мезонин)
    toOrder: 'Под заказ',
    byProject: 'Цена по проекту',
    byProjectNote: 'Считаем по замеру: размеры, нагрузка, планировка помещения. Расчёт — в течение 24 часов.',
    withEngineer: 'Рассчитать с инженером',
    inKonstruktor: 'Собрать в конструкторе',

    // Страница товара
    buyNow: 'Купить в 1 клик',
    specs: 'Характеристики',
    description: 'Описание',
    whatIncluded: 'Что входит в цену',
    included: [
      'Секция в сборе: рамы, балки и настил',
      'Крепёж и защита стоек',
      'Доставка по Ташкенту — бесплатно',
      'Гарантийный документ на 10 лет',
    ],
    delivery: 'Доставка и оплата',
    deliveryShort:
      'По Ташкенту доставка и монтаж бесплатно, привезём завтра. По регионам — до 7 рабочих дней. Оплата перечислением, наличными или в рассрочку.',
    otherSize: 'Нужен другой размер?',
    otherSizeText:
      'Подберём секцию под ваши габариты и нагрузку. Бесплатный замер и расчёт в течение 24 часов.',
    otherSizeCta: 'Рассчитать под мой склад',
    relatedTitle: 'Другие товары каталога',
    aboutType: 'Подробнее о типе стеллажа',
    qty: 'Количество',
    total: 'Итого',
    guarantee: 'Гарантия 10 лет по договору',
    madeDays: 'В наличии — привезём завтра по Ташкенту',

    // Корзина
    cart: 'Корзина',
    cartTitle: 'Ваш заказ',
    cartEmpty: 'В корзине пока пусто',
    cartEmptyText: 'Выберите стеллаж в каталоге — цена и характеристики указаны на каждой карточке.',
    toCatalog: 'Перейти в каталог',
    remove: 'Удалить',
    sum: 'Сумма',
    itemsTotal: 'Товаров на сумму',
    checkout: 'Оформление заказа',
    checkoutNote:
      'Онлайн-оплата не требуется. Менеджер перезвонит, подтвердит наличие и сроки, и выставит счёт удобным способом.',

    // Форма оформления
    fName: 'Имя',
    fPhone: 'Телефон',
    fCity: 'Город / адрес доставки',
    fComment: 'Комментарий к заказу',
    fCommentPh: 'Этаж, сроки, особые требования',
    submit: 'Оформить заказ',
    sending: 'Отправляем…',
    errPhone: 'Укажите телефон — по нему подтвердим заказ',
    errSend: 'Не удалось отправить. Позвоните нам, пожалуйста',
    agree: 'Нажимая кнопку, вы соглашаетесь с',
    agreeLink: 'условиями оферты',
    agreeTail: '',

    // Спасибо
    thanksTitle: 'Заказ принят',
    thanksText:
      'Мы получили ваш заказ. Менеджер свяжется с вами в течение рабочего дня: подтвердит наличие, срок поставки и выставит счёт.',
    orderNo: 'Номер заказа',
    thanksBack: 'Вернуться в каталог',
  },

  uz: {
    home: 'Bosh sahifa',
    catalog: 'Katalog',
    catalogTitle: 'Stellajlar katalogi va narxlari',
    catalogLead:
      'Toshkentdagi omborimizda mavjud olti xil stellaj. Tipovoy seksiyalar — aniq narxi, oʻlchamlari va yuklamasi bilan; zich, savdo stellajlari va mezoninlarni xonangizga moslab 24 soatda loyiha boʻyicha hisoblaymiz.',
    catalogSeoTitle: 'Toshkentda stellajlar katalogi — ombordan narxlar | RAXPRO',
    catalogSeoDesc:
      'RAXPRO metall stellajlari: palletli, zich drive-in, oʻrta yuklamali, arxiv, savdo stellajlari va mezoninlar. Tipovoy seksiyalar narxi bilan, qolgani — loyiha boʻyicha. Omborda doim mavjud, 10 yil kafolat.',

    more: 'Batafsil',
    addToCart: 'Savatga',
    added: 'Qoʻshildi ✓',
    inStock: 'Mavjud',
    sku: 'Artikul',
    from: 'Ushbu konfiguratsiya narxi',
    priceNote: 'Boshqa oʻlchamlar va yaruslar soni — oʻlchovdan keyin hisoblanadi.',
    toOrder: 'Buyurtmaga',
    byProject: 'Narx loyiha boʻyicha',
    byProjectNote: 'Oʻlchovdan keyin hisoblaymiz: oʻlchamlar, yuklama, xona tartibi. Hisob-kitob — 24 soat ichida.',
    withEngineer: 'Muhandis bilan hisoblash',
    inKonstruktor: 'Konstruktorda yigʻish',

    buyNow: '1 bosishda sotib olish',
    specs: 'Xususiyatlari',
    description: 'Tavsifi',
    whatIncluded: 'Narxga nima kiradi',
    included: [
      'Yigʻilgan seksiya: ramkalar, balkalar va qoplama',
      'Mahkamlagichlar va tayanch himoyasi',
      'Toshkent boʻylab yetkazish — bepul',
      '10 yillik kafolat hujjati',
    ],
    delivery: 'Yetkazib berish va toʻlov',
    deliveryShort:
      'Toshkent boʻyicha yetkazish va montaj bepul, ertaga yetkazamiz. Viloyatlarga — 7 ish kunigacha. Toʻlov pul oʻtkazma, naqd yoki boʻlib toʻlash orqali.',
    otherSize: 'Boshqa oʻlcham kerakmi?',
    otherSizeText:
      'Seksiyani sizning gabarit va yuklamangizga moslab tayyorlaymiz. Bepul oʻlchov va 24 soat ichida hisob-kitob.',
    otherSizeCta: 'Omborimga hisoblab bering',
    relatedTitle: 'Katalogdagi boshqa mahsulotlar',
    aboutType: 'Stellaj turi haqida batafsil',
    qty: 'Miqdori',
    total: 'Jami',
    guarantee: 'Shartnoma boʻyicha 10 yil kafolat',
    madeDays: 'Omborda mavjud — Toshkent boʻyicha ertaga yetkazamiz',

    cart: 'Savat',
    cartTitle: 'Sizning buyurtmangiz',
    cartEmpty: 'Savat hozircha boʻsh',
    cartEmptyText: 'Katalogdan stellaj tanlang — har bir kartochkada narxi va xususiyatlari koʻrsatilgan.',
    toCatalog: 'Katalogga oʻtish',
    remove: 'Oʻchirish',
    sum: 'Summa',
    itemsTotal: 'Mahsulotlar summasi',
    checkout: 'Buyurtmani rasmiylashtirish',
    checkoutNote:
      'Onlayn toʻlov talab qilinmaydi. Menejer qoʻngʻiroq qilib, mavjudligi va muddatlarni tasdiqlaydi hamda qulay usulda hisob-faktura yuboradi.',

    fName: 'Ism',
    fPhone: 'Telefon',
    fCity: 'Shahar / yetkazish manzili',
    fComment: 'Buyurtmaga izoh',
    fCommentPh: 'Qavat, muddat, maxsus talablar',
    submit: 'Buyurtma berish',
    sending: 'Yuborilmoqda…',
    errPhone: 'Telefon raqamini kiriting — buyurtmani shu orqali tasdiqlaymiz',
    errSend: 'Yuborib boʻlmadi. Iltimos, qoʻngʻiroq qiling',
    agree: 'Tugmani bosish orqali siz',
    agreeLink: 'oferta shartlariga',
    agreeTail: 'rozilik bildirasiz',

    thanksTitle: 'Buyurtma qabul qilindi',
    thanksText:
      'Buyurtmangizni oldik. Menejer ish kuni davomida bogʻlanadi: mavjudligi, tayyorlash muddatini tasdiqlaydi va hisob-faktura yuboradi.',
    orderNo: 'Buyurtma raqami',
    thanksBack: 'Katalogga qaytish',
  },
};
