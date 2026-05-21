const GOLD = "#C9A96E";
const NAVY = "#0F1D3A";

export default function MonacOutLogo({ width = 290 }) {
  const scale = width / 290;
  return (
    <div style={{ textAlign: "center", lineHeight: 1, padding: `0 0 ${2 * scale}px` }}>
      <span style={{
        fontFamily: "'Josefin Sans', sans-serif",
        fontWeight: 300,
        letterSpacing: Math.round(4 * scale),
        color: GOLD,
        fontSize: Math.round(54 * scale),
        verticalAlign: "baseline",
      }}>Monac</span><span style={{
        fontFamily: "'Josefin Sans', sans-serif",
        fontWeight: 300,
        letterSpacing: Math.round(4 * scale),
        color: NAVY,
        fontSize: Math.round(36 * scale),
        verticalAlign: "baseline",
      }}>Out</span>
    </div>
  );
}
