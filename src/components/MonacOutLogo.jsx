import logoSrc from "../assets/logo.png";

export default function MonacOutLogo({ width = 250 }) {
  return (
    <img
      src={logoSrc}
      alt="MonacOut"
      width={width}
      style={{ display: "block", margin: "0 auto", filter: "drop-shadow(0 0 0.4px #B8966E) drop-shadow(0 0 0.4px #B8966E)" }}
    />
  );
}
