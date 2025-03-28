// src/types.ts

export interface Sticker {
  id: string;
  name: string;
  description: string;
  color: string;
  type:
    | "fortune"
    | "pet"
    | "spell"
    | "perfect-day"
    | "button"
    | "purrfect-timing";
  imageSrc: string;
  animation?: "bounce" | "pulse" | "wiggle" | "spin" | "float";
}
