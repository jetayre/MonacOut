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
| Equivoque Rooftop | http://www.equivoquemc.com/ | APÉRO, DJ SET | +33 6 07 93 47 45 |
| Trinity Monaco | https://www.instagram.com/trinitymonaco/ | APÉRO, SOIRÉE | |
| U Tapu | https://www.google.com/maps/search/U+Tapu+Marche+Condamine+Monaco | APÉRO (tapas corses-basques, marché Condamine) | +33 6 61 93 89 36 |
| Slammers Monaco | https://www.instagram.com/slammers_monaco/ | APÉRO, SOIRÉE (sports bar) | |
| Ship & Castle Monaco | https://www.instagram.com/shipandcastlemonaco/ | APÉRO (pub britannique, jeudi) | |
| Monaco Brewery | https://www.brasserie-de-monaco.com/ | APÉRO (craft beer, samedi) | |
| La Brasserie de Monaco | https://www.brasserie-de-monaco.com/ | BRUNCH, APÉRO (Fontvieille) | +377 9777 0990 |
| Panino Club Monaco | https://panino-club.com/ | APÉRO (vendredi, Blvd des Moulins) | |
| Buddha-Bar Monte-Carlo | https://www.fairmont.com/monte-carlo/dining/buddha-bar/ | APÉRO, SOIRÉE | +377 9999 8080 |
| AMU Monte-Carlo | https://amu-montecarlo.com/ | APÉRO, SOIRÉE | +377 9315 4848 |
| Nikki Beach Monte Carlo | https://nikkibeach.com/monte-carlo/ | BRUNCH, SOIRÉE | +377 9330 0700 |
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
| **Conférences & Business** | | | |
| One to One Monaco | https://www.onetoone-retail-ecommerce.com/ | CONFÉRENCE retail/IA/e-commerce | |
| PCD Group Monaco Conference | https://www.pcd.group/ | CONFÉRENCE finance/family office | |
| Monaco Blue Initiative | https://www.fpa2.org/en/events/monaco-blue-initiative | CONFÉRENCE océan/environnement | |
| Blue Economy & Finance Forum | https://www.beffmonaco.org/ | CONFÉRENCE finance durable/ESG | |
| Monaco Founders Summit | https://www.monacotech.mc/ | CONFÉRENCE startups/tech | |
| Sohn Monaco Investment Conference | https://sohnconferences.org/ | CONFÉRENCE hedge funds/finance | |
| Smart & Sustainable Marina | https://m3monaco.com/smart-events/smart-marina/ | CONFÉRENCE maritime/innovation | |
| MonacoTech | https://www.monacotech.mc/ | CONFÉRENCE startups/IA/Web3 (événements réguliers) | +377 9999 0009 |
| SPORTEL Monaco | https://www.sportelworld.com/ | CONFÉRENCE sport business | |
| EVER Monaco | https://www.ever-monaco.com/ | CONFÉRENCE mobilité/smart city | |
| Ready For IT | https://www.grimaldiforum.com/ | CONFÉRENCE cybersécurité/IT | |
| **Agendas de référence** | | | |
| Visit Monaco — agenda | https://www.visitmonaco.com/fr/page/evenement | Tous types | |
| Monaco Convention Bureau | https://cvb.visitmonaco.com/fr | Conférences & business events | |
| Grimaldi Forum — agenda | https://www.grimaldiforum.com/fr/agenda-monaco | Tous les événements au Grimaldi Forum | |

---

## Format d'un événement

