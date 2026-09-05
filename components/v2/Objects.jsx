import Reveal from "../Reveal";
import { Kicker } from "./Kicker";
import { SITE } from "../../lib/site";
import { IcoArrow } from "../Icons";

// Объекты с цифрами: первый кадр крупный, остальные в сетке. Число на кадре —
// то, что клиент запомнит (12 часов, 30 секций), а не «надёжно и качественно».
export default function Objects({ t }) {
  const o = t.objects;
  const [first, ...rest] = o.items;
  return (
    <section id="obekty" className="v2-section bg-white text-steel-900">
      <div className="v2-wrap">
        <div className="grid gap-6 lg:grid-cols-[1.2fr,1fr] lg:items-end">
          <div>
            <Kicker>{o.kicker}</Kicker>
            <h2 className="v2-h2 mt-4">{o.title}</h2>
          </div>
          <p className="text-steel-700/80 text-lg leading-relaxed">{o.text}</p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
          <Card item={first} big />
          {rest.map((it, i) => (
            <Card key={it.t} item={it} delay={80 * (i + 1)} />
          ))}
        </div>

        <a href={SITE.reviewsChannel} target="_blank" rel="noopener" className="mt-8 inline-flex items-center gap-2 font-semibold text-sky-700 hover:text-beam-600">
          {o.all} <IcoArrow className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}

function Card({ item, big = false, delay = 0 }) {
  return (
    <Reveal delay={delay} className={big ? "lg:col-span-2 lg:row-span-2" : ""}>
      <figure className={`group relative overflow-hidden bg-steel-900 text-white ${big ? "aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[560px]" : "aspect-[4/3]"}`}>
        <img
          src={item.img}
          alt={item.t}
          width={1280}
          height={960}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-steel-950/95 via-steel-950/40 to-transparent" />
        <span className="absolute left-4 top-4 bg-white/90 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-steel-900">
          {item.tag}
        </span>
        <figcaption className="absolute inset-x-0 bottom-0 p-5 sm:p-6 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <h3 className={`font-display uppercase tracking-tight leading-none ${big ? "text-3xl sm:text-5xl" : "text-2xl"}`}>{item.t}</h3>
            <p className={`mt-2 text-white/75 ${big ? "text-base max-w-lg" : "text-sm"}`}>{item.d}</p>
          </div>
          <div className="shrink-0 text-right">
            <div className={`font-num leading-none tabular-nums text-beam-400 ${big ? "text-6xl sm:text-8xl" : "text-5xl"}`}>{item.n}</div>
            <div className="text-xs uppercase tracking-wider text-white/65">{item.u}</div>
          </div>
        </figcaption>
      </figure>
    </Reveal>
  );
}
