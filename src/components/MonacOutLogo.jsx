const GOLD = "#C9A96E";
const NAVY = "#0F1D3A";

export default function MonacOutLogo({ width = 290 }) {
  const scale = width / 290;
  return (
    <div style={{ textAlign: "center", lineHeight: 1, padding: `0 0 ${2 * scale}px` }}>
      <span style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontWeight: 300,
        fontStyle: "normal",
        letterSpacing: Math.round(1 * scale),
        lineHeight: 1,
        color: GOLD,
        fontSize: Math.round(90 * scale),
        verticalAlign: "baseline",
      }}>Monac</span><span style={{
        fontFamily: "'Great Vibes', cursive",
        fontWeight: 400,
        fontStyle: "normal",
        lineHeight: 1,
        color: NAVY,
        fontSize: Math.round(92 * scale),
        verticalAlign: "baseline",
        letterSpacing: 0,
      }}>Out</span>
    </div>
  );
}
