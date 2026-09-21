# -*- coding: utf-8 -*-
"""Собирает research/report/raxpro-research.html из данных ниже.
Картинки — research/report/img/*.jpg (720px герои, 900px полосы)."""
import html, os
D = os.path.dirname(os.path.abspath(__file__))

# ---------------------------------------------------------------- доска
BOARD = [
 ("Узбекистан", [
  ("uz-raxpro","raxpro.uz — мы","Тёмно-синий герой, квиз на 4 вопроса, чипы «замер 24 ч / 10 лет».","Нет цен и каталога на главной, направления без размеров, нет «за паллетоместо»."),
  ("uz-prostellaj","prostellaj.uz","Магазин с ценами в сумах, акция 2+1, Google 5.0 / Yandex 4.7, письма клиентов, категории «по поводу».","Шаблон интернет-магазина, белые рендеры, нет проектирования."),
  ("uz-promet","promet.uz (Железная мебель)","Каталог сейфов и мебели, WhatsApp/Telegram в шапке.","Стеллажи — одна из 20 категорий."),
  ("uz-innotek","innotek.uz","Фото склада + SEO-заголовок.","Текстовая простыня, ни цен, ни расчёта."),
 ]),
 ("Москва и Питер", [
  ("ru-1logistik","1logistik.ru (FIRST)","3D-иллюстрация, NPS 9,8, 25 000+ проектов, квиз «какие данные знаете», кейсы с цифрами.","Перегружен текстом и виджетами."),
  ("ru-gortorgsnab","gortorgsnab.ru (ГТС)","«Цена от 2 200 ₽ за паллетоместо», 30 000+ проектов, видео с производства, конфигуратор в меню.","Дизайн 2015 года."),
  ("ru-kifato","kifato-mk.com","Тёмный editorial, цифры в герое, контуры типов стеллажей, Wildberries·Магнит.","Нет цен и самообслуживания."),
  ("ru-stellmart","stellmart.ru","«Расширенная гарантия до 7 лет, даже на б/у», выкуп стеллажей, гарантия лучшей цены.","Устаревший магазин."),
  ("ru-stelkon","stelkon.ru","«Бесплатный проект склада», FAQ про крепление к полу и оплату.","Ничего интерактивного."),
  ("ru-kiit","kiit.ru","Тендерная подача, «пригласить в тендер».","Каталог без цен."),
  ("ru-dimax","dimaxmet.ru","Фильтры по высоте/ширине/ярусам, цены.","Магазин без проектирования."),
  ("ru-profstellag","profstellag.ru","«Оцинкованные от 2 600 руб», хиты продаж.","Шаблон 2010-х."),
  ("ru-whtrade","whtrade.ru","«Рассчитать стоимость проекта».","Пустая главная."),
  ("ru-promet","promet.ru","Слайдер сейфов и дверей.","Стеллажи вторичны."),
  ("ru-steltek","stel-teh.ru","12 000 позиций, сертификация.","Шаблон."),
 ]),
 ("Конструкторы (RU)", [
  ("cfg-pilometr","constructor.pilometr.ru","3D-конструктор: секции, тип секции, В/Ш/Г, полки, гид из 12 шагов, «Готовые комплекты», «Спецификация». Работает на телефоне.","Только полочные стеллажи для дома."),
  ("cfg-arelan","constructor.arelan.ru","Тот же движок (white-label).","—"),
  ("cfg-komod","komodmsk.ru/constructor","Слайдеры Ш/В/Г, живая цена, силуэт человека, «сделаем за 4–7 дней».","Мебель, не металл."),
  ("cfg-vivat","mebel.com (VIVAT)","3D-планировщик комнаты.","Тяжёлый, обучение мышкой."),
  ("cfg-domium","domiumf.ru","«Как заказать в 3 шага» текстом.","Конструктор не виден."),
 ]),
 ("Казахстан", [
  ("kz-idia","idiamarket.kz","Фильтры цена/высота/глубина/ширина/нагрузка, «3D Дизайн» в меню.","Шаблон."),
  ("kz-lkw","lkw-safe.kz","Тёмный герой + форма консультации + «Как мы работаем».","Капча поверх формы."),
  ("kz-metalgroup","metalgroup.kz","Каталог с иконками типов.","Шаблон."),
  ("kz-stellazh","stellazh.kz (Satu)","Витрина маркетплейса.","Не свой сайт."),
  ("kz-imeb","imebkz.kz","Карточки «узнать цену».","Битые картинки."),
  ("kz-gmsatu","almaty.gmsatu.com","Тот же движок, что promet.uz.","—"),
 ]),
 ("Мировые лидеры", [
  ("w-mecalux","mecalux.com","Страница продукта: product → advantages → applications → gallery → testimonials → cases → configurations → components → accessories.","Cookie-стена, нет цен."),
  ("w-shelvinginc","shelving.com — 3D Pallet Rack Builder","Рама → балки → ярусы → секции, живая спецификация с артикулами и суммой.","Ортографический 3D, поп-ап скидки поверх."),
  ("w-rackingwizard","racking-wizard.com","«Design a warehouse in 3 steps» — SaaS для продавцов стеллажей.","Инструмент, не сайт продавца."),
  ("w-arracking","ar-racking.com","Красный герой, кейсы.","Нет самообслуживания."),
  ("w-dexion","dexion.com","«Up to 20 % more storage capacity with P90».","Корпоратив."),
  ("w-ssi","ssi-schaefer.com","Опрос-поп-ап, корпоративный.","Тяжёлый."),
  ("w-unarco","unarcorack.com — Rack Engine","Программа расчёта нагрузок по запросу.","Скрытый инструмент."),
  ("w-configurix","configurix.com","3D-конфигуратор склада как продукт: геометрия → стеллажи → цена → КП.","Только демо."),
 ]),
 ("Дизайн-референсы (смежные)", [
  ("d-usm","usm.com","«Design your own», 3D-конфигуратор, «ready to install in 14–16 weeks», код конфигурации.","—"),
  ("d-vitsoe","vitsoe.com/606","Одна система, одно фото, персональный планировщик с портретом, «we don't earn commission».","—"),
  ("d-regalraum","regalraum.com","Конфигуратор + FAQ о планировании + образцы отделки.","Cookie-стена."),
  ("d-string","stringfurniture.com","«Plan & Design».","—"),
  ("d-roomle","roomle.com","Демо 3D-конфигураторов полок.","—"),
  ("d-smow","smow.com","Обзор шести конфигураторов: PDF и заказ.","—"),
  ("d-elfa","elfa.com","«Explore our planning tool».","—"),
  ("d-kardex","kardex.com","«Real stories. Smart growth».","—"),
  ("d-modernshelving","modernshelving.com","Бесплатный дизайн-сервис.","—"),
 ]),
]

