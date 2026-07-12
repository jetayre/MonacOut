# MonacOut — Instructions pour Claude

## Projet
App de sorties Monaco. React + Vite. Déployée automatiquement sur Vercel via git push to `main` (repo: jetayre/MonacOut).

> **URL / domaines (important)** : le projet Vercel qui reçoit les déploiements est **`monac-out.vercel.app`** (AVEC tiret) — c'est la version à jour. `monacout.vercel.app` (sans tiret) est un ancien déploiement qui peut être en retard. Le code fetch encore les données live sur `monacout.vercel.app` (les deux servent les mêmes données). **Domaine propre : `monacout.com`** (OVH, DNS Vercel, propriété de Stéphanie) — vérifié dans Resend pour l'envoi d'emails.

## Journal — 9 juil 2026 (session email + social + design)
- **Fix critique auth** : lien magique cassé en natif (`emailRedirectTo` valait `capacitor://localhost` → « adresse invalide » Safari). Corrigé : redirige vers `https://monac-out.vercel.app` en natif (`useAuth.js`) + `appUrlOpen` récupère la session (`setSession`/`exchangeCodeForSession`) dans `App.jsx`.
- **Emails à la marque** : domaine `monacout.com` vérifié dans **Resend** (EU). **Supabase → Custom SMTP** activé (host `smtp.resend.com`, port 465, user `resend`, pass = clé Resend, sender **`bonjour@monacout.com`**). Chaîne testée OK (email « Your sign-in link » delivered). Supabase URL Config : Site URL + Redirect URLs incluent `https://monac-out.vercel.app`. ⚠️ Régénérer la clé Resend (collée en clair pendant la session). Voir mémoire [[project-email-domain-monacout]].
- **Email de connexion redessiné** à la marque (à coller dans Supabase Templates Magic Link + Confirm signup si besoin).
- **Prénom** : salutation « Bonjour, <prénom> » dans le menu (Shell) ET sous le logo sur l'accueil (HomeScreen, prop `userName`). Le prénom vient de `profiles.display_name` (saisi à la 1ʳᵉ connexion). AuthScreen/App demandent le prénom si `!auth.profile?.display_name` (pas seulement si profil absent).
- **Fiches événement (EventCard)** : bouton lien = icône website seule (retrait du mot RÉSERVER/INFOS) à côté du tel ; **icône amis toujours visible** (grise si personne, dorée + avatars si des amis y vont) **collée au cœur** à droite ; cadre « J'y vais » en or ; « J'y vais » collé à « Mon calendrier » (au lieu de « Ajouter au calendrier »). `FriendAvatars` : 3 avatars max + « +N ».
- **Détail événement (Shell popup)** : affiche les amis qui y vont (« Léa et Marc y vont »), via prop `social`.
- **Email de contact** : `contact@monacout.com` dans le code (App fallback, Shell « Proposer un événement », FriendsScreen suppression compte, confidentialite.html). ⚠️ `public/notif-config.json` garde `eventsmonacout@gmail.com` tant que la **réception** de contact@ n'est pas active (ImprovMX à faire).
- **iOS v1.9 build 20** archivée (`~/Library/Developer/Xcode/Archives/2026-07-09/MonacOut-1.9.xcarchive`, com.monacout, pas de widget parasite). Reste : upload via Xcode Organizer + Submit for Review.
- **Captures App Store** régénérées (anglais, 1179×2556) dans `~/Desktop/MonacOut_AppStore_Screenshots_NEW/` : 01-home (favori/cœur rouge + 2 amis), 02-sport (10 amis), 03-nightlife (Happy Hours & soirées, 8 amis).

## Rôle de Claude
Vérifier les sources officielles **2 fois par jour** (6h et 18h), identifier les nouveaux événements, mettre à jour `src/data/events.js`, puis builder et pousser.

---

## Sources officielles à vérifier (exhaustif)

