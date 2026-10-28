/**
 * 🎯 L'ACCUEIL REFONDU — composition, pas seulement couleurs et polices.
 *
 * Stéphanie, 28 oct 2026 : « Je ne veux pas seulement une modification des
 * couleurs et des polices. Je veux une vraie refonte de la composition
 * visuelle. » Et son objectif, qui tranche tous les arbitrages de ce fichier :
 *
 *   « Sur un même écran iPhone, on puisse déjà voir une belle photo de Monaco
 *     et deux ou trois propositions de sorties, au lieu d'un seul grand bloc
 *     d'expositions. »
 *
 * ── LE BUDGET VERTICAL, QUI DICTE TOUTES LES HAUTEURS ───────────────────────
 * Écran de référence : 390 × 844 pt. En-tête + deux barres de filtres ≈ 190 pt.
 * Reste 654 pt. Le bandeau éditorial en 16:10 fait (390 − 32) × 10/16 ≈ 224 pt,
 * le titre de section 40 pt : il reste ~390 pt, soit DEUX RANGÉES de cartes
 * illustrées 4:3. L'objectif de Stéphanie est donc tenu par construction, pas
 * par chance.
 *
 * ── CE QUI NE SE NÉGOCIE PAS ────────────────────────────────────────────────
 * · Pas de fausse photo, pas de fausse amie, pas de fausse information.
 * · Une photo de LIEU porte la mention « Photo du lieu ». Sans photo autorisée
 *   pour ce lieu précis, on met un fond graphique — jamais l'image d'un autre
 *   endroit, jamais une image « de catégorie ».
 *   🚨 C'est le défaut que Stéphanie a attrapé le 28 oct : l'ancien système
 *   posait UNE IMAGE PAR CATÉGORIE, donc la photo de l'Opéra atterrissait sur
 *   l'Auditorium Rainier III, et des enfants sur un cours de zumba.
 * · Les regroupements (« 7 expositions », « 6 films ») RESTENT — ils sont
 *   utiles quand il y a beaucoup d'événements — mais sous forme éditoriale
 *   compacte, plus en grand bloc blanc qui mange l'écran.
 * · Espacements 8 / 12 / 16 / 24. Zone tactile ≥ 44 pt.
 */
import { useState, useRef } from "react";
import { NUIT, BORDEAU, BLANC, GRIS_LISIBLE as GRIS, SAUGE, OR, SERIF, SANS, RAYON, OMBRE, GRAIN_PHOTO, VOILE_CHAUD, casseNaturelle } from "../lib/theme";
import { mediaDeLaFiche, mediasSansRepetition, photoEditoriale } from "../lib/mediatheque";
import { fondEvenement, iconeEvenement } from "../lib/habillage";
import { FriendAvatars } from "./EventCard";
import { actionDeReservation } from "../lib/reservation";
import { partagerInvitationEvenement, codeValide } from "../lib/invite";
import { track } from "../lib/track";

const GOUTTIERE = 16;
const ECART = 12;

/**
 * 🔴 LE FILET ROUGE AUTOUR DE CHAQUE FICHE.
 * Stéphanie, 28 oct 2026 : « rajoute une ligne rouge fine autour de chaque
 * fiche ». Un trait d'un pixel, dans le bordeaux de la charte : il détache la
 * carte du fond ivoire sans l'alourdir. C'est le retour du cadre, en beaucoup
 * plus discret que celui retiré le matin.
 */
const FILET = `1px solid ${BORDEAU}`;

/* ── Icônes, trait fin ───────────────────────────────────────────────────── */
const Ic = ({ d, c = GRIS, s = 13 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c}
       strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
       style={{ display: "block", flexShrink: 0 }}>{d}</svg>
);
const IcHorloge = p => <Ic {...p} d={<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>} />;
const IcCalendrier = p => <Ic {...p} d={<><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>} />;
const IcLieu = p => <Ic {...p} d={<><path d="M12 21s7-6.4 7-11a7 7 0 1 0-14 0c0 4.6 7 11 7 11z" /><circle cx="12" cy="10" r="2.6" /></>} />;

