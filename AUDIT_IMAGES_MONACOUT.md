# AUDIT IMAGES — MONAC'OUT

**28 octobre 2026.** Relevé sur `public/events.json` tel que servi en production.
Aucune donnée modifiée, aucun chiffre estimé : tout ce qui suit est compté.

---

## 1 · Combien d'événements ont une photo ?

> **Zéro sur 2 385.**

Les champs `image`, `photo`, `cover`, `img`, `media` et `visuel` n'existent dans
aucune fiche. Les 36 champs réellement présents sont listés plus bas. Chaque
fiche porte en revanche :

| Champ | Couverture |
|---|---|
| `fallback` — un dégradé CSS | **2 385 / 2 385** |
| `emoji` — une icône | **2 385 / 2 385** |
| `accent` — une couleur d'accent | **2 385 / 2 385** |

Il n'y a donc **ni photo valide, ni photo en panne, ni photo trop petite** : la
question ne s'est jamais posée, l'application n'a jamais affiché d'image
d'événement.

---

## 2 · 🚨 Le chiffre qui reformule le problème

> **2 385 fiches, mais seulement 398 titres distincts.**

| | |
|---|---|
| Titres distincts | **398** |
| Titres revenant plusieurs fois (séries) | 118 |
| Fiches appartenant à une série | **2 105** (88 %) |
| **Fiches réellement uniques** | **280** (12 %) |

Les plus répétées : « MUSÉES 6 OUVERTS À MONACO » **310 fois**, « BIEN-ÊTRE
MONACO SPAS & STUDIOS » 257, « BAR SALLE EUROPE » 182, « SOIRÉE TWIGA » 156.

**Conséquence directe : il ne faut pas 2 399 photos, il en faut au plus 398 —
et dans les faits 280, celles des événements qui n'arrivent qu'une fois.** Le
reste est la même carte republiée chaque jour, qui doit garder la même image.

S'ajoutent **1 099 fiches à annuaire** portant **8 202 sous-fiches** (terrasses,
brunchs, films, musées) : ce sont des listes de lieux, pas des événements, et
elles n'appellent pas de photo propre.

---

## 3 · Les sources et leurs droits

| | |
|---|---|
| Fiches avec un lien | **1 597** (67 %) |
| Fiches sans aucun lien | **788** (33 %) |
| Hôtes distincts | 73 |

**Mais ces liens pointent vers le LIEU, pas vers l'événement :**

> **1 597 fiches ne mènent qu'à 123 adresses distinctes** — 13 fiches par adresse
> en moyenne. Seules **57 adresses** sont propres à une fiche, soit **2 %** de la base.

257 fiches renvoient à la page des Thermes Marins, 182 à celle du Casino, 156 à
Twiga, 94 au Théâtre des Muses.

### Ce que publient ces sites

Test mené sur les 14 hôtes principaux : **9 exposent une balise `og:image`**,
couvrant 1 030 fiches. **C'est un piège, pour trois raisons :**

1. **Ce serait une image par LIEU.** Les 563 fiches SBM partageraient la même —
   exactement ce qu'il faut éviter.
2. **L'une d'elles est déjà un faux** : `mairie.mc` publie
   `placeholder_landscape.jpg`, un gabarit vide. Il se serait affiché sur 85 fiches.
3. **Une `og:image` n'est pas une licence.** Elle existe pour l'aperçu des liens
   partagés, pas pour illustrer une autre application. La reprendre sans accord
   expose Monac'Out.

### Procédure de sourcing légal proposée

1. **Demander aux lieux.** 89 adresses de contact sont déjà réunies, et le
   Théâtre des Muses, Stars of Monaco et l'OPMC ont déjà répondu à Stéphanie.
2. **Consigner la provenance** pour chaque image reçue : qui l'a fournie, quand,
   par quel canal, et pour quel usage — dans un fichier tenu à la main, comme
   `presentations-validees.json`.
3. **Pilote sur 10 événements** avant toute généralisation.

⚠️ Aucun téléchargement automatique, aucun scraping : ni techniquement
nécessaire, ni juridiquement sûr.

---

## 4 · Répartition par catégorie

| Catégorie | Fiches | | Catégorie | Fiches |
|---|---|---|---|---|
| APÉRO | 390 | | CONCERT | 109 |
| EXPOSITION | 384 | | THÉÂTRE | 105 |
| BIEN-ÊTRE | 327 | | BRUNCH | 78 |
| JAZZ LIVE | 310 | | CHANTS | 78 |
| SOIRÉE | 239 | | *18 autres* | ~365 |
| ATELIER | 138 | | **Total** | **2 385** |

28 catégories au total.

---

## 5 · Ce dont on dispose déjà pour habiller

| | |
|---|---|
| Dégradés **distincts** | **97** |
| Emojis distincts | **79** |

⚠️ **Correction d'une affirmation que j'avais faite trop vite** : j'avais dit
« 2 385 dégradés uniques ». C'est faux — il y en a **97**, répétés. La variété
par événement ne viendra donc pas des données telles quelles : elle doit être
**calculée à partir de `event.id`**, comme le demande le brief.

Les 76 fonds HD du kit (19 catégories × 4 variantes, 1280 × 720, 924 Ko)
couvrent moins de variantes que les 97 dégradés existants, pour 924 Ko ajoutés.

---

## 6 · OTA — ce qui est compatible

**Capgo**, auto-hébergé. `public/capgo/latest.json` est lu en direct par l'app ;
`src/main.jsx` télécharge le bundle et l'applique dans les 6 premières secondes
du lancement. Bundle actuel : **1,9 Mo**.

| Action | Compatible OTA ? |
|---|---|
| Styles, composants, dégradés **générés en code** | ✅ aucun poids ajouté |
| Les 76 fonds embarqués | ⚠️ **+924 Ko, soit +49 %** du bundle |
| Photos réelles servies par le site (hors bundle) | ✅ chargement paresseux |
| Module natif, permission, dépendance | ❌ exigerait une build App Store |

Le kit le dit lui-même : « ne pas embarquer les 76 assets systématiquement dans
le bundle OTA ; générer des backgrounds en code ».

⚠️ Et une mesure à garder en tête : un OTA met **une à deux semaines** à se
répandre (98 appareils, 19 versions relevées le 27 oct). Les **données**, elles,
arrivent le jour même.

---

## 7 · Recommandation

**Habillage généré en code, avec `event.id` comme graine stable.** Le rendu des
76 fonds — dégradé profond, icône de catégorie en filigrane, cercles
concentriques, filets — se programme en CSS et SVG. On obtient **autant de
variantes qu'il y a d'événements**, chacune stable d'un affichage à l'autre,
pour **0 octet** ajouté à l'OTA et sans aucune question de droits.

**Et en parallèle, demander les vraies photos aux lieux** — en commençant par
les **280 événements réellement uniques**, pas par 2 399. C'est un volume
atteignable, et chaque photo obtenue sera authentique et autorisée.

**Ce qu'il ne faut pas faire :** reprendre les `og:image`. Une image par lieu
répétée sur des centaines de fiches, un faux déjà repéré, et aucune licence.