| Source | URL | Catégories | Contact lieu |
|--------|-----|------------|--------------|
| Opéra de Monte-Carlo — concerts | https://opmc.mc/en/concert/ | CONCERT, OPÉRA | +377 9200 1370 | ⚠️ **opmc.mc bloque le proxy — passer par WebSearch** (ex: `"opéra Monte-Carlo ballet juillet 2026"`) |
| Opéra de Monte-Carlo — saison lyrique | https://opmc.mc/en/season-25-26/ | OPÉRA, MUSICAL | +377 9200 1370 | ⚠️ **opmc.mc bloque le proxy — passer par WebSearch** |
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
| Stars of Monaco | https://starsofmonaco.com | APÉRO, JAZZ LIVE, SOIRÉE (Quai Antoine 1er, rouvert juin 2026) | +377 9797 9595 |
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
| Monaco Classic Week (YCM) | https://monacoclassicweek.com/ | SPORT voile classique — biennale années impaires (2027, 2029…) | +377 9310 6300 |
| CREM Monaco | https://www.crem.mc/ | APÉRO, GALA — Club des Résidents Étrangers de Monaco | |
| Monaco Energy Boat Challenge | https://energyboatchallenge.com/ | SPORT nautique — énergie alternative | +377 9315 2600 |
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
| Buddha-Bar Monte-Carlo | https://www.buddhabar.com/en/restaurants/buddha-bar-monte-carlo/ | APÉRO, SOIRÉE | +377 9999 8080 |
| Turbo Monaco | https://www.turbomonaco.com/ | SOIRÉE (GP week + saison) | +377 9999 2000 |
| AMU Monte-Carlo | https://amu-montecarlo.com/ | APÉRO, SOIRÉE | +377 9315 4848 |
| Nikki Beach Monte Carlo | https://nikkibeach.com/monte-carlo/ | BRUNCH, SOIRÉE | +377 9330 0700 |
| Le Méridien Beach Plaza | https://www.marriott.com/en-us/hotels/mcmmd-le-meridien-beach-plaza/overview/ | BRUNCH, SOIRÉE, BIEN-ÊTRE (Larvotto) | +377 93 30 98 80 |
| Lilly's Club | https://lillysclub.com/ | SOIRÉE, DJ SET | |
| Amber Lounge Monaco | https://www.amberlounge.com/events/monaco-2026/ | SOIRÉE, GALA | |
| Jack Monaco | https://jackmonaco.playfun.tv/ | APÉRO, SOIRÉE | |
| Nobu Monte-Carlo | https://www.fairmont.com/en/hotels/monte-carlo/fairmont-monte-carlo/dining/nobu.restaurant.html | SOIRÉE | |
| Castelroc Monaco | https://www.castelrocmonaco.com/ | BRUNCH, APÉRO (Place du Palais, Monaco-Ville) | +377 93 30 36 68 |
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
| WAIB Summit Monaco | https://www.waibsummit.com/ | CONFÉRENCE Web3/IA/crypto (post-GP, One Monte-Carlo) | |
| Hoolon Wellness Monaco | https://hoolonwellness.com/ | BIEN-ÊTRE, ATELIER (yoga, breathwork, massage) | +377 9992 5510 |
| Sohn Monaco Investment Conference | https://sohnconferences.org/ | CONFÉRENCE hedge funds/finance | |
| Smart & Sustainable Marina | https://m3monaco.com/smart-events/smart-marina/ | CONFÉRENCE maritime/innovation | |
| MonacoTech | https://www.monacotech.mc/ | CONFÉRENCE startups/IA/Web3 (événements réguliers) | +377 9999 0009 |
| SPORTEL Monaco | https://www.sportelworld.com/ | CONFÉRENCE sport business | |
| EVER Monaco | https://www.ever-monaco.com/ | CONFÉRENCE mobilité/smart city | |
| Ready For IT | https://www.grimaldiforum.com/ | CONFÉRENCE cybersécurité/IT | |
| **Associations & Fondations monégasques** (URLs vérifiées — veille Stéphanie) | | | |
| _— Fondations_ | | | |
| Fondation Prince Albert II de Monaco | https://www.fpa2.org/fr/index | environnement, climat, biodiversité, océans (GALA/CONFÉRENCE) | +377 9850 9160 |
| Fondation Princesse Grace de Monaco | https://www.fondation-psse-grace.mc/fr/ | aide aux vulnérables, action sociale, culture (GALA) | +377 9350 0100 |
| Fondation Prince Pierre de Monaco | https://www.fondationprincepierre.mc/evenements | littérature, musique, arts (prix, CONCERT) | |
| Fondation Albert Ier / Institut océanographique | https://www.oceano.org/ | patrimoine scientifique, océanographie | |
| Fondation Centesimus Annus Pro Pontifice | https://www.centesimusannus.org/ | réflexion économique & sociale (CONFÉRENCE) | |
| Fondation Princesse Charlène de Monaco | https://www.fondationprincessecharlene.mc | prévention noyade, SPORT (GALA) | +377 9898 9999 |
| _— Humanitaire (Monaco Collectif Humanitaire)_ | https://mch.mc | caritatif, GALA, collectes | |
| Croix-Rouge Monégasque | https://croix-rouge.mc/ | GALA, braderie, formations (Gala été · Salle des Étoiles) | +377 9765 8888 |
| AMADE | https://www.amade.org/ | protection de l'enfance (Princesse Caroline, GALA) | +377 9798 4400 |
| AMREF Monaco | https://www.amref.fr/ | santé en Afrique | |
| Caritas Monaco | https://www.caritas-monaco.com/ | solidarité | |
| Children & Future | https://childrenandfuture.com/ | enfance/solidarité (No Finish Line) | |
| Mission Enfance | https://www.missionenfance.org/ | aide à l'enfance | |
| Monaco Aide et Présence | https://mapmonaco.org/ | humanitaire | |
| Share Monaco | https://sharemonaco.org/ | humanitaire | |
| Association Anna Pagani | https://osimonaco.org/ | solidarité | |
| Amitié Sans Frontières International | https://www.asf-i.org/ | humanitaire | |
| Société Saint-Vincent-de-Paul Monaco | https://www.ssvpmonaco.com/ | solidarité | |
| Les Amis du Liban Monaco | https://osimonaco.org/ | humanitaire | |
| Kiwanis Club de Monaco | https://www.kiwanis.mc/ | club service, caritatif | |
| Rotary Club de Monaco | https://www.rotary.mc/ | club service (réunions statutaires — pas de fiche sortie) | |
| _— Santé_ | | | |
| Fight Aids Monaco | https://fightaidsmonaco.org/ | GALA, vente aux enchères (Princesse Stéphanie · Sporting) | +377 9707 1300 |
| Asso. Monégasque Recherche Alzheimer (AMRA) | https://www.amramonaco.com/ | santé, recherche | |
| Les Enfants de Frankie | https://www.lesenfantsdefrankie.mc/ | enfance malade | |
| Les Smileys de Monaco | https://osimonaco.org/ | santé/solidarité | |
| _— Environnement_ | | | |
| Monaco Blue Initiative | https://www.monacoblueinitiative.org/ | CONFÉRENCE océan | |
| Association Art & Environnement Monaco | https://osimonaco.org/ | art/environnement | |
| MC2D | https://www.mc2d.org/ | développement durable | |
| _— Culture & patrimoine_ | | | |
| Association Monaco Italie | https://www.monaco-italie.mc/ | culture/relations internationales | |
| Monaco Asie | https://osimonaco.org/ | culture/relations internationales | |
| Les Petits Chanteurs de Monaco | https://www.petits-chanteurs-monaco.com/ | musique, CHANTS | |
| Association des Amis de l'Opéra de Monte-Carlo | https://www.opera.mc/ | OPÉRA, culture | |
| _— Sport_ | | | |
| Comité Olympique Monégasque | https://www.comite-olympique.mc/ | SPORT | |
| Guides et Scouts de Monaco | https://www.guides-scouts-monaco.com/ | jeunesse | |
| _— Économie & réseau_ | | | |
| Monaco Economic Board | https://www.meb.mc/ | CONFÉRENCE économie/business | |
| Jeune Chambre Économique de Monaco | https://www.jcemonaco.mc/ | économie/citoyenneté | |
| Association des Industries Hôtelières Monégasques | https://www.aihm.mc/ | professionnel, hôtellerie | |
| **Agendas de référence** | | | |
| Visit Monaco — agenda | https://www.visitmonaco.com/fr/page/evenement | Tous types | |
| Your Monaco — app officielle | https://yourmonaco.mc/en/latest-features/events-calendar | Tous types — app civique officielle de Monaco | |
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

