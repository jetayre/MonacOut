# MonacOut — Instructions pour Claude

## Projet
App de sorties Monaco. React + Vite. Déployée automatiquement sur Vercel via git push to `main` (repo: jetayre/MonacOut).

## Rôle de Claude
Vérifier les sources officielles **2 fois par jour** (6h et 18h), identifier les nouveaux événements, mettre à jour `src/data/events.js`, puis builder et pousser.

---

## Sources officielles à vérifier (exhaustif)

| Source | URL | Catégories | Contact lieu |
|--------|-----|------------|--------------|
| Opéra de Monte-Carlo — concerts | https://opmc.mc/en/concert/ | CONCERT, OPÉRA | +377 9200 1370 |
| Opéra de Monte-Carlo — saison lyrique | https://opmc.mc/en/season-25-26/ | OPÉRA, MUSICAL | +377 9200 1370 |
| Culture Monaco | https://culture.mc/en/what-s-on | THÉÂTRE, CONCERT SACRÉ, EXPOSITION | +377 9200 1370 |
| Mairie de Monaco — agenda | https://www.mairie.mc/agenda | SPECTACLE (espaces publics), FÊTE NATIONALE, SPORT (espaces publics), Feux d'artifice, Marchés | +377 9315 2828 |
| Club Bouliste Monégasque | https://cbmonaco.org | SPORT pétanque | +377 9205 9217 |
| Sporting Monte-Carlo | https://meetings.montecarlosbm.com/en/sporting-monte-carlo | DANSE (Salle du Sporting) | +377 9806 7071 |
| Théâtre des Variétés | https://www.monte-carlo.mc/fr/sorties/spectacles/theatre-des-varietes | DANSE, ATELIER (Théâtre des Variétés) | +377 9330 1861 |
| Théâtre Princesse Grace | https://www.tpgmonaco.mc | DANSE (Salle Princesse Grace), THÉÂTRE | +377 9325 3227 |
| Paroisse Sacré-Cœur Monaco | https://saintmartin.diocese.mc | CHANTS (Église du Sacré-Cœur) | +377 9330 7526 |
| Cathédrale Saint-Nicolas | https://www.maitrisecathedrale.mc/fr/prochaines-dates | CONCERT, CHANTS (Cathédrale) | +377 9999 1400 |
| Espace Léo Ferré | https://www.espaceleoferre.mc/ | CONCERT, DANSE, SPECTACLE (Fontvieille) | +377 9310 1210 |
| AS Monaco Basket | https://billetterie.asmonaco.basketball/fr | BASKET | |
| AS Monaco FC | https://billetterie.asmonaco.com/ | FOOTBALL | |
| La Note Bleue | https://lanotebleue.mc/en/ | JAZZ LIVE, DJ SET, BRUNCH, APÉRO | |
| FIA Formula E | https://www.fiaformulae.com/ | FORMULE E | |
| Grand Prix Monaco F1 | https://monaco-grandprix.com/ | FORMULE 1 | |
| Monte-Carlo Masters (Tennis) | https://www.montecarlomasters.com/ | TENNIS | |
| Herculis Diamond League | https://monaco.diamondleague.com/ | SPORT | |
| Grimaldi Forum | https://www.grimaldiforum.com/ | GALA, EXPOSITION, ENCHÈRES, ATELIER | |
| TV Festival Monte-Carlo | https://www.tvfestival.com/ | FESTIVAL | |
| HVMC — enchères | https://hvmc.com/ventes-a-venir/ | ENCHÈRES | |
| RM Sotheby's Monaco | https://rmsothebys.com/auctions/mc26/ | ENCHÈRES | |
| Bonhams Monaco | https://www.bonhams.com/ | ENCHÈRES | |
| Monaco Legend Auctions | https://www.monacolegendauctions.com/ | ENCHÈRES | |
| Artcurial Monaco | https://www.artcurial.com/en/specialties/artcurial-monaco | ENCHÈRES | |
| Théâtre Princesse Grace | https://www.tpgmonaco.mc/fr/programme | THÉÂTRE, SPECTACLE | +377 9325 3227 |
| Théâtre des Muses Monaco | https://www.letheatredesmuses.com/ | THÉÂTRE, SPECTACLE, ATELIER | |
| Théâtre Fort Antoine | https://www.theatrefortantoine.com/ | THÉÂTRE | |
| Théâtre des Variétés Monaco | https://www.monte-carlo.mc/fr/sorties/spectacles/theatre-des-varietes | THÉÂTRE, SPECTACLE | +377 9330 1861 |
| Thermes Marins Monte-Carlo | https://www.montecarlosbm.com/en/wellness-sport-monaco/thermes-marins-monte-carlo | BIEN-ÊTRE | |
| Odéon Spa | https://odeonspa.com/ | BIEN-ÊTRE | |
| Monte-Carlo SBM (restos/bars) | https://www.montecarlosbm.com/ | BRUNCH, APÉRO, SOIRÉE | |
| Sass Café | https://www.sasscafe.com/ | APÉRO | |
| Woo Monaco | https://woo.mc/ | BRUNCH | |
| NMNM (Villa Paloma + Villa Sauber) | https://www.nmnm.mc/en/visit/visites-et-ateliers/ | ATELIER, EXPOSITION | |
| Académie de Musique Prince Rainier III | https://academierainier3.mc/en | ATELIER | |
| Ballet de Monte-Carlo | https://www.balletsdemontecarlo.com/ | DANSE | |
| Philomonaco | https://philomonaco.com | CONFÉRENCE | |
| Médiathèque de Monaco | https://www.mediatheque.mc/ | CONFÉRENCE, MUSICAL | +377 9898 8008 |
| Cinémas 2 Monaco | https://www.cinemas2monaco.com | CINÉMA | +377 9325 3681 |
| Musée Océanographique | https://musee.oceano.org/ | ATELIER | |
| Automobile Club Monaco | https://acm.mc/ | RALLYE | |
| Monaco Run | https://www.monacorun.com/ | SPORT | |
| Monaco Yacht Show | https://www.monacoyachtshow.com/ | SALON | |
| Jimmy'z Monte-Carlo | https://www.montecarlosbm.com/en/nightlife/jimmyz-monte-carlo | SOIRÉE | |
| New Moods Monte-Carlo | https://www.montecarlosbm.com/en/spectacles/new-moods | CONCERT, DJ SET | |
| The Marlow Monaco | https://www.montecarlosbm.com/en/restaurant-monaco/marlow | BRUNCH | |
| Blue Gin Monte-Carlo Bay | https://www.montecarlosbm.com/en/bar-nightclub-monaco/the-blue-gin | APÉRO, DJ SET | |
| Sunset Monaco | https://www.sunsetmonaco.com/ | DJ SET, SOIRÉE | |
| Twiga Monte Carlo | https://twigaworld.com/twiga-montecarlo/ | SOIRÉE, DJ SET | |
| Lilly's Club | https://lillysclub.com/ | SOIRÉE, DJ SET | |
| Amber Lounge Monaco | https://www.amberlounge.com/events/monaco-2026/ | SOIRÉE, GALA | |
| Jack Monaco | https://jackmonaco.playfun.tv/ | APÉRO, SOIRÉE | |
| Nobu Monte-Carlo | https://www.fairmont.com/en/hotels/monte-carlo/fairmont-monte-carlo/dining/nobu.restaurant.html | SOIRÉE | |
| Ironman Monaco | https://www.ironman.com/ | SPORT | |
| Sunshine Yoga Monte-Carlo | https://yogamontecarlo.com/contact-us/ | YOGA, BIEN-ÊTRE | +33 6 64 91 96 42 |
| Novotel Monte-Carlo (Azzurra Bar) | https://www.novotelmontecarlo.com/en/restaurant-bars/ | APÉRO | +377 99 99 83 00 |
| Happy Chou | https://happychou.fr | ATELIER enfants | +33 6 70 98 94 19 |
| Belcat Events | https://belcatevents.com | ATELIER enfants | +33 6 78 63 00 83 |
| Little Wonders Monaco | https://littlewondersmonaco.com | ATELIER enfants | +377 99 926 667 |
| Femina Sports Monaco | https://feminasports.com/ | SPORT gym enfants | (email uniquement) |
| Académie Monégasque de la Mer | https://www.academiemonegasquedelamer.com/ | SPORT nautique enfants | +33 6 78 63 50 52 |
| Académie Princesse Grace | https://www.balletsdemontecarlo.com/fr/academie-princesse-grace/formations | DANSE classique | +377 93 30 70 40 |
| MC Dance Monaco | https://www.instagram.com/mc_dance_monaco/ | DANSE contemporaine | (Instagram / email) |
| Monaco Beaux-Arts | https://www.monacobeauxarts.com | ATELIER arts plastiques | +377 97 77 16 65 |

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
  link: "https://...",              // lien billetterie officiel DU LIEU
  phone: "+377 ...",                // téléphone DU LIEU (pas de la source)
  source: "Culture Monaco",
  quarter: "Monaco-Ville",          // quartier: Monaco-Ville, Monte-Carlo, Larvotto, Fontvieille, Monaco
}
```

### Catégories disponibles
`CONCERT`, `OPÉRA`, `MUSICAL`, `THÉÂTRE`, `JAZZ LIVE`, `DJ SET`, `CHANTS`, `CINÉMA`, `FESTIVAL`, `GALA`, `SPECTACLE`, `EXPOSITION`, `CONFÉRENCE`, `FOOTBALL`, `BASKET`, `FORMULE 1`, `FORMULE E`, `TENNIS`, `RALLYE`, `SPORT`, `ATELIER`, `DANSE`, `BIEN-ÊTRE`, `BRUNCH`, `APÉRO`, `SOIRÉE`, `ENCHÈRES`, `MARCHÉ`, `SALON`, `FÊTE NATIONALE`

### Filtres UI (boutons dans l'app)
| Filtre | Catégories incluses |
|--------|---------------------|
| 🎭 Culture | MUSICAL, THÉÂTRE, CHANTS, EXPOSITION, OPÉRA, FESTIVAL, GALA, FÊTE NATIONALE, MARCHÉ, SALON, SPECTACLE, CINÉMA |
| 💬 Conférences | CONFÉRENCE |
| 🎵 Musique | CONCERT, CHANTS, MUSICAL, JAZZ LIVE, DJ SET, OPÉRA |
| 🎬 Cinéma | CINÉMA |
| 🎨 Ateliers | ATELIER, DANSE |
| 🧘 Bien-être | BIEN-ÊTRE |
| 🍽️ Foody | BRUNCH, APÉRO, SOIRÉE |
| 🔨 Enchères | ENCHÈRES |
| ⚽ Sport | FOOTBALL, BASKET, FORMULE 1, FORMULE E, SPORT, RALLYE, TENNIS |
| 👨‍👩‍👧 Famille | événements gratuits + ATELIER/SPECTACLE/CINÉMA/MARCHÉ/FESTIVAL/EXPOSITION/DANSE + mots-clés enfant |
| ⛪ Messes | CHANTS |

### Jours (date field)
`Lun`, `Mar`, `Mer`, `Jeu`, `Ven`, `Sam`, `Dim`

### Mois (date field)
`jan`, `fév`, `mar`, `avr`, `mai`, `juin`, `juil`, `août`, `sep`, `oct`, `nov`, `déc`

---

## Règles importantes

1. **`link` et `phone` = le lieu, pas la source** : le lien et le téléphone doivent toujours pointer vers le lieu où se passe l'événement. Exemples :
   - Un concert à l'Église du Sacré-Cœur listé sur mairie.mc → `link:"https://saintmartin.diocese.mc"`, `phone:"+377 9330 7526"`
   - Un concert à la Cathédrale Saint-Nicolas → `link:"https://www.maitrisecathedrale.mc/fr/prochaines-dates"`, `phone:"+377 9999 1400"`
   - Un événement à l'Espace Léo Ferré → `link:"https://www.espaceleoferre.mc/"`, `phone:"+377 9310 1210"`
   - Un concert à la Salle Garnier (OPMC) → `link:"https://opmc.mc/en/concert/"`, `phone:"+377 9200 1370"`
   - La Mairie peut être la `source` de découverte, jamais le `link` final si un lieu spécifique existe.

2. **Tri chronologique** : les événements sont automatiquement triés à l'export (`_RAW.sort()`). Ne pas trier manuellement, mais insérer dans la bonne section de commentaire (`// ── MAI ───`).

