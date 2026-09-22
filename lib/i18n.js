// Bilingual content (RU default + UZ Latin, formal). Homepage + shared UI.
// Uzbek: translated by meaning, formal (siz), oʻ/gʻ diacritics.

export const LANGS = ["ru", "uz"];
export const LANG_DEFAULT = "ru";

export function normalizeLang(v) {
  return v === "uz" ? "uz" : "ru";
}

export const NAV_T = {
  ru: [
    { label: "Каталог", href: "/katalog" },
    { label: "О компании", href: "/o-kompanii" },
    { label: "Конструктор", href: "/konstruktor" },
    { label: "Продукция", href: "/#napravleniya" },
    { label: "Проекты", href: "/#proekty" },
    { label: "Блог", href: "/blog" },
    { label: "Команда", href: "/experts" },
    { label: "Контакты", href: "/kontakty" },
  ],
  uz: [
    { label: "Katalog", href: "/katalog" },
    { label: "Kompaniya", href: "/o-kompanii" },
    { label: "Konstruktor", href: "/konstruktor" },
    { label: "Mahsulotlar", href: "/#napravleniya" },
    { label: "Loyihalar", href: "/#proekty" },
    { label: "Blog", href: "/blog" },
    { label: "Jamoa", href: "/experts" },
    { label: "Aloqa", href: "/kontakty" },
  ],
};

