import { useState } from 'react'

const NAVY = "#0F1D3A"
const GOLD = "#C4A241"
const GOLD_FRAME = "#C9A96E"
const BLUE = "#9FC3DC"

export default function AuthScreen({ onClose, auth, lang = "fr" }) {
  const [step, setStep]         = useState('email') // email | sent | name
  const [email, setEmail]       = useState('')
  const [name, setName]         = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  // Si connecté mais sans profil → étape nom
  if (auth.user && !auth.profile) {
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
            {error && <div style={err}>{error}</div>}
            <button
              onClick={async () => {
                if (!name.trim()) return setError(lang === 'en' ? 'Required' : 'Requis')
                setLoading(true)
                await auth.saveProfile(name.trim())
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

  if (step === 'sent') {
    return (
      <div style={overlay}>
        <div style={card}>
          <div style={inner}>
            <button onClick={onClose} style={closeBtn}>✕</button>
            <div style={{ fontSize: 36, marginBottom: 14 }}>📬</div>
            <div style={title}>{lang === 'en' ? "Check your inbox" : "Vérifie ta boîte mail"}</div>
            <div style={{ ...sub, marginBottom: 0 }}>
              {lang === 'en'
                ? `We sent a magic link to ${email}. Tap it to log in.`
                : `Un lien magique a été envoyé à ${email}. Clique dessus pour te connecter.`}
            </div>
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
          <div style={{ fontSize: 36, marginBottom: 14 }}>👥</div>
          <div style={title}>{lang === 'en' ? "Connect with friends" : "Rejoins tes amis"}</div>
          <div style={sub}>
            {lang === 'en'
              ? "See which friends are going to the same events."
              : "Vois quels amis vont aux mêmes sorties que toi."}
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
              const { error: e } = await auth.sendMagicLink(email.trim())
              setLoading(false)
              if (e) setError(e.message || 'Erreur')
              else setStep('sent')
            }}
            disabled={loading}
            style={btn}
          >{loading ? '…' : (lang === 'en' ? "Send magic link" : "Recevoir un lien magique")}</button>
          <div style={{ fontSize: 11, color: '#888', fontFamily: "'Lato', sans-serif", textAlign: 'center', marginTop: 12 }}>
            {lang === 'en' ? "No password needed." : "Pas de mot de passe."}
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
  position: 'absolute', top: 10, right: 12,
  background: 'none', border: 'none', cursor: 'pointer',
  fontSize: 16, color: '#888', lineHeight: 1, padding: 0,
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
