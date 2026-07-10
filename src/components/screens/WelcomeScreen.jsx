const NAVY = "#0F1D3A";
const GOLD = "#C4A241";
const GOLD_FRAME = "#C9A96E";
const BLUE = "#9FC3DC";

// Écran d'accueil au 1er lancement. Invite à se connecter, SANS jamais forcer :
// « Explorer sans compte » laisse entrer librement.
export default function WelcomeScreen({ onLogin, onExplore, lang = "fr" }) {
  return (
    <div style={overlay}>
      <div style={card}>
        <div style={inner}>
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 58, color: NAVY, lineHeight: 1 }}>M</div>
          <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 13, letterSpacing: 6, color: NAVY, marginTop: 6, textTransform: "uppercase" }}>
            MONAC'<span style={{ color: GOLD }}>OUT</span>
          </div>
          <div style={{ height: 1, background: GOLD_FRAME, width: 44, margin: "22px auto" }} />
          <div style={title}>{lang === "en" ? "Welcome to Monac'Out" : "Bienvenue sur Monac'Out"}</div>
          <div style={sub}>
            {lang === "en"
              ? "See which friends are going to the same outings — and share yours. Or simply browse what's on in Monaco."
              : "Vois quels amis vont aux mêmes sorties — et partage les tiennes. Ou explore simplement ce qui se passe à Monaco."}
          </div>
          <button onClick={onLogin} style={btnPrimary}>
            {lang === "en" ? "Sign in / Sign up" : "Se connecter / S'inscrire"}
          </button>
          <button onClick={onExplore} style={btnGhost}>
            {lang === "en" ? "Browse without an account" : "Explorer sans compte"}
          </button>
          <div style={note}>
            {lang === "en" ? "By email — no password. No obligation." : "Par email — pas de mot de passe. Sans obligation."}
          </div>
        </div>
      </div>
    </div>
  );
}

const overlay = {
  position: "absolute", inset: 0, zIndex: 800,
  background: "rgba(15,29,58,0.55)",
  display: "flex", alignItems: "center", justifyContent: "center", padding: 18,
};
const card = { width: 310, border: `1.5px solid ${GOLD_FRAME}`, borderRadius: 2, padding: 4, background: "#fff" };
const inner = { border: `1.5px solid ${BLUE}`, borderRadius: 1, padding: "32px 26px 24px", textAlign: "center" };
const title = { fontFamily: "'Josefin Sans', sans-serif", fontSize: 19, fontWeight: 600, color: NAVY, letterSpacing: 0.5, marginBottom: 10 };
const sub = { fontFamily: "'Lato', sans-serif", fontSize: 13.5, color: "#555", lineHeight: 1.55, marginBottom: 24 };
const btnPrimary = {
  width: "100%", padding: "13px 0", background: NAVY, color: "#fff", border: "none", borderRadius: 2, cursor: "pointer",
  fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10,
};
const btnGhost = {
  width: "100%", padding: "11px 0", background: "none", color: NAVY, border: `1px solid ${GOLD_FRAME}`, borderRadius: 2, cursor: "pointer",
  fontFamily: "'Josefin Sans', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase",
};
const note = { fontFamily: "'Lato', sans-serif", fontSize: 11, color: "#999", marginTop: 14 };