export const T = {
  ru: {
    thankYouTitle: "Ваша заявка принята!",
    continueTg: "Продолжить в Telegram",
    thankYouDesc:
      "Спасибо за доверие к нам. Наши специалисты свяжутся с вами в ближайшее время и ответят на все ваши вопросы.",
    backToHome: "Вернуться на главную",
    haveQuestions: "Есть срочные вопросы?",
    callUs: "Позвоните нам",
    teamTitle: "Наши Специалисты",
    teamText:
      "Наша команда профессионалов с многолетним опытом проанализирует ваши потребности и предложит наиболее оптимальные решения.",

    consult: "Консультация",
    heroEyebrow: "Системы хранения · Ташкент",
    heroTitle1: "Стеллажи и системы",
    heroTitle2: "хранения",
    heroTitleAccent: "полного цикла",
    heroText:
      "Поставляем со склада и монтируем стеллажи любого типа по всему Узбекистану. Нагрузка до 4 тонн · гарантия 10 лет · бесплатный замер за 24 часа.",
    heroCta1: "Рассчитать стоимость за 1 минуту",
    heroCta2: "Смотреть направления",
    heroChips: [
      "До 300 м² под ключ за 1 день",
      "Гарантия 10 лет по договору",
      "Отвечаем за 5 минут",
      "Рассрочка и лизинг",
    ],
    heroPrice: "Проекты от 1,2 млн сум · бесплатный расчёт за 24 часа",
    clients: "Нам доверяют",
    clientsCount: "2000+",
    clientsText: "клиентов по Узбекистану — от маркетплейсов до заводов",

    calcEyebrow: "Калькулятор",
    calcTitle1: "Рассчитайте стоимость стеллажей",
    calcTitleAccent: "за 1 минуту",
    calcText:
      "Ответьте на 4 вопроса — менеджер подготовит точный расчёт и коммерческое предложение. Бесплатный замер и проект за 24 часа, отвечаем в течение 5 минут.",
    calcOpen: "Пройти опрос — 4 вопроса",
    calcOpenNote: "Меньше минуты · без звонка · ни к чему не обязывает",
    calcSteps: ["Тип стеллажей", "Где будете использовать", "Нагрузка на ярус", "Объём"],
    calcFeatures: [
      "Точная цена под вашу задачу",
      "Бесплатный выезд и замер",
      "Рассрочка Uzum Nasiya до 25 млн сум",
      "Гарантия 10 лет по договору",
    ],

    procEyebrow: "Циклы",
    procTitle: "Контроль на всех этапах — от замера до готового объекта",
    procText:
      "RAXPRO — поставщик полного цикла. Мы отвечаем за каждый этап: от выезда на объект до монтажа «под ключ», поэтому качество и сроки под нашим контролем.",
    steps: [
      {
        t: "Замер",
        d: "Бесплатно выезжаем на объект, замеряем помещение, проёмы и реальные нагрузки.",
      },
      {
        t: "Проектирование",
        d: "Проектируем систему хранения под вашу задачу и считаем точную стоимость.",
      },
      {
        t: "Комплектация со склада",
        d: "Собираем заказ с нашего склада в Ташкенте: металл 1 сорта, оцинковка и порошковая покраска.",
      },
      {
        t: "Монтаж",
        d: "Доставляем и монтируем «под ключ». По Ташкенту — бесплатно.",
      },
    ],

    // Блок «нам доверяют» на главной. Цифры с пометкой PLACEHOLDER — временные,
    // до фактов от клиента (22.09: Умид разрешил заглушки, заменим оригиналом).
    trustTitle: { before: "", n: "1000+", after: " складов в Узбекистане уже работают на наших стеллажах" },
    trustText: "От маркетплейсов до заводов: склады, магазины, архивы и производства.",
    trustStats: [
      { n: "1000+", s: "", l: "складов оборудовано" },
      { n: "50 000+", s: "", l: "паллетомест смонтировано" }, // PLACEHOLDER
      { n: "5", s: "дней", l: "средний срок от замера до сдачи" }, // PLACEHOLDER
      { n: "4,9", s: "★", l: "Google · 120 отзывов" }, // PLACEHOLDER
      { n: "40", s: "", l: "человек в штате — свои монтажники" },
      { n: "12", s: "", l: "регионов Узбекистана" }, // PLACEHOLDER
    ],

    dirEyebrow: "Продукция",
    dirTitle: "Наши основные направления работы",
    dirText:
      "Шесть ключевых типов стеллажей и системы хранения любого масштаба — от одной секции до проектов на несколько миллиардов сум.",
    directions: [
      {
        t: "Паллетные (Mega) стеллажи",
        d: "Для складов и логистики: хранение на паллетах, доступ погрузочной техникой.",
      },
      {
        t: "Среднегрузовые стеллажи",
        d: "Универсальные металлические стеллажи для склада, производства и подсобных помещений.",
      },
      {
        t: "Архивные стеллажи",
        d: "Системное и компактное хранение документов, коробов и архивов.",
      },
      {
        t: "Торговые стеллажи",
        d: "Для магазинов, маркетов и торговых залов — презентабельный вид и удобная выкладка.",
      },
      {
        t: "Набивные (Drive-in) стеллажи",
        d: "Для однотипного товара большими партиями: погрузчик въезжает внутрь, плотность хранения выше на 60%.",
      },
      {
        t: "Мезонин",
        d: "Второй этаж внутри склада: стальная платформа на стеллажных стойках даёт дополнительную площадь без стройки и аренды.",
      },
    ],
    goto: "Перейти",

    incEyebrow: "Выгода",
    incTitle: "Качественные стеллажи увеличивают доход",
    incText:
      "Хорошая система хранения — это не расход, а инвестиция, которая возвращается вместимостью, сроком службы и порядком.",
    income: [
      {
        t: "Больше вместимости",
        d: "Правильная система поднимает товар вверх и использует всю высоту помещения — вы храните в разы больше на той же площади и не платите за лишние метры.",
      },
      {
        t: "Качество и долговечность",
        d: "Металл 1 сорта, оцинковка и 10 лет гарантии. Стеллажи служат десятилетиями без замены и ремонта — экономия вместо постоянных трат.",
      },
      {
        t: "Дизайн и порядок",
        d: "Аккуратные, продуманные стеллажи улучшают вид склада и торгового зала, ускоряют выкладку и работу — а значит, повышают продажи.",
      },
    ],

    projEyebrow: "Проекты",
    projTitle: "Реальные объекты RAXPRO",
    projText:
      "Спроектировано, поставлено со склада и смонтировано «под ключ» для заводов, складов, магазинов и маркетплейсов.",

    advEyebrow: "Преимущества",
    advTitle: "Не обещания, а факты",
    advText:
      "Что отличает RAXPRO от других поставщиков стеллажей на рынке Узбекистана.",
    adv: [
      {
        t: "Гарантия 10 лет — по договору",
        d: "Единственная компания на рынке Узбекистана, которая даёт 10 лет официальной гарантии в письменном виде.",
      },
      {
        t: "Металл 1 сорта + оцинковка",
        d: "Сталь первого сорта, гальваническое покрытие и порошковая краска — прочность и срок службы десятилетиями.",
      },
      {
        t: "Всё в наличии на складе",
        d: "Поставляем стеллажи любого объёма и габарита — от 1 секции до проектов на несколько миллиардов сум.",
      },
      {
        t: "Нагрузка 100 кг – 4 тонны",
        d: "Рассчитываем конструкцию под вашу реальную нагрузку — от лёгких полок до тяжёлых паллетных систем.",
      },
      {
        t: "Полный цикл под ключ",
        d: "Замер, проектирование, комплектация со склада, доставка и монтаж. По Ташкенту все услуги бесплатно.",
      },
      {
        t: "Бесплатный расчёт за 24 часа",
        d: "Выезжаем, замеряем, проектируем и считаем стоимость — бесплатно и без обязательств.",
      },
    ],

    founderEyebrow: "Основатель",
    founderName: "Хуршид Касимов",
    founderRole: "Основатель RAXPRO",
    founderQuote: "«Доверие и порядок клиента — моя главная ценность»",
    founderP: [
      "Я из семьи предпринимателей и строителей, в бизнес пришёл в 16 лет. К 25 годам создал около 10 небольших сервисных компаний — и через множество ошибок и побед клиенты признали меня чемпионом по качественному сервису.",
      "Сегодня через RAXPRO я поставляю качественные, прочные и эстетичные металлические стеллажи — это часть моей жизни. За несколько лет мы стали одними из ведущих на рынке Узбекистана, предлагая готовые решения для магазинов, складов и фабрик.",
      "Как основатель, я лично отвечаю за каждый проект. Когда вижу упорядоченный, правильно систематизированный склад или магазин — получаю настоящее удовольствие. Буду искренне рад навести порядок и на вашем объекте.",
    ],
    certsLabel: "Завод-производитель сертифицирован по ISO 9001, 14001 и 45001",
    certsLink: "Посмотреть сертификаты",
    certsHide: "Свернуть сертификаты",

    guaranteeTitle: "официальной гарантии по договору",
    guaranteeText:
      "10 лет по договору — вдвое больше, чем обычно на рынке, и в письменном виде. Металл 1 сорта, оцинковка и порошковая краска — стеллаж служит десятилетиями.",
    yil: "лет",

    blogEyebrow: "Новости и статьи",
    blogTitle: "Полезное о стеллажах",
    blogAll: "Все статьи",

    formEyebrow: "Заявка",
    formTitle: "Получите план склада и точную цену — бесплатно",
    formText:
      "Замер за 24 часа, план и точная цена — через 1–2 дня.",

    contEyebrow: "Контакты",
    contTitle: "Свяжитесь с нами",
    phones: "Телефоны",
    hours: "Часы работы",
    address: "Адрес",
    socials: "Соцсети",
    reviews: "Отзывы",
    revEyebrow: "Отзывы",
    revTitle: "Что говорят наши клиенты",
    revText:
      "Видеоинтервью, переписки и голосовые сообщения клиентов — дословно. На главной — те, где есть конкретика; остальные на странице отзывов.",
    specialists: [
      {
        id: 1,
        name: "Хуршидбек Косимов",
        role: "Основатель и Генеральный директор (CEO)",
        specialties: [
          "Стратегическое управление",
          "Развитие бизнеса",
          "Автоматизация складов и интралогистика",
        ],
        img: "/images/team/xurshidbek.jpg",
      },
      {
        id: 2,
        name: "Исломбек Эркинов",
        role: "Руководитель отдела маркетинга (CMO)",
        specialties: [
          "Разработка маркетинговых стратегий",
          "Развитие бренда",
          "Анализ рынка и управление клиентопотоком",
        ],
        img: "/images/team/islombek.jpg",
      },
      {
        id: 3,
        name: "Нурилла Убайдуллаев",
        role: "Руководитель склада",
        specialties: [
          "Управление складскими операциями",
          "Оптимизация логистических процессов",
          "Поток материалов и операционные системы",
        ],
        img: "/images/team/nurilla.jpg",
      },
      {
        id: 4,
        name: "Муродбек Тохиров",
        role: "Финансовый директор (CFO)",
        specialties: [
          "Финансовое управление",
          "Бюджетирование и финансовое планирование",
          "Управление инвестициями и рисками",
        ],
        img: "/images/team/murodbek.jpg",
      },
      {
        id: 5,
        name: "Шахзода Ганиходжаева",
        role: "Руководитель отдела продаж (CSO)",
        specialties: [
          "Управление стратегиями продаж",
          "B2B / B2C / B2G процессы продаж",
          "Развитие команды продаж",
        ],
        img: "/images/team/shaxzoda.jpg",
      },
    ],
  },

  uz: {
    thankYouTitle: "Arizangiz qabul qilindi!",
    continueTg: "Telegramda davom etish",
    thankYouDesc:
      "Bizga ishonch bildirganingiz uchun rahmat. Mutaxassislarimiz tez orada siz bilan bog‘lanishadi va barcha savollaringizga javob berishadi.",
    backToHome: "Bosh sahifaga qaytish",
    haveQuestions: "Shoshilinch savollar bormi?",
    callUs: "Bizga qo‘ng‘iroq qiling",
    teamTitle: "Bizning Mutaxassislarimiz",
    teamText:
      "Ko'p yillik tajriba va chuqur bilimga ega mutaxassislarimiz sizning ehtiyojlaringizni tahlil qilib, eng maqbul va samarali yechimlarni taklif etadi.",
    specialists: [
      {
        id: 1,
        name: "Xurshidbek Qosimov",
        role: "Asoschi va Bosh direktor (CEO)",
        specialties: [
          "Strategik boshqaruv",
          "Biznes rivojlantirish",
          "Ombor avtomatlashtirish va intralogistika",
        ],
        img: "/images/team/xurshidbek.jpg",
      },
      {
        id: 2,
        name: "Islombek Erkinov",
        role: "Marketing bo'limi rahbari (CMO)",
        specialties: [
          "Marketing strategiyalarini ishlab chiqish",
          "Brend rivojlantirish",
          "Bozor tahlili va mijozlar oqimini boshqarish",
        ],
        img: "/images/team/islombek.jpg",
      },
      {
        id: 3,
        name: "Nurilla Ubaydullayev",
        role: "Ombor rahbari",
        specialties: [
          "Ombor operatsiyalarini boshqarish",
          "Logistika jarayonlarini optimallashtirish",
          "Materiallar oqimi va operatsion tizimlar",
        ],
        img: "/images/team/nurilla.jpg",
      },
      {
        id: 4,
        name: "Murodbek Tohirov",
        role: "Moliyaviy direktor (CFO)",
        specialties: [
          "Moliyaviy boshqaruv",
          "Byudjet va moliyaviy rejalashtirish",
          "Investitsiya va risklarni boshqarish",
        ],
        img: "/images/team/murodbek.jpg",
      },
      {
        id: 5,
        name: "Shaxzoda G‘anixo‘jayeva",
        role: "Sotuv bo'limi rahbari (CSO)",
        specialties: [
          "Sotuv strategiyalarini boshqarish",
          "B2B / B2C / B2G savdo jarayonlari",
          "Sotuv jamoasini rivojlantirish",
        ],
        img: "/images/team/shaxzoda.jpg",
      },
    ],
    consult: "Konsultatsiya",
    heroEyebrow: "Saqlash tizimlari · Toshkent",
    heroTitle1: "Stellajlar va saqlash",
    heroTitle2: "tizimlari —",
    heroTitleAccent: "toʻliq sikl",
    heroText:
      "Butun Oʻzbekiston boʻylab istalgan turdagi stellajlarni ombordan yetkazamiz va oʻrnatamiz. Yuk koʻtarish 4 tonnagacha · 10 yil kafolat · 24 soatda bepul oʻlchov.",
    heroCta1: "Narxni 1 daqiqada hisoblang",
    heroCta2: "Yoʻnalishlarni koʻrish",
    heroChips: [
      "Kuniga 300 m² gacha kalit topshirish",
      "Shartnoma boʻyicha 10 yil kafolat",
      "5 daqiqada javob beramiz",
      "Boʻlib toʻlash va lizing",
    ],
    heroPrice: "Loyihalar 1,2 mln soʻmdan · 24 soatda bepul hisob-kitob",
    clients: "Bizga ishonishadi",
    clientsCount: "2000+",
    clientsText: "mijoz Oʻzbekiston boʻylab — marketpleyslardan zavodlargacha",

    calcEyebrow: "Kalkulyator",
    calcTitle1: "Stellajlar narxini hisoblang",
    calcTitleAccent: "1 daqiqada",
    calcText:
      "4 ta savolga javob bering — menejer aniq hisob-kitob va tijorat taklifini tayyorlaydi. 24 soatda bepul oʻlchov va loyiha, 5 daqiqada javob beramiz.",
    calcOpen: "Soʻrovnomadan oʻting — 4 ta savol",
    calcOpenNote: "Bir daqiqadan kam · qoʻngʻiroqsiz · hech narsaga majbur qilmaydi",
    calcSteps: ["Stellaj turi", "Qayerda foydalanasiz", "Yarusga yuklama", "Hajmi"],
    calcFeatures: [
      "Vazifangizga mos aniq narx",
      "Bepul chiqib oʻlchov",
      "Uzum Nasiya 25 mln soʻmgacha boʻlib toʻlash",
      "Shartnoma boʻyicha 10 yil kafolat",
    ],

    procEyebrow: "Bosqichlar",
    procTitle: "Barcha bosqichlar nazorati — oʻlchovdan tayyor obyektgacha",
    procText:
      "RAXPRO — toʻliq sikl taʼminotchisi. Har bir bosqich uchun biz javob beramiz: obyektga chiqishdan «kalit topshirish» montajigacha — shuning uchun sifat va muddat bizning nazoratimizda.",
    steps: [
      {
        t: "Oʻlchov",
        d: "Obyektga bepul chiqamiz, xonani, oʻtish joylarini va real yuklamani oʻlchaymiz.",
      },
      {
        t: "Loyihalash",
        d: "Vazifangizga mos saqlash tizimini loyihalaymiz va aniq narxni hisoblaymiz.",
      },
      {
        t: "Ishlab chiqarish",
        d: "1-nav metalldan tayyorlaymiz: sinklash va kukunli boʻyoq bilan qoplaymiz.",
      },
      {
        t: "Montaj",
        d: "«Kalit topshirish» tarzida yetkazamiz va oʻrnatamiz. Toshkent boʻyicha — bepul.",
      },
    ],

    trustTitle: { before: "", n: "1000+", after: " ombor Oʻzbekiston boʻylab bizning stellajlarimizda ishlamoqda" },
    trustText: "Marketpleyslardan zavodlargacha: omborlar, doʻkonlar, arxivlar va ishlab chiqarish.",
    trustStats: [
      { n: "1000+", s: "", l: "ombor jihozlangan" },
      { n: "50 000+", s: "", l: "palleta oʻrni oʻrnatilgan" }, // PLACEHOLDER
      { n: "5", s: "kun", l: "oʻlchovdan topshirishgacha oʻrtacha muddat" }, // PLACEHOLDER
      { n: "4,9", s: "★", l: "Google · 120 ta sharh" }, // PLACEHOLDER
      { n: "40", s: "", l: "kishi shtatda — oʻz montajchilarimiz" },
      { n: "12", s: "", l: "Oʻzbekiston viloyati" }, // PLACEHOLDER
    ],

    dirEyebrow: "Mahsulotlar",
    dirTitle: "Asosiy ish yoʻnalishlarimiz",
    dirText:
      "Oltita asosiy stellaj turi va istalgan koʻlamdagi saqlash tizimlari — bitta seksiyadan milliardlab soʻmlik loyihalargacha.",
    directions: [
      {
        t: "Palletli (Mega) stellajlar",
        d: "Omborlar va logistika uchun: palletda saqlash, texnika bilan kirish imkoni.",
      },
      {
        t: "Oʻrta yuklamali stellajlar",
        d: "Ombor, ishlab chiqarish va yordamchi xonalar uchun universal metall stellajlar.",
      },
      {
        t: "Arxiv stellajlari",
        d: "Hujjatlar, qutilar va arxivlarni tizimli va ixcham saqlash.",
      },
      {
        t: "Savdo stellajlari",
        d: "Doʻkonlar, marketlar va savdo zallari uchun — chiroyli koʻrinish va qulay joylashuv.",
      },
      {
        t: "Zich (Drive-in) stellajlar",
        d: "Bir xil tovarni katta partiyalarda saqlash uchun: pogruzchik ichkariga kiradi, saqlash zichligi 60% ga yuqori.",
      },
      {
        t: "Mezonin",
        d: "Ombor ichida ikkinchi qavat: stellaj tayanchlaridagi poʻlat platforma qurilishsiz va ijarasiz qoʻshimcha maydon beradi.",
      },
    ],
    goto: "Batafsil",

    incEyebrow: "Foyda",
    incTitle: "Sifatli stellajlar daromadni oshiradi",
    incText:
      "Yaxshi saqlash tizimi — bu xarajat emas, balki sigʻim, xizmat muddati va tartib orqali qaytadigan investitsiya.",
    income: [
      {
        t: "Koʻproq sigʻim",
        d: "Toʻgʻri tizim tovarni tepaga koʻtaradi va xona balandligidan toʻliq foydalanadi — bir xil maydonda bir necha barobar koʻp saqlaysiz va ortiqcha metr uchun toʻlamaysiz.",
      },
      {
        t: "Sifat va uzoq xizmat",
        d: "1-nav metall, sinklash va 10 yil kafolat. Stellajlar oʻn yillar davomida almashtirishsiz va taʼmirsiz xizmat qiladi — doimiy xarajat oʻrniga tejamkorlik.",
      },
      {
        t: "Dizayn va tartib",
        d: "Ozoda, oʻylab tuzilgan stellajlar ombor va savdo zali koʻrinishini yaxshilaydi, joylashuv va ishni tezlashtiradi — demak, savdoni oshiradi.",
      },
    ],

    projEyebrow: "Loyihalar",
    projTitle: "RAXPRO real obyektlari",
    projText:
      "Zavodlar, omborlar, doʻkonlar va marketpleyslar uchun «kalit topshirish» tarzida loyihalangan, ombordan yetkazilgan va oʻrnatilgan.",

    advEyebrow: "Afzalliklar",
    advTitle: "Vaʼda emas, balki faktlar",
    advText:
      "RAXPRO ni Oʻzbekiston bozoridagi boshqa stellaj taʼminotchilaridan nima ajratib turadi.",
    adv: [
      {
        t: "Shartnoma boʻyicha 10 yil kafolat",
        d: "Shartnomada yozma 10 yil — bozordagi odatdagidan ikki barobar koʻp.",
      },
      {
        t: "1-nav metall + sinklash",
        d: "Birinchi nav poʻlat, galvanik qoplama va kukunli boʻyoq — mustahkamlik va oʻn yillik xizmat muddati.",
      },
      {
        t: "Omborda doim mavjud",
        d: "Istalgan hajm va oʻlchamdagi stellajlarni yetkazamiz — 1 seksiyadan bir necha milliard soʻmlik loyihalargacha.",
      },
      {
        t: "Yuklama 100 kg – 4 tonna",
        d: "Konstruktsiyani real yuklamangizga moslab hisoblaymiz — yengil polkalardan ogʻir pallet tizimlarigacha.",
      },
      {
        t: "Toʻliq sikl, kalit topshirish",
        d: "Oʻlchov, loyiha, ombordan butlash, yetkazish va montaj. Toshkent boʻyicha barcha xizmatlar bepul.",
      },
      {
        t: "24 soatda bepul hisob-kitob",
        d: "Chiqamiz, oʻlchaymiz, loyihalaymiz va narxni hisoblaymiz — bepul va majburiyatsiz.",
      },
    ],

    founderEyebrow: "Asoschi",
    founderName: "Xurshid Kasimov",
    founderRole: "RAXPRO asoschisi",
    founderQuote:
      "«Mijozning ishonchi va tartibi — men uchun eng katta qadriyat»",
    founderP: [
      "Men tadbirkor va quruvchilar oilasidanman, biznesga 16 yoshimda kirganman. 25 yoshimgacha xizmat sohasida 10 ga yaqin kichik kompaniya yaratdim — koʻplab xato va gʻalabalar orqali mijozlar meni sifatli xizmat boʻyicha chempion deb tan olishdi.",
      "Bugun RAXPRO orqali sifatli, mustahkam va estetik metall stellajlarni yetkazish — hayotimning bir qismi. Bir necha yil ichida biz doʻkonlar, omborlar va fabrikalar uchun tayyor yechim taklif qilib, Oʻzbekiston bozoridagi yetakchilardan biriga aylandik.",
      "Asoschi sifatida har bir loyiha uchun shaxsan javob beraman. Tartibli, toʻgʻri tizimlashtirilgan ombor yoki doʻkonni koʻrsam — chin dildan zavqlanaman. Sizning obyektingizda ham tartib oʻrnatishdan mamnun boʻlaman.",
    ],
    certsLabel: "Ishlab chiqaruvchi zavod ISO 9001, 14001 va 45001 boʻyicha sertifikatlangan",
    certsLink: "Sertifikatlarni koʻrish",
    certsHide: "Sertifikatlarni yigʻish",

    guaranteeTitle: "shartnoma boʻyicha rasmiy kafolat",
    guaranteeText:
      "Shartnoma boʻyicha 10 yil — bozordagi odatdagidan ikki barobar koʻp, yozma shaklda. 1-nav metall, sinklash va kukunli boʻyoq — stellaj oʻn yillar xizmat qiladi.",
    yil: "yil",

    blogEyebrow: "Yangiliklar va maqolalar",
    blogTitle: "Stellajlar haqida foydali",
    blogAll: "Barcha maqolalar",

    formEyebrow: "Ariza",
    formTitle: "Ombor rejasi va aniq narxni oling — bepul",
    formText:
      "Oʻlchov 24 soatda, reja va aniq narx — 1–2 kunda.",

    contEyebrow: "Aloqa",
    contTitle: "Biz bilan bogʻlaning",
    phones: "Telefonlar",
    hours: "Ish vaqti",
    address: "Manzil",
    socials: "Ijtimoiy tarmoqlar",
    reviews: "Sharhlar",
    revEyebrow: "Sharhlar",
    revTitle: "Mijozlarimiz nima deydi",
    revText:
      "Mijozlarning videointervyulari, yozishmalari va ovozli xabarlari — soʻzma-soʻz. Bosh sahifada — aniq faktlisi; qolganlari sharhlar sahifasida.",
  },
};