# ---------------------------------------------------------------- фишки
# (категория, [ (img, заголовок, источник, что закрывает, как переносим, цена) ])
ELEMENTS = [
 ("01 · Первый экран", [
  ("el-gortorgsnab-pallet-01","Цена за паллетоместо в шапке","gortorgsnab.ru","Страх 1 — «сколько стоит?» до звонка","«от N сум за паллетоместо»: считаем из ядра lib/rack по паллетному SKU; цифру подтвердить у клиента","дёшево"),
  ("el-kifato-01","Три цифры внутри героя","kifato-mk.com","Страх 5 — завод или кустарь","1000+ проектов · до 4 т на ярус · с 2021 — в герой, а не в отдельный блок","дёшево"),
  ("el-usm-01","Обещание сроком, не качеством","usm.com · komodmsk.ru","Страх 4 — сроки","«расчёт 24 ч · производство N дней · монтаж N дней» — сроки из FAQ raxpro.uz","дёшево"),
 ]),
 ("02 · Доказательство цифрой", [
  ("el-1logistik-pallet-06","Кейс с тремя метриками","1logistik.ru · prostellaj.uz","Критерий 3 — сколько влезет","У каждого проекта: м² · паллетомест · высота · дни монтажа","дёшево — данные у клиента"),
  ("el-1logistik-pallet-10","Таблица нагрузок по высоте рамы","1logistik.ru","Страх 2 — выдержит ли","Таблица из паспорта производителя: сечение × толщина × высота → кг","дёшево, нужен паспорт"),
  ("el-1logistik-pallet-02","NPS и год основания рядом с видео","1logistik.ru","Страх 5","Google-оценка + «с 2021» + 40-сек видео основателя с производства","средне — съёмка"),
 ]),
 ("03 · Снятие конкретного страха", [
  ("el-stellmart-01","Гарантия как оффер первого экрана","stellmart.ru","Страх 7 — гарантия на словах","10 лет по документу — показать сам гарантийный талон, не иконку","дёшево"),
  ("el-1logistik-pallet-09","«Что вы получите после покупки»","1logistik.ru","Страхи 6–7","Блок «На руки»: паспорт изделия, схема нагрузок, гарантийный талон, акт монтажа","дёшево"),
  ("el-stelkon-05","FAQ про пол, анкеры и оплату","stelkon.ru","Страх 2","Дополнить FAQ: «сколько анкеров», «нужен ли ровный пол», «как крепится к полу»","дёшево"),
  ("el-stellmart-10","«Нашли дешевле — снизим»","stellmart.ru","Страх 1/5","Только если клиент подтвердит политику цены","решение клиента"),
 ]),
 ("04 · Форма", [
  ("el-1logistik-pallet-05","Квиз «какие данные вы знаете?»","1logistik.ru","Критерий 3","Шаги 2–5 квиза переписать: спрашивать то, что человек знает (паллетомест / площадь / ряды / ничего), с иллюстрацией","средне"),
  ("el-prostellaj-01","«Ответим онлайн за 5 минут» + мессенджеры в шапке","prostellaj.uz","Страх 6 — тишина после заявки","Поднять «5 минут» из чипов в шапку рядом с телефоном и TG","дёшево"),
  ("el-regalraum-04","«Можно прислать эскиз?»","regalraum.com","Критерий 3","Поле для фото/чертежа помещения в форме и TG-боте","средне"),
 ]),
 ("05 · Конфигуратор", [
  ("cfg-pilometr-0","3D-конструктор с секциями и спецификацией","constructor.pilometr.ru","Страхи 1 и 3","Ядро — публичный /konstruktor на движке lib/rack (генератор КП уже считает раскладку, спецификацию и цену)","дорого, но 60 % готово"),
  ("cfg-shelvinginc-2","Живая спецификация с суммой","shelving.com","Страх 1","Рамы · балки · замки · анкеры · настилы → итого; формулы уже в lib/rack/spec.ts","средне"),
  ("cfg-komod-0","Слайдеры и силуэт человека","komodmsk.ru","Критерий 3","Фигурка человека рядом со стеллажом в конфигураторе — фигурки уже есть в 3D-герое","дёшево"),
  ("cfg-rackingwizard-1","«Спроектируй склад в 3 шага»","racking-wizard.com","Когнитивная нагрузка","Тип → размеры → результат; ровно три экрана","средне"),
  ("cfg-usm-1","Код конфигурации, чтобы вернуться","usm.com","Страх 6","Ссылка raxpro.uz/tp#… уже есть — назвать её «Сохранить и отправить коллеге»","дёшево"),
  ("cfg-pilometr-0-m","Работает пальцем на телефоне","constructor.pilometr.ru","Мобильный трафик","Жесты: один палец — вращение, два — зум; панель параметров снизу","средне"),
 ]),
 ("06 · Интерактив на изображении", [
  ("el-1logistik-pallet-08","Схема элементов с подписями","1logistik.ru","Страх 2","Хотспоты на 3D: стойка, балка, замок, анкер, отбойник — с толщиной металла","средне"),
  ("el-kifato-03","Контуры типов стеллажей","kifato-mk.com","Навигация","Карточки направлений в едином линейном стиле из нашего 3D","средне — иллюстрации"),
  ("el-mecalux-pallet-08","Изометрические конфигурации","mecalux.com","Критерий 3","Фронтальный / двойной / drive-in как изометрия из RackScene","средне"),
 ]),
 ("07 · Соцдоказательство", [
  ("el-prostellaj-07","Google и Yandex оценки с числом отзывов","prostellaj.uz","Страх 5","Виджет Google-отзывов; сейчас только свой TG-канал","дёшево"),
  ("el-stellmart-09","Сканы благодарственных писем","stellmart.ru · prostellaj.uz","Страх 5","3–5 писем от клиентов из списка (Uzum, Super Pack, Kapitalbank)","дёшево — запросить"),
  ("el-mecalux-pallet-07","Отзыв с должностью и компанией","mecalux.com","Страх 5","В слайдере: имя · должность · компания, а не «Партнёр»","дёшево"),
 ]),
 ("08 · Прозрачность процесса", [
  ("el-vitsoe-606-04","Персональный планировщик с портретом","vitsoe.com","Страх 6","«Ваш инженер»: фото + имя + кнопка в TG; блок «Эксперты» уже есть — привязать к этапам","дёшево"),
  ("el-prostellaj-10","Команда по ролям","prostellaj.uz","Страх 4","Проектировщик / монтажник / инженер производства с фото","дёшево"),
  ("el-marya-01","Чат с именем консультанта и обещанием времени","marya.ru","Страх 6","«Замерщик у вас завтра» вместо «оставьте заявку»","дёшево"),
 ]),
 ("09 · Прозрачность цены", [
  ("el-1logistik-pallet-04","Цена «от» на карточке типа","1logistik.ru · idiamarket.kz","Страх 1","На каждой карточке направления: «от N сум/секция» из products.js","дёшево"),
  ("el-gortorgsnab-pallet-03","Рассрочка цифрами","gortorgsnab.ru","Страх 1","Uzum Nasiya до 25 млн — показать схемой: аванс / месяцев / переплата","дёшево"),
  ("el-1logistik-pallet-01","Кнопка «Калькулятор стоимости» рядом с заявкой","1logistik.ru","Страх 1","Две кнопки в герое: «Спроектировать» и «Заявка»","дёшево"),
 ]),
 ("10 · Люди", [
  ("el-1logistik-pallet-02","Видео основателя","1logistik.ru","Страх 5","Хуршид на производстве, 40 секунд","средне — съёмка"),
 ]),
 ("11 · Микровзаимодействия", [
  ("cfg-shelvinginc-1","Липкий итог при скролле","shelving.com","Страх 1","Полоса «паллетомест · цена от · Получить спецификацию» прилипает внизу","дёшево"),
  ("el-marya-03","«AI-визуализация за минуту»","marya.ru","Критерий 3","«Покажем ваш склад» — рендер по фото помещения (Higgsfield/nano-banana уже в пайплайне)","средне"),
 ]),
 ("12 · Структура и навигация", [
  ("el-prostellaj-03","Категории «по поводу»","prostellaj.uz","Сегментация","Вторая ось: склад · магазин · архив · производство · гараж","средне"),
  ("el-idia-01","Фильтры по размерам и нагрузке","idiamarket.kz · dimaxmet.ru","Критерий 3","Каталог с фильтрами dims/loadKg из products.js","средне"),
  ("el-mecalux-pallet-03","Страница продукта по схеме Mecalux","mecalux.com","Весь путь","Шаблон страницы направления: продукт → плюсы → где применяют → галерея → отзывы → кейсы → конфигурации → элементы → аксессуары","средне"),
 ]),
]

