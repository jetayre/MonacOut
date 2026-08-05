import posthog from "posthog-js";

// Capteur de mesure partagé (invisible pour l'utilisateur).
// Volontairement silencieux : si PostHog est bloqué par le navigateur ou hors ligne,
// l'app doit continuer à fonctionner exactement pareil.
export function track(event, props) {
  try { posthog.capture(event, props); } catch { /* analytics indisponible */ }
}
