const GOLD = "#a88421";
const GOLD_FRAME = "#C9A96E";
const MOIS_ICS = { jan:0,fév:1,mar:2,avr:3,mai:4,juin:5,juil:6,août:7,sep:8,oct:9,nov:10,déc:11 };

const VENUE_PHOTOS = {
  // Grandes salles
  grimaldi:        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Grimaldi_Forum_Monaco_-_photographe_Olivia_Marocco.jpg/960px-Grimaldi_Forum_Monaco_-_photographe_Olivia_Marocco.jpg",
  opera:           "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Casino_de_Montecarlo%2C_M%C3%B3naco%2C_2016-06-23%2C_DD_04.jpg/960px-Casino_de_Montecarlo%2C_M%C3%B3naco%2C_2016-06-23%2C_DD_04.jpg",
  stade:           "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Monaco_Stade_Louis-II_1.jpg/960px-Monaco_Stade_Louis-II_1.jpg",
  ocean:           "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Monaco_BW_2011-06-07_17-50-43.jpg/960px-Monaco_BW_2011-06-07_17-50-43.jpg",
  palais:          "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Princely_Palace_of_Monaco.jpg/960px-Princely_Palace_of_Monaco.jpg",
  cathedrale:      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Monaco_BW_2011-06-07_16-07-20.jpg/960px-Monaco_BW_2011-06-07_16-07-20.jpg",
  tpg:             "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Entr%C3%A9e_du_th%C3%A9%C3%A2tre_Princesse_Grace_et_du_cin%C3%A9ma_des_Beaux-Arts_%28Monaco%29.jpg/960px-Entr%C3%A9e_du_th%C3%A9%C3%A2tre_Princesse_Grace_et_du_cin%C3%A9ma_des_Beaux-Arts_%28Monaco%29.jpg",
  fort_antoine:    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Fort_Antoine_Monaco.JPG/960px-Fort_Antoine_Monaco.JPG",
  sporting:        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Monte_Carlo_Sporting_Club_in_2023.jpg/960px-Monte_Carlo_Sporting_Club_in_2023.jpg",
  collection:      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/La_Collection_de_Voitures_de_S.A.S._le_Prince_de_Monaco_%2851430786795%29.jpg/960px-La_Collection_de_Voitures_de_S.A.S._le_Prince_de_Monaco_%2851430786795%29.jpg",
  // Hôtels
  hotel_paris:     "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/H%C3%B4tel_de_Paris_-_panoramio.jpg/960px-H%C3%B4tel_de_Paris_-_panoramio.jpg",
  hermitage:       "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/H%C3%B4tel_Hermitage_Monte_Carlo_%2860029384%29.jpeg/960px-H%C3%B4tel_Hermitage_Monte_Carlo_%2860029384%29.jpeg",
  fairmont:        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/MONACO_LE_FAIRMONT_HOTEL_5_-_panoramio.jpg/960px-MONACO_LE_FAIRMONT_HOTEL_5_-_panoramio.jpg",
  mcbay:           "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Monte-Carlo_Bay_Hotel_-_panoramio.jpg/960px-Monte-Carlo_Bay_Hotel_-_panoramio.jpg",
  // Monaco-Ville / Rocher
  rocher:          "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/View_on_Monacoville.JPG/960px-View_on_Monacoville.JPG",
  villa_sauber:    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Villa_Sauber_-_panoramio.jpg/960px-Villa_Sauber_-_panoramio.jpg",
  jardins_stmartin:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Jardins_Saint-Martin%2C_Monaco_-_panoramio.jpg/960px-Jardins_Saint-Martin%2C_Monaco_-_panoramio.jpg",
  roseraie:        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Roseraie_Princesse_Grace_-_panoramio.jpg/960px-Roseraie_Princesse_Grace_-_panoramio.jpg",
  // Monte-Carlo place / casino
  casino:          "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Le_casino_de_Monte-Carlo.JPG/960px-Le_casino_de_Monte-Carlo.JPG",
  place_casino:    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Monaco_Place_du_Casino_1.jpg/960px-Monaco_Place_du_Casino_1.jpg",
  // Port & bord de mer
  yacht_club:      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Yacht_Club_de_Monaco_%2851429816991%29.jpg/960px-Yacht_Club_de_Monaco_%2851429816991%29.jpg",
  port:            "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/MonacoView.jpg/960px-MonacoView.jpg",
  larvotto_beach:  "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Plage_du_Larvotto_MONACO_-_panoramio.jpg/960px-Plage_du_Larvotto_MONACO_-_panoramio.jpg",
  country_club:    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Halte_de_Monte-Carlo-Country-Club.JPG/960px-Halte_de_Monte-Carlo-Country-Club.JPG",
  // Fontvieille
  fontvieille:     "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Fontvieille_and_yachts.jpg/960px-Fontvieille_and_yachts.jpg",
  parc_antoinette: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Princess_Antoinette_Park.jpg/960px-Princess_Antoinette_Park.jpg",
  // La Condamine
  condamine:       "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/March%C3%A9_de_la_Condamine_depuis_la_Place_d%27Armes_%28Monaco%29.jpg/960px-March%C3%A9_de_la_Condamine_depuis_la_Place_d%27Armes_%28Monaco%29.jpg",
  // Jardins & parcs
  jardin_exotique: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Jardin_exotique_de_Monaco_D190408_a.jpg/960px-Jardin_exotique_de_Monaco_D190408_a.jpg",
  jardin_japonais: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Jardin_Japonais_de_Monaco_-_panoramio.jpg/960px-Jardin_Japonais_de_Monaco_-_panoramio.jpg",
  // Divers
  odeon:           "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Tour_Od%C3%A9on_Monaco_2022_%28cropped%29.jpg/960px-Tour_Od%C3%A9on_Monaco_2022_%28cropped%29.jpg",
  aerial:          "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Aerial_view_of_Monaco_%2801%29.jpg/960px-Aerial_view_of_Monaco_%2801%29.jpg",
};

