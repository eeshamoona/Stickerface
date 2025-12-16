import { Sticker } from "@/types";

export const stickers: Sticker[] = [
  {
    id: "fortune-teller",
    name: "Fortune Teller",
    description: "Get a random fortune from the future",
    color: "#F4D03F",
    type: "fortune",
    imageSrc: "/images/fortune.svg",
  },
  {
    id: "stress-spell",
    name: "Stress Relief Spell",
    description: "Create your own magical incantation to relieve stress",
    color: "#67ceeeff",
    type: "spell",
    imageSrc: "/images/spell.svg",
  },
  {
    id: "perfect-day-game",
    name: "A Perfect Day",
    description: "Memory game about a friend's perfect day",
    color: "#f0a626ff",
    type: "perfect-day",
    imageSrc: "/images/perfect-day.svg",
  },
  {
    id: "do-not-push",
    name: "Do Not Push Button",
    description: "A button you should not push",
    color: "#DC143C",
    type: "button",
    imageSrc: "/images/DoNotPush-Full.svg",
  },
  {
    id: "purrfect-timing",
    name: "Purrfect Timing",
    description: "Pet the cat just right",
    color: "#af90ff",
    type: "purrfect-timing",
    imageSrc: "/images/purrfect/SleepingCatFull.svg",
  },
  {
    id: "ride-the-bus",
    name: "Ride the Bus",
    description: "Correctly guess all the questions to get off the bus",
    color: "#4ADE80",
    type: "ride-the-bus",
    imageSrc: "/images/bus.svg",
  },
];
export const getSticker = (id: string): Sticker | undefined => {
  return stickers.find((sticker) => sticker.id === id);
};
