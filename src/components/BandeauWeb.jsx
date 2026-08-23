import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { track } from "../lib/track";

// ── BANDEAU DU SITE — « Regarde où vont tes amis ce soir. » ────────────────────
//
// Il ne s'affiche QUE sur le site, jamais dans l'app installée : c'est un lien
// sortant, et un lien sortant dans l'app native produit l'écran noir du 7 août.
//
// Pourquoi il est PERMANENT, sans délai ni compteur. Relevé du 22 août 2026 :
// 53 visiteurs iPhone du site en 30 jours, 31 sont restés plus de 8 secondes,
// et seulement 3 ont vu la proposition d'installer l'app. La carte existante
// attend 8 s ET que l'écran de bienvenue soit passé — les deux conditions se
// cumulaient et personne n'arrivait au bout. Ici : rien à attendre.
//
// La croix ne mémorise rien volontairement : elle referme le bandeau pour la
// visite en cours et il revient à la suivante. On propose, on n'enferme personne.

const NAVY = "#0F1D3A";
const GOLD_FRAME = "#C9A96E";
const IVORY = "#FFFDF7";
const GREY = "#6A7080";
const SLATE = "#4A5568";

// ⚠️ LIEN SUIVI, pas le lien App Store direct. `/site` est réécrit vers
// public/go.html par vercel.json : la page enregistre le canal (événement
// `lien_suivi`, canal « site ») PUIS redirige vers l'App Store. Une redirection
// n'exécute aucun code et ne compterait rien. Voir le journal du 7 août 2026.
const LIEN_SUIVI = "/site";

// QR de la fiche App Store (id6774785049), tracé en dur pour rester hors ligne
// et sans dépendance. Regénérable : node -e "require('qrcode').toString(URL,…)".
const QR_D = "M0 0.5h7m1 0h1m1 0h1m1 0h1m5 0h4m1 0h1m2 0h7M0 1.5h1m5 0h1m1 0h2m1 0h1m2 0h1m2 0h1m3 0h3m2 0h1m5 0h1M0 2.5h1m1 0h3m1 0h1m2 0h2m2 0h2m1 0h1m1 0h1m1 0h2m1 0h2m1 0h1m1 0h3m1 0h1M0 3.5h1m1 0h3m1 0h1m1 0h1m2 0h1m3 0h1m2 0h2m1 0h1m1 0h1m2 0h1m1 0h3m1 0h1M0 4.5h1m1 0h3m1 0h1m3 0h1m2 0h1m2 0h1m1 0h1m3 0h1m1 0h1m1 0h1m1 0h3m1 0h1M0 5.5h1m5 0h1m2 0h1m1 0h1m2 0h3m1 0h1m3 0h1m1 0h1m1 0h1m5 0h1M0 6.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M8 7.5h1m3 0h1m2 0h5m2 0h3M0 8.5h1m1 0h2m1 0h3m2 0h1m1 0h1m1 0h2m1 0h1m3 0h1m4 0h1m2 0h1m1 0h2M4 9.5h1m2 0h2m1 0h2m1 0h1m2 0h5m1 0h3m1 0h2m1 0h2m1 0h1M0 10.5h1m1 0h2m2 0h4m1 0h3m4 0h1m2 0h5m1 0h3m1 0h2M1 11.5h1m2 0h1m7 0h1m3 0h2m3 0h1m1 0h1m2 0h2m1 0h1m1 0h2M0 12.5h1m3 0h4m1 0h1m1 0h1m2 0h3m3 0h2m2 0h2m1 0h3m1 0h2M1 13.5h4m2 0h1m2 0h1m2 0h2m5 0h1m8 0h1m1 0h1M1 14.5h4m1 0h4m2 0h2m3 0h4m1 0h2m2 0h1m1 0h2M0 15.5h1m3 0h2m1 0h2m6 0h1m5 0h1m1 0h4m2 0h2M0 16.5h2m3 0h2m5 0h2m2 0h1m1 0h1m1 0h3m1 0h3m1 0h3M3 17.5h1m1 0h1m1 0h2m2 0h2m2 0h1m4 0h2m1 0h4m1 0h2m1 0h2M1 18.5h6m1 0h1m2 0h2m2 0h2m1 0h1m2 0h1m2 0h1m1 0h3m1 0h2M0 19.5h2m1 0h1m3 0h1m2 0h2m2 0h1m2 0h3m2 0h2m1 0h2m1 0h1m2 0h1M0 20.5h3m1 0h1m1 0h1m2 0h3m2 0h1m1 0h1m5 0h1m4 0h1m1 0h2m1 0h1M0 21.5h1m1 0h2m3 0h2m2 0h1m2 0h3m3 0h2m1 0h2m1 0h1m3 0h1m1 0h1M2 22.5h3m1 0h3m3 0h1m1 0h2m2 0h3m2 0h1m2 0h2m2 0h3M1 23.5h1m3 0h1m2 0h1m1 0h4m1 0h1m4 0h1m1 0h1m4 0h3M0 24.5h1m1 0h1m3 0h2m3 0h1m2 0h1m2 0h1m1 0h1m2 0h1m1 0h5m3 0h1M8 25.5h2m5 0h2m1 0h4m2 0h1m3 0h2M0 26.5h7m1 0h1m4 0h2m2 0h5m1 0h2m1 0h1m1 0h1M0 27.5h1m5 0h1m1 0h2m3 0h2m1 0h3m1 0h1m2 0h2m3 0h4M0 28.5h1m1 0h3m1 0h1m2 0h1m1 0h8m3 0h7m1 0h2M0 29.5h1m1 0h3m1 0h1m1 0h2m6 0h1m2 0h1m1 0h2m4 0h1m1 0h4M0 30.5h1m1 0h3m1 0h1m1 0h3m3 0h5m1 0h3m1 0h4m1 0h1M0 31.5h1m5 0h1m4 0h1m2 0h1m2 0h1m2 0h1m4 0h4m3 0h1M0 32.5h7m1 0h4m1 0h1m2 0h2m1 0h1m1 0h1m3 0h1m2 0h3";

