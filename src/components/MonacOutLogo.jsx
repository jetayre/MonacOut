const GOLD = "#C9A96E";
const NAVY = "#0F1D3A";

export default function MonacOutLogo({ width = 290 }) {
  const scale = width / 290;
  return (
    <div style={{ textAlign: "center", lineHeight: 1, padding: `0 0 ${2 * scale}px` }}>
      <span style={{
        fontFamily: "'Great Vibes', cursive",
        fontWeight: 400,
        fontStyle: "normal",
        lineHeight: 1,
        color: GOLD,
        fontSize: Math.round(108 * scale),
        verticalAlign: "baseline",
        letterSpacing: 0,
      }}>Monac</span><span style={{
        fontFamily: "'Great Vibes', cursive",
        fontWeight: 400,
        fontStyle: "normal",
        lineHeight: 1,
        color: NAVY,
        fontSize: Math.round(80 * scale),
        verticalAlign: "baseline",
        letterSpacing: 0,
      }}>Out</span>
    </div>
  );
}
