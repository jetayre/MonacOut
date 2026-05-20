const GOLD = "#C4A241";
const GOLD_FRAME = "#C9A96E";
const MOIS_ICS = { jan:0,fév:1,mar:2,avr:3,mai:4,juin:5,juil:6,août:7,sep:8,oct:9,nov:10,déc:11 };

const VENUE_PHOTOS = {
  grimaldi:     "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Grimaldi_Forum_Monaco_-_photographe_Olivia_Marocco.jpg/800px-Grimaldi_Forum_Monaco_-_photographe_Olivia_Marocco.jpg",
  opera:        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Casino_de_Montecarlo%2C_M%C3%B3naco%2C_2016-06-23%2C_DD_04.jpg/800px-Casino_de_Montecarlo%2C_M%C3%B3naco%2C_2016-06-23%2C_DD_04.jpg",
  stade:        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Panoramio_-_V%26A_Dudush_-_stade_Louis_II.jpg/800px-Panoramio_-_V%26A_Dudush_-_stade_Louis_II.jpg",
  ocean:        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Monaco_BW_2011-06-07_17-50-43.jpg/800px-Monaco_BW_2011-06-07_17-50-43.jpg",
  palais:       "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Princely_Palace_of_Monaco.jpg/800px-Princely_Palace_of_Monaco.jpg",
  cathedrale:   "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Monaco_BW_2011-06-07_16-07-20.jpg/800px-Monaco_BW_2011-06-07_16-07-20.jpg",
  tpg:          "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Entr%C3%A9e_du_th%C3%A9%C3%A2tre_Princesse_Grace_et_du_cin%C3%A9ma_des_Beaux-Arts_%28Monaco%29.jpg/800px-Entr%C3%A9e_du_th%C3%A9%C3%A2tre_Princesse_Grace_et_du_cin%C3%A9ma_des_Beaux-Arts_%28Monaco%29.jpg",
  casino:       "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Le_casino_de_Monte-Carlo.JPG/800px-Le_casino_de_Monte-Carlo.JPG",
  fontvieille:  "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Fontvieille_and_yachts.jpg/800px-Fontvieille_and_yachts.jpg",
  port:         "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/MonacoView.jpg/800px-MonacoView.jpg",
  rocher:       "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/View_on_Monacoville.JPG/800px-View_on_Monacoville.JPG",
  aerial:       "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Aerial_view_of_Monaco_%2801%29.jpg/800px-Aerial_view_of_Monaco_%2801%29.jpg",
};

function getVenuePhoto(event) {
  const s = (event.subtitle || "").toLowerCase();
  const t = (event.title || "").toLowerCase();
  const combined = s + " " + t;
  if (combined.includes("grimaldi forum")) return VENUE_PHOTOS.grimaldi;
  if (combined.includes("salle garnier") || combined.includes("opéra") || combined.includes("opera de")) return VENUE_PHOTOS.opera;
  if (combined.includes("stade louis") || combined.includes("gaston médecin") || combined.includes("gaston medecin")) return VENUE_PHOTOS.stade;
  if (combined.includes("océanographique") || combined.includes("oceanographique")) return VENUE_PHOTOS.ocean;
  if (combined.includes("palais princier") || combined.includes("cour d'honneur")) return VENUE_PHOTOS.palais;
  if (combined.includes("cathédrale") || combined.includes("cathedrale") || combined.includes("saint-nicolas") || combined.includes("saint nicolas")) return VENUE_PHOTOS.cathedrale;
  if (combined.includes("princesse grace") || combined.includes("beaux-arts") || combined.includes("beaux arts")) return VENUE_PHOTOS.tpg;
  if (combined.includes("casino") && !combined.includes("casino café")) return VENUE_PHOTOS.casino;
  if (combined.includes("fontvieille") || combined.includes("léo ferré") || combined.includes("leo ferre") || combined.includes("espace léo")) return VENUE_PHOTOS.fontvieille;
  if (combined.includes("monaco-ville") || combined.includes("fort antoine") || combined.includes("rocher")) return VENUE_PHOTOS.rocher;
  if (combined.includes("port hercule") || combined.includes("yacht club") || combined.includes("larvotto") || combined.includes("note bleue") || combined.includes("nikki beach") || combined.includes("port de monaco")) return VENUE_PHOTOS.port;
  if (combined.includes("circuit") || combined.includes("formule")) return VENUE_PHOTOS.aerial;
  return null;
}