6. **ID unique** : toujours incrémenter depuis le dernier ID dans le fichier. **Dernier ID utilisé : 1947.** Prochain ID : 1948.

7. **VÉRIFIER LE JOUR DE LA SEMAINE** : le champ `date` doit commencer par le bon abrégé (Lun/Mar/Mer/Jeu/Ven/Sam/Dim). Toujours vérifier avec `new Date(year, mois, jour).getDay()` avant d'insérer. Les erreurs de jour sont invisibles à l'œil nu mais font échouer les filtres "Aujourd'hui" et "Week-end".

8. **Couverture mensuelle** : toutes les catégories récurrentes (APÉRO, BRUNCH, ATELIER, BIEN-ÊTRE, CONFÉRENCE) doivent avoir au moins un événement par mois sur la fenêtre de 12 mois glissante. Vérifier les trous à chaque mise à jour.

9. **Fenêtre cible** : maintenir des événements du jour jusqu'à 12 mois plus tard. Au-delà de cette fenêtre les événements disparaissent via le filtre automatique.

10. **Lien direct billetterie** : le `link` doit permettre à l'utilisateur d'acheter ou réserver en ≤ 2 clics. Éviter les pages d'accueil génériques quand un lien direct de programme ou billetterie existe. Préférer les URLs finales sans redirections. **Les événements gratuits affichent aussi leur `link`** (bouton "Plus d'infos →" au lieu de "Réserver →") — toujours renseigner le `link` même si `free: true`.

