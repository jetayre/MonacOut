const GOLD = "#C9A96E";
const NAVY = "#0F1D3A";

export default function MonacOutLogo({ width = 290 }) {
  const scale = width / 290;
  return (
    <div style={{ textAlign: "center", padding: `0 0 ${2 * scale}px` }}>
      <span style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontWeight: 300,
        fontStyle: "normal",
        letterSpacing: Math.round(4 * scale),
        lineHeight: 1,
        color: GOLD,
        fontSize: Math.round(68 * scale),
      }}>Monac</span><span style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontWeight: 300,
        fontStyle: "normal",
        letterSpacing: Math.round(4 * scale),
        lineHeight: 1,
        color: NAVY,
        fontSize: Math.round(32 * scale),
      }}>Out</span>
    </div>
  );
}