function generateICS(event) {
  const parts = event.date.trim().split(" ");
  const day = parseInt(parts[1]);
  const month = MOIS_ICS[parts[2]];
  const year = event.year || 2026;
  const tm = (event.time || '').replace(/\s/g,'').match(/^(\d{1,2})h(\d{2})?/);
  const h = tm ? parseInt(tm[1]) : 20;
  const m = tm && tm[2] ? parseInt(tm[2]) : 0;
  const p = n => String(n).padStart(2,'0');
  const dt  = `${year}${p(month+1)}${p(day)}T${p(h)}${p(m)}00`;
  const dt2 = `${year}${p(month+1)}${p(day)}T${p(Math.min(h+2,23))}${p(m)}00`;
  return [
    'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//MonacOut//FR',
    'BEGIN:VEVENT',
    `DTSTART:${dt}`,`DTEND:${dt2}`,
    `SUMMARY:${event.title.replace(/\n/g,' ')}`,
    `LOCATION:${event.subtitle||''}`,
    event.link ? `URL:${event.link}` : null,
    `DESCRIPTION:${(event.desc||'').replace(/\n/g,'\\n')}`,
    'END:VEVENT','END:VCALENDAR',
  ].filter(Boolean).join('\r\n');
}

const NAVY = "#0F1D3A";
const GREY = "#6A7080";
const WHITE = "#FDFAF5";

const DEFAULT_FALLBACK = "linear-gradient(150deg, #0F1D3A 0%, #1A3A6A 100%)";

const JOURS = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];
const MOIS = ["jan","fév","mar","avr","mai","juin","juil","août","sep","oct","nov","déc"];

function todayFrDate() {
  const d = new Date();
  return `${JOURS[d.getDay()]} ${d.getDate()} ${MOIS[d.getMonth()]}`;
}

