/**
 * Constants for the Lemonomics Sticker component
 */

// Local Storage key
export const STORAGE_PREFIX = "lemonomics::";
export const DAYS_PLAYED_KEY = `${STORAGE_PREFIX}daysPlayed`;
export const LIFETIME_PROFIT_KEY = `${STORAGE_PREFIX}lifetimeProfit`;

// Game constants
export const MIN_CUSTOMERS = 10;
export const MAX_CUSTOMERS = 15;
export const MIN_PRICE = 0.5; // Minimum price
export const MAX_PRICE = 5.0; // Maximum price
export const MAX_DAYS = 5; // Game lasts for 5 days

// Animal names for customers
export const animalNames = [
  "Bunny",
  "Fox",
  "Raccoon",
  "Squirrel",
  "Deer",
  "Bear",
  "Wolf",
  "Beaver",
  "Hedgehog",
  "Owl",
  "Frog",
  "Turtle",
  "Mouse",
  "Rabbit",
  "Chipmunk",
];

// Customer types with preferences
export const customerTypes = [
  {
    type: "thrifty",
    priceMultiplier: 0.8,
    emoji: "🐰",
    thought: "I hope it's not too expensive...",
  },
  {
    type: "average",
    priceMultiplier: 1.0,
    emoji: "🦊",
    thought: "I could use refreshment!",
  },
  {
    type: "generous",
    priceMultiplier: 1.2,
    emoji: "🦝",
    thought: "Quality is worth paying for.",
  },
  {
    type: "kid",
    priceMultiplier: 0.7,
    emoji: "🐿️",
    thought: "I saved my allowance for this!",
  },
  {
    type: "enthusiast",
    priceMultiplier: 1.4,
    emoji: "🦔",
    thought: "I've heard great things about your lemonade!",
  },
  {
    type: "connoisseur",
    priceMultiplier: 1.6,
    emoji: "🦉",
    thought: "I only drink the finest lemonade.",
  },
];
