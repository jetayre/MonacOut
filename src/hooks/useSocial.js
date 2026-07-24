import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useSocial(userId) {
  const [myParticipations, setMyParticipations] = useState([])  // event_id[]
  const [friends, setFriends]                   = useState([])  // [{ id, display_name, invite_code, participations: event_id[], canSeeMe: bool }]
  const [pending, setPending]                   = useState([])  // demandes reçues
  const [visibility, setVisibility]             = useState([])  // friend_id[] qui peuvent me voir

  const load = useCallback(async () => {
    if (!supabase || !userId) return

    // Mes participations
    const { data: parts } = await supabase
      .from('participations')
      .select('event_id')
      .eq('user_id', userId)
      .eq('incognito', false)
    setMyParticipations((parts || []).map(p => p.event_id))

    // Toutes les connexions (pending ou accepted = ami immédiat via lien)
    const { data: friendships } = await supabase
      .from('friendships')
      .select('requester_id, addressee_id, status')
      .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)

    const friendIds = [...new Set((friendships || []).map(f =>
      f.requester_id === userId ? f.addressee_id : f.requester_id
    ))]

    // Demandes en attente reçues (pour UI optionnel)
    const pendingReqs = []
    const pendingIds = []

    // Profils des amis et demandeurs
    const allIds = [...new Set([...friendIds, ...pendingIds])]
    if (!allIds.length) { setFriends([]); setPending([]); setVisibility([]); return }

    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, display_name, invite_code')
      .in('id', allIds)

    // Visibilité : qui a activé "peut me voir"
    const { data: vis } = await supabase
      .from('visibility')
      .select('visible_to_id')
      .eq('user_id', userId)
      .in('visible_to_id', friendIds)
    const visSet = new Set((vis || []).map(v => v.visible_to_id))

    // Par défaut : on se rend visible à ses amis (sauf ceux qu'on a explicitement masqués).
    // Le masquage est mémorisé en local → on ne re-force jamais la visibilité d'un ami masqué.
    try {
      const hidden = JSON.parse(localStorage.getItem('monacout_vis_hidden') || '[]')
      const toDefault = friendIds.filter(fid => !visSet.has(fid) && !hidden.includes(fid))
      if (toDefault.length) {
        await supabase.from('visibility').insert(toDefault.map(fid => ({ user_id: userId, visible_to_id: fid })))
        toDefault.forEach(fid => visSet.add(fid))
      }
    } catch { /* best-effort : si ça échoue, on garde l'état existant */ }

    setVisibility([...visSet])

    // Participations des amis qui m'ont autorisé à les voir
    const { data: visByFriends } = await supabase
      .from('visibility')
      .select('user_id')
      .eq('visible_to_id', userId)
      .in('user_id', friendIds)
    const visibleFriendIds = new Set((visByFriends || []).map(v => v.user_id))

    let friendParts = {}
    if (visibleFriendIds.size) {
      const { data: fp } = await supabase
        .from('participations')
        .select('user_id, event_id')
        .in('user_id', [...visibleFriendIds])
        .eq('incognito', false)
      for (const p of (fp || [])) {
        if (!friendParts[p.user_id]) friendParts[p.user_id] = []
        friendParts[p.user_id].push(p.event_id)
      }
    }

    const profileMap = Object.fromEntries((profiles || []).map(p => [p.id, p]))

    setFriends(friendIds.map(fid => ({
      ...profileMap[fid],
      participations: friendParts[fid] || [],
      canSeeMe: visSet.has(fid),
    })).filter(Boolean))

    setPending((pendingReqs || []).map(r => ({
      friendshipId: r.id,
      ...profileMap[r.requester_id],
    })).filter(p => p.id))
  }, [userId])

  useEffect(() => { load() }, [load])

  async function toggleParticipation(eventId) {
    if (!supabase || !userId) return
    const isGoing = myParticipations.includes(eventId)
    if (isGoing) {
      await supabase.from('participations').delete().eq('user_id', userId).eq('event_id', eventId)
      setMyParticipations(prev => prev.filter(id => id !== eventId))
    } else {
      await supabase.from('participations').insert({ user_id: userId, event_id: eventId })
      setMyParticipations(prev => [...prev, eventId])
    }
  }

  async function toggleVisibility(friendId) {
    if (!supabase || !userId) return
    const isVisible = visibility.includes(friendId)
    let hidden = []
    try { hidden = JSON.parse(localStorage.getItem('monacout_vis_hidden') || '[]') } catch { /* rien */ }
    if (isVisible) {
      await supabase.from('visibility').delete().eq('user_id', userId).eq('visible_to_id', friendId)
      setVisibility(prev => prev.filter(id => id !== friendId))
      // On mémorise le masquage → le défaut « visible » ne le re-forcera pas au prochain chargement.
      if (!hidden.includes(friendId)) { try { localStorage.setItem('monacout_vis_hidden', JSON.stringify([...hidden, friendId])) } catch { /* rien */ } }
    } else {
      await supabase.from('visibility').insert({ user_id: userId, visible_to_id: friendId })
      setVisibility(prev => [...prev, friendId])
      try { localStorage.setItem('monacout_vis_hidden', JSON.stringify(hidden.filter(id => id !== friendId))) } catch { /* rien */ }
    }
  }

  async function addFriendByCode(inviteCode) {
    if (!supabase || !userId) return { error: 'Non connecté' }
    const { data: target } = await supabase
      .from('profiles')
      .select('id, display_name')
      .eq('invite_code', inviteCode.trim().toLowerCase())
      .single()
    if (!target) return { error: 'Code introuvable' }
    if (target.id === userId) return { error: 'C\'est ton propre code !' }
    const { error } = await supabase
      .from('friendships')
      .insert({ requester_id: userId, addressee_id: target.id })
    if (error && error.code !== '23505') return { error: error.message }
    await load()
    return { name: target.display_name }
  }

  async function acceptFriend(friendshipId) {
    if (!supabase) return
    await supabase.from('friendships').update({ status: 'accepted' }).eq('id', friendshipId)
    await load()
  }

  async function declineFriend(friendshipId) {
    if (!supabase) return
    await supabase.from('friendships').delete().eq('id', friendshipId)
    await load()
  }

  async function removeFriend(friendId) {
    if (!supabase || !userId) return
    await supabase.from('friendships')
      .delete()
      .or(`and(requester_id.eq.${userId},addressee_id.eq.${friendId}),and(requester_id.eq.${friendId},addressee_id.eq.${userId})`)
    await load()
  }

  // Amis qui vont à un event donné (ceux qui ont activé visibilité vers moi)
  function friendsGoingTo(eventId) {
    return friends.filter(f => f.participations.includes(eventId))
  }

  return {
    myParticipations, friends, pending, visibility,
    toggleParticipation, toggleVisibility,
    addFriendByCode, acceptFriend, declineFriend, removeFriend,
    friendsGoingTo, reload: load,
  }
}