```js
{
  id: 1394,                         // toujours incrémenter depuis le dernier ID (actuellement 1393)
  year: 2027,                       // seulement si 2027+, absent = 2026
  cat: "THÉÂTRE",                   // voir liste des catégories ci-dessous
  date: "Sam 30 mai",               // format: "JJJ D MMM" (JOURS_FR + MOIS)
  time: "20h30",
  title: "TITRE\nSUR PLUSIEURS\nLIGNES",   // \n pour sauts de ligne
  subtitle: "Lieu · Quartier",
  desc: "Description courte.",
  descEn: "Short description in English.",
  free: false,                      // true si entrée libre
  hot: true,                        // true si événement phare
  conf: true,                       // OPTIONNEL — fait apparaître l'événement dans le filtre Conférences sans changer sa cat
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
| Ateliers | ATELIER, DANSE |
| Bien-être | BIEN-ÊTRE |
| Cinéma | CINÉMA |
| **Conférences** | **CONFÉRENCE + SALON + `conf:true`** |
| Culture | MUSICAL, THÉÂTRE, CHANTS, EXPOSITION, OPÉRA, FESTIVAL, GALA, FÊTE NATIONALE, MARCHÉ, SALON, SPECTACLE, CINÉMA |
| Enchères | ENCHÈRES |
| Famille | `free:true` + ATELIER/SPECTACLE/CINÉMA/MARCHÉ/FESTIVAL/EXPOSITION/DANSE + mots-clés enfant |
| Foody | BRUNCH, APÉRO, SOIRÉE |
| Messes | CHANTS |
| Musique | CONCERT, CHANTS, MUSICAL, JAZZ LIVE, DJ SET, OPÉRA |
| Sport | FOOTBALL, BASKET, FORMULE 1, FORMULE E, SPORT, RALLYE, TENNIS |

> **`conf: true`** — champ optionnel qui fait apparaître un événement dans le filtre **Conférences** sans changer sa catégorie principale. À utiliser pour les événements ayant une dimension networking/conférence sans être `cat:"CONFÉRENCE"`. Exemples : Festival TV (id:45), Monaco Art Week (id:122).

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

6. **ID unique** : toujours incrémenter depuis le dernier ID dans le fichier. **Dernier ID utilisé : 1896.** Prochain ID : 1897.

7. **VÉRIFIER LE JOUR DE LA SEMAINE** : le champ `date` doit commencer par le bon abrégé (Lun/Mar/Mer/Jeu/Ven/Sam/Dim). Toujours vérifier avec `new Date(year, mois, jour).getDay()` avant d'insérer. Les erreurs de jour sont invisibles à l'œil nu mais font échouer les filtres "Aujourd'hui" et "Week-end".

8. **Couverture mensuelle** : toutes les catégories récurrentes (APÉRO, BRUNCH, ATELIER, BIEN-ÊTRE, CONFÉRENCE) doivent avoir au moins un événement par mois sur la fenêtre de 12 mois glissante. Vérifier les trous à chaque mise à jour.

9. **Fenêtre cible** : maintenir des événements du jour jusqu'à 12 mois plus tard. Au-delà de cette fenêtre les événements disparaissent via le filtre automatique.

10. **Lien direct billetterie** : le `link` doit permettre à l'utilisateur d'acheter ou réserver en ≤ 2 clics. Éviter les pages d'accueil génériques quand un lien direct de programme ou billetterie existe. Préférer les URLs finales sans redirections. **Les événements gratuits affichent aussi leur `link`** (bouton "Plus d'infos →" au lieu de "Réserver →") — toujours renseigner le `link` même si `free: true`.

11. **`conf: true`** : ajouter ce champ aux événements avec une dimension networking/conférence dont la `cat` n'est pas `CONFÉRENCE` (ex: SALON, FESTIVAL, EXPOSITION). Cela les fait apparaître dans le filtre Conférences de l'app. Ne pas l'ajouter aux événements purement artistiques ou sportifs.

12. **Principocket** (`principocket.com`) : source interne de découverte uniquement. Les liens et le nom du site ne doivent **jamais** être surfacés dans l'app. Les événements trouvés via principocket affichent le lieu officiel comme `source` et `link`.

---

## Récurrences générées (événements automatiques par lieu)

Ces lieux ont des événements récurrents générés jusqu'à mai 2027. Ne pas dupliquer en ajoutant des événements manuels pour les mêmes dates.

| Lieu | Récurrence | Jour | Catégorie |
|------|-----------|------|-----------|
| **Nobu Monte-Carlo** | Chaque dimanche | Dim | BRUNCH (rotation FOODY) |
| **Nobu Monte-Carlo** | Mensuel sam | Sam | SOIRÉE dîner (juil 2026→mai 2027) |
| **Woo Monaco** | Chaque lundi | Lun | BRUNCH (rotation FOODY) |
| **Sass Café** | Chaque mardi | Mar | APÉRO (rotation FOODY) |
| **Bar Américain** | Chaque mercredi | Mer | APÉRO (rotation FOODY) |
| **AMU Monte-Carlo** | Chaque jeudi | Jeu | APÉRO (rotation FOODY) |
| **La Note Bleue** | Chaque vendredi | Ven | APÉRO sunset (rotation FOODY) |
| **La Note Bleue** | Chaque samedi | Sam | BRUNCH (rotation FOODY) |
| **Panino Club** | Mensuel 3e ven | Ven | APÉRO (mai 2026→mai 2027) |
| **U Tapu** | Mensuel 3e ven | Ven | APÉRO (mai 2026→mai 2027) |
| **Trinity Monaco** | Mensuel dernier ven | Ven | APÉRO (mai 2026→mai 2027) |
| **Slammers** | Mensuel 2e jeu | Jeu | APÉRO (juin 2026→mai 2027) |
| **Ship & Castle** | Mensuel 1er jeu | Jeu | APÉRO pub night/quiz (juin 2026→mai 2027) |
| **Monaco Brewery** | Mensuel 2e sam | Sam | APÉRO craft beer (juin 2026→mai 2027) |
| **La Brasserie de Monaco** | Mensuel 1er sam | Sam | BRUNCH (juin 2026→mai 2027) |
| **Nikki Beach** | Mensuel sam | Sam | BRUNCH DJ (mai→sep 2026 + 2027) |
| **Jimmy'z** | Mensuel sam | Sam | SOIRÉE (mai 2026→mai 2027) |
| **Lilly's Club** | Mensuel 3e sam | Sam | SOIRÉE (mai 2026→mai 2027) |
| **Jack Monaco** | Mensuel (ven APÉRO / sam SOIRÉE) | Ven/Sam | APÉRO + SOIRÉE (mai 2026→mai 2027) |
| **Amber Lounge** | 3 galas hors GP | Sam | GALA (sep & nov 2026, avr 2027) |
| **Equivoque Rooftop** | Bi-mensuel ven | Ven | APÉRO + DJ SET (mai→oct 2026 + 2027) |
| **Sunset Monaco** | Mensuel sam | Sam | DJ SET (juil→sep 2026 + 2027) |
| **Blue Gin** | Mensuel jeu ou sam | Jeu/Sam | APÉRO (mai 2026→mai 2027) |

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

## Architecture du projet

### Stack technique
- **React 19 + Vite 8** — SPA, pas de routing côté serveur
- **PWA** — manifest.json + sw.js (Service Worker offline)
- **Styles inline uniquement** — pas de CSS modules, pas de Tailwind
- **Déploiement** — Vercel, auto-deploy sur `git push origin main`
- **Repo GitHub** — https://github.com/jetayre/MonacOut (branche `main`)
- **Analytics** — PostHog (EU) initialisé dans `main.jsx` — dashboard : eu.posthog.com
- **Error tracking** — Sentry (EU) initialisé dans `main.jsx` — dashboard : sentry.io

### Arborescence

```
monacout/
├── src/
│   ├── main.jsx                   ← point d'entrée React + init PostHog + init Sentry
│   ├── App.jsx                    ← state global (tab, favorites, lang, catFilter, showCats, showSearch)
│   ├── i18n.js                    ← traductions FR/EN (objet T[lang]) — tagline: "Monaco Secret", nav: "MC Events" / "My Agenda"
│   ├── App.css / index.css        ← styles globaux minimaux
│   ├── data/
│   │   └── events.js              ← SOURCE DE VÉRITÉ : tableau _RAW + export ALL_EVENTS
│   └── components/
│       ├── Shell.jsx              ← frame iPhone 393×852, nav bar (FR gauche + EN/loupe droite), category bar, scroll
│       ├── EventCard.jsx          ← carte événement (cadre or/navy, date centrée + heure, bouton "Let's go")
│       ├── MonacOutLogo.jsx       ← logo bicolore : "Monac" Cormorant Garamond or #C9A96E + "Out" Great Vibes navy #0F1D3A
│       ├── CalendarPicker.jsx     ← sélecteur de date pour filtre agenda
│       ├── SectionTitle.jsx       ← titre de section
│       └── screens/
│           ├── HomeScreen.jsx     ← filtre temps + quartier + catégorie + recherche
│           ├── FavoritesScreen.jsx← agenda des favoris
│           ├── DetailScreen.jsx   ← vue complète + "Voir aussi"
│           ├── AgendaScreen.jsx   ← (non actif)
│           ├── MapScreen.jsx      ← (non actif)
│           └── ProfileScreen.jsx  ← (non actif)
├── public/
│   ├── manifest.json              ← PWA manifest
│   ├── sw.js                      ← Service Worker (offline)
│   ├── favicon.svg
│   ├── venues.html                ← liste publique des lieux avec liens
│   └── venues.csv
├── auto-events.mjs                ← scraper Playwright (GitHub Actions)
├── verify-events.mjs              ← vérification qualité (rapport)
├── autofix-events.mjs             ← correction automatique jours de semaine
├── cleanup-events.mjs             ← suppression événements > 30j passés
├── send-alert-email.mjs           ← alerte email via Resend API
├── scrape-events.mjs              ← outil de scraping manuel
└── .github/workflows/
    ├── auto-events.yml            ← scraping automatique (8h + 14h Monaco)
    ├── daily-check.yml            ← nettoyage + vérif + alerte (6h + 18h Monaco)
    └── weekly-scan.yml            ← scan complet (lundi 7h Monaco)
