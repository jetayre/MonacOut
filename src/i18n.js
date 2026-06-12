export const T = {
  fr: {
    tagline: "Monaco Secret",
    filters: {
      today: "Aujourd'hui", week: "Semaine", weekend: "Week-end", calendar: "Calendrier", gratuit: "Gratuit", sport: "⚽ Sport",
      culture: "🎭 Culture", music: "🎵 Musique", cinema: "🎬 Cinéma",
      famille: "👨‍👩‍👧 Famille", ateliers: "🎨 Ateliers", bienetre: "🧘 Bien-être",
      foody: "🍽️ Foody", encheres: "🔨 Enchères", agenda: "Agenda",
    },
    empty: "Aucun événement pour cette période.",
    free: "✅ ENTRÉE LIBRE",
    calTitle: "Agenda", reset: "Réinit.",
    seeEvents: "Voir les événements →", selectDate: "Sélectionnez une date",
    fromTo: (s, e) => `Du ${s} au ${e}`,
    since: (s) => `À partir du ${s}`,
    nav: { events: "MC Events", agenda: "My Agenda" },
    months: ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"],
    days: ["L","M","M","J","V","S","D"],
    cofounder: "Co-fondatrice",
    quote: "Monaco est une scène permanente. Nous voulions que chacun puisse en être acteur.",
    story: "Stéphanie et Agathe partagent une conviction commune : Monaco regorge d'événements exceptionnels, et chaque résident mérite d'en profiter pleinement. MonacOut est née de cette envie de rassembler, en un seul endroit, toute la richesse culturelle et sportive de la Principauté.",
    conviction: "\"La richesse culturelle de Monaco appartient à tous ses résidents.\"",
    statement: "Tout Monaco, dans votre poche.",
    sources: "Sources officielles", eventsPerWeek: "Événements/semaine", madeWith: "Fait avec amour",
    profileSub: "À propos de MonacOut",
    noEvents: "Aucun événement.", favEmpty: "Aucun favori pour l'instant.",
  },
  en: {
    tagline: "Monaco Secret",
    filters: {
      today: "Today", week: "Week", weekend: "Weekend", calendar: "Calendar", gratuit: "Free", sport: "⚽ Sport",
      culture: "🎭 Culture", music: "🎵 Music", cinema: "🎬 Cinema",
      famille: "👨‍👩‍👧 Family", ateliers: "🎨 Workshops", bienetre: "🧘 Wellness",
      foody: "🍽️ Foody", encheres: "🔨 Auctions", agenda: "Calendar",
    },
    empty: "No events for this period.",
    free: "✅ FREE ENTRY",
    calTitle: "Calendar", reset: "Reset",
    seeEvents: "See events →", selectDate: "Select a date",
    fromTo: (s, e) => `From ${s} to ${e}`,
    since: (s) => `From ${s}`,
    nav: { events: "MC Events", agenda: "My Agenda" },
    months: ["January","February","March","April","May","June","July","August","September","October","November","December"],
    days: ["M","T","W","T","F","S","S"],
    cofounder: "Co-founder",
    quote: "Monaco is a permanent stage. We wanted everyone to be part of it.",
    story: "Stéphanie and Agathe share a common belief: Monaco is full of exceptional events, and every resident deserves to enjoy them fully. MonacOut was born from the desire to bring together, in one place, all the cultural and sporting richness of the Principality.",
    conviction: "\"Monaco's cultural wealth belongs to all its residents.\"",
    statement: "All of Monaco, in your pocket.",
    sources: "Official sources", eventsPerWeek: "Events/week", madeWith: "Made with love",
    profileSub: "About MonacOut",
    noEvents: "No events.", favEmpty: "No favorites yet.",
  },
};

// ── Traduction des données d'événement (catégorie, date, heure) en anglais ──
// Les noms de lieux (subtitle) et les titres ne sont jamais traduits.