function QrAppStore({ taille = 46 }) {
  return (
    <svg width={taille} height={taille} viewBox="0 0 33 33" shapeRendering="crispEdges"
         role="img" aria-label="QR code vers l'App Store">
      <path fill={IVORY} d="M0 0h33v33H0z" />
      <path stroke={NAVY} d={QR_D} />
    </svg>
  );
}

export default function BandeauWeb({ lang = "fr" }) {
  const [ferme, setFerme] = useState(false);
  const natif = Capacitor.isNativePlatform();
  const ua = typeof navigator === "undefined" ? "" : (navigator.userAgent || "");
  const iOS = /iPhone|iPad|iPod/i.test(ua);
  // ⚠️ Android EXCLU tant que l'app Android n'est pas publiée : envoyer quelqu'un
  // vers l'App Store d'Apple depuis un Android ne mène nulle part.
  const android = /Android/i.test(ua);
  const visible = !natif && !ferme && !android;

  useEffect(() => {
    if (visible) track("bandeau_web_vu", { support: iOS ? "iphone" : "bureau" });
  }, [visible, iOS]);

  if (!visible) return null;

  const titre = lang === "en"
    ? "See where your friends are going tonight."
    : "Regarde où vont tes amis ce soir.";
  const sousTitre = iOS
    ? (lang === "en" ? "The Monac'Out app · free" : "L'app Monac'Out · gratuite")
    : (lang === "en" ? "Scan the code to install the app — free" : "Scanne le code pour installer l'app — gratuite");

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 5000,
      background: IVORY,
      borderBottom: `1px solid ${GOLD_FRAME}`,
      boxShadow: "0 1px 8px rgba(15,29,58,0.06)",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 14,
      padding: "9px 16px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", maxWidth: 620 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "Georgia, 'Playfair Display', serif", fontWeight: 700,
            fontSize: 15, color: NAVY, lineHeight: 1.25,
          }}>{titre}</div>
          <div style={{
            fontFamily: "'Lato', sans-serif", fontSize: 11.5, color: GREY,
            lineHeight: 1.35, marginTop: 2,
          }}>{sousTitre}</div>
        </div>

        {iOS ? (
          <a href={LIEN_SUIVI}
             onClick={() => track("bandeau_web_clic", { support: "iphone" })}
             style={{
               flexShrink: 0, background: NAVY, color: "#fff", textDecoration: "none",
               fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, fontWeight: 600,
               letterSpacing: 1.4, textTransform: "uppercase",
               padding: "9px 14px", borderRadius: 3, whiteSpace: "nowrap",
             }}>
            {lang === "en" ? "Get it" : "Installer"}
          </a>
        ) : (
          <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 8 }}>
            <QrAppStore />
            <div style={{
              fontFamily: "'Lato', sans-serif", fontSize: 10.5, color: SLATE,
              lineHeight: 1.35, maxWidth: 88,
            }}>{lang === "en" ? "Scan with your iPhone" : "Scanne avec ton iPhone"}</div>
          </div>
        )}

        <button onClick={() => { setFerme(true); track("bandeau_web_ferme"); }}
                aria-label={lang === "en" ? "Close" : "Fermer"}
                style={{
                  flexShrink: 0, background: "none", border: "none", cursor: "pointer",
                  color: "#B8BEC6", fontSize: 18, lineHeight: 1, padding: 4,
                }}>✕</button>
      </div>
    </div>
  );
}
