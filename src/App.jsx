import { useState } from "react";
import { T } from "./i18n";
import Shell from "./components/Shell";
import HomeScreen from "./components/screens/HomeScreen";
import AgendaScreen from "./components/screens/AgendaScreen";
import MapScreen from "./components/screens/MapScreen";
import FavoritesScreen from "./components/screens/FavoritesScreen";
import ProfileScreen from "./components/screens/ProfileScreen";
import DetailScreen from "./components/screens/DetailScreen";

const CAT_TO_FILTER = {
  FOOTBALL: "sport", BASKET: "sport", "FORMULE 1": "sport", "FORMULE E": "sport",
  SPORT: "sport", RALLYE: "sport", TENNIS: "sport",
  CONCERT: "music", "OPÉRA": "music", MUSICAL: "music", "JAZZ LIVE": "music",
  "DJ SET": "music", CHANTS: "music",
  THÉÂTRE: "culture", "CONFÉRENCE": "culture", EXPOSITION: "culture", FESTIVAL: "culture",
  GALA: "culture", "FÊTE NATIONALE": "culture", MARCHÉ: "culture", SALON: "culture",
  SPECTACLE: "culture", CINÉMA: "cinema",
  ATELIER: "ateliers", DANSE: "ateliers",
  "BIEN-ÊTRE": "bienetre",
  BRUNCH: "foody", APÉRO: "foody", SOIRÉE: "foody", FOODY: "foody",
  ENCHÈRES: "encheres",
};

export default function App() {
  const [tab, setTab] = useState("events");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem("monacout_favs") || "[]"); }
    catch { return []; }
  });
  const [homeFilter, setHomeFilter] = useState("all");
  const [lang, setLang] = useState("fr");
  const [showCats, setShowCats] = useState(false);

  function handleTabChange(newTab) {
    if (newTab === "events" && tab === "events") {
      setShowCats(prev => !prev);
      return;
    }
    setSelectedEvent(null);
    setTab(newTab);
  }

  function toggleFav(id) {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem("monacout_favs", JSON.stringify(next));
      return next;
    });
  }

  function navigateToCategory(cat) {
    setHomeFilter(CAT_TO_FILTER[cat] || "all");
    setSelectedEvent(null);
    setTab("events");
  }

  const sharedProps = {
    onSelectEvent: setSelectedEvent,
    favorites,
    onToggleFav: toggleFav,
    onCategoryClick: navigateToCategory,
    lang,
  };

  function renderScreen() {
    if (selectedEvent) {
      return (
        <DetailScreen
          {...sharedProps}
          event={selectedEvent}
          onBack={() => setSelectedEvent(null)}
        />
      );
    }
    switch (tab) {
      case "events":
        return <HomeScreen {...sharedProps} filter={homeFilter} onFilterChange={setHomeFilter} setLang={setLang} showCats={showCats} />;
      case "agenda":
        return <FavoritesScreen {...sharedProps} />;
      default:
        return null;
    }
  }

  return (
    <Shell tab={tab} setTab={handleTabChange} lang={lang} t={T[lang]}>
      {renderScreen()}
    </Shell>
  );
}