11. **`conf: true`** : ajouter ce champ aux événements avec une dimension networking/conférence dont la `cat` n'est pas `CONFÉRENCE` (ex: SALON, FESTIVAL, EXPOSITION). Cela les fait apparaître dans le filtre Conférences de l'app. Ne pas l'ajouter aux événements purement artistiques ou sportifs.

12. **Principocket** (`principocket.com`) : source interne de découverte uniquement. Les liens et le nom du site ne doivent **jamais** être surfacés dans l'app. Les événements trouvés via principocket affichent le lieu officiel comme `source` et `link`.

13. **Lieu précis obligatoire** : le champ `subtitle` doit toujours contenir le nom exact de la salle ou du lieu (pas seulement la ville). Exemples corrects :
    - `subtitle: "Salle Garnier · Monte-Carlo"` ✅
    - `subtitle: "Médiathèque Caroline · Monaco"` ✅
    - `subtitle: "Espace Léo Ferré · Fontvieille"` ✅
    - `subtitle: "Monaco"` ❌ (trop vague)
    - `subtitle: "Monte-Carlo"` ❌ (trop vague)
    Le format cible est `"Salle / Lieu · Quartier"`. Toujours renseigner le quartier dans `quarter` également.

14. **Téléphone obligatoire** : le champ `phone` doit toujours être renseigné quand un numéro de téléphone existe pour le lieu. Consulter la table des sources ci-dessus — elle contient les téléphones de tous les lieux récurrents. Ne jamais laisser `phone: ""` (champ vide) : soit renseigner le numéro, soit ne pas inclure le champ `phone` du tout.

