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
  FOOTBALL: "sport", BASKET: "sport", "FORMULE 1": "sport", SPORT: "sport", RALLYE: "sport", TENNIS: "sport",
  MUSICAL: "culture", "CONFÉRENCE": "culture", EXPOSITION: "culture", FESTIVAL: "culture",
  GALA: "culture", "FÊTE NATIONALE": "culture", "MARCHÉ": "culture", SALON: "culture", SPECTACLE: "culture",
  CHANTS: "music", "OPÉRA": "music", CONCERT: "music", "JAZZ LIVE": "music", "DJ SET": "music",
  "CINÉMA": "cinema",
  FAMILLE: "famille",
};

export default function App() {
  const [tab, setTab] = useState("home");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [homeFilter, setHomeFilter] = useState("today");
  const [lang, setLang] = useState("fr");

  function handleTabChange(newTab) {
    setSelectedEvent(null);
    setTab(newTab);
  }

  function toggleFav(id) {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  }

  function navigateToCategory(cat) {
    setHomeFilter(CAT_TO_FILTER[cat] || "all");
    setSelectedEvent(null);
    setTab("home");
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
      case "home":
        return <HomeScreen {...sharedProps} filter={homeFilter} onFilterChange={setHomeFilter} setLang={setLang} />;
      case "agenda":
        return <AgendaScreen {...sharedProps} />;
      case "map":
        return <MapScreen {...sharedProps} />;
      case "favorites":
        return <FavoritesScreen {...sharedProps} />;
      case "profile":
        return <ProfileScreen lang={lang} />;
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
