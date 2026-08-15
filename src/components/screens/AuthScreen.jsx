import { useState, useEffect } from 'react'
import { fichierVersAvatar, avatarMonogramme, MONOGRAMMES } from '../../lib/avatar'

const NAVY = "#0F1D3A"
const GOLD = "#C4A241"
const GOLD_FRAME = "#C9A96E"
const BLUE = "#9FC3DC"

const PENDING_KEY = 'monacout_pending_login_email'

export default function AuthScreen({ onClose, auth, lang = "fr", inviterName = null }) {
  // Si un code est déjà en attente (on a quitté l'app pour lire le mail) → on rouvre PILE sur l'écran code.
  const pending = (typeof localStorage !== 'undefined' && !auth.user) ? localStorage.getItem(PENDING_KEY) : null
  const [step, setStep]         = useState(pending ? 'code' : 'email') // email | code | name
  const [email, setEmail]       = useState(pending || '')
  const [code, setCode]         = useState('')
  const [name, setName]         = useState('')
  const [topics, setTopics]     = useState([])
  const [photo, setPhoto]       = useState('')      // photo choisie, en data URL
  const [mono, setMono]         = useState(null)    // index de l'avatar monogramme, ou null
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const clearPending = () => { try { localStorage.removeItem(PENDING_KEY) } catch { /* rien */ } }
  // Fermer = on abandonne la connexion en cours → on oublie le code en attente.
  const handleClose = () => { clearPending(); onClose?.() }

  // Referme automatiquement dès que la personne est connectée avec un prénom.
  useEffect(() => { if (auth.user && auth.profile?.display_name) { clearPending(); onClose() } }, [auth.user, auth.profile])

  const TOPICS = [
    { id: 'culture',   fr: 'Musée / Ciné / Atelier', en: 'Museum / Cinema / Workshop' },
    { id: 'foodnight', fr: 'Food / Nightlife',   en: 'Food / Nightlife' },
    { id: 'musique',   fr: 'Musique',            en: 'Music' },
    { id: 'sport',     fr: 'Sport',              en: 'Sport' },
  ]

  // La photo l'emporte si elle existe ; sinon le monogramme, RECALCULÉ à chaque frappe
  // pour qu'il porte toujours la bonne initiale (on stocke l'index, pas l'image figée —
  // sinon quelqu'un qui choisit son avatar avant de taper son prénom garderait un point).
  const avatar = photo || (mono !== null ? avatarMonogramme(name, mono) : '')

  // ── Étape prénom (nouveau compte) ──
  if (auth.user && !auth.profile?.display_name) {
    return (
      <div style={overlay}>
        <div style={card}>
          <div style={inner}>
            <button onClick={handleClose} style={closeBtn}>✕</button>
            <div style={title}>{lang === 'en' ? "Welcome!" : "Bienvenue !"}</div>
            <div style={sub}>{lang === 'en' ? "How should we call you?" : "Comment tu t'appelles ?"}</div>

            {/* Photo — carré à coins arrondis, 44 px, entièrement optionnelle.
                Sélecteur de photos standard : aucun plugin natif, donc aucune
                nouvelle validation Apple nécessaire. */}
            <label htmlFor="mo-avatar" style={{ display: 'block', width: 64, margin: '0 auto 6px', cursor: 'pointer' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%', overflow: 'hidden',
                border: `1px solid ${avatar ? GOLD_FRAME : 'rgba(15,29,58,0.25)'}`,
                // Guillemets autour de l'URL : la photo est un JPEG sans caractère
                // gênant, mais un avatar monogramme est un SVG — mieux vaut ne pas
                // dépendre de son encodage exact.
                background: avatar ? `center/cover no-repeat url("${avatar}")` : '#FFFDF7',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#9AA0AE', fontSize: 22, fontFamily: "'Lato', sans-serif",
              }}>{avatar ? '' : '＋'}</div>
            </label>
            <input
              id="mo-avatar" type="file" accept="image/*" style={{ display: 'none' }}
              onChange={async e => {
                const f = e.target.files?.[0]; e.target.value = ''
                if (!f) return
                try { setPhoto(await fichierVersAvatar(f)); setMono(null); setError('') }
                catch { setError(lang === 'en' ? "Couldn't read that photo" : "Photo illisible") }
              }}
            />
            <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 11, color: '#9AA0AE', marginBottom: 10 }}>
              {photo
                ? (lang === 'en' ? "Tap to change" : "Touche pour changer")
                : (lang === 'en' ? "Photo (optional)" : "Photo (optionnel)")}
            </div>

            {/* ── Ou un avatar, sans photo ──────────────────────────────────────
                8 personnes sur 44 seulement avaient mis une photo. Un monogramme
                ne demande qu'un geste et donne quand même un visage à la liste
                d'amies. Il porte l'initiale du prénom, qui se met à jour à mesure
                qu'on tape. Rien n'est imposé : on peut continuer sans rien choisir. */}
            <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 11, color: '#9AA0AE', marginBottom: 7 }}>
              {lang === 'en' ? "or pick an avatar" : "ou choisis un avatar"}
            </div>
            <div style={{ display: 'flex', gap: 7, justifyContent: 'center', marginBottom: 14 }}>
              {MONOGRAMMES.map((_, i) => {
                const actif = mono === i && !photo
                return (
                  <button
                    key={i} type="button"
                    aria-label={(lang === 'en' ? 'Avatar ' : 'Avatar ') + (i + 1)}
                    aria-pressed={actif}
                    onClick={() => { setMono(mono === i && !photo ? null : i); setPhoto(''); setError('') }}
                    style={{
                      width: 34, height: 34, padding: 0, borderRadius: '50%', cursor: 'pointer',
                      // Le cercle choisi est cerclé d'or ET légèrement agrandi : sur un
                      // écran au soleil, la couleur seule ne suffit pas à voir sa sélection.
                      border: `2px solid ${actif ? GOLD : 'rgba(15,29,58,0.18)'}`,
                      transform: actif ? 'scale(1.12)' : 'none',
                      transition: 'transform .12s ease, border-color .12s ease',
                      background: `center/cover no-repeat url("${avatarMonogramme(name, i)}")`,
                    }}
                  />
                )
              })}
            </div>

            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={lang === 'en' ? "Your first name" : "Ton prénom"}
              style={input}
              autoFocus
            />
            <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 12, color: '#888', marginBottom: 8 }}>
              {lang === 'en' ? "What interests you? (optional)" : "Ce qui t'intéresse ? (optionnel)"}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 16 }}>
              {TOPICS.map(t => {
                const on = topics.includes(t.id)
                return (
                  <button key={t.id} type="button" onClick={() => setTopics(p => on ? p.filter(x => x !== t.id) : [...p, t.id])} style={{
                    padding: '6px 12px', borderRadius: 16, cursor: 'pointer',
                    border: `1.5px solid ${on ? GOLD : 'rgba(15,29,58,0.2)'}`,
                    background: on ? GOLD : '#fff', color: on ? '#fff' : NAVY,
                    fontFamily: "'Josefin Sans', sans-serif", fontSize: 11, fontWeight: 600,
                  }}>{lang === 'en' ? t.en : t.fr}</button>
                )
              })}
            </div>
            {error && <div style={err}>{error}</div>}
            <button
              onClick={async () => {
                if (!name.trim()) return setError(lang === 'en' ? 'Required' : 'Requis')
                setLoading(true)
                await auth.saveProfile(name.trim(), topics, avatar)
                setLoading(false)
                onClose()
              }}
              disabled={loading}
              style={btn}
            >{loading ? '…' : (lang === 'en' ? "Continue" : "Continuer")}</button>
          </div>
        </div>
      </div>
    )
  }

  // ── Étape code (champ visible directement + garde l'écran au retour du mail) ──
  if (step === 'code') {
    return (
      <div style={overlay}>
        <div style={card}>
          <div style={inner}>
            <button onClick={handleClose} style={closeBtn}>✕</button>
            <div style={{ fontSize: 36, marginBottom: 10 }}>📩</div>
            <div style={title}>{lang === 'en' ? "Enter your code" : "Entre ton code"}</div>
            <div style={sub}>
              {lang === 'en'
                ? <>Open your email <b style={{ color: NAVY }}>{email}</b>, come back here and type the code.</>
                : <>Va lire ton email <b style={{ color: NAVY }}>{email}</b>, reviens ici et tape le code.</>}
            </div>
            {/* 36 % des personnes qui demandent un code n'arrivent jamais au bout (58
                comptes créés, 37 profils, relevé du 5 août 2026). La première cause
                probable est le mail classé en indésirable : on donne donc l'expéditeur
                exact, pour qu'il soit cherchable, AVANT que la personne renonce. */}
            <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 11.5, color: '#8A8A8A', lineHeight: 1.5, marginTop: -6, marginBottom: 12 }}>
              {lang === 'en'
                ? <>Not in your inbox? Look in <b style={{ color: '#666' }}>spam</b> — it comes from <b style={{ color: '#666' }}>bonjour@monacout.com</b></>
                : <>Rien dans ta boîte ? Regarde dans les <b style={{ color: '#666' }}>indésirables</b> — l'email vient de <b style={{ color: '#666' }}>bonjour@monacout.com</b></>}
            </div>
            <input
              value={code}
              onChange={e => { setCode(e.target.value.replace(/\D/g, '').slice(0, 10)); setError('') }}
              placeholder="– – – – – –"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={10}
              style={{ ...input, textAlign: 'center', letterSpacing: 8, fontSize: 26, fontWeight: 700, marginBottom: 6 }}
              autoFocus
            />
            <button
              type="button"
              onClick={async () => {
                try {
                  const t = await navigator.clipboard.readText()
                  const digits = (t || '').replace(/\D/g, '').slice(0, 10)
                  if (digits) { setCode(digits); setError('') }
                } catch { /* presse-papier indisponible */ }
              }}
              style={{ width: '100%', padding: 8, marginBottom: 6, background: 'none', color: GOLD, border: 'none', cursor: 'pointer', fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 1 }}
            >{lang === 'en' ? "📋 Paste the code" : "📋 Coller le code"}</button>
            {error && <div style={err}>{error}</div>}
            <button
              onClick={async () => {
                if (code.length < 4) return setError(lang === 'en' ? 'Enter your code' : 'Saisis ton code')
                setLoading(true)
                const { error: e } = await auth.verifyCode(email.trim(), code)
                setLoading(false)
                if (e) setError(lang === 'en' ? 'Wrong or expired code' : 'Code incorrect ou expiré')
                else clearPending()
                // succès → auth.user se met à jour, l'écran passe au prénom ou se referme
              }}
              disabled={loading}
              style={btn}
            >{loading ? '…' : (lang === 'en' ? "Confirm" : "Confirmer")}</button>
            <button
              onClick={async () => { setLoading(true); await auth.sendCode(email.trim()); setLoading(false); setError(lang === 'en' ? 'New code sent ✓' : 'Nouveau code envoyé ✓') }}
              style={{ width: '100%', padding: 8, background: 'none', color: '#888', border: 'none', cursor: 'pointer', fontFamily: "'Lato', sans-serif", fontSize: 12, marginTop: 2 }}
            >{lang === 'en' ? "Resend the code" : "Renvoyer le code"}</button>
            <button
              onClick={() => { clearPending(); setStep('email'); setCode(''); setError('') }}
              style={{ width: '100%', padding: 6, background: 'none', color: '#aaa', border: 'none', cursor: 'pointer', fontFamily: "'Lato', sans-serif", fontSize: 11 }}
            >{lang === 'en' ? "‹ Change email" : "‹ Changer d'email"}</button>
          </div>
        </div>
      </div>
    )
  }

  // ── Étape email (départ) ──
  return (
    <div style={overlay}>
      <div style={card}>
        <div style={inner}>
          <button onClick={handleClose} style={closeBtn}>✕</button>
          <div style={{ fontSize: 36, marginBottom: 14 }}>{inviterName ? '💌' : '👥'}</div>
          <div style={title}>
            {inviterName
              ? (lang === 'en' ? `Join ${inviterName} on Monac'Out` : `Rejoins ${inviterName} sur Monac'Out`)
              : (lang === 'en' ? "Connect with friends" : "Rejoins tes amis")}
          </div>
          <div style={sub}>
            {inviterName
              ? (lang === 'en'
                  ? `${inviterName} invited you. Create your account to become friends and see each other's outings.`
                  : `${inviterName} t'invite. Crée ton compte pour devenir amis et voir vos sorties respectives.`)
              : (lang === 'en'
                  ? "See which friends are going to the same events."
                  : "Vois quels amis vont aux mêmes sorties que toi.")}
          </div>
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setError('') }}
            placeholder="ton@email.com"
            style={input}
            autoFocus
          />
          {error && <div style={err}>{error}</div>}
          <button
            onClick={async () => {
              if (!email.trim()) return setError(lang === 'en' ? 'Required' : 'Requis')
              setLoading(true)
              const { error: e } = await auth.sendCode(email.trim())
              setLoading(false)
              if (e) setError(e.message || 'Erreur')
              else { try { localStorage.setItem(PENDING_KEY, email.trim()) } catch { /* rien */ } setStep('code') }
            }}
            disabled={loading}
            style={btn}
          >{loading ? '…' : (lang === 'en' ? "Get my code" : "Recevoir mon code")}</button>
          <div style={{ fontSize: 11, color: '#888', fontFamily: "'Lato', sans-serif", textAlign: 'center', marginTop: 12 }}>
            {lang === 'en' ? "A 6-digit code will be sent to your email." : "Un code à 6 chiffres sera envoyé par email."}
          </div>
        </div>
      </div>
    </div>
  )
}

