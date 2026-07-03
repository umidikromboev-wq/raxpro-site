import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Reveal from '../../components/Reveal';
import BlogLibrary from '../../components/BlogLibrary';
import { getAllArticles } from '../../lib/articles';
import { IcoArrow, IcoClock } from '../../components/Icons';

export const metadata = {
  title: 'Новости и статьи о стеллажах | RAXPRO — Ташкент',
  description:
    'Библиотека статей RAXPRO о стеллажах и системах хранения: как выбрать складские и паллетные стеллажи, из чего складывается цена, металл и покрытие, склад для маркетплейсов.',
  alternates: { canonical: '/blog' },
};

function formatDate(d) {
  const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const [y, m, day] = d.split('-');
  return `${parseInt(day, 10)} ${months[parseInt(m, 10) - 1]} ${y}`;
}

export default function BlogIndex() {
  const articles = getAllArticles();
  const [lead, ...rest] = articles;

  return (
    <div className="bg-white text-ink">
      <Header />

      <section className="relative pt-24 bg-navy-900 text-white overflow-hidden notch-tr">
        <div className="absolute inset-0 bg-brand-grad opacity-90" />
        <div className="absolute inset-0 grid-lines opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <nav className="text-sm text-white/70 mb-4">
            <a href="/" className="hover:text-white">Главная</a> <span className="mx-1">/</span> <span className="text-white">Новости</span>
          </nav>
          <h1 className="font-display font-medium text-3xl sm:text-5xl leading-tight">Библиотека статей о стеллажах</h1>
          <p className="mt-4 text-white/85 max-w-2xl">
            Экспертные материалы RAXPRO о системах хранения: как выбрать, рассчитать и не переплатить за стеллажи для склада, магазина и архива.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
        {/* Featured */}
        <Reveal>
          <a href={`/blog/${lead.slug}`} className="group grid md:grid-cols-2 gap-0 rounded-xl2 overflow-hidden bg-white border border-cloud-200 shadow-card hover:shadow-card-hover transition mb-12">
            <div className="aspect-[16/10] md:aspect-auto overflow-hidden bg-cloud-100">
              <img src={lead.cover} alt={lead.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            </div>
            <div className="p-7 sm:p-9 flex flex-col justify-center">
              <div className="flex items-center gap-3 text-sm">
                <span className="font-semibold text-sky-600">{lead.category}</span>
                <span className="text-slate-400 inline-flex items-center gap-1"><IcoClock className="w-4 h-4" /> {lead.readMins} мин · {formatDate(lead.date)}</span>
              </div>
              <h2 className="font-display font-medium text-2xl sm:text-3xl text-navy-800 mt-3 leading-tight group-hover:text-sky-600">{lead.title}</h2>
              <p className="text-slate-600 mt-3 leading-relaxed">{lead.excerpt}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-navy-700 font-semibold">Читать статью <IcoArrow className="w-5 h-5" /></span>
            </div>
          </a>
        </Reveal>

        {/* Library with category filter (all articles incl. featured) */}
        <BlogLibrary articles={articles} />
      </section>

      <Footer />
    </div>
  );
}