/** Le cœur en pastille blanche, posé sur l'image. */
function Coeur({ actif, onClick, taille = 28 }) {
  return (
    <button onClick={e => { e.stopPropagation(); onClick?.(); }}
            aria-label={actif ? "Retirer des favoris" : "Ajouter aux favoris"}
            style={{
              width: taille, height: taille, borderRadius: "50%", border: "none", cursor: "pointer",
              background: "rgba(255,255,255,0.94)", padding: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 7px rgba(23,36,60,0.18)",
            }}>
      <svg width={taille * 0.5} height={taille * 0.5} viewBox="0 0 24 24"
           fill={actif ? BORDEAU : "none"} stroke={BORDEAU} strokeWidth="2" strokeLinejoin="round">
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l8.8 8.8 8.8-8.8a5.5 5.5 0 0 0 0-7.8z" />
      </svg>
    </button>
  );
}

/**
 * La pastille de catégorie.
 *
 * 🎨 UNE SEULE PALETTE POUR TOUTES LES CARTES. Stéphanie, 28 oct 2026 : « les
 * fonds violet vif, vert foncé, rouge et jaune donnent un effet catalogue de
 * catégories, alors que Monac'Out doit avoir une identité beaucoup plus
 * élégante et cohérente ».
 *
 * La couleur par famille (`couleurCat`) ne sort donc plus sur les cartes : la
 * pastille est blanche, le texte en bleu nuit. `src/lib/couleurs.js` reste en
 * place — il sert encore ailleurs — mais il ne pilote plus l'habillage.
 */
function PastilleCat({ cat }) {
  return (
    <span style={{
      display: "inline-block", padding: "4px 9px", borderRadius: RAYON.pastille,
      background: "rgba(255,255,255,0.94)", color: NUIT,
      fontFamily: SANS, fontSize: 8.5, fontWeight: 800,
      letterSpacing: 1, textTransform: "uppercase", whiteSpace: "nowrap",
      boxShadow: "0 2px 7px rgba(21,38,59,0.16)",
    }}>{cat}</span>
  );
}

/**
 * L'ACTION PRINCIPALE d'une carte : « Réserver une place / une table ».
 * ⚠️ Elle n'apparaît QUE si la réservation existe vraiment (règle 30 : pas de
 * bouton sans page vérifiée cadrable, le téléphone restant un vrai moyen de
 * réserver). Une foire ou une messe n'en a pas, et c'est voulu.
 */
function BoutonResa({ event, lang, onReserver, compact = false }) {
  const a = actionDeReservation(event, event?.cat, lang);
  if (!a) return null;
  const toucher = e => {
    e.stopPropagation();
    if (a.mode === "tel") { window.location.href = a.url; return; }
    onReserver?.(a.url, event.title?.replace(/\n/g, " "));
  };
  return (
    <button onClick={toucher} style={{
      alignSelf: "flex-start", marginTop: 2,
      background: "none", border: "none", padding: compact ? "2px 0" : "3px 0",
      cursor: "pointer", fontFamily: SANS, fontSize: compact ? 11 : 11.5,
      fontWeight: 700, color: BORDEAU, whiteSpace: "nowrap",
    }}>{a.mot} →</button>
  );
}


/**
 * 🤝 « INVITE TES AMIS » — à la place des avatars quand personne n'y va encore.
 *
 * Stéphanie, 28 oct 2026 : « quand tu n'as pas d'amis, mets "invite tes amis"
 * et ça partage ton lien d'amitié pour l'event ».
 *
 * Le lien partagé porte l'événement ET le code d'amitié : la personne arrive
 * sur LA bonne fiche, et l'amitié se fait. Un lien d'invitation nu la ferait
 * atterrir sur l'accueil sans savoir de quelle sortie on lui parlait.
 *
 * ⚠️ SANS COMPTE, PAS DE CODE — donc pas d'amitié possible. Le bouton ouvre
 * alors l'inscription plutôt que de partager un lien qui ne relierait personne
 * (le défaut du 7 août, parti en silence avec « … » à la place du code).
 * ⚠️ Rien ne sort de l'app : c'est la feuille de partage du système, pas une
 * page web — aucun risque de l'écran noir du 7 août.
 */
