const NAVY = "#1A2A5A";

export default function MonacOutLogo({ width = 220 }) {
  const cx = 134;
  const vw = 268;
  const vh = 236;
  const h = Math.round((vh / vw) * width);
  const cb = 79;

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
        <rect x={cx - 40} y={cb} width={80} height={5} rx={0.5} />

        <path d={spire(cx,      cb, 43, 3.3)} />
        <path d={spire(cx -  9, cb, 51, 2.9)} />
        <path d={spire(cx +  9, cb, 51, 2.9)} />
        <path d={spire(cx - 18, cb, 58, 2.5)} />
        <path d={spire(cx + 18, cb, 58, 2.5)} />
        <path d={spire(cx - 28, cb, 66, 2.1)} />
        <path d={spire(cx + 28, cb, 66, 2.1)} />
        <path d={spire(cx - 38, cb, 73, 1.8)} />
        <path d={spire(cx + 38, cb, 73, 1.8)} />

        <path d={diamond(cx,      43, 2.2, 3.5)} />
        <path d={diamond(cx -  9, 51, 2.0, 3.1)} />
        <path d={diamond(cx +  9, 51, 2.0, 3.1)} />
        <path d={diamond(cx - 18, 58, 1.8, 2.8)} />
        <path d={diamond(cx + 18, 58, 1.8, 2.8)} />
        <path d={diamond(cx - 28, 66, 1.5, 2.4)} />
        <path d={diamond(cx + 28, 66, 1.5, 2.4)} />
        <path d={diamond(cx - 38, 73, 1.3, 2.0)} />
        <path d={diamond(cx + 38, 73, 1.3, 2.0)} />

        <path d={diamond(cx, cb + 7, 3, 4.5)} />
      </g>

      {/* Arch openings */}
      <g fill="white">
        <path d={`M${cx - 5},${cb} Q${cx},${cb - 6} ${cx + 5},${cb} Z`} />
        <path d={`M${cx - 14},${cb} Q${cx - 8.5},${cb - 5} ${cx - 4},${cb} Z`} />
        <path d={`M${cx + 4},${cb} Q${cx + 8.5},${cb - 5} ${cx + 14},${cb} Z`} />
        <path d={`M${cx - 23},${cb} Q${cx - 17.5},${cb - 4} ${cx - 13},${cb} Z`} />
        <path d={`M${cx + 13},${cb} Q${cx + 17.5},${cb - 4} ${cx + 23},${cb} Z`} />
        <path d={`M${cx - 33},${cb} Q${cx - 28},${cb - 3} ${cx - 23},${cb} Z`} />
        <path d={`M${cx + 23},${cb} Q${cx + 28},${cb - 3} ${cx + 33},${cb} Z`} />
        <path d={`M${cx - 40},${cb} Q${cx - 37.5},${cb - 2} ${cx - 33},${cb} Z`} />
        <path d={`M${cx + 33},${cb} Q${cx + 37.5},${cb - 2} ${cx + 40},${cb} Z`} />
      </g>

      {/* ── M ── */}
      <text
        x="25" y="180"
        fontFamily="'Playfair Display', Georgia, serif"
        fontStyle="normal" fontWeight="400" fontSize="118"
        fill={NAVY}
      >M</text>

      {/* ── O — white fill, navy outline ── */}
      <text
        x="112" y="178"
        fontFamily="'Playfair Display', Georgia, serif"
        fontStyle="normal" fontWeight="400" fontSize="110"
        fill="white" stroke={NAVY} strokeWidth="1.5"
      >O</text>

      {/* ── MonacOut script ── */}
      <text
        x={cx} y="208"
        fontFamily="'Great Vibes', cursive"
        fontWeight="400" fontSize="42"
        fill={NAVY} textAnchor="middle"
      >MonacOut</text>

      {/* ── Ornament ── */}
      <line x1={cx - 110} y1={ornY} x2={cx - 30} y2={ornY} stroke={NAVY} strokeWidth="0.65" />
      <line x1={cx + 30}  y1={ornY} x2={cx + 110} y2={ornY} stroke={NAVY} strokeWidth="0.65" />
      <line x1={cx - 110} y1={ornY - 3} x2={cx - 110} y2={ornY + 3} stroke={NAVY} strokeWidth="0.9" />
      <line x1={cx + 110} y1={ornY - 3} x2={cx + 110} y2={ornY + 3} stroke={NAVY} strokeWidth="0.9" />

      <path d={`M${cx - 30},${ornY} C${cx - 30},${ornY - 13} ${cx - 52},${ornY - 13} ${cx - 52},${ornY}`}
        stroke={NAVY} strokeWidth="0.85" fill="none" />
      <path d={`M${cx - 33},${ornY} C${cx - 33},${ornY - 8} ${cx - 49},${ornY - 8} ${cx - 49},${ornY}`}
        stroke={NAVY} strokeWidth="0.55" fill="none" />
      <path d={`M${cx + 30},${ornY} C${cx + 30},${ornY - 13} ${cx + 52},${ornY - 13} ${cx + 52},${ornY}`}
        stroke={NAVY} strokeWidth="0.85" fill="none" />
      <path d={`M${cx + 33},${ornY} C${cx + 33},${ornY - 8} ${cx + 49},${ornY - 8} ${cx + 49},${ornY}`}
        stroke={NAVY} strokeWidth="0.55" fill="none" />

      <path d={diamond(cx, ornY,      5.5, 9)} fill={NAVY} />
      <path d={diamond(cx, ornY + 13, 3,   5)} fill={NAVY} />
    </svg>
  );
}
