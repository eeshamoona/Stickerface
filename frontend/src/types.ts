// src/types.ts

export interface Sticker {
  id: string;
  name: string;
  description: string;
  color: string;
  type: "fortune" | "pet" | "weather" | "music" | "game" | "art" | "spell";
  imageSrc: string;
  animation?: 'bounce' | 'pulse' | 'wiggle' | 'spin' | 'float';
}
