// Мезонин, монтаж и гарантия как отдельные страницы (ТЗ 24.09, этап 5).
// Факты только из того, что уже на сайте: lib/products.js (мезонин),
// dostavka-i-oplata (монтаж по Ташкенту бесплатно, регионы — по объёму до
// оплаты счёта), публичная оферта (что не покрывает гарантия).
// Рассрочку не упоминаем — не подтверждена (см. этап 1–2).

const MEDIUM = "srednegruzovoy-stellazh-2000x2000x600";
const ARCHIVE = "arhivnyy-stellazh-2000x1000x400";
const PALLET = "palletnyy-stellazh-4000x2700x1050";

export const SERVICE_LANDINGS = [
  {
    group: "type",
    slug: "mezonin",
    path: "/napravleniya/mezonin",
    section: "dirs",
    cover: "/products/gen/mezzanine-1.jpg",
    caseKeys: ["superpack", "caffelito", "mirvali"],
    reviewIds: ["sobirjon", "muhriddin", "nurbek"],
    productSlugs: ["mezonin", PALLET, MEDIUM],
    specs: {
      ru: [{ k: "Шаг стоек", v: "2700 мм" }, { k: "Глубина", v: "1050 мм" }, { k: "Нагрузка на ярус", v: "300–500 кг" }, { k: "Комплект", v: "настил, лестница, ограждение" }, { k: "Материал", v: "сталь 1 сорта, порошковая окраска" }, { k: "Гарантия", v: "10 лет по договору" }],
      uz: [{ k: "Tayanchlar qadami", v: "2700 mm" }, { k: "Chuqurligi", v: "1050 mm" }, { k: "Yarusga yuklama", v: "300–500 kg" }, { k: "Toʻplam", v: "toʻshama, zinapoya, toʻsiq" }, { k: "Material", v: "1-nav poʻlat, kukunli boʻyoq" }, { k: "Kafolat", v: "shartnoma boʻyicha 10 yil" }],
    },
    ru: {
      name: "Мезонин для склада", short: "Мезонины",
      lead: "Второй этаж внутри склада на стеллажных стойках: дополнительная площадь в том же здании, без стройки и аренды. Каждый мезонин проектируется под ваше помещение.",
      points: [
        { t: "Площадь без стройки", d: "Платформа с настилом встаёт на стеллажные стойки — склад получает второй уровень." },
        { t: "Два уровня работы", d: "Внизу — паллетные или полочные стеллажи, наверху — хранение или сборка заказов." },
        { t: "Лестница и ограждение", d: "Входят в комплект второго уровня." },
        { t: "Расчёт под здание", d: "Высоту, нагрузку и логистику считаем по замеру; конструкция анкеруется к полу." },
      ],
      faq: [
        { q: "Сколько стоит мезонин?", a: "Цена считается по проекту: площадь, высота, нагрузка и комплектация. Замер бесплатный, расчёт — в день замера." },
        { q: "Какую нагрузку выдерживает?", a: "300–500 кг на ярус, точное значение — в проекте под ваш товар." },
      ],
      seoTitle: "Мезонин для склада в Ташкенте — проект и монтаж | RAXPRO",
      seoDesc: "Мезонинные системы RAXPRO: второй этаж склада на стеллажных стойках, настил, лестница и ограждение, 300–500 кг на ярус. Проект под здание, гарантия 10 лет.",
    },
    uz: {
      name: "Ombor uchun mezonin", short: "Mezoninlar",
      lead: "Stellaj tayanchlarida ombor ichidagi ikkinchi qavat: qurilish va ijarasiz oʻsha binoda qoʻshimcha maydon. Har bir mezonin xonangizga moslab loyihalanadi.",
      points: [
        { t: "Qurilishsiz maydon", d: "Toʻshamali platforma stellaj tayanchlariga oʻrnatiladi — ombor ikkinchi sathga ega boʻladi." },
        { t: "Ikki sathda ish", d: "Pastda — palletli yoki polkali stellajlar, yuqorida — saqlash yoki buyurtmalarni yigʻish." },
        { t: "Zinapoya va toʻsiq", d: "Ikkinchi sath toʻplamiga kiradi." },
        { t: "Binoga mos hisob", d: "Balandlik, yuklama va logistikani oʻlchov boʻyicha hisoblaymiz; konstruksiya polga ankerlanadi." },
      ],
      faq: [
        { q: "Mezonin qancha turadi?", a: "Narx loyiha boʻyicha hisoblanadi: maydon, balandlik, yuklama va komplektatsiya. Oʻlchov bepul, hisob — oʻlchov kuni." },
        { q: "Qancha yuklamaga chidaydi?", a: "Har yarusga 300–500 kg, aniq qiymat — tovaringizga moslangan loyihada." },
      ],
      seoTitle: "Toshkentda ombor uchun mezonin — loyiha va montaj | RAXPRO",
      seoDesc: "RAXPRO mezonin tizimlari: stellaj tayanchlarida omborning ikkinchi qavati, toʻshama, zinapoya va toʻsiq, har yarusga 300–500 kg. Binoga mos loyiha, 10 yil kafolat.",
    },
  },
  {
    group: "service",
    slug: "montazh-stellazhej",
    path: "/uslugi/montazh-stellazhej",
    section: "uslugi",
    cover: "/cases/mirvali-1.jpg",
    caseKeys: ["star", "avtozapchast", "bloom"],
    reviewIds: ["xonadon", "sobirjon", "muhriddin"],
    productSlugs: [PALLET, MEDIUM, ARCHIVE],
    specs: {
      ru: [{ k: "По Ташкенту", v: "бесплатно" }, { k: "По регионам", v: "по объёму, цену называем до оплаты счёта" }, { k: "Кто собирает", v: "свои монтажники в штате" }, { k: "После монтажа", v: "гарантийный документ на 10 лет" }],
      uz: [{ k: "Toshkent boʻylab", v: "bepul" }, { k: "Viloyatlarga", v: "hajm boʻyicha, narxni toʻlovdan oldin aytamiz" }, { k: "Kim yigʻadi", v: "shtatdagi oʻz montajchilarimiz" }, { k: "Montajdan keyin", v: "10 yillik kafolat hujjati" }],
    },
    ru: {
      name: "Монтаж стеллажей", short: "Монтаж",
      lead: "Стеллаж держит заявленную нагрузку, только если собран правильно: закреплён к полу, выставлен по уровню, с нужными зазорами. Собираем своими монтажниками по чертежу из проекта.",
      points: [
        { t: "По чертежу", d: "Сначала план расстановки под помещение, потом монтаж строго по нему." },
        { t: "Анкеровка и уровень", d: "Стойки крепятся к полу и выставляются по уровню — так конструкция работает на заявленную нагрузку." },
        { t: "Свои монтажники", d: "Собирают сотрудники RAXPRO, а не сторонняя бригада." },
        { t: "Документ после сдачи", d: "После монтажа выдаём гарантийный документ на 10 лет." },
      ],
      faq: [
        { q: "Сколько стоит монтаж?", a: "По Ташкенту — бесплатно. По регионам монтаж и разгрузку считаем по объёму проекта и называем до оплаты счёта." },
        { q: "Можно собрать самим?", a: "Можно, но гарантия не распространяется на монтаж силами третьих лиц с отступлением от проекта." },
        { q: "Монтируете стеллажи, купленные не у вас?", a: "Напишите, какие стеллажи и сколько, — менеджер ответит в рабочее время." },
      ],
      seoTitle: "Монтаж стеллажей в Ташкенте — бесплатно при заказе | RAXPRO",
      seoDesc: "Монтаж металлических стеллажей RAXPRO: по Ташкенту бесплатно, свои монтажники, анкеровка и сборка по проекту. Гарантийный документ на 10 лет после сдачи.",
    },
    uz: {
      name: "Stellajlarni montaj qilish", short: "Montaj",
      lead: "Stellaj faqat toʻgʻri yigʻilgandagina belgilangan yuklamani koʻtaradi: polga mahkamlangan, sath boʻyicha tekislangan, kerakli oraliqlar bilan. Loyihadagi chizma boʻyicha oʻz montajchilarimiz yigʻadi.",
      points: [
        { t: "Chizma boʻyicha", d: "Avval xonaga mos joylashtirish rejasi, keyin qatʼiy shu reja boʻyicha montaj." },
        { t: "Ankerlash va sath", d: "Tayanchlar polga mahkamlanadi va sath boʻyicha tekislanadi — shunda konstruksiya belgilangan yuklamada ishlaydi." },
        { t: "Oʻz montajchilarimiz", d: "Begona brigada emas, RAXPRO xodimlari yigʻadi." },
        { t: "Topshirgandan keyin hujjat", d: "Montajdan soʻng 10 yillik kafolat hujjatini beramiz." },
      ],
      faq: [
        { q: "Montaj qancha turadi?", a: "Toshkent boʻylab — bepul. Viloyatlarda montaj va tushirishni loyiha hajmi boʻyicha hisoblaymiz va toʻlovdan oldin aytamiz." },
        { q: "Oʻzimiz yigʻsak boʻladimi?", a: "Boʻladi, lekin loyihadan chetga chiqib uchinchi shaxslar tomonidan qilingan montajga kafolat tatbiq etilmaydi." },
        { q: "Sizdan olinmagan stellajlarni montaj qilasizmi?", a: "Qanday stellaj va qanchaligini yozing — menejer ish vaqtida javob beradi." },
      ],
      seoTitle: "Toshkentda stellajlarni montaj qilish — buyurtmada bepul",
      seoDesc: "RAXPRO metall stellajlarini montaj qilish: Toshkent boʻylab bepul, oʻz montajchilarimiz, loyiha boʻyicha ankerlash va yigʻish. Topshirgandan keyin 10 yillik kafolat hujjati.",
    },
  },
  {
    group: "buyers",
    slug: "garantiya",
    path: "/pokupatelyam/garantiya",
    section: "pokupatelyam",
    cover: "/cases/superpack-2.jpg",
    caseKeys: ["discovery", "superpack", "jac"],
    reviewIds: ["nurbek", "salohiddin", "sobirjon"],
    productSlugs: [PALLET, MEDIUM, ARCHIVE],
    specs: {
      ru: [{ k: "Срок", v: "10 лет" }, { k: "Оформление", v: "по договору, гарантийный документ после монтажа" }, { k: "Металл", v: "1 сорта, порошковая окраска" }, { k: "Документы", v: "договор, спецификация, план расстановки" }],
      uz: [{ k: "Muddat", v: "10 yil" }, { k: "Rasmiylashtirish", v: "shartnoma boʻyicha, montajdan keyin kafolat hujjati" }, { k: "Metall", v: "1-nav, kukunli boʻyoq" }, { k: "Hujjatlar", v: "shartnoma, spetsifikatsiya, joylashtirish rejasi" }],
    },
    ru: {
      name: "Гарантия 10 лет", short: "Гарантия",
      lead: "Гарантия на стеллажи RAXPRO — 10 лет по договору. Это вдвое больше, чем обычно дают на рынке. После монтажа вы получаете гарантийный документ на руки.",
      points: [
        { t: "В письменном виде", d: "Срок прописан в договоре, после монтажа выдаётся гарантийный документ." },
        { t: "Металл 1 сорта", d: "Порошковая окраска — поэтому мы можем дать 10 лет." },
        { t: "Проект — часть гарантии", d: "Нагрузки и расстановка зафиксированы в спецификации и плане — по ним и проверяем случай." },
        { t: "Честные исключения", d: "Перегруз сверх заявленной нагрузки, удар техникой, самостоятельная переделка и нарушение правил эксплуатации — не гарантийный случай." },
      ],
      faq: [
        { q: "Что делать, если что-то случилось?", a: "Позвоните или оставьте заявку — менеджер ответит в рабочее время и согласует осмотр." },
        { q: "Гарантия действует, если собирали сами?", a: "Если монтаж сделан третьими лицами с отступлением от проекта, гарантия на это не распространяется. Надёжнее — наш монтаж, по Ташкенту он бесплатный." },
      ],
      seoTitle: "Гарантия 10 лет на стеллажи — по договору | RAXPRO",
      seoDesc: "Гарантия RAXPRO на металлические стеллажи — 10 лет по договору, гарантийный документ после монтажа. Что покрывает гарантия и что нет.",
    },
    uz: {
      name: "10 yillik kafolat", short: "Kafolat",
      lead: "RAXPRO stellajlariga kafolat — shartnoma boʻyicha 10 yil. Bu bozorda odatda beriladiganidan ikki barobar koʻp. Montajdan keyin kafolat hujjati qoʻlingizga beriladi.",
      points: [
        { t: "Yozma shaklda", d: "Muddat shartnomada yozilgan, montajdan keyin kafolat hujjati beriladi." },
        { t: "1-nav metall", d: "Kukunli boʻyoq — shuning uchun 10 yil bera olamiz." },
        { t: "Loyiha — kafolat qismi", d: "Yuklamalar va joylashtirish spetsifikatsiya va rejada qayd etilgan — holat shular boʻyicha tekshiriladi." },
        { t: "Halol istisnolar", d: "Belgilangan yuklamadan ortiq yuk, texnika zarbasi, mustaqil ravishda oʻzgartirish va foydalanish qoidalarini buzish — kafolat holatiga kirmaydi." },
      ],
      faq: [
        { q: "Biror narsa boʻlsa nima qilish kerak?", a: "Qoʻngʻiroq qiling yoki ariza qoldiring — menejer ish vaqtida javob beradi va koʻrikni kelishadi." },
        { q: "Oʻzimiz yigʻsak kafolat amal qiladimi?", a: "Montaj uchinchi shaxslar tomonidan loyihadan chetga chiqib qilingan boʻlsa, kafolat bunga tatbiq etilmaydi. Ishonchlirogʻi — bizning montaj, Toshkent boʻylab u bepul." },
      ],
      seoTitle: "Stellajlarga 10 yillik kafolat — shartnoma boʻyicha | RAXPRO",
      seoDesc: "RAXPRO metall stellajlariga kafolat — shartnoma boʻyicha 10 yil, montajdan keyin kafolat hujjati. Kafolat nimalarni qoplaydi va nimalarni qoplamaydi.",
    },
  },
];