MOVES = [
 ("Перенести вопрос менеджера в интерфейс","Квиз «что вы знаете» + конфигуратор со спецификацией: цена и паллетомест до звонка."),
 ("Назвать цену единицей клиента","«за паллетоместо», а не «за секцию». Единица, которой считает склад."),
 ("Сделать видимым то, что уже есть","Ядро lib/rack, 3D-сцена, гарантия документом, ISO, 1000+ проектов — с цифрами."),
 ("Привязать обещание к сроку","5 минут · 24 часа · N дней производство · N дней монтаж."),
 ("Закрыть страх до формулировки","Таблица нагрузок, схема элементов, «что получаете на руки»."),
 ("Разделить по поводу, не по типу","«Для кого» как вторая ось навигации."),
 ("Показать, что будет после","Паспорт, акт монтажа, гарантийный талон, инженер по имени."),
 ("Отдать документ вместо звонка","PDF-спецификация из конфигуратора — генератор КП это уже умеет."),
]

BLOCKS = [
 # (блок, что сейчас, что делаем, откуда, приоритет)
 ("Герой","3D-сцена (ветка feat/rack-hero-detail), квиз","Оставить 3D. Добавить: «от N сум/паллетоместо», три цифры, две кнопки «Спроектировать» / «Заявка»","ГТС, Kifato, FIRST","1"),
 ("Конфигуратор /konstruktor","Есть только внутренний генератор КП под паролем","Публичная страница: 3 шага → 3D + план + спецификация + цена от + PDF + ссылка","Пилометр, Shelving.com, Racking Wizard","1"),
 ("Направления (5 типов)","Карточки с фото и одной строкой","Контур-иллюстрация, «от N сум», нагрузка, высота, «для кого», кнопка «Спроектировать этот тип»","Kifato, FIRST","1"),
 ("Страница направления","Нет отдельных лендингов","Шаблон Mecalux: продукт → плюсы → применения → галерея → отзывы → кейсы → конфигурации → элементы → аксессуары → таблица нагрузок","Mecalux, FIRST","2"),
 ("Кейсы / проекты","Слайдер с одной строкой описания","Карточка проекта: м² · паллетомест · высота · дни · тип техники; фото до/после","FIRST, ProStellaj","1"),
 ("Как мы работаем","4 этапа без сроков","4 этапа со сроками и «что получаете на руки» после каждого","Stelkon, FIRST","2"),
 ("Люди","Основатель + раздел «Эксперты»","«Ваш инженер» с TG, команда по ролям, видео основателя","Vitsœ, ProStellaj","2"),
 ("Соцдоказательство","Логотипы, ISO, TG-канал","Google-оценка, письма, отзыв с должностью, «что построили» под логотипами","ProStellaj, Stellmart, Mecalux","2"),
 ("Цена и оплата","«от 1,2 млн», Nasiya текстом","Блок «из чего складывается цена», рассрочка цифрами, «от» на карточках","ГТС, FIRST","2"),
 ("Каталог","3 SKU, корзина, фид","Фильтры высота/ширина/глубина/нагрузка, вторая ось «для кого»","IDIA, Dimax, ProStellaj","3"),
 ("FAQ","7 вопросов","+ анкеры, пол, нагрузка, сроки, регионы, документы","Stelkon","3"),
 ("После заявки","Блок есть, пустой","5 мин ответ → 24 ч расчёт → выезд замерщика → проект → договор","—","1"),
 ("Форма","Имя, телефон, тип, комментарий","+ загрузка фото/чертежа, «ответим за 5 минут», TG-кнопка первой","ProStellaj, Regalraum","2"),
]

