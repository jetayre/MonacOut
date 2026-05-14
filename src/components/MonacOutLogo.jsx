const NAVY = "#1A2A5A";

export default function MonacOutLogo({ width = 290 }) {
  const scale = width / 290;
  return (
    <div style={{ textAlign: "center", padding: `${6 * scale}px 0 ${2 * scale}px` }}>
      <span style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: Math.round(36 * scale),
        fontWeight: 700,
        fontStyle: "normal",
        color: NAVY,
        letterSpacing: Math.round(2 * scale),
        display: "inline-block",
      }}>
        Monac<span style={{ fontStyle: "italic", fontWeight: 400 }}>Out</span>
      </span>
    </div>
  );
}
