const NAVY = "#1A2A5A";
const GOLD = "#B8966E";

function CalIcon({ color }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}

function HeartIcon({ color, active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? color : "none"} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

const NAV_IDS = [
  { id: "events", key: "events", Icon: CalIcon },
  { id: "agenda", key: "agenda", Icon: HeartIcon },
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
          height: 82,
          borderTop: `1px solid #E0E4F0`,
          background: "#FFFFFF",
          display: "flex",
          alignItems: "stretch",
          flexShrink: 0,
          zIndex: 50,
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
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  padding: 0,
                  position: "relative",
                }}
              >
                {active && (
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
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 46,
                  height: 38,
                  background: active ? `rgba(184,150,110,0.15)` : "transparent",
                  borderRadius: 10,
                  border: active ? `1.5px solid ${GOLD}` : `1px solid rgba(184,150,110,0.35)`,
                }}>
                  <n.Icon color={color} active={active} />
                </div>
                <span style={{
                  fontFamily: "-apple-system, sans-serif",
                  fontSize: 11,
                  fontWeight: active ? 700 : 400,
                  color,
                  letterSpacing: 0.3,
                  lineHeight: 1,
                }}>{t?.nav[n.key] || n.key}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