def img(name, alt=""):
    return f'<img src="img/{name}.jpg" alt="{html.escape(alt)}" loading="lazy" width="720" height="450">'

parts = []
A = parts.append

A("""<title>RaxPro: разведка рынка</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
:root{--bg:#f4f5f8;--paper:#ffffff;--ink:#101828;--ink2:#475467;--line:#d9dde6;--navy:#1b3b8f;--navy2:#122a68;--orange:#f59b1a;--orange-ink:#8a4d00;--tint:#e8edf8;--panel:#122a68;--panel-ink:#ffffff;--panel-sub:#c9d5ff;--mono:'IBM Plex Mono',ui-monospace,Menlo,monospace;--sans:'IBM Plex Sans',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;--r:6px}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#0d1220;--paper:#141b2d;--ink:#eef1f7;--ink2:#a5aec4;--line:#2a3450;--navy:#6f8fe8;--navy2:#c9d5ff;--orange:#f7ad42;--orange-ink:#ffd08a;--tint:#1a2440}}
:root[data-theme=dark]{--bg:#0d1220;--paper:#141b2d;--ink:#eef1f7;--ink2:#a5aec4;--line:#2a3450;--navy:#6f8fe8;--navy2:#c9d5ff;--orange:#f7ad42;--orange-ink:#ffd08a;--tint:#1a2440}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--sans);font-size:16px;line-height:1.55;padding-block:0 64px}
.wrap{max-width:1180px;margin:0 auto;padding-inline:16px}
h1,h2,h3{text-wrap:balance;line-height:1.15;margin:0}
h1{font-size:clamp(30px,4.5vw,52px);font-weight:700;letter-spacing:-.02em}
h2{font-size:clamp(24px,3vw,34px);font-weight:600;letter-spacing:-.01em;margin-top:8px}
h3{font-size:19px;font-weight:600}
p{margin:0 0 12px}
.lead{font-size:19px;color:var(--ink2);max-width:62ch}
.mono{font-family:var(--mono);font-size:12.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--navy)}
header.top{background:var(--panel);color:var(--panel-ink);padding-block:48px 40px;border-bottom:4px solid var(--orange)}
header.top .mono{color:var(--orange)}
header.top .meta{display:flex;flex-wrap:wrap;gap:10px 28px;margin-top:22px;font-family:var(--mono);font-size:13px;opacity:.85}
section{padding-block:44px 8px;border-top:1px solid var(--line)}
section:first-of-type{border-top:0}
.sec-head{display:grid;grid-template-columns:120px 1fr;gap:16px;align-items:baseline;margin-bottom:22px}
.sec-head .num{font-family:var(--mono);font-size:13px;color:var(--ink2)}
@media (max-width:640px){.sec-head{grid-template-columns:1fr;gap:4px}}
.verdict{background:var(--panel);color:var(--panel-ink);padding:24px 28px;border-left:6px solid var(--orange);margin:18px 0 8px}
.verdict h3{color:var(--panel-ink);margin-bottom:8px}
.verdict p{color:var(--panel-sub);max-width:70ch}
.cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px}
.fact{background:var(--paper);border:1px solid var(--line);padding:16px 18px;border-radius:var(--r)}
.fact b{display:block;font-size:26px;font-weight:600;letter-spacing:-.01em;font-variant-numeric:tabular-nums}
.fact span{color:var(--ink2);font-size:14px}
table{border-collapse:collapse;width:100%;font-size:14.5px;background:var(--paper)}
th,td{text-align:left;vertical-align:top;padding:10px 12px;border-bottom:1px solid var(--line)}
th{font-family:var(--mono);font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--ink2);font-weight:500;background:var(--tint)}
.tbl{overflow-x:auto;border:1px solid var(--line);border-radius:var(--r)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:18px;margin-top:14px}
.card{background:var(--paper);border:1px solid var(--line);border-radius:var(--r);overflow:hidden;display:flex;flex-direction:column}
.card img{display:block;width:100%;height:auto;aspect-ratio:16/10;object-fit:cover;object-position:top;border-bottom:1px solid var(--line);max-width:100%}
.card .b{padding:12px 14px 14px;display:flex;flex-direction:column;gap:6px;flex:1}
.card .t{font-weight:600;font-size:15.5px}
.card .s{font-size:13.5px;color:var(--ink2)}
.card .w{font-size:13.5px}
.card .w b{color:var(--orange-ink);font-weight:600}
.layer{margin:26px 0 6px;display:flex;align-items:baseline;gap:14px}
.layer h3{font-size:17px}
.layer .mono{color:var(--ink2)}
.el{display:grid;grid-template-columns:minmax(0,1fr);gap:0}
.el img{aspect-ratio:900/512;object-fit:cover;object-position:top}
.el dl{display:grid;grid-template-columns:auto 1fr;gap:4px 12px;margin:6px 0 0;font-size:13.5px}
.el dt{font-family:var(--mono);font-size:11.5px;letter-spacing:.05em;text-transform:uppercase;color:var(--ink2);padding-top:2px}
.el dd{margin:0}
.tag{display:inline-block;font-family:var(--mono);font-size:11.5px;letter-spacing:.04em;padding:2px 8px;border-radius:999px;background:var(--tint);color:var(--navy);margin-top:6px;width:max-content}
.tag.hot{background:var(--orange);color:#1a1200}
.moves{counter-reset:m;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px}
.move{background:var(--paper);border:1px solid var(--line);border-radius:var(--r);padding:16px 18px 16px 58px;position:relative}
.move::before{counter-increment:m;content:counter(m,decimal-leading-zero);position:absolute;left:16px;top:14px;font-family:var(--mono);font-size:22px;color:var(--orange);font-weight:500}
.move b{display:block;margin-bottom:4px}
.move span{color:var(--ink2);font-size:14.5px}
figure{margin:18px 0;background:var(--paper);border:1px solid var(--line);border-radius:var(--r);padding:18px}
figure svg{max-width:100%;height:auto;display:block}
figcaption{font-size:13.5px;color:var(--ink2);margin-top:10px}
.now{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.now img{width:100%;height:auto;border:1px solid var(--line);border-radius:var(--r);max-width:100%}
@media (max-width:720px){.now{grid-template-columns:1fr}}
.chain li{margin-bottom:6px}
.chain .ok{color:#1a7f4b}.chain .no{color:#b42318}.chain .half{color:var(--orange-ink)}
:root[data-theme=dark] .chain .ok,:root:not([data-theme=light]) .chain .ok{color:#5ad091}
:root[data-theme=dark] .chain .no,:root:not([data-theme=light]) .chain .no{color:#ff8b7f}
@media (prefers-color-scheme:light){:root:not([data-theme=dark]) .chain .ok{color:#1a7f4b}:root:not([data-theme=dark]) .chain .no{color:#b42318}}
.steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px}
.step{background:var(--paper);border:1px solid var(--line);border-radius:var(--r);padding:14px 16px}
.step .mono{display:block;margin-bottom:6px}
.step ul{margin:6px 0 0;padding-left:18px;font-size:14.5px}
.note{font-size:14px;color:var(--ink2);border-left:3px solid var(--orange);padding-left:12px;margin:12px 0}
ul.plain{padding-left:20px}ul.plain li{margin-bottom:5px}
.pri1{color:var(--orange-ink);font-weight:600}
.anti{columns:2;column-gap:28px;font-size:14.5px}
@media (max-width:720px){.anti{columns:1}}
.anti li{break-inside:avoid;margin-bottom:6px}
footer{padding-top:32px;font-family:var(--mono);font-size:12.5px;color:var(--ink2)}
a{color:var(--navy)}
@media (prefers-reduced-motion:reduce){*{scroll-behavior:auto}}
</style>
""")

