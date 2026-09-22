// Рисунки для bento «Почему RaxPro»: паллеты на полу vs в стеллаже и
// регулируемый ярус. Косая проекция (D — вектор глубины), чтобы у стоек,
// балок и коробок читались верх и бок, а не плоские прямоугольники.

const D = { x: 8, y: -5 };          // глубина одного тела (паллета, балка, стойка)
const FRAME = { x: 20, y: -12 };    // глубина рамы стеллажа (передняя → задняя стойка)

const PALETTE = {
  post: { f: '#1e3a8a', t: '#3552a8', s: '#12265e' },
  beam: { f: '#f28b3a', t: '#f7ab6a', s: '#c6692a' },
  wood: { f: '#c99a5c', t: '#dcb478', s: '#9d7240' },
  box:  { f: '#d9b98d', t: '#e9d1ab', s: '#b48f5f' },
};

function Prism({ x, y, w, h, c, depth = D, stroke }) {
  const { x: dx, y: dy } = depth;
  return (
    <g>
      <polygon points={`${x},${y} ${x + dx},${y + dy} ${x + w + dx},${y + dy} ${x + w},${y}`} fill={c.t} />
      <polygon points={`${x + w},${y} ${x + w + dx},${y + dy} ${x + w + dx},${y + h + dy} ${x + w},${y + h}`} fill={c.s} />
      <rect x={x} y={y} width={w} height={h} fill={c.f} stroke={stroke} strokeWidth={stroke ? 0.6 : 0} />
    </g>
  );
}

// Стойка: перфорация с шагом, пятка внизу.
function Upright({ x, top, ground, w = 6, depth = D }) {
  const slots = Math.floor((ground - top - 10) / 8);
  return (
    <g>
      <Prism x={x - 4} y={ground - 2} w={w + 8} h={2} c={PALETTE.post} depth={depth} />
      <Prism x={x} y={top} w={w} h={ground - top} c={PALETTE.post} depth={depth} />
      {Array.from({ length: slots }, (_, i) => (
        <rect key={i} x={x + w / 2 - 1} y={top + 6 + i * 8} width="2" height="4" rx="0.5" fill="#fff" opacity="0.55" />
      ))}
    </g>
  );
}

// Балка с концевыми кронштейнами.
function Beam({ x, y, w, ghost = false }) {
  if (ghost) {
    return (
      <g>
        <rect x={x} y={y} width={w} height="6" fill="#f28b3a" opacity="0.14" />
        <rect x={x} y={y} width={w} height="6" fill="none" stroke="#f28b3a" strokeWidth="1.4" strokeDasharray="4 3" />
        <rect x={x - 4} y={y - 3} width="4" height="12" fill="none" stroke="#f28b3a" strokeWidth="1.4" strokeDasharray="4 3" />
        <rect x={x + w} y={y - 3} width="4" height="12" fill="none" stroke="#f28b3a" strokeWidth="1.4" strokeDasharray="4 3" />
      </g>
    );
  }
  return (
    <g>
      <Prism x={x} y={y} w={w} h={6} c={PALETTE.beam} />
      <rect x={x - 4} y={y - 3} width="4" height="12" rx="0.5" fill={PALETTE.beam.s} />
      <rect x={x + w} y={y - 3} width="4" height="12" rx="0.5" fill={PALETTE.beam.s} />
      <circle cx={x - 2} cy={y + 1} r="0.8" fill="#fff" opacity="0.6" />
      <circle cx={x - 2} cy={y + 5} r="0.8" fill="#fff" opacity="0.6" />
      <circle cx={x + w + 2} cy={y + 1} r="0.8" fill="#fff" opacity="0.6" />
      <circle cx={x + w + 2} cy={y + 5} r="0.8" fill="#fff" opacity="0.6" />
    </g>
  );
}

