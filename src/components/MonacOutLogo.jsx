const GOLD = "#B8966E";

export default function MonacOutLogo({ width = 220 }) {
  const cx = 120;
  const crownCy = 54;
  const height = Math.round((190 / 240) * width);

  // 9 rays fanning upward from crown center
  const rays = [
    { l: 14, a: -72 }, { l: 20, a: -54 }, { l: 26, a: -36 },
    { l: 31, a: -18 }, { l: 36, a:   0 },
    { l: 31, a:  18 }, { l: 26, a:  36 }, { l: 20, a:  54 }, { l: 14, a:  72 },
  ].map(({ l, a }) => {
    const r = (a * Math.PI) / 180;
    return { tx: cx + l * Math.sin(r), ty: crownCy - l * Math.cos(r) };
  });

  return (
    <svg viewBox="0 0 240 190" width={width} height={height} xmlns="http://www.w3.org/2000/svg">

      {/* ── Crown ── */}
      <circle cx={cx} cy={crownCy} r="4.5" fill={GOLD} />
      {rays.map(({ tx, ty }, i) => (
        <g key={i}>
          <line x1={cx} y1={crownCy} x2={tx} y2={ty} stroke={GOLD} strokeWidth="1.1" />
          <circle cx={tx} cy={ty} r="1.8" fill={GOLD} />
        </g>
      ))}

      {/* ── M (filled) ── */}
      <text
        x="70" y="132"
        fontFamily="Georgia, serif" fontStyle="italic" fontWeight="bold"
        fontSize="84" fill={GOLD}
      >M</text>

      {/* ── O (stroke, white fill cuts over M) ── */}
      <text
        x="121" y="132"
        fontFamily="Georgia, serif" fontStyle="italic" fontWeight="bold"
        fontSize="84" fill="white" stroke={GOLD} strokeWidth="1.6"
      >O</text>

      {/* ── MonacOut script ── */}
      <text
        x={cx} y="159"
        fontFamily="Georgia, serif" fontStyle="italic"
        fontSize="27" fill={GOLD} textAnchor="middle" letterSpacing="0.5"
      >MonacOut</text>

      {/* ── Divider line ── */}
      <line x1="38" y1="170" x2="202" y2="170" stroke={GOLD} strokeWidth="0.7" />

      {/* ── Centre ornament ── */}
      <g transform={`translate(${cx}, 170)`}>
        {/* Two mirrored S-curves */}
        <path d="M-18,0 C-11,-5 -5,5 0,0 C5,-5 11,5 18,0"
              stroke={GOLD} strokeWidth="0.9" fill="none" />
        {/* Small dots at ends */}
        <circle cx="-18" cy="0" r="1.4" fill={GOLD} />
        <circle cx="18"  cy="0" r="1.4" fill={GOLD} />
        {/* Centre diamond */}
        <path d="M0,-3 L2.5,0 L0,3 L-2.5,0 Z" fill={GOLD} />
      </g>
    </svg>
  );
}
