import { useState, useEffect } from "react";

const NAVY = "#0F1D3A";
const GOLD = "#C9A96E";
const IVORY = "#FDFAF5";
const PROJECT_ID = "182674";
const STORAGE_KEY = "monacout_admin_key";

async function hogql(key, sql) {
  const res = await fetch(`https://eu.posthog.com/api/projects/${PROJECT_ID}/query/`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query: { kind: "HogQLQuery", query: sql } }),
  });
  if (!res.ok) throw new Error(res.status);
  const d = await res.json();
  return d.results ?? [];
}

export default function AdminScreen({ onClose }) {
  const [key, setKey] = useState(() => localStorage.getItem(STORAGE_KEY) || "");
  const [input, setInput] = useState("");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { if (key) load(key); }, [key]);

  async function load(k) {
    setLoading(true); setError(null);
    try {
      const [d1, d7, d30, countries, devices] = await Promise.all([
        hogql(k, "SELECT uniq(distinct_id) FROM events WHERE event='$pageview' AND toDate(timestamp)=today()"),
        hogql(k, "SELECT uniq(distinct_id) FROM events WHERE event='$pageview' AND timestamp>=now()-interval 7 day"),
        hogql(k, "SELECT uniq(distinct_id) FROM events WHERE event='$pageview' AND timestamp>=now()-interval 30 day"),
        hogql(k, "SELECT coalesce(properties.$geoip_country_name,'Inconnu') as c, count() n FROM events WHERE event='$pageview' AND timestamp>=now()-interval 30 day GROUP BY c ORDER BY n DESC LIMIT 7"),
        hogql(k, "SELECT multiIf(properties.$os IN ('iOS','Android'),'Mobile','Desktop') d, count() n FROM events WHERE event='$pageview' AND timestamp>=now()-interval 30 day GROUP BY d ORDER BY n DESC"),
      ]);
      setStats({
        today: d1[0]?.[0] ?? 0,
        week:  d7[0]?.[0]  ?? 0,
        month: d30[0]?.[0] ?? 0,
        countries,
        devices,
      });
    } catch {
      setError("Clé invalide ou erreur réseau.");
    }
    setLoading(false);
  }

  function saveKey() {
    const k = input.trim();
    if (!k.startsWith("phx_")) return setError("La clé doit commencer par phx_");
    localStorage.setItem(STORAGE_KEY, k);
    setKey(k); setInput(""); setError(null);
  }

  function resetKey() {
    localStorage.removeItem(STORAGE_KEY);
    setKey(""); setStats(null); setError(null);
  }

  const maxCountry = stats?.countries?.[0]?.[1] || 1;
  const totalDevices = stats?.devices?.reduce((s, r) => s + r[1], 0) || 1;

  if (!key) {
    return (
      <div style={{ position: "absolute", inset: 0, background: IVORY, zIndex: 2000, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32 }}>
        <button onClick={onClose} style={{ position: "absolute", top: 60, right: 20, background: "none", border: "none", fontSize: 22, cursor: "pointer", color: NAVY, lineHeight: 1 }}>×</button>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: NAVY, letterSpacing: 3, marginBottom: 4 }}>ANALYTICS</div>
        <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, color: GOLD, letterSpacing: 4, marginBottom: 36 }}>MONAC'OUT</div>
        <div style={{ width: "100%", background: "white", borderRadius: 12, border: `1px solid ${GOLD}`, padding: 22 }}>
          <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, color: NAVY, letterSpacing: 1, marginBottom: 14 }}>Clé personnelle PostHog :</div>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && saveKey()}
            placeholder="phx_..."
            autoComplete="off"
            style={{ width: "100%", padding: "11px 13px", border: `1.5px solid ${GOLD}`, borderRadius: 8, fontSize: 13, fontFamily: "monospace", boxSizing: "border-box", outline: "none", color: NAVY }}
          />
          {error && <div style={{ fontSize: 11, color: "#C0392B", marginTop: 8 }}>{error}</div>}
          <button onClick={saveKey} style={{ marginTop: 14, width: "100%", background: NAVY, color: "white", border: "none", borderRadius: 8, padding: "13px 0", fontFamily: "'Josefin Sans', sans-serif", fontSize: 11, letterSpacing: 3, cursor: "pointer" }}>
            VALIDER
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "absolute", inset: 0, background: IVORY, zIndex: 2000, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ flexShrink: 0, background: NAVY, padding: "54px 20px 16px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", color: "white", fontSize: 20, letterSpacing: 3 }}>ANALYTICS</div>
          <div style={{ fontFamily: "'Josefin Sans', sans-serif", color: GOLD, fontSize: 9, letterSpacing: 3, marginTop: 3 }}>MONAC'OUT</div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "white", fontSize: 26, cursor: "pointer", lineHeight: 1, paddingBottom: 2 }}>×</button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 14px 24px" }}>
        {loading && (
          <div style={{ textAlign: "center", paddingTop: 60, fontFamily: "'Josefin Sans', sans-serif", color: GOLD, fontSize: 11, letterSpacing: 3 }}>
            CHARGEMENT…
          </div>
        )}

        {error && !loading && (
          <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 10, padding: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: "#7F1D1D", marginBottom: 10 }}>{error}</div>
            <button onClick={resetKey} style={{ background: "none", border: "none", color: NAVY, textDecoration: "underline", fontSize: 12, cursor: "pointer", padding: 0 }}>
              Changer la clé
            </button>
          </div>
        )}

        {stats && !loading && (
          <>
            {/* 3 stat boxes */}
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              {[
                { label: "Aujourd'hui", value: stats.today },
                { label: "7 jours",     value: stats.week  },
                { label: "30 jours",    value: stats.month },
              ].map(({ label, value }) => (
                <div key={label} style={{ flex: 1, background: "white", borderRadius: 10, border: `1px solid ${GOLD}`, padding: "14px 6px", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: NAVY, lineHeight: 1 }}>{value}</div>
                  <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 8, color: GOLD, letterSpacing: 2, marginTop: 5 }}>VISITEURS</div>
                  <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 9, color: "#999", marginTop: 3 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Pays */}
            <div style={{ background: "white", borderRadius: 10, border: "1px solid rgba(15,29,58,0.1)", padding: "14px 14px", marginBottom: 14 }}>
              <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 9, color: NAVY, letterSpacing: 2, marginBottom: 14, fontWeight: 600 }}>LOCALISATION · 30 JOURS</div>
              {stats.countries.filter(r => r[0] !== "Inconnu").slice(0, 6).map(([country, n]) => (
                <div key={country} style={{ marginBottom: 9 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Josefin Sans', sans-serif", fontSize: 11, color: NAVY, marginBottom: 4 }}>
                    <span>{country}</span>
                    <span style={{ color: GOLD, fontWeight: 600 }}>{n}</span>
                  </div>
                  <div style={{ height: 3, background: "#F0EDE8", borderRadius: 2 }}>
                    <div style={{ height: 3, background: GOLD, borderRadius: 2, width: `${Math.round((n / maxCountry) * 100)}%`, transition: "width 0.6s ease" }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Appareils */}
            <div style={{ background: "white", borderRadius: 10, border: "1px solid rgba(15,29,58,0.1)", padding: "14px 14px", marginBottom: 16 }}>
              <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 9, color: NAVY, letterSpacing: 2, marginBottom: 14, fontWeight: 600 }}>APPAREILS · 30 JOURS</div>
              {stats.devices.map(([device, n]) => {
                const pct = Math.round((n / totalDevices) * 100);
                return (
                  <div key={device} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 11, color: NAVY, width: 70 }}>
                      {device === "Mobile" ? "📱 Mobile" : "🖥 Desktop"}
                    </div>
                    <div style={{ flex: 1, height: 3, background: "#F0EDE8", borderRadius: 2 }}>
                      <div style={{ height: 3, background: NAVY, borderRadius: 2, width: `${pct}%`, transition: "width 0.6s ease" }} />
                    </div>
                    <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 11, color: "#999", width: 32, textAlign: "right" }}>{pct}%</div>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => load(key)} style={{ flex: 1, background: NAVY, color: "white", border: "none", borderRadius: 8, padding: "13px 0", fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, letterSpacing: 3, cursor: "pointer" }}>
                ACTUALISER
              </button>
              <button onClick={resetKey} style={{ background: "none", border: "1px solid rgba(15,29,58,0.2)", color: "#999", borderRadius: 8, padding: "13px 16px", fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, cursor: "pointer" }}>
                Clé
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
