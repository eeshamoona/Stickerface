import Image from "next/image";
import styles from "./styles.module.css";
import { CatState } from "./types";

export const CatDisplay = ({
  catState,
  gameState,
}: {
  catState: CatState;
  gameState: string;
}) => {
  if (catState === "bolting") {
    return (
      <div className={`${styles.catBase} ${styles.catBolting}`}>
        <Image
          src="/images/purrfect/SleepingCatBolted.svg"
          alt="Sleeping cat bolted"
          fill
          priority
        />
      </div>
    );
  }

  if (gameState === "petting") {
    return (
      <div className={`${styles.catBase} ${styles.catPurring}`}>
        <Image
          src="/images/purrfect/SleepingCatFull.svg"
          alt="Sleeping cat purring"
          fill
          priority
        />
      </div>
    );
  }

  return (
    <div className={`${styles.catBase}`}>
      <Image
        src="/images/purrfect/SleepingCatFull.svg"
        alt="Sleeping cat"
        fill
        priority
      />
    </div>
  );
};
