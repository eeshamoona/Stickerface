import styles from "./styles.module.css";
import { CatState } from "./types";

/** Placeholder for the background scene SVG (bed, plant, toy, etc.). */
export const StickerSceneBackground = () => (
  <div className={styles.stickerSceneBg}>
    <img
      src="/images/purrfect/Background.svg"
      alt="Cat bedroom scene background"
      style={{ width: "100%", height: "100%", objectFit: "contain" }}
    />
  </div>
);

/** Placeholder for the animated sticker-style Calico Cat SVG. */
export const CatDisplay = ({ catState }: { catState: CatState }) => {
  // Determines the correct placeholder visual. Replace with your SVG component logic.
  const getCatPlaceholder = () => {
    const baseClassName = styles.catPlaceholderDiv;
    switch (catState) {
      case "sleeping":
        return <div className={baseClassName}>(Sleeping Cat SVG)</div>;
      case "purring":
        return (
          <div className={baseClassName} style={{ background: "#dfd" }}>
            (Purring Cat SVG)
          </div>
        );
      case "annoyed":
        return (
          <div className={baseClassName} style={{ background: "#fdd" }}>
            (Annoyed Cat SVG)
          </div>
        );
      case "bolting":
        return (
          <div className={baseClassName} style={{ background: "#ddd" }}>
            (Bolting Cat SVG)
          </div>
        );
      default:
        return <div className={baseClassName}>?</div>;
    }
  };

  // Get the appropriate CSS class based on cat state
  const getCatStateClassName = () => {
    switch (catState) {
      case "purring":
        return styles.catPurring;
      case "annoyed":
        return styles.catAnnoyed;
      case "bolting":
        return styles.catBolting;
      default:
        return styles.catBase;
    }
  };

  // Applies base styles and state-specific class to the wrapper div
  return (
    <div className={`${styles.catBase} ${getCatStateClassName()}`}>
      {getCatPlaceholder()}
    </div>
  );
};
