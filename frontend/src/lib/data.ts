import type { Sticker } from "../types";

export const stickers: Sticker[] = [
  {
    id: "fortune-teller",
    name: "Fortune Teller",
    description: "Reveals your mysterious future",
    color: "#FFD700",
    type: "fortune",
    imageSrc: "/images/fortune.svg",
    animation: "wiggle"
  },
  {
    id: "happy-pet",
    name: "Happy Pet",
    description: "A digital friend that reacts to your touches",
    color: "#FF69B4",
    type: "pet",
    imageSrc: "/images/pet.svg",
    animation: "bounce"
  },
  {
    id: "stress-spell",
    name: "Stress Relief Spell",
    description: "Create a magical spell to relieve stress",
    color: "#9D8FEA",
    type: "spell",
    imageSrc: "/images/spell.svg",
    animation: "pulse"
  },
  {
    id: "lemonomics",
    name: "Lemonomics",
    description: "Run your own lemonade stand business",
    color: "#FFDA3D",
    type: "lemonomics",
    imageSrc: "/images/lemonomics.svg",
    animation: "bounce"
  },
  {
    id: "weather-wizard",
    name: "Weather Wizard",
    description: "Shows weather with magical animations",
    color: "#87CEEB",
    type: "weather",
    imageSrc: "/images/weather.svg",
    animation: "float"
  },
  {
    id: "music-box",
    name: "Music Box",
    description: "Creates sounds based on your movements",
    color: "#9370DB",
    type: "music",
    imageSrc: "/images/music.svg",
    animation: "pulse"
  },
  {
    id: "mini-game",
    name: "Mini Game",
    description: "A tiny game to play when bored",
    color: "#32CD32",
    type: "game",
    imageSrc: "/images/game.svg",
    animation: "spin"
  },
  {
    id: "art-maker",
    name: "Art Maker",
    description: "Create tiny digital art pieces",
    color: "#FF7F50",
    type: "art",
    imageSrc: "/images/art.svg"
  },
];

export const getSticker = (id: string): Sticker | undefined => {
  return stickers.find((sticker) => sticker.id === id);
};
