// Информационные и юридические страницы. Google Merchant Center требует их
// наличия отдельными адресами: доставка, возврат, оферта, о компании.
// Срок обмена товара надлежащего качества — 10 дней (ст. 18 Закона
// Республики Узбекистан «О защите прав потребителей»), не 14 как в РФ.

export const POLICIES = {
  'dostavka-i-oplata': {
    ru: {
      title: 'Доставка и оплата',
      seoTitle: 'Доставка и оплата стеллажей в Ташкенте и по Узбекистану | RAXPRO',
      seoDesc:
        'Условия доставки стеллажей RAXPRO: по Ташкенту бесплатно, срок изготовления 3–10 рабочих дней, доставка по регионам Узбекистана. Оплата перечислением, наличными, в рассрочку и лизинг.',
      lead: 'Изготавливаем, привозим и собираем сами — без посредников. Ниже точные сроки, зоны и способы оплаты.',
      blocks: [
        {
          h: 'Сроки изготовления',
          items: [
            'Типовые позиции из каталога — 3–10 рабочих дней с момента подтверждения заказа.',
            'Нестандартные размеры и большие партии — срок называем после замера и расчёта, как правило до 20 рабочих дней.',
            'Точный срок менеджер подтверждает при подтверждении заказа, до оплаты.',
          ],
        },
        {
          h: 'Зоны и стоимость доставки',
          items: [
            'Ташкент (город) — доставка бесплатная, независимо от суммы заказа.',
            'Ташкентская область и регионы Узбекистана — доставка нашим транспортом или транспортной компанией. Стоимость зависит от адреса и объёма груза и называется до оплаты счёта.',
            'Разгрузка, подъём на этаж и монтаж — отдельная услуга нашей бригады, рассчитывается по объекту.',
          ],
        },
        {
          h: 'Способы оплаты',
          items: [
            'Перечисление на расчётный счёт по договору и счёту-фактуре — для юридических лиц и ИП.',
            'Наличными и банковской картой при получении или в офисе.',
            'Рассрочка Uzum Nasiya — для физических лиц.',
            'Лизинг — для крупных заказов юридических лиц.',
          ],
        },
        {
          h: 'Минимальная сумма заказа',
          text: 'Минимальная сумма заказа — 1 200 000 сум. Замер, расчёт нагрузок и проект стеллажной системы выполняем бесплатно и до оплаты.',
        },
        {
          h: 'Что происходит после оформления',
          items: [
            'Менеджер связывается в течение рабочего дня и подтверждает позиции, сроки и адрес.',
            'Выставляем счёт или договор — способом, удобным вам.',
            'Запускаем в производство и сообщаем дату доставки.',
            'Привозим, при необходимости собираем и передаём гарантийный документ на 10 лет.',
          ],
        },
      ],
    },
    uz: {
      title: 'Yetkazib berish va toʻlov',
      seoTitle: 'Toshkent va Oʻzbekiston boʻylab stellaj yetkazib berish va toʻlov | RAXPRO',
      seoDesc:
        'RAXPRO stellajlarini yetkazib berish shartlari: Toshkent boʻylab bepul, tayyorlash muddati 3–10 ish kuni, viloyatlarga yetkazish. Toʻlov pul oʻtkazma, naqd, boʻlib toʻlash va lizing orqali.',
      lead: 'Oʻzimiz ishlab chiqaramiz, oʻzimiz yetkazamiz va yigʻamiz — vositachisiz. Quyida aniq muddatlar, hududlar va toʻlov usullari.',
      blocks: [
        {
          h: 'Tayyorlash muddatlari',
          items: [
            'Katalogdagi tipovoy pozitsiyalar — buyurtma tasdiqlangandan soʻng 3–10 ish kuni.',
            'Nostandart oʻlchamlar va katta partiyalar — muddat oʻlchov va hisob-kitobdan soʻng aytiladi, odatda 20 ish kunigacha.',
            'Aniq muddatni menejer buyurtmani tasdiqlashda, toʻlovdan oldin bildiradi.',
          ],
        },
        {
          h: 'Yetkazish hududlari va narxi',
          items: [
            'Toshkent shahri — yetkazish bepul, buyurtma summasidan qatʼi nazar.',
            'Toshkent viloyati va Oʻzbekiston hududlari — oʻz transportimiz yoki transport kompaniyasi orqali. Narxi manzil va yuk hajmiga bogʻliq va hisob toʻlanishidan oldin aytiladi.',
            'Tushirish, qavatga koʻtarish va montaj — brigadamizning alohida xizmati, obyekt boʻyicha hisoblanadi.',
          ],
        },
        {
          h: 'Toʻlov usullari',
          items: [
            'Shartnoma va hisob-faktura asosida hisob raqamiga pul oʻtkazish — yuridik shaxslar va YTT uchun.',
            'Qabul qilishda yoki ofisda naqd pul va bank kartasi bilan.',
            'Uzum Nasiya boʻlib toʻlash — jismoniy shaxslar uchun.',
            'Lizing — yuridik shaxslarning yirik buyurtmalari uchun.',
          ],
        },
        {
          h: 'Buyurtmaning eng kam summasi',
          text: 'Buyurtmaning eng kam summasi — 1 200 000 soʻm. Oʻlchov, yuklama hisobi va stellaj tizimi loyihasini bepul hamda toʻlovdan oldin bajaramiz.',
        },
        {
          h: 'Rasmiylashtirilgandan keyin nima boʻladi',
          items: [
            'Menejer ish kuni davomida bogʻlanadi va pozitsiyalar, muddat hamda manzilni tasdiqlaydi.',
            'Sizga qulay usulda hisob yoki shartnoma yuboramiz.',
            'Ishlab chiqarishga qoʻyamiz va yetkazish sanasini xabar qilamiz.',
            'Yetkazamiz, kerak boʻlsa yigʻamiz va 10 yillik kafolat hujjatini topshiramiz.',
          ],
        },
      ],
    },
  },

  'vozvrat-i-obmen': {
    ru: {
      title: 'Возврат и обмен',
      seoTitle: 'Возврат и обмен стеллажей — условия | RAXPRO',
      seoDesc:
        'Условия возврата и обмена стеллажей RAXPRO: 10 дней на товар надлежащего качества по закону Республики Узбекистан, гарантия 10 лет на дефекты, порядок обращения.',
      lead: 'Работаем по Закону Республики Узбекистан «О защите прав потребителей». Ниже — что и в какой срок можно вернуть или обменять.',
      blocks: [
        {
          h: 'Товар надлежащего качества',
          items: [
            'Обменять или вернуть непродовольственный товар надлежащего качества можно в течение 10 дней с момента покупки (статья 18 Закона Республики Узбекистан «О защите прав потребителей»).',
            'Условие: товар не был в употреблении, сохранены товарный вид, упаковка, комплектность и потребительские свойства, есть документ, подтверждающий покупку у нас.',
            'Если аналогичного товара нет в наличии, возвращаем стоимость.',
          ],
        },
        {
          h: 'Изделия по индивидуальному заказу',
          text: 'Стеллажные секции, изготовленные по вашим индивидуальным размерам, чертежу или проекту, обмену и возврату как товар надлежащего качества не подлежат. На дефекты изготовления это ограничение не распространяется — они устраняются по гарантии.',
        },
        {
          h: 'Если обнаружен дефект',
          items: [
            'На всю продукцию действует гарантия 10 лет, оформленная документом.',
            'При обнаружении производственного дефекта мы бесплатно ремонтируем изделие, заменяем повреждённый элемент или всю секцию — по согласованию с вами.',
            'Если устранить дефект невозможно, возвращаем стоимость товара.',
            'Гарантия не распространяется на повреждения от перегруза сверх заявленной нагрузки, удара техникой, самостоятельной переделки конструкции и нарушения правил эксплуатации.',
          ],
        },
        {
          h: 'Как оформить возврат',
          items: [
            'Позвоните нам или напишите в Telegram / WhatsApp — опишите ситуацию и приложите фото.',
            'Согласуем дату осмотра или вывоза. По Ташкенту забираем товар своим транспортом.',
            'После приёмки товара возвращаем деньги тем же способом, которым была произведена оплата, в сроки, установленные законодательством Республики Узбекистан.',
          ],
        },
      ],
    },
    uz: {
      title: 'Qaytarish va almashtirish',
      seoTitle: 'Stellajlarni qaytarish va almashtirish shartlari | RAXPRO',
      seoDesc:
        'RAXPRO stellajlarini qaytarish va almashtirish shartlari: sifatli tovar uchun Oʻzbekiston qonuni boʻyicha 10 kun, nuqsonlarga 10 yil kafolat, murojaat tartibi.',
      lead: 'Oʻzbekiston Respublikasining «Isteʼmolchilar huquqlarini himoya qilish toʻgʻrisida»gi Qonuni asosida ishlaymiz. Quyida nimani va qaysi muddatda qaytarish yoki almashtirish mumkinligi.',
      blocks: [
        {
          h: 'Sifatli tovar',
          items: [
            'Sifatli nooziq-ovqat mahsulotini xarid qilingan kundan boshlab 10 kun ichida almashtirish yoki qaytarish mumkin (Oʻzbekiston Respublikasi «Isteʼmolchilar huquqlarini himoya qilish toʻgʻrisida»gi Qonunining 18-moddasi).',
            'Shart: tovar ishlatilmagan boʻlishi, tovar koʻrinishi, qadoqi, butligi va isteʼmol xususiyatlari saqlangan boʻlishi hamda bizdan xarid qilinganini tasdiqlovchi hujjat boʻlishi kerak.',
            'Agar shunga oʻxshash tovar mavjud boʻlmasa, qiymatini qaytaramiz.',
          ],
        },
        {
          h: 'Individual buyurtma asosidagi mahsulotlar',
          text: 'Sizning individual oʻlchamlaringiz, chizmangiz yoki loyihangiz boʻyicha tayyorlangan stellaj seksiyalari sifatli tovar sifatida almashtirilmaydi va qaytarilmaydi. Bu cheklov ishlab chiqarish nuqsonlariga taalluqli emas — ular kafolat boʻyicha bartaraf etiladi.',
        },
        {
          h: 'Nuqson aniqlansa',
          items: [
            'Barcha mahsulotga hujjat bilan rasmiylashtirilgan 10 yillik kafolat amal qiladi.',
            'Ishlab chiqarish nuqsoni aniqlanganda mahsulotni bepul taʼmirlaymiz, shikastlangan elementni yoki butun seksiyani almashtiramiz — siz bilan kelishilgan holda.',
            'Nuqsonni bartaraf etish imkoni boʻlmasa, tovar qiymatini qaytaramiz.',
            'Kafolat eʼlon qilingan yuklamadan ortiq yuklash, texnika zarbasi, konstruksiyani mustaqil oʻzgartirish va foydalanish qoidalarini buzish natijasidagi shikastlanishlarga taalluqli emas.',
          ],
        },
        {
          h: 'Qaytarishni qanday rasmiylashtirish kerak',
          items: [
            'Bizga qoʻngʻiroq qiling yoki Telegram / WhatsApp orqali yozing — vaziyatni tavsiflang va rasm ilova qiling.',
            'Koʻrik yoki olib ketish sanasini kelishamiz. Toshkent boʻylab tovarni oʻz transportimizda olib ketamiz.',
            'Tovar qabul qilingandan soʻng pulni toʻlov qilingan usulda, Oʻzbekiston Respublikasi qonunchiligida belgilangan muddatlarda qaytaramiz.',
          ],
        },
      ],
    },
  },

  'publichnaya-oferta': {
    ru: {
      title: 'Публичная оферта',
      seoTitle: 'Публичная оферта — условия продажи | RAXPRO',
      seoDesc:
        'Публичная оферта RAXPRO: предмет договора, порядок оформления заказа, цена и оплата, доставка, гарантия 10 лет, возврат, обработка персональных данных.',
      lead: 'Настоящий документ определяет условия, на которых RAXPRO продаёт продукцию, представленную на сайте raxpro.uz. Оформление заказа означает согласие с этими условиями.',
      blocks: [
        {
          h: '1. Предмет',
          text: 'Продавец — компания RAXPRO, производитель металлических стеллажей и систем хранения (г. Ташкент). Продавец обязуется передать Покупателю продукцию, представленную в каталоге сайта, а Покупатель — принять её и оплатить на условиях настоящей оферты.',
        },
        {
          h: '2. Оформление заказа',
          items: [
            'Заказ оформляется через корзину на сайте, по телефону, в Telegram или WhatsApp.',
            'После оформления менеджер связывается с Покупателем и подтверждает состав заказа, стоимость, срок изготовления и адрес доставки.',
            'Договор считается заключённым с момента такого подтверждения сторонами.',
          ],
        },
        {
          h: '3. Цена и оплата',
          items: [
            'Цены на сайте указаны в сумах Республики Узбекистан за одну секцию в базовой комплектации.',
            'Продавец вправе изменять цены; при этом цена уже подтверждённого заказа изменению не подлежит.',
            'Оплата производится перечислением на расчётный счёт, наличными, банковской картой, в рассрочку или лизингом — по согласованию сторон.',
            'Онлайн-оплата на сайте не производится.',
          ],
        },
        {
          h: '4. Доставка',
          text: 'Условия, сроки и стоимость доставки определяются разделом «Доставка и оплата» и являются частью настоящей оферты. По городу Ташкенту доставка бесплатная.',
        },
        {
          h: '5. Гарантия',
          text: 'На продукцию собственного производства предоставляется гарантия 10 лет, оформленная гарантийным документом. Гарантия покрывает производственные дефекты при соблюдении заявленных нагрузок и правил эксплуатации.',
        },
        {
          h: '6. Возврат и обмен',
          text: 'Порядок возврата и обмена определяется разделом «Возврат и обмен» и Законом Республики Узбекистан «О защите прав потребителей».',
        },
        {
          h: '7. Персональные данные',
          items: [
            'Оформляя заказ, Покупатель даёт согласие на обработку указанных им данных (имя, телефон, адрес) для исполнения заказа.',
            'Данные используются только для связи по заказу и его доставки и не передаются третьим лицам, кроме привлекаемых для доставки.',
          ],
        },
        {
          h: '8. Ответственность',
          text: 'Продавец не несёт ответственности за ущерб, возникший из-за нарушения Покупателем заявленных нагрузок, самостоятельной переделки конструкции или монтажа силами третьих лиц с отступлением от проекта.',
        },
        {
          h: '9. Контакты продавца',
          text: 'Все контактные данные, адрес и режим работы указаны на странице «Контакты». По любым вопросам, связанным с заказом, можно обратиться по телефону или в мессенджерах, указанных на сайте.',
        },
      ],
    },
    uz: {
      title: 'Ommaviy oferta',
      seoTitle: 'Ommaviy oferta — sotish shartlari | RAXPRO',
      seoDesc:
        'RAXPRO ommaviy ofertasi: shartnoma predmeti, buyurtma rasmiylashtirish tartibi, narx va toʻlov, yetkazib berish, 10 yil kafolat, qaytarish, shaxsiy maʼlumotlar.',
      lead: 'Ushbu hujjat RAXPRO raxpro.uz saytida taqdim etilgan mahsulotni sotish shartlarini belgilaydi. Buyurtma rasmiylashtirish ushbu shartlarga rozilik hisoblanadi.',
      blocks: [
        {
          h: '1. Predmet',
          text: 'Sotuvchi — RAXPRO kompaniyasi, metall stellajlar va saqlash tizimlari ishlab chiqaruvchisi (Toshkent sh.). Sotuvchi sayt katalogida taqdim etilgan mahsulotni Xaridorga topshirish, Xaridor esa uni qabul qilib, ushbu oferta shartlari asosida toʻlash majburiyatini oladi.',
        },
        {
          h: '2. Buyurtmani rasmiylashtirish',
          items: [
            'Buyurtma saytdagi savat orqali, telefon, Telegram yoki WhatsApp orqali rasmiylashtiriladi.',
            'Rasmiylashtirilgandan soʻng menejer Xaridor bilan bogʻlanadi va buyurtma tarkibi, qiymati, tayyorlash muddati hamda yetkazish manzilini tasdiqlaydi.',
            'Shartnoma tomonlar tomonidan shunday tasdiqlangan paytdan tuzilgan hisoblanadi.',
          ],
        },
        {
          h: '3. Narx va toʻlov',
          items: [
            'Saytdagi narxlar Oʻzbekiston Respublikasi soʻmida, bazaviy komplektdagi bitta seksiya uchun koʻrsatilgan.',
            'Sotuvchi narxlarni oʻzgartirishga haqli; bunda allaqachon tasdiqlangan buyurtma narxi oʻzgartirilmaydi.',
            'Toʻlov hisob raqamiga oʻtkazma, naqd pul, bank kartasi, boʻlib toʻlash yoki lizing orqali — tomonlar kelishuviga koʻra amalga oshiriladi.',
            'Saytda onlayn toʻlov amalga oshirilmaydi.',
          ],
        },
        {
          h: '4. Yetkazib berish',
          text: 'Yetkazib berish shartlari, muddatlari va narxi «Yetkazib berish va toʻlov» boʻlimida belgilanadi va ushbu ofertaning qismi hisoblanadi. Toshkent shahri boʻylab yetkazish bepul.',
        },
        {
          h: '5. Kafolat',
          text: 'Oʻz ishlab chiqarishimizdagi mahsulotga kafolat hujjati bilan rasmiylashtirilgan 10 yillik kafolat beriladi. Kafolat eʼlon qilingan yuklamalar va foydalanish qoidalariga rioya qilinganda ishlab chiqarish nuqsonlarini qoplaydi.',
        },
        {
          h: '6. Qaytarish va almashtirish',
          text: 'Qaytarish va almashtirish tartibi «Qaytarish va almashtirish» boʻlimi hamda Oʻzbekiston Respublikasining «Isteʼmolchilar huquqlarini himoya qilish toʻgʻrisida»gi Qonuni bilan belgilanadi.',
        },
        {
          h: '7. Shaxsiy maʼlumotlar',
          items: [
            'Buyurtma rasmiylashtirar ekan, Xaridor koʻrsatgan maʼlumotlarini (ism, telefon, manzil) buyurtmani bajarish uchun qayta ishlashga rozilik beradi.',
            'Maʼlumotlar faqat buyurtma boʻyicha bogʻlanish va uni yetkazish uchun ishlatiladi hamda yetkazishga jalb qilinganlardan boshqa uchinchi shaxslarga berilmaydi.',
          ],
        },
        {
          h: '8. Javobgarlik',
          text: 'Sotuvchi Xaridor tomonidan eʼlon qilingan yuklamalar buzilishi, konstruksiyani mustaqil oʻzgartirish yoki uchinchi shaxslar tomonidan loyihadan chetlab montaj qilinishi natijasida yuzaga kelgan zarar uchun javobgar emas.',
        },
        {
          h: '9. Sotuvchining aloqa maʼlumotlari',
          text: 'Barcha aloqa maʼlumotlari, manzil va ish vaqti «Aloqa» sahifasida koʻrsatilgan. Buyurtma bilan bogʻliq har qanday savol boʻyicha saytda koʻrsatilgan telefon yoki messenjerlar orqali murojaat qilish mumkin.',
        },
      ],
    },
  },
};

export function getPolicy(slug) {
  return POLICIES[slug] || null;
}

export const POLICY_SLUGS = Object.keys(POLICIES);
