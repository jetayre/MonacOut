const GOLD = "#B8966E";
const GOLD2 = "#D4B896";
const DARK = "#1C1612";
const GREY = "#6A635A";
const WHITE = "#FFFFFF";
const LIGHT = "#F8F4EF";
const BORDER = "#E8E0D4";

export default function ProfileScreen() {
  return (
    <div style={{ background: LIGHT, minHeight: "100%" }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(160deg, ${DARK} 0%, #2C2018 100%)`,
        padding: "20px 20px 18px",
      }}>
        <div style={{
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
          fontWeight: "bold",
          fontSize: 24,
          color: WHITE,
        }}>Profil</div>
        <div style={{
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
          fontSize: 13,
          color: "#D4B896",
          marginTop: 2,
        }}>À propos de MonacOut</div>
      </div>

      <div style={{ padding: "20px 16px" }}>
        {/* About section */}
        <div style={{
          background: WHITE,
          borderRadius: 20,
          overflow: "hidden",
          marginBottom: 16,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}>
          {/* Founders */}
          <div style={{
            display: "flex",
            padding: "20px 20px 16px",
          }}>
            {/* Left: Stéphanie */}
            <div style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingRight: 16,
            }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${GOLD}, ${GOLD2})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                fontWeight: "bold",
                color: WHITE,
                fontFamily: "Georgia, serif",
                marginBottom: 8,
              }}>S</div>
              <div style={{
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
                fontSize: 26,
                color: DARK,
                marginBottom: 2,
              }}>Stéphanie</div>
              <div style={{
                fontFamily: "-apple-system, sans-serif",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                color: GOLD,
              }}>Co-fondatrice</div>
            </div>

            {/* Divider */}
            <div style={{
              width: 1,
              background: BORDER,
              alignSelf: "stretch",
              margin: "4px 0",
            }} />

            {/* Right: Véronique */}
            <div style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingLeft: 16,
            }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: `linear-gradient(135deg, #8A8078, #6A635A)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                fontWeight: "bold",
                color: WHITE,
                fontFamily: "Georgia, serif",
                marginBottom: 8,
              }}>V</div>
              <div style={{
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
                fontSize: 26,
                color: DARK,
                marginBottom: 2,
              }}>Véronique</div>
              <div style={{
                fontFamily: "-apple-system, sans-serif",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                color: GREY,
              }}>Co-fondatrice</div>
            </div>
          </div>

          {/* Gold gradient separator */}
          <div style={{
            height: 2,
            background: `linear-gradient(90deg, transparent, ${GOLD}, ${GOLD2}, ${GOLD}, transparent)`,
            margin: "0 20px 16px",
          }} />

          {/* Quote */}
          <div style={{
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            fontSize: 15,
            color: DARK,
            textAlign: "center",
            padding: "0 20px",
            lineHeight: 1.5,
            marginBottom: 16,
          }}>
            "Monaco est une scène permanente. Nous voulions que chacun puisse en être acteur."
          </div>

          {/* Story */}
          <div style={{
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            fontSize: 15,
            color: GREY,
            lineHeight: 1.9,
            padding: "0 20px 20px",
          }}>
            Stéphanie et Véronique partagent une conviction commune : Monaco regorge d'événements exceptionnels, et chaque résident mérite d'en profiter pleinement. MonacOut est née de cette envie de rassembler, en un seul endroit, toute la richesse culturelle et sportive de la Principauté.
          </div>

          {/* Conviction box */}
          <div style={{
            background: LIGHT,
            margin: "0 16px 16px",
            borderRadius: 12,
            padding: "12px 14px",
            borderLeft: `3px solid ${GOLD}`,
          }}>
            <div style={{
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              fontSize: 14,
              color: DARK,
              lineHeight: 1.6,
            }}>
              "La richesse culturelle de Monaco appartient à tous ses résidents."
            </div>
          </div>

          {/* Bold statement */}
          <div style={{
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            fontWeight: "bold",
            fontSize: 18,
            color: DARK,
            textAlign: "center",
            padding: "0 20px 20px",
            letterSpacing: 0.5,
          }}>
            Tout Monaco, dans votre poche.
          </div>
        </div>

        {/* Stats */}
        <div style={{
          background: WHITE,
          borderRadius: 20,
          padding: "16px 20px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              fontWeight: "bold",
              fontSize: 22,
              color: GOLD,
            }}>27</div>
            <div style={{
              fontFamily: "-apple-system, sans-serif",
              fontSize: 10,
              color: GREY,
              letterSpacing: 0.5,
            }}>Sources officielles</div>
          </div>
          <div style={{ width: 1, height: 36, background: BORDER }} />
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              fontWeight: "bold",
              fontSize: 22,
              color: GOLD,
            }}>18+</div>
            <div style={{
              fontFamily: "-apple-system, sans-serif",
              fontSize: 10,
              color: GREY,
              letterSpacing: 0.5,
            }}>Événements/semaine</div>
          </div>
          <div style={{ width: 1, height: 36, background: BORDER }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22 }}>💜</div>
            <div style={{
              fontFamily: "-apple-system, sans-serif",
              fontSize: 10,
              color: GREY,
              letterSpacing: 0.5,
            }}>Fait avec amour</div>
          </div>
        </div>
      </div>
    </div>
  );
}