A("""<header class="top"><div class="wrap">
<div class="mono">RaxPro · raxpro.uz · разведка ниши и план новой версии</div>
<h1 style="margin-top:12px">Как продают стеллажи в СНГ и мире — и что из этого ставим на RaxPro</h1>
<p class="lead" style="color:var(--panel-sub);margin-top:14px">45 первых экранов в шести слоях, 20 страниц полосами, 8 конфигураторов вживую. На выходе — библиотека фишек по 12 категориям, восемь ходов, спецификация онлайн-конструктора и план блоков для ветки feat/site-v3.</p>
<div class="meta"><span>20.09.2026</span><span>Скриншоты: research/competitors, research/conversion</span><span>Таблица: research/RESEARCH.md · разбор: research/ANALIZ.md</span></div>
</div></header>
<main class="wrap">
""")

# 1. Резюме
A("""<section id="summary"><div class="sec-head"><div class="num">01 / резюме</div><h2>Одно домино: конфигуратор, который считает паллетомест и цену до звонка</h2></div>
<div class="verdict"><h3>Свободная позиция на рынке Узбекистана</h3>
<p>Ни у одного продавца стеллажей в Ташкенте нет: цены за паллетоместо, онлайн-проектирования, спецификации до звонка и кейсов с цифрами м²/паллетомест. В Москве это закрыто по частям (ГТС — цена за паллетоместо, FIRST — квиз «что вы знаете», Stellmart — расширенная гарантия), самообслуживание в 3D живёт только в мебели (Пилометр, КомодМск) и в США (Shelving.com). У RaxPro ядро уже написано — <code>lib/rack/</code> считает раскладку по контуру помещения, спецификацию и цену для генератора КП. Его надо вывести наружу.</p></div>
<div class="cols" style="margin-top:18px">
<div class="fact"><b>45</b><span>первых экранов: UZ 4 · RU 11 · конструкторы 5 · KZ 6 · мир 8 · дизайн 9 · плюс 6 битых</span></div>
<div class="fact"><b>38</b><span>карточек фишек по 12 категориям, каждая с полем «что закрывает» и ценой внедрения</span></div>
<div class="fact"><b>8</b><span>ходов уровнем выше элементов — по ним собирается структура сайта</span></div>
<div class="fact"><b>13</b><span>блоков новой версии с приоритетами 1–3 и источником приёма</span></div>
</div>
<p class="note">Что не переносим: сайт закрыт от ботов (aviastal), cookie-стены, поп-апы поверх конфигуратора, SEO-простыни, шаблонные магазины на одном движке (KZ/UZ). Полный список — раздел 09.</p>
</section>""")

# 2. Ситуация покупки
A("""<section id="situation"><div class="sec-head"><div class="num">02 / кому продаём</div><h2>Ситуация покупки и семь страхов — фильтр, через который отбирались фишки</h2></div>
<div class="tbl"><table><thead><tr><th>Критерий</th><th>RaxPro</th><th>Откуда брать приёмы</th></tr></thead><tbody>
<tr><td>Что продаём</td><td>Физический продукт <b>+ проект под помещение</b>: замер → проект → производство → монтаж</td><td rowspan="6">Застройщики и ремонт под ключ (страх подрядчика), кухни на заказ (проект + визуализация), мебельные конфигураторы (самообслуживание), B2B-логистика (спецификация, тендер)</td></tr>
<tr><td>Чей кошелёк</td><td>Деньги компании (склад, магазин, завод); реже свои (гараж, подсобка)</td></tr>
<tr><td>Чем рискует</td><td>Деньгами (1,2 млн — сотни млн сум), <b>безопасностью</b> (обрушение = товар и люди), сроком запуска склада</td></tr>
<tr><td>Обратимость</td><td>Низкая: анкеры в полу, размер под помещение, переделка = новые рамы</td></tr>
<tr><td>Длина решения</td><td>Дни–недели, 2–4 контакта, сравнение 3–5 поставщиков по цене</td></tr>
<tr><td>Кто решает</td><td>Директор / завхоз + собственник; малый бизнес — сам</td></tr>
</tbody></table></div>
<h3 style="margin-top:26px">Страхи и критерии успеха (из FAQ raxpro.uz, звонков в research/calls и тестов КП)</h3>
<ol class="plain">
<li><b>«Сколько это стоит?»</b> — нет ориентира до звонка → уходит к ProStellaj, где цены в сумах.</li>
<li><b>«Выдержит ли?»</b> — нагрузка на ярус, металл, анкеровка; страх обрушения.</li>
<li><b>«Влезет ли в моё помещение и сколько паллетомест получу?»</b> — главный вопрос склада.</li>
<li><b>«Сделают ли в срок?»</b> — запуск склада привязан к дате.</li>
<li><b>«Кустарные сварщики или завод?»</b> — страх переплатить за то же железо или купить ржавое.</li>
<li><b>«Что будет после заявки?»</b> — спам, звонки, тишина.</li>
<li><b>«Гарантия на бумаге или на словах?»</b></li>
</ol>
<p class="note">Правило отбора: элемент не закрывает ни один из семи пунктов — не берём, каким бы красивым ни был.</p>
</section>""")

