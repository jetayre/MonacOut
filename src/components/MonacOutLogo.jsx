const GOLD = "#0F1D3A";

export default function MonacOutLogo({ width = 290 }) {
  const scale = width / 290;
  return (
    <div style={{ textAlign: "center", padding: `${6 * scale}px 0 ${4 * scale}px` }}>
      <div style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: Math.round(40 * scale),
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