```

### State principal (App.jsx)

| State | Type | Rôle |
|-------|------|------|
| `tab` | `"events"` \| `"agenda"` | onglet actif |
| `favorites` | `number[]` | IDs favoris (localStorage) |
| `lang` | `"fr"` \| `"en"` | langue |
| `homeFilter` | `"all"` \| `"today"` \| `"week"` \| `"weekend"` \| `"calendar"` | filtre temps |
| `showCats` | `boolean` | barre catégories visible (défaut: `false` — s'active au clic sur onglet MC Events, se désactive sur My Agenda) |
| `catFilter` | `string \| null` | filtre catégorie actif |
| `showSearch` | `boolean` | barre recherche visible — state levé à App, passé à Shell + HomeScreen |

### Logique de filtres (HomeScreen.jsx)

`filterByTime` → `today` / `week` (7 jours) / `weekend` / `calendar` (date range CalendarPicker)

`filterByCat` :
| Bouton Shell | Cas filterByCat | Logique |
|-------------|----------------|---------|
| Ateliers | `"ateliers"` | ATELIER, DANSE |
| Bien-être | `"bienetre"` | BIEN-ÊTRE |
| Cinéma | `"cinema"` | CINÉMA |
| **Conférences** | `"conference"` | **`cat === "CONFÉRENCE"` OU `cat === "SALON"` OU `conf === true`** |
| Culture | `"culture"` | MUSICAL, THÉÂTRE, CHANTS, EXPOSITION, OPÉRA, FESTIVAL, GALA, FÊTE NATIONALE, MARCHÉ, SALON, SPECTACLE, CINÉMA |
| Enchères | `"encheres"` | ENCHÈRES |
| Famille | `"famille"` | `free:true` + ATELIER/SPECTACLE/CINÉMA/MARCHÉ/FESTIVAL/EXPOSITION/DANSE + regex enfant |
| Foody | `"foody"` | BRUNCH, APÉRO, SOIRÉE |
| Messes | `"messe"` | CHANTS |
| Musique | `"music"` | CONCERT, CHANTS, MUSICAL, JAZZ LIVE, DJ SET, OPÉRA |
| Sport | `"sport"` | FOOTBALL, BASKET, FORMULE 1, FORMULE E, SPORT, RALLYE, TENNIS |

Filtre quartier dans `HomeScreen` (barre secondaire, disparaît au scroll) :
- `quarterFilter` : Monte-Carlo / Monaco-Ville / Fontvieille / La Condamine / Larvotto
- ~~`freeOnly`~~ : **supprimé** — le bouton Gratuit a été retiré de l'interface

### Shell.jsx — comportement UI

- **Category bar (Ateliers → Sport)** : cachée par défaut, apparaît au clic sur l'onglet MC Events, se cache en scrollant vers le bas, réapparaît en remontant. Double-tap sur MC Events pour toggle manuel.
- **Scroll detection category bar** : via `useEffect` sur `main-scroll` dans Shell, état `catsVisible`, `maxHeight` 70px → 0px.

### HomeScreen.jsx — comportement UI

| Barre | Comportement au scroll |
|-------|----------------------|
| Monaco Secret + Logo cadre | **Toujours fixe** — ne disparaît jamais |
| Aujourd'hui / Semaine / Week-end / Agenda | **Toujours fixe** — ne disparaît jamais |
| Quartiers | **Disparaît** en scrollant vers le bas, réapparaît en remontant |

- **Scroll detection** : `useEffect` sur `document.getElementById("main-scroll")`, état `filtersVisible`, seuil ±6px sur `lastY`.
- **Scroll reset** : `main-scroll.scrollTop = 0` à chaque changement d'onglet, filtre temps, filtre catégorie ou quartier (dans `App.jsx` et `HomeScreen.jsx`).
- **Filtres temps** : `TIME_FILTERS` = today, week, weekend, calendar. Clic sur filtre actif → revient à "all".
- **Quartiers** : boutons plus petits (font 9px, padding 3px 8px), Monte-Carlo / Monaco-Ville / Fontvieille / La Condamine / Larvotto.
- **Gratuit** : bouton supprimé de l'interface (le champ `free: true` reste dans les données).
- **Boutons filtres inactifs** : fond ivoire `#FDFAF5` (même couleur que les cartes événements).
- **Bouton billetterie** : "Let's go" (payant) / "Plus d'infos" (gratuit) / "More info" / "Book" (EN).

