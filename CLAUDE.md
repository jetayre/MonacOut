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

## Journal — 29 juil 2026 (complétion massive + fix carte cinéma)
- **43 événements ajoutés à la main** (ids 4724-4766), vérifiés lieu + date + heure, Le Policier FEU VERT, en ligne. Scripts : `scripts/add-batch-2026.mjs` (20 culturels : concerts Disney/Star Wars ciné-concerts, Thursday Live Sessions, théâtre TPG, cinéma d'été Médiathèque, Roma de Massenet, récital Jansen & Kantorow…) + `scripts/add-batch2-2026.mjs` (14 religieux CHANTS paroisse Saint-Charles, 2 Vuelta Grand Départ, 2 Soirées Musicales Estivales, 5 conférences pro). Les 24 opéras OPMC 26-27 (4700-4723) avaient été ajoutés juste avant.
- **⚠️ FIX carte cinéma hebdo (id 1004031)** : elle avait **disparu** car `scripts/refresh-cinema.mjs` (lancé chaque jour par daily-check.yml) redatait un **id codé en dur `2050` devenu inexistant** (la carte est régénérée avec un nouvel id). Corrigé : le script cible désormais le **marqueur stable `weeklyFilms:true`**. ⚠️ RÈGLE : **ne jamais cibler la carte cinéma par son id** (il change) — toujours par `weeklyFilms:true`.

## Journal — 3 août 2026 (photo de profil + tri chronologique)

**📸 PHOTO DE PROFIL (OTA v0.0.63 → v0.0.65).** Optionnelle, jamais imposée. La photo est **recadrée en carré au centre, réduite à 96×96 en JPEG (~5 Ko)** par `src/lib/avatar.js`, puis stockée **en data URL dans `profiles.avatar_url`** (colonne ajoutée le 3 août : `alter table profiles add column if not exists avatar_url text;`). **Pourquoi pas Supabase Storage** : pas de « bucket » ni de règles d'accès à maintenir, pas de CORS, et surtout **la photo disparaît AVEC le compte** à sa suppression (obligation légale réglée sans effort). Refusée au-delà de 40 Ko. ⚠️ À revoir seulement si l'audience atteint des milliers de comptes.
- **Sélecteur de photos standard du navigateur** (`<input type="file">`), PAS le plugin appareil photo natif → **aucune validation Apple nécessaire**, tout passe en OTA.
- Trois emplacements, **ronds** (essai en carré abandonné après retour de Stéphanie) : **accueil 40 px** à gauche de « Bonjour, X » (rien n'est affiché s'il n'y a pas de photo), **menu 32 px** (tapable → c'est le SEUL endroit où les comptes déjà créés peuvent en ajouter une, l'écran d'inscription ne se rouvrant jamais), **inscription 64 px**, **amis sur les fiches 20 px**, **invitation 72 px**.
- **Invitation ciblée** : message unique montré UNIQUEMENT aux personnes **connectées, avec un prénom, sans photo** — 2 fois maximum espacées de 14 jours, 1 seul message par visite, jamais avant 12 s (compteurs `monacout_photo_asks` / `monacout_photo_last_ask`). Sans elle, personne n'aurait su que la photo existait. Mesures PostHog : `photo_prompt_shown`, `photo_added`, `photo_later`.
- **Garde-fous anti-casse** : `useSocial` interroge `profiles` avec `select('*')` et NON une liste figée de colonnes (sinon la liste d'amis échouerait si `avatar_url` manquait) ; `saveProfile` réenregistre **sans la photo** si l'écriture échoue → personne ne peut perdre son prénom à cause d'une photo. **Personne n'a eu à se réinscrire.**

**↕️ TRI STRICTEMENT CHRONOLOGIQUE (OTA v0.0.66) — changement important.** L'app triait chaque journée en **trois étages** (`_sortTier` : événements, puis fiches annuaire `pinLast`, puis APÉRO/SOIRÉE en dernier). Conséquence absurde : un happy hour de **15h30 s'affichait après un concert de 20h30**, et le bien-être de 8h du matin arrivait en fin de journée. **Les étages sont supprimés** : `_sortTier` renvoie toujours 0, le tri se fait uniquement à l'heure.
- **Horaires en toutes lettres** (`_eventHour` dans events.js) : **« En journée » → 11h**, **« En soirée » → 21h**. Sans ça, faute d'heure chiffrée, ces fiches tombaient tout en bas de la journée.
- **La carte cinéma passe de 10h30 à 14h00** — dans `update-cinema.mjs` (donc pour toutes les régénérations du mercredi) ET dans les fiches déjà en place.

**👁️ RAPPEL — MUSÉES ET SPAS NE SONT PAS DANS LE FIL** (OTA v0.0.62, à ne pas défaire). Les deux fiches d'annuaire permanentes (« Musées de Monaco ouverts », « Bien-être : spas & studios ») sont retirées du défilement et n'apparaissent **que** sous les filtres **Musée** et **Bien-être**. Règle dans `HomeScreen.jsx` : `e.pinLast === true && e.cat !== "CINÉMA"` masqué quand aucun filtre de catégorie n'est actif. **La carte cinéma reste dans le fil** : son contenu change chaque semaine, ce n'est pas une information permanente.

**🏷️ Libellé** : le bouton sous « Aujourd'hui / Semaine / Week-end / Agenda » s'appelle **« Musée/Ciné/Atelier »** (au lieu de « Culture/Ateliers ») — plus parlant, contenu du filtre inchangé. Même libellé pour les centres d'intérêt à l'inscription.

**📣 Bandeau du soir** : passé du format colonne (texte centré, bouton dessous → presque carré) au **rectangle plat** — texte à gauche, bouton à droite sur la même ligne, coins à 3 px, largeur 92 %.

**🔳 QR CODES — état vérifié le 3 août** (décodés avec le moteur Vision de macOS, script dans le scratchpad) :
- ✅ **Flyer A4, cartes de visite, chevalet, porte-addition** → tous encodent `https://apps.apple.com/fr/app/monacout/id6774785049`. C'est la bonne cible : **25,3 % des visiteurs de la fiche App Store installent l'app**.
- ⚠️ **`~/Desktop/MonacOut-QR.png` (12 juin) → `https://monacout.vercel.app`** : l'ANCIEN projet Vercel (sans tiret) et le *site*, pas l'App Store. **À remplacer s'il a été imprimé quelque part.**
- **✅ RÉGLÉ le 3 août — ⚠️ NE PAS SUPPRIMER cette redirection.** Le QR du 12 juin est affiché dans un lieu très passant : impossible de le réimprimer, mais on a changé la destination de son adresse. `vercel.json` renvoie désormais **la racine de l'hôte `monacout.vercel.app` vers l'App Store** (307, temporaire). La règle est volontairement étroite : elle ne vise **que cet hôte et que la racine**, donc `monacout.com` reste le site, et `events.json`, `notif-config.json`, `capgo/latest.json`, l'AASA et les liens `?invite=` / `?event=` passent à travers sans être touchés (les six ont été vérifiés après coup). Si un jour cette redirection semble inutile, se souvenir qu'un QR imprimé en dépend.
- **🩹 Piège rencontré** : `vercel.json` est **validé strictement** — une simple clé `_comment` a mis **les DEUX projets en ERROR** (monac-out ET monacout). Les sites ont continué de servir le dernier déploiement réussi (aucun utilisateur n'a rien vu), mais plus aucune mise à jour n'aurait pu partir. **Ne jamais mettre de commentaire dans un fichier de configuration JSON** ; et après toute modification de `vercel.json`, vérifier l'état des déploiements (`readyState`), pas seulement que le site répond 200.
- Règle : pour obtenir des installations, diffuser le **lien App Store** ; garder `monacout.com` pour montrer le produit en dix secondes (à un commerçant par exemple).

## Journal — 7 août 2026 (le lien d'invitation vide + liens suivis par canal)

**📣 LE BANDEAU DU HAUT EST SUPPRIMÉ — l'annonce devient un carré central (OTA v0.0.73).** Le rectangle se plaçait **au-dessus du logo** et, la croix ne mémorisant rien, il **revenait à chaque ouverture de l'app**. Stéphanie : « il bloque le logo et est agaçant ». ⚠️ **Ne pas le remettre en haut.**
- Même facture que les messages qu'elle apprécie (fond ivoire, filet or, coins arrondis, fond assombri) : surtitre doré « Ce soir » / « Demain soir », le titre de l'événement, bouton « Voir », puis « Fermer ». Fermeture aussi en appuyant à côté.
- **Une apparition PAR PHASE, deux par événement maximum** : une fois la veille, une fois le jour J. Mémorisé dans `localStorage.monacout_annonces_vues` (clé `id|phase`, 30 dernières). Vérifié en simulant 6 ouvertures successives.
- **Sort à 2,8 s**, donc AVANT la demande de notifications (3,5 s), et pose `promptedThisSessionRef` → **jamais deux messages empilés** dans une visite. L'annonce est du contenu, elle passe avant les demandes.
- Mesure PostHog : **`annonce_vue`** (props `annonce`, `phase`). Le pilotage reste `public/notif-config.json` → `announcements[]`, inchangé (git push suffit, pas de passage par Apple).

**🚨 ÉCRAN NOIR — `target="_blank"` EST DANGEREUX DANS L'APP NATIVE.** La v0.0.73 mettait un bouton « Découvrir » sur le carré, repris tel quel de l'ancien bandeau, qui ouvrait le site du lieu avec `target="_blank"`. Sur iPhone, ça ouvre une fenêtre **sans barre d'adresse ni bouton retour** : **écran noir, impossible de revenir dans l'app**. Stéphanie l'a vécu quelques minutes après la publication. Désactivé en urgence (v0.0.74), refait proprement (v0.0.75).
- **Ma faute, et la leçon** : j'avais simulé l'affichage du carré, jamais le CLIC. **Un lien qui marche dans un navigateur ne marche pas forcément dans l'app native** — c'est le même code, ce n'est pas le même environnement.
- ⚠️ **`target="_blank"` est utilisé AILLEURS**, notamment sur les boutons **« Réserver »** et **« Voir »** des fiches (`EventCard.jsx` l. 337/380, `Shell.jsx` l. 221/222/275, `EventCard.jsx` l. 33 `window.open`). **À vérifier sur un vrai iPhone avant d'y toucher** — s'ils produisent le même écran noir, c'est bien plus grave que l'annonce, et ça expliquerait peut-être le très faible taux d'ouverture de fiche. Non corrigé au 7 août : ne pas casser ce qui marche peut-être.
- **RÈGLE POSÉE PAR STÉPHANIE (7 août)** : « je veux un carré avec l'info SUR le carré, **je ne veux pas inciter les gens à sortir de l'app** ». Le carré porte donc **titre + lieu + heure (+ ENTRÉE LIBRE)**, lus dans la fiche via l'id de l'annonce (`auto-2067` → fiche 2067), et **un seul bouton « J'ai vu »**. ⚠️ **Ne jamais y remettre de lien sortant.**


**💌 LE LIEN D'INVITATION POUVAIT PARTIR SANS CODE (OTA v0.0.72).** Samantha s'inscrit à 11h54, partage aussitôt son lien ; Stéphanie l'ouvre → « Code introuvable ». Cause : `FriendsScreen.jsx` construisait le lien avec **`auth.profile?.invite_code || '…'`**. Profil pas encore chargé → lien contenant l'**ellipsis**, amitié perdue **en silence** (aucune erreur nulle part, personne ne signale une amitié qui ne s'est pas faite). Le code de Samantha, `578eaa`, était parfaitement valide.
- **Corrigé** : `codePret` valide le code (`/^[a-z0-9]{4,}$/i`) avant toute construction de lien, et `shareInvite()` refuse de partir en affichant « Un instant, ton code arrive… ». Message d'échec réécrit : « Ce code n'existe pas — demande à ton amie de renvoyer son lien » (« Code introuvable » laissait croire à une panne).
- **🪤 BOMBE À RETARDEMENT DÉSAMORCÉE AU PASSAGE** : la redirection du QR du 12 juin (`monacout.vercel.app/` → App Store) **avalait les liens d'invitation**. Un `source: "/"` dans `vercel.json` ne compare **que le chemin**, jamais la query — donc `/?invite=xxx` partait vers l'App Store. Le journal du 3 août affirmait que ces liens avaient été vérifiés : ils l'avaient été sur `monacout.com`, pas sur l'hôte concerné. Corrigé avec `missing: [{query invite}, {query event}]`. **Leçon : vérifier une règle d'hôte SUR CET HÔTE, pas sur un autre.**
- **🛡️ POUR QUE ÇA NE REVIENNE PAS — `scripts/check-invitations.mjs`, câblé dans `daily-check.yml`.** Il contrôle les **trois maillons**, qui cassent indépendamment : (1) chaque profil a un code exploitable et unique ; (2) le garde-fou est toujours dans `FriendsScreen.jsx` — il est **épinglé par une expression régulière**, donc le retirer fait échouer le CI ; (3) chaque hôte du lien répond **200** et ne redirige pas. **Validé en réintroduisant volontairement le bug sous ses deux formes** : sortie en code 1 à chaque fois, 0 quand tout va bien. L'étape finale du workflow échoue visiblement s'il crie.

**🔗 LIENS SUIVIS PAR CANAL** — 171 téléchargements sans savoir d'où ils venaient. `monacout.com/insta`, `/story`, `/fb`, `/app` passent par `public/go.html` : la page enregistre le canal (événement PostHog **`lien_suivi`**, propriété `canal`) puis redirige vers l'App Store.
- **Pourquoi une page et pas une redirection** : une redirection 307 n'exécute aucun code, donc ne peut rien compter. L'événement part avec `keepalive` pour survivre à la navigation immédiate.
- ⚠️ **Le canal se lit dans le CHEMIN, jamais dans `?s=`** : la réécriture Vercel est **côté serveur**, l'adresse du navigateur reste `/insta` et `location.search` est VIDE. Premier essai : les quatre liens remontaient « inconnu ». Simulé sur les 6 adresses possibles avant publication.
- **Les flyers imprimés ne passent pas par là** (ils encodent l'App Store en direct et ne sont pas réimprimables) — décision de Stéphanie le 7 août.
- Complément possible, non fait : les **liens de campagne Apple** (App Store Connect → App Analytics → Acquisition), qui comptent les *installations* et non les clics. Exigent un jeton propre au compte Apple.

## Journal — 5 août 2026 (mesure du défilement, e-mails, groupes Facebook)

**📘 NOUVELLE SOURCE DE DÉCOUVERTE : LES GROUPES FACEBOOK MONÉGASQUES.** Stéphanie y trouve des événements qui n'existent sur AUCUN agenda officiel ni sur PrinciPocket — **« Les mamans et papas de Monaco »** et **« Awakened Monaco »** ont donné trois fiches en une fois. Ces groupes annoncent le tissu associatif et parascolaire (stages enfants, bien-être, collectifs) que les agendas institutionnels ignorent. ⚠️ Comme pour Poivre & Sel : le groupe sert à **repérer**, jamais de `link` — remonter au site officiel du lieu ou de l'organisateur. Et **ne jamais publier le portable personnel** d'un particulier qui organise : mettre le téléphone du LIEU (règle 14).
- **Vérifier l'affiche par ses cohérences internes** : celle de l'Étoile de Monaco annonçait « du lundi 17 au vendredi 21 août » — les quatre jours de semaine tombaient juste, le téléphone et l'adresse correspondaient au site officiel. C'est ce qui l'a rendue publiable alors que le site du club ne mentionne pas les stages d'été.
- **Ajoutées ce jour** (ids 4775-4786) : **Notre Dame en DJ set au Twiga** ven 14 août (producteur parisien, label Paranormal, billets dès 80 €) ; **immersion au gong** au Stars of Monaco sam 8 août (participation libre) ; **stage de trampoline de l'Étoile de Monaco**, dès 5 ans, **une fiche par jour** sur les deux semaines (17-21 et 24-28 août) — sinon le stage serait introuvable du mardi au jeudi, exactement le bug de Nadège.
- **Non retenu** : les cours d'échecs particuliers annoncés dans le groupe. Ni lieu fixe, ni date, ni horaire — « à domicile ou en ligne », réservation par message privé Facebook. La règle 13 exige une salle précise et la règle 16 interdit un lien Facebook. Un cours particulier n'est pas une sortie.

**🪤 PIÈGE DÉSAMORCÉ DANS `restore-nightlife-monthly.mjs`.** Le script supprimait chaque nuit non seulement ses propres fiches (`nlg:1`) mais **toute fiche dont le `source:` correspondait à un de ses 36 lieux**. Conséquence : une soirée exceptionnelle écrite à la main dans un club récurrent (le DJ set de Notre Dame au Twiga) **aurait disparu la nuit suivante, sans erreur ni trace**. Vérifié avant de corriger : cette règle ne concernait plus aucune fiche existante (c'était un nettoyage d'avant le marqueur `nlg:1`). Le script ne supprime désormais **que ce qu'il a lui-même écrit**. Contrôlé après coup : 1 359 fiches nightlife régénérées, total inchangé, fiches manuelles intactes. **Règle générale : un script ne doit jamais supprimer une ligne qu'il n'a pas écrite.**

**⚖️ DOUBLON ASSUMÉ, À NE PAS « CORRIGER »** : le ven 14 août, le Twiga a **deux fiches** — la soirée du vendredi générée automatiquement, et le DJ set nommé de Notre Dame. Le contrôle qualité le signale et **c'est normal** : la fiche générique ne dit pas qui joue, la fiche nommée est celle qui donne envie. Même décision que pour le Columbus le 28 août (concert Los Chulos + apéro terrasse Tavolo) : **Stéphanie a tranché le 5 août, on ne fusionne pas.**

**📬 E-MAILS DE CONNEXION — CE QUI A ÉTÉ VÉRIFIÉ.** 58 comptes existent dans Supabase Authentication pour seulement 37 profils : **21 personnes (36 %) demandent un code sans jamais finir**. ⚠️ Supabase crée la ligne du compte **dès la demande du code**, avant toute validation — donc « 58 utilisateurs » ne veut PAS dire 58 inscrits.
- Hypothèse « ça part en spam » **non confirmée** : contrôle de la boîte Gmail sur 60 jours → **aucun code en indésirables, aucun rebond**, expéditeur bien `bonjour@monacout.com`, et le code figure **dans l'objet** du mail. Ça ne dit rien des autres messageries (iCloud, Orange) que l'on ne peut pas observer.
- **Suspect principal : la panne du 1er août** — la demande renvoyait une erreur 500, le compte était créé mais **l'e-mail n'était jamais envoyé**. La clé `service_role` trancherait (dates de création des 21 comptes orphelins).
- **✅ DMARC AJOUTÉ le 5 août 2026** (il manquait ; DKIM et SPF étaient déjà là). `TXT _dmarc.monacout.com` = **`v=DMARC1; p=none`** (rec_ea3b38d17b4b510dd955e04b). **`p=none` ne bloque rien** : il déclare la politique, ce que Gmail, Yahoo et iCloud regardent en premier depuis 2024. ⚠️ **Volontairement SANS `rua=`** : la première version envoyait les rapports XML sur `contact@`, Stéphanie ne veut pas être encombrée. La protection est identique, on renonce simplement à la visibilité sur les rejets. Ne pas « corriger » en remettant `rua`.
- **🧪 CHAÎNE D'INSCRIPTION TESTÉE DE BOUT EN BOUT après le changement DNS** (méthode à réutiliser, elle ne crée AUCUN compte parasite) : envoyer un code à une adresse **qui a déjà un compte** (`jetayre+fix1785580701@gmail.com`) → `POST /auth/v1/otp` doit rendre **200** (500 = envoi cassé), le mail arrive en quelques secondes **en boîte de réception**, puis `POST /auth/v1/verify` avec le code rend un `access_token`. Vérifier ensuite que le nombre de profils n'a pas bougé. Le 5 août : 200, mail reçu, session ouverte, 37 profils avant et après.
  - **Comment le DNS se modifie** (pas d'accès par l'outil Vercel de Claude, qui ne gère pas le DNS) : `npm i --no-save vercel` puis `./node_modules/.bin/vercel dns add|ls monacout.com …`. Le compte `jetayre` est **déjà connecté** sur cette machine (`~/Library/Application Support/com.vercel.cli/`). ⚠️ Installer la CLI **en local** avec `--no-save` : l'install globale demande sudo, et `--no-save` évite de polluer `package.json`.
  - **Toujours faire `vercel dns ls monacout.com` AVANT d'ajouter**, et revérifier après coup que les **MX ImprovMX** (réception de `contact@`), le **SPF de `send.`** et le **DKIM Resend** sont intacts — ce sont eux qui font marcher les codes de connexion.
- **OTA v0.0.71** : l'écran du code indique désormais où chercher — « Rien dans ta boîte ? Regarde dans les **indésirables** — l'email vient de **bonjour@monacout.com** ». Donner l'adresse exacte permet de **rechercher** le mail au lieu d'abandonner.

**📊 LE TRAFIC SUIT LES PUBLICATIONS INSTAGRAM, RIEN D'AUTRE.** 19 nouvelles personnes le 2 août, 13 le 4 août — et **0 le 5 août**, jour sans publication. Sur 7 jours : 66 arrivées en direct, 1 via Google, 1 via Facebook. Rétention réelle (535 appareils, calculée côté serveur) : **18,3 % reviennent un 2ᵉ jour, 11,6 % à J+7, 6 % à J+28**, et **64 % n'ouvrent l'app qu'une seule fois**. Apple annonce 6,5 % / 0,3 % mais son graphique est « Opt-in Only » : quelques personnes à peine, non représentatif.
- ⚠️ **PIÈGE HogQL** : l'API PostHog renvoie **100 lignes maximum par défaut**. Une première mesure de rétention faite en récupérant les personnes ligne par ligne portait donc sur 100 appareils sur 535. **Toujours agréger côté serveur** (`countIf`, `count(DISTINCT …)`), jamais compter des lignes rapatriées.

## Journal — 4 août 2026 (les 24 fiches signalées reprises une par une → 0 signal)

**Le contrôle qualité (`scripts/quality-check.mjs`) est retombé à ZÉRO signal** sur 2 497 fiches. Ce que la reprise manuelle a révélé — utile pour la prochaine fois :

- **🐛 LE BUG DE FOND : le robot date une exposition à son DERNIER JOUR.** PrinciPocket publie « du 6 juillet au 26 février » et le robot n'en retient qu'une date. L'expo était donc **invisible pendant toute la période où l'on pouvait y aller** (c'est le bug qu'a rencontré Nadège). Corrigées ainsi (`ongoing:true` + `until:"AAAA-MM-JJ"`, redatées chaque jour) : **Victor Brauner** (Villa Paloma, jusqu'au 3 jan 2027), **Un Mariage sous les projecteurs** (Institut Audiovisuel, jusqu'au 26 fév 2027), **Patrimoine en danger** (jusqu'au 4 oct 2026). → **Signe qui doit alerter : une fiche EXPOSITION sans `ongoing`.**
- **🗺️ DEUX ERREURS DE LIEU dues au rapprochement par mot-clé** — le robot associe un mot du titre à un lieu du tableau et se trompe :
  - « Heritage at Risk » était mise dans l'**Église Saint-Martin** ; elle est en réalité **sur les grilles des Jardins Saint-Martin** (expo photo en plein air, gratuite).
  - « Stages pratiques amateurs — gravure pointe sèche » était mise au **Foyer Sainte Dévote** (c'est ce que dit PrinciPocket) ; elle a lieu au **Pavillon Bosio**, 1 av. des Pins (École Supérieure d'Arts Plastiques de la Mairie, prof. Laure Fissore, 9-11 sep 10h-17h, `esap@mairie.mc`, +377 9330 1839). **Leçon : toujours recouper le lieu sur le site de l'organisateur, PrinciPocket se trompe aussi sur le lieu, pas seulement sur la date.**
- **💸 UN CONCERT GRATUIT ANNONCÉ PAYANT.** Le « Concert de Noël » du 23 déc à l'Église Saint-Charles était en `free:false` : or **tous les « concerts spirituels » de l'OPMC sont à entrée libre** (série faite avec le Diocèse). Corrigé, et le programme réel ajouté (dir. Peter Szüts, Elenor Bowers Jolley soprano, Gérald Rolland trompette — Bach, Scarlatti, Haendel, Vivaldi). **En vérifiant, un 2ᵉ concert spirituel manquait totalement** : Haydn, « Les Sept Dernières Paroles du Christ en croix », **jeu 18 mars 2027 20h, entrée libre** (id 4767) → ajouté. Source fiable et complète pour cette série : `https://opmc.mc/venue/eglise-saint-charles-monaco/`.
- **🎭 UNE FICHE COMPLÈTEMENT MAL CLASSÉE.** « Positive Energy » (1ᵉʳ oct, Auditorium Rainier III) était en `CONCERT` avec le lien de l'OPMC : c'est en réalité un **spectacle caritatif de l'association Dessine un Papillon** (matériel médical pour enfants hospitalisés), joué par la troupe **Les Échos-liés** — chorégraphies, acrobaties, comédie, 23-35 €. Passée en `SPECTACLE`, lien `dessineunpapillon.com`. **Le piège** : le robot met le lien de l'OPMC dès que l'Auditorium est cité, alors que la salle est aussi louée à des tiers. **Ne pas déduire l'organisateur de la salle.**
- **📞 Téléphone du Théâtre des Variétés corrigé** dans ce tableau : **+377 9325 6783** (l'ancien +377 9330 1861 était faux). Les 5 fiches concernées pointent vers `monservicepublic.gouv.mc` (page officielle du théâtre) — ⚠️ **`theatredesvarietes.fr` est le théâtre de PARIS**, ne jamais l'utiliser.
- **Méthode qui a marché** : le contrôle qualité liste, on cherche chaque fiche sur le site **de l'organisateur** (pas l'agrégateur), on écrit la vraie description, et **on écrit le fichier après CHAQUE fiche** — un script qui garde ses corrections en mémoire jusqu'à la fin perd tout s'il plante avant d'écrire (déjà vécu).

**📏 ON MESURE MAINTENANT LE DÉFILEMENT, PAS LES CLICS (OTA v0.0.70, 5 août).** Constat : le 4 août, **20 personnes ont ouvert l'app, une seule a ouvert une fiche**. J'en ai fait une alerte ; Stéphanie a tranché — « ce n'est pas grave si elles n'ouvrent pas, l'important c'est de scroller ». Elle a raison : la carte du fil porte déjà le nom, la date et le lieu ; ouvrir la fiche ne sert qu'à réserver ou téléphoner. **`event_opened` n'est donc PAS un indicateur de succès** et un taux faible ne doit pas être présenté comme un problème.
- **Le 7 août elle l'a étendu aux INSCRIPTIONS** : « les comptes c'est pas grave, ce qu'il faut c'est que les gens scrollent ». Trois jours sans nouveau compte (5→7 août) ne sont donc pas une alerte non plus — le compte ne sert qu'aux favoris et aux amis, l'app remplit sa fonction sans connexion. **Deux indicateurs, deux seulement : le nombre de personnes distinctes qui ouvrent l'app, et `scroll_depth`.** Corollaire : quand les chiffres sont bas, le sujet est la **distribution**, jamais la conversion.
- Nouvel événement **`scroll_depth`**, props `{fiches, affichees}` — jalons à **5, 10, 20, 40 fiches parcourues**. Compté **en nombre de fiches, pas en pourcentage** : selon le filtre le fil fait 6 ou 200 fiches, « 50 % » ne voudrait rien dire.
- **Une seule mesure par jalon et par visite** (`jalonsEnvoyes`, un Set) → 4 événements maximum par visite, les allers-retours ne comptent pas double. Rien n'est envoyé si la personne ne scrolle pas, ni si le fil est trop court pour défiler.
- Calcul **différé d'une frame** (`requestAnimationFrame`) : le défilement doit rester parfaitement fluide. Le capteur est greffé sur le listener de scroll existant de `HomeScreen.jsx` (celui qui masque les filtres), il n'en ajoute pas un second.
- `track()` vit désormais dans **`src/lib/track.js`** (partagé) ; celui d'`App.jsx` reste en place, inchangé.
- **Ce qu'on cherche à savoir** : quelle part des visiteurs dépasse 5 fiches (= ils parcourent vraiment), et jusqu'où vont ceux qui restent. Premiers chiffres exploitables ~3 jours après le 5 août, le temps que les apps installées prennent l'OTA.

**📈 Repère App Store au 3 août** : **167 premiers téléchargements**, 32 réinstallations, **1 240 impressions → 468 vues de fiche → 25 % de conversion** (une app Lifestyle tourne plutôt à 3-5 %). 448 mises à jour = les OTA arrivent bien. La fiche App Store convertit très bien : c'est **le lien App Store** qu'il faut diffuser, pas le site.

## Journal — 1-2 août 2026 (le robot passe de 15 à 142 lieux + réception email)

**🤖 LE ROBOT SURVEILLE MAINTENANT TOUT LE TABLEAU DES SOURCES.** Il ne connaissait que **15 lieux écrits en dur** sur ~148 documentés : tout le reste était jeté en silence (« Les Lives du Summer Bar » au Columbus, l'expo du Palais Princier, deux expos du Musée d'Anthropologie… rejetés depuis des semaines pour « lieu inconnu »). Nouveau module **`scripts/venues-from-sources.mjs`** : il lit le tableau ci-dessus et en fait la table du robot → **142 lieux surveillés**. Garde-fous : agrégateurs exclus (règle 16) ; un lieu n'est retenu que s'il a un **mot distinctif unique**, sinon on exige **tous** ses mots (sépare « Théâtre Princesse Grace » d'« Académie Princesse Grace ») ; accents ignorés à la comparaison (PrinciPocket écrit « Théâtre ») ; les lieux sans mot distinctif sont **signalés, jamais devinés**. Vérifier : `node scripts/venues-from-sources.mjs`.

**📌 RÈGLE 3 DU ROBOT MODIFIÉE (2 août) — un lieu inconnu ne fait plus perdre l'événement.** Avant : skip. Maintenant : publication avec le **vrai nom du lieu donné par la source**, **sans jamais inventer de lien ni de téléphone**, et le lieu est inscrit dans `lieux-a-completer.txt` pour que ses coordonnées officielles soient ajoutées au tableau. Skip conservé uniquement quand il n'y a **aucun lieu exploitable** (« ? », « Principauté de Monaco »). ⚠️ **Un script ne sait pas chercher un site officiel : cette recherche reste humaine** — c'est ce garde-fou qui évite de publier un mauvais numéro.

**⏰ HEURE NON PUBLIÉE : mention honnête au lieu de perdre l'événement** (esprit de la règle 18, qui n'autorise ça que pour l'heure, jamais pour la date). Table `SANS_HEURE` : **« En journée »** pour EXPOSITION / MARCHÉ / SALON / CINÉMA / ATELIER, **« En soirée »** pour APÉRO / SOIRÉE / DJ SET / JAZZ LIVE. Les autres catégories continuent d'exiger une heure. Aussi : PrinciPocket écrit en anglais → « **Exhibition** » reconnu comme EXPOSITION.

**↕️ TRI : « En journée » se place APRÈS les brunchs et AVANT les apéros** (`_eventHour` dans events.js → 16h ; 12h si c'est un BRUNCH). Sans ça, faute d'heure chiffrée, ces fiches tombaient tout en bas de la journée, après les concerts du soir.

**Résultat immédiat : 8 événements entrés automatiquement** — Les Lives du Summer Bar (Columbus), Wedding of the Century (Palais Princier), From Toumaï to Sapiens + Magies d'ailleurs (Musée d'Anthropologie), Victor Brauner (NMNM), Un mariage sous les projecteurs (Institut Audiovisuel), gravure pointe sèche (Foyer Sainte Dévote), Heritage at Risk (Saint-Martin). **9 lieux ajoutés au tableau** : Palais Princier, Musée d'Anthropologie, Institut Audiovisuel, Hôtel Columbus, Quai Albert Ier, Foyer Sainte Dévote, 99 Sushi Bar, Le Vivaldi, Société Nautique.

**🍸 NOUVEAUX LIEUX RÉCURRENTS** (dans `scripts/restore-nightlife-monthly.mjs`, régénérés chaque jour) : **99 Sushi Bar** — apéro « Afterlight » tous les jours 18h-19h, Mareterra ; **Le Vivaldi** — bar à cocktails du Port Hercule, mar→dim 18h-2h (fermé le lundi), pas de site web → lien Instagram officiel ; **Brasserie de Monaco** — DJ résident tous les soirs, ven/sam jusqu'à 3h ; **Restaurant de la Société Nautique** (club d'aviron) — brunch samedi 11h-15h, **ouvert à tous**. ⚠️ La Brasserie était fichée **à Fontvieille avec un mauvais téléphone** et son ancien domaine est hors ligne → corrigé (Port Hercule, brasseriedemonaco.com, +377 9798 5120).

**🎆 FEUX D'ARTIFICE — état vérifié.** Été 2026 = **2 soirées seulement** (25 juil 22h, 1er août 21h30), au **Quai Albert Ier** : le concours international (Monaco Art en Ciel) semble abandonné, son site officiel `monaco-feuxdartifice.mc` ne résout plus. Un **doublon faux** (1er août 22h, c'était l'horaire du 25 juillet) a été retiré. **Ajoutés** : soirée pop-rock après le feu + châteaux gonflables 18h-21h (le programme de la Mairie détaille l'avant et l'après, PrinciPocket non), et **le réveillon du 31 décembre** (Village de Noël, DJ 21h-2h, feu à minuit) qui n'existait pas du tout. ⚠️ **À REVOIR FIN OCTOBRE** : la fiche « feu Fête Nationale » est datée du **19 nov**, alors qu'en 2025 le tir avait lieu **le 18 à 20h10** (la veille, tradition). Non déplacée car le programme 2026 n'est pas publié — ne pas inscrire une date non confirmée (règle 17).

**🔎 RECHERCHE CORRIGÉE (OTA v0.0.60).** La barre cherchait la **suite exacte de caractères** : « monte carlo summer festival » ne trouvait rien puisque les fiches écrivent « Monte-**C**arlo ». Désormais accents et ponctuation ignorés, et **tous les mots cherchés dans n'importe quel ordre** (`normalizeForSearch` dans HomeScreen.jsx). Testé sur les fiches réelles : 0 → 12 résultats.

**📣 SOLLICITATIONS ÉLARGIES (OTA v0.0.61).** PostHog montrait que la demande de notifications n'avait été vue que par **20 personnes sur 202** — elle exigeait 2 fiches ouvertes dans la même visite, or **85 % des visiteurs n'en ouvrent aucune**. Taux de refus mesuré : **zéro**. Nouveaux déclencheurs : notifs = 2 fiches/visite **ou** 3 fiches cumulées **ou dès la 3ᵉ ouverture de l'app** ; inscription = 1er favori **ou** 3 fiches **ou dès la 4ᵉ visite**. Garde-fous : 1 seul message par visite ; notifs reposables **3× max espacées de 7 j** (« plus tard » ≠ « plus jamais ») ; inscription **2× max espacées de 10 j** ; jamais avant 12 s après l'ouverture. Compteurs persistants : `monacout_sessions`, `monacout_card_opens`, `monacout_notif_asks`, `monacout_signup_asks`. **À mesurer vers le 15 août** : `notif_prompt_shown` doit décoller, `notif_permission=denied` doit rester à zéro.

**📬 `contact@monacout.com` REÇOIT ENFIN** (ImprovMX, catch-all `*@monacout.com` → jetayre@gmail.com, MX chez Vercel). `notif-config.json` bascule sur cette adresse. ⚠️ **La clé API Resend est AUSSI le mot de passe SMTP de Supabase** : la régénérer sans la recoller dans Supabase casse **toutes les inscriptions**, silencieusement (arrivé le 1er août, réparé en 20 min). Diagnostic : `POST /auth/v1/otp` → 500 = envoi cassé.

## Journal — 31 juil 2026 (CI mort 2 jours + cinéma qui s'auto-détruisait)
- **🩹 `daily-check.yml` ne tournait plus depuis le 29 juil 17h** : un `:` non protégé dans un `name:` d'étape (« robot déterministe : ajoute… ») rendait le YAML illisible → GitHub refusait le workflow **sans alerte** (aucun email, juste un « failure » de 0 s sur chaque push). Le nettoyage/Police de 6h et 18h était donc à l'arrêt. Corrigé en mettant le nom entre guillemets. ⚠️ **TEST RAPIDE de santé des workflows : `gh workflow list -R jetayre/MonacOut` — si un workflow s'affiche par son CHEMIN au lieu de son nom, il est cassé.** Toujours entourer de guillemets un `name:` contenant « : ».
- **🎬 CARTE CINÉMA — RÈGLE ESSENTIELLE : `update-cinema.mjs` génère UNE FICHE PAR JOUR** (aujourd'hui → mardi, ~5-7 fiches, décidé le 12 juil, commit 1895e29) pour que le cinéma apparaisse dans « Aujourd'hui » **chaque jour**. Ce n'est PLUS la carte unique re-datée du 14 juin. → **`refresh-cinema.mjs` NE DOIT PAS redater les fiches `weeklyFilms:true` quand il y en a plusieurs**, sinon les 7 s'écrasent sur le jour même, `dedup-events.mjs` en supprime 6, et la survivante ne tient plus que par le job quotidien : dès qu'il ne tourne pas (cf. panne ci-dessus), elle passe dans le passé et `cleanup-events.mjs` la supprime → **plus aucun cinéma dans l'app**. C'est ce qui est arrivé le 31 juil. Le script ne redate donc plus que s'il n'y a **qu'une seule** fiche (ancien format). Les fiches vivent sur leurs vraies dates et survivent à une panne de l'automatisation.
- **FIX Marine (id 4741)** : PrinciPocket la donnait au 27 fév ET 13 fév 2027 → doublon avec mauvaise date. Vérifié (jds.fr) : **une seule date, sam 13 fév 2027 20h30**. Le 27 fév était faux. Leçon : PrinciPocket peut avoir des dates dupliquées/erronées → recouper si un même titre apparaît 2× à des dates proches.
- **Méthode PrinciPocket (pour l'agent de complétion)** : `node principocket-scan.mjs` liste les manquants (titre + date seulement). Pour lieu + heure exacts → **GET la fiche** `https://www.principocket.com<slug>` : le **titre** = balise `<h1>`, le **lieu** = 1er lien `/en/places/…`, la **date+heure** = texte « `<Jour> D <Mois> YYYY from HH:MM to HH:MM` ». ⚠️ Le scan a des **faux positifs** : (a) opéras déjà présents re-signalés car titre ≠ (« la vie parisienne opera » vs « LA VIE PARISIENNE OFFENBACH ») → **dédupliquer par date+lieu, pas par titre** ; (b) events sans lieu/heure sur la fiche → **skipper + signaler** (ne rien inventer). Toujours recouper le site officiel du lieu (table des sources ci-dessus).
- **Skippés le 29 juil** (à retenter) : ateliers CycloShow & Mission XY (lieu absent de PrinciPocket, introuvable officiellement), Stage gravure pointe sèche au Foyer Sainte Dévote (heure non confirmée). Conférences pro fermées : finalement INCLUSES sur demande de Stéphanie (Les Assises, BNI ×2, Ministres du Sport, Forbes Summit).
- **🤖 ROBOT DE COMPLÉTION DÉTERMINISTE** — `scripts/auto-complete-events.mjs`, câblé dans **daily-check.yml** (tourne chaque jour, avant Le Policier ; le push existant du CI publie). SANS LLM, donc 100 % fiable et sans souci de droits git (remplace l'agent cloud CCR qui ne pouvait pas `git push`). Il scanne PrinciPocket, lit chaque fiche (titre h1 + lieu /places/ + date+heure « from HH:MM »), et **n'ajoute QUE** si : lieu présent dans sa table `VENUES` (avec link/phone officiels) ET heure connue ET pas déjà présent (dédup par DATE+LIEU et par TITRE). Recalcule le jour de semaine par code. Ids en bande dédiée **7xxxxx**. Tout le reste est skippé + écrit dans `auto-complete-report.txt`. **Pour élargir la couverture** : ajouter des lieux à la table `VENUES` du script (les lieux inconnus sont skippés, jamais inventés). Conçu selon « un événement manquant vaut mieux qu'un faux ».

## Rôle de Claude
Vérifier les sources officielles **2 fois par jour** (6h et 18h), identifier les nouveaux événements, mettre à jour `src/data/events.js`, puis builder et pousser.

---

## Sources officielles à vérifier (exhaustif)


> **🔎 SOURCES DE DÉCOUVERTE DE LIEUX (jamais un `link` de fiche — règle 12/16).** En plus de PrinciPocket, l'agent chercheur balaie **Poivre & Sel Riviera** (`https://www.poivre-et-sel-riviera.fr`), guide gastronomique de la Côte d'Azur, rubriques **Restaurants · Cocktails · Métiers de bouche · Découvertes**. Ses articles monégasques portent le **code postal 98000** dans l'URL (ex. `/post/le-vivaldi-bar-à-cocktails-98000-monaco`) — c'est le repère pour ne retenir que Monaco. C'est ainsi qu'on a trouvé **Le Vivaldi**, absent de partout ailleurs. ⚠️ Ces sites servent UNIQUEMENT à repérer un établissement : le `link` publié doit toujours être le **site officiel du lieu** (ou son Instagram officiel s'il n'a pas de site). `venues-from-sources.mjs` les exclut automatiquement.

> **⚙️ CE TABLEAU PILOTE LE ROBOT (depuis le 1er août 2026).** `scripts/venues-from-sources.mjs` le lit à chaque passage : **ajouter une ligne ici suffit à ce qu'un lieu soit couvert** par la complétion automatique (avant, le robot ne connaissait que 15 lieux écrits en dur et jetait tout le reste — « Les Lives du Summer Bar », l'expo du Palais Princier… étaient rejetés pour « lieu inconnu »). Format à respecter : `| Nom | https://site-officiel | CATÉGORIES + précisions | +377 ... |`. La **1ʳᵉ catégorie citée** devient la catégorie par défaut du lieu ; le **quartier** est déduit s'il est mentionné dans la ligne. Les agrégateurs (visitmonaco, culture.mc, principocket…) sont automatiquement exclus comme lien (règle 16). Un lieu dont le nom n'a aucun mot distinctif est signalé, jamais deviné. Vérifier avec `node scripts/venues-from-sources.mjs`.


| Source | URL | Catégories | Contact lieu |
|--------|-----|------------|--------------|
| Opéra de Monte-Carlo — concerts | https://opmc.mc/en/concert/ | CONCERT, OPÉRA | +377 9200 1370 | ⚠️ **opmc.mc bloque le proxy — passer par WebSearch** (ex: `"opéra Monte-Carlo ballet juillet 2026"`) |
| Opéra de Monte-Carlo — saison lyrique | https://opmc.mc/en/season-25-26/ | OPÉRA, MUSICAL | +377 9200 1370 | ⚠️ **opmc.mc bloque le proxy — passer par WebSearch** |
| Culture Monaco | https://culture.mc/en/what-s-on | THÉÂTRE, CONCERT SACRÉ, EXPOSITION | +377 9200 1370 |
| Mairie de Monaco — agenda | https://www.mairie.mc/agenda | SPECTACLE (espaces publics), FÊTE NATIONALE, SPORT (espaces publics), Feux d'artifice, Marchés | +377 9315 2828 |
| Club Bouliste Monégasque | https://cbmonaco.org | SPORT pétanque | +377 9205 9217 |
| Sporting Monte-Carlo | https://meetings.montecarlosbm.com/en/sporting-monte-carlo | DANSE (Salle du Sporting) | +377 9806 7071 |
| Théâtre des Variétés | https://www.monte-carlo.mc/fr/sorties/spectacles/theatre-des-varietes | DANSE, ATELIER (Théâtre des Variétés) | +377 9325 6783 |
| Théâtre Princesse Grace | https://www.tpgmonaco.mc | DANSE (Salle Princesse Grace), THÉÂTRE | +377 9325 3227 |
| Paroisse Sacré-Cœur Monaco | https://saintmartin.diocese.mc | CHANTS (Église du Sacré-Cœur) | +377 9330 7526 |
| Cathédrale Saint-Nicolas | https://www.maitrisecathedrale.mc/fr/prochaines-dates | CONCERT, CHANTS (Cathédrale) | +377 9999 1400 |
| Paroisse Saint-Charles | https://saintcharles.diocese.mc/ | CHANTS (Heure Sainte, Bénédiction des malades, messes) — Église Saint-Charles, Monte-Carlo | +377 9330 7490 |
| Paroisse Saint-Martin / Sacré-Cœur | https://saintmartin.diocese.mc | CHANTS (messes, célébrations) | +377 9330 7526 |
| Diocèse de Monaco | https://diocese.mc | CHANTS (fêtes diocésaines, caté, service santé) | |
| Auditorium Rainier III | https://opmc.mc/en/concert/ | CONCERT, OPÉRA (Orchestre Philharmonique, Auditorium Rainier III · Monte-Carlo) | +377 9200 1370 |
| Soirées Musicales Estivales (Mairie) | https://www.mairie.mc/programme-estival-2026 | CONCERT gratuit en plein air (Square Gastaud · La Condamine, ~19h30, juil-août) | +377 9315 2828 |
| La Vuelta — Grand Départ Monaco 2026 | https://www.lavuelta.es/en | SPORT cyclisme (22 août CLM Place du Casino · 23 août départ Jardin Exotique) | |
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
| Théâtre des Variétés Monaco | https://www.monte-carlo.mc/fr/sorties/spectacles/theatre-des-varietes | THÉÂTRE, SPECTACLE | +377 9325 6783 |
| Thermes Marins Monte-Carlo | https://www.montecarlosbm.com/en/wellness-sport-monaco/thermes-marins-monte-carlo | BIEN-ÊTRE | |
| Odéon Spa | https://odeonspa.com/ | BIEN-ÊTRE | |
| Monte-Carlo SBM (restos/bars) | https://www.montecarlosbm.com/ | BRUNCH, APÉRO, SOIRÉE | |
| 99 Sushi Bar Monaco | https://www.99sushibar.com/en/99-sushi-bar-monaco/ | APÉRO « Afterlight » tous les jours 18h-19h, bar à saké — 16 Quai du Petit Portier, Mareterra | +377 9992 5102 |
| Le Vivaldi (bar à cocktails) | https://www.instagram.com/vivaldi_monaco/ | APÉRO, DJ — 6 av. de la Piscine, Port Hercule, mar→dim 18h-2h, **fermé le lundi**, pas de site web | +33 6 63 07 20 20 |
| Maison Gigi Monte-Carlo | https://www.instagram.com/maisongigimontecarlo/ | APÉRO, SOIRÉE (trattoria italienne + bar à cocktails, ambiance festive le week-end) — 32 route de la Piscine, Port Hercule / La Condamine, pas de site officiel → lien Instagram officiel | +377 9798 3456 |
| Café Semplice | https://www.cafesemplice.com/en/home-en/ | APÉRO bar à vins et cocktails 17h-20h (côté café-restaurant italien en journée) — 25 bd Albert 1er, Port Hercule / La Condamine, lun→sam | +377 3770 0658 |
| Pulcinella | https://pulcinella.mc/ | APÉRO soirée musique live tous les vendredis 19h (apéritif offert) — restaurant italien depuis 1979, 17 rue du Portier, Monte-Carlo | +377 9330 7361 |
| Frenk | https://www.instagram.com/frenk.mc/ | APÉRO italien, cocktails, tous les jours 8h-23h (dim 9h-23h) — 32 quai Jean-Charles Rey, Port de Fontvieille, pas de site officiel → lien Instagram officiel | +377 9992 5838 |
| Bella Vita | https://www.bellavita.mc/ | APÉRO happy hour 18h-20h (brasserie italienne, service continu, petit-déj jusqu'à 11h) — 21 rue Princesse Caroline, La Condamine | +377 9350 4202 |
| Bistro Coe | https://bistrocoe.mc/ | APÉRO cocktails (bistrot méditerranéen face à la mer, tous les jours 9h-23h) — Complexe Balnéaire du Larvotto, Larvotto | +377 9992 2790 |
| Café Maï | https://www.instagram.com/cafemai.mc/ | BRUNCH samedi (bistrot français sous les arcades, pas de site officiel → lien Instagram officiel) — Place d'Armes, La Condamine | +377 9992 3534 |
| Neptune Monaco Beach | https://www.neptunemonaco.com/ | BRUNCH, APÉRO — plage privée, restaurant méditerranéen et bar à cocktails, Plage du Larvotto | +377 9330 0551 |
| La Môme Monte-Carlo | https://www.lamomemontecarlo.com/en/ | SOIRÉE, APÉRO — rooftop méditerranéen, DJ/pianiste/chanteur tous les soirs, vue Port Hercule — 7 av. J.F. Kennedy (Port Palace Hôtel), La Condamine | +377 9992 1193 |
| Caffè Milano | https://www.caffemilano.mc/ | BRUNCH dimanche (restaurant italien vue port, ouvert tous les jours 12h-21h30) — 1 Quai Albert 1er, Port Hercule / La Condamine | +377 9350 7721 |
| Baretto Monte-Carlo | https://www.barettomontecarlo.com/ | APÉRO aperitivo & cocktails (restaurant italien chic, service continu lun-ven 8h30-22h, sam 9h30-22h) — 24 bd Princesse Charlotte, Monte-Carlo | +377 9992 4422 |
| Huit et Demi | https://www.huit-et-demi-restaurant-italien-monaco.com/ | APÉRO cocktails & cuisine italienne (restaurant à thème cinéma, terrasse, service continu midi et soir) — 4 rue Langlé, La Condamine | +377 9350 9702 |
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
| Foyer Sainte Dévote | https://diocese.mc | ATELIER, CONFÉRENCE — 3 rue Philibert Florence, La Condamine (salle paroissiale, pas de site propre) | +377 9797 7020 |
| Palais Princier de Monaco | https://www.visitepalaisdemonaco.com/ | EXPOSITION, SPECTACLE — Grands Appartements, cour d'honneur (concerts d'été), Monaco-Ville | +377 9325 1831 |
| Musée d'Anthropologie Préhistorique | https://map.gouv.mc/ | EXPOSITION, ATELIER — entrée par le Jardin Exotique, 56 bis bd du Jardin Exotique | +377 9898 8006 |
| Institut Audiovisuel de Monaco | https://institut-audiovisuel.mc/ | CINÉMA, EXPOSITION, CONFÉRENCE — 83-85 bd du Jardin Exotique | +377 9798 4326 |
| Jardin Exotique de Monaco | https://www.jardin-exotique.mc/ | EXPOSITION, ATELIER — jardin botanique, grotte de l'Observatoire, conférences/ateliers nature (« Garden club ») — 62 bd du Jardin Exotique, Monaco | +377 9315 2980 |
| Marché de la Condamine | https://www.mairie.mc/le-marche-de-la-condamine | MARCHÉ alimentaire quotidien — halle couverte (en travaux 2026, commerçants relocalisés Place d'Armes), La Condamine | +377 9315 2832 |
| Centre de Conférences - One Monte-Carlo | https://meetings.montecarlosbm.com/en/one-monte-carlo-meeting | CONFÉRENCE, SALON — 1 place du Casino, Monte-Carlo | +377 9806 1717 |
| Pavillon Bosio (École Supérieure d'Arts Plastiques) | https://pavillonbosio.com/ | ATELIER arts plastiques & scénographie, stages amateurs — 1 av. des Pins, Monaco-Ville | +377 9330 1839 |
| Hôtel Columbus Monte-Carlo | https://www.columbushotels.com/ | APÉRO, CONCERT — « Les Lives du Summer Bar », terrasse Tavolo, Fontvieille | +377 9205 9000 |
| Quai Albert Ier (espace public) | https://www.mairie.mc/les-soirees-feux-dartifice-au-quai-albert-1er | SPECTACLE, SOIRÉE — feux d'artifice, animations enfants, soirées DJ de la Mairie | +377 9315 2828 |
| Société Nautique de Monaco — restaurant | https://www.restaurantsocietenautique.club/ | BRUNCH samedi 11h-15h, déjeuners en semaine — club d'aviron, Port Hercule, **ouvert à tous** (pas réservé aux membres) | +377 9350 5130 |
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
| Monaco Brewery (= La Brasserie de Monaco, même établissement) | https://brasseriedemonaco.com | APÉRO (craft beer) | +377 9798 5120 |
| La Brasserie de Monaco | https://brasseriedemonaco.com | SOIRÉE, APÉRO, BRUNCH — microbrasserie, 36 route de la Piscine, darse sud du **Port Hercule / La Condamine** (⚠️ PAS Fontvieille, erreur corrigée le 1er août 2026), DJ résident tous les soirs dès 18h, service jusqu'à 3h ven/sam | +377 9798 5120 |
| Panino Club Monaco | https://panino-club.com/ | APÉRO (vendredi, Blvd des Moulins) | |
| Buddha-Bar Monte-Carlo | https://www.buddhabar.com/en/restaurants/buddha-bar-monte-carlo/ | APÉRO, SOIRÉE | +377 9999 8080 |
| Turbo Monaco | https://www.turbomonaco.com/ | SOIRÉE (GP week + saison) | +377 9999 2000 |
| AMU Monte-Carlo | https://amu-montecarlo.com/ | APÉRO, SOIRÉE | +377 9315 4848 |
| Nikki Beach Monte Carlo | https://nikkibeach.com/monte-carlo/ | BRUNCH, SOIRÉE | +377 9330 0700 |
| Le Méridien Beach Plaza | https://www.marriott.com/en-us/hotels/mcmmd-le-meridien-beach-plaza/dining/ | BRUNCH, SOIRÉE, BIEN-ÊTRE (Larvotto) | +377 93 30 98 80 |
| Lilly's Club | https://lillysclub.com/ | SOIRÉE, DJ SET | |
| Amber Lounge Monaco | https://www.amberlounge.com/events/monaco-2026/ | SOIRÉE, GALA | |
| Jack Monaco | https://jackmonaco.playfun.tv/ | APÉRO, SOIRÉE | |
| Nobu Monte-Carlo | https://www.fairmont.com/en/hotels/monte-carlo/fairmont-monte-carlo/dining/nobu.restaurant.html | SOIRÉE | |
| Horizon Rooftop (Fairmont Monte-Carlo) | https://www.fairmont.com/monte-carlo/dining/horizon-rooftop-monaco/ | APÉRO, SOIRÉE — bar à champagne et cocktails en rooftop, coucher de soleil sur la Méditerranée, 7ème étage — 12 av. des Spélugues, Monte-Carlo | +377 9350 6500 |
| Castelroc Monaco | https://www.castelrocmonaco.com/ | BRUNCH, APÉRO (Place du Palais, Monaco-Ville) | +377 93 30 36 68 |
| Étoile de Monaco (gym & trampoline) | https://www.etoiledemonaco.com | ATELIER, SPORT enfants — club de gymnastique et trampoline depuis 1890, Vallon Sainte-Dévote (parking gare) · La Condamine ; stages vacances 10h-12h, inscription `etoile@monaco.mc` | +377 9770 3320 |
| Maison du Numérique de Monaco | https://www.maisondunumerique.mc/agenda | ATELIER numérique **GRATUIT sur réservation** (WhatsApp, iPhone, ChatGPT, MConnect, Monaco Telecom TV…) — Les Jardins d'Apolline, 1 Prom. Honoré II · Monaco ; mar→ven 10h-18h30, sam 10h-14h30 | +377 9226 9226 |
| La Rose des Vents (beach club) | https://larosedesvents.com/the-beach/ | BRUNCH, APÉRO, EXPOSITION — plage du Larvotto, av. Princesse Grace ; saison mars→octobre 9h30-18h30, restaurant midi et soir, transats **sur réservation téléphonique** ; prise de contrôle **Gucci** été 2026 (motif Flora) | +377 9990 6440 |
| Le Fernet | https://www.lefernet.com/ | BRUNCH, APÉRO, SOIRÉE — brasserie française, 1 av. Saint-Charles · Monte-Carlo ; **service continu 12h-23h du lundi au samedi, fermé le dimanche**. Aucun événement récurrent publié au 9 août 2026 | +377 9330 8006 |
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
| **Bars à vin & œnologie** | | | |
| Wine Palace Monte-Carlo | https://www.instagram.com/wine_palace_montecarlo/ | dégustation, œnologie (pic pdt Monaco Yacht Show, sep) | |
| Le Rouge et le Blanc (22 Quai J-C Rey) | réseaux sociaux _(pas d'agenda officiel)_ | dégustation, accords mets-vins | |
| Quai des Artistes (4 Quai Antoine Ier) | réseaux sociaux | dîners œnologiques | |
| Bar des Artistes (4 Quai Antoine Ier) | réseaux sociaux | concerts live + carte des vins | |
| Gustave (Hôtel Hermitage) | https://www.montecarlosbm.com/en/agenda | grands crus & spiritueux (SBM) | |
| Les Grands Chais Monégasques | _contact direct (sur invitation)_ | masterclass pro, dégustations importateurs | |
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

6. **ID unique** : toujours incrémenter depuis le dernier ID **manuel** dans le fichier. ⚠️ **NE JAMAIS se fier au chiffre écrit ici** (il était périmé le 4 août 2026 : il indiquait 4766 alors que 4773 était déjà pris → doublon d'id créé, qui aurait cassé les favoris). **Toujours le calculer :**
   ```bash
   grep -oE '\{id:4[0-9]{3},' src/data/events.js | grep -oE '[0-9]+' | sort -n | tail -1
   # et vérifier qu'aucun id n'est en double :
   grep -oE '\{id:[0-9]+,' src/data/events.js | sort | uniq -d
   ```
   **Dernier ID manuel utilisé : 4774** (indicatif seulement — vérifier avec la commande). Ne PAS repartir des gros ids générés (1000000+) : ce sont les récurrences auto (nightlife, cinéma). Rester dans la plage 4xxx pour les ajouts manuels/agent.

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
| **Pavyllon** (Hôtel Hermitage) | Chaque dimanche | Dim | BRUNCH Yannick Alléno (~145 €) |
| **Las Brisas** (Monte-Carlo Bay) | Chaque dimanche, **été** (mai→sep) | Dim | BRUNCH buffet vue mer (~110-125 €) |
| **Marlow** (Mareterra) | Chaque **samedi** | Sam | BRUNCH so British (~55 €) |
| **Mada One** (One Monte-Carlo) | Chaque dimanche | Dim | BRUNCH gourmand |
| **Le Petit Café Robuchon** (Mareterra) | Chaque dimanche | Dim | BRUNCH + champagne |
| **Smakelijk!** (Le Méridien) | Chaque dimanche | Dim | BRUNCH belge (~85 €) |
| **Café de Paris** (Place du Casino) | Chaque dimanche | Dim | BRUNCH brasserie |
| **Gran Caffè** (rue Grimaldi) | Chaque dimanche | Dim | BRUNCH italien |
| **Caffè Milano** (Quai Albert 1er) | Chaque dimanche | Dim | BRUNCH italien |
| **La Rascasse** (happy hour) | **Lun→Ven** | Lun-Ven | APÉRO HH 17h30-20h |
| **Sexy Tacos** (Larvotto) | **Lun→Ven** | Lun-Ven | APÉRO HH 15h30-18h30 |
| **COYA Monte-Carlo** | Chaque jeudi, **été** (avr→oct) | Jeu | APÉRO pisco bar / Clásico |
| **Gustave** (Hôtel Hermitage) | Chaque jeudi | Jeu | APÉRO chic (pas de HH à jour fixe) |
| **Norma** (Marché Condamine) | **Mar→Sam** | Mar-Sam | APÉRO afterwork 17h-20h |
| **Buddha-Bar** (Place du Casino) | Chaque samedi | Sam | APÉRO cocktails signatures |

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
