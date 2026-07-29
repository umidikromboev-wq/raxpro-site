'use client';
import { useEffect, useState } from 'react';

// Фон первого экрана. Ролик весит около 8 МБ — на телефоне это весь мобильный
// трафик ради декорации, поэтому там остаётся только постер, а видео
// подключается лишь на широких экранах и при обычном режиме движения.
export default function HeroVideo({ poster, src, className = '' }) {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 768px)');
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const decide = () => setShowVideo(wide.matches && !calm.matches);
    decide();
    wide.addEventListener('change', decide);
    calm.addEventListener('change', decide);
    return () => {
      wide.removeEventListener('change', decide);
      calm.removeEventListener('change', decide);
    };
  }, []);

  if (!showVideo) {
    return (
      <img
        src={poster}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        decoding="async"
        className={className}
      />
    );
  }

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      aria-hidden="true"
      className={className}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
