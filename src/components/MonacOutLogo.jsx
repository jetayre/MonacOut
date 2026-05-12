const GOLD = "#B8966E";

export default function MonacOutLogo({ width = 250 }) {
  return (
    <div style={{ textAlign: "center", width, margin: "0 auto" }}>
      <div style={{ fontSize: 22, lineHeight: 1, marginBottom: 4, color: GOLD }}>♛</div>
      <div style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: 34,
        fontWeight: 700,
        color: GOLD,
        letterSpacing: 5,
        textTransform: "uppercase",
        lineHeight: 1,
      }}>MonacOut</div>
    </div>
  );
}
