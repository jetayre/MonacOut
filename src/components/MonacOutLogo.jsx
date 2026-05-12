import logoSrc from "../assets/logo.png";

export default function MonacOutLogo({ width = 250 }) {
  return (
    <img
      src={logoSrc}
      alt="MonacOut"
      width={width}
      style={{ display: "block", margin: "0 auto" }}
    />
  );
}
