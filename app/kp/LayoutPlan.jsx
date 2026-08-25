'use client';

// План расстановки. Рисуется из расчёта, а не ждётся от проектировщика:
// именно ожидание плана из 3ds Max делало КП многодневной задачей.
// Оформление повторяет привычные клиенту чертежи RaxPro — вид сверху,
// размерные линии с шагом секции, колонны здания.

export default function LayoutPlan({ room, layout, lang = 'ru', compact = false }) {
  if (!room || !layout) return null;
  const t = (ru, uz) => (lang === 'uz' ? uz : ru);

  const PAD = 2000; // поле под размерные линии и подписи габаритов, в мм чертежа
  const W = room.width + PAD * 2;
  const H = room.depth + PAD * 2;

  // ряды сгруппированы, чтобы подписать шаг секции один раз на ряд
  const rows = new Map();
  for (const b of layout.bays) {
    if (!rows.has(b.row)) rows.set(b.row, []);
    rows.get(b.row).push(b);
  }

  const strokeMm = Math.max(W, H) / 900; // толщина линий в мм чертежа

  return (
    <figure className="m-0">
      <svg
        viewBox={`${-PAD} ${-PAD} ${W} ${H}`}
        className="w-full"
        style={{ background: 'var(--plan-bg, #fff)' }}
        role="img"
        aria-label={t('План расстановки стеллажей', 'Stellajlar joylashuvi rejasi')}
      >
        {/* Контур помещения: рисуем обведённый по драфту многоугольник,
            прямоугольник — его частный случай. */}
        <polygon
          points={(layout.polygon || [[0, 0], [room.width, 0], [room.width, room.depth], [0, room.depth]])
            .map((p) => `${p[0]},${p[1]}`).join(' ')}
          fill="none" stroke="#0B1B2B" strokeWidth={strokeMm * 2.2}
        />

        {/* колонны здания */}
        {(room.columns ?? []).map((c, i) => (
          <rect
            key={i}
            x={c.x - c.size / 2} y={c.y - c.size / 2}
            width={c.size} height={c.size}
            fill="#C6D2DC" stroke="#8FA3B4" strokeWidth={strokeMm}
          />
        ))}

        {/* секции */}
        {layout.bays.map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} fill="#E4761B" opacity="0.16" />
            <rect
              x={b.x} y={b.y} width={b.w} height={b.h}
              fill="none" stroke="#0166B3" strokeWidth={strokeMm * 1.6}
            />
          </g>
        ))}

        {/* размерные линии: шаг секции по первому ряду */}
        {[...rows.entries()].slice(0, 1).map(([row, bays]) => {
          const y = Math.min(...bays.map((b) => b.y)) - 420;
          return (
            <g key={row} stroke="#6B7E92" strokeWidth={strokeMm}>
              {bays.map((b, i) => (
                <g key={i}>
                  <line x1={b.x} y1={y} x2={b.x + b.w} y2={y} />
                  <line x1={b.x} y1={y - 150} x2={b.x} y2={y + 150} />
                  <line x1={b.x + b.w} y1={y - 150} x2={b.x + b.w} y2={y + 150} />
                </g>
              ))}
              <text
                x={bays[0].x + bays[0].w / 2} y={y - 260}
                fontSize={Math.max(W, H) / 46} fill="#3A4E63" stroke="none" textAnchor="middle"
                fontFamily="ui-monospace, monospace"
              >
                {bays[0].w / 10} {t('см', 'sm')}
              </text>
            </g>
          );
        })}

        {/* габариты помещения */}
        <g stroke="#0B1B2B" strokeWidth={strokeMm} fill="none">
          <line x1="0" y1={room.depth + 700} x2={room.width} y2={room.depth + 700} />
          <line x1="0" y1={room.depth + 550} x2="0" y2={room.depth + 850} />
          <line x1={room.width} y1={room.depth + 550} x2={room.width} y2={room.depth + 850} />
          <line x1={room.width + 700} y1="0" x2={room.width + 700} y2={room.depth} />
          <line x1={room.width + 550} y1="0" x2={room.width + 850} y2="0" />
          <line x1={room.width + 550} y1={room.depth} x2={room.width + 850} y2={room.depth} />
        </g>
        <text
          x={room.width / 2} y={room.depth + 1250}
          fontSize={Math.max(W, H) / 40} fill="#0B1B2B" textAnchor="middle"
          fontFamily="ui-monospace, monospace"
        >
          {(room.width / 1000).toFixed(1)} {t('м', 'm')}
        </text>
        <text
          x={room.width + 1250} y={room.depth / 2}
          fontSize={Math.max(W, H) / 40} fill="#0B1B2B" textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          transform={`rotate(90 ${room.width + 1250} ${room.depth / 2})`}
        >
          {(room.depth / 1000).toFixed(1)} {t('м', 'm')}
        </text>
      </svg>

      {!compact && (
        <figcaption className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-slate-500">
          <span>{t('Рядов', 'Qator')}: <b className="text-ink">{layout.rows}</b></span>
          <span>{t('Секций', 'Seksiya')}: <b className="text-ink">{layout.sections}</b></span>
          <span>{t('Ярусов балок', 'Balka yaruslari')}: <b className="text-ink">{layout.levels}</b></span>
          <span>{t('Высота рамы', 'Rama balandligi')}: <b className="text-ink">{layout.frameHeight} {t('мм', 'mm')}</b></span>
          <span>{t('Проход', 'Yoʻlak')}: <b className="text-ink">{(layout.aisle / 1000).toFixed(1)} {t('м', 'm')}</b></span>
          <span>{t('Паллето-мест', 'Palet oʻrinlari')}: <b className="text-ink">{layout.positions}</b></span>
        </figcaption>
      )}
    </figure>
  );
}