const CAT_EN = {
  "CONCERT": "CONCERT", "OPÉRA": "OPERA", "MUSICAL": "MUSICAL", "THÉÂTRE": "THEATRE",
  "JAZZ LIVE": "JAZZ LIVE", "DJ SET": "DJ SET", "CHANTS": "CHOIR", "CINÉMA": "CINEMA",
  "FESTIVAL": "FESTIVAL", "GALA": "GALA", "SPECTACLE": "SHOW", "EXPOSITION": "EXHIBITION",
  "CONFÉRENCE": "TALK", "SALON": "FAIR", "FOOTBALL": "FOOTBALL", "BASKET": "BASKETBALL",
  "FORMULE 1": "FORMULA 1", "FORMULE E": "FORMULA E", "TENNIS": "TENNIS", "RALLYE": "RALLY",
  "SPORT": "SPORT", "ATELIER": "WORKSHOP", "DANSE": "DANCE", "BIEN-ÊTRE": "WELLNESS",
  "BRUNCH": "BRUNCH", "APÉRO": "DRINKS", "SOIRÉE": "NIGHTLIFE", "ENCHÈRES": "AUCTION",
  "MARCHÉ": "MARKET", "FÊTE NATIONALE": "NATIONAL DAY",
};

const DAY_EN = { Dim: "Sun", Lun: "Mon", Mar: "Tue", Mer: "Wed", Jeu: "Thu", Ven: "Fri", Sam: "Sat" };
const MON_EN = { jan: "Jan", "fév": "Feb", mar: "Mar", avr: "Apr", mai: "May", juin: "Jun", juil: "Jul", "août": "Aug", sep: "Sep", oct: "Oct", nov: "Nov", "déc": "Dec" };

export function localizeCat(cat, lang) {
  return lang === "en" ? (CAT_EN[cat] || cat) : cat;
}

export function localizeDate(dateStr, lang) {
  if (lang !== "en" || !dateStr) return dateStr;
  return dateStr.split(" ").map(w => DAY_EN[w] || MON_EN[w] || w).join(" ");
}

// Traduction des titres : phrases (ordre des mots) puis mots.
// On NE touche PAS aux articles (de, du, la…) ni aux noms propres / lieux /
// compositeurs / opéras (Mozart, Grace Kelly, Larvotto, Cyrano…).

const TITLE_PHRASES = [
  ["MESSE DIMANCHE", "SUNDAY MASS"], ["MESSE DOMINICALE", "SUNDAY MASS"],
  ["MESSE LUNDI", "MONDAY MASS"], ["MESSE MARDI", "TUESDAY MASS"],
  ["MESSE MERCREDI", "WEDNESDAY MASS"], ["MESSE JEUDI", "THURSDAY MASS"],
  ["MESSE VENDREDI", "FRIDAY MASS"], ["MESSE SAMEDI", "SATURDAY MASS"],
  ["FEUX D'ARTIFICE", "FIREWORKS"], ["FEU D'ARTIFICE", "FIREWORKS"],
  ["PLEIN AIR", "OPEN-AIR"], ["NOUVEL AN", "NEW YEAR"], ["RÉVEILLON", "NEW YEAR'S EVE"],
  ["FIN D'ANNÉE", "YEAR-END"], ["DÉBUT D'ANNÉE", "NEW-YEAR"], ["D'ANNÉE", "YEAR"],
  ["LEVER DU SOLEIL", "SUNRISE"], ["AU LEVER", "AT SUNRISE"],
  ["FÊTE NATIONALE", "NATIONAL DAY"], ["FÊTE DE LA MUSIQUE", "MUSIC DAY"],
  ["JOURNÉE MONDIALE DE L'ENVIRONNEMENT", "WORLD ENVIRONMENT DAY"],
  ["SITES HISTORIQUES", "HISTORIC SITES"], ["PARENT-ENFANT", "PARENT-CHILD"],
  ["CÔTE D'AZUR", "FRENCH RIVIERA"], ["BEAUX-ARTS", "FINE ARTS"],
  ["FÊTE DES MÈRES", "MOTHER'S DAY"], ["FÊTE DES PÈRES", "FATHER'S DAY"],
  ["BANDES DESSINÉES", "COMICS"], ["BANDE DESSINÉE", "COMIC"],
  ["VISITES GUIDÉES", "GUIDED TOURS"], ["VISITE GUIDÉE", "GUIDED TOUR"],
  ["SOIRÉE NOCTURNE", "NIGHT PARTY"], ["PEINTURE À L'HUILE", "OIL PAINTING"],
  ["À L'HUILE", "OIL"], ["DES ARTISTES", "ARTISTS'"], ["NE PAS CÉDER", "DON'T GIVE UP"],
];

