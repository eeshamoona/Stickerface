// src/types.ts

export interface Sticker {
  id: string;
  name: string;
  description: string;
  color: string;
  type:
    | "fortune"
    | "pet"
    | "weather"
    | "music"
    | "game"
    | "art"
    | "spell"
    | "perfect-day"
    | "button";
  imageSrc: string;
  animation?: "bounce" | "pulse" | "wiggle" | "spin" | "float";
}
