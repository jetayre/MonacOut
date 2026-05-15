const GOLD = "#C4A241";

export default function MonacOutLogo({ width = 290 }) {
  const scale = width / 290;
  return (
    <div style={{ textAlign: "center", padding: `${8 * scale}px 0 ${6 * scale}px` }}>
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
    </div>
  );
}