// Паллета с коробками; ground — линия, на которой стоит. Раскладка коробок
// чередуется по индексу, чтобы ряд не выглядел штампованным.
const LOAD_H = 7 + 22;
function PalletLoad({ x, ground, w = 36, variant = 0 }) {
  const py = ground - 7;
  const half = (w - 2) / 2;
  const rows = [
    [[0, half], [half + 2, half]],
    variant % 3 === 1 ? [[0, w]] : variant % 3 === 2 ? [[2, half - 2], [half + 2, half - 2]] : [[0, half], [half + 2, half]],
  ];
  return (
    <g>
      <ellipse cx={x + w / 2 + 3} cy={ground + 1} rx={w / 2 + 4} ry="2.5" fill="#0f2447" opacity="0.08" />
      {[0, w / 2 - 3, w - 6].map((bx) => (
        <Prism key={bx} x={x + bx} y={ground - 4} w={6} h={4} c={PALETTE.wood} />
      ))}
      <Prism x={x} y={py} w={w} h={3} c={PALETTE.wood} />
      <line x1={x + w / 3} y1={py} x2={x + w / 3 + D.x} y2={py + D.y} stroke={PALETTE.wood.s} strokeWidth="0.7" opacity="0.7" />
      <line x1={x + (2 * w) / 3} y1={py} x2={x + (2 * w) / 3 + D.x} y2={py + D.y} stroke={PALETTE.wood.s} strokeWidth="0.7" opacity="0.7" />
      {rows.map((row, r) => row.map(([bx, bw], i) => {
        const y = py - 11 * (r + 1);
        return (
          <g key={`${r}-${i}`}>
            <Prism x={x + bx} y={y} w={bw} h={11} c={PALETTE.box} stroke={PALETTE.box.s} />
            <rect x={x + bx + bw / 2 - 0.6} y={y} width="1.2" height="11" fill={PALETTE.box.s} opacity="0.35" />
            <line x1={x + bx + bw / 2} y1={y} x2={x + bx + bw / 2 + D.x} y2={y + D.y} stroke={PALETTE.box.s} strokeWidth="1" opacity="0.35" />
          </g>
        );
      }))}
      {/* стрейч-плёнка: мягкий блик по всему грузу */}
      <polygon points={`${x + 2},${py - 22} ${x + 9},${py - 22} ${x + 5},${py} ${x + 1},${py}`} fill="#fff" opacity="0.18" />
    </g>
  );
}

