'use client';
import { useMemo, useState } from 'react';
import { IcoArrow, IcoClock } from './Icons';

function formatDate(d) {
  const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const [y, m, day] = d.split('-');
  return `${parseInt(day, 10)} ${months[parseInt(m, 10) - 1]} ${y}`;
}

export default function BlogLibrary({ articles }) {
  const categories = useMemo(() => ['Все', ...Array.from(new Set(articles.map((a) => a.category)))], [articles]);
  const [cat, setCat] = useState('Все');
  const list = cat === 'Все' ? articles : articles.filter((a) => a.category === cat);

  return (
    <div>
      {/* Category filter chips */}
      <div className="flex flex-wrap gap-2.5">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
              cat === c ? 'bg-navy-700 border-navy-700 text-white' : 'bg-white border-cloud-200 text-slate-600 hover:border-sky-400 hover:text-sky-600'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
        {list.map((a) => (
          <a key={a.slug} href={`/blog/${a.slug}`} className="group block h-full rounded-xl2 overflow-hidden bg-white border border-cloud-200 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition">
            <div className="aspect-[16/9] overflow-hidden bg-cloud-100 relative">
              <img src={a.cover} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              <span className="absolute top-3 left-3 text-xs font-semibold text-white bg-navy-900/80 backdrop-blur px-2.5 py-1 rounded-full">{a.category}</span>
            </div>
            <div className="p-5 flex flex-col h-[calc(100%-56.25%)]">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>{formatDate(a.date)}</span>
                <span className="inline-flex items-center gap-1"><IcoClock className="w-3.5 h-3.5" /> {a.readMins} мин</span>
              </div>
              <h3 className="font-bold text-navy-800 mt-1.5 leading-snug group-hover:text-sky-600">{a.title}</h3>
              <p className="text-slate-500 text-sm mt-2 line-clamp-3 flex-1">{a.excerpt}</p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700 group-hover:text-sky-600">Читать <IcoArrow className="w-4 h-4" /></span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
