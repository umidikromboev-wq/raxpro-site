'use client';

/**
 * Auto-scrolling single-row logo carousel.
 * Every logo sits in an identical box so the row reads as one even rhythm.
 * The list is rendered twice: the track slides exactly one list-width, then
 * snaps back — the seam is invisible because the second copy is identical.
 * Pauses on hover and stops entirely under prefers-reduced-motion (globals.css).
 */
export default function LogoMarquee({ logos }) {
  const row = [...logos, ...logos];

  return (
    <div className="marquee group relative">
      <div className="marquee-track group-hover:[animation-play-state:paused]">
        {row.map((c, i) => (
          <div
            key={`${c.alt}-${i}`}
            className="shrink-0 w-[220px] h-20 grid place-items-center"
            aria-hidden={i >= logos.length ? 'true' : undefined}
          >
            <img loading="lazy" decoding="async"
              src={c.src}
              alt={i >= logos.length ? '' : c.alt}
              width={220}
              height={80}
              className="max-h-14 max-w-[180px] w-auto object-contain opacity-85 hover:opacity-100 transition"
            />
          </div>
        ))}
      </div>
      <div className="marquee-fade marquee-fade-l" />
      <div className="marquee-fade marquee-fade-r" />
    </div>
  );
}
