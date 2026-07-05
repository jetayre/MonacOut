import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

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
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin }
    })
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
    if (!supabase) return
    await supabase.rpc('delete_own_account')
    await supabase.auth.signOut()
  }

  return { user, profile, loading, sendMagicLink, saveProfile, signOut, deleteAccount }
}
