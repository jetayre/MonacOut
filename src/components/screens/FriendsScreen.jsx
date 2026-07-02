import { useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { Share } from '@capacitor/share'
import AuthScreen from './AuthScreen'

const NAVY = "#0F1D3A"
const GOLD = "#C4A241"
const GOLD_FRAME = "#C9A96E"
const BLUE = "#9FC3DC"
const GREY = "#6A7080"

const MOIS_IDX = { jan:0,'fév':1,mar:2,avr:3,mai:4,juin:5,juil:6,'août':7,sep:8,oct:9,nov:10,'déc':11 }
const JOURS_FR = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam']
const JOURS_EN = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const MOIS_FR  = ['jan','fév','mar','avr','mai','juin','juil','août','sep','oct','nov','déc']

function avatarColor(id = '') {
  const colors = ['#0F1D3A','#882830','#1A4A5A','#3A1870','#1A4A2A','#4A2010','#1A2A4A']
  let h = 0; for (const c of id) h = (h * 31 + c.charCodeAt(0)) & 0xFFFFFF
  return colors[Math.abs(h) % colors.length]
}

function Avatar({ name = '?', id = '', size = 28 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: avatarColor(id), color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Josefin Sans', sans-serif", fontSize: size * 0.38,
      fontWeight: 600, flexShrink: 0,
      border: '1.5px solid #fff',
    }}>
      {(name[0] || '?').toUpperCase()}
    </div>
  )
}

function eventDate(e) {
  if (!e?.date) return null
  const p = e.date.trim().split(' ')
  const mi = MOIS_IDX[p[2]]
  if (mi === undefined) return null
  return new Date(e.year || 2026, mi, parseInt(p[1]))
}

