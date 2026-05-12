const NAVY = "#1A2A5A";

export default function MonacOutLogo({ width = 220 }) {
  const cx = 132;
  const vw = 268;
  const vh = 238;
  const h = Math.round((vh / vw) * width);
  const cb = 78; // crown base band top y

  // Elegant tapering spire — wide at base, narrows to fine point
  function spire(x, baseY, tipY, hw) {
    const ctrl = tipY + (baseY - tipY) * 0.55;
    return `M${x-hw},${baseY} Q${x - hw * 0.25},${ctrl} ${x},${tipY} Q${x + hw * 0.25},${ctrl} ${x+hw},${baseY} Z`;
  }

  function diamond(x, y, rx, ry) {
    return `M${x},${y-ry} L${x+rx},${y} L${x},${y+ry} L${x-rx},${y} Z`;
  }

  const ornY = 220;

  return (
    <svg viewBox={`0 0 ${vw} ${vh}`} width={width} height={h} xmlns="http://www.w3.org/2000/svg">

      {/* ── Crown ── */}
      <g fill={NAVY}>
        {/* Base band */}
        <rect x={cx-32} y={cb} width={64} height={5} rx={0.5} />

        {/* Center spire — tallest */}
        <path d={spire(cx, cb, 10, 3)} />
        {/* Small diamond at center tip */}
        <path d={diamond(cx, 10, 2, 3)} />

        {/* Inner spires (±10) */}
        <path d={spire(cx-10, cb, 26, 2.6)} />
        <path d={spire(cx+10, cb, 26, 2.6)} />
        <path d={diamond(cx-10, 26, 1.5, 2.5)} />
        <path d={diamond(cx+10, 26, 1.5, 2.5)} />

        {/* Mid spires (±20) */}
        <path d={spire(cx-20, cb, 40, 2.3)} />
        <path d={spire(cx+20, cb, 40, 2.3)} />
        <path d={diamond(cx-20, 40, 1.3, 2)} />
        <path d={diamond(cx+20, 40, 1.3, 2)} />

        {/* Outer spires (±30) */}
        <path d={spire(cx-30, cb, 54, 2)} />
        <path d={spire(cx+30, cb, 54, 2)} />
        <path d={diamond(cx-30, 54, 1, 1.8)} />
        <path d={diamond(cx+30, 54, 1, 1.8)} />

        {/* Pendant below band */}
        <path d={diamond(cx, cb+7, 3, 4.5)} />
      </g>

      {/* Arch windows cut into base band */}
      <g fill="white">
        <path d={`M${cx-5},${cb} Q${cx},${cb-6} ${cx+5},${cb} Z`} />
        <path d={`M${cx-17},${cb} Q${cx-11},${cb-5} ${cx-5},${cb} Z`} />
        <path d={`M${cx+5},${cb} Q${cx+11},${cb-5} ${cx+17},${cb} Z`} />
        <path d={`M${cx-30},${cb} Q${cx-24},${cb-4} ${cx-18},${cb} Z`} />
        <path d={`M${cx+18},${cb} Q${cx+24},${cb-4} ${cx+30},${cb} Z`} />
      </g>

      {/* ── M — thin elegant Playfair ── */}
      <text
        x="38" y="178"
        fontFamily="'Playfair Display', Georgia, serif"
        fontStyle="normal" fontWeight="400" fontSize="128"
        fill={NAVY}
      >M</text>

      {/* ── O — white fill, navy outline ── */}
      <text
        x="118" y="178"
        fontFamily="'Playfair Display', Georgia, serif"
        fontStyle="normal" fontWeight="400" fontSize="112"
        fill="white" stroke={NAVY} strokeWidth="1.4"
      >O</text>

      {/* ── MonacOut — calligraphic ── */}
      <text
        x={cx} y="210"
        fontFamily="'Great Vibes', 'Cormorant Garamond', Georgia, serif"
        fontWeight="400" fontSize="40"
        fill={NAVY} textAnchor="middle"
      >MonacOut</text>

      {/* ── Ornament ── */}
      <line x1={cx-118} y1={ornY} x2={cx-38} y2={ornY} stroke={NAVY} strokeWidth="0.65" />
      <line x1={cx+38}  y1={ornY} x2={cx+118} y2={ornY} stroke={NAVY} strokeWidth="0.65" />
      <line x1={cx-118} y1={ornY-3} x2={cx-118} y2={ornY+3} stroke={NAVY} strokeWidth="0.9" />
      <line x1={cx+118} y1={ornY-3} x2={cx+118} y2={ornY+3} stroke={NAVY} strokeWidth="0.9" />

      {/* Left scroll — S-curve flourish */}
      <path
        d={`M${cx-38},${ornY} C${cx-38},${ornY+12} ${cx-58},${ornY+12} ${cx-58},${ornY} C${cx-58},${ornY-8} ${cx-50},${ornY-8} ${cx-46},${ornY}`}
        stroke={NAVY} strokeWidth="0.75" fill="none"
      />
      {/* Right scroll — mirrored */}
      <path
        d={`M${cx+38},${ornY} C${cx+38},${ornY+12} ${cx+58},${ornY+12} ${cx+58},${ornY} C${cx+58},${ornY-8} ${cx+50},${ornY-8} ${cx+46},${ornY}`}
        stroke={NAVY} strokeWidth="0.75" fill="none"
      />

      {/* Center stacked diamonds */}
      <path d={diamond(cx, ornY,    5, 8)} fill={NAVY} />
      <path d={diamond(cx, ornY+12, 3, 4.5)} fill={NAVY} />
    </svg>
  );
}
