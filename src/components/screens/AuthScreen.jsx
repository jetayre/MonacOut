import { useState, useEffect } from 'react'

const NAVY = "#0F1D3A"
const GOLD = "#C4A241"
const GOLD_FRAME = "#C9A96E"
const BLUE = "#9FC3DC"

export default function AuthScreen({ onClose, auth, lang = "fr", inviterName = null }) {
  const [step, setStep]         = useState('email') // email | code | name
  const [email, setEmail]       = useState('')
  const [code, setCode]         = useState('')
  const [name, setName]         = useState('')
  const [topics, setTopics]     = useState([])
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  // Referme automatiquement dès que la personne est connectée avec un prénom.
  useEffect(() => { if (auth.user && auth.profile?.display_name) onClose() }, [auth.user, auth.profile])

  const TOPICS = [
    { id: 'culture',   fr: 'Culture / Ateliers', en: 'Culture / Workshops' },
    { id: 'foodnight', fr: 'Food / Nightlife',   en: 'Food / Nightlife' },
    { id: 'musique',   fr: 'Musique',            en: 'Music' },
    { id: 'sport',     fr: 'Sport',              en: 'Sport' },
  ]

  // Si connecté mais sans profil → étape nom + sujets préférés (optionnel)
  if (auth.user && !auth.profile?.display_name) {
    return (
      <div style={overlay}>
        <div style={card}>
          <div style={inner}>
            <button onClick={onClose} style={closeBtn}>✕</button>
            <div style={title}>{lang === 'en' ? "Welcome!" : "Bienvenue !"}</div>
            <div style={sub}>{lang === 'en' ? "How should we call you?" : "Comment tu t'appelles ?"}</div>
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
                await auth.saveProfile(name.trim(), topics)
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

  if (step === 'code') {
    return (
      <div style={overlay}>
        <div style={card}>
          <div style={inner}>
            <button onClick={onClose} style={closeBtn}>✕</button>
            <div style={{ fontSize: 36, marginBottom: 14 }}>🔑</div>
            <div style={title}>{lang === 'en' ? "Enter your code" : "Entre ton code"}</div>
            <div style={sub}>
              {lang === 'en'
                ? `We emailed a code to ${email}. Type it below.`
                : `Un code a été envoyé à ${email}. Saisis-le ci-dessous.`}
            </div>
            <input
              value={code}
              onChange={e => { setCode(e.target.value.replace(/\D/g, '').slice(0, 10)); setError('') }}
              placeholder="Ton code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={10}
              style={{ ...input, textAlign: 'center', letterSpacing: 6, fontSize: 22, fontWeight: 600 }}
              autoFocus
            />
            {error && <div style={err}>{error}</div>}
            <button
              onClick={async () => {
                if (code.length < 4) return setError(lang === 'en' ? 'Enter your code' : 'Saisis ton code')
                setLoading(true)
                const { error: e } = await auth.verifyCode(email.trim(), code)
                setLoading(false)
                if (e) setError(lang === 'en' ? 'Wrong or expired code' : 'Code incorrect ou expiré')
                // succès → auth.user se met à jour, l'écran passe à l'étape prénom ou se referme
              }}
              disabled={loading}
              style={btn}
            >{loading ? '…' : (lang === 'en' ? "Confirm" : "Confirmer")}</button>
            <button
              onClick={() => { setStep('email'); setCode(''); setError('') }}
              style={{ width: '100%', padding: 8, background: 'none', color: '#888', border: 'none', cursor: 'pointer', fontFamily: "'Lato', sans-serif", fontSize: 12, marginTop: 4 }}
            >{lang === 'en' ? "‹ Change email" : "‹ Changer d'email"}</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={overlay}>
      <div style={card}>
        <div style={inner}>
          <button onClick={onClose} style={closeBtn}>✕</button>
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
              else setStep('code')
            }}
            disabled={loading}
            style={btn}
          >{loading ? '…' : (lang === 'en' ? "Get my code" : "Recevoir mon code")}</button>
          <div style={{ fontSize: 11, color: '#888', fontFamily: "'Lato', sans-serif", textAlign: 'center', marginTop: 12 }}>
            {lang === 'en' ? "A code will be sent to your email." : "Un code sera envoyé par email."}
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