function InviteTesAmis({ event, lang, inviteCode, onShowAuth, petit = false }) {
  const pret = codeValide(inviteCode);
  const toucher = async (e) => {
    e.stopPropagation();
    if (!pret) { onShowAuth?.(); track("invite_event_sans_compte", { id: event?.id }); return; }
    const r = await partagerInvitationEvenement(inviteCode, event, lang);
    track("invite_event_partage", { id: event?.id, resultat: r });
  };
  return (
    <button onClick={toucher} style={{
      alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 5,
      background: "none", border: "none", padding: petit ? "2px 0" : "3px 0", cursor: "pointer",
      fontFamily: SANS, fontSize: petit ? 11 : 11.5, fontWeight: 700, color: BORDEAU, whiteSpace: "nowrap",
    }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={BORDEAU}
           strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M19 8v6M22 11h-6" />
      </svg>
      {lang === "en" ? "Invite your friends" : "Invite tes amis"}
    </button>
  );
}


/**
 * 🏷️ CE QUE DIT UNE PHOTO — désormais dans le TEXTE ALTERNATIF, plus sur l'image.
 *
 * Stéphanie, 28 oct 2026 : « pas besoin de mettre une légende sur la photo ».
 * Le bandeau « Photo du lieu » / « Monte-Carlo — photo du quartier » est donc
 * retiré de l'affichage : il alourdissait chaque vignette et répétait une
 * information que l'on lit déjà sous la carte (le lieu est juste en dessous).
 *
 * ⚠️ MAIS L'INFORMATION N'EST PAS PERDUE. Elle passe dans l'attribut `alt` de
 * l'image : c'est ce que lit VoiceOver, c'est ce qui s'affiche si la photo ne
 * charge pas, et c'est ce qui empêche de faire passer une vue de quartier pour
 * la façade d'un établissement. Une carte de groupe dit toujours que le lieu
 * photographié n'est QU'UN des endroits proposés, et la Foire porte toujours
 * l'année de son édition.
 */
function legendeMedia(media, lang) {
  switch (media.mediaType) {
    case "edition":
      return lang === "en"
        ? `Photo — ${media.edition} edition`
        : `Photo — édition ${media.edition}`;
    case "quartier":
      return lang === "en"
        ? `${media.nomLieu} — area photo`
        : `${media.nomLieu} — photo du quartier`;
    case "groupe":
      return lang === "en"
        ? `${media.nomLieu} — one of the venues`
        : `${media.nomLieu} — l'un des lieux`;
    default:
      return media.nomLieu
        ? (lang === "en" ? `Venue photo — ${media.nomLieu}` : `Photo du lieu — ${media.nomLieu}`)
        : (lang === "en" ? "Venue photo" : "Photo du lieu");
  }
}

/**
 * Le visuel d'une fiche. Ordre imposé par le brief :
 * photo d'événement → photo du LIEU EXACT (étiquetée) → fond graphique.
 * `ratio` en pourcentage de padding-top : 75 % = 4:3, 62.5 % = 16:10.
 */
function Visuel({ event, ratio = 75, arrondi = 0, lang = "fr", media: fourni = null }) {
  const media = fourni || mediaDeLaFiche(event);
  return (
    <div style={{
      position: "relative", width: "100%", paddingTop: `${ratio}%`,
      background: media ? SAUGE : undefined, borderRadius: arrondi, overflow: "hidden",
      ...(media ? {} : fondEvenement(event)),
    }}>
      {media ? (
        <>
          {/* `loading=lazy` + dimensions déclarées : la place est réservée avant
              l'arrivée de l'image, donc aucun saut de mise en page. */}
          {/* L'`alt` porte la nature exacte de la photo — lieu, l'un des lieux
              d'un groupe, quartier, édition passée — puisque la légende visible
              a été retirée. */}
          <img src={media.src} alt={legendeMedia(media, lang)} loading="lazy" decoding="async"
               width={media.width} height={media.height}
               style={{
                 position: "absolute", inset: 0, width: "100%", height: "100%",
                 objectFit: "cover", display: "block",
                 filter: GRAIN_PHOTO,
               }} />
          {/* Le voile champagne : c'est lui qui donne le même ton doré à des
              photos prises par des gens différents, à des saisons différentes. */}
          <span aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", ...VOILE_CHAUD }} />
        </>
      ) : (
        <span style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 34, opacity: 0.28, lineHeight: 1,
        }}>{iconeEvenement(event)}</span>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   4 · LE BANDEAU ÉDITORIAL — grande photo de Monaco, texte SUR l'image.
   ══════════════════════════════════════════════════════════════════════════ */
export function BandeauEditorial({ lang, nbSorties }) {
  const photo = photoEditoriale();
  if (!photo) return null;
  return (
    <div style={{
      margin: `16px ${GOUTTIERE}px 0`, position: "relative",
      borderRadius: RAYON.md, overflow: "hidden", boxShadow: OMBRE.carte, background: NUIT,
    }}>
      {/* 16:10 — (390 − 32) × 10/16 ≈ 224 pt, assez grand pour être beau, assez
          court pour laisser deux rangées de sorties sur le même écran. */}
      <div style={{ width: "100%", paddingTop: "62.5%", position: "relative" }}>
        <img src={photo.src} alt={photo.alt} loading="eager" decoding="async"
             style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(10,16,28,0) 42%, rgba(10,16,28,0.82) 100%)",
      }} />
      <div style={{ position: "absolute", left: 16, right: 16, bottom: 14 }}>
        <div style={{ width: 32, height: 2, background: OR, borderRadius: 2, marginBottom: 9 }} />
        <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 24, color: "#FFFFFF", lineHeight: 1.15 }}>
          {lang === "en" ? "Monaco, today" : "Monaco, aujourd'hui"}
        </div>
        {/* ⚠️ Un chiffre RÉEL, compté sur les fiches affichées. Rien d'inventé. */}
        {nbSorties > 0 && (
          <div style={{ fontFamily: SANS, fontSize: 12.5, color: "rgba(255,255,255,0.88)", marginTop: 4 }}>
            {lang === "en"
              ? `${nbSorties} outing${nbSorties > 1 ? "s" : ""} to choose from`
              : `${nbSorties} sortie${nbSorties > 1 ? "s" : ""} à choisir`}
          </div>
        )}
      </div>
    </div>
  );
}


