const NAVY = "#1A2A5A";

export default function MonacOutLogo({ width = 220 }) {
  const cx = 134;
  const vw = 268;
  const vh = 236;
  const h = Math.round((vh / vw) * width);
  const cb = 80; // crown base y

  // Simple solid triangle spire — straight sides
  function spire(x, baseY, tipY, hw) {
    return `M${x - hw},${baseY} L${x},${tipY} L${x + hw},${baseY} Z`;
  }

  function diamond(x, y, rx, ry) {
    return `M${x},${y - ry} L${x + rx},${y} L${x},${y + ry} L${x - rx},${y} Z`;
  }

  const ornY = 219;

  return (
    <svg viewBox={`0 0 ${vw} ${vh}`} width={width} height={h} xmlns="http://www.w3.org/2000/svg">

      {/* ── Crown ── */}
      <g fill={NAVY}>
        {/* Base band */}
        <rect x={cx - 44} y={cb} width={88} height={5} rx={0.5} />

        {/* Center spire */}
        <path d={spire(cx,      cb, 12, 6)} />
        {/* Inner spires */}
        <path d={spire(cx - 14, cb, 27, 5.5)} />
        <path d={spire(cx + 14, cb, 27, 5.5)} />
        {/* Mid spires */}
        <path d={spire(cx - 27, cb, 41, 5)} />
        <path d={spire(cx + 27, cb, 41, 5)} />
        {/* Outer spires */}
        <path d={spire(cx - 40, cb, 55, 4.5)} />
        <path d={spire(cx + 40, cb, 55, 4.5)} />

        {/* Small diamond at each tip */}
        <path d={diamond(cx,      12, 2.5, 4)} />
        <path d={diamond(cx - 14, 27, 2.2, 3.5)} />
        <path d={diamond(cx + 14, 27, 2.2, 3.5)} />
        <path d={diamond(cx - 27, 41, 2,   3)} />
        <path d={diamond(cx + 27, 41, 2,   3)} />
        <path d={diamond(cx - 40, 55, 1.8, 2.8)} />
        <path d={diamond(cx + 40, 55, 1.8, 2.8)} />

        {/* Pendant below band */}
        <path d={diamond(cx, cb + 7, 3, 4.5)} />
      </g>

      {/* Arch windows */}
      <g fill="white">
        <path d={`M${cx - 6},${cb} Q${cx},${cb - 8} ${cx + 6},${cb} Z`} />
        <path d={`M${cx - 20},${cb} Q${cx - 14},${cb - 7} ${cx - 8},${cb} Z`} />
        <path d={`M${cx + 8},${cb} Q${cx + 14},${cb - 7} ${cx + 20},${cb} Z`} />
        <path d={`M${cx - 34},${cb} Q${cx - 27},${cb - 5} ${cx - 21},${cb} Z`} />
        <path d={`M${cx + 21},${cb} Q${cx + 27},${cb - 5} ${cx + 34},${cb} Z`} />
      </g>

      {/* ── M — Playfair Display 400 (thin, elegant) ── */}
      <text
        x="28" y="178"
        fontFamily="'Playfair Display', Georgia, serif"
        fontStyle="normal" fontWeight="400" fontSize="118"
        fill={NAVY}
      >M</text>

      {/* ── O — white fill, navy outline ── */}
      <text
        x="113" y="178"
        fontFamily="'Playfair Display', Georgia, serif"
        fontStyle="normal" fontWeight="400" fontSize="110"
        fill="white" stroke={NAVY} strokeWidth="1.5"
      >O</text>

      {/* ── MonacOut script ── */}
      <text
        x={cx} y="208"
        fontFamily="'Great Vibes', 'Cormorant Garamond', Georgia, serif"
        fontWeight="400" fontSize="40"
        fill={NAVY} textAnchor="middle"
      >MonacOut</text>

      {/* ── Ornament — arcs opening upward ── */}
      <line x1={cx - 118} y1={ornY} x2={cx - 40} y2={ornY} stroke={NAVY} strokeWidth="0.6" />
      <line x1={cx + 40}  y1={ornY} x2={cx + 118} y2={ornY} stroke={NAVY} strokeWidth="0.6" />
      <line x1={cx - 118} y1={ornY - 3.5} x2={cx - 118} y2={ornY + 3.5} stroke={NAVY} strokeWidth="0.9" />
      <line x1={cx + 118} y1={ornY - 3.5} x2={cx + 118} y2={ornY + 3.5} stroke={NAVY} strokeWidth="0.9" />

      {/* Left double arc — upward */}
      <path d={`M${cx - 40},${ornY} C${cx - 40},${ornY - 14} ${cx - 64},${ornY - 14} ${cx - 64},${ornY}`}
        stroke={NAVY} strokeWidth="0.85" fill="none" />
      <path d={`M${cx - 44},${ornY} C${cx - 44},${ornY - 9} ${cx - 60},${ornY - 9} ${cx - 60},${ornY}`}
        stroke={NAVY} strokeWidth="0.55" fill="none" />

      {/* Right double arc — upward */}
      <path d={`M${cx + 40},${ornY} C${cx + 40},${ornY - 14} ${cx + 64},${ornY - 14} ${cx + 64},${ornY}`}
        stroke={NAVY} strokeWidth="0.85" fill="none" />
      <path d={`M${cx + 44},${ornY} C${cx + 44},${ornY - 9} ${cx + 60},${ornY - 9} ${cx + 60},${ornY}`}
        stroke={NAVY} strokeWidth="0.55" fill="none" />

      {/* Center diamonds */}
      <path d={diamond(cx, ornY,      5.5, 9)} fill={NAVY} />
      <path d={diamond(cx, ornY + 13, 3,   5)} fill={NAVY} />
    </svg>
  );
}