# 3. Доска
A("""<section id="board"><div class="sec-head"><div class="num">03 / доска рынка</div><h2>45 первых экранов: как выглядит рынок и где свободно</h2></div>
<p class="lead">Каждая карточка — что сделано сильно и где слабое место. Тильда-витрина не снята (поиск по ней закрыт), её слой заменён российскими сайтами того же бюджета.</p>""")
for layer, rows in BOARD:
    A(f'<div class="layer"><h3>{html.escape(layer)}</h3><span class="mono">{len(rows)} экранов</span></div><div class="grid">')
    for slug, name, strong, weak in rows:
        A(f'<article class="card">{img(slug, name)}<div class="b"><div class="t">{html.escape(name)}</div><div class="s">{html.escape(strong)}</div><div class="w"><b>Слабое:</b> {html.escape(weak)}</div></div></article>')
    A('</div>')
A("""<div class="verdict" style="margin-top:28px"><h3>Вывод по рынку</h3><p>Ближайший локальный конкурент — prostellaj.uz — выигрывает у raxpro.uz за счёт цен в сумах, внешних оценок Google/Yandex и категорий «по поводу» (гараж, ПВЗ, аптека, шины). Но у него нет проектирования и паллетной экспертизы. Никто в СНГ не совместил «завод + 3D-конструктор паллетных стеллажей + спецификация + цена». Это позиция RaxPro.</p></div>
</section>""")

# 4. Текущий сайт
A("""<section id="now"><div class="sec-head"><div class="num">04 / где мы</div><h2>raxpro.uz сегодня: что оставляем, что пусто</h2></div>
<div class="now">""" + img("raxpro-part1","raxpro.uz верх") + img("raxpro-part2","raxpro.uz середина") + img("raxpro-part3","raxpro.uz низ") + """</div>
<h3 style="margin-top:22px">Проверка по цепочке лендинга (канон: 9 переходов от узнавания до первого шага)</h3>
<ol class="chain plain">
<li><span class="half">частично</span> — Одна фраза: «Стеллажи и системы хранения полного цикла» говорит про нас, а не про Job клиента («хочу разместить N паллет в моём помещении»).</li>
<li><span class="ok">есть</span> — Направления: пять типов.</li>
<li><span class="no">нет</span> — Узнавание ситуации: нет входа «для склада / магазина / архива / гаража».</li>
<li><span class="no">нет</span> — Ценность в критериях: нет «паллетомест на м²», «цены за паллетоместо», сроков по этапам.</li>
<li><span class="half">частично</span> — Как выполняем: 4 этапа без сроков; 3D-герой показывает процесс.</li>
<li><span class="ok">есть</span> — Проблемы текущего решения: «заводские vs кустарные».</li>
<li><span class="half">частично</span> — Страхи: гарантия 10 лет и ISO есть, нагрузка и анкеровка — нет.</li>
<li><span class="half">частично</span> — Результат: кейсы без цифр.</li>
<li><span class="half">частично</span> — CTA: квиз спрашивает то, что нужно нам, а не то, что знает клиент; блок «что после заявки» пустой.</li>
</ol>
<p class="note">Оставляем: 3D-герой, логотипы, 4 этапа, цифры, «заводские vs кустарные», основатель, ISO, FAQ, TG-отзывы, форма с TG/WhatsApp. Поверх ставим ходы из раздела 06.</p>
</section>""")

# 5. Библиотека
A("""<section id="elements"><div class="sec-head"><div class="num">05 / библиотека фишек</div><h2>38 элементов по 12 категориям</h2></div>
<p class="lead">Единица — элемент, не сайт. У каждого: источник, какой страх закрывает, как переносим под RaxPro, цена внедрения. Скрины — реальные полосы страниц, сняты 20.09.2026.</p>""")
for cat, items in ELEMENTS:
    A(f'<div class="layer"><h3>{html.escape(cat)}</h3><span class="mono">{len(items)}</span></div><div class="grid">')
    for im, t, src, fear, how, cost in items:
        hot = ' hot' if cost.startswith('дёшево') else ''
        A(f'<article class="card el"><img src="img/{im}.jpg" alt="{html.escape(t)}" loading="lazy" width="900" height="512"><div class="b"><div class="t">{html.escape(t)}</div><dl><dt>Источник</dt><dd>{html.escape(src)}</dd><dt>Закрывает</dt><dd>{html.escape(fear)}</dd><dt>Переносим</dt><dd>{html.escape(how)}</dd></dl><span class="tag{hot}">{html.escape(cost)}</span></div></article>')
    A('</div>')
A('</section>')

# 6. Ходы
A("""<section id="moves"><div class="sec-head"><div class="num">06 / ходы</div><h2>Восемь ходов, в которые сжимаются 38 элементов</h2></div><div class="moves">""")
for b, s in MOVES:
    A(f'<div class="move"><b>{html.escape(b)}</b><span>{html.escape(s)}</span></div>')
A('</div></section>')