const overlay = {
  position: 'absolute', inset: 0,
  background: 'rgba(0,0,0,0.55)',
  zIndex: 700,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}
const card = {
  width: 300,
  border: `1.5px solid ${GOLD_FRAME}`,
  borderRadius: 2, padding: 4,
  background: '#fff',
}
const inner = {
  position: 'relative',
  border: `1.5px solid ${BLUE}`,
  borderRadius: 1,
  padding: '28px 24px 24px',
  textAlign: 'center',
}
const closeBtn = {
  position: 'absolute', top: 8, right: 8,
  width: 30, height: 30, borderRadius: '50%',
  background: '#fff', border: `1px solid ${GOLD_FRAME}`, cursor: 'pointer',
  fontSize: 17, color: NAVY, lineHeight: 1, padding: 0,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}
const title = {
  fontFamily: "'Josefin Sans', sans-serif",
  fontSize: 18, fontWeight: 600, color: NAVY,
  marginBottom: 8,
}
const sub = {
  fontFamily: "'Lato', sans-serif",
  fontSize: 13, color: '#555', lineHeight: 1.5,
  marginBottom: 20,
}
const input = {
  width: '100%', boxSizing: 'border-box',
  padding: '10px 14px', marginBottom: 12,
  border: `1px solid ${GOLD_FRAME}`,
  borderRadius: 2, outline: 'none',
  fontFamily: "'Lato', sans-serif", fontSize: 14, color: NAVY,
  background: '#fafafa',
}
const btn = {
  width: '100%', padding: '12px 0',
  background: NAVY, color: '#fff', border: 'none',
  borderRadius: 2, cursor: 'pointer',
  fontFamily: "'Josefin Sans', sans-serif",
  fontSize: 12, fontWeight: 600, letterSpacing: 2,
  textTransform: 'uppercase',
}
const err = {
  fontFamily: "'Lato', sans-serif",
  fontSize: 12, color: '#c00', marginBottom: 8,
}
