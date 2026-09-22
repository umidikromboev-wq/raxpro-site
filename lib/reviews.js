// Клиентские отзывы из канала @RaxPro_otziv (id поста — в `src`).
// Тексты — дословные цитаты из переписок, голосовых и видео, переведённые по
// смыслу. Скриншоты переписок не публикуем: в них видны телефоны. Фото —
// вырезанные из тех же постов кадры объектов; видео — сжатые ролики из канала.
// Кто не подписался в чате — «Клиент RAXPRO», имён не придумываем.

const V = (id) => ({ video: `/reviews/video/r${id}.mp4`, poster: `/reviews/video/r${id}.jpg` });

export const REVIEWS = [
  // ——— Видеоинтервью ———
  {
    id: 'nurbek', src: 21, kind: 'video', ...V(21),
    name: 'Нурбек ака', nameUz: 'Nurbek aka',
    role: 'Магазин, Сергели', roleUz: 'Doʻkon, Sergeli',
    text: 'Я впервые входил в эту сферу и сильно мучился: искал в интернете, спрашивал знакомых. Встретились, посмотрел стеллажи — по всему городу выбрал именно эти. Привезли, установили, теперь всё на своих местах.',
    textUz: 'Bu sohaga birinchi marta kirib kelayotganim uchun juda qiynalganman: internetdan qidirdim, tanish-bilishlardan soʻradim. Uchrashib, stellajlarni koʻrib, shahar boʻyicha shunisini tanladim. Olib kelib joylashtirib berishdi — hozir hammasi oʻz oʻrnida.',
  },
  {
    id: 'muhriddin', src: 38, kind: 'video', ...V(38),
    name: 'Мухриддин ака', nameUz: 'Muhriddin aka',
    role: 'Магазин', roleUz: 'Doʻkon',
    text: 'Раньше делали полки сами, кустарно. Стеллажи стоят два месяца — эффект отличный: вмещается намного больше, глубокие, держат любой вес и не гнутся. По-моему, процентов 30–40 добавилось.',
    textUz: 'Avval polkalarni oʻzimiz qoʻlbola usulda qilib savdo qilardik. Stellaj qoʻyganimizga ikki oycha boʻldi — effekti zoʻr: koʻp sigʻadi, ichi chuqur, ogʻirlikni xohlagancha koʻtaradi, qiyshaymaydi. Menimcha oʻttiz–qirq foiz qoʻshildi.',
  },
  {
    id: 'sobirjon', src: 54, kind: 'video', ...V(54),
    name: 'Собиржон ака', nameUz: 'Sobirjon aka',
    role: 'Склад ресторана', roleUz: 'Restoran ombori',
    text: 'До стеллажей на складе не было порядка. Теперь на месте одной единицы размещаем три-четыре — четыре яруса. Увидели в Instagram, понравились качество и условия, привезли за один день. Рекомендуем.',
    textUz: 'Stellaj olishimizdan oldin omborda tartib yoʻq edi. Endi bitta narsa oʻrniga uchta-toʻrttasini joylaymiz — toʻrt qavat. Instagramda koʻrdik, sifati va takliflari yoqdi, bir kun ichida yetkazib berishdi. Tavsiya qilamiz.',
  },
  {
    id: 'avtoservis', src: 216, kind: 'video', ...V(216),
    name: 'Владелец автосервиса', nameUz: 'Avtoservis egasi',
    role: 'Tuningforcars.uz', roleUz: 'Tuningforcars.uz',
    text: 'Очень помогает: детали не царапаются, лежат красиво и аккуратно — клиент видит порядок. Держат до тонны. Рекомендую не только сервисам, но и большим участкам и дачам.',
    textUz: 'Menga rosa foydasi tegyapti: narsalar qirilmasdan, chizilmasdan chiroyli, akkuratniy turadi — mijozning koʻngli toʻq boʻladi. Tonnagacha bemalol koʻtaradi. Faqat servislarga emas, katta uchastkalar va dala hovlilarga ham tavsiya qilaman.',
  },
  {
    id: 'lego', src: 12, kind: 'video', ...V(12),
    name: 'Владелец магазина', nameUz: 'Doʻkon egasi',
    role: 'Складские стеллажи для магазина', roleUz: 'Doʻkon uchun ombor stellajlari',
    text: 'Первой проблемой при открытии магазина были стеллажи. Увидел ваши — готовое изделие, собирается как лего. Работа на 10–15 дней закрылась за один день. И прочность хорошая.',
    textUz: 'Doʻkon ochayotganda birinchi muammoyimiz stellaj boʻldi. Sizlarnikini koʻrib qoldim — tayyor mahsulot, lego kabi yigʻiladi. Oʻn–oʻn besh kunlik ish bir kunda bitib ketdi. Baquvvatligi ham yaxshi ekan.',
  },
  {
    id: 'vitrina', src: 4, kind: 'video', ...V(4),
    name: 'Владелец магазина', nameUz: 'Doʻkon egasi',
    role: 'Торговые стеллажи', roleUz: 'Savdo stellajlari',
    text: 'Раньше товар лежал на паллетах, коробки стояли на полу — покупатели берут, и всё в беспорядке. Сейчас всё наверху и на витрине: чисто, аккуратно, проход посередине свободен. Рекомендую.',
    textUz: 'Avval narsalarimiz poddonda, karobkalar yerda turardi — odamlar olganda pol bardak boʻlardi. Hozir hammasi tepada ham, vitrinada ham terilgan: toza, akkuratniy, oʻrtadan yuradigan yoʻl ochilgan. Tavsiya beraman.',
  },
  {
    id: 'rastalar', src: 17, kind: 'video', ...V(17),
    name: 'Владелец магазина', nameUz: 'Doʻkon egasi',
    role: 'Торговые стеллажи', roleUz: 'Savdo stellajlari',
    text: 'Полки хорошо разложены, каждая группа товара показана отдельно — покупателям нравится. Если чего-то нет, записываем и на следующий день уже ставим на стеллаж с ценником.',
    textUz: 'Rastalarimiz yaxshi taxlangan, har bir mahsulot alohida koʻrsatilgan — xaridorlarga yoqyapti. Yoʻq mahsulot boʻlsa yozib olamiz va ertasi kuni stellajga narxi bilan qoʻyamiz.',
  },
  {
    id: 'salohiddin', src: 53, kind: 'video', ...V(53),
    name: 'Салохиддин', nameUz: 'Salohiddin',
    role: 'Магазин, Ургут', roleUz: 'Doʻkon, Urgut',
    text: 'Открыли небольшой магазин в махалле — стеллажи поставила RaxPro. Удобно, компания подошла.',
    textUz: 'Mahallamizda kichkina doʻkon ochgan edik — stellajlarni RaxPro oʻrnatib berdi. Qulay ekan.',
  },

  // ——— Переписки ———
  {
    id: 'boburjon', src: 7, kind: 'text', photos: ['/reviews/photos/p7.jpg'],
    name: 'Бобуржон', nameUz: 'Boburjon',
    role: 'Sklad Andijon', roleUz: 'Sklad Andijon',
    text: 'Шахзода, спасибо — стеллажи собрали и установили. Большое спасибо.',
    textUz: 'Mana, Shahzoda, rahmat — stellajlarni terib oʻrnatib oldik, katta rahmat.',
  },
  {
    id: 'dildora', src: 35, kind: 'text', photos: ['/reviews/photos/p35.jpg'],
    name: 'Дилдора', nameUz: 'Dildora',
    role: 'Складские стеллажи', roleUz: 'Ombor stellajlari',
    text: 'Шахзода, вот поставили. Спасибо, красиво получилось.',
    textUz: 'Shahzoda, mana qoʻydik. Rahmat, chiroyli chiqdi.',
  },
  {
    id: 'sodiq', src: 91, kind: 'text', photos: ['/reviews/photos/p91.jpg'],
    name: 'Нематов Мухаммад Содик', nameUz: 'Nematov Muhammad Sodiq',
    role: 'Складские стеллажи', roleUz: 'Ombor stellajlari',
    text: 'Очень хорошо получилось. Большое спасибо, оплатил. В январе закажу ещё один на другой объект.',
    textUz: 'Juda ham zoʻr ekan. Katta rahmat, pulini berdim. Yanvarda boshqa joyga bir dona zakaz qilaman.',
  },
  {
    id: 'xonadon', src: 196, kind: 'text', photos: ['/reviews/photos/p196.jpg'],
    name: 'Клиент из Ташкента', nameUz: 'Toshkentlik mijoz',
    role: 'Стеллажи для дома', roleUz: 'Xonadon uchun stellajlar',
    text: 'Спасибо большое, установили. Получилось даже лучше, чем ожидал. Пусть ваше дело растёт, клиентов побольше. Всем родственникам и друзьям буду рекомендовать.',
    textUz: 'Rahmat katta, oʻrnatib ketishdi. Kutganimdan ham zoʻr narsa ekan. Ishlaringiz omadini bersin, mijozlaringiz koʻp boʻlsin. Hamma qarindosh va oʻrtoqlarimga tavsiya qilaman.',
  },
  {
    id: 'hazrat', src: 108, kind: 'text', photos: ['/reviews/photos/p108.jpg'],
    name: 'Хазрат ака', nameUz: 'Hazrat aka',
    role: 'Складские стеллажи', roleUz: 'Ombor stellajlari',
    text: 'Ассалому алайкум, отлично получилось.',
    textUz: 'Assalomu alaykum, zoʻr chiqdi.',
  },
  {
    id: 'baraka', src: 75, kind: 'text', photos: ['/reviews/photos/p75.jpg'],
    name: 'Клиент RAXPRO', nameUz: 'RAXPRO mijozi',
    role: 'Складские стеллажи', roleUz: 'Ombor stellajlari',
    text: 'Отлично получилось. Большое спасибо, слава Богу. Пусть ваши деньги будут с баракой.',
    textUz: 'Zoʻr chiqibdi. Katta rahmat, borimizga shukr. Pullaringizga baraka bersin.',
  },
  {
    id: 'lobar', src: 237, kind: 'text',
    name: 'Лобар Эшамонова', nameUz: 'Lobar Eshamonova',
    role: 'Складские стеллажи', roleUz: 'Ombor stellajlari',
    text: 'Барака вам, огромное спасибо! И ребята вежливые, молодцы. Спасибо.',
    textUz: 'Baraka toping, kattakon rahmat! Yigitlar ham muomalali, molodets. Rahmat.',
  },
  {
    id: 'hafiza', src: 213, kind: 'text',
    name: 'Хафиза Ниязова', nameUz: 'Hafiza Niyazova',
    role: 'Стеллажи для склада', roleUz: 'Ombor uchun stellajlar',
    text: 'Оплатили полностью — всё собрали и установили. Большое спасибо, пусть ваше дело процветает.',
    textUz: '100 foiz toʻladik — hammasini yigʻib oʻrnatib berishdi. Katta rahmat, baraka topinglar.',
  },
  {
    id: 'nazim', src: 223, kind: 'text',
    name: 'Назим ака', nameUz: 'Nazim aka',
    role: 'Среднегрузовые стеллажи, Сурхандарья', roleUz: 'Oʻrta yuklamali stellajlar, Surxondaryo',
    text: 'Доброе утро. Мы получили товар, спасибо. Хотим дозаказать ещё комплект внутренних полок.',
    textUz: 'Xayrli tong. Mahsulotni oldik, rahmat. Yana bir komplekt ichki javon buyurtma qilmoqchimiz.',
  },
  {
    id: 'shahob', src: 201, kind: 'text',
    name: 'Шахоб', nameUz: 'Shahob',
    role: 'Складские стеллажи', roleUz: 'Ombor stellajlari',
    text: 'Спасибо огромное. Отлично получилось.',
    textUz: 'Rahmat kattakon. Zoʻr boʻldi.',
  },
  {
    id: 'bekzod', src: 202, kind: 'text',
    name: 'Бекзод ака', nameUz: 'Bekzod aka',
    role: 'Складские стеллажи', roleUz: 'Ombor stellajlari',
    text: 'Спасибо за подарок, очень классно.',
    textUz: 'Sovgʻa uchun rahmat, juda ajoyib ekan.',
  },
  {
    id: 'sherzodxon', src: 267, kind: 'text',
    name: 'Шерзодхон ака', nameUz: 'Sherzodxon aka',
    role: 'Стеллажи для дома', roleUz: 'Xonadon uchun stellajlar',
    text: 'Шахзода, спасибо — вчера приехали и установили.',
    textUz: 'Shahzoda, rahmat — kecha kelib qoʻyib ketishdi.',
  },
  {
    id: 'ulugbek', src: 87, kind: 'text',
    name: 'Улугбек ака', nameUz: 'Ulugʻbek aka',
    role: 'Складские стеллажи', roleUz: 'Ombor stellajlari',
    text: 'Да, отлично. Спасибо вам.',
    textUz: 'Ha, zoʻr. Rahmat sizlarga.',
  },
  {
    id: 'anon36', src: 36, kind: 'text',
    name: 'Клиент RAXPRO', nameUz: 'RAXPRO mijozi',
    role: 'Складские стеллажи', roleUz: 'Ombor stellajlari',
    text: 'Шахзода, огромное спасибо. Всё отлично.',
    textUz: 'Shahzoda, kattakon rahmat. Hammasi zoʻr.',
  },
  {
    id: 'povtor85', src: 85, kind: 'text',
    name: 'Клиент RAXPRO', nameUz: 'RAXPRO mijozi',
    role: 'Повторный заказ', roleUz: 'Takroriy buyurtma',
    text: 'Потом нам нужно ещё два таких же комплекта.',
    textUz: 'Keyin bizga xuddi shu komplektdan ikkita kerak.',
  },
  {
    id: 'prilavok', src: 191, kind: 'text',
    name: 'Клиент RAXPRO', nameUz: 'RAXPRO mijozi',
    role: 'Торговые стеллажи', roleUz: 'Savdo stellajlari',
    text: 'Спасибо большое. Возьму ещё двусторонний прилавок.',
    textUz: 'Rahmat katta. Yana ikki taraflama prilavkadan olaman.',
  },
  {
    id: 'ru275', src: 275, kind: 'text',
    name: 'Клиент RAXPRO', nameUz: 'RAXPRO mijozi',
    role: 'Складские стеллажи', roleUz: 'Ombor stellajlari',
    text: 'Добрый день, всё хорошо. Начали пользоваться, товар выставляем уже на стеллажи. Спасибо.',
    textUz: 'Xayrli kun, hammasi yaxshi. Foydalanishni boshladik, tovarni stellajlarga qoʻyyapmiz. Rahmat.',
  },

  // ——— Голосовые ———
  {
    id: 'voice112', src: 112, kind: 'voice',
    name: 'Клиент RAXPRO', nameUz: 'RAXPRO mijozi',
    role: 'Доставка в регион', roleUz: 'Viloyatga yetkazish',
    text: 'Получил отправленное — так обрадовался, так понравилось! Видно, что сделано качественно. Спасибо огромное, пусть дело растёт и клиентов прибавляется. Закажу ещё один.',
    textUz: 'Joʻnatgan narsangizni qabul qilib oldim — shunaqangi xursand boʻldim, shunaqangi yoqdi! Sifatli ishlangani bilinyapti. Rahmat kattakon, ishingiz rivojini bersin, klientlaringiz koʻpaysin. Yana bitta zakaz qilaman.',
  },
  {
    id: 'voice214', src: 214, kind: 'voice',
    name: 'Клиент RAXPRO', nameUz: 'RAXPRO mijozi',
    role: 'Повторный заказ', roleUz: 'Takroriy buyurtma',
    text: 'Вчера отправленное уже поставили. Слава Богу, доехало хорошо — это двухметровый, а рядом первый, 1,6 м. Отлично, огромное спасибо. Ещё три-четыре планируем заказать.',
    textUz: 'Kecha yuborganlaringizni joylashtirdik. Alhamdulillah, yaxshi yetib keldi — bu ikki metrligi, bu yoqda birinchi olgan bir oltmishligimiz. Zoʻr, kattakon rahmat. Yana uchta-toʻrttaga zakaz berish niyatimiz bor.',
  },
  {
    id: 'voice186', src: 186, kind: 'voice',
    name: 'Клиент RAXPRO', nameUz: 'RAXPRO mijozi',
    role: 'Паллетные стеллажи', roleUz: 'Palletli stellajlar',
    text: 'Посмотрел — красиво получилось, отлично. Поставил пару паллет попробовать. Подключим свет и начнём раскладывать товар.',
    textUz: 'Koʻrdim — chiroyli chiqibdi, zoʻr chiqdi. Bir-ikkita poddon qoʻyib koʻrdim. Svetlarni ulab, keyin narsalarni taxlashni boshlaymiz.',
  },
  {
    id: 'voice195', src: 195, kind: 'voice',
    name: 'Клиент RAXPRO', nameUz: 'RAXPRO mijozi',
    role: 'Складские стеллажи', roleUz: 'Ombor stellajlari',
    text: 'Смотрится очень красиво, хорошо подошло. Заказал под более тяжёлый груз — это же ваш складской вариант.',
    textUz: 'Koʻrinishi juda chiroyli turibdi, zoʻr yarashdi. Ogʻirroq yuk koʻtarish uchun shunaqa qildirdim — bu sizlarning sklad uchun moʻljallangan variantingiz.',
  },
  {
    id: 'voice260', src: 260, kind: 'voice',
    name: 'Клиент из Хорезма', nameUz: 'Xorazmlik mijoz',
    role: 'Среднегрузовые стеллажи, Хорезм', roleUz: 'Oʻrta yuklamali stellajlar, Xorazm',
    text: 'Стеллажи пришли, всё хорошо, всё нормально. Поставили на место. Спасибо.',
    textUz: 'Stellajlar keldi, hammasi yaxshi, hammasi normal. Joyiga qoʻydik. Rahmat.',
  },
  {
    id: 'voice115', src: 115, kind: 'voice',
    name: 'Клиент RAXPRO', nameUz: 'RAXPRO mijozi',
    role: 'Складские стеллажи', roleUz: 'Ombor stellajlari',
    text: 'Спасибо, установили. Понравилось. Большое спасибо вам, не уставайте.',
    textUz: 'Rahmat, joylashtirib berishdi. Maʼqul keldi. Rahmat kattakon sizlarga, charchamanglar.',
  },
];

// Отзывы для главной: с конкретикой (объём, срок, повторный заказ), а не «спасибо,
// установили». Полный список — на /otzyvy. Порядок = порядок показа.
export const FEATURED_IDS = [
  'nurbek', 'muhriddin', 'sobirjon', 'lego', 'vitrina',
  'xonadon', 'sodiq', 'voice112', 'voice214', 'nazim', 'voice195',
];

export function featuredReviews() {
  const byId = new Map(REVIEWS.map((r) => [r.id, r]));
  return FEATURED_IDS.map((id) => byId.get(id)).filter(Boolean);
}

/** Отзыв в нужном языке; поля без перевода (video, poster) отдаём как есть.
 *  Фото объектов из постов на сайте больше не показываем — только текст. */
export function localizeReview(r, lang) {
  const uz = lang === 'uz';
  return {
    id: r.id, kind: r.kind, video: r.video, poster: r.poster,
    name: uz ? r.nameUz : r.name, role: uz ? r.roleUz : r.role, text: uz ? r.textUz : r.text,
  };
}
