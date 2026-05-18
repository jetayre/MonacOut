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
    <div style={{ textAlign: "center", padding: `${8 * scale}px 0 ${6 * scale}px` }}>
      <div style={{ ...style, display: "inline" }}>
        <span style={{ color: GOLD }}>Monac</span><span style={{ color: NAVY }}>Out</span>
      </div>
    </div>
  );
}
