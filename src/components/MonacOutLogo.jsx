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
          padding: "4px 14px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <span style={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontWeight: 400, fontSize: 13, letterSpacing: 3,
              color: NAVY, textTransform: "uppercase",
            }}>MONAC'</span>
            <span style={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontWeight: 600, fontSize: 13, letterSpacing: 2,
              color: GOLD, textTransform: "uppercase",
            }}>OUT</span>
          </div>
          <div style={{
            fontFamily: "'Josefin Sans', sans-serif",
            fontWeight: 400, fontSize: 6, letterSpacing: 1.5,
            color: GOLD, textTransform: "uppercase", marginTop: 2,
          }}>Community &amp; lifestyle</div>
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
          }}>MONAC'</span>
          <span style={{
            fontFamily: "'Josefin Sans', sans-serif",
            fontWeight: 600,
            fontSize: 13,
            letterSpacing: 4,
            color: GOLD,
            textTransform: "uppercase",
          }}>OUT</span>
        </div>
        <div style={{
          fontFamily: "'Josefin Sans', sans-serif",
          fontWeight: 400, fontSize: 8, letterSpacing: 2.5,
          color: GOLD, textTransform: "uppercase", marginTop: 5,
        }}>Community &amp; lifestyle</div>
      </div>
    </div>
  );
}
