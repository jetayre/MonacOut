import { useState, useEffect } from 'react'
import { Capacitor } from '@capacitor/core'
import posthog from 'posthog-js'
import { supabase } from '../lib/supabase'
import { empreinte, versE164 } from '../lib/phone'

// URL publique https de l'app (Universal Link). En natif, window.location.origin
// vaut "capacitor://localhost" — inutilisable comme redirection de lien magique.
const APP_URL = 'https://monac-out.vercel.app'

// Retrouver ses amies par le carnet d'adresses : construit, pas branché.
// Passer à true le jour où la migration supabase/2026-09-23-telephone.sql est
// passée ET où l'interface correspondante est remise dans FriendsScreen.
const CONTACTS_ACTIF = false

export function useAuth() {
  const [user, setUser]       = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  // On sait seulement OUI ou NON. L'empreinte du numéro ne redescend jamais du
  // serveur : elle n'a aucune raison de circuler, et ce qui ne circule pas ne fuit pas.
  const [phoneSaved, setPhoneSaved] = useState(false)

  useEffect(() => {
    if (!supabase) { setLoading(false); return }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        try { posthog.identify(session.user.id) } catch { /* analytics indispo */ }  // relie la personne PostHog au compte (savoir qui est inscrit)
        loadProfile(session.user.id)
      } else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        try { posthog.identify(session.user.id) } catch { /* analytics indispo */ }
        loadProfile(session.user.id)
      } else { setProfile(null); setLoading(false) }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function loadProfile(userId) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    setProfile(data)
    setLoading(false)
    // ⏸ EN ATTENTE. Le carnet d'adresses a été mis de côté le 23 sep 2026 pour
    // traiter d'abord l'ouverture de `profiles`. Tant que CONTACTS_ACTIF est faux,
    // on n'interroge pas le serveur : inutile de payer un aller-retour à chaque
    // chargement de profil pour une fonction dont rien ne se sert encore.
    if (CONTACTS_ACTIF) {
      try {
        const { data: ok } = await supabase.rpc('mon_numero_est_enregistre')
        setPhoneSaved(ok === true)
      } catch { setPhoneSaved(false) }
    }
  }

  // Enregistre MON numéro sous forme d'empreinte. Le numéro lui-même ne quitte
  // jamais le téléphone — ni vers le serveur, ni vers PostHog, ni dans un log.
  async function savePhone(brut) {
    if (!supabase || !user) return { error: 'Non connecté' }
    if (!versE164(brut)) return { error: 'Numéro non reconnu — essaie 06 12 34 56 78 ou 93 15 22 95' }
    const hash = await empreinte(brut)
    if (!hash) return { error: 'Ton navigateur ne sait pas chiffrer ce numéro' }
    const { error } = await supabase.rpc('enregistrer_mon_numero', { hash })
    if (error) return { error: error.message }
    setPhoneSaved(true)
    try { posthog.capture('phone_saved') } catch { /* analytics indispo */ }
    return { ok: true }
  }

  // Le retirer doit être aussi simple que le donner.
  async function removePhone() {
    if (!supabase || !user) return { error: 'Non connecté' }
    const { error } = await supabase.rpc('enregistrer_mon_numero', { hash: null })
    if (error) return { error: error.message }
    setPhoneSaved(false)
    try { posthog.capture('phone_removed') } catch { /* analytics indispo */ }
    return { ok: true }
  }

  // Envoie un lien magique (clic = connecté) + code en secours dans le même email.
  async function sendCode(email) {
    if (!supabase) return { error: 'Non configuré' }
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: 'https://monac-out.vercel.app',
      },
    })
    return { error }
  }

  // Vérifie le code saisi → ouvre la session.
  async function verifyCode(email, token) {
    if (!supabase) return { error: 'Non configuré' }
    const { error } = await supabase.auth.verifyOtp({ email, token: String(token).trim(), type: 'email' })
    return { error }
  }

  async function saveProfile(displayName, topics, avatarUrl) {
    if (!supabase || !user) return
    const isNew = !profile?.display_name           // 1er enregistrement du prénom = nouveau compte
    const row = { id: user.id, display_name: displayName }
    if (Array.isArray(topics)) row.preferred_topics = topics
    if (typeof avatarUrl === 'string') row.avatar_url = avatarUrl   // '' = retirer la photo

    let { data, error } = await supabase.from('profiles').upsert(row).select().single()
    // Filet de sécurité : si la colonne avatar_url n'existe pas encore côté base,
    // on réenregistre SANS la photo. Le prénom ne doit jamais être perdu à cause d'elle.
    if (error && 'avatar_url' in row) {
      const sansPhoto = { ...row }; delete sansPhoto.avatar_url
      const retour = await supabase.from('profiles').upsert(sansPhoto).select().single()
      data = retour.data; error = retour.error
    }
    if (error) return { error: error.message }
    setProfile(data)
    if (isNew) {
      try { posthog.capture('signup_completed', { topics: Array.isArray(topics) ? topics : [] }) } catch { /* analytics indisponible */ }
    }
  }

  async function signOut() {
    if (!supabase) return
    await supabase.auth.signOut()
    try { posthog.reset() } catch { /* analytics indispo */ }  // délie la personne PostHog (déconnexion explicite uniquement)
  }

  async function deleteAccount() {
    if (!supabase) return { error: 'Non connecté' }
    const { error } = await supabase.rpc('delete_own_account')
    if (error) return { error: error.message }   // on ne déconnecte PAS si la suppression a échoué
    await supabase.auth.signOut()
    return { ok: true }
  }

  return { user, profile, loading, phoneSaved, sendCode, verifyCode, saveProfile,
           savePhone, removePhone, signOut, deleteAccount }
}
