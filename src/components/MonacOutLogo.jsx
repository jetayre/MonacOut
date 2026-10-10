import { ROUGE_H, NAVY } from "../lib/couleurs";

// MonacOut — LE LOGO, REFAIT LE 10 OCT 2026
//
// Avant : un grand M en Playfair dans un double cadre or + navy, posé sur un fond
// de rayures bleues. Stéphanie a tranché sur maquette, en trois temps :
//   1. « le logo c'est pas du tout cela » — le M et son cadre sont retirés ;
//   2. « ou on enlève les rayures on met juste le nom » — plus de rayures ;
//   3. l'or disparaît partout (3,45:1 sur l'ivoire, sous la norme de lisibilité).
// Il ne reste donc que le NOM : MONAC' en navy, OUT en Rouge H, la signature
// « Monaco Ensemble » en navy atténué, et un trait Rouge H dessous.
//
// ⚠️ La signature n'est plus en bleu #3E7EA8. Ce bleu venait des rayures ; sans
// elles il devenait la seule note froide de l'écran, orpheline.
export default function MonacOutLogo({ width = 220, compact = false, lang = "fr" }) {
  const signature = lang === "en" ? "Monaco Together" : "Monaco Ensemble";
  const t = compact ? 15 : 26;

  return (
    <div style={{ width: compact ? "auto" : width, textAlign: "center", display: "inline-block" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center" }}>
        <span style={{
          fontFamily: "'Josefin Sans', sans-serif",
          fontWeight: 400, fontSize: t, letterSpacing: t * 0.42,
          color: NAVY, textTransform: "uppercase",
        }}>MONAC'</span>
        <span style={{
          fontFamily: "'Josefin Sans', sans-serif",
          fontWeight: 600, fontSize: t, letterSpacing: t * 0.26,
          color: ROUGE_H, textTransform: "uppercase",
        }}>OUT</span>
      </div>
      <div style={{
        fontFamily: "'Josefin Sans', sans-serif",
        fontWeight: 700, fontSize: compact ? 8 : 10, letterSpacing: compact ? 2.2 : 3,
        color: NAVY, textTransform: "uppercase", marginTop: compact ? 2 : 5, opacity: 0.62,
      }}>{signature}</div>
      {!compact && (
        <div style={{ height: 2, background: ROUGE_H, width: 120, margin: "11px auto 0" }} />
      )}
    </div>
  );
}