// Blog + article page UI strings
export const BLOG_UI = {
  ru: {
    home: "Главная",
    news: "Новости",
    blog: "Блог",
    libTitle: "Библиотека статей о стеллажах",
    libText:
      "Экспертные материалы RAXPRO о системах хранения: как выбрать, рассчитать и не переплатить за стеллажи для склада, магазина и архива.",
    read: "Читать статью",
    readShort: "Читать",
    all: "Все",
    min: "мин",
    article: "Статья",
    alsoRead: "Читайте также",
    whyTitle: "Почему RAXPRO",
    why: [
      "Гарантия 10 лет по договору",
      "Металл 1 сорта + оцинковка",
      "Нагрузка до 4 тонн",
      "Бесплатный замер и расчёт",
    ],
    needCalc: "Нужен расчёт стеллажей?",
    needCalcText:
      "Бесплатный замер, проект и цена за 24 часа. Оставьте заявку — свяжемся с вами.",
    leaveReq: "Оставить заявку",
  },
  uz: {
    home: "Bosh sahifa",
    news: "Yangiliklar",
    blog: "Blog",
    libTitle: "Stellajlar haqida maqolalar kutubxonasi",
    libText:
      "RAXPRO ning saqlash tizimlari haqida ekspert materiallari: ombor, doʻkon va arxiv uchun stellajlarni qanday tanlash, hisoblash va ortiqcha toʻlamaslik.",
    read: "Maqolani oʻqish",
    readShort: "Oʻqish",
    all: "Barchasi",
    min: "daq",
    article: "Maqola",
    alsoRead: "Shuni ham oʻqing",
    whyTitle: "Nega RAXPRO",
    why: [
      "Shartnoma boʻyicha 10 yil kafolat",
      "1-nav metall + sinklash",
      "4 tonnagacha yuklama",
      "Bepul oʻlchov va hisob-kitob",
    ],
    needCalc: "Stellajlar hisob-kitobi kerakmi?",
    needCalcText:
      "24 soatda bepul oʻlchov, loyiha va narx. Ariza qoldiring — siz bilan bogʻlanamiz.",
    leaveReq: "Ariza qoldirish",
  },
};

