import React from "react"; // Import React to use MouseEvent type
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
  // Define the event handler function
  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    // Prevent the default context menu (image menu, right-click menu)
    event.preventDefault();
    // Returning false is generally not needed in React when using preventDefault
    // return false;
  };

  if (catState === "bolting") {
    return (
      // Add the onContextMenu handler to the div
      <div
        className={`${styles.catBase} ${styles.catBolting}`}
        onContextMenu={handleContextMenu} // Attach the handler here
      >
        <Image
          src="/images/purrfect/SleepingCatBolted.svg"
          alt="Sleeping cat bolted"
          fill
          priority
          draggable="false"
        />
      </div>
    );
  }

  if (gameState === "petting") {
    return (
      // Add the onContextMenu handler to the div
      <div
        className={`${styles.catBase} ${styles.catPurring}`}
        onContextMenu={handleContextMenu} // Attach the handler here
      >
        <Image
          src="/images/purrfect/SleepingCatFull.svg"
          alt="Sleeping cat purring"
          fill
          priority
          draggable="false"
        />
      </div>
    );
  }

  // Default state
  return (
    // Add the onContextMenu handler to the div
    <div
      className={`${styles.catBase}`}
      onContextMenu={handleContextMenu} // Attach the handler here
    >
      <Image
        src="/images/purrfect/SleepingCatFull.svg"
        alt="Sleeping cat"
        fill
        priority
        draggable="false"
      />
    </div>
  );
};