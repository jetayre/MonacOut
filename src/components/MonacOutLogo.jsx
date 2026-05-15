const GOLD = "#B8962E";

export default function MonacOutLogo({ width = 290 }) {
  const scale = width / 290;
  return (
    <div style={{ textAlign: "center", padding: `${6 * scale}px 0 ${4 * scale}px` }}>
      <div style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: Math.round(52 * scale),
        fontWeight: 700,
        fontStyle: "italic",
        color: GOLD,
        letterSpacing: Math.round(2 * scale),
        lineHeight: 1,
      }}>
        MonacOut
      </div>
      <div style={{
        color: GOLD,
        fontSize: Math.round(10 * scale),
        letterSpacing: Math.round(6 * scale),
        marginTop: Math.round(4 * scale),
        opacity: 0.5,
        fontFamily: "Georgia, serif",
      }}>
        ✦ ❧ ✦
      </div>
    </div>
  );
}
