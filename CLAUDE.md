# MonacOut — Instructions pour Claude

## Projet
App de sorties Monaco. React + Vite. Déployée automatiquement sur Vercel via git push to `main` (repo: jetayre/MonacOut).

## Rôle de Claude
Vérifier les sources officielles **2 fois par jour** (6h et 18h), identifier les nouveaux événements, mettre à jour `src/data/events.js`, puis builder et pousser.

---

## Sources officielles à vérifier (exhaustif)

| Source | URL | Catégories |
|--------|-----|------------|
| Opéra de Monte-Carlo — concerts | https://opmc.mc/en/concert/ | CONCERT, OPÉRA |
| Opéra de Monte-Carlo — saison lyrique | https://opmc.mc/en/season-25-26/ | OPÉRA, MUSICAL |
| Culture Monaco | https://culture.mc/en/what-s-on | THÉÂTRE, CONCERT SACRÉ, EXPOSITION |
| Mairie de Monaco — agenda | https://www.mairie.mc/agenda | SPORT, CHANTS, DANSE, SPECTACLE, FÊTE NATIONALE |
| AS Monaco Basket | https://billetterie.asmonaco.basketball/fr | BASKET |
| AS Monaco FC | https://www.asmonaco.com/fr/billetterie/ | FOOTBALL |
| La Note Bleue | https://lanotebleue.mc/en/ | JAZZ LIVE, DJ SET, BRUNCH, APÉRO |
| FIA Formula E | https://www.fiaformulae.com/ | FORMULE E |
| Grand Prix Monaco F1 | https://monaco-grandprix.com/ | FORMULE 1 |
| Monte-Carlo Masters (Tennis) | https://www.montecarlomasters.com/ | TENNIS |
| Herculis Diamond League | https://monaco.diamondleague.com/ | SPORT |
| Grimaldi Forum | https://www.grimaldiforum.com/ | GALA, EXPOSITION, ENCHÈRES, ATELIER |
| TV Festival Monte-Carlo | https://www.tvfestival.com/ | FESTIVAL |
| HVMC — enchères | https://hvmc.com/ventes-a-venir/ | ENCHÈRES |
| RM Sotheby's Monaco | https://rmsothebys.com/auctions/mc26/ | ENCHÈRES |
| Bonhams Monaco | https://www.bonhams.com/ | ENCHÈRES |
| Monaco Legend Auctions | https://www.monacolegendauctions.com/ | ENCHÈRES |
| Artcurial Monaco | https://www.artcurial.com/en/specialties/artcurial-monaco | ENCHÈRES |
| Théâtre Princesse Grace | https://www.tpgmonaco.mc/fr/programme | THÉÂTRE, SPECTACLE |
| Théâtre des Muses Monaco | https://www.letheatredesmuses.com/ | THÉÂTRE, SPECTACLE, ATELIER |
| Théâtre Fort Antoine | https://theatrefortantoine.com/ | THÉÂTRE |
| Théâtre des Variétés Monaco | https://www.monte-carlo.mc/fr/sorties/spectacles/theatre-des-varietes | THÉÂTRE, SPECTACLE |
| Thermes Marins Monte-Carlo | https://www.montecarlosbm.com/en/wellness/thermes-marins-monte-carlo/ | BIEN-ÊTRE |
| Odéon Spa | https://odeonspa.com/ | BIEN-ÊTRE |
| Monte-Carlo SBM (restos/bars) | https://www.montecarlosbm.com/ | BRUNCH, APÉRO, SOIRÉE |
| Sass Café | https://www.sasscafe.com/ | APÉRO |
| Woo Monaco | https://woo.mc/ | BRUNCH |
| NMNM (Villa Paloma + Villa Sauber) | https://www.nmnm.mc/ | ATELIER, EXPOSITION |
| Académie de Musique Prince Rainier III | https://www.academiedemusique.mc/ | ATELIER |
| Ballet de Monte-Carlo | https://www.balletsdemontecarlo.com/ | DANSE |
| Philomonaco | https://www.philomonaco.com | CONFÉRENCE |
| Cinémas 2 Monaco | https://www.cinemas2monaco.com | CINÉMA |
| Musée Océanographique | https://oceano.mc/ | ATELIER |
| Automobile Club Monaco | https://www.acm.mc/ | RALLYE |
| Monaco Run | https://www.monacorun.com/ | SPORT |
| Monaco Yacht Show | https://www.monacoyachtshow.com/ | SALON |
| Jimmy'z Monte-Carlo | https://www.montecarlosbm.com/en/nightlife/jimmyz-monte-carlo | SOIRÉE |
| New Moods Monte-Carlo | https://www.montecarlosbm.com/en/spectacles/new-moods | CONCERT, DJ SET |
| The Marlow Monaco | https://www.montecarlosbm.com/en/restaurant-monaco/marlow | BRUNCH |
| Blue Gin Monte-Carlo Bay | https://www.montecarlosbm.com/en/bar-nightclub-monaco/the-blue-gin | APÉRO, DJ SET |
| Sunset Monaco | https://www.sunsetmonaco.com/ | DJ SET, SOIRÉE |
| Twiga Monte Carlo | https://twigaworld.com/twiga-montecarlo/ | SOIRÉE, DJ SET |
| Lilly's Club | https://lillysclub.com/ | SOIRÉE, DJ SET |
| Amber Lounge Monaco | https://www.amberlounge.com/events/monaco-2026/ | SOIRÉE, GALA |
| Jack Monaco | https://www.jack.mc/ | APÉRO, SOIRÉE |
| Nobu Monte-Carlo | https://www.fairmont-montecarlo.com/en/events/ | SOIRÉE |
| Ironman Monaco | https://www.ironman.com/ | SPORT |

