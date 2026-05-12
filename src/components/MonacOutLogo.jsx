import logoSrc from "../assets/logo.png";

export default function MonacOutLogo({ width = 250 }) {
  return (
    <img
      src={logoSrc}
      alt="MonacOut"
      width={width}
      style={{ display: "block", margin: "0 auto", filter: "brightness(0) saturate(100%) invert(13%) sepia(79%) saturate(631%) hue-rotate(193deg) brightness(74%) contrast(104%)" }}
    />
  );
}
