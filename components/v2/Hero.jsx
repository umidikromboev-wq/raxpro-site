import HeroVideo from "../HeroVideo";
import { href } from "../../lib/lang";
import { IcoArrow } from "../Icons";

// Первый экран: обещание результата и четыре числа. Видео — только на широких
// экранах (HeroVideo сам решает), на телефоне постер.
export default function Hero({ lang, t }) {
  const home = href(lang, "/");
  return (
    <section className="relative isolate min-h-[100svh] flex flex-col justify-end overflow-hidden bg-steel-950 text-white">
      <div className="absolute inset-0 -z-10">
        <HeroVideo poster="/works/hero.jpg" src="/hero.mp4" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-steel-950 via-steel-950/70 to-steel-950/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-steel-950/80 via-steel-950/30 to-transparent" />
      </div>

      <div className="v2-wrap pt-28 pb-10 sm:pb-14">
        <p className="animate-fadeup text-[13px] sm:text-sm uppercase tracking-[0.18em] text-white/65">
          {t.hero.kicker}
        </p>
        <h1 className="animate-fadeup [animation-delay:80ms] mt-5 font-num font-black uppercase leading-[0.9] tracking-[-0.01em] text-[clamp(3.4rem,11vw,10.5rem)] text-balance">
          <span className="block">{t.hero.title[0]}</span>
          <span className="block text-beam-400">{t.hero.title[1]}</span>
        </h1>
        <div className="mt-7 grid gap-6 lg:grid-cols-[1fr,auto] lg:items-end">
          <p className="animate-fadeup [animation-delay:160ms] max-w-xl text-lg sm:text-xl leading-relaxed text-white/80">
            {t.hero.text}
          </p>
          <div className="animate-fadeup [animation-delay:220ms] flex flex-wrap gap-3">
            <a href={home + "#3d"} className="v2-btn v2-btn--beam">
              {t.hero.primary} <IcoArrow className="h-5 w-5" />
            </a>
            <a href={home + "#zayavka"} className="v2-btn v2-btn--ghost">
              {t.hero.secondary}
            </a>
          </div>
        </div>

        <ul className="animate-fadeup [animation-delay:300ms] mt-10 grid grid-cols-2 sm:grid-cols-4 border-t border-white/15">
          {t.hero.facts.map((f) => (
            <li key={f.l} className="pt-4 pr-4 border-r border-white/15 last:border-r-0 sm:[&:nth-child(2)]:border-r [&:nth-child(2)]:border-r-0 sm:[&:nth-child(2)]:border-r-white/15">
              <div className="font-num text-5xl sm:text-6xl leading-none tabular-nums">
                {f.n}
                <span className="text-beam-400 text-3xl sm:text-4xl ml-0.5">{f.u}</span>
              </div>
              <div className="mt-1.5 text-sm text-white/65">{f.l}</div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