---

## Format d'un événement

```js
{
  id: 210,                          // incrémenter depuis le dernier ID
  year: 2027,                       // seulement si 2027+, absent = 2026
  cat: "THÉÂTRE",                   // voir liste des catégories ci-dessous
  date: "Sam 30 mai",               // format: "JJJ D MMM" (JOURS_FR + MOIS)
  time: "20h30",
  title: "TITRE\nSUR PLUSIEURS\nLIGNES",   // \n pour sauts de ligne
  subtitle: "Lieu · Quartier",
  desc: "Description courte.",
  free: false,                      // true si entrée libre
  hot: true,                        // true si événement phare
  fallback: "linear-gradient(150deg,#5A1870,#7A3890,#400858)",
  accent: "#E0B0F8",
  emoji: "🎭",
  link: "https://...",              // lien billetterie officiel
  source: "Culture Monaco",
  quarter: "Monaco-Ville",          // quartier: Monaco-Ville, Monte-Carlo, Larvotto, Fontvieille, Monaco
}
```

### Catégories disponibles
`CONCERT`, `OPÉRA`, `MUSICAL`, `THÉÂTRE`, `JAZZ LIVE`, `DJ SET`, `CHANTS`, `CINÉMA`, `FESTIVAL`, `GALA`, `SPECTACLE`, `EXPOSITION`, `CONFÉRENCE`, `FOOTBALL`, `BASKET`, `FORMULE 1`, `FORMULE E`, `TENNIS`, `RALLYE`, `SPORT`, `ATELIER`, `DANSE`, `BIEN-ÊTRE`, `BRUNCH`, `APÉRO`, `SOIRÉE`, `ENCHÈRES`, `MARCHÉ`, `SALON`, `FÊTE NATIONALE`

### Jours (date field)
`Lun`, `Mar`, `Mer`, `Jeu`, `Ven`, `Sam`, `Dim`

### Mois (date field)
`jan`, `fév`, `mar`, `avr`, `mai`, `juin`, `juil`, `août`, `sep`, `oct`, `nov`, `déc`

---

## Règles importantes

1. **Tri chronologique** : les événements sont automatiquement triés à l'export (`_RAW.sort()`). Ne pas trier manuellement, mais insérer dans la bonne section de commentaire (`// ── MAI ───`).
2. **Filtre automatique** : `ALL_EVENTS` n'inclut que les événements d'aujourd'hui et futurs. Les événements passés disparaissent automatiquement à minuit.
3. **Événements 2027** : ajouter `year: 2027` dans l'objet. Pas de `year` pour 2026 (valeur par défaut).
4. **Ne pas dupliquer** : avant d'ajouter, vérifier que l'événement n'existe pas déjà (même titre, même date).
5. **ID unique** : toujours incrémenter depuis le dernier ID dans le fichier.
6. **VÉRIFIER LE JOUR DE LA SEMAINE** : le champ `date` doit commencer par le bon abrégé (Lun/Mar/Mer/Jeu/Ven/Sam/Dim). Toujours vérifier avec `new Date(year, mois, jour).getDay()` avant d'insérer. Les erreurs de jour sont invisibles à l'œil nu mais font échouer les filtres "Aujourd'hui" et "Week-end".
7. **Couverture mensuelle** : toutes les catégories récurrentes (APÉRO, BRUNCH, ATELIER, BIEN-ÊTRE, CONFÉRENCE) doivent avoir au moins un événement par mois sur la fenêtre de 12 mois glissante. Vérifier les trous à chaque mise à jour.
8. **Fenêtre cible** : maintenir des événements du jour jusqu'à 12 mois plus tard. Au-delà de cette fenêtre les événements disparaissent via le filtre automatique.

---

## Workflow de mise à jour

```bash
# 1. Vérifier les sources officielles et ajouter dans src/data/events.js
# 2. Builder
npm run build

# 3. Committer et pousser (Vercel redéploie automatiquement)
git add src/data/events.js
git commit -m "chore: mise à jour événements $(date +%Y-%m-%d)"
git push origin main
```

---

## Agent de vérification quotidienne

`verify-events.mjs` — script à la racine du projet. À lancer chaque jour à 6h.

```bash
# Lancer manuellement
node verify-events.mjs

# Ajouter au crontab (6h00 chaque jour)
# crontab -e
0 6 * * * cd /Users/stephanieayre/monacout && node verify-events.mjs >> verify-events.log 2>&1
```

Le script vérifie :
- Tous les `descEn` présents
- Jours de la semaine corrects (Lun/Mar/Mer/Jeu/Ven/Sam/Dim)
- Événements > 30j dans le passé à supprimer
- Trous de couverture mensuelle (APÉRO, BRUNCH, ATELIER, BIEN-ÊTRE, CONFÉRENCE)

Rapport généré dans `verify-events-report.txt`.

---

## Architecture rapide

```
src/
  data/events.js          ← toutes les données événements
  components/
    EventCard.jsx          ← carte événement (couleurs par catégorie)
    screens/
      HomeScreen.jsx       ← filtre par temps + catégorie
      AgendaScreen.jsx     ← calendrier mensuel
      FavoritesScreen.jsx
      MapScreen.jsx
      DetailScreen.jsx
public/
  venues.html              ← liste complète des lieux avec liens officiels
CLAUDE.md                  ← ce fichier
verify-events.mjs          ← agent vérification quotidienne (6h00)
verify-events-report.txt   ← dernier rapport généré
```
