const NAVY = "#1A2A5A";

export default function MonacOutLogo({ width = 220 }) {
  const cx = 130;
  const vw = 268;
  const vh = 244;
  const h = Math.round((vh / vw) * width);

  // Crown geometry — base band top at y=78
  const cb = 78;

  // Spire helper: pointed shaft from base to tip
  function spire(x, baseY, tipY, hw) {
    const shoulderY = tipY + (baseY - tipY) * 0.38;
    return `M${x - hw},${baseY} L${x - hw},${shoulderY} Q${x - hw},${tipY + 4} ${x},${tipY} Q${x + hw},${tipY + 4} ${x + hw},${shoulderY} L${x + hw},${baseY} Z`;
  }

  // Small diamond
  function diamond(x, y, rx, ry) {
    return `M${x},${y - ry} L${x + rx},${y} L${x},${y + ry} L${x - rx},${y} Z`;
  }

  const ornY = 222;

  return (
    <svg viewBox={`0 0 ${vw} ${vh}`} width={width} height={h} xmlns="http://www.w3.org/2000/svg">

      {/* ─── Crown ─── */}
      <g fill={NAVY}>
        {/* Base band */}
        <rect x={cx - 48} y={cb - 8} width={96} height={8} rx={1.5} />
        {/* Bottom-centre pendant diamond */}
        <path d={diamond(cx, cb + 5, 4, 6)} />

        {/* 9 graduated spires — center tallest, shorter toward edges */}
        {/* cx±0  */ }
        <path d={spire(cx,       cb - 8, 13, 4.5)} />
        <path d={diamond(cx,     7,  5, 8)} />
        <path d={diamond(cx,     23, 3, 4.5)} />

        {/* cx±12 */}
        <path d={spire(cx - 12, cb - 8, 24, 3.5)} />
        <path d={spire(cx + 12, cb - 8, 24, 3.5)} />
        <path d={diamond(cx - 12, 19, 3, 4.5)} />
        <path d={diamond(cx + 12, 19, 3, 4.5)} />

        {/* cx±24 */}
        <path d={spire(cx - 24, cb - 8, 34, 3)} />
        <path d={spire(cx + 24, cb - 8, 34, 3)} />
        <path d={diamond(cx - 24, 29, 2.5, 4)} />
        <path d={diamond(cx + 24, 29, 2.5, 4)} />

        {/* cx±36 */}
        <path d={spire(cx - 36, cb - 8, 46, 2.5)} />
        <path d={spire(cx + 36, cb - 8, 46, 2.5)} />

        {/* cx±47 (outer, shortest) */}
        <path d={spire(cx - 47, cb - 8, 55, 2)} />
        <path d={spire(cx + 47, cb - 8, 55, 2)} />
      </g>

      {/* ─── M (solid fill) ─── */}
      <text
        x="48" y="178"
        fontFamily="'Playfair Display', 'Georgia', serif"
        fontWeight="700"
        fontSize="128"
        fill={NAVY}
      >M</text>

      {/* ─── O (white fill, navy stroke — cuts over M) ─── */}
      <text
        x="122" y="178"
        fontFamily="'Playfair Display', 'Georgia', serif"
        fontWeight="700"
        fontSize="112"
        fill="white"
        stroke={NAVY}
        strokeWidth="1.8"
      >O</text>

      {/* ─── MonacOut script ─── */}
      <text
        x={cx} y="206"
        fontFamily="'Cormorant Garamond', 'Georgia', serif"
        fontStyle="italic"
        fontWeight="600"
        fontSize="33"
        fill={NAVY}
        textAnchor="middle"
        letterSpacing="0.5"
      >MonacOut</text>

      {/* ─── Ornament ─── */}
      {/* Horizontal lines */}
      <line x1={cx - 122} y1={ornY} x2={cx - 34} y2={ornY} stroke={NAVY} strokeWidth="0.7" />
      <line x1={cx + 34} y1={ornY} x2={cx + 122} y2={ornY} stroke={NAVY} strokeWidth="0.7" />
      {/* Small vertical end-ticks */}
      <line x1={cx - 122} y1={ornY - 3.5} x2={cx - 122} y2={ornY + 3.5} stroke={NAVY} strokeWidth="0.8" />
      <line x1={cx + 122} y1={ornY - 3.5} x2={cx + 122} y2={ornY + 3.5} stroke={NAVY} strokeWidth="0.8" />

      {/* Left scroll — outer arc */}
      <path
        d={`M${cx - 34},${ornY} C${cx - 34},${ornY + 16} ${cx - 66},${ornY + 16} ${cx - 66},${ornY}`}
        stroke={NAVY} strokeWidth="0.85" fill="none"
      />
      {/* Left scroll — inner arc */}
      <path
        d={`M${cx - 37},${ornY} C${cx - 37},${ornY + 10} ${cx - 63},${ornY + 10} ${cx - 63},${ornY}`}
        stroke={NAVY} strokeWidth="0.6" fill="none"
      />
      {/* Right scroll — outer arc */}
      <path
        d={`M${cx + 34},${ornY} C${cx + 34},${ornY + 16} ${cx + 66},${ornY + 16} ${cx + 66},${ornY}`}
        stroke={NAVY} strokeWidth="0.85" fill="none"
      />
      {/* Right scroll — inner arc */}
      <path
        d={`M${cx + 37},${ornY} C${cx + 37},${ornY + 10} ${cx + 63},${ornY + 10} ${cx + 63},${ornY}`}
        stroke={NAVY} strokeWidth="0.6" fill="none"
      />

      {/* Centre diamond */}
      <path d={diamond(cx, ornY, 6, 9)} fill={NAVY} />
      {/* Small pendant diamond below */}
      <path d={diamond(cx, ornY + 14, 3.5, 5)} fill={NAVY} />
      {/* Connecting stem */}
      <line x1={cx} y1={ornY + 9} x2={cx} y2={ornY + 9} stroke={NAVY} strokeWidth="0" />
    </svg>
  );
}