export const MONTHS = {
  ru: [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ],
  uz: [
    "yanvar",
    "fevral",
    "mart",
    "aprel",
    "may",
    "iyun",
    "iyul",
    "avgust",
    "sentabr",
    "oktabr",
    "noyabr",
    "dekabr",
  ],
};

// FAQ + factory-vs-artisan comparison (bilingual)
export const EXTRA = {
  ru: {
    // Колонка «После заявки» рядом с формой (вместо отдельного экрана, 22.09).
    // «5 минут» — только в рабочее время, иначе обещание нарушается вечером и в воскресенье.
    afterTitle: "После заявки",
    afterSteps: [
      { time: "24 ч", d: "бесплатный замер" },
      { time: "1–2 дня", d: "план, 3D-модель и КП с точной ценой" },
    ],
    afterNote: "Платить за расчёт не нужно. Решение за вами.",
    faqEyebrow: "Вопросы",
    faqTitle: "Частые вопросы",
    faq: [
      {
        q: "Сколько стоят стеллажи?",
        a: "Цена зависит от типа, нагрузки и размеров. Мы делаем бесплатный расчёт за 24 часа. Минимальный заказ — от 1,2 млн сум, доступна рассрочка Uzum Nasiya.",
      },
      {
        q: "Какую нагрузку выдерживают стеллажи?",
        a: "От 100 кг до 4 тонн на ярус. Конструкцию рассчитываем под вашу реальную нагрузку.",
      },
      {
        q: "Есть ли гарантия?",
        a: "Да — 10 лет официальной гарантии по договору. Это вдвое больше, чем обычно дают на рынке.",
      },
      {
        q: "Вы делаете замер и монтаж?",
        a: "Да, полный цикл «под ключ»: замер, проектирование, комплектация со склада, доставка и монтаж. По Ташкенту все услуги бесплатно.",
      },
      {
        q: "Есть рассрочка или лизинг?",
        a: "Да. Для частных и небольших B2B-клиентов — рассрочка через Uzum Nasiya до 25 млн сум. Для крупных заказов на большие суммы доступен лизинг.",
      },
      {
        q: "Как быстро поставите?",
        a: "Многие позиции есть в наличии — доставляем в короткие сроки. Точный срок называем после замера.",
      },
      {
        q: "Работаете по регионам?",
        a: "Да, по всему Узбекистану. По Ташкенту замер и монтаж бесплатно, по регионам — по объёму проекта.",
      },
      {
        q: "Как стеллажи крепятся к полу? Какой нужен пол?",
        a: "Каждая рама анкеруется к полу: анкеры 120×12 мм, по четыре на раму, — это есть в спецификации каждого расчёта. Подходит бетонный пол; плитку, наливной пол и уклон проверяет замерщик и учитывает в проекте.",
      },
      {
        q: "Что нужно, чтобы посчитать цену?",
        a: "Длина, ширина и высота помещения, где колонны и ворота, что храните и какая техника. С этим справится конструктор на сайте — паллетомест, план, 3D и расчётная цена сразу. Если данных нет — фото помещения в заявку, остальное уточним за 5 минут.",
      },
      {
        q: "Какие документы вы даёте?",
        a: "Договор, спецификацию с количеством всех элементов, план расстановки и 3D-модель, коммерческое предложение с ценой и сроком, после монтажа — гарантийный документ на 10 лет. Работаем с НДС по перечислению.",
      },
      {
        q: "Учитываете ли колонны, ворота и технику?",
        a: "Да. Раскладка считается по помещению: обходит колонны, оставляет зону разгрузки перед воротами и проход под вашу технику — штабелёр, ричтрак или вилочный погрузчик. Это видно на плане ещё до замера.",
      },
      {
        q: "Можно ли потом докупить секции или ярусы?",
        a: "Да. Стеллажи собираются из типовых рам и балок, поэтому ряд наращивается, а балки переставляются по высоте под новый товар. Докупаете по той же спецификации.",
      },
      {
        q: "Как оплачивать?",
        a: "Для компаний — по перечислению с НДС, схемы оплаты в КП: 100 % предоплата, 50 / 50 или 50 % + рассрочка на 3 месяца. Для частных и небольших заказов — рассрочка Uzum Nasiya до 25 млн сум, условия уточняем при заявке.",
      },
    ],
  },
  uz: {
    afterTitle: "Arizadan soʻng",
    afterSteps: [
      { time: "24 soat", d: "bepul oʻlchov" },
      { time: "1–2 kun", d: "reja, 3D model va aniq narxli tijorat taklifi" },
    ],
    afterNote: "Hisob-kitob uchun toʻlash shart emas. Qaror sizniki.",
    faqEyebrow: "Savollar",
    faqTitle: "Koʻp beriladigan savollar",
    faq: [
      {
        q: "Stellajlar qancha turadi?",
        a: "Narx turi, yuklama va oʻlchamlarga bogʻliq. Biz 24 soatda bepul hisob-kitob qilamiz. Minimal buyurtma — 1,2 mln soʻmdan, Uzum Nasiya boʻlib toʻlash mavjud.",
      },
      {
        q: "Stellajlar qancha yuklamaga chidaydi?",
        a: "Har qavatga 100 kg dan 4 tonnagacha. Konstruksiyani real yuklamangizga moslab hisoblaymiz.",
      },
      {
        q: "Kafolat bormi?",
        a: "Ha — shartnoma boʻyicha 10 yil rasmiy kafolat. Bu bozordagi odatdagidan ikki barobar koʻp.",
      },
      {
        q: "Oʻlchov va montaj qilasizmi?",
        a: "Ha, toʻliq sikl «kalit topshirish»: oʻlchov, loyihalash, ombordan komplektatsiya, yetkazish va montaj. Toshkent boʻyicha barcha xizmatlar bepul.",
      },
      {
        q: "Boʻlib toʻlash yoki lizing bormi?",
        a: "Ha. Jismoniy shaxslar va kichik B2B uchun — Uzum Nasiya orqali 25 mln soʻmgacha boʻlib toʻlash. Katta summadagi yirik buyurtmalar uchun lizing mavjud.",
      },
      {
        q: "Qancha muddatda yetkazasiz?",
        a: "Koʻp mahsulotlar omborda mavjud — qisqa muddatda yetkazamiz. Aniq muddatni oʻlchovdan soʻng aytamiz.",
      },
      {
        q: "Viloyatlarda ishlaysizmi?",
        a: "Ha, butun Oʻzbekiston boʻylab. Toshkent boʻyicha oʻlchov va montaj bepul, viloyatlarda — loyiha hajmiga qarab.",
      },
      {
        q: "Stellajlar polga qanday mahkamlanadi? Qanday pol kerak?",
        a: "Har bir rama polga ankerlanadi: 120×12 mm anker, har ramaga toʻrttadan — bu har bir hisobning spetsifikatsiyasida bor. Beton pol mos keladi; plitka, quyma pol va nishablikni oʻlchovchi tekshiradi va loyihada hisobga oladi.",
      },
      {
        q: "Narxni hisoblash uchun nima kerak?",
        a: "Xonaning uzunligi, kengligi va balandligi, ustunlar va darvoza qayerda, nima saqlaysiz va qanday texnika. Buni saytdagi konstruktor bajaradi — pallet oʻrinlari, reja, 3D va hisobiy narx darhol. Maʼlumot boʻlmasa — arizaga xona suratini qoʻshing, qolganini 5 daqiqada aniqlaymiz.",
      },
      {
        q: "Qanday hujjatlar berasiz?",
        a: "Shartnoma, barcha elementlar soni bilan spetsifikatsiya, joylashuv rejasi va 3D model, narx va muddatli tijorat taklifi, montajdan soʻng — 10 yillik kafolat hujjati. QQS bilan pul oʻtkazish orqali ishlaymiz.",
      },
      {
        q: "Ustunlar, darvoza va texnikani hisobga olasizmi?",
        a: "Ha. Joylashuv xona boʻyicha hisoblanadi: ustunlarni aylanib oʻtadi, darvoza oldida tushirish zonasini va texnikangiz — shtabelyor, richtrak yoki vilkali yuklagich — uchun yoʻlakni qoldiradi. Bu oʻlchovgacha rejada koʻrinadi.",
      },
      {
        q: "Keyinchalik seksiya yoki yarus qoʻshib olsa boʻladimi?",
        a: "Ha. Stellajlar tipik rama va balkalardan yigʻiladi, shuning uchun qator uzaytiriladi, balkalar esa yangi tovar ostida balandlik boʻyicha koʻchiriladi. Oʻsha spetsifikatsiya boʻyicha qoʻshib olasiz.",
      },
      {
        q: "Toʻlov qanday?",
        a: "Kompaniyalar uchun — QQS bilan pul oʻtkazish, toʻlov sxemalari taklifda: 100 % oldindan toʻlov, 50 / 50 yoki 50 % + 3 oyga boʻlib toʻlash. Jismoniy shaxslar va kichik buyurtmalar uchun — Uzum Nasiya orqali 25 mln soʻmgacha boʻlib toʻlash, shartlarini ariza paytida aniqlaymiz.",
      },
    ],
  },
};