15. **Portée géographique stricte : Monaco uniquement** : MonacOut ne référence que des événements ayant lieu **sur le territoire de la Principauté de Monaco**. Ne jamais créer une fiche pour un événement se déroulant à Nice, Menton, Cannes, Lugano, Paris ou ailleurs, même si l'organisateur est monégasque (ex : Monaco Legend Auctions Exclusive Timepieces → se tient à Lugano → à exclure). Vérifier systématiquement le lieu de l'événement, pas seulement le nom de l'organisateur.

16. **Interdiction des liens généralistes** : les sites agrégateurs ou d'agenda générique ne doivent **jamais** apparaître dans le champ `link`. Sont interdits comme `link` :
    - `visitmonaco.com` / `yourmonaco.mc` — interdits même pour les pages de lieu
    - `principocket.com` — interdit (source interne uniquement, règle 12)
    - `monte-carlo.mc` — interdit (portail SBM généraliste, même pour les pages "Théâtre des Variétés")
    - `culture.mc/en/what-s-on` ou toute page d'agenda de culture.mc — interdit
    - tout autre site d'office du tourisme ou d'agenda générique
    **Exception autorisée** : `mairie.mc` peut être utilisé comme `link` uniquement pour les événements en plein air ou dans des espaces publics qui n'ont pas de page de billetterie ou de lieu propre (feux d'artifice, fête nationale, yoga sur la plage, marchés…). Préférer les pages spécifiques quand elles existent : `/la-fete-de-la-musique`, `/les-soirees-feux-dartifice-au-quai-albert-1er`, `/le-village-de-noel`, `/la-fete-nationale`, `/journee-de-la-petite-enfance`, `/lespace-lamartine` (yoga/pilates). Pour les milongas/tango sur la Digue — aucune page spécifique n'existe sur mairie.mc, `mairie.mc/agenda` est le seul lien disponible.
    Ces sites ne servent sinon qu'à la découverte (`source`). Le `link` doit pointer vers **le site du lieu ou de la billetterie officielle**. Si aucun lien direct n'existe, ne pas mettre de `link` plutôt que de mettre un lien inutile.

17. **Vérification obligatoire des dates avant publication** : ne jamais inventer ou extrapoler une date. Avant d'ajouter un événement, **vérifier la date sur la source officielle** (site du lieu, billetterie, ou source indiquée dans la table des sources). En particulier :
    - Vérifier le **jour de la semaine** avec `new Date(année, mois-1, jour).getDay()` (règle 7)
    - Vérifier que **le lieu de l'événement est bien à Monaco** (règle 15) — un organisateur monégasque peut organiser un événement hors Monaco
    - **Calendrier scolaire Monaco** : pas de "vacances de Pentecôte" en Principauté. Le seul congé lié à Pentecôte est le **Lundi de Pentecôte** (jour férié unique). Les congés scolaires autour du GP sont le **break Grand Prix** (~4 jours, mercredi soir → lundi matin). Ne jamais créer d'ateliers enfants étiquetés "vacances de Pentecôte" sur plusieurs jours — les enfants sont en classe.
    - Vérifier que le **mois et l'année** correspondent bien à l'édition annoncée (ex : un salon annuel peut changer de date d'une année à l'autre — ex : Green Shift Festival 2026 était en **avril** au Yacht Club de Monaco, pas en octobre au Grimaldi Forum)
    - Si la date n'est pas encore publiée par l'organisateur, **ne pas créer l'événement** — attendre la confirmation officielle
    - Un événement avec une date incorrecte est pire qu'un événement absent : il trompe l'utilisateur