### Shell.jsx — nav bar

- **FR** : bouton à gauche de l'onglet MC Events — `setLang("fr")`, toujours transparent (pas de fond coloré actif).
- **EN** : bouton à droite de l'onglet My Agenda.
- **Loupe 🔍** : entre My Agenda et EN — toggle `showSearch` (state dans App.jsx).
- **Header** : fond ivoire `#FDFAF5` (pas blanc).

### MonacOutLogo.jsx — design

- **"Monac"** : Cormorant Garamond, weight 300, or doux `#C9A96E`, 106px (scale 190/290).
- **"Out"** : Great Vibes (script cursive), weight 400, navy `#0F1D3A`, 108px.
- Police Great Vibes chargée dans `index.css` via Google Fonts.

### HomeScreen.jsx — cadre logo

Cadre double bicolore : extérieur `1.5px solid #C9A96E` (or) + intérieur `2px solid #0F1D3A` (navy).
Coins ornementaux ✦ en or aux 4 angles. Contenu (haut → bas) :
1. **MONACO SECRET** — Cormorant Garamond 12px bold, navy, petites majuscules, marginTop 8px
2. **MonacOutLogo** width=190
3. **MONACO LIFESTYLE & EVENTS AGENDA** — même style, marginTop 3px

---

## Pipelines automatiques