const TITLE_WORDS = {
  // Jours
  "LUNDI": "MONDAY", "MARDI": "TUESDAY", "MERCREDI": "WEDNESDAY", "JEUDI": "THURSDAY",
  "VENDREDI": "FRIDAY", "SAMEDI": "SATURDAY", "DIMANCHE": "SUNDAY", "DOMINICAL": "SUNDAY",
  // Mois
  "JANVIER": "JANUARY", "FÉVRIER": "FEBRUARY", "MARS": "MARCH", "AVRIL": "APRIL",
  "JUIN": "JUNE", "JUILLET": "JULY", "AOÛT": "AUGUST", "SEPTEMBRE": "SEPTEMBER",
  "OCTOBRE": "OCTOBER", "NOVEMBRE": "NOVEMBER", "DÉCEMBRE": "DECEMBER",
  // Saisons
  "ÉTÉ": "SUMMER", "D'ÉTÉ": "SUMMER", "L'ÉTÉ": "SUMMER", "ESTIVALE": "SUMMER", "ESTIVAL": "SUMMER",
  "HIVER": "WINTER", "HIVERNAL": "WINTER", "HIVERNALE": "WINTER", "AUTOMNE": "AUTUMN",
  "AUTOMNAL": "AUTUMN", "D'AUTOMNE": "AUTUMN", "PRINTEMPS": "SPRING", "PRINTANIER": "SPRING",
  // Temps / saison
  "SEMAINE": "WEEK", "WEEK-END": "WEEKEND", "JOURNÉE": "DAY", "SOIRÉE": "EVENING",
  "SOIR": "EVENING", "NUIT": "NIGHT", "NOCTURNE": "NIGHT", "MATINAL": "MORNING",
  "MATINALE": "MORNING", "VEILLE": "EVE", "HEURE": "HOUR", "HEURES": "HOURS",
  "SAISON": "SEASON", "RENTRÉE": "AUTUMN RETURN", "OUVERTURE": "OPENING", "FERMETURE": "CLOSING",
  "CLÔTURE": "CLOSING", "REPRISE": "RETURN", "DÉBUT": "START", "FIN": "END", "ARRIVÉE": "ARRIVAL",
  "ANS": "YEARS", "ANNÉE": "YEAR", "NOUVEL": "NEW", "TOUSSAINT": "ALL SAINTS",
  // Religion / lieux génériques
  "MESSE": "MASS", "PAROISSES": "PARISHES", "PAROISSE": "PARISH", "ÉGLISE": "CHURCH",
  "CATHÉDRALE": "CATHEDRAL", "CHAPELLE": "CHAPEL", "CHANTS": "CHOIR", "CHORAL": "CHORAL",
  // Catégories / activités
  "APÉRO": "DRINKS", "L'APÉRO": "DRINKS", "BRUNCH": "BRUNCH", "DÎNER": "DINNER",
  "DÉJEUNER": "LUNCH", "DÉGUSTATION": "TASTING", "COCKTAILS": "COCKTAILS",
  "SPECTACLE": "SHOW", "EXPOSITION": "EXHIBITION", "CONFÉRENCE": "TALK", "CONFERENCE": "TALK",
  "FÊTE": "FESTIVAL", "FÊTES": "FESTIVALS", "MARCHÉ": "MARKET", "SALON": "FAIR",
  "ENCHÈRES": "AUCTION", "VENTE": "SALE", "VENTES": "SALES", "TOURNÉE": "TOUR",
  "RENCONTRE": "ENCOUNTER", "RENCONTRES": "ENCOUNTERS", "RÉCITAL": "RECITAL",
  "SCÈNE": "STAGE", "ACTE": "ACT", "PIÈCE": "PLAY", "REVUE": "REVUE", "CONTE": "TALE",
  "CONTES": "TALES", "CHANSONS": "SONGS", "MUSIQUE": "MUSIC", "MAGIE": "MAGIC", "MAGIES": "MAGIC",
  // Art & ateliers
  "ATELIER": "WORKSHOP", "ATELIERS": "WORKSHOPS", "STAGE": "COURSE", "STAGES": "COURSES",
  "COURS": "CLASS", "PEINTURE": "PAINTING", "DESSIN": "DRAWING", "GRAVURE": "ENGRAVING",
  "CÉRAMIQUE": "CERAMIC", "ARGILE": "CLAY", "BRODERIE": "EMBROIDERY",
  "CALLIGRAPHIE": "CALLIGRAPHY", "LINOGRAPHIE": "LINOCUT", "ILLUSTRATION": "ILLUSTRATION",
  "PLASTIQUES": "VISUAL", "GRAPHIQUES": "GRAPHIC", "CRÉATIF": "CREATIVE",
  "CRÉATIFS": "CREATIVE", "CRÉATIVE": "CREATIVE", "ARTISTIQUE": "ARTISTIC", "ARTISTIQUES": "ARTISTIC",
  "DÉAMBULATION": "WANDER",
  // Public / famille
  "ENFANTS": "CHILDREN", "ENFANT": "CHILD", "JEUNE": "YOUNG", "JEUNES": "YOUNG",
  "JEUNESSE": "YOUTH", "FAMILLE": "FAMILY", "FÉMININ": "WOMEN'S", "ÉCOLES": "SCHOOLS",
  "DÉCOUVERTE": "DISCOVERY", "INITIATION": "INTRO", "INTENSIF": "INTENSIVE",
  // Bien-être
  "MÉDITATION": "MEDITATION", "RESPIRATION": "BREATHING", "ÉQUILIBRE": "BALANCE",
  "ÉNERGIE": "ENERGY", "CORPS": "BODY", "CONSCIENTE": "MINDFUL", "RETRAITE": "RETREAT",
  "PAUSE": "BREAK", "DÉTOX": "DETOX", "BIEN-ÊTRE": "WELLNESS",
  // Gastronomie
  "VINS": "WINES", "CAVE": "CELLAR", "BULLES": "BUBBLES", "BOULANGERIE": "BAKERY",
  "CACAO": "COCOA", "GASTRONOMIE": "GASTRONOMY", "CHARCUTERIES": "CHARCUTERIE",
  // Nature / mer
  "MER": "SEA", "MARIN": "MARINE", "MARINS": "MARINE", "MARINE": "MARINE", "OCÉAN": "OCEAN",
  "PLAGE": "BEACH", "VOILE": "SAILING", "VOILES": "SAILS", "PLONGÉE": "DIVING",
  "NATURE": "NATURE", "PLANTES": "PLANTS", "JARDIN": "GARDEN", "JARDINS": "GARDENS",
  "BIODIVERSITÉ": "BIODIVERSITY", "RECYCLAGE": "RECYCLING", "PRÉHISTOIRE": "PREHISTORY",
  "PRÉHISTORIQUE": "PREHISTORIC", "EXPLORATION": "EXPLORATION",
  // Lumières / fête
  "LUMIÈRES": "LIGHTS", "ÉTOILES": "STARS", "MERVEILLES": "WONDERS", "FEUX": "FIREWORKS",
  // Divers
  "PRINCESSE": "PRINCESS", "PRINCIER": "PRINCELY", "PRINCIÈRES": "PRINCELY",
  "PRINCIPAUTÉ": "PRINCIPALITY", "VOITURES": "CARS", "MONNAIES": "COINS", "TIMBRES": "STAMPS",
  "MOBILIER": "FURNITURE", "LIVRE": "BOOK", "THÉÂTRE": "THEATRE", "THÉÂTRALE": "THEATRICAL",
  "MUSÉE": "MUSEUM", "PROMENADE": "STROLL", "BALADE": "STROLL", "PRESTIGE": "PRESTIGE",
  "LUXE": "LUXURY", "HISTORIQUES": "HISTORIC", "HISTORIQUE": "HISTORIC", "MONDIALE": "WORLD",
  "MONDIAL": "WORLD", "INTERNATIONALE": "INTERNATIONAL", "FRANÇAISE": "FRENCH",
  "FRANÇAISES": "FRENCH", "CORSE": "CORSICAN", "CORSES": "CORSICAN", "ITALIEN": "ITALIAN",
  "JAPONAIS": "JAPANESE", "JAPON": "JAPAN", "MÉDITERRANÉE": "MEDITERRANEAN",
  "MÉDITERRANÉEN": "MEDITERRANEAN", "NOËL": "CHRISTMAS", "SACRÉ": "SACRED", "SACRÉE": "SACRED",
  "GRATUIT": "FREE", "PUBLIC": "PUBLIC", "NATIONALE": "NATIONAL",
  // Thèmes Philomonaco
  "DÉSIR": "DESIRE", "DÉSIRS": "DESIRES", "ENVIE": "WANT", "BESOIN": "NEED",
  "NAISSANCE": "BIRTH", "ENSEMBLE": "TOGETHER", "ENTRE": "BETWEEN", "INFINI": "INFINITY",
  "DÉCEPTION": "DISAPPOINTMENT", "FILS": "SON",
  // Compléments
  "ARTISTES": "ARTISTS", "ARTISTE": "ARTIST", "GUIDÉE": "GUIDED", "GUIDÉ": "GUIDED",
  "TROPHÉE": "TROPHY", "CINÉMA": "CINEMA", "VISITE": "VISIT", "VISITES": "VISITS",
  "ÉCO-LUDIQUE": "ECO-FUN", "FORUM": "FORUM", "FORUMS": "FORUMS",
};

