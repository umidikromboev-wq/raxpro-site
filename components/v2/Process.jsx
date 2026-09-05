import Reveal from "../Reveal";
import { Kicker } from "./Kicker";
import { production, certificates, FOUNDER } from "../../lib/rack/profile";
import { COMPANY } from "../../lib/rack/company";

// Как работаем + из чего сделано + основатель. Факты — из lib/rack/profile.ts,
// того же файла, что печатается в КП.
export default function Process({ lang, t }) {
  const p = t.process;
  const prod = production(lang);
  const certs = certificates(lang);
  return (
    <section id="process" className="v2-section bg-white text-steel-900">
      <div className="v2-wrap">
        <Kicker>{p.kicker}</Kicker>
        <h2 className="v2-h2 mt-4 max-w-3xl">{p.title}</h2>

        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {p.steps.map((s, i) => (
            <li key={s.t}>
              <Reveal delay={i * 90}>
                <div className="border-t-2 border-steel-900 pt-4">
                  <span className="font-num text-6xl leading-none tabular-nums text-beam-500">0{i + 1}</span>
                  <h3 className="mt-3 font-display text-2xl uppercase tracking-tight">{s.t}</h3>
                  <p className="mt-2 text-steel-700/80 leading-relaxed">{s.d}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        <div className="mt-20 grid gap-10 lg:grid-cols-[1fr,1fr]">
          <div>
            <Kicker>{p.productionKicker}</Kicker>
            <ul className="mt-6 divide-y divide-galv-200 border-y border-galv-200">
              {prod.map((x) => (
                <li key={x.title} className="grid gap-2 py-4 sm:grid-cols-[160px,1fr]">
                  <h3 className="font-display text-xl uppercase tracking-tight">{x.title}</h3>
                  <p className="text-steel-700/80">{x.body}</p>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs uppercase tracking-wider text-steel-700/60">{p.certs}</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {certs.map((c) => (
                <li key={c.code} className="border border-galv-300 px-3 py-1.5 text-sm">
                  <span className="font-num text-base tracking-wide">{c.code}</span>
                  <span className="text-steel-700/70"> · {c.subject}</span>
                </li>
              ))}
            </ul>
          </div>

          <Reveal variant="fade">
            <figure className="grid grid-cols-[120px,1fr] sm:grid-cols-[180px,1fr] gap-5 items-start bg-steel-950 text-white p-6 sm:p-8">
              <img
                src={FOUNDER.photo}
                alt={FOUNDER.name[lang]}
                width={600}
                height={800}
                loading="lazy"
                decoding="async"
                className="aspect-[3/4] w-full object-cover grayscale"
              />
              <div>
                <blockquote className="font-display text-xl sm:text-2xl leading-snug tracking-tight">
                  «{FOUNDER.quote[lang]}»
                </blockquote>
                <figcaption className="mt-5 text-sm">
                  <div className="font-semibold">{FOUNDER.name[lang]}</div>
                  <div className="text-white/60">{t.founder.role} · {COMPANY.legalRu}</div>
                </figcaption>
              </div>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