# 7. Конфигуратор
A("""<section id="configurator"><div class="sec-head"><div class="num">07 / конфигуратор</div><h2>Спецификация онлайн-конструктора: три шага, один экран результата</h2></div>
<p class="lead">Ядро существует: <code>lib/rack/layout.ts</code> раскладывает стеллажи по контуру помещения с колоннами и воротами, <code>spec.ts</code> считает рамы/балки/замки/анкеры/настилы, <code>pricing.ts</code> — цену, <code>RackScene.jsx</code> рисует 3D, есть PDF и ссылка <code>/tp#…</code> без хранилища. Всё это сейчас под паролем в генераторе КП. Конструктор — это тот же движок с упрощённым входом.</p>
<figure><svg viewBox="0 0 1100 300" role="img" aria-label="Поток конфигуратора: вход клиента → ядро lib/rack → экран результата → следующий шаг" xmlns="http://www.w3.org/2000/svg">
<defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker></defs>
<g fill="none" stroke="currentColor" stroke-width="1.5" font-family="IBM Plex Sans,system-ui" font-size="13">
<rect x="10" y="40" width="230" height="220" rx="6"/><text x="125" y="66" text-anchor="middle" font-weight="600" fill="currentColor" stroke="none">Вход клиента</text>
<text x="24" y="96" fill="currentColor" stroke="none">Шаг 1 · тип: паллетный /</text><text x="24" y="114" fill="currentColor" stroke="none">полочный / архивный</text>
<text x="24" y="146" fill="currentColor" stroke="none">Шаг 2 · режим:</text><text x="24" y="164" fill="currentColor" stroke="none">а) помещение Д×Ш×В, колонны,</text><text x="24" y="182" fill="currentColor" stroke="none">ворота, техника, вес паллеты</text><text x="24" y="200" fill="currentColor" stroke="none">б) секция: ярусы × длина балки</text>
<text x="24" y="232" fill="currentColor" stroke="none">Шаг 3 · что храните (фото/эскиз)</text>
<line x1="240" y1="150" x2="300" y2="150" marker-end="url(#ar)"/><text x="270" y="140" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">Room</text>
<rect x="300" y="40" width="230" height="220" rx="6" stroke="#f59b1a" stroke-width="2.5"/><text x="415" y="66" text-anchor="middle" font-weight="600" fill="currentColor" stroke="none">Ядро lib/rack (есть)</text>
<text x="314" y="96" fill="currentColor" stroke="none">design(room) → ряды, секции,</text><text x="314" y="114" fill="currentColor" stroke="none">ярусы, проходы под технику</text>
<text x="314" y="146" fill="currentColor" stroke="none">buildSpec → рамы = секции + ряды,</text><text x="314" y="164" fill="currentColor" stroke="none">балки = секции × ярусы × 2,</text><text x="314" y="182" fill="currentColor" stroke="none">замки = балки × 2, анкеры = рамы × 4</text>
<text x="314" y="214" fill="currentColor" stroke="none">palletPositions · priceKp · PDF</text><text x="314" y="232" fill="currentColor" stroke="none">рама ≤ 6000 мм · балки 2700/3300</text>
<line x1="530" y1="150" x2="590" y2="150" marker-end="url(#ar)"/><text x="560" y="140" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">Layout</text>
<rect x="590" y="40" width="230" height="220" rx="6"/><text x="705" y="66" text-anchor="middle" font-weight="600" fill="currentColor" stroke="none">Экран результата</text>
<text x="604" y="96" fill="currentColor" stroke="none">3D-сцена (RackScene) + план</text><text x="604" y="114" fill="currentColor" stroke="none">с силуэтом человека и техникой</text>
<text x="604" y="146" fill="currentColor" stroke="none">Паллетомест · м² под стеллажами</text><text x="604" y="164" fill="currentColor" stroke="none">Спецификация с количеством</text><text x="604" y="182" fill="currentColor" stroke="none">Цена «от», за паллетоместо</text>
<text x="604" y="214" fill="currentColor" stroke="none">Липкий итог внизу экрана</text><text x="604" y="232" fill="currentColor" stroke="none">Гид из 5 шагов, жесты на телефоне</text>
<line x1="820" y1="150" x2="880" y2="150" marker-end="url(#ar)"/><text x="850" y="140" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">CTA</text>
<rect x="880" y="40" width="210" height="220" rx="6"/><text x="985" y="66" text-anchor="middle" font-weight="600" fill="currentColor" stroke="none">Следующий шаг</text>
<text x="894" y="96" fill="currentColor" stroke="none">PDF-спецификация на почту</text><text x="894" y="114" fill="currentColor" stroke="none">или в Telegram</text>
<text x="894" y="146" fill="currentColor" stroke="none">Ссылка «отправить коллеге»</text><text x="894" y="164" fill="currentColor" stroke="none">(/tp#… без хранилища)</text>
<text x="894" y="196" fill="currentColor" stroke="none">«Вызвать замерщика» →</text><text x="894" y="214" fill="currentColor" stroke="none">заявка с готовой конфигурацией</text><text x="894" y="232" fill="currentColor" stroke="none">в бот + Bitrix</text>
</g></svg><figcaption>Оранжевым — то, что уже написано и оттестировано (генератор КП). Новое — вход без пароля, упрощённая форма помещения, экран результата для клиента и CTA с конфигурацией внутри заявки.</figcaption></figure>
<div class="steps">
<div class="step"><span class="mono">Шаг 1 · тип</span><b>Что храните</b><ul><li>Паллеты → паллетный (Mega)</li><li>Коробки, товар руками → среднегрузовой</li><li>Папки, архив → архивный</li><li>Витрина магазина → торговый</li><li>«Не знаю» → инженер</li></ul></div>
<div class="step"><span class="mono">Шаг 2 · помещение или секция</span><b>Режим А — по помещению</b><ul><li>Длина × ширина × высота потолка</li><li>Колонны (сетка), ворота</li><li>Техника: ричтрак / штабелёр / погрузчик — задаёт проход</li><li>Вес паллеты → балка 2700 или 3300</li></ul><b style="display:block;margin-top:8px">Режим Б — по секции</b><ul><li>Ярусы × длина балки × глубина</li><li>Сколько секций в ряд, сколько рядов</li></ul></div>
<div class="step"><span class="mono">Шаг 3 · результат</span><b>Один экран</b><ul><li>3D + план, вращение пальцем</li><li>Паллетомест, м² под стеллажами, % площади</li><li>Спецификация: рамы, балки, замки, анкеры, настилы</li><li>Цена «от» и «за паллетоместо» — с пометкой «предварительно, до замера»</li><li>PDF · ссылка · «Вызвать замерщика»</li></ul></div>
</div>
<h3 style="margin-top:26px">Что доделать в коде</h3>
<ul class="plain">
<li>Публичный маршрут <code>/[lang]/konstruktor</code> без <code>KP_PASSWORD</code>; серверный расчёт через <code>design()</code> — ядро не отдавать в браузер целиком.</li>
<li>Упрощённый редактор помещения: прямоугольник + колонны сеткой + одни ворота (полный полигон остаётся в генераторе КП).</li>
<li>Экран результата на мобильном: сцена сверху, панель параметров снизу листом, липкий итог.</li>
<li>Гид 5 шагов при первом открытии (как у Пилометра, но короче), «Пропустить».</li>
<li>Заявка с вложенной конфигурацией → тот же <code>/api/order</code> → бот + Bitrix; менеджер получает готовую спецификацию, а не «хочу стеллажи».</li>
<li>Цены: только из <code>pricing.ts</code> и <code>products.js</code>; на экране всегда подпись «расчётная, до замера». Новых цифр не выдумываем.</li>
<li>Среднегрузовой и архивный режим — по цене секции минус общие рамы (модель уже в pricing).</li>
</ul>
<p class="note">Референсы для интерфейса: Пилометр (панель секций, гид, мобильные жесты), Shelving.com (живая спецификация), Racking Wizard (три шага), КомодМск (силуэт человека, живая цена), USM (код конфигурации). Скрины — в разделе 05, категория «Конфигуратор».</p>
</section>""")