// Adjectifs français placés APRÈS le nom → en anglais on les met AVANT.
// "YOGA MATINAL" → "MORNING YOGA", "SÉANCE ESTIVALE" → "SUMMER SÉANCE"…
const TRAIL_ADJ = {
  MATINAL: "MORNING", MATINALE: "MORNING", ESTIVAL: "SUMMER", ESTIVALE: "SUMMER",
  HIVERNAL: "WINTER", HIVERNALE: "WINTER", AUTOMNAL: "AUTUMN", AUTOMNALE: "AUTUMN",
  PRINTANIER: "SPRING", NOCTURNE: "NIGHT", DOMINICAL: "SUNDAY", DOMINICALE: "SUNDAY",
  SACRÉ: "SACRED", SACRÉE: "SACRED", MONÉGASQUE: "MONEGASQUE",
};
const TRAIL_RE = new RegExp("([A-ZÀ-Ÿ’'\\-]{2,})\\s+(" + Object.keys(TRAIL_ADJ).join("|") + ")(?=\\s|$)", "gi");

// Noms français « tête » suivis de leur complément → en anglais le complément passe avant.
// "ATELIER CÉRAMIQUE" → "CERAMIC WORKSHOP", "STAGE BALLET" → "BALLET COURSE".
const HEAD_NOUN = { ATELIER: "WORKSHOP", STAGE: "COURSE", COURS: "CLASS", SÉANCE: "SESSION", INITIATION: "INITIATION" };
const HEAD_RE = new RegExp("\\b(" + Object.keys(HEAD_NOUN).join("|") + ")\\s+([A-ZÀ-Ÿ’'\\-]{2,})", "gi");

