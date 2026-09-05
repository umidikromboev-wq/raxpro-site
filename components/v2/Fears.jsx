import Reveal from "../Reveal";
import { Kicker } from "./Kicker";

// Четыре страха из брифа RaxPro (п.4) и ответ на каждый — фактами, не эпитетами.
export default function Fears({ t }) {
  const f = t.fears;
  return (
    <section className="v2-section bg-galv-100 text-steel-900">
      <div className="v2-wrap">
        <Kicker>{f.kicker}</Kicker>
        <h2 className="v2-h2 mt-4 max-w-4xl">{f.title}</h2>
        <ol className="mt-12 grid gap-px bg-galv-300 border border-galv-300 sm:grid-cols-2">
          {f.items.map((it, i) => (
            <li key={it.q} className="bg-galv-100">
              <Reveal delay={i * 80} className="h-full p-6 sm:p-8 flex flex-col gap-4">
                <span className="font-num text-5xl leading-none text-galv-300 tabular-nums">0{i + 1}</span>
                <h3 className="font-display text-2xl sm:text-[1.75rem] leading-tight tracking-tight">{it.q}</h3>
                <p className="text-steel-700/85 leading-relaxed border-l-2 border-beam-500 pl-4">{it.a}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
