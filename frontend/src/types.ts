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

export interface ArtStyle {
  id: string;
  name: string;
  description: string;
  imagePath: string;
}

export interface Photo {
  id: string;
  title: string;
  description: string;
  type: "comparison" | "single" | "gallery" | "art-styles";
  date: string;
  location?: string;
  color?: string;
  images: {
    original: string;
    artStyles?: ArtStyle[];
    before?: string;
    after?: string;
    main?: string;
    gallery?: string[];
  };
  aspectRatio?: string;
}