export default function FriendsScreen({ auth, social, events = [], lang = "fr", onNavEvents }) {
  const [tab, setTab]           = useState('sorties') // sorties | amis
  const [code, setCode]         = useState('')
  const [codeMsg, setCodeMsg]   = useState('')
  const [showAuth, setShowAuth] = useState(false)

  if (!auth.user) {
    return (
      <div style={{ padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>👥</div>
        <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 20, color: NAVY, marginBottom: 10 }}>
          {lang === 'en' ? "See friends' plans" : "Les sorties de tes amis"}
        </div>
        <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 13, color: GREY, lineHeight: 1.6, marginBottom: 28 }}>
          {lang === 'en'
            ? "Connect to see which friends are going to the same events — and let them see yours."
            : "Connecte-toi pour voir quels amis vont aux mêmes sorties — et partage les tiennes."}
        </div>
        <button onClick={() => setShowAuth(true)} style={{
          padding: '13px 32px', background: NAVY, color: '#fff', border: 'none',
          borderRadius: 2, cursor: 'pointer',
          fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, fontWeight: 600,
          letterSpacing: 2, textTransform: 'uppercase',
        }}>{lang === 'en' ? "Connect" : "Se connecter"}</button>
        {showAuth && <AuthScreen auth={auth} lang={lang} onClose={() => setShowAuth(false)} />}
      </div>
    )
  }

  const inviteCode  = auth.profile?.invite_code || '…'
  const inviteLink  = `https://monacout.vercel.app?invite=${inviteCode}`

  async function shareInvite() {
    if (Capacitor.isNativePlatform()) {
      await Share.share({
        title: lang === 'en' ? "Join me on Monac'Out" : "Rejoins-moi sur Monac'Out",
        text: lang === 'en'
          ? `Use my code ${inviteCode} to add me as a friend on Monac'Out!`
          : `Utilise mon code ${inviteCode} pour m'ajouter en ami sur Monac'Out !`,
        url: inviteLink,
      }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(inviteLink)
      setCodeMsg(lang === 'en' ? 'Link copied!' : 'Lien copié !')
      setTimeout(() => setCodeMsg(''), 2000)
    }
  }

  // Sorties des amis — triées par date
  const today = new Date(); today.setHours(0,0,0,0)
  const friendsEvents = []
  for (const friend of social.friends) {
    for (const eid of friend.participations) {
      const ev = events.find(e => e.id === eid)
      if (!ev) continue
      const d = eventDate(ev)
      if (!d || d < today) continue
      friendsEvents.push({ event: ev, friend, date: d })
    }
  }
  friendsEvents.sort((a, b) => a.date - b.date)

  const jours = lang === 'en' ? JOURS_EN : JOURS_FR

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Header */}
      <div style={{
        padding: '20px 24px 0',
        fontFamily: "'Josefin Sans', sans-serif",
        fontSize: 13, fontWeight: 600, letterSpacing: 3,
        textTransform: 'uppercase', color: GOLD, marginBottom: 16,
      }}>
        {lang === 'en' ? "My Circle" : "Mon Cercle"}
        {social.pending.length > 0 && (
          <span style={{
            marginLeft: 8, background: '#c00', color: '#fff',
            borderRadius: '50%', width: 18, height: 18,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 700,
          }}>{social.pending.length}</span>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', padding: '0 24px', gap: 0, marginBottom: 20, borderBottom: `1px solid rgba(196,162,65,0.25)` }}>
        {[
          { id: 'sorties', fr: 'Sorties', en: 'Events' },
          { id: 'amis',    fr: 'Amis',    en: 'Friends' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '8px 16px 10px', marginRight: 4,
            fontFamily: "'Josefin Sans', sans-serif",
            fontSize: 12, fontWeight: 600, letterSpacing: 1.5,
            textTransform: 'uppercase',
            color: tab === t.id ? NAVY : GREY,
            borderBottom: `2px solid ${tab === t.id ? GOLD : 'transparent'}`,
            transition: 'all 0.15s',
          }}>{lang === 'en' ? t.en : t.fr}</button>
        ))}
      </div>

      {/* ── TAB SORTIES ─────────────────────────────────────────── */}
      {tab === 'sorties' && (
        <div style={{ padding: '0 24px' }}>
          {friendsEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: GREY, fontFamily: "'Lato', sans-serif", fontSize: 13 }}>
              {social.friends.length === 0
                ? (lang === 'en' ? "Add friends to see their plans." : "Ajoute des amis pour voir leurs sorties.")
                : (lang === 'en' ? "None of your friends have marked events yet." : "Aucun ami n'a encore marqué de sortie.")}
            </div>
          ) : friendsEvents.map(({ event: ev, friend, date }, i) => (
            <div key={`${ev.id}-${friend.id}-${i}`} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 0',
              borderBottom: i < friendsEvents.length - 1 ? `1px solid rgba(15,29,58,0.07)` : 'none',
            }}>
              <Avatar name={friend.display_name} id={friend.id} size={34} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, color: NAVY, fontWeight: 600, marginBottom: 2 }}>
                  {friend.display_name}
                </div>
                <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 13, color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {ev.title.replace(/\n/g, ' ')}
                </div>
                <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 11, color: GREY, marginTop: 1 }}>
                  {jours[date.getDay()]} {date.getDate()} {MOIS_FR[date.getMonth()]} · {ev.subtitle?.split(' · ')[0]}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── TAB AMIS ────────────────────────────────────────────── */}
      {tab === 'amis' && (
        <div style={{ padding: '0 24px' }}>

          {/* Mon code invite */}
          <div style={{
            border: `1px solid ${GOLD_FRAME}`, borderRadius: 2,
            padding: '16px 18px', marginBottom: 20,
          }}>
            <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: GOLD, marginBottom: 8 }}>
              {lang === 'en' ? "My invite code" : "Mon code d'invitation"}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{
                fontFamily: "'Josefin Sans', sans-serif", fontSize: 18, fontWeight: 600,
                color: NAVY, letterSpacing: 4, flex: 1,
              }}>{inviteCode.toUpperCase()}</div>
              <button onClick={shareInvite} style={{
                padding: '8px 14px', background: NAVY, color: '#fff', border: 'none',
                borderRadius: 2, cursor: 'pointer', fontFamily: "'Josefin Sans', sans-serif",
                fontSize: 10, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', flexShrink: 0,
              }}>
                {Capacitor.isNativePlatform() ? (lang === 'en' ? "Share" : "Partager") : (lang === 'en' ? "Copy link" : "Copier")}
              </button>
            </div>
            {codeMsg && <div style={{ fontSize: 11, color: GOLD, fontFamily: "'Lato', sans-serif" }}>{codeMsg}</div>}
          </div>

          {/* Ajouter un ami */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: GREY, marginBottom: 8 }}>
              {lang === 'en' ? "Add a friend" : "Ajouter un ami"}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={code}
                onChange={e => { setCode(e.target.value); setCodeMsg('') }}
                placeholder={lang === 'en' ? "Friend's code" : "Code de ton ami"}
                style={{
                  flex: 1, padding: '9px 12px',
                  border: `1px solid ${GOLD_FRAME}`, borderRadius: 2,
                  fontFamily: "'Josefin Sans', sans-serif", fontSize: 13,
                  color: NAVY, outline: 'none', letterSpacing: 2, textTransform: 'uppercase',
                  background: '#fafafa',
                }}
              />
              <button onClick={async () => {
                if (!code.trim()) return
                const r = await social.addFriendByCode(code)
                if (r.error) setCodeMsg('❌ ' + r.error)
                else { setCodeMsg(lang === 'en' ? `✓ Request sent to ${r.name}` : `✓ Demande envoyée à ${r.name}`); setCode('') }
              }} style={{
                padding: '9px 16px', background: GOLD, color: '#fff', border: 'none',
                borderRadius: 2, cursor: 'pointer', fontFamily: "'Josefin Sans', sans-serif",
                fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', flexShrink: 0,
              }}>{lang === 'en' ? "Add" : "Ajouter"}</button>
            </div>
            {codeMsg && <div style={{ fontSize: 12, color: codeMsg.startsWith('❌') ? '#c00' : '#2a6', fontFamily: "'Lato', sans-serif", marginTop: 6 }}>{codeMsg}</div>}
          </div>

          {/* Demandes en attente */}
          {social.pending.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: '#c00', marginBottom: 10 }}>
                {lang === 'en' ? "Pending requests" : "Demandes reçues"}
              </div>
              {social.pending.map(p => (
                <div key={p.friendshipId} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <Avatar name={p.display_name} id={p.id} size={32} />
                  <div style={{ flex: 1, fontFamily: "'Josefin Sans', sans-serif", fontSize: 13, color: NAVY }}>{p.display_name}</div>
                  <button onClick={() => social.acceptFriend(p.friendshipId)} style={{
                    padding: '6px 10px', background: NAVY, color: '#fff', border: 'none', borderRadius: 2, cursor: 'pointer',
                    fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase',
                  }}>{lang === 'en' ? "Accept" : "Accepter"}</button>
                  <button onClick={() => social.declineFriend(p.friendshipId)} style={{
                    padding: '6px 10px', background: 'none', color: GREY, border: `1px solid ${GREY}`, borderRadius: 2, cursor: 'pointer',
                    fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase',
                  }}>{lang === 'en' ? "Decline" : "Refuser"}</button>
                </div>
              ))}
              <div style={{ height: 1, background: 'rgba(15,29,58,0.08)', margin: '14px 0' }} />
            </div>
          )}

          {/* Liste des amis avec toggle visibilité */}
          {social.friends.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0', color: GREY, fontFamily: "'Lato', sans-serif", fontSize: 13 }}>
              {lang === 'en' ? "No friends yet. Share your code!" : "Pas encore d'amis. Partage ton code !"}
            </div>
          ) : (
            <>
              <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: GREY, marginBottom: 10 }}>
                {lang === 'en' ? "Who can see me" : "Qui peut me voir"}
              </div>
              {social.friends.map(f => (
                <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <Avatar name={f.display_name} id={f.id} size={32} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 13, color: NAVY, fontWeight: 600 }}>{f.display_name}</div>
                  </div>
                  {/* Toggle visibilité */}
                  <button onClick={() => social.toggleVisibility(f.id)} style={{
                    padding: '5px 10px', borderRadius: 20,
                    border: `1.5px solid ${social.visibility.includes(f.id) ? GOLD : 'rgba(15,29,58,0.2)'}`,
                    background: social.visibility.includes(f.id) ? GOLD : 'transparent',
                    color: social.visibility.includes(f.id) ? '#fff' : GREY,
                    fontFamily: "'Josefin Sans', sans-serif", fontSize: 9, fontWeight: 600,
                    letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer',
                  }}>
                    {social.visibility.includes(f.id)
                      ? (lang === 'en' ? "✓ Visible" : "✓ Me voit")
                      : (lang === 'en' ? "Hidden" : "Masqué")}
                  </button>
                </div>
              ))}
            </>
          )}

          {/* Déconnexion */}
          <div style={{ height: 1, background: 'rgba(15,29,58,0.08)', margin: '24px 0 16px' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 12, color: GREY }}>
              {auth.user?.email}
            </div>
            <button onClick={auth.signOut} style={{
              background: 'none', border: `1px solid rgba(15,29,58,0.2)`, borderRadius: 2,
              padding: '6px 12px', cursor: 'pointer', color: GREY,
              fontFamily: "'Josefin Sans', sans-serif", fontSize: 9, fontWeight: 600,
              letterSpacing: 1, textTransform: 'uppercase',
            }}>{lang === 'en' ? "Sign out" : "Déconnexion"}</button>
          </div>
        </div>
      )}
    </div>
  )
}
