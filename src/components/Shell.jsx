const NAVY = "#1A2A5A";
const GOLD = "#B8966E";

const CAT_FILTERS = [
  { id: "ateliers", label: "🎨 Ateliers",  labelEn: "🎨 Workshops" },
  { id: "bienetre", label: "🧘 Bien-être", labelEn: "🧘 Wellness" },
  { id: "cinema",   label: "🎬 Cinéma",    labelEn: "🎬 Cinema" },
  { id: "culture",  label: "🎭 Culture",   labelEn: "🎭 Culture" },
  { id: "encheres", label: "🔨 Enchères",  labelEn: "🔨 Auctions" },
  { id: "famille",  label: "👨‍👩‍👧 Famille", labelEn: "👨‍👩‍👧 Family" },
  { id: "foody",    label: "🍽️ Foody",    labelEn: "🍽️ Foody" },
  { id: "music",    label: "🎵 Musique",   labelEn: "🎵 Music" },
  { id: "sport",    label: "⚽ Sport",     labelEn: "⚽ Sport" },
];

function CalIcon({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}

function HeartIcon({ color, active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={active ? color : "none"} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

const NAV_IDS = [
  { id: "events", key: "events", Icon: CalIcon },
  { id: "agenda", key: "agenda", Icon: HeartIcon },
];

export default function Shell({ tab, setTab, children, t, lang = "fr", showCats, catFilter, onCatFilter }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#E8E8F0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px 0",
    }}>
      <div style={{
        width: 393,
        height: 852,
        background: "#FFFFFF",
        borderRadius: 54,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 24px 80px rgba(26,42,90,0.25)",
      }}>
        {/* Header: dynamic island (46px) + tab bar (44px) */}
        <div style={{
          flexShrink: 0,
          height: 90,
          background: "#FFFFFF",
          borderBottom: "1px solid #E0E4F0",
          position: "relative",
          zIndex: 10,
        }}>
          {/* Dynamic island */}
          <div style={{
            position: "absolute",
            top: 12,
            left: "50%",
            transform: "translateX(-50%)",
            width: 120,
            height: 34,
            background: "#000",
            borderRadius: 20,
            zIndex: 5,
          }} />
          {/* Tab bar */}
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 44,
            display: "flex",
          }}>
            {NAV_IDS.map(n => {
              const active = tab === n.id;
              const color = active ? GOLD : "#8A90A0";
              return (
                <button
                  key={n.id}
                  onClick={() => setTab(n.id)}
                  style={{
                    flex: 1,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    position: "relative",
                    fontFamily: "-apple-system, sans-serif",
                    fontSize: 14,
                    fontWeight: active ? 700 : 500,
                    color,
                    letterSpacing: 0.2,
                  }}
                >
                  <n.Icon color={color} active={active} />
                  {t?.nav[n.key] || n.key}
                  {active && (
                    <div style={{
                      position: "absolute",
                      bottom: 0,
                      left: "15%",
                      right: "15%",
                      height: 2,
                      background: GOLD,
                      borderRadius: 1,
                    }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category panel — slides in below Événements tab */}
        {showCats && tab === "events" && (
          <div style={{
            flexShrink: 0,
            borderBottom: "1px solid #E0E4F0",
            padding: "8px 10px",
            display: "flex",
            gap: 6,
            overflowX: "auto",
            scrollbarWidth: "none",
            background: "#FFFFFF",
          }}>
            {CAT_FILTERS.map(f => (
              <button
                key={f.id}
                onClick={() => onCatFilter?.(catFilter === f.id ? null : f.id)}
                style={{
                  flexShrink: 0,
                  padding: "6px 14px",
                  borderRadius: 20,
                  border: `1px solid ${catFilter === f.id ? NAVY : "rgba(184,150,110,0.4)"}`,
                  background: catFilter === f.id ? NAVY : "#FFFFFF",
                  color: catFilter === f.id ? "#FFFFFF" : "#6A7A9A",
                  fontFamily: "-apple-system, sans-serif",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >{lang === "en" ? f.labelEn : f.label}</button>
            ))}
          </div>
        )}

        {/* Scrollable content */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }} className="hide-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}
