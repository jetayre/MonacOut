const DARK_GOLD = "#9A7820";

export default function MonacOutLogo({ width = 290 }) {
  const scale = width / 290;
  return (
    <div style={{ textAlign: "center", padding: `${6 * scale}px 0 ${4 * scale}px` }}>
      <div style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: Math.round(48 * scale),
        fontWeight: 600,
        fontStyle: "italic",
        color: DARK_GOLD,
        letterSpacing: Math.round(3 * scale),
        lineHeight: 1,
      }}>
        MonacOut
      </div>
      <div style={{
        color: DARK_GOLD,
        fontSize: Math.round(11 * scale),
        letterSpacing: Math.round(6 * scale),
        marginTop: Math.round(4 * scale),
        opacity: 0.6,
        fontFamily: "Georgia, serif",
      }}>
        ✦ ❧ ✦
      </div>
    </div>
  );
}
