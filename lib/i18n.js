// Bilingual content (RU default + UZ Latin, formal). Homepage + shared UI.
// Uzbek: translated by meaning, formal (siz), oʻ/gʻ diacritics.

export const LANGS = ["ru", "uz"];

export function normalizeLang(v) {
  return v === "uz" ? "uz" : "ru";
}

export const translations = {
  uz: {
    hero_title_blue: "RAX PRO",
    hero_title_dark: " Muhandislari va Mutaxassislari",
    hero_desc:
      "RAX PRO mutaxassislari bilan ombor va savdo stellajlari bo‘yicha professional maslahat oling. Loyihalash, o‘lchov, ishlab chiqarish va montaj xizmatlari.",
    hero_btn: "Konsultatsiyaga yozilish",

    // Mutaxassislar bo'limi (UZ)
    teamTitle: "Bizning Mutaxassislarimiz",
    teamText:
      "Ko‘p yillik tajriba va chuqur bilimga ega mutaxassislarimiz sizning ehtiyojlaringizni tahlil qilib, eng maqbul va samarali yechimlarni taklif etadi.",
    specialists: [
      { name: "Xurshidbek Qosimov", img: "/images/command.png" },
      { name: "Islombek Erkinov", img: "/images/command.png" },
      { name: "Nurilla Ubaydullayev", img: "/images/command.png" },
      { name: "Shaxzoda G‘anixo‘jayeva", img: "/images/command.png" },
    ],
  },
  ru: {
    hero_title_blue: "RAX PRO",
    hero_title_dark: " Инженеры и Специалисты",
    hero_desc:
      "Получите профессиональную консультацию по складским и торговым стеллажам от специалистов RAX PRO. Проектирование, замер, производство и монтажные услуги.",
    hero_btn: "Записаться на консультацию",

    // Наши Специалисты (RU)
    teamTitle: "Наши Специалисты",
    teamText:
      "Наши специалисты с многолетним опытом и глубокими знаниями проанализируют ваши потребности и предложат наиболее оптимальные и эффективные решения.",
    specialists: [
      { name: "Хуршидбек Косимов", img: "/images/command.png" },
      { name: "Исломбек Эркинов", img: "/images/command.png" },
      { name: "Нурилла Убайдуллаев", img: "/images/command.png" },
      { name: "Шахзода Ганиходжаева", img: "/images/command.png" },
    ],
  },
};

export const NAV_T = {
  ru: [
    { label: "О компании", href: "/#o-kompanii" },
    { label: "Продукция", href: "/#napravleniya" },
    { label: "Преимущества", href: "/#preimushchestva" },
    { label: "Проекты", href: "/#proekty" },
    { label: "Блог", href: "/blog" },
    { label: "Эксперты", href: "/experts" },
    { label: "Контакты", href: "/#kontakty" },
  ],
  uz: [
    { label: "Kompaniya", href: "/#o-kompanii" },
    { label: "Mahsulotlar", href: "/#napravleniya" },
    { label: "Afzalliklar", href: "/#preimushchestva" },
    { label: "Loyihalar", href: "/#proekty" },
    { label: "Blog", href: "/blog" },
    { label: "Mutaxassislar", href: "/experts" },
    { label: "Aloqa", href: "/#kontakty" },
  ],
};

