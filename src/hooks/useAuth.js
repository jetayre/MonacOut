import { useState, useEffect } from 'react'
import { Capacitor } from '@capacitor/core'
import { supabase } from '../lib/supabase'

// URL publique https de l'app (Universal Link). En natif, window.location.origin
// vaut "capacitor://localhost" — inutilisable comme redirection de lien magique.
const APP_URL = 'https://monac-out.vercel.app'

export function useAuth() {
  const [user, setUser]       = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) { setLoading(false); return }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) loadProfile(session.user.id)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
      if (session?.user) loadProfile(session.user.id)
      else { setProfile(null); setLoading(false) }
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
  }

  async function sendMagicLink(email) {
    if (!supabase) return { error: 'Non configuré' }
    // Sans emailRedirectTo → Supabase envoie un code OTP à 6 chiffres (pas de lien).
    // Fonctionne dans Gmail, WhatsApp, tous les clients mail.
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true }
    })
    return { error }
  }

  async function verifyOtp(email, token) {
    if (!supabase) return { error: 'Non configuré' }
    const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' })
    return { error }
  }

  async function saveProfile(displayName, topics) {
    if (!supabase || !user) return
    const row = { id: user.id, display_name: displayName }
    if (Array.isArray(topics)) row.preferred_topics = topics
    const { data } = await supabase
      .from('profiles')
      .upsert(row)
      .select()
      .single()
    setProfile(data)
  }

  async function signOut() {
    if (!supabase) return
    await supabase.auth.signOut()
  }

  async function deleteAccount() {
    if (!supabase) return { error: 'Non connecté' }
    const { error } = await supabase.rpc('delete_own_account')
    if (error) return { error: error.message }   // on ne déconnecte PAS si la suppression a échoué
    await supabase.auth.signOut()
    return { ok: true }
  }

  return { user, profile, loading, sendMagicLink, verifyOtp, saveProfile, signOut, deleteAccount }
}