3. **Filtre automatique** : `ALL_EVENTS` n'inclut que les événements d'aujourd'hui et futurs. Les événements passés disparaissent automatiquement à minuit.

4. **Événements 2027** : ajouter `year: 2027` dans l'objet. Pas de `year` pour 2026 (valeur par défaut).

5. **Ne pas dupliquer** : avant d'ajouter, vérifier que l'événement n'existe pas déjà (même titre, même date).

6. **ID unique** : toujours incrémenter depuis le dernier ID dans le fichier.

7. **VÉRIFIER LE JOUR DE LA SEMAINE** : le champ `date` doit commencer par le bon abrégé (Lun/Mar/Mer/Jeu/Ven/Sam/Dim). Toujours vérifier avec `new Date(year, mois, jour).getDay()` avant d'insérer. Les erreurs de jour sont invisibles à l'œil nu mais font échouer les filtres "Aujourd'hui" et "Week-end".

8. **Couverture mensuelle** : toutes les catégories récurrentes (APÉRO, BRUNCH, ATELIER, BIEN-ÊTRE, CONFÉRENCE) doivent avoir au moins un événement par mois sur la fenêtre de 12 mois glissante. Vérifier les trous à chaque mise à jour.

9. **Fenêtre cible** : maintenir des événements du jour jusqu'à 12 mois plus tard. Au-delà de cette fenêtre les événements disparaissent via le filtre automatique.

