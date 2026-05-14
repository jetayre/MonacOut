const NAVY = "#1A2A5A";

export default function MonacOutLogo({ width = 290 }) {
  const scale = width / 290;
  return (
    <div style={{ textAlign: "center", padding: `${8 * scale}px 0 ${2 * scale}px` }}>
      <span style={{
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontSize: Math.round(38 * scale),
        fontWeight: 700,
        color: NAVY,
        letterSpacing: Math.round(3 * scale),
        display: "inline-block",
      }}>
        Monac<span style={{ fontStyle: "italic" }}>Out</span>
      </span>
    </div>
  );
}