// Пол vs стеллаж. floorPallets — паллет на полу, levels — ярусов сверх пола.
export function CapacityFigure({ before, after, floorPallets = 4, levels = 2 }) {
  const w = 36;
  const gap = 8;
  const bayPallets = 2;
  const bays = floorPallets / bayPallets;
  const postW = 6;
  const bayW = bayPallets * w + (bayPallets + 1) * 6;
  const ground = 186;
  const rowH = LOAD_H + 6 + 6;
  const floorX = 8;
  const rackX = floorX + floorPallets * (w + gap) + 30;
  const top = ground - levels * rowH - LOAD_H - 14;
  const rackW = bays * bayW + (bays + 1) * postW;
  const width = rackX + rackW + FRAME.x + 8;
  const postX = (i) => rackX + i * (bayW + postW);
  const bayX = (b) => postX(b) + postW;

  return (
    <div className="max-w-[560px]">
      <div className="grid grid-cols-[1fr,1.15fr] gap-3 text-xs sm:text-sm mb-2">
        <div className="text-slate-500 self-end">{before}</div>
        <div className="font-bold text-navy-800">{after}</div>
      </div>
      <svg viewBox={`0 ${top - 12} ${width} ${ground - top + 22}`} className="w-full h-auto" role="img" aria-label={`${before} → ${after}`}>
        <line x1="0" y1={ground + 1.5} x2={width} y2={ground + 1.5} stroke="#d9e1ec" strokeWidth="2" />
        <line x1={rackX - 10} y1={ground + 1.5 + FRAME.y} x2={width} y2={ground + 1.5 + FRAME.y} stroke="#e8eef5" strokeWidth="1" />

        {Array.from({ length: floorPallets }, (_, i) => (
          <PalletLoad key={i} x={floorX + i * (w + gap)} ground={ground} w={w} variant={i} />
        ))}

        {/* задняя рама */}
        {Array.from({ length: bays + 1 }, (_, i) => (
          <Upright key={`b${i}`} x={postX(i) + FRAME.x} top={top + FRAME.y} ground={ground + FRAME.y} w={postW} />
        ))}
        {Array.from({ length: levels }, (_, l) => Array.from({ length: bays }, (_, b) => (
          <Prism key={`bb${l}${b}`} x={bayX(b) + FRAME.x} y={ground - (l + 1) * rowH + FRAME.y} w={bayW} h={6} c={PALETTE.beam} />
        )))}
        {/* раскосы рамы */}
        {Array.from({ length: bays + 1 }, (_, i) => {
          const x1 = postX(i) + postW;
          const x2 = postX(i) + FRAME.x;
          const n = 4;
          const step = (ground - top) / n;
          return Array.from({ length: n }, (_, k) => (
            <line key={`br${i}${k}`} x1={x1} y1={top + k * step} x2={x2} y2={top + (k + (k % 2 ? 0 : 1)) * step + FRAME.y} stroke={PALETTE.post.s} strokeWidth="1" opacity="0.6" />
          ));
        })}

        {/* ярусы: балка + груз */}
        {Array.from({ length: levels + 1 }, (_, l) => {
          const beamY = ground - l * rowH;
          const loadGround = l === 0 ? ground : beamY;
          return (
            <g key={l}>
              {l > 0 && Array.from({ length: bays }, (_, b) => <Beam key={b} x={bayX(b)} y={beamY} w={bayW} />)}
              {Array.from({ length: floorPallets }, (_, i) => {
                const b = Math.floor(i / bayPallets);
                const j = i % bayPallets;
                return <PalletLoad key={i} x={bayX(b) + 6 + j * (w + 6)} ground={loadGround} w={w} variant={i + l} />;
              })}
            </g>
          );
        })}

        {/* передние стойки */}
        {Array.from({ length: bays + 1 }, (_, i) => (
          <Upright key={`f${i}`} x={postX(i)} top={top} ground={ground} w={postW} />
        ))}
      </svg>
    </div>
  );
}

// Регулируемый ярус: балка на кронштейнах, призрак балки выше, стрелка.
export function TierFigure() {
  const top = 10;
  const ground = 150;
  const F = { x: 14, y: -9 };
  const brace = (x) => Array.from({ length: 5 }, (_, k) => {
    const step = (ground - top) / 5;
    return <line key={k} x1={x + 7} y1={top + k * step} x2={x + F.x} y2={top + (k + (k % 2 ? 0 : 1)) * step + F.y} stroke={PALETTE.post.s} strokeWidth="1" opacity="0.6" />;
  });
  return (
    <svg viewBox="0 0 170 158" className="w-full h-auto max-w-[190px]" aria-hidden="true">
      <line x1="0" y1={ground + 1.5} x2="170" y2={ground + 1.5} stroke="#d9e1ec" strokeWidth="2" />
      {/* задняя рама */}
      <Upright x={18 + F.x} top={top + F.y} ground={ground + F.y} w={7} />
      <Upright x={132 + F.x} top={top + F.y} ground={ground + F.y} w={7} />
      {brace(18)}
      {brace(132)}
      <Prism x={25 + F.x} y={112 + F.y} w={107} h={6} c={PALETTE.beam} />
      {/* полка-настил на нижней балке */}
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} x1={29 + i * 12.5} y1={112} x2={29 + i * 12.5 + F.x} y2={112 + F.y} stroke="#8fa3bf" strokeWidth="1.2" />
      ))}
      <Beam x={25} y={112} w={107} />
      <Beam x={25} y={62} w={107} ghost />
      <path d="M78 100V74m0 0-7 7m7-7 7 7" stroke="#0a86d8" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Upright x={18} top={top} ground={ground} w={7} />
      <Upright x={132} top={top} ground={ground} w={7} />
    </svg>
  );
}
