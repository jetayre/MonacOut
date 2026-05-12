const NAVY = "#1A2A5A";

export default function MonacOutLogo({ width = 220 }) {
  const cx = 132;
  const vw = 268;
  const vh = 240;
  const h = Math.round((vh / vw) * width);
  const cb = 76; // crown base band top y

  function spire(x, baseY, tipY, hw) {
    const s = tipY + (baseY - tipY) * 0.36;
    return `M${x-hw},${baseY} L${x-hw},${s} Q${x-hw},${tipY+2.5} ${x},${tipY} Q${x+hw},${tipY+2.5} ${x+hw},${s} L${x+hw},${baseY} Z`;
  }

  function diamond(x, y, rx, ry) {
    return `M${x},${y-ry} L${x+rx},${y} L${x},${y+ry} L${x-rx},${y} Z`;
  }

  const ornY = 220;

  return (
    <svg viewBox={`0 0 ${vw} ${vh}`} width={width} height={h} xmlns="http://www.w3.org/2000/svg">

      {/* ── Crown ── */}
      <g fill={NAVY}>
        {/* Base band — thin, elegant */}
        <rect x={cx-36} y={cb} width={72} height={5} rx={1} />

        {/* Center spire — tallest, finest */}
        <path d={spire(cx, cb, 9, 2.2)} />
        <circle cx={cx} cy={9} r={3} />
        <circle cx={cx} cy={9} r={1.3} fill="white" />

        {/* Inner spires (±14) */}
        <path d={spire(cx-14, cb, 25, 1.8)} />
        <path d={spire(cx+14, cb, 25, 1.8)} />
        <circle cx={cx-14} cy={25} r={2.3} />
        <circle cx={cx+14} cy={25} r={2.3} />
        <circle cx={cx-14} cy={25} r={0.9} fill="white" />
        <circle cx={cx+14} cy={25} r={0.9} fill="white" />

        {/* Mid spires (±24) */}
        <path d={spire(cx-24, cb, 40, 1.6)} />
        <path d={spire(cx+24, cb, 40, 1.6)} />
        <circle cx={cx-24} cy={40} r={2} />
        <circle cx={cx+24} cy={40} r={2} />

        {/* Outer spires (±33) */}
        <path d={spire(cx-33, cb, 54, 1.4)} />
        <path d={spire(cx+33, cb, 54, 1.4)} />
        <circle cx={cx-33} cy={54} r={1.6} />
        <circle cx={cx+33} cy={54} r={1.6} />

        {/* Pendant diamond below band */}
        <path d={diamond(cx, cb+8, 3, 5)} />
      </g>

      {/* Arch windows cut into base band */}
      <g fill="white">
        <path d={`M${cx-5},${cb} Q${cx},${cb-7} ${cx+5},${cb} Z`} />
        <path d={`M${cx-19},${cb} Q${cx-14},${cb-6} ${cx-9},${cb} Z`} />
        <path d={`M${cx+9},${cb} Q${cx+14},${cb-6} ${cx+19},${cb} Z`} />
        <path d={`M${cx-31},${cb} Q${cx-26},${cb-5} ${cx-21},${cb} Z`} />
        <path d={`M${cx+21},${cb} Q${cx+26},${cb-5} ${cx+31},${cb} Z`} />
      </g>

      {/* ── M — thin elegant Playfair regular ── */}
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

      {/* ── MonacOut — calligraphic script ── */}
      <text
        x={cx} y="210"
        fontFamily="'Great Vibes', 'Cormorant Garamond', Georgia, serif"
        fontWeight="400" fontSize="40"
        fill={NAVY} textAnchor="middle"
      >MonacOut</text>

      {/* ── Ornament ── */}
      {/* Horizontal lines left / right */}
      <line x1={cx-118} y1={ornY} x2={cx-40} y2={ornY} stroke={NAVY} strokeWidth="0.65" />
      <line x1={cx+40}  y1={ornY} x2={cx+118} y2={ornY} stroke={NAVY} strokeWidth="0.65" />
      {/* End ticks */}
      <line x1={cx-118} y1={ornY-3} x2={cx-118} y2={ornY+3} stroke={NAVY} strokeWidth="0.85" />
      <line x1={cx+118} y1={ornY-3} x2={cx+118} y2={ornY+3} stroke={NAVY} strokeWidth="0.85" />

      {/* Left scroll — downward loop */}
      <path
        d={`M${cx-40},${ornY} C${cx-40},${ornY+13} ${cx-62},${ornY+13} ${cx-62},${ornY} C${cx-62},${ornY-7} ${cx-54},${ornY-7} ${cx-50},${ornY}`}
        stroke={NAVY} strokeWidth="0.8" fill="none"
      />
      {/* Right scroll — mirrored */}
      <path
        d={`M${cx+40},${ornY} C${cx+40},${ornY+13} ${cx+62},${ornY+13} ${cx+62},${ornY} C${cx+62},${ornY-7} ${cx+54},${ornY-7} ${cx+50},${ornY}`}
        stroke={NAVY} strokeWidth="0.8" fill="none"
      />

      {/* Center ornament — stacked diamonds */}
      <path d={diamond(cx, ornY,    5.5, 8.5)} fill={NAVY} />
      <path d={diamond(cx, ornY+13, 3,   4.5)} fill={NAVY} />
    </svg>
  );
}
