import { notFound } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import LeadForm from '../../../components/LeadForm';
import { DIRECTIONS, getDirection } from '../../../lib/directions';
import { getArticle } from '../../../lib/articles';
import { IcoCheck, IcoArrow } from '../../../components/Icons';

export function generateStaticParams() {
  return DIRECTIONS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const d = getDirection(slug);
  if (!d) return { title: 'Страница не найдена | RAXPRO' };
  return {
    title: d.seoTitle,
    description: d.seoDesc,
    alternates: { canonical: `/napravleniya/${d.slug}` },
    openGraph: { title: d.seoTitle, description: d.seoDesc, type: 'website', images: [d.cover] },
  };
}

export default async function DirectionPage({ params }) {
  const { slug } = await params;
  const d = getDirection(slug);
  if (!d) notFound();
  const related = d.relatedSlug ? getArticle(d.relatedSlug) : null;
  const others = DIRECTIONS.filter((x) => x.slug !== d.slug);

  return (
    <div className="bg-white text-ink">
      <Header />

      {/* HERO */}
      <section className="relative pt-24 bg-navy-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img src={d.cover} alt={d.name} className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/92 to-navy-900/60" />
          <div className="absolute inset-0 grid-lines opacity-25" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-16 grid lg:grid-cols-[1.1fr,0.9fr] gap-10 items-center">
          <div>
            <nav className="text-sm text-cloud-200/60 mb-4">
              <a href="/" className="hover:text-sky-400">Главная</a> <span className="mx-1">/</span>
              <a href="/#napravleniya" className="hover:text-sky-400"> Направления</a> <span className="mx-1">/</span>
              <span className="text-cloud-200"> {d.short}</span>
            </nav>
            <h1 className="font-display font-medium text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-[1.08]">{d.name}</h1>
            <p className="mt-5 text-lg text-cloud-200/85 max-w-xl leading-relaxed">{d.intro}</p>
            <div className="flex flex-wrap gap-3 mt-7">
              <a href="#zayavka" className="inline-flex items-center gap-2 bg-sky-400 hover:bg-sky-600 text-navy-900 font-bold px-7 py-3.5 rounded-xl">
                Рассчитать стоимость <IcoArrow className="w-5 h-5" />
              </a>
              <a href="/#proekty" className="inline-flex items-center gap-2 border border-white/25 hover:border-sky-400 text-white px-7 py-3.5 rounded-xl font-semibold">Смотреть проекты</a>
            </div>
          </div>
          <div className="w-full max-w-md lg:justify-self-end">
            <LeadForm compact />
          </div>
        </div>
      </section>

      {/* SPECS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {d.specs.map((s) => (
            <div key={s.k} className="rounded-xl2 bg-white border border-cloud-200 shadow-card p-5">
              <div className="text-slate-400 text-sm">{s.k}</div>
              <div className="font-display font-medium text-xl text-navy-800 mt-1">{s.v}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-10 mt-12 items-start">
          <div>
            <h2 className="font-display font-medium text-2xl sm:text-3xl text-navy-800 tracking-tight">Преимущества</h2>
            <ul className="mt-5 space-y-3">
              {d.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-slate-700">
                  <span className="w-6 h-6 rounded-full bg-sky-600/10 text-sky-600 grid place-items-center shrink-0 mt-0.5"><IcoCheck className="w-4 h-4" /></span>
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-7 rounded-xl2 bg-cloud-50 border border-cloud-200 p-5">
              <div className="text-slate-400 text-sm">Кому подходит</div>
              <p className="text-navy-800 font-medium mt-1">{d.useCases}</p>
            </div>
          </div>
          <div className="rounded-xl2 overflow-hidden border border-cloud-200 shadow-card">
            <img src={d.cover} alt={d.name} className="w-full h-full object-cover" />
          </div>
        </div>

        {related && (
          <a href={`/blog/${related.slug}`} className="group mt-10 flex items-center justify-between gap-4 rounded-xl2 bg-white border border-cloud-200 shadow-card p-5 hover:shadow-card-hover transition">
            <div>
              <div className="text-xs font-semibold text-sky-600">Статья по теме</div>
              <div className="font-bold text-navy-800 mt-1 group-hover:text-sky-600">{related.title}</div>
            </div>
            <IcoArrow className="w-6 h-6 text-navy-700 shrink-0" />
          </a>
        )}
      </section>

      {/* CTA FORM */}
      <section id="zayavka" className="relative bg-navy-900 overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14 grid lg:grid-cols-2 gap-10 items-center">
          <div className="text-white">
            <h2 className="font-display font-medium text-3xl sm:text-4xl tracking-tight">Рассчитать {d.short.toLowerCase()}</h2>
            <p className="mt-4 text-cloud-200/80 max-w-lg">Бесплатный замер, проектирование и цена за 24 часа. Оставьте заявку — подберём оптимальное решение под вашу задачу.</p>
          </div>
          <div className="w-full max-w-md lg:justify-self-end"><LeadForm /></div>
        </div>
      </section>

      {/* OTHER DIRECTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <h2 className="font-display font-medium text-2xl text-navy-800 tracking-tight">Другие направления</h2>
        <div className="grid sm:grid-cols-3 gap-5 mt-6">
          {others.map((o) => (
            <a key={o.slug} href={`/napravleniya/${o.slug}`} className="group block rounded-xl2 overflow-hidden bg-white border border-cloud-200 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition">
              <div className="aspect-[16/9] overflow-hidden bg-cloud-100">
                <img src={o.cover} alt={o.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <div className="p-5 flex items-center justify-between gap-2">
                <h3 className="font-bold text-navy-800 group-hover:text-sky-600">{o.short}</h3>
                <IcoArrow className="w-5 h-5 text-navy-700" />
              </div>
            </a>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
