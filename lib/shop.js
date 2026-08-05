// Строки магазина: каталог, карточка товара, корзина, оформление заказа.
// Держим отдельно от lib/i18n.js — тот уже большой и отвечает за главную.
export const SHOP = {
  ru: {
    // Навигация и общие
    home: 'Главная',
    catalog: 'Каталог',
    catalogTitle: 'Каталог стеллажей с ценами',
    catalogLead:
      'Готовые типовые секции собственного производства — с точной ценой, размерами и нагрузкой. Нужен другой размер — рассчитаем под ваше помещение за 24 часа.',
    catalogSeoTitle: 'Каталог стеллажей в Ташкенте — цены от производителя | RAXPRO',
    catalogSeoDesc:
      'Металлические стеллажи RAXPRO с ценами: паллетные, среднегрузовые, архивные. Собственное производство, гарантия 10 лет, бесплатная доставка по Ташкенту.',

    // Карточка в списке
    more: 'Подробнее',
    addToCart: 'В корзину',
    added: 'Добавлено ✓',
    inStock: 'В наличии',
    sku: 'Артикул',
    from: 'Цена за эту конфигурацию',
    priceNote: 'Другие размеры и количество ярусов — считаем по замеру.',

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
      'По Ташкенту бесплатно, срок изготовления 3–10 рабочих дней. Оплата перечислением, наличными или в рассрочку.',
    otherSize: 'Нужен другой размер?',
    otherSizeText:
      'Изготовим секцию под ваши габариты и нагрузку. Бесплатный замер и расчёт в течение 24 часов.',
    otherSizeCta: 'Рассчитать под мой склад',
    relatedTitle: 'Другие товары каталога',
    aboutType: 'Подробнее о типе стеллажа',
    qty: 'Количество',
    total: 'Итого',
    guarantee: 'Гарантия 10 лет по документу',
    madeDays: 'Срок изготовления: 3–10 рабочих дней',

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
      'Мы получили ваш заказ. Менеджер свяжется с вами в течение рабочего дня: подтвердит наличие, срок изготовления и выставит счёт.',
    orderNo: 'Номер заказа',
    thanksBack: 'Вернуться в каталог',
  },

  uz: {
    home: 'Bosh sahifa',
    catalog: 'Katalog',
    catalogTitle: 'Stellajlar katalogi va narxlari',
    catalogLead:
      'Oʻz ishlab chiqarishimizdagi tayyor tipovoy seksiyalar — aniq narxi, oʻlchamlari va yuklamasi bilan. Boshqa oʻlcham kerak boʻlsa, xonangizga moslab 24 soatda hisoblab beramiz.',
    catalogSeoTitle: 'Toshkentda stellajlar katalogi — ishlab chiqaruvchi narxlari | RAXPRO',
    catalogSeoDesc:
      'RAXPRO metall stellajlari narxlari bilan: palletli, oʻrta yuklamali, arxiv. Oʻz ishlab chiqarishimiz, 10 yil kafolat, Toshkent boʻylab bepul yetkazish.',

    more: 'Batafsil',
    addToCart: 'Savatga',
    added: 'Qoʻshildi ✓',
    inStock: 'Mavjud',
    sku: 'Artikul',
    from: 'Ushbu konfiguratsiya narxi',
    priceNote: 'Boshqa oʻlchamlar va yaruslar soni — oʻlchovdan keyin hisoblanadi.',

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
      'Toshkent boʻylab bepul, tayyorlash muddati 3–10 ish kuni. Toʻlov pul oʻtkazma, naqd yoki boʻlib toʻlash orqali.',
    otherSize: 'Boshqa oʻlcham kerakmi?',
    otherSizeText:
      'Seksiyani sizning gabarit va yuklamangizga moslab tayyorlaymiz. Bepul oʻlchov va 24 soat ichida hisob-kitob.',
    otherSizeCta: 'Omborimga hisoblab bering',
    relatedTitle: 'Katalogdagi boshqa mahsulotlar',
    aboutType: 'Stellaj turi haqida batafsil',
    qty: 'Miqdori',
    total: 'Jami',
    guarantee: 'Hujjat asosida 10 yil kafolat',
    madeDays: 'Tayyorlash muddati: 3–10 ish kuni',

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
