import LeadForm from '../components/LeadForm';
import Reveal from '../components/Reveal';

const u = (id, w = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;
const IMG = {
  hero: u('photo-1586528116311-ad8dd3c8310d', 1800),
  pallet: u('photo-1553413077-190dd305871c'),
  medium: u('photo-1567789884554-0b844b597180'),
  archive: u('photo-1586528116311-ad8dd3c8310d'),
  retail: u('photo-1604719312566-8912e9227c6a'),
  welder: u('photo-1504328345606-18bbc8c9d7d1', 1600),
  design: u('photo-1581092160562-40aa08e78837'),
  aerial: u('photo-1565891741441-64926e441838', 1600),
};

const PHONE = '+998550555575';
const PHONE_HUMAN = '+998 55 055 55 75';

const PRODUCTS = [
  { t: 'Паллетные (Mega) стеллажи', img: IMG.pallet, d: 'Для складов и логистики. Хранение на паллетах, доступ техникой.', load: 'до 3 500 кг / ярус' },
  { t: 'Среднегрузовые стеллажи', img: IMG.medium, d: 'Универсальные металлические стеллажи для склада и производства.', load: '300–800 кг / полка' },
  { t: 'Архивные стеллажи', img: IMG.archive, d: 'Компактное хранение документов, коробов и архивов.', load: '100–300 кг / полка' },
  { t: 'Торговые стеллажи', img: IMG.retail, d: 'Для магазинов, маркетов и торговых залов. Презентабельный вид.', load: 'под товар' },
];

const STATS = [
  { n: '4 года', l: 'на рынке' },
  { n: '1000+', l: 'проектов' },
  { n: '10 лет', l: 'гарантия' },
  { n: 'до 3.5т', l: 'нагрузка на ярус' },
];

const CLIENTS = ['Discovery Invest', 'JAC Motors', 'Dom Stroy', 'Ishonch', 'IT Park', 'Bloom Shop', 'Super Pack'];

const ADV = [
  { i: '🛡', t: 'Гарантия 10 лет — документально', d: 'Единственная компания на рынке Узбекистана, которая даёт 10 лет официальной гарантии по документу.' },
  { i: '⚙️', t: 'Металл 1 сорта + оцинковка', d: 'Сталь первого сорта, гальваническое покрытие (оцинковка) и порошковая краска — максимальная прочность и срок службы.' },
  { i: '🏋️', t: 'Нагрузка 100 кг – 3.5 тонны', d: 'Рассчитываем конструкцию под вашу реальную нагрузку — от лёгких полок до тяжёлых паллетных систем.' },
  { i: '📐', t: 'Любой размер под заказ', d: 'Изготовим стеллажи любого объёма и габарита — от 1 секции до проектов на несколько миллиардов сум.' },
  { i: '🚚', t: 'Замёр, проект, монтаж, доставка', d: 'Полный цикл «под ключ». По Ташкенту все услуги бесплатно, по регионам — по объёму проекта.' },
  { i: '⏱', t: 'Бесплатный замёр и расчёт', d: 'Выезжаем, замеряем, проектируем и считаем стоимость — бесплатно и без обязательств.' },
];

const STEPS = [
  { n: '01', t: 'Заявка и консультация', d: 'Звоните или оставляете заявку — уточняем задачу.' },
  { n: '02', t: 'Бесплатный замёр', d: 'Выезжаем на объект, замеряем помещение и нагрузки.' },
  { n: '03', t: 'Проект и расчёт', d: 'Проектируем систему хранения и считаем точную стоимость.' },
  { n: '04', t: 'Производство', d: 'Изготовление из металла 1 сорта с защитным покрытием.' },
  { n: '05', t: 'Монтаж и доставка', d: 'Доставляем и устанавливаем «под ключ». По Ташкенту — бесплатно.' },
];

export default function Home() {
  return (
    <div>
      {/* HEADER */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur bg-ink-950/80 border-b border-ink-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="#top" className="font-black text-2xl tracking-tight">RAX<span className="text-orange-500">PRO</span></a>
          <nav className="hidden md:flex items-center gap-7 text-sm text-steel-300">
            <a href="#products" className="hover:text-white">Продукция</a>
            <a href="#why" className="hover:text-white">Почему мы</a>
            <a href="#process" className="hover:text-white">Как работаем</a>
            <a href="#contacts" className="hover:text-white">Контакты</a>
          </nav>
          <div className="flex items-center gap-3">
            <a href={`tel:${PHONE}`} className="hidden sm:block text-sm font-semibold text-white">{PHONE_HUMAN}</a>
            <a href="#zayavka" className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-4 py-2 rounded-lg">Замёр</a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="relative min-h-screen flex items-center pt-16">
        <div className="absolute inset-0">
          <img src={IMG.hero} alt="Складские стеллажи RAXPRO" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/90 to-ink-950/40" />
          <div className="absolute inset-0 grain opacity-40" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 grid lg:grid-cols-2 gap-10 items-center w-full">
          <div className="animate-fadeup">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-orange-400 border border-orange-500/40 rounded-full px-3 py-1 mb-5">
              RAPID SALES · стеллажи и системы хранения
            </div>
            <h1 className="text-4xl sm:text-6xl font-black leading-[1.05] tracking-tight">
              Стеллажи, которые<br /><span className="text-orange-500">выдержат всё</span>
            </h1>
            <p className="mt-5 text-lg text-steel-300 max-w-xl">
              Производим и монтируем складские, паллетные, архивные и торговые стеллажи в Ташкенте.
              Нагрузка до 3.5 тонн, гарантия 10 лет, бесплатный замёр и расчёт.
            </p>
            <div className="flex flex-wrap gap-3 mt-7">
              {['Гарантия 10 лет', 'Нагрузка до 3.5т', 'Бесплатный замёр'].map(c => (
                <span key={c} className="bg-ink-800/80 border border-ink-600 rounded-full px-4 py-2 text-sm">✓ {c}</span>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 mt-7">
              <a href="#zayavka" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-7 py-3.5 rounded-xl">Получить расчёт</a>
              <a href={`tel:${PHONE}`} className="border border-ink-600 hover:border-orange-500 px-7 py-3.5 rounded-xl font-semibold">Позвонить</a>
            </div>
          </div>
          <div className="lg:justify-self-end w-full max-w-md animate-fadeup">
            <div className="text-sm font-semibold mb-3 text-steel-300">Бесплатный замёр и расчёт за 24 часа:</div>
            <LeadForm compact />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-ink-700 bg-ink-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(s => (
            <div key={s.l} className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-orange-500">{s.n}</div>
              <div className="text-steel-300 text-sm mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CLIENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <Reveal>
          <p className="text-center text-steel-400 text-sm mb-6">Нам доверяют компании:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {CLIENTS.map(c => (
              <span key={c} className="bg-ink-800 border border-ink-600 rounded-xl px-5 py-2.5 font-semibold text-steel-200">{c}</span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* PRODUCTS */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <Reveal>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Продукция</h2>
          <p className="text-steel-300 mt-2 max-w-2xl">Изготавливаем стеллажи любого типа и размера под вашу задачу и нагрузку.</p>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.t} delay={i * 80}>
              <div className="group rounded-2xl overflow-hidden bg-ink-800 border border-ink-600 hover:border-orange-500/60 hover:-translate-y-1 transition h-full flex flex-col">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={p.img} alt={p.t} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-lg">{p.t}</h3>
                  <p className="text-steel-300 text-sm mt-1.5 flex-1">{p.d}</p>
                  <div className="text-xs text-orange-400 font-semibold mt-3">{p.load}</div>
                  <a href="#zayavka" className="mt-3 text-sm font-semibold text-white border border-ink-600 hover:border-orange-500 rounded-lg py-2 text-center">Рассчитать</a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* WHY */}
      <section id="why" className="bg-ink-900 border-y border-ink-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Почему RAXPRO</h2>
            <p className="text-steel-300 mt-2 max-w-2xl">Не обещания, а факты, которые отличают нас от других.</p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
            {ADV.map((a, i) => (
              <Reveal key={a.t} delay={i * 70}>
                <div className="rounded-2xl bg-ink-800 border border-ink-600 p-6 h-full">
                  <div className="text-3xl">{a.i}</div>
                  <h3 className="font-bold text-lg mt-3">{a.t}</h3>
                  <p className="text-steel-300 text-sm mt-2">{a.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* GUARANTEE BAND */}
      <section className="relative py-20">
        <div className="absolute inset-0">
          <img src={IMG.welder} alt="Производство стеллажей" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-ink-950/85" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <Reveal>
            <div className="text-orange-500 font-black text-6xl sm:text-7xl">10 лет</div>
            <h2 className="text-2xl sm:text-3xl font-black mt-2">официальной гарантии по документу</h2>
            <p className="text-steel-300 mt-4 max-w-2xl mx-auto">
              Сегодня на рынке Узбекистана только RAXPRO предоставляет 10 лет гарантии в письменном виде.
              Металл 1 сорта, оцинковка и порошковая краска — стеллаж служит десятилетиями.
            </p>
          </Reveal>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <Reveal><h2 className="text-3xl sm:text-4xl font-black tracking-tight">Как мы работаем</h2></Reveal>
        <div className="grid md:grid-cols-2 gap-10 mt-8 items-center">
          <div className="rounded-2xl overflow-hidden border border-ink-600">
            <img src={IMG.design} alt="Проектирование стеллажей" className="w-full h-full object-cover" />
          </div>
          <div className="space-y-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 60}>
                <div className="flex gap-4">
                  <div className="text-orange-500 font-black text-xl w-10 shrink-0">{s.n}</div>
                  <div>
                    <h3 className="font-bold">{s.t}</h3>
                    <p className="text-steel-300 text-sm">{s.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="relative py-16">
        <div className="absolute inset-0">
          <img src={IMG.aerial} alt="Логистика и доставка" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-orange-600/90" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-black">Бесплатный замёр и расчёт за 24 часа</h2>
          <p className="mt-3 text-white/90">Оставьте заявку — рассчитаем вашу систему хранения без обязательств.</p>
          <a href="#zayavka" className="inline-block mt-6 bg-white text-ink-950 font-bold px-8 py-3.5 rounded-xl hover:bg-steel-100">Оставить заявку</a>
        </div>
      </section>

      {/* LEAD FORM */}
      <section id="zayavka" className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <Reveal>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-center">Получить расчёт</h2>
          <p className="text-steel-300 mt-2 text-center mb-8">Заполните форму — свяжемся в ближайшее время.</p>
          <LeadForm />
        </Reveal>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="bg-ink-900 border-t border-ink-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-3xl font-black tracking-tight">Контакты</h2>
            <div className="mt-6 space-y-4 text-steel-200">
              <p><span className="text-steel-400 text-sm block">Телефон</span><a href={`tel:${PHONE}`} className="text-xl font-bold hover:text-orange-400">{PHONE_HUMAN}</a></p>
              <p><span className="text-steel-400 text-sm block">Email</span>xurshidbekkasimov8@gmail.com · m.toxirov@internet.ru</p>
              <p><span className="text-steel-400 text-sm block">Адрес</span>г. Ташкент, Мирзо-Улугбекский р-н, ул. Турт Арык, 11/1<br /><span className="text-steel-400 text-sm">Ориентир: Паркентский, напротив Evos</span></p>
              <p><span className="text-steel-400 text-sm block">Сегменты</span>B2B · B2C · B2J</p>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden border border-ink-600 min-h-[300px]">
            <iframe title="RAXPRO на карте" className="w-full h-full min-h-[300px]"
              src="https://maps.google.com/maps?q=Турт%20Арык%2011/1%20Ташкент&z=15&output=embed" loading="lazy" />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-ink-700 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between gap-4 text-sm text-steel-400">
          <div>
            <div className="font-black text-xl text-white">RAX<span className="text-orange-500">PRO</span></div>
            <p className="mt-1">RAPID SALES · стеллажи и системы хранения · Ташкент</p>
          </div>
          <div className="sm:text-right">
            <a href={`tel:${PHONE}`} className="block font-semibold text-white">{PHONE_HUMAN}</a>
            <p className="mt-1">© {new Date().getFullYear()} RAXPRO. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
