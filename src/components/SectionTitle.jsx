const GOLD = "#B8966E";
const DARK = "#1C1612";

export default function SectionTitle({ children, sub }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        fontFamily: "Georgia, serif",
        fontStyle: "italic",
        fontWeight: "bold",
        fontSize: 11,
        letterSpacing: 2,
        textTransform: "uppercase",
        color: GOLD,
        marginBottom: 2,
      }}>
        {sub}
      </div>
      <div style={{
        fontFamily: "Georgia, serif",
        fontStyle: "italic",
        fontWeight: "bold",
        fontSize: 22,
        letterSpacing: 1,
        textTransform: "uppercase",
        color: DARK,
        lineHeight: 1.1,
      }}>
        {children}
      </div>
    </div>
  );
}
