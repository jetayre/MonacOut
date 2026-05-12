const NAVY = "#1A2A5A";

export default function MonacOutLogo({ width = 220 }) {
  const cx = 134;
  const vw = 268;
  const vh = 236;
  const h = Math.round((vh / vw) * width);
  const cb = 80; // crown base band top y

  // Wide elegant spire — proper crown points, slightly concave sides
  function spire(x, baseY, tipY, hw) {
    const ctrl = tipY + (baseY - tipY) * 0.52;
    return `M${x-hw},${baseY} Q${x-hw*0.12},${ctrl} ${x},${tipY} Q${x+hw*0.12},${ctrl} ${x+hw},${baseY} Z`;
  }

  function diamond(x, y, rx, ry) {
    return `M${x},${y-ry} L${x+rx},${y} L${x},${y+ry} L${x-rx},${y} Z`;
  }

  const ornY = 219;

  return (
    <svg viewBox={`0 0 ${vw} ${vh}`} width={width} height={h} xmlns="http://www.w3.org/2000/svg">

      {/* ── Crown — wide triangular spires ── */}
      <g fill={NAVY}>
        {/* Base band — wide */}
        <rect x={cx-42} y={cb} width={84} height={5} rx={0.5} />

        {/* Center spire — tallest, widest */}
        <path d={spire(cx, cb, 13, 5.5)} />
        <path d={diamond(cx, 13, 2.5, 4)} />

        {/* Inner spires (±13) */}
        <path d={spire(cx-13, cb, 27, 5)} />
        <path d={spire(cx+13, cb, 27, 5)} />
        <path d={diamond(cx-13, 27, 2.2, 3.5)} />
        <path d={diamond(cx+13, 27, 2.2, 3.5)} />

        {/* Mid spires (±26) */}
        <path d={spire(cx-26, cb, 41, 4.5)} />
        <path d={spire(cx+26, cb, 41, 4.5)} />
        <path d={diamond(cx-26, 41, 2, 3)} />
        <path d={diamond(cx+26, 41, 2, 3)} />

        {/* Outer spires (±39) */}
        <path d={spire(cx-39, cb, 55, 4)} />
        <path d={spire(cx+39, cb, 55, 4)} />
        <path d={diamond(cx-39, 55, 1.6, 2.5)} />
        <path d={diamond(cx+39, 55, 1.6, 2.5)} />

        {/* Pendant below band */}
        <path d={diamond(cx, cb+7, 3, 4.5)} />
      </g>

      {/* Arch windows cut into base band */}
      <g fill="white">
        <path d={`M${cx-6},${cb} Q${cx},${cb-8} ${cx+6},${cb} Z`} />
        <path d={`M${cx-19},${cb} Q${cx-13},${cb-7} ${cx-7},${cb} Z`} />
        <path d={`M${cx+7},${cb} Q${cx+13},${cb-7} ${cx+19},${cb} Z`} />
        <path d={`M${cx-33},${cb} Q${cx-27},${cb-5} ${cx-20},${cb} Z`} />
        <path d={`M${cx+20},${cb} Q${cx+27},${cb-5} ${cx+33},${cb} Z`} />
      </g>

      {/* ── M — elegant Playfair regular ── */}
      <text
        x="30" y="178"
        fontFamily="'Playfair Display', Georgia, serif"
        fontStyle="normal" fontWeight="400" fontSize="118"
        fill={NAVY}
      >M</text>

      {/* ── O — white fill, navy outline, overlaps M ── */}
      <text
        x="114" y="178"
        fontFamily="'Playfair Display', Georgia, serif"
        fontStyle="normal" fontWeight="400" fontSize="110"
        fill="white" stroke={NAVY} strokeWidth="1.5"
      >O</text>

      {/* ── MonacOut — calligraphic ── */}
      <text
        x={cx} y="208"
        fontFamily="'Great Vibes', 'Cormorant Garamond', Georgia, serif"
        fontWeight="400" fontSize="40"
        fill={NAVY} textAnchor="middle"
      >MonacOut</text>

      {/* ── Ornament — arcs opening upward ── */}
      <line x1={cx-118} y1={ornY} x2={cx-40} y2={ornY} stroke={NAVY} strokeWidth="0.6" />
      <line x1={cx+40}  y1={ornY} x2={cx+118} y2={ornY} stroke={NAVY} strokeWidth="0.6" />
      <line x1={cx-118} y1={ornY-3.5} x2={cx-118} y2={ornY+3.5} stroke={NAVY} strokeWidth="0.9" />
      <line x1={cx+118} y1={ornY-3.5} x2={cx+118} y2={ornY+3.5} stroke={NAVY} strokeWidth="0.9" />

      {/* Left arcs — open upward */}
      <path d={`M${cx-40},${ornY} C${cx-40},${ornY-14} ${cx-64},${ornY-14} ${cx-64},${ornY}`}
        stroke={NAVY} strokeWidth="0.8" fill="none" />
      <path d={`M${cx-44},${ornY} C${cx-44},${ornY-9} ${cx-60},${ornY-9} ${cx-60},${ornY}`}
        stroke={NAVY} strokeWidth="0.55" fill="none" />

      {/* Right arcs — open upward */}
      <path d={`M${cx+40},${ornY} C${cx+40},${ornY-14} ${cx+64},${ornY-14} ${cx+64},${ornY}`}
        stroke={NAVY} strokeWidth="0.8" fill="none" />
      <path d={`M${cx+44},${ornY} C${cx+44},${ornY-9} ${cx+60},${ornY-9} ${cx+60},${ornY}`}
        stroke={NAVY} strokeWidth="0.55" fill="none" />

      {/* Center diamond */}
      <path d={diamond(cx, ornY, 5.5, 9)} fill={NAVY} />
      <path d={diamond(cx, ornY+13, 3, 5)} fill={NAVY} />
    </svg>
  );
}
