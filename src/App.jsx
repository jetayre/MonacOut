import { useState } from "react";
import { T } from "./i18n";
import Shell from "./components/Shell";
import HomeScreen from "./components/screens/HomeScreen";
import FavoritesScreen from "./components/screens/FavoritesScreen";

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
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem("monacout_favs") || "[]"); }
    catch { return []; }
  });
  const [homeFilter, setHomeFilter] = useState("all");
  const [lang, setLang] = useState("fr");
  const [showCats, setShowCats] = useState(false);
  const [catFilter, setCatFilter] = useState(null);

  function handleTabChange(newTab) {
    if (newTab === "events" && tab === "events") {
      setShowCats(prev => !prev);
      return;
    }
    setCatFilter(null);
    setShowCats(false);
    setTab(newTab);
  }

  function handleCatFilter(catId) {
    setCatFilter(catId === catFilter ? null : catId);
  }

  function toggleFav(id) {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem("monacout_favs", JSON.stringify(next));
      return next;
    });
  }

  function navigateToCategory(cat) {
    setCatFilter(CAT_TO_FILTER[cat] || null);
    setHomeFilter("all");
    setTab("events");
  }

  const sharedProps = {
    favorites,
    onToggleFav: toggleFav,
    onCategoryClick: navigateToCategory,
    lang,
  };

  function renderScreen() {
    switch (tab) {
      case "events":
        return (
          <HomeScreen
            {...sharedProps}
            filter={homeFilter}
            onFilterChange={setHomeFilter}
            setLang={setLang}
            catFilter={catFilter}
            onCatFilter={handleCatFilter}
          />
        );
      case "agenda":
        return <FavoritesScreen {...sharedProps} />;
      default:
        return null;
    }
  }

  return (
    <Shell tab={tab} setTab={handleTabChange} lang={lang} t={T[lang]} showCats={showCats} catFilter={catFilter} onCatFilter={handleCatFilter}>
      {renderScreen()}
    </Shell>
  );
}
