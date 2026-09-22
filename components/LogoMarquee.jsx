'use client';

/**
 * Auto-scrolling single-row logo carousel.
 * Every logo sits in an identical box so the row reads as one even rhythm;
 * under each logo — one line «что сделали» (`note`), so the logo reads as a case.
 * The list is rendered twice: the track slides exactly one list-width, then
 * snaps back — the seam is invisible because the second copy is identical.
 * Pauses on hover and stops entirely under prefers-reduced-motion (globals.css).
 */
export default function LogoMarquee({ logos, lang = "ru" }) {
  const row = [...logos, ...logos];

  return (
    <div className="marquee group relative">
      <div className="marquee-track group-hover:[animation-play-state:paused]">
        {row.map((c, i) => (
          <div
            key={`${c.alt}-${i}`}
            className="shrink-0 w-[250px] px-4 flex flex-col items-center gap-3"
            aria-hidden={i >= logos.length ? 'true' : undefined}
          >
            <div className="h-20 grid place-items-center">
              <img loading="lazy" decoding="async"
                src={c.src}
                alt={i >= logos.length ? '' : c.alt}
                width={220}
                height={80}
                className="max-h-14 max-w-[180px] w-auto object-contain opacity-85 hover:opacity-100 transition"
              />
            </div>
            {c.note && (
              <p className="text-xs text-slate-500 leading-snug text-center max-w-[215px]">
                <span className="text-navy-900 font-medium">{c.alt}</span>
                <span className="mx-1.5 text-cloud-400">·</span>
                {c.note[lang] ?? c.note.ru}
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="marquee-fade marquee-fade-l" />
      <div className="marquee-fade marquee-fade-r" />
    </div>
  );
}
