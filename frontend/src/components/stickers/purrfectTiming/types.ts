// Types and constants for PurrfectTiming sticker

// --- Constants ---
export const TARGET_TIME_MS = 10000; // Target hold time
export const MIN_PET_TIME_MS = 5000; // Minimum hold time required to count as a valid attempt (avoids breaking streak)
export const TIMER_UPDATE_INTERVAL_MS = 10; // How often the internal timer updates
export const INTRO_FADE_DURATION_MS = 5000; // Duration intro text is visible
export const BOLT_DELAY_MS = 0; // Delay between annoyed state and bolting state
export const BEST_SCORE_KEY = "purrfectTimingHighestEverScore_v1"; // localStorage key for highest accumulated score
export const MAX_STREAK_KEY = "purrfectTimingMaxStreak_v1"; // localStorage key for highest streak

// --- Types ---
export type GameState = "idle" | "petting" | "result" | "failed"; // 'failed' covers too long & too short
export type CatState = "sleeping" | "purring" | "annoyed" | "bolting";
export interface GameResult {
  timeMs: number;
  score: number;
  rank: string;
} // Represents the outcome of a single round
