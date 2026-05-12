const NAVY = "#1A2A5A";
const GOLD = "#B8966E";

const NAV_IDS = [
  { id: "home",      icon: "🏠", key: "home"      },
  { id: "agenda",    icon: "📅", key: "agenda"    },
  { id: "map",       icon: "📍", key: "map"       },
  { id: "favorites", icon: "❤️", key: "favorites" },
  { id: "profile",   icon: "👤", key: "profile"   },
];

export default function Shell({ tab, setTab, children, t }) {
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
        position: "relative",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 24px 80px rgba(26,42,90,0.25)",
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
          zIndex: 100,
        }} />

        {/* White mask */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: 46,
          background: "#FFFFFF",
          zIndex: 60,
          pointerEvents: "none",
        }} />

        {/* Scrollable content */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          paddingTop: 46,
          paddingBottom: 0,
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }} className="hide-scrollbar">
          {children}
        </div>

        {/* Bottom nav */}
        <div style={{
          height: 72,
          borderTop: `1px solid #E0E4F0`,
          background: "#FFFFFF",
          display: "flex",
          alignItems: "stretch",
          flexShrink: 0,
          zIndex: 50,
        }}>
          {NAV_IDS.map(n => (
            <button
              key={n.id}
              onClick={() => setTab(n.id)}
              style={{
                flex: 1,
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                padding: 0,
                position: "relative",
              }}
            >
              {tab === n.id && (
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 20,
                  height: 3,
                  background: GOLD,
                  borderRadius: 2,
                }} />
              )}
              <span style={{
                fontSize: 26,
                lineHeight: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 42,
                height: 34,
                background: tab === n.id ? `rgba(184,150,110,0.15)` : "transparent",
                borderRadius: 10,
                border: tab === n.id ? `1.5px solid ${GOLD}` : `1px solid rgba(184,150,110,0.35)`,
              }}>{n.icon}</span>
              <span style={{
                fontFamily: "-apple-system, sans-serif",
                fontSize: 10,
                fontWeight: tab === n.id ? 700 : 400,
                color: tab === n.id ? GOLD : "#8A90A0",
                letterSpacing: 0.3,
                lineHeight: 1,
              }}>{t?.nav[n.key] || n.key}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
