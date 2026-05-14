const NAVY = "#1A2A5A";

export default function MonacOutLogo({ width = 290 }) {
  const scale = width / 290;
  return (
    <div style={{ textAlign: "center", padding: `${6 * scale}px 0 ${4 * scale}px` }}>
      <div style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: Math.round(48 * scale),
        fontWeight: 600,
        fontStyle: "italic",
        color: NAVY,
        letterSpacing: Math.round(3 * scale),
        lineHeight: 1,
      }}>
        MonacOut
      </div>
      <div style={{
        color: NAVY,
        fontSize: Math.round(11 * scale),
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