### GitHub Actions (3 workflows)

**1. `auto-events.yml` — Scraping Playwright**
- Déclenche : **8h Monaco** (0 6 UTC) + **14h Monaco** (0 12 UTC) + manuel
- Script : `auto-events.mjs`
- Ce qu'il fait : visite les sources officielles avec Playwright/Chromium, génère des objets événements, insère dans `src/data/events.js`, `npm run build`, `git commit`, `git push`
- Rapport : `auto-events-report.txt`
- Runner : GitHub Actions (ubuntu-latest, Node 20)

> **Principocket** (`principocket.com`) est une source interne de découverte uniquement. Les liens et le nom du site ne sont **jamais** surfacés dans l'app — les événements trouvés via principocket affichent le lieu officiel comme `source` et `link`.

**2. `daily-check.yml` — Nettoyage & Vérification**
- Déclenche : **6h Monaco** (0 4 UTC) + **18h Monaco** (0 16 UTC) + manuel
- Séquence :
  1. `cleanup-events.mjs` — supprime événements > 30j passés
  2. `autofix-events.mjs` — corrige les erreurs de jour de semaine
  3. `verify-events.mjs` — génère rapport qualité (`verify-events-report.txt`)
  4. `send-alert-email.mjs` — envoie un email si `verify-events` échoue (via secret `RESEND_API_KEY`)
  5. Si `src/data/events.js` modifié → build + commit + push
