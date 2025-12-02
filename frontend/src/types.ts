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
}

export interface ArtStyle {
  id: string;
  name: string;
  prompt?: string;
  imagePath: string;
  objectPosition?: string;
}

export interface Photo {
  id: string;
  slug: string; // Manual URL slug
  title: string;
  description: string;
  date: string;
  location?: string;
  images: {
    original: string;
    video?: string;
    artStyles: ArtStyle[];
  };
  aspectRatio?: string;
  objectPosition?: string;
  metadata?: {
    [key: string]: unknown;
  };
}
