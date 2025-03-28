import type { Sticker } from "../types";
export interface CharacterConfig {
  slug: string;
  name: string;
  bgColor: string;
  activities: { id: string; label: string; svg: string }[];
  imageSrc: string;
}

export const stickers: Sticker[] = [
  {
    id: "fortune-teller",
    name: "Fortune Teller",
    description: "Reveals your mysterious future",
    color: "#F4D03F",
    type: "fortune",
    imageSrc: "/images/fortune.svg",
    animation: "wiggle",
  },
  {
    id: "stress-spell",
    name: "Stress Relief Spell",
    description: "Create a magical spell to relieve stress",
    color: "#8A2BE2",
    type: "spell",
    imageSrc: "/images/spell.svg",
    animation: "pulse",
  },
  {
    id: "perfect-day-game",
    name: "A Perfect Day to Remember",
    description: "A memory game about the perfect day",
    color: "#67CEEE",
    type: "perfect-day",
    imageSrc: "/images/perfect-day.svg",
    animation: "bounce",
  },
  {
    id: "do-not-press-button",
    name: "Do Not Press Button",
    description: "A button that you should not press",
    color: "#DC143C",
    type: "button",
    imageSrc: "/images/button.svg",
    animation: "pulse",
  },
  {
    id: "purrfect-timing",
    name: "Purrfect Timing",
    description: "Pet the cat to win the game",
    color: "#af90ff",
    type: "purrfect-timing",
    imageSrc: "/images/purrfect-timing.svg",
    animation: "bounce",
  },
];

export const getSticker = (id: string): Sticker | undefined => {
  return stickers.find((sticker) => sticker.id === id);
};

// Define a type for the characters object with an index signature
interface CharacterDictionary {
  [key: string]: CharacterConfig;
}

export const getCharacterConfig = (slug: string): CharacterConfig => {
  const characters: CharacterDictionary = {
    capybara: {
      slug: "capybara",
      name: "Capybara",
      bgColor: "#e7fcb9",
      activities: [
        { id: "fish", label: "Fish", svg: "/images/friends/capybara/fish.svg" },
        { id: "bee", label: "Bee", svg: "/images/friends/capybara/bee.svg" },
        {
          id: "pizza",
          label: "Pizza",
          svg: "/images/friends/capybara/pizza.svg",
        },
        { id: "boba", label: "Boba", svg: "/images/friends/capybara/boba.svg" },
      ],
      imageSrc: "/images/friends/capybara/capybara.svg",
    },
    dogchick: {
      slug: "dogchick",
      name: "Dog & Chick",
      bgColor: "#ffd2b2",
      activities: [
        { id: "bone", label: "Bone", svg: "/images/friends/dog/bone.svg" },
        {
          id: "icecream",
          label: "Ice Cream",
          svg: "/images/friends/dog/ice-cream.svg",
        },
        {
          id: "flower",
          label: "Flower",
          svg: "/images/friends/dog/flower.svg",
        },
        {
          id: "fishbowl",
          label: "Fish Bowl",
          svg: "/images/friends/dog/fishbowl.svg",
        },
      ],
      imageSrc: "/images/friends/dog/dogchick.svg",
    },
    bunny: {
      slug: "bunny",
      name: "Bunny",
      bgColor: "#fff9b2",
      activities: [
        {
          id: "carrot",
          label: "Carrot",
          svg: "/images/friends/bunny/carrot.svg",
        },
        {
          id: "donut",
          label: "Donut",
          svg: "/images/friends/bunny/donut.svg",
        },
        {
          id: "easteregg",
          label: "Easter Egg",
          svg: "/images/friends/bunny/easteregg.svg",
        },
        {
          id: "mushroom",
          label: "Mushroom",
          svg: "/images/friends/bunny/mushroom.svg",
        },
      ],
      imageSrc: "/images/friends/bunny/bunny.svg",
    },
    bear: {
      slug: "bear",
      name: "Bear",
      bgColor: "#bdddff",
      activities: [
        { id: "rose", label: "Rose", svg: "/images/friends/bear/rose.svg" },
        { id: "soda", label: "Soda", svg: "/images/friends/bear/soda.svg" },
        {
          id: "butterfly",
          label: "Butterfly",
          svg: "/images/friends/bear/butterfly.svg",
        },
        { id: "scarf", label: "Scarf", svg: "/images/friends/bear/scarf.svg" },
      ],
      imageSrc: "/images/friends/bear/bear.svg",
    },
    // add more friends here
  };

  return characters[slug] ?? characters["capybara"];
};