- Runner : GitHub Actions (ubuntu-latest, Node 20)

**3. `weekly-scan.yml` — Scan hebdomadaire**
- Déclenche : **lundi 7h Monaco** (0 5 UTC) + manuel
- Script : `scripts/weekly-scan.mjs`
- Pas de permissions `write`, pas de push

### Crontab local (machine Stéphanie)

```
0 6  * * *  /usr/local/bin/node /Users/stephanieayre/monacout/verify-events.mjs >> verify-events.log 2>&1
0 18 * * *  /usr/local/bin/node /Users/stephanieayre/monacout/verify-events.mjs >> verify-events.log 2>&1
```

### Secret GitHub requis

`RESEND_API_KEY` — clé API Resend pour les alertes email. À configurer dans Settings > Secrets > Actions du repo GitHub.

---

## Monitoring & Observabilité

### PostHog — Analytics utilisateur
- **Dashboard** : https://eu.posthog.com
- **Projet** : MonacOut
- **Ce qui est tracké automatiquement** : pages vues, clics, sessions, pays, appareil
- **Initialisation** : `src/main.jsx` — clé `phc_qfThmficvfkSEgsMLbKiJcgiHRYyAJ5GU2i8pavYYzNU`
- **Serveur** : EU (`eu.i.posthog.com`)

### Sentry — Error tracking
- **Dashboard** : https://sentry.io → projet MonacOut
- **Ce qui est tracké** : toutes les erreurs JS runtime, stack traces, navigateur/OS
- **Initialisation** : `src/main.jsx` — DSN `https://ad492b22...ingest.de.sentry.io/4511417016516688`
- **Serveur** : EU (`.ingest.de.sentry.io`)
- **Taux de capture** : 100% (`tracesSampleRate: 1.0`)

### Vercel — Déploiement continu
- Chaque `git push origin main` déclenche automatiquement un déploiement production
- URL production : https://monacout.vercel.app
- Logs de build : dashboard Vercel → projet monacout → Deployments

---

## Workflow de mise à jour manuelle

```bash
# 1. Modifier src/data/events.js
# 2. Builder et vérifier
npm run build

# 3. Committer et pousser (Vercel redéploie automatiquement)
git add src/data/events.js
git commit -m "chore: mise à jour événements $(date +%Y-%m-%d)"
git push origin main
```

### Vérification manuelle

```bash
node verify-events.mjs          # rapport qualité → verify-events-report.txt
node cleanup-events.mjs         # supprime événements passés
node autofix-events.mjs         # corrige jours de semaine
```
