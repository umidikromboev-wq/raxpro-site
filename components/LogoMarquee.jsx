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
            className="shrink-0 w-[150px] h-14 grid place-items-center"
            aria-hidden={i >= logos.length ? 'true' : undefined}
          >
            <img
              src={c.src}
              alt={i >= logos.length ? '' : c.alt}
              width={150}
              height={56}
              loading="lazy"
              className="max-h-9 max-w-[130px] w-auto object-contain opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition"
            />
          </div>
        ))}
      </div>
      <div className="marquee-fade marquee-fade-l" />
      <div className="marquee-fade marquee-fade-r" />
    </div>
  );
}
