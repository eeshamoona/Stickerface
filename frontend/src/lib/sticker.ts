import { Sticker } from "@/types";

export const stickers: Sticker[] = [
  {
    id: "fortune-teller",
    name: "Fortune Teller",
    description: "Reveals your mysterious future",
    color: "#F4D03F",
    type: "fortune",
    imageSrc: "/images/fortune.svg",
  },
  {
    id: "stress-spell",
    name: "Stress Relief Spell",
    description: "Create a magical spell to relieve stress",
    color: "#8A2BE2",
    type: "spell",
    imageSrc: "/images/spell.svg",
  },
  {
    id: "perfect-day-game",
    name: "A Perfect Day to Remember",
    description: "A memory game about the perfect day",
    color: "#67CEEE",
    type: "perfect-day",
    imageSrc: "/images/perfect-day.svg",
  },
  {
    id: "do-not-push",
    name: "Do Not Push Button",
    description: "A button that you should not push",
    color: "#DC143C",
    type: "button",
    imageSrc: "/images/button.svg",
  },
  {
    id: "purrfect-timing",
    name: "Purrfect Timing",
    description: "Pet the cat to win the game",
    color: "#af90ff",
    type: "purrfect-timing",
    imageSrc: "/images/purrfect-timing.svg",
  },
];
export const getSticker = (id: string): Sticker | undefined => {
  return stickers.find((sticker) => sticker.id === id);
};