export default function EventCard({ event, favorites, onToggleFav, onCategoryClick, lang = "fr" }) {
  const isFav = favorites?.includes(event.id);
  const isToday = event.date === todayFrDate() && (event.year || 2026) === new Date().getFullYear();
  const dateLabel = isToday
    ? (lang === "en" ? "Today" : "Aujourd'hui")
    : event.date;

  return (
    <div style={{
      border: `1.5px solid ${GOLD_FRAME}`,
      borderRadius: 4,
      padding: 4,
      marginBottom: 14,
      boxShadow: "0 6px 24px rgba(15,29,58,0.15)",
      background: WHITE,
    }}>
      {/* Inner navy frame */}
      <div style={{ border: `2px solid ${NAVY}`, borderRadius: 2, overflow: "hidden" }}>

        {/* Photo du lieu */}
        <div style={{ position: "relative", height: 140, overflow: "hidden" }}>
          {/* Gradient de base (toujours visible en arrière-plan) */}
          <div style={{
            position: "absolute", inset: 0,
            background: event.fallback || DEFAULT_FALLBACK,
          }} />
          {/* Photo du lieu */}
          {getVenuePhoto(event) && (
            <img
              src={getVenuePhoto(event)}
              alt=""
              loading="lazy"
              style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%",
                objectFit: "cover",
                display: "block",
              }}
              onError={e => { e.currentTarget.style.opacity = "0"; }}
            />
          )}
          {/* Overlay sombre pour lisibilité */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.52) 100%)",
          }} />
          {/* Emoji + catégorie centrés */}
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 4,
          }}>
            <span style={{ fontSize: 36, filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.4))", lineHeight: 1 }}>
              {event.emoji || "✦"}
            </span>
            <span style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 9, fontWeight: 700, letterSpacing: 1.8,
              textTransform: "uppercase", color: "rgba(255,255,255,0.8)",
            }}>{event.cat}</span>
          </div>
          {/* Bouton favori */}
          <button
            onClick={e => { e.stopPropagation(); onToggleFav(event.id); }}
            style={{
              position: "absolute", top: 8, right: 8,
              background: "rgba(0,0,0,0.28)", border: "none",
              borderRadius: 20, padding: "4px 8px",
              cursor: "pointer", fontSize: 14, lineHeight: 1,
            }}
          >{isFav ? "❤️" : "🤍"}</button>
        </div>

        {/* Corps de la carte — tout centré */}
        <div style={{ padding: "14px 16px 16px", textAlign: "center", background: WHITE }}>

          {/* Date + heure */}
          <div style={{ marginBottom: 4 }}>
            <span style={{
              fontFamily: "'Jost', -apple-system, sans-serif",
              fontSize: 16, fontWeight: 700, letterSpacing: 0.8,
              textTransform: "uppercase", color: NAVY,
            }}>{dateLabel}{!isToday && ` ${event.year || 2026}`}</span>
            {event.time && (
              <span style={{
                fontFamily: "'Jost', -apple-system, sans-serif",
                fontSize: 13, color: GREY, marginLeft: 6,
              }}>{event.time}</span>
            )}
          </div>

          {/* Titre */}
          <div style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 600, fontSize: 22, letterSpacing: 0.6,
            color: NAVY, lineHeight: 1.2, marginBottom: 5,
          }}>{event.title.replace(/\n/g, " ")}</div>

          {/* Organisation (fondations) */}
          {/fondation|fdtn|fight aids|croix.rouge|amade|association|mission enfance|anges gardiens|amapei|jewish|caritas|jcc/i.test(event.source || "") && (
            <div style={{
              fontFamily: "'Jost', sans-serif", fontWeight: 700,
              fontSize: 9, letterSpacing: 1.4, textTransform: "uppercase",
              color: GOLD, marginBottom: 4,
            }}>{event.source}</div>
          )}

          {/* Lieu */}
          {event.subtitle && (
            <div style={{
              fontFamily: "'Jost', -apple-system, sans-serif",
              fontSize: 12, fontWeight: 500, color: GREY, marginBottom: 12,
            }}>{event.subtitle}</div>
          )}

          {/* Entrée libre */}
          {event.free && (
            <div style={{ marginBottom: 10 }}>
              <span style={{
                border: "1px solid #2A6A3A", borderRadius: 20, padding: "2px 12px",
                fontFamily: "'Jost', sans-serif",
                fontSize: 10, fontWeight: 700, letterSpacing: 1, color: "#1A4A2A",
              }}>{lang === "en" ? "FREE ENTRY" : "ENTRÉE LIBRE"}</span>
            </div>
          )}

          {/* Lien */}
          {event.link && (
            <div style={{ marginBottom: event.phone ? 8 : 0 }}>
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 11, fontWeight: 700, letterSpacing: 1.1,
                  textTransform: "uppercase", color: NAVY,
                  border: `1px solid ${GOLD}`,
                  padding: "6px 18px", borderRadius: 20,
                  textDecoration: "none", display: "inline-block",
                }}
              >{event.free ? (lang === "en" ? "More info" : "Plus d'infos") : "Let's go"}</a>
            </div>
          )}

          {/* Téléphone */}
          {event.phone && (
            <a
              href={`tel:${event.phone}`}
              onClick={e => e.stopPropagation()}
              style={{
                fontFamily: "'Jost', sans-serif",
                fontWeight: 600, fontSize: 12,
                color: GOLD, textDecoration: "none", letterSpacing: 0.3, display: "block",
              }}
            >{event.phone}</a>
          )}
        </div>
      </div>
    </div>
  );
}
