import { PRODUCTS } from "../../lib/rack/catalog";
import { coverFor } from "../../lib/rack/profile";
import { PRODUCT_LINKS, priceFrom, fmtUzs } from "../../lib/v2-copy";
import { href } from "../../lib/lang";
import Reveal from "../Reveal";
import { Kicker } from "./Kicker";
import { IcoArrow } from "../Icons";

// Шесть продуктов из того же каталога, что и генератор КП: цены и нагрузки
// живут в lib/rack/catalog.ts, сайт их не дублирует.
export default function Products({ lang, t }) {
  const p = t.products;
  return (
    <section id="produkciya" className="v2-section bg-galv-50 text-steel-900">
      <div className="v2-wrap">
        <div className="grid gap-6 lg:grid-cols-[1.2fr,1fr] lg:items-end">
          <div>
            <Kicker>{p.kicker}</Kicker>
            <h2 className="v2-h2 mt-4">{p.title}</h2>
          </div>
          <p className="text-steel-700/80 text-lg leading-relaxed lg:pb-1">{p.text}</p>
        </div>

        <ul className="mt-12 grid gap-px bg-galv-200 sm:grid-cols-2 lg:grid-cols-3 border border-galv-200">
          {PRODUCTS.map((prod, i) => {
            const cover = coverFor(prod.key);
            const from = priceFrom(prod);
            const name = p.names[prod.key];
            const link = PRODUCT_LINKS[prod.key];
            const to = link ? href(lang, link) : href(lang, "/") + "#zayavka";
            const [lo, hi] = prod.loadPerLevelKg;
            return (
              <li key={prod.key} className="bg-white">
                <Reveal delay={(i % 3) * 80} className="h-full">
                  <a href={to} className="group flex h-full flex-col">
                    <div className="relative aspect-[4/3] overflow-hidden bg-galv-100">
                      <img
                        src={cover.file}
                        alt={lang === "uz" ? cover.uz : cover.ru}
                        width={cover.w}
                        height={cover.h}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                      />
                      <span className="absolute left-4 top-4 font-num text-sm tracking-widest text-white/90 bg-steel-950/70 px-2 py-0.5">
                        0{i + 1}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <h3 className="font-display text-[1.7rem] leading-[1.05] uppercase tracking-tight">{name.name}</h3>
                      <p className="mt-2 text-sm text-steel-700/75">{name.who}</p>
                      <div className="mt-5 flex items-end justify-between gap-3 border-t border-galv-200 pt-4">
                        <div>
                          {from ? (
                            <>
                              <div className="text-xs uppercase tracking-wider text-steel-700/60">{p.from}</div>
                              <div className="font-num text-3xl leading-none tabular-nums">
                                {fmtUzs(from)} <span className="text-base text-steel-700/70">{p.sum}</span>
                              </div>
                            </>
                          ) : (
                            <div className="font-num text-2xl leading-none text-steel-700/70">{p.project}</div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-xs uppercase tracking-wider text-steel-700/60">{p.perLevel}</div>
                          <div className="font-num text-3xl leading-none tabular-nums">
                            {lo}–{hi} <span className="text-base text-steel-700/70">kg</span>
                          </div>
                        </div>
                      </div>
                      <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 group-hover:text-beam-600">
                        {p.more} <IcoArrow className="h-4 w-4" />
                      </span>
                    </div>
                  </a>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