function getVenuePhoto(event) {
  const s = (event.subtitle || "").toLowerCase();
  const t = (event.title || "").toLowerCase();
  const c = s + " " + t;

  // Grandes salles — du plus spécifique au plus général
  if (c.includes("grimaldi forum") || c.includes("salle des princes") || c.includes("ravel hall") || c.includes("espace indigo") || c.includes("one monte-carlo") || c.includes("one monte carlo")) return VENUE_PHOTOS.grimaldi;
  if (c.includes("salle garnier") || c.includes("opéra de monte") || c.includes("opera de monte")) return VENUE_PHOTOS.opera;
  if (c.includes("stade louis") || c.includes("gaston médecin") || c.includes("gaston medecin")) return VENUE_PHOTOS.stade;
  if (c.includes("océanographique") || c.includes("oceanographique")) return VENUE_PHOTOS.ocean;
  if (c.includes("palais princier") || c.includes("cour d") || c.includes("place du palais")) return VENUE_PHOTOS.palais;
  if (c.includes("fort antoine")) return VENUE_PHOTOS.fort_antoine;
  if (c.includes("cathédrale") || c.includes("cathedrale") || c.includes("saint-nicolas") || c.includes("sacré-cœur") || c.includes("sacre-coeur") || c.includes("chapelle") || c.includes("paroisse") || c.includes("église") || c.includes("eglise") || c.includes("paroisses") || c.includes("églises")) return VENUE_PHOTOS.cathedrale;
  if (c.includes("collection de voitures")) return VENUE_PHOTOS.collection;
  if (c.includes("parc princesse antoinette")) return VENUE_PHOTOS.parc_antoinette;
  // Théâtre Princesse Grace / Cinéma des Beaux-Arts (même bâtiment) — avant le check "princesse" générique
  if (c.includes("théâtre princesse grace") || c.includes("theatre princesse grace") || c.includes("salle princesse grace") || c.includes("beaux-arts") || c.includes("cinéma des beaux") || c.includes("cinema des beaux")) return VENUE_PHOTOS.tpg;
  // Sporting Monte-Carlo + académies associées (Jimmy'z, Étoiles, Lilly's)
  if (c.includes("sporting monte") || c.includes("salle des étoiles") || c.includes("salle des etoiles") || c.includes("salle du sporting") || c.includes("jimmy") || c.includes("lilly") || c.includes("académie princesse grace") || c.includes("academie princesse grace") || c.includes("académie de danse") || c.includes("academie de danse") || c.includes("mc dance") || c.includes("ballet de monte")) return VENUE_PHOTOS.sporting;
  // Hôtels de luxe
  if (c.includes("hôtel de paris") || c.includes("hotel de paris") || c.includes("bar américain") || c.includes("bar americain") || c.includes("cave du louis") || c.includes("café llorca") || c.includes("cafe llorca") || c.includes("robuchon")) return VENUE_PHOTOS.hotel_paris;
  if (c.includes("hermitage") || c.includes("thermes marins") || c.includes("vistamar")) return VENUE_PHOTOS.hermitage;
  if (c.includes("fairmont") || c.includes("nobu") || c.includes("buddha-bar") || c.includes("buddha bar") || c.includes("horizon rooftop")) return VENUE_PHOTOS.fairmont;
  if (c.includes("monte-carlo bay") || c.includes("monte carlo bay") || c.includes("blue gin") || c.includes("azzurra") || c.includes("clarins") || c.includes("novotel")) return VENUE_PHOTOS.mcbay;
  // Casino et Place du Casino
  if (c.includes("casino de monte") || c.includes("new moods") || c.includes("new mood") || c.includes("bar du casino")) return VENUE_PHOTOS.casino;
  if (c.includes("place du casino") || c.includes("café de paris") || c.includes("cafe de paris") || c.includes("hôtel des ventes") || c.includes("hotel des ventes") || c.includes("sass café") || c.includes("sass cafe") || c.includes("panino club") || c.includes("trinity monaco") || c.includes("amu monte") || c.includes("equivoque") || c.includes("twiga")) return VENUE_PHOTOS.place_casino;
  // Yacht Club avant Port Hercule (plus spécifique)
  if (c.includes("yacht club") || c.includes("wine palace")) return VENUE_PHOTOS.yacht_club;
  // Tour Odéon / Odéon Spa
  if (c.includes("odéon") || c.includes("odeon")) return VENUE_PHOTOS.odeon;
  // Villa Sauber / NMNM
  if (c.includes("villa sauber") || (c.includes("nmnm") && !c.includes("paloma"))) return VENUE_PHOTOS.villa_sauber;
  // Monte-Carlo Country Club
  if (c.includes("country club")) return VENUE_PHOTOS.country_club;
  // Jardins Saint-Martin (spécifique avant Monaco-Ville générique)
  if (c.includes("jardins saint-martin") || c.includes("jardins saint martin")) return VENUE_PHOTOS.jardins_stmartin;
  // Roseraie
  if (c.includes("roseraie")) return VENUE_PHOTOS.roseraie;
  // Jardin Exotique
  if (c.includes("jardin exotique")) return VENUE_PHOTOS.jardin_exotique;
  // Jardin Japonais
  if (c.includes("jardin japonais")) return VENUE_PHOTOS.jardin_japonais;
  // Monaco-Ville / Rocher (générique)
  if (c.includes("monaco-ville") || c.includes("rocher") || c.includes("place de la visitation") || c.includes("jardins de la petite") || c.includes("pavillon bosio") || c.includes("le petit bar") || c.includes("monaco tours") || c.includes("villa paloma") || c.includes("fondation prince pierre")) return VENUE_PHOTOS.rocher;
  // Port Hercule et bord de mer (avant check larvotto)
  if (c.includes("port hercule") || c.includes("quai des artistes") || c.includes("digue du port") || c.includes("au marius") || c.includes("caffè milano") || c.includes("caffe milano") || c.includes("jack monaco") || c.includes("monaco brewery") || c.includes("rascasse") || c.includes("ship & castle") || c.includes("ship and castle") || c.includes("slammers") || c.includes("marlow") || c.includes("mareterra") || c.includes("quai albert") || c.includes("port de monaco") || c.includes("amber lounge") || c.includes("aritual")) return VENUE_PHOTOS.port;
  // Larvotto / plages (Note Bleue, Méridien, Nikki Beach, clubs de sport)
  if (c.includes("larvotto") || c.includes("note bleue") || c.includes("nikki beach") || c.includes("méridien beach") || c.includes("meridien beach") || c.includes("sea club") || c.includes("yoga monte") || c.includes("monaco wellness") || c.includes("plage du") || c.includes("la môme") || c.includes("la mome")) return VENUE_PHOTOS.larvotto_beach;
  // Fontvieille (générique — après les plus spécifiques)
  if (c.includes("fontvieille") || c.includes("léo ferré") || c.includes("leo ferre") || c.includes("espace léo") || c.includes("salle léo") || c.includes("chapiteau") || c.includes("terrasses de") || c.includes("jenna lifestyle") || c.includes("brasserie de monaco") || c.includes("cercle bouliste")) return VENUE_PHOTOS.fontvieille;
  // La Condamine / Marché
  if (c.includes("condamine") || c.includes("woo monaco") || c.includes("gran caffè") || c.includes("gran caffe") || c.includes("limùn") || c.includes("limun") || c.includes("mairie de monaco") || c.includes("médiathèque") || c.includes("mediatheque") || c.includes("théâtre des muses") || c.includes("theatre des muses") || c.includes("u tapu") || c.includes("auditorium rainier") || c.includes("académie de musique") || c.includes("academie de musique")) return VENUE_PHOTOS.condamine;
  // Circuit F1 / Formule
  if (c.includes("circuit") || c.includes("formule")) return VENUE_PHOTOS.aerial;
  // Fallback : vue aérienne Monaco
  return VENUE_PHOTOS.aerial;
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
const GREY = "#4f4b4b";
const WHITE = "#FFFFFF";
const CREAM = "#FDFAF5";

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
      borderRadius: 2,
      padding: 4,
      marginBottom: 14,
      background: WHITE,
    }}>
      {/* Inner navy frame */}
      <div style={{ border: `1.5px solid ${NAVY}`, borderRadius: 1, background: CREAM }}>

        <div style={{ padding: "18px 22px 20px", textAlign: "center" }}>

          {/* Catégorie */}
          <div style={{
            fontFamily: "'Josefin Sans', sans-serif",
            fontSize: 11, fontWeight: 600, letterSpacing: 3,
            textTransform: "uppercase", color: GOLD,
            marginBottom: 10,
          }}>{event.cat}</div>

          {/* Date + heure */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 14,
          }}>
            <span style={{
              fontFamily: "'Lato', sans-serif",
              fontSize: 13, fontWeight: 700, letterSpacing: 1.2,
              textTransform: "uppercase", color: GREY,
            }}>{dateLabel}{!isToday && ` ${event.year || 2026}`}</span>
            {event.time && (
              <>
                <span style={{ color: GOLD_FRAME, fontSize: 13 }}>·</span>
                <span style={{
                  fontFamily: "'Lato', sans-serif",
                  fontSize: 13, fontWeight: 400, color: GREY,
                }}>{event.time}</span>
              </>
            )}
          </div>

          {/* Titre */}
          <div style={{
            fontFamily: "'Josefin Sans', Georgia, sans-serif",
            fontWeight: 400, fontSize: 26, letterSpacing: 0.3,
            color: "#000000", lineHeight: 1.25, marginBottom: 14,
          }}>{event.title.replace(/\n/g, " ")}</div>

          {/* Lieu */}
          {event.subtitle && (
            <div style={{
              fontFamily: "'Lato', sans-serif",
              fontSize: 16, fontWeight: 400, fontStyle: "italic",
              color: NAVY, marginBottom: 18, letterSpacing: 0.2,
            }}>{event.subtitle}</div>
          )}

          {/* Organisation (fondations) */}
          {/fondation|fdtn|fight aids|croix.rouge|amade|association|mission enfance|anges gardiens|amapei|jewish|caritas|jcc/i.test(event.source || "") && (
            <div style={{
              fontFamily: "'Josefin Sans', sans-serif", fontWeight: 600,
              fontSize: 10, letterSpacing: 2, textTransform: "uppercase",
              color: GOLD, marginBottom: 12,
            }}>{event.source}</div>
          )}

          {/* Entrée libre */}
          {event.free && (
            <div style={{ marginBottom: 14 }}>
              <span style={{
                border: "1px solid #2A6A3A", padding: "3px 14px",
                fontFamily: "'Josefin Sans', sans-serif",
                fontSize: 10, fontWeight: 600, letterSpacing: 2,
                textTransform: "uppercase", color: "#1A4A2A",
              }}>{lang === "en" ? "FREE ENTRY" : "ENTRÉE LIBRE"}</span>
            </div>
          )}

          {/* Bas de carte : lien + favori */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
            {event.link ? (
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                style={{
                  fontFamily: "'Josefin Sans', sans-serif",
                  fontSize: 11, fontWeight: 600, letterSpacing: 2,
                  textTransform: "uppercase", color: "#000000",
                  borderBottom: `1px solid ${GOLD}`,
                  paddingBottom: 1,
                  textDecoration: "none",
                }}
              >{event.free ? (lang === "en" ? "More info" : "Plus d'infos") : (lang === "en" ? "Book →" : "Réserver →")}</a>
            ) : (
              event.phone ? (
                <a
                  href={`tel:${event.phone}`}
                  onClick={e => e.stopPropagation()}
                  style={{
                    fontFamily: "'Lato', sans-serif",
                    fontSize: 16, color: GOLD,
                    textDecoration: "none", letterSpacing: 0.3,
                  }}
                >{event.phone}</a>
              ) : <span />
            )}
            <button
              onClick={e => { e.stopPropagation(); onToggleFav(event.id); }}
              style={{
                background: "none", border: "none",
                cursor: "pointer", fontSize: 20, lineHeight: 1, padding: 0,
              }}
            >{isFav ? "❤️" : "🤍"}</button>
          </div>

          {/* Téléphone (si lien ET téléphone) */}
          {event.phone && event.link && (
            <a
              href={`tel:${event.phone}`}
              onClick={e => e.stopPropagation()}
              style={{
                fontFamily: "'Lato', sans-serif",
                fontSize: 13, color: GOLD,
                textDecoration: "none", letterSpacing: 0.3,
                display: "block", marginTop: 6,
              }}
            >{event.phone}</a>
          )}
        </div>
      </div>
    </div>
  );
}
