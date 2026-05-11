const GOLD = "#B8966E";
const DARK = "#1C1612";

const NAV = [
  { id: "home", icon: "🏠", label: "Accueil" },
  { id: "agenda", icon: "📅", label: "Agenda" },
  { id: "map", icon: "📍", label: "Carte" },
  { id: "favorites", icon: "❤️", label: "Favoris" },
  { id: "profile", icon: "👤", label: "Profil" },
];

export default function Shell({ tab, setTab, children }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#E0D8D0",
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
        boxShadow: "0 24px 80px rgba(0,0,0,0.3)",
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

        {/* Scrollable content area */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          paddingTop: 46,
          paddingBottom: 0,
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
          className="hide-scrollbar"
        >
          {children}
        </div>

        {/* Bottom nav */}
        <div style={{
          height: 72,
          borderTop: "1px solid #E8E0D4",
          background: "#FFFFFF",
          display: "flex",
          alignItems: "flex-start",
          paddingTop: 8,
          flexShrink: 0,
          zIndex: 50,
        }}>
          {NAV.map(n => (
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
                gap: 3,
                padding: "0 4px",
                position: "relative",
              }}
            >
              {tab === n.id && (
                <div style={{
                  position: "absolute",
                  top: -9,
                  width: 20,
                  height: 3,
                  background: GOLD,
                  borderRadius: 2,
                }} />
              )}
              <span style={{ fontSize: 20 }}>{n.icon}</span>
              <span style={{
                fontFamily: "-apple-system, sans-serif",
                fontSize: 10,
                fontWeight: tab === n.id ? 700 : 400,
                color: tab === n.id ? GOLD : "#6A635A",
                letterSpacing: 0.3,
              }}>{n.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