function ordinal(n) {
  const v = parseInt(n);
  if (v % 100 >= 11 && v % 100 <= 13) return v + "TH";
  return v + (["TH", "ST", "ND", "RD"][v % 10] || "TH");
}

export function localizeTitle(title, lang) {
  if (lang !== "en" || !title) return title;
  let s = title;
  // Ordinaux français : 8ÈME → 8TH, 1ER → 1ST, 2E → 2ND
  s = s.replace(/(\d+)(ÈME|ER|RE|E)\b/gi, (_, n) => ordinal(n));
  for (const [fr, en] of TITLE_PHRASES) s = s.split(fr).join(en);
  // Inversion adjectif postposé → antéposé ("yoga matinal" → "morning yoga")
  s = s.replace(TRAIL_RE, (_, noun, adj) => (TRAIL_ADJ[adj.toUpperCase()] || adj) + " " + noun);
  // Nom tête + complément → complément + nom anglais ("atelier céramique" → "ceramic workshop")
  s = s.replace(HEAD_RE, (_, head, mod) => mod + " " + (HEAD_NOUN[head.toUpperCase()] || head));
  return s.split(/(\s+)/).map(w => TITLE_WORDS[w.toUpperCase()] || w).join("");
}

export function localizeTime(time, lang) {
  if (lang !== "en" || !time) return time;
  return time
    .replace(/(\d{1,2})h(\d{2})/g, "$1:$2")
    .replace(/(\d{1,2})h(?!\d)/g, "$1:00")
    .replace(/Toute la journée/i, "All day")
    .replace(/Dès le/i, "From")
    .replace(/Dès/i, "From");
}
