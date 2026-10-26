/**
 * La vue de réservation : la page du lieu, affichée DANS Monac'Out.
 *
 * Stéphanie, 26 oct 2026 : « en ouvrant une vue dans l'app de leur système ».
 * On ne quitte donc jamais l'app — voir src/lib/reservation.js pour pourquoi un
 * lien classique est exclu (écran noir iPhone) et pourquoi le plugin natif
 * n'est pas disponible (il demanderait une build App Store).
 *
 * ⚠️ UN CADRE REFUSÉ RESTE BLANC, SANS ERREUR. On ne peut pas le détecter ici.
 * La protection est en amont, dans les données : `resa` n'existe que pour une
 * page vérifiée cadrable. Mais on laisse quand même une porte de sortie visible
 * — « Ça ne s'affiche pas ? » — pour qui tomberait malgré tout sur du blanc.
 */
import { useEffect, useState } from "react";

export default function VueReservation({ url, titre, lang, onFermer }) {
  const [charge, setCharge] = useState(false);

  // La touche Échap et le bouton retour d'Android ferment la vue.
  useEffect(() => {
    const auClavier = (e) => { if (e.key === "Escape") onFermer(); };
    window.addEventListener("keydown", auClavier);
    return () => window.removeEventListener("keydown", auClavier);
  }, [onFermer]);

  // Tant que la vue est ouverte, le fil derrière ne défile pas.
  useEffect(() => {
    const avant = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = avant; };
  }, []);

  if (!url) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed", inset: 0, zIndex: 9000,
        background: "#FFFDF8", display: "flex", flexDirection: "column",
      }}
    >
      {/* Barre du haut : on sait toujours où l'on est et comment revenir. */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "calc(env(safe-area-inset-top, 0px) + 12px) 16px 12px",
        borderBottom: "1px solid #E8E0D4", background: "#FFFDF8", flexShrink: 0,
      }}>
        <button
          onClick={onFermer}
          aria-label={lang === "en" ? "Close" : "Fermer"}
          style={{
            border: "none", background: "#7B2D26", color: "#fff",
            width: 34, height: 34, borderRadius: 17, fontSize: 19,
            lineHeight: 1, cursor: "pointer", flexShrink: 0, fontWeight: 700,
          }}
        >×</button>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontFamily: "'Lato', sans-serif", fontSize: 11, fontWeight: 700,
            letterSpacing: ".08em", color: "#7B2D26", textTransform: "uppercase",
          }}>{lang === "en" ? "Booking" : "Réservation"}</div>
          <div style={{
            fontFamily: "'Lato', sans-serif", fontSize: 14, fontWeight: 700,
            color: "#2A2520", overflow: "hidden", textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>{titre}</div>
        </div>
      </div>

      <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
        {!charge && (
          <div style={{
            position: "absolute", inset: 0, display: "flex",
            alignItems: "center", justifyContent: "center",
            fontFamily: "'Lato', sans-serif", fontSize: 14, color: "#8A8378",
          }}>{lang === "en" ? "Loading…" : "Chargement…"}</div>
        )}
        <iframe
          src={url}
          title={lang === "en" ? "Booking" : "Réservation"}
          onLoad={() => setCharge(true)}
          style={{ width: "100%", height: "100%", border: "none", display: "block" }}
        />
      </div>

      {/* La réservation se fait chez le lieu, pas chez nous : il faut le dire. */}
      <div style={{
        padding: "10px 16px calc(env(safe-area-inset-bottom, 0px) + 10px)",
        borderTop: "1px solid #E8E0D4", background: "#FFFDF8", flexShrink: 0,
        fontFamily: "'Lato', sans-serif", fontSize: 11.5, color: "#8A8378",
        textAlign: "center", lineHeight: 1.5,
      }}>
        {lang === "en"
          ? "Booking is handled by the venue's own system. Monac'Out does not take the booking."
          : "La réservation est faite par le système du lieu. Monac'Out ne réserve pas à votre place."}
      </div>
    </div>
  );
}
