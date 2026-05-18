const GOLD = "#C4A241";
const NAVY = "#0F1D3A";

export default function MonacOutLogo({ width = 290 }) {
  const scale = width / 290;
  const style = {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: Math.round(72 * scale),
    fontWeight: 700,
    fontStyle: "normal",
    letterSpacing: Math.round(3 * scale),
    lineHeight: 1,
  };
  return (
    <div style={{ textAlign: "center", padding: `0 0 ${2 * scale}px` }}>
      <div style={{ ...style, display: "inline", alignItems: "baseline" }}>
        <span style={{ color: GOLD, fontSize: Math.round(72 * scale) }}>Monac</span><span style={{ color: NAVY, fontSize: Math.round(32 * scale) }}>Out</span>
      </div>
    </div>
  );
}