export const T = {
  ru: {
    thankYouTitle: "Ваша заявка принята!",
    thankYouDesc:
      "Спасибо за доверие к нам. Наши специалисты свяжутся с вами в ближайшее время и ответят на все ваши вопросы.",
    backToHome: "Вернуться на главную",
    haveQuestions: "Есть срочные вопросы?",
    callUs: "Позвоните нам",
    teamTitle: "Наши Специалисты",
    teamText:
      "Наша команда профессионалов с многолетним опытом проанализирует ваши потребности и предложит наиболее оптимальные решения.",
    specialists: [
      { id: 1, name: "Хуршидбек Косимов", img: "/images/command.png" },
      { id: 2, name: "Исломбек Эркинов", img: "/images/command.png" },
      { id: 3, name: "Нурилла Убайдуллаев", img: "/images/command.png" },
      { id: 3, name: "Муродбек Тохиров", img: "/images/command.png" },
      { id: 4, name: "Шахзода Ганиходжаева", img: "/images/command.png" },
    ],
    consult: "Консультация",
    heroEyebrow: "Системы хранения · Ташкент",
    heroTitle1: "Стеллажи и системы",
    heroTitle2: "хранения",
    heroTitleAccent: "полного цикла",
    heroText:
      "Производим и монтируем стеллажи любого типа по всему Узбекистану. Нагрузка до 4 тонн · гарантия 10 лет · бесплатный замер за 24 часа.",
    heroCta1: "Рассчитать стоимость за 1 минуту",
    heroCta2: "Смотреть направления",
    heroChips: [
      "До 300 м² под ключ за 1 день",
      "Гарантия 10 лет по документу",
      "Отвечаем за 5 минут",
      "Рассрочка и лизинг",
    ],
    heroPrice: "Проекты от 1,2 млн сум · бесплатный расчёт за 24 часа",
    clients: "Нам доверяют",

    calcEyebrow: "Калькулятор",
    calcTitle1: "Рассчитайте стоимость стеллажей",
    calcTitleAccent: "за 1 минуту",
    calcText:
      "Ответьте на 4 вопроса — менеджер подготовит точный расчёт и коммерческое предложение. Бесплатный замер и проект за 24 часа, отвечаем в течение 5 минут.",
    calcFeatures: [
      "Точная цена под вашу задачу",
      "Бесплатный выезд и замер",
      "Рассрочка Uzum Nasiya до 25 млн сум",
      "Гарантия 10 лет по документу",
    ],

    procEyebrow: "Циклы",
    procTitle: "Контроль на всех этапах — от замера до готового объекта",
    procText:
      "RAXPRO — производитель полного цикла. Мы отвечаем за каждый этап: от выезда на объект до монтажа «под ключ», поэтому качество и сроки под нашим контролем.",
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
        t: "Производство",
        d: "Изготавливаем из металла 1 сорта: оцинковка и порошковая покраска.",
      },
      {
        t: "Монтаж",
        d: "Доставляем и монтируем «под ключ». По Ташкенту — бесплатно.",
      },
    ],

    numsEyebrow: "Цифры",
    numsTitle: "RAXPRO в цифрах",
    numsText:
      "Мы построили системы хранения для складов, заводов, магазинов и маркетплейсов по всему Узбекистану.",
    numsCta: "Связаться с нами",
    stats: [
      { n: "1000+", s: "", l: "реализованных проектов" },
      { n: "10", s: "лет", l: "официальной гарантии по документу" },
      { n: "4", s: "т", l: "нагрузка на ярус" },
      { n: "100%", s: "", l: "под ключ: замер, проект, монтаж" },
      { n: "40", s: "", l: "специалистов в команде" },
      { n: "с 2021", s: "", l: "на рынке систем хранения" },
    ],

    dirEyebrow: "Продукция",
    dirTitle: "Наши основные направления работы",
    dirText:
      "Пять ключевых типов стеллажей и системы хранения любого масштаба — от одной секции до проектов на несколько миллиардов сум.",
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
      "Спроектировано, изготовлено и смонтировано «под ключ» для заводов, складов, магазинов и маркетплейсов.",

    advEyebrow: "Преимущества",
    advTitle: "Не обещания, а факты",
    advText:
      "Что отличает RAXPRO от других поставщиков стеллажей на рынке Узбекистана.",
    adv: [
      {
        t: "Гарантия 10 лет — по документу",
        d: "Единственная компания на рынке Узбекистана, которая даёт 10 лет официальной гарантии в письменном виде.",
      },
      {
        t: "Металл 1 сорта + оцинковка",
        d: "Сталь первого сорта, гальваническое покрытие и порошковая краска — прочность и срок службы десятилетиями.",
      },
      {
        t: "Собственное производство",
        d: "Изготавливаем стеллажи любого объёма и габарита — от 1 секции до проектов на несколько миллиардов сум.",
      },
      {
        t: "Нагрузка 100 кг – 4 тонны",
        d: "Рассчитываем конструкцию под вашу реальную нагрузку — от лёгких полок до тяжёлых паллетных систем.",
      },
      {
        t: "Полный цикл под ключ",
        d: "Замер, проектирование, производство, доставка и монтаж. По Ташкенту все услуги бесплатно.",
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
    certsLabel: "Продукция сертифицирована по международным стандартам:",

    guaranteeTitle: "официальной гарантии по документу",
    guaranteeText:
      "Сегодня на рынке Узбекистана только RAXPRO предоставляет 10 лет гарантии в письменном виде. Металл 1 сорта, оцинковка и порошковая краска — стеллаж служит десятилетиями.",
    yil: "лет",

    blogEyebrow: "Новости и статьи",
    blogTitle: "Полезное о стеллажах",
    blogAll: "Все статьи",

    formEyebrow: "Заявка",
    formTitle: "Оставьте заявку — и мы свяжемся с вами",
    formText:
      "Бесплатный замер, проектирование и расчёт за 24 часа. Менеджер подберёт оптимальное решение под вашу задачу и подготовит коммерческое предложение.",

    contEyebrow: "Контакты",
    contTitle: "Свяжитесь с нами",
    phones: "Телефоны",
    address: "Адрес",
    socials: "Соцсети",
    reviews: "Отзывы",
    revEyebrow: "Отзывы",
    revTitle: "Что говорят наши клиенты",
    revText:
      "Реальные отзывы наших клиентов. Оригиналы переписок — в Telegram-канале отзывов.",
    revCta: "Все отзывы в Telegram",
  },

  uz: {
    thankYouTitle: "Arizangiz qabul qilindi!",
    thankYouDesc:
      "Bizga ishonch bildirganingiz uchun rahmat. Mutaxassislarimiz tez orada siz bilan bog‘lanishadi va barcha savollaringizga javob berishadi.",
    backToHome: "Bosh sahifaga qaytish",
    haveQuestions: "Shoshilinch savollar bormi?",
    callUs: "Bizga qo‘ng‘iroq qiling",
    teamTitle: "Bizning Mutaxassislarimiz",
    teamText:
      "Ko'p yillik tajriba va chuqur bilimga ega mutaxassislarimiz sizning ehtiyojlaringizni tahlil qilib, eng maqbul va samarali yechimlarni taklif etadi.",
    specialists: [
      { id: 1, name: "Xurshidbek Qosimov", img: "/images/command.png" },
      { id: 2, name: "Islombek Erkinov", img: "/images/command.png" },
      { id: 3, name: "Nurilla Ubaydullayev", img: "/images/command.png" },
      { id: 3, name: "Murodbek Tohirov", img: "/images/command.png" },
      { id: 4, name: "Shaxzoda G'anixo'jayeva", img: "/images/command.png" },
    ],
    consult: "Konsultatsiya",
    heroEyebrow: "Saqlash tizimlari · Toshkent",
    heroTitle1: "Stellajlar va saqlash",
    heroTitle2: "tizimlari —",
    heroTitleAccent: "toʻliq sikl",
    heroText:
      "Butun Oʻzbekiston boʻylab istalgan turdagi stellajlarni ishlab chiqaramiz va oʻrnatamiz. Yuk koʻtarish 4 tonnagacha · 10 yil kafolat · 24 soatda bepul oʻlchov.",
    heroCta1: "Narxni 1 daqiqada hisoblang",
    heroCta2: "Yoʻnalishlarni koʻrish",
    heroChips: [
      "300 m² gacha 1 kunda pod klyuch",
      "Hujjat asosida 10 yil kafolat",
      "5 daqiqada javob beramiz",
      "Boʻlib toʻlash va lizing",
    ],
    heroPrice: "Loyihalar 1,2 mln soʻmdan · 24 soatda bepul hisob-kitob",
    clients: "Bizga ishonishadi",

    calcEyebrow: "Kalkulyator",
    calcTitle1: "Stellajlar narxini hisoblang",
    calcTitleAccent: "1 daqiqada",
    calcText:
      "4 ta savolga javob bering — menejer aniq hisob-kitob va tijorat taklifini tayyorlaydi. 24 soatda bepul oʻlchov va loyiha, 5 daqiqada javob beramiz.",
    calcFeatures: [
      "Vazifangizga mos aniq narx",
      "Bepul chiqib oʻlchov",
      "Uzum Nasiya 25 mln soʻmgacha boʻlib toʻlash",
      "Hujjat asosida 10 yil kafolat",
    ],

    procEyebrow: "Bosqichlar",
    procTitle: "Barcha bosqichlar nazorati — oʻlchovdan tayyor obyektgacha",
    procText:
      "RAXPRO — toʻliq sikl ishlab chiqaruvchisi. Har bir bosqich uchun biz javob beramiz: obyektga chiqishdan «kalit topshirish» montajigacha — shuning uchun sifat va muddat bizning nazoratimizda.",
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

    numsEyebrow: "Raqamlar",
    numsTitle: "RAXPRO raqamlarda",
    numsText:
      "Butun Oʻzbekiston boʻylab omborlar, zavodlar, doʻkonlar va marketpleyslar uchun saqlash tizimlarini qurdik.",
    numsCta: "Biz bilan bogʻlaning",
    stats: [
      { n: "1000+", s: "", l: "amalga oshirilgan loyiha" },
      { n: "10", s: "yil", l: "hujjat asosida rasmiy kafolat" },
      { n: "4", s: "t", l: "har bir qavatga yuklama" },
      { n: "100%", s: "", l: "kalit topshirish: oʻlchov, loyiha, montaj" },
      { n: "40", s: "", l: "jamoadagi mutaxassis" },
      { n: "2021", s: "dan", l: "saqlash tizimlari bozorida" },
    ],

    dirEyebrow: "Mahsulotlar",
    dirTitle: "Asosiy ish yoʻnalishlarimiz",
    dirText:
      "Beshta asosiy stellaj turi va istalgan koʻlamdagi saqlash tizimlari — bitta seksiyadan milliardlab soʻmlik loyihalargacha.",
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
      "Zavodlar, omborlar, doʻkonlar va marketpleyslar uchun «kalit topshirish» tarzida loyihalangan, ishlab chiqarilgan va oʻrnatilgan.",

    advEyebrow: "Afzalliklar",
    advTitle: "Vaʼda emas, balki faktlar",
    advText:
      "RAXPRO ni Oʻzbekiston bozoridagi boshqa stellaj taʼminotchilaridan nima ajratib turadi.",
    adv: [
      {
        t: "Hujjat asosida 10 yil kafolat",
        d: "Oʻzbekiston bozorida yozma ravishda 10 yil rasmiy kafolat beradigan yagona kompaniya.",
      },
      {
        t: "1-nav metall + sinklash",
        d: "Birinchi nav poʻlat, galvanik qoplama va kukunli boʻyoq — mustahkamlik va oʻn yillik xizmat muddati.",
      },
      {
        t: "Oʻz ishlab chiqarishimiz",
        d: "Istalgan hajm va oʻlchamdagi stellajlarni tayyorlaymiz — bitta seksiyadan milliardlab soʻmlik loyihalargacha.",
      },
      {
        t: "Yuklama 100 kg – 4 tonna",
        d: "Konstruktsiyani real yuklamangizga moslab hisoblaymiz — yengil polkalardan ogʻir pallet tizimlarigacha.",
      },
      {
        t: "Toʻliq sikl, kalit topshirish",
        d: "Oʻlchov, loyiha, ishlab chiqarish, yetkazish va montaj. Toshkent boʻyicha barcha xizmatlar bepul.",
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
    certsLabel: "Mahsulot xalqaro standartlar boʻyicha sertifikatlangan:",

    guaranteeTitle: "hujjat asosida rasmiy kafolat",
    guaranteeText:
      "Bugun Oʻzbekiston bozorida faqat RAXPRO yozma ravishda 10 yil kafolat beradi. 1-nav metall, sinklash va kukunli boʻyoq — stellaj oʻn yillar xizmat qiladi.",
    yil: "yil",

    blogEyebrow: "Yangiliklar va maqolalar",
    blogTitle: "Stellajlar haqida foydali",
    blogAll: "Barcha maqolalar",

    formEyebrow: "Ariza",
    formTitle: "Ariza qoldiring — biz siz bilan bogʻlanamiz",
    formText:
      "24 soatda bepul oʻlchov, loyihalash va hisob-kitob. Menejer vazifangizga mos yechim tanlab, tijorat taklifini tayyorlaydi.",

    contEyebrow: "Aloqa",
    contTitle: "Biz bilan bogʻlaning",
    phones: "Telefonlar",
    address: "Manzil",
    socials: "Ijtimoiy tarmoqlar",
    reviews: "Sharhlar",
    revEyebrow: "Sharhlar",
    revTitle: "Mijozlarimiz nima deydi",
    revText:
      "Mijozlarimizning haqiqiy sharhlari. Yozishmalar asli — Telegram sharhlar kanalida.",
    revCta: "Barcha sharhlar Telegramda",
  },
};

// Blog + article page UI strings
export const BLOG_UI = {
  ru: {
    home: "Главная",
    news: "Новости",
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
      "Гарантия 10 лет по документу",
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
      "Hujjat asosida 10 yil kafolat",
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
    afterEyebrow: "Что дальше",
    afterTitle: "Что будет после заявки",
    afterText: "Никакого спама — только помощь. Оставляете заявку, и дальше:",
    afterSteps: [
      {
        t: "Перезвоним за 5 минут",
        d: "Уточним задачу и ответим на вопросы. Обычно на связи в течение 5 минут.",
      },
      {
        t: "Бесплатный замер за 24 часа",
        d: "Выезжаем на объект, замеряем помещение и нагрузки. По Ташкенту — бесплатно.",
      },
      {
        t: "Проект, КП и точная цена",
        d: "Готовим проект системы хранения и коммерческое предложение с ценой.",
      },
      {
        t: "Решение за вами",
        d: "Спокойно решаете. Никаких обязательств и предоплаты за расчёт.",
      },
    ],
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
        a: "Да — 10 лет официальной гарантии по документу. На рынке Узбекистана это даём только мы.",
      },
      {
        q: "Вы делаете замер и монтаж?",
        a: "Да, полный цикл «под ключ»: замер, проектирование, производство, доставка и монтаж. По Ташкенту все услуги бесплатно.",
      },
      {
        q: "Есть рассрочка или лизинг?",
        a: "Да. Для частных и небольших B2B-клиентов — рассрочка через Uzum Nasiya до 25 млн сум. Для крупных заказов на большие суммы доступен лизинг.",
      },
      {
        q: "Как быстро изготовите?",
        a: "Многие позиции есть в наличии — доставляем в короткие сроки. Точный срок называем после замера.",
      },
      {
        q: "Работаете по регионам?",
        a: "Да, по всему Узбекистану. По Ташкенту замер и монтаж бесплатно, по регионам — по объёму проекта.",
      },
    ],
    cmpEyebrow: "Почему заводские",
    cmpTitle: "Заводские стеллажи RAXPRO против кустарных",
    cmpText:
      "Кустарные стеллажи от «сварщиков» кажутся дешевле, но подводят по качеству, срокам и гарантии. Вот в чём разница.",
    cmpUs: "Заводские RAXPRO",
    cmpThem: "Кустарные «сварщики»",
    cmpRows: [
      { us: "Металл 1 сорта", them: "Переработанное железо" },
      {
        us: "Оцинковка + порошковая краска — не ржавеет и не облезает",
        them: "Обычная краска — облезает и ржавеет",
      },
      {
        us: "10 лет гарантии по документу",
        them: "Гарантия только «на словах»",
      },
      {
        us: "Точный расчёт и соблюдение сроков",
        them: "Долго изготавливают, срывают сроки",
      },
      { us: "Нагрузка рассчитана до 4 тонн", them: "Нагрузка не рассчитана" },
      {
        us: "Продукция часто в наличии",
        them: "Всё под заказ — приходится ждать",
      },
    ],
  },
  uz: {
    afterEyebrow: "Keyin nima",
    afterTitle: "Ariza berganingizdan soʻng nima boʻladi",
    afterText: "Hech qanday spam — faqat yordam. Ariza qoldirasiz va keyin:",
    afterSteps: [
      {
        t: "5 daqiqada qoʻngʻiroq qilamiz",
        d: "Vazifani aniqlaymiz va savollarga javob beramiz. Odatda 5 daqiqada aloqadamiz.",
      },
      {
        t: "24 soatda bepul oʻlchov",
        d: "Obyektga chiqamiz, xona va yuklamalarni oʻlchaymiz. Toshkent boʻyicha — bepul.",
      },
      {
        t: "Loyiha, taklif va aniq narx",
        d: "Saqlash tizimi loyihasi va narxi bilan tijorat taklifini tayyorlaymiz.",
      },
      {
        t: "Qaror sizniki",
        d: "Xotirjam qaror qilasiz. Hisob-kitob uchun hech qanday majburiyat va oldindan toʻlov yoʻq.",
      },
    ],
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
        a: "Ha — hujjat asosida 10 yil rasmiy kafolat. Oʻzbekiston bozorida buni faqat biz beramiz.",
      },
      {
        q: "Oʻlchov va montaj qilasizmi?",
        a: "Ha, toʻliq sikl «kalit topshirish»: oʻlchov, loyihalash, ishlab chiqarish, yetkazish va montaj. Toshkent boʻyicha barcha xizmatlar bepul.",
      },
      {
        q: "Boʻlib toʻlash yoki lizing bormi?",
        a: "Ha. Jismoniy shaxslar va kichik B2B uchun — Uzum Nasiya orqali 25 mln soʻmgacha boʻlib toʻlash. Katta summadagi yirik buyurtmalar uchun lizing mavjud.",
      },
      {
        q: "Qancha muddatda tayyorlaysiz?",
        a: "Koʻp mahsulotlar omborda mavjud — qisqa muddatda yetkazamiz. Aniq muddatni oʻlchovdan soʻng aytamiz.",
      },
      {
        q: "Viloyatlarda ishlaysizmi?",
        a: "Ha, butun Oʻzbekiston boʻylab. Toshkent boʻyicha oʻlchov va montaj bepul, viloyatlarda — loyiha hajmiga qarab.",
      },
    ],
    cmpEyebrow: "Nega zavod mahsuloti",
    cmpTitle: "RAXPRO zavod stellajlari va hunarmand stellajlari",
    cmpText:
      "«Payvandchilar»ning hunarmand stellajlari arzonroq koʻrinadi, lekin sifat, muddat va kafolatda qoqiladi. Farqi mana shunda.",
    cmpUs: "RAXPRO zavod mahsuloti",
    cmpThem: "Hunarmand «payvandchilar»",
    cmpRows: [
      { us: "1-nav metall", them: "Qayta ishlangan temir" },
      {
        us: "Sinklash + kukunli boʻyoq — zanglamaydi va koʻchmaydi",
        them: "Oddiy boʻyoq — koʻchadi va zanglaydi",
      },
      { us: "Hujjat asosida 10 yil kafolat", them: "Kafolat faqat «ogʻzaki»" },
      {
        us: "Aniq hisob-kitob va muddatga rioya",
        them: "Uzoq tayyorlaydi, muddatni buzadi",
      },
      { us: "Yuklama 4 tonnagacha hisoblangan", them: "Yuklama hisoblanmagan" },
      {
        us: "Mahsulot koʻpincha omborda",
        them: "Hammasi buyurtmaga — kutasiz",
      },
    ],
  },
};