10. **Lien direct billetterie** : le `link` doit permettre à l'utilisateur d'acheter ou réserver en ≤ 2 clics. Éviter les pages d'accueil génériques quand un lien direct de programme ou billetterie existe. Préférer les URLs finales sans redirections. **Les événements gratuits affichent aussi leur `link`** (bouton "Plus d'infos →" au lieu de "Réserver →") — toujours renseigner le `link` même si `free: true`.

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

## Pipelines automatiques (crontab actif)

Deux scripts tournent automatiquement via crontab :

### 1. `auto-events.mjs` — Ajout automatique d'événements (8h + 14h)
Scraper Playwright qui visite les sources officielles (OPMC, Grimaldi Forum, Culture Monaco, Cinémas, Ballet, Principocket, etc.), génère les objets événements complets, les insère dans `src/data/events.js`, puis build + commit + push automatiquement.

> **Principocket** (`principocket.com`) est une source interne de découverte : les liens et le nom du site ne sont jamais surfacés dans l'app. Les événements trouvés via principocket affichent le lieu officiel comme `source` et `link`.
```
0 8 * * *  node auto-events.mjs >> auto-events.log
0 14 * * * node auto-events.mjs >> auto-events.log
```
Rapport : `auto-events-report.txt`

### 2. `verify-events.mjs` — Vérification qualité (6h + 18h)