# 8. Блоки
A("""<section id="blocks"><div class="sec-head"><div class="num">08 / новая версия</div><h2>Блоки ветки feat/site-v3: что сейчас, что делаем, откуда приём</h2></div>
<div class="tbl"><table><thead><tr><th>Блок</th><th>Сейчас</th><th>Делаем</th><th>Откуда</th><th>Приоритет</th></tr></thead><tbody>""")
for b, now, do, src, pri in BLOCKS:
    cls = ' class="pri1"' if pri == "1" else ''
    A(f'<tr><td><b>{html.escape(b)}</b></td><td>{html.escape(now)}</td><td>{html.escape(do)}</td><td>{html.escape(src)}</td><td{cls}>{pri}</td></tr>')
A("""</tbody></table></div>
<h3 style="margin-top:26px">Порядок работ</h3>
<div class="steps">
<div class="step"><span class="mono">Этап 1 · 1–2 недели</span><b>Конфигуратор + герой + кейсы с цифрами</b><ul><li>Ветка feat/site-v3 от main, preview на Vercel</li><li>/konstruktor на ядре lib/rack</li><li>Герой: цена за паллетоместо, три цифры, две кнопки</li><li>Карточки проектов с метриками</li><li>Блок «после заявки» наполнить</li></ul></div>
<div class="step"><span class="mono">Этап 2 · 1 неделя</span><b>Направления и доверие</b><ul><li>Страницы пяти направлений по шаблону Mecalux</li><li>Таблица нагрузок, схема элементов</li><li>Google-отзывы, письма, «ваш инженер»</li><li>Этапы со сроками, рассрочка цифрами</li></ul></div>
<div class="step"><span class="mono">Этап 3 · 3–5 дней</span><b>Каталог и навигация</b><ul><li>Фильтры по размерам и нагрузке</li><li>Ось «для кого»</li><li>FAQ +6 вопросов</li><li>/qa-site, узбекская версия, merge</li></ul></div>
</div>
<h3 style="margin-top:26px">Что нужно от клиента (без этого блоки будут пустыми)</h3>
<ul class="plain">
<li>Паспорт продукции: нагрузка на раму по высотам, толщина металла, тип профиля — для таблицы нагрузок.</li>
<li>По 6 проектам из слайдера: м², паллетомест, высота, срок монтажа, техника.</li>
<li>Сроки этапов: производство и монтаж в днях для типового заказа.</li>
<li>3–5 благодарственных писем; имя, должность и компания под каждым отзывом.</li>
<li>Фото инженера/монтажников; 40-сек видео Хуршида на производстве (по желанию).</li>
<li>Подтвердить: показывать ли цену за паллетоместо и политику «нашли дешевле».</li>
</ul>
<p class="note">Правило проекта остаётся: цифры — только с raxpro.uz и из lib/rack (с пометкой «расчёт»), клиенту напрямую не пишем, main не трогаем.</p>
</section>""")

# 9. Анти-паттерны
A("""<section id="anti"><div class="sec-head"><div class="num">09 / не повторять</div><h2>Анти-паттерны с этой же доски</h2></div>
<ul class="anti plain">
<li>Cookie-стена на пол-экрана (Mecalux, Regalraum, AR Racking) — в UZ баннер не нужен вовсе.</li>
<li>Поп-ап «скидка 10 %» поверх 3D-конструктора (Shelving.com) — ломает работу.</li>
<li>Капча Yandex поверх формы заявки (lkw-safe.kz).</li>
<li>Белые рендеры без контекста и битые картинки в карточках (ProStellaj, imebkz).</li>
<li>SEO-простыня вместо страницы (Innotek).</li>
<li>Сайт, закрытый от ботов — 403 (Aviastal): нет в поиске картинок и ИИ-ответах.</li>
<li>Один движок магазина у половины KZ/UZ — узнаётся как шаблон.</li>
<li>Чат-виджет + cookie + «я живая, пишите» одновременно (FIRST).</li>
<li>Тендерная подача без цен для малого клиента (KIIT).</li>
<li>Слайдер сейфов на сайте стеллажей (Промет) — размытый фокус.</li>
</ul>
</section>""")

A("""<footer>Источники: research/RESEARCH.md (45 строк), research/ANALIZ.md, скриншоты research/competitors и research/conversion, конфигураторы research/conversion/cfg. Съёмка Playwright 1440×900, 20.09.2026. Канон: Next-Move-Theory-Canon/Advanced-Jobs-To-Be-Done/communication.md §8.</footer>
</main>""")

out = os.path.join(D, "raxpro-research.html")
open(out, "w", encoding="utf-8").write("\n".join(parts))
print(out, os.path.getsize(out))
