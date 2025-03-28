import styles from "./styles.module.css";
import { CatState } from "./types";
import Image from "next/image";

/** Placeholder for the background scene SVG (bed, plant, toy, etc.). */
export const StickerSceneBackground = () => (
  <div className={styles.stickerSceneBg}>
    <Image
      src="/images/purrfect/SceneBackground.svg"
      alt="Cat bedroom scene background"
      fill
      style={{ objectFit: "contain" }}
    />
  </div>
);

/** Placeholder for the animated sticker-style Calico Cat SVG. */
// export const CatDisplay = ({ catState }: { catState: CatState }) => {
//   // Determines the correct placeholder visual. Replace with your SVG component logic.
//   const getCatPlaceholder = () => {
//     const baseClassName = styles.catPlaceholderDiv;
//     switch (catState) {
//       case "sleeping":
//         return <div className={baseClassName}>(Sleeping Cat SVG)</div>;
//       case "purring":
//         return (
//           <div className={baseClassName} style={{ background: "#dfd" }}>
//             (Purring Cat SVG)
//           </div>
//         );
//       case "annoyed":
//         return (
//           <div className={baseClassName} style={{ background: "#fdd" }}>
//             (Annoyed Cat SVG)
//           </div>
//         );
//       case "bolting":
//         return (
//           <div className={baseClassName} style={{ background: "#ddd" }}>
//             (Bolting Cat SVG)
//           </div>
//         );
//       default:
//         return <div className={baseClassName}>?</div>;
//     }
//   };

export const CatDisplay = ({ catState }: { catState: CatState }) => {
  // Don't show the cat image if bolting
  if (catState === "bolting") {
    return <div className={`${styles.catBase} ${styles.catBolting}`}></div>;
  }

  // Add catPurring animation class during petting phase
  const animationClass = catState === "sleeping" ? styles.catPurring : "";

  return (
    <div className={`${styles.catBase} ${animationClass}`}>
      <Image
        src="/images/purrfect/SleepingCat.svg"
        alt="Sleeping cat"
        fill
        style={{
          objectFit: "scale-down",
        }}
      />
    </div>
  );
};