Script de vérification qui ne modifie rien mais génère un rapport de qualité.
```
0 6 * * *  node verify-events.mjs >> verify-events.log
0 18 * * * node verify-events.mjs >> verify-events.log
```

## Agent de vérification quotidienne

`verify-events.mjs` — script à la racine du projet. À lancer chaque jour à 6h.

```bash
# Lancer manuellement
node verify-events.mjs

# Crontab (6h00 chaque jour)
# crontab -e
0 6 * * * cd /Users/stephanieayre/monacout && node verify-events.mjs >> verify-events.log 2>&1
```

Le script vérifie :
- Tous les `descEn` présents
- Jours de la semaine corrects (Lun/Mar/Mer/Jeu/Ven/Sam/Dim)
- Événements > 30j dans le passé à supprimer
- Trous de couverture mensuelle (APÉRO, BRUNCH, ATELIER, BIEN-ÊTRE, CONFÉRENCE)
- **Liens accessibles** : teste chaque URL, signale les liens morts (❌), trop génériques (⚠️), ou à vérifier manuellement (💡)
  - ❌ = lien vide ou HTTP error
  - ⚠️ = page d'accueil sans bouton réservation détecté
  - 💡 = page avec bouton réservation — vérifier manuellement que c'est ≤ 2 clics

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
