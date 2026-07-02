const GOLD = "#C9A96E";
const NAVY = "#0F1D3A";
const CREAM = "#FFFFFF";

export default function MonacOutLogo({ width = 220, compact = false }) {
  if (compact) {
    return (
      <div style={{
        border: `2px solid ${GOLD}`,
        padding: 2,
        display: "inline-block",
        boxSizing: "border-box",
      }}>
        <div style={{
          border: `1.5px solid ${NAVY}`,
          background: CREAM,
          padding: "5px 14px",
          display: "flex",
          alignItems: "baseline",
          justifyContent: "center",
        }}>
          <span style={{
            fontFamily: "'Josefin Sans', sans-serif",
            fontWeight: 400, fontSize: 16, letterSpacing: 4,
            color: NAVY, textTransform: "uppercase",
          }}>MON </span>
          <span style={{
            fontFamily: "'Josefin Sans', sans-serif",
            fontWeight: 600, fontSize: 16, letterSpacing: 3,
            color: GOLD, textTransform: "uppercase",
          }}>CERCLE</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      width,
      border: `2px solid ${GOLD}`,
      padding: 3,
      display: "inline-block",
      boxSizing: "border-box",
    }}>
      <div style={{
        border: `2px solid ${NAVY}`,
        background: CREAM,
        padding: "10px 16px 8px",
        textAlign: "center",
      }}>
        <div style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontWeight: 700,
          fontSize: 72,
          color: NAVY,
          lineHeight: 1,
          marginBottom: 6,
          letterSpacing: -2,
        }}>M</div>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 0 }}>
          <span style={{
            fontFamily: "'Josefin Sans', sans-serif",
            fontWeight: 400,
            fontSize: 13,
            letterSpacing: 7,
            color: NAVY,
            textTransform: "uppercase",
          }}>MON </span>
          <span style={{
            fontFamily: "'Josefin Sans', sans-serif",
            fontWeight: 600,
            fontSize: 13,
            letterSpacing: 4,
            color: GOLD,
            textTransform: "uppercase",
          }}>CERCLE</span>
        </div>
      </div>
    </div>
  );
}
