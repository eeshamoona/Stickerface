import { GameResult, TARGET_TIME_MS, MIN_PET_TIME_MS } from './types';

/** Loads a number from localStorage, returning 0 on error or if not found. */
export const loadNumberFromStorage = (key: string): number => {
  if (typeof window === "undefined") return 0; // Avoid SSR issues
  try {
    const storedValue = localStorage.getItem(key);
    const num = storedValue ? parseInt(storedValue, 10) : 0;
    return isNaN(num) ? 0 : num;
  } catch (error) {
    console.error(`Error loading ${key}:`, error);
    return 0;
  }
};

/** Saves a number to localStorage. */
export const saveNumberToStorage = (key: string, value: number) => {
  if (typeof window === "undefined") return; // Avoid SSR issues
  try {
    localStorage.setItem(key, value.toString());
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
  }
};

/** Formats milliseconds into a seconds string (e.g., "9.876s" or "9.88s"). */
export const formatTime = (ms: number, includeMs = false): string => {
  return (ms / 1000).toFixed(includeMs ? 3 : 2);
};

/** Calculates the score and rank for a single successful round based on time held. */
export const calculateRoundScore = (elapsedMs: number): GameResult => {
  // Fail conditions handled before calling this, but added guards
  if (elapsedMs >= TARGET_TIME_MS)
    return { timeMs: elapsedMs, score: 0, rank: "Awakened!" };
  if (elapsedMs < MIN_PET_TIME_MS)
    return { timeMs: elapsedMs, score: 0, rank: "Too Short!" }; // Should not be reached if logic is correct

  const diff = TARGET_TIME_MS - elapsedMs;
  const baseScore = Math.floor(elapsedMs); // Base points = ms held
  let bonus = 0;
  let rank = "";

  // Determine Rank and Bonus based on proximity to target
  if (diff <= 15) {
    rank = "Zen Master";
    bonus = 15000 + Math.floor((15 - diff) * 100);
  } else if (diff <= 50) {
    rank = "Purrfectly Close";
    bonus = 10000;
  } else if (diff <= 150) {
    rank = "Whisker Watcher";
    bonus = 5000;
  } else if (diff <= 400) {
    rank = "Happy Purrs";
    bonus = 1000;
  } else if (diff <= 1000) {
    rank = "Soothing Touch";
    bonus = 200;
  } else {
    rank = "Good Pet";
    bonus = 0;
  } // Default rank for valid times without high bonus

  return { timeMs: elapsedMs, score: baseScore + bonus, rank };
};
