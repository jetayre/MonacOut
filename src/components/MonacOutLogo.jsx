const GOLD = "#C9A96E";
const NAVY = "#0F1D3A";
const CREAM = "#FFFFFF";
// Bleu de la marque, assombri pour rester lisible en petit corps sur fond blanc.
// Le #9FC3DC des rayures est trop pâle pour du texte de 6 à 8 px.
const BLUE = "#3E7EA8";

export default function MonacOutLogo({ width = 220, compact = false, lang = "fr" }) {
  // Signature sous le nom — demande de Stéphanie, 30 août 2026 :
  // « Monaco Ensemble » en français, « Monaco Together » en anglais, en bleu.
  const signature = lang === "en" ? "Monaco Together" : "Monaco Ensemble";
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
            color: BLUE, textTransform: "uppercase", marginTop: 2,
          }}>{signature}</div>
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
          color: BLUE, textTransform: "uppercase", marginTop: 5,
        }}>{signature}</div>
      </div>
    </div>
  );
}