/* ══════════════════════════════════════════════════════════════════════════
   5 · LE HERO — téléphone de GAUCHE de la maquette, carte du haut.
   Stéphanie, 28 oct 2026 : « tu peux faire exactement comme ça, à 100 % pareil ».
   Critère n° 3 du brief : « le titre et le CTA sont SUR l'image du hero, pas
   sous un rectangle vide ».
   ══════════════════════════════════════════════════════════════════════════ */
function Hero({ event, lang, favorites, onToggleFav, onCardClick, amis, onReserver, inviteCode, onShowAuth, media = null }) {
  const fav = favorites?.includes(event.id);
  const lieu = String(event.subtitle || "").trim();
  return (
    <div onClick={() => onCardClick?.(event)} style={{
      position: "relative", borderRadius: RAYON.md, overflow: "hidden",
      boxShadow: OMBRE.carte, cursor: "pointer", background: NUIT, border: FILET,
    }}>
      {/* ~272 pt de haut en largeur 358 : la fourchette 270–300 pt du brief. */}
      <Visuel event={event} ratio={76} lang={lang} media={media} />

      {/* Sans ce dégradé, un ciel clair avalerait le titre blanc. */}
      <div style={{
        position: "absolute", inset: 0,
        /* ⚠️ Assombri le 28 oct : sur la photo de la foire — manèges éclairés,
           ciel bleu vif — le titre blanc se perdait dans les couleurs. Le
           dégradé démarre donc plus haut et plus fort. */
        background: "linear-gradient(180deg, rgba(10,16,28,0.34) 0%, rgba(10,16,28,0.08) 24%, rgba(10,16,28,0.62) 50%, rgba(10,16,28,0.95) 100%)",
      }} />

      <div style={{ position: "absolute", top: 12, left: 12, right: 12, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <PastilleCat cat={event.cat} />
        <Coeur actif={fav} onClick={() => onToggleFav?.(event.id)} taille={36} />
      </div>

      <div style={{ position: "absolute", left: 16, right: 16, bottom: 14 }}>
        <div style={{ width: 34, height: 2, background: OR, borderRadius: 2, marginBottom: 10 }} />
        <h2 style={{
          margin: 0, fontFamily: SERIF, fontWeight: 600, fontSize: 25, lineHeight: 1.16,
          color: "#FFFFFF", letterSpacing: -0.2,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>{casseNaturelle(event.title?.replace(/\n/g, " "))}</h2>

        <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 9 }}>
          <IcCalendrier c="rgba(255,255,255,0.9)" s={14} />
          <span style={{
            fontFamily: SANS, fontSize: 12.5, color: "rgba(255,255,255,0.93)",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>{event.time ? `${event.time} · ${lieu}` : lieu}</span>
        </div>

        {/* ⚠️ Uniquement si des amies y vont VRAIMENT — rien n'est simulé.
            Sinon on PROPOSE d'en inviter, plutôt que de laisser un vide. */}
        {amis?.length > 0 ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 9 }}>
            <FriendAvatars friends={amis} />
            <span style={{ fontFamily: SANS, fontSize: 12.5, color: "rgba(255,255,255,0.93)" }}>
              {amis.length === 1
                ? (lang === "en" ? "1 friend is going" : "1 amie y va")
                : (lang === "en" ? `${amis.length} friends are going` : `${amis.length} amies y vont`)}
            </span>
          </div>
        ) : (
          <div style={{ marginTop: 9 }}>
            {/* Sur la photo, le bordeaux ne se lirait pas : ici le lien est blanc. */}
            <span style={{ display: "inline-block", filter: "brightness(0) invert(1)" }}>
              <InviteTesAmis event={event} lang={lang} inviteCode={inviteCode} onShowAuth={onShowAuth} />
            </span>
          </div>
        )}

        <button onClick={e => { e.stopPropagation(); onCardClick?.(event); }} style={{
          marginTop: 13, width: "100%", minHeight: 46,
          background: BORDEAU, color: "#FFFFFF", border: "none",
          borderRadius: RAYON.pastille, cursor: "pointer",
          fontFamily: SANS, fontSize: 14, fontWeight: 700, letterSpacing: 0.3,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
        }}>
          {lang === "en" ? "See the event" : "Voir l'événement"}
          <span style={{ fontSize: 15, lineHeight: 1 }}>→</span>
        </button>
      </div>
    </div>
  );
}

/**
 * Le carrousel de heros + ses points.
 * ⚠️ Les points n'apparaissent QUE s'il y a vraiment plusieurs fiches à faire
 * défiler — le brief l'exige (« uniquement si carrousel réel »).
 */
export function CarrouselHero({ fiches, lang, favorites, onToggleFav, onCardClick, social, onReserver, inviteCode, onShowAuth }) {
  const [actif, setActif] = useState(0);
  const ref = useRef(null);
  // On fait défiler quatre heros : deux vues identiques à la suite donneraient
  // l'impression que le carrousel ne bouge pas.
  const medias = mediasSansRepetition(fiches || []);
  if (!fiches?.length) return null;
  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== actif) setActif(i);
  };
  return (
    <div style={{ marginTop: 16 }}>
      <div ref={ref} onScroll={onScroll} style={{
        display: "flex", overflowX: "auto", scrollSnapType: "x mandatory",
        scrollbarWidth: "none", touchAction: "pan-x", overscrollBehaviorX: "contain",
      }}>
        {fiches.map((e, i) => (
          <div key={e.cleFil || e.id} style={{
            flex: "0 0 100%", scrollSnapAlign: "start",
            padding: `0 ${GOUTTIERE}px`, boxSizing: "border-box",
          }}>
            <Hero event={e} lang={lang} media={medias[i]} favorites={favorites} onToggleFav={onToggleFav}
                  onCardClick={onCardClick} onReserver={onReserver}
                  inviteCode={inviteCode} onShowAuth={onShowAuth}
                  amis={social && !e.ongoing ? social.friendsGoingTo(e.id) : []} />
          </div>
        ))}
      </div>
      {fiches.length > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 11 }}>
          {fiches.map((_, i) => (
            <span key={i} style={{
              width: 6, height: 6, borderRadius: "50%",
              background: i === actif ? BORDEAU : "rgba(23,36,60,0.18)", transition: "background .2s",
            }} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   LE TITRE DE SECTION — serif + filet fin + « Tout voir »
   ══════════════════════════════════════════════════════════════════════════ */
export function TitreSection({ titre, onToutVoir, lang }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: `0 ${GOUTTIERE}px`, marginTop: 24, marginBottom: 12 }}>
      <h3 style={{ margin: 0, fontFamily: SERIF, fontWeight: 600, fontSize: 22, color: NUIT, whiteSpace: "nowrap" }}>{titre}</h3>
      <div style={{ flex: 1, height: 1, background: "rgba(184,156,104,0.5)" }} />
      {onToutVoir && (
        <button onClick={onToutVoir} style={{
          background: "none", border: "none", cursor: "pointer", padding: "4px 0",
          fontFamily: SANS, fontSize: 12, fontWeight: 700, color: BORDEAU, whiteSpace: "nowrap",
        }}>{lang === "en" ? "See all →" : "Tout voir →"}</button>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   6 · LA CARTE ILLUSTRÉE — 4:3, deux par rangée (173 pt en largeur 390).
   ══════════════════════════════════════════════════════════════════════════ */
function CarteIllustree({ event, lang, favorites, onToggleFav, onCardClick, amis, onReserver, inviteCode, onShowAuth, media = null }) {
  const fav = favorites?.includes(event.id);
  const lieu = String(event.subtitle || "").split("·")[0].trim();
  return (
    <div onClick={() => onCardClick?.(event)} style={{
      background: BLANC, borderRadius: RAYON.sm, overflow: "hidden",
      boxShadow: OMBRE.carte, cursor: "pointer", border: FILET,
      display: "flex", flexDirection: "column", height: "100%",
    }}>
      <div style={{ position: "relative" }}>
        <Visuel event={event} ratio={75} lang={lang} media={media} />
        <div style={{ position: "absolute", top: 7, left: 7, right: 7, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <PastilleCat cat={event.cat} />
          <Coeur actif={fav} onClick={() => onToggleFav?.(event.id)} taille={26} />
        </div>
      </div>
      <div style={{ padding: "9px 10px 11px", display: "flex", flexDirection: "column", gap: 5, flex: 1 }}>
        <h4 style={{
          margin: 0, fontFamily: SERIF, fontWeight: 600, fontSize: 15, lineHeight: 1.2, color: NUIT,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>{casseNaturelle(event.title?.replace(/\n/g, " "))}</h4>
        {event.time && (
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <IcHorloge s={12} />
            <span style={{ fontFamily: SANS, fontSize: 11.5, color: GRIS, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{event.time}</span>
          </div>
        )}
        {lieu && (
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <IcLieu s={12} />
            <span style={{ fontFamily: SANS, fontSize: 11.5, color: GRIS, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{lieu}</span>
          </div>
        )}
        {amis?.length > 0 ? (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 1 }}>
            <FriendAvatars friends={amis} />
            <span style={{ fontFamily: SANS, fontSize: 11, color: GRIS }}>
              {amis.length === 1 ? (lang === "en" ? "1 friend" : "1 amie") : `${amis.length} ${lang === "en" ? "friends" : "amies"}`}
            </span>
          </div>
        ) : (
          <InviteTesAmis event={event} lang={lang} inviteCode={inviteCode} onShowAuth={onShowAuth} petit />
        )}
        <div style={{ marginTop: "auto" }}>
          <BoutonResa event={event} lang={lang} onReserver={onReserver} compact />
        </div>
      </div>
    </div>
  );
}

/** La grille deux colonnes : gouttière 16, écart 12 → 173 pt par carte. */
export function GrilleDeuxColonnes({ fiches, lang, favorites, onToggleFav, onCardClick, social, onReserver, inviteCode, onShowAuth, recents }) {
  if (!fiches?.length) return null;
  // 🔁 Les photos sont résolues POUR TOUTE LA GRILLE, dans l'ordre d'affichage :
  // c'est la seule façon d'éviter deux fois la même vue côte à côte.
  const medias = mediasSansRepetition(fiches, recents);
  return (
    /* ⚠️ `stretch` ET NON `start`. Stéphanie, 28 oct 2026 : « toutes les fiches
       doivent avoir la même taille ». Avec `start`, une carte sans bouton
       « Réserver » était plus courte que sa voisine et la rangée penchait. Les
       deux colonnes font désormais la hauteur de la plus haute, et le bloc de
       texte pousse son contenu vers le bas. */
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ECART, padding: `0 ${GOUTTIERE}px`, alignItems: "stretch" }}>
      {fiches.map((e, i) => (
        <CarteIllustree key={e.cleFil || e.id} event={e} lang={lang} media={medias[i]}
                        favorites={favorites} onToggleFav={onToggleFav} onCardClick={onCardClick}
                        onReserver={onReserver} inviteCode={inviteCode} onShowAuth={onShowAuth}
                        amis={social && !e.ongoing ? social.friendsGoingTo(e.id) : []} />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   5 · LA CARTE COMPACTE EN RANGÉE — ~86 pt de haut, vignette 4:3 à gauche.
   ══════════════════════════════════════════════════════════════════════════ */
/**
 * La carte compacte en rangée. Avec `onInfos`, elle sert aussi de fiche-mère
 * d'annuaire (« MUSÉES · 6 OUVERTS ») : elle porte alors « Voir les N » au lieu
 * d'un bouton de réservation, et se déplie en sous-fiches comme avant.
 * ⚠️ Hauteur visée 120–170 pt comme le demande le brief : la vignette fait 92 pt
 * de large en 4:3, donc 69 pt, et la carte tient autour de 86 pt.
 */
export function CarteRangee({ event, lang, favorites, onToggleFav, onCardClick, social, onReserver, onInfos = null, infosDepliees = false, nbLieux = 0, inviteCode, onShowAuth, recents }) {
  const fav = favorites?.includes(event.id);
  const lieu = String(event.subtitle || "").split("·")[0].trim();
  const amis = social && !event.ongoing ? social.friendsGoingTo(event.id) : [];
  return (
    <div onClick={() => onCardClick?.(event)} style={{
      background: BLANC, borderRadius: RAYON.sm, overflow: "hidden", boxShadow: OMBRE.carte,
      cursor: "pointer", display: "flex", gap: 11, padding: 8, marginBottom: ECART, border: FILET,
    }}>
      <div style={{ width: 92, flexShrink: 0, position: "relative" }}>
        <Visuel event={event} ratio={75} arrondi={9} lang={lang} media={mediasSansRepetition([event], recents)[0]} />
      </div>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: 4, paddingRight: 2 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
          <h4 style={{
            flex: 1, margin: 0, fontFamily: SERIF, fontWeight: 600, fontSize: 15, lineHeight: 1.2, color: NUIT,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>{casseNaturelle(event.title?.replace(/\n/g, " "))}</h4>
          <Coeur actif={fav} onClick={() => onToggleFav?.(event.id)} taille={26} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {event.time && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <IcHorloge s={12} />
              <span style={{ fontFamily: SANS, fontSize: 11.5, color: GRIS }}>{event.time}</span>
            </span>
          )}
          {lieu && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, minWidth: 0 }}>
              <IcLieu s={12} />
              <span style={{ fontFamily: SANS, fontSize: 11.5, color: GRIS, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{lieu}</span>
            </span>
          )}
        </div>
        {amis.length > 0 ? (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <FriendAvatars friends={amis} />
            <span style={{ fontFamily: SANS, fontSize: 11, color: GRIS }}>
              {amis.length === 1 ? (lang === "en" ? "1 friend is going" : "1 amie y va") : `${amis.length} ${lang === "en" ? "friends are going" : "amies y vont"}`}
            </span>
          </div>
        ) : !onInfos ? (
          /* Une fiche-mère d'annuaire porte déjà « Voir les N » : on ne lui
             ajoute pas un second lien, la bande déborderait. */
          <InviteTesAmis event={event} lang={lang} inviteCode={inviteCode} onShowAuth={onShowAuth} petit />
        ) : null}
        {onInfos ? (
          <button onClick={e => { e.stopPropagation(); onInfos(); }} style={{
            alignSelf: "flex-start", marginTop: 2, background: "none", border: "none",
            padding: "3px 0", cursor: "pointer", fontFamily: SANS, fontSize: 11.5,
            fontWeight: 700, color: BORDEAU, whiteSpace: "nowrap",
          }}>
            {infosDepliees
              ? (lang === "en" ? "Close" : "Replier")
              : (lang === "en" ? `See the ${nbLieux} →` : `Voir les ${nbLieux} →`)}
          </button>
        ) : (
          <BoutonResa event={event} lang={lang} onReserver={onReserver} />
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   LE REGROUPEMENT COMPACT — « 7 expositions », « 6 films »…
   Stéphanie : « ne pas les supprimer, ils sont utiles quand tu as beaucoup
   d'événements. Il faut simplement les rendre moins imposants et mieux
   intégrés aux photos. » D'où cette bande basse (~76 pt) où la photo du
   PREMIER lieu reconnu sert de vignette, et où les suivants sont cités.
   ══════════════════════════════════════════════════════════════════════════ */
export function BandeRegroupement({ fiches, cat, lang, deplie, onBasculer, recents }) {
  if (!fiches?.length) return null;
  const n = fiches.length;
  // La vignette vient d'une fiche du groupe qui a VRAIMENT une photo de son
  // lieu ; à défaut, l'habillage de la première. On n'illustre pas un groupe
  // avec la photo d'un lieu qui n'en fait pas partie.
  // 🔁 La bande passe par le MÊME registre que les grilles : sans ça, sa
  // vignette reprenait la photo de la carte juste au-dessus.
  const avecPhoto = fiches.find(f => mediaDeLaFiche(f)) || fiches[0];
  const mediaBande = mediasSansRepetition([avecPhoto], recents)[0];
  const noms = fiches.slice(0, 2).map(f => casseNaturelle(f.title?.replace(/\n/g, " "))).join(" · ");
  return (
    <div onClick={onBasculer} style={{
      background: BLANC, borderRadius: RAYON.sm, overflow: "hidden", boxShadow: OMBRE.carte,
      cursor: "pointer", display: "flex", gap: 11, padding: 8, marginBottom: ECART,
      border: FILET,
      borderLeft: `3px solid ${OR}`,   // champagne : la seule touche de couleur
    }}>
      <div style={{ width: 82, flexShrink: 0 }}>
        <Visuel event={avecPhoto} ratio={75} arrondi={9} lang={lang} media={mediaBande} />
      </div>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: 4 }}>
        <div style={{ fontFamily: SANS, fontSize: 8.5, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: BORDEAU }}>{cat}</div>
        <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 15.5, color: NUIT, lineHeight: 1.2 }}>
          {lang === "en" ? `${n} to see today` : `${n} à voir aujourd'hui`}
        </div>
        <div style={{
          fontFamily: SANS, fontSize: 11, color: GRIS, lineHeight: 1.3,
          display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>{noms}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", paddingRight: 4 }}>
        <span style={{ fontFamily: SANS, fontSize: 11.5, fontWeight: 700, color: BORDEAU, whiteSpace: "nowrap" }}>
          {deplie ? (lang === "en" ? "Close" : "Replier") : (lang === "en" ? `See ${n} →` : `Voir les ${n} →`)}
        </span>
      </div>
    </div>
  );
}