18. **Horaire des événements de soirée (apéro / nightlife)** : pour un événement de type APÉRO, SOIRÉE, JAZZ LIVE, DJ SET dont l'heure exacte n'est pas publiée par le lieu, ne pas bloquer l'ajout — le placer **en fin de journée sans heure précise** : `time: "En soirée"` (ou `"Soirée"`). La règle « ne pas inventer » s'applique à la **date/jour** (à vérifier absolument), pas à l'heure exacte d'un apéro. Ne jamais inventer une heure précise ; utiliser « En soirée » quand elle est inconnue.

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
│   ├── App.jsx                    ← state global (tab, favorites, lang, homeFilter, catFilters, showMenu, selectedEvent, showAdmin)
│   ├── i18n.js                    ← traductions FR/EN (objet T[lang]) — tagline: "Monaco Secret", nav: "MC Events" / "My Agenda"
│   ├── App.css / index.css        ← styles globaux minimaux
│   ├── data/
│   │   └── events.js              ← SOURCE DE VÉRITÉ : tableau _RAW + export ALL_EVENTS
│   └── components/
│       ├── Shell.jsx              ← frame iPhone 393×852, conteneur scroll, panneau menu (slide droite), popup événement, overlay sombre
│       ├── EventCard.jsx          ← carte événement (cadre double or/bleu, date + heure, RÉSERVER/BOOK, "Ajouter au calendrier"/"Add to calendar", favori)
│       ├── MonacOutLogo.jsx       ← logo nautique : grand M Playfair Display navy + MONAC'OUT Josefin Sans, cadre double or/navy
│       ├── CalendarPicker.jsx     ← sélecteur de date pour filtre agenda
│       ├── SectionTitle.jsx       ← titre de section
│       └── screens/
│           ├── HomeScreen.jsx     ← filtre temps + quartier + catégories + liste événements
│           ├── FavoritesScreen.jsx← agenda des favoris
│           ├── AdminScreen.jsx    ← overlay admin (5 taps logo, jamais routé)
│           ├── DetailScreen.jsx   ← (non actif — jamais importé dans App.jsx)
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
├── autofix-events.mjs             ← correction automatique jours de semaine + fêtes mobiles
├── cleanup-events.mjs             ← suppression événements > 30j passés
├── cross-check-dates.mjs          ← vérification croisée dates vs PrinciPocket (source interne)
├── send-alert-email.mjs           ← alerte email via Resend API
├── scrape-events.mjs              ← outil de scraping manuel
├── generate-icons.mjs             ← génération icônes PWA (Playwright → PNG)
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
| `lang` | `"fr"` \| `"en"` | langue — switché par les boutons fr/en sous le hamburger dans HomeScreen |
| `homeFilter` | `"all"` \| `"today"` \| `"week"` \| `"weekend"` \| `"calendar"` | filtre temps |
| `catFilters` | `string[]` | filtres catégories actifs (multi-sélection via menu panneau) |
| `showMenu` | `boolean` | panneau menu latéral ouvert/fermé |
| `selectedEvent` | `object \| null` | événement sélectionné → affiche la popup dans Shell |
| `showAdmin` | `boolean` | overlay admin (5 taps sur le logo) |

### Logique de filtres (HomeScreen.jsx)

`filterByTime` → `today` / `week` (7 jours) / `weekend` / `calendar` (date range CalendarPicker)

`filterByCats` (multi-sélection, `catFilters[]`) :
| Bouton menu | Cas filterByCats | Logique |
|------------|----------------|---------|
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

- **Catégories (Ateliers → Sport)** : checkboxes dans le panneau menu latéral (pas de barre séparée). Multi-sélection, état `catFilters[]` géré dans App.jsx. Bouton "Tout effacer" affiché si au moins un filtre actif.
- **Popup événement** : s'affiche quand `selectedEvent` est non-null, centré dans la frame iPhone.

### HomeScreen.jsx — comportement UI

| Barre | Comportement au scroll |
|-------|----------------------|
| Logo (rayures + hamburger + fr/en + cœur) | **Toujours fixe** — ne disparaît jamais |
| Aujourd'hui / Semaine / Week-end / Agenda | **Disparaît** en scrollant vers le bas, réapparaît en remontant |
| Quartiers | **Disparaît** en scrollant vers le bas, réapparaît en remontant |

- **Scroll detection** : `useEffect` sur `document.getElementById("main-scroll")`, état `filtersVisible`, seuil ±6px sur `lastY`.
- **Scroll reset** : `main-scroll.scrollTop = 0` à chaque changement d'onglet, filtre temps, filtre catégorie ou quartier (dans `App.jsx` et `HomeScreen.jsx`).
- **Filtres temps** : `TIME_FILTERS` = today, week, weekend, calendar. Clic sur filtre actif → revient à "all".
- **Quartiers** : boutons plus petits (font 9px, padding 3px 8px), Monte-Carlo / Monaco-Ville / Fontvieille / La Condamine / Larvotto.
- **Gratuit** : bouton supprimé de l'interface (le champ `free: true` reste dans les données).
- **Boutons filtres inactifs** : fond blanc `#FFFFFF`, bordure `rgba(15,29,58,0.2)`.
- **Bouton billetterie** : "RÉSERVER" (payant FR) / "PLUS D'INFOS" (gratuit FR) / "BOOK" / "MORE INFO" (EN).

### Shell.jsx — navigation

- **Pas de nav bar en bas** : navigation gérée via panneau coulissant (menu hamburger) + cœur favoris.
- **Panneau menu** : slide depuis la droite (width 250px, `zIndex: 1001`), lien Mon Agenda + checkboxes catégories + "Tout effacer". **FR/EN absent du menu** — switché sous le hamburger dans HomeScreen.
- **Overlay sombre** `rgba(0,0,0,0.4)` quand menu ouvert, fermeture au clic overlay.
- **Popup événement** : centré dans la frame, cadre extérieur `1.5px solid #C9A96E` (or) + intérieur `1.5px solid #9FC3DC` (bleu nautique). Contient : catégorie, titre, description, ❤️, lien/téléphone, "Ajouter au calendrier"/"Add to calendar".
- **Couleurs Shell** : `GOLD = "#C4A241"` (icônes/catégories) · `GOLD_FRAME = "#C9A96E"` (cadres popup) · `BLUE = "#9FC3DC"` (popup intérieur, rayures).

### MonacOutLogo.jsx — design (style nautique Monaco, validé 2026-05-21)

Logo cadre double bicolore sur fond blanc :
- Cadre extérieur : `2px solid #C9A96E` (or)
- Cadre intérieur : `2px solid #0F1D3A` (navy)
- **Grand M** : Playfair Display Bold, 72px, navy `#0F1D3A`, lettre signature
- **MONAC'** : Josefin Sans 400, 13px, navy, letterSpacing 7, uppercase
- **OUT** : Josefin Sans 600, 13px, or `#C9A96E`, letterSpacing 4, uppercase

### HomeScreen.jsx — header logo (style rayures nautiques)

Fond rayures diagonales nautiques (`STRIPE_BG`) : `repeating-linear-gradient(-45deg, #9FC3DC 0px, #9FC3DC 40px, #FFFFFF 40px, #FFFFFF 80px)`.
Layout horizontal : **bloc gauche** (hamburger + switcher fr/en en dessous) + **MonacOutLogo width=220** (centré) + **cœur favoris** (droite).
- **Switcher fr/en** : sous le hamburger, Josefin Sans 9px, soulignement or `#C9A96E` sur la langue active, couleur navy actif / gris inactif.
- Header sticky (`zIndex: 999`) — toujours visible, ne disparaît pas au scroll.

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
  2. `cross-check-dates.mjs` — vérifie les dates vs PrinciPocket (130+ events, pagination) — `continue-on-error: true`
  3. `autofix-events.mjs` — corrige jours de semaine + fêtes mobiles (Pâques, Pentecôte, Ascension)
  4. `verify-events.mjs` — génère rapport qualité (`verify-events-report.txt`)
  5. `send-alert-email.mjs` — envoie un email si `verify-events` échoue (via secret `RESEND_API_KEY`)
  6. Si `src/data/events.js` modifié → build + commit + push
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
