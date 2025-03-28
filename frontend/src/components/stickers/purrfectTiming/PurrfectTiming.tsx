"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  BiAlarm,
  BiAward,
  BiCrown,
  BiLineChart,
  BiTrophy,
} from "react-icons/bi";
import { CatDisplay, StickerSceneBackground } from "./components";
import styles from "./styles.module.css";
import {
  BEST_SCORE_KEY,
  BOLT_DELAY_MS,
  CatState,
  GameResult,
  GameState,
  INTRO_FADE_DURATION_MS,
  MAX_STREAK_KEY,
  MIN_PET_TIME_MS,
  TARGET_TIME_MS,
  TIMER_UPDATE_INTERVAL_MS,
} from "./types";
import {
  calculateRoundScore,
  formatTime,
  loadNumberFromStorage,
  saveNumberToStorage,
} from "./utils";

// --- Main Component: PurrfectTiming ---
const PurrfectTiming: React.FC = () => {
  // --- State ---
  const [gameState, setGameState] = useState<GameState>("idle");
  const [catState, setCatState] = useState<CatState>("sleeping");
  const [startTime, setStartTime] = useState<number | null>(null); // Timestamp when petting started
  const [elapsedTime, setElapsedTime] = useState<number>(0); // Internal timer value during petting
  const [lastRoundResult, setLastRoundResult] = useState<GameResult | null>(
    null
  ); // Result of the single last successful round
  const [failTime, setFailTime] = useState<number | null>(null); // Timestamp of failure (too short or too long)
  const [showIntro, setShowIntro] = useState<boolean>(true); // Controls visibility of initial instructions

  // Score & Streak State
  const [currentStreak, setCurrentStreak] = useState<number>(0); // Current consecutive successes
  const [currentTotalScore, setCurrentTotalScore] = useState<number>(0); // Score accumulated during the current streak
  const [highestEverScore, setHighestEverScore] = useState<number>(0); // Highest accumulated score achieved (persisted)
  const [highestStreak, setHighestStreak] = useState<number>(0); // Longest streak achieved (persisted)

  // --- Refs ---
  const timerRef = useRef<NodeJS.Timeout | null>(null); // Interval ID for petting timer
  const failTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Timeout ID for annoyed -> bolting transition
  const introFadeTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Timeout ID for fading intro text

  // --- Event Handlers (Memoized) ---
  const handlePressStart = useCallback(() => {
    // Allow starting only from idle, result, or failed states
    if (!["idle", "result", "failed"].includes(gameState)) return;

    // Clear pending animations/timeouts
    if (failTimeoutRef.current) clearTimeout(failTimeoutRef.current);
    if (introFadeTimeoutRef.current) clearTimeout(introFadeTimeoutRef.current);

    // Set initial petting state
    setGameState("petting");
    setCatState("purring"); // Assume purring starts immediately (or adjust cat state logic)
    setStartTime(Date.now());
    setElapsedTime(0);
    setLastRoundResult(null); // Clear previous round result
    setFailTime(null); // Clear previous fail time
    setShowIntro(false); // Hide intro text
  }, [gameState]); // Dependency: Only needs gameState to check if interaction is allowed

  const handlePressEnd = useCallback(
    (forceFail = false, finalElapsedTimeOverride: number | null = null) => {
      // Only process if currently petting
      if (gameState !== "petting" || startTime === null) return;

      // Stop the timer
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;

      // Determine final elapsed time
      const finalElapsedTime =
        finalElapsedTimeOverride ?? Date.now() - startTime;
      setElapsedTime(finalElapsedTime); // Store final time for display/record
      setStartTime(null); // Clear start time

      // Determine if the round was successful (within time bounds)
      const wasSuccessful =
        !forceFail &&
        finalElapsedTime < TARGET_TIME_MS &&
        finalElapsedTime >= MIN_PET_TIME_MS;

      if (wasSuccessful) {
        // --- Handle Success ---
        const roundResult = calculateRoundScore(finalElapsedTime); // Get score for *this* round
        const nextStreak = currentStreak + 1;
        const nextTotalScore = currentTotalScore + roundResult.score;

        setLastRoundResult(roundResult);
        setGameState("result");
        setCatState("purring"); // Cat remains purring for result display
        setFailTime(null);
        setCurrentStreak(nextStreak); // Increment streak
        setCurrentTotalScore(nextTotalScore); // Add round score to total

        // Update persisted high scores/streaks if necessary
        if (nextTotalScore > highestEverScore) {
          setHighestEverScore(nextTotalScore);
          saveNumberToStorage(BEST_SCORE_KEY, nextTotalScore);
        }
        if (nextStreak > highestStreak) {
          setHighestStreak(nextStreak);
          saveNumberToStorage(MAX_STREAK_KEY, nextStreak);
        }
      } else {
        // --- Handle Failure (Too Long OR Too Short) ---
        setGameState("failed");
        setCatState("annoyed"); // Show annoyed state first
        setFailTime(finalElapsedTime); // Record the time of failure
        setLastRoundResult(null);
        setCurrentStreak(0); // Reset streak to 0
        setCurrentTotalScore(0); // Reset current accumulated score to 0

        // Set timeout for the cat to bolt after showing annoyance
        failTimeoutRef.current = setTimeout(
          () => setCatState("bolting"),
          BOLT_DELAY_MS
        );
      }
    },
    [
      gameState,
      startTime,
      currentStreak,
      currentTotalScore,
      highestEverScore,
      highestStreak,
    ]
  ); // Include all state needed for logic

  // --- Effect Hooks ---
  useEffect(() => {
    // On Mount: Load persisted data, set intro fade timer
    setHighestEverScore(loadNumberFromStorage(BEST_SCORE_KEY));
    setHighestStreak(loadNumberFromStorage(MAX_STREAK_KEY));
    introFadeTimeoutRef.current = setTimeout(
      () => setShowIntro(false),
      INTRO_FADE_DURATION_MS
    );
    return () => {
      if (introFadeTimeoutRef.current)
        clearTimeout(introFadeTimeoutRef.current);
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  useEffect(() => {
    // On Unmount: Cleanup all timers
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (failTimeoutRef.current) clearTimeout(failTimeoutRef.current);
      if (introFadeTimeoutRef.current)
        clearTimeout(introFadeTimeoutRef.current);
    };
  }, []); // Empty dependency array ensures cleanup runs only on unmount

  useEffect(() => {
    // Petting Timer Logic: Start/stop interval based on game state
    if (gameState === "petting" && startTime !== null) {
      timerRef.current = setInterval(() => {
        const currentElapsed = Date.now() - startTime;
        setElapsedTime(currentElapsed);
        // Auto-fail if time exceeds target during petting
        if (currentElapsed >= TARGET_TIME_MS) {
          handlePressEnd(true, currentElapsed);
        }
      }, TIMER_UPDATE_INTERVAL_MS);
    } else {
      // Clear interval if not petting
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    }
    // Cleanup interval when effect re-runs or component unmounts
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, startTime, handlePressEnd]); // Include handlePressEnd because it's called from effect

  // --- Dynamic Content for Rendering ---
  const isPetting = gameState === "petting";

  // Determine feedback message based on current game state and results
  const feedbackDisplay = (() => {
    if (gameState === "idle")
      return "Calico Cat is dreaming... Aim to pet it for exactly 10 seconds at a time!";
    if (isPetting) return "Petting... zzZzzz...";
    if (gameState === "result" && lastRoundResult)
      return `${
        lastRoundResult.rank
      }! (+${lastRoundResult.score.toLocaleString()})`; // Show score added this round
    if (gameState === "failed" && failTime !== null)
      return failTime < MIN_PET_TIME_MS
        ? `Oops! Calico Cat needed more attention. Try petting longer!`
        : `Oh no! Calico Cat got overstimulated! Try releasing sooner!`;
    return ""; // Default empty message
  })();

  // Determine time display string (only shown for results/failures)
  const timeDisplay = (() => {
    if (gameState === "result" && lastRoundResult)
      return `Time: ${formatTime(lastRoundResult.timeMs, true)}s`;
    if (gameState === "failed" && failTime !== null)
      return `Held: ${formatTime(failTime, true)}s`;
    return null;
  })();

  // --- Helper Render Function for Score Footer (with Icons) ---
  const renderScoreFooter = () => (
    <div className={styles.scoreFooterArea}>
      <div className={styles.scoreItem}>
        {/* Using BiAward as a generic score icon, BiTrophy for best */}
        <span className={styles.scoreLabel}>
          <BiAward className={styles.scoreIcon} /> Score:
        </span>
        <span className={styles.scoreValue}>
          {currentTotalScore.toLocaleString()}
        </span>
      </div>
      <div className={styles.scoreItem}>
        {/* BiLineChart or BiTrendingUp for streak */}
        <span className={styles.scoreLabel}>
          <BiLineChart className={styles.scoreIcon} /> Streak:
        </span>
        <span className={styles.scoreValue}>
          {currentStreak > 0 ? `${currentStreak}x` : "-"}
        </span>
      </div>
      {/* Vertical Divider */}
      <div className={styles.verticalDivider} />
      <div className={styles.scoreItem}>
        <span className={styles.scoreLabel}>
          <BiTrophy className={styles.scoreIcon} /> Best:
        </span>
        <span className={styles.scoreValue}>
          {highestEverScore.toLocaleString()}
        </span>
      </div>
      <div className={styles.scoreItem}>
        {/* BiCrown or BiTrophy for max streak */}
        <span className={styles.scoreLabel}>
          <BiCrown className={styles.scoreIcon} /> Max:
        </span>
        <span className={styles.scoreValue}>
          {highestStreak > 0 ? `${highestStreak}x 🔥` : "-"}
        </span>
      </div>
    </div>
  );

  // --- Main Render ---
  return (
    <div className={styles.container}>
      <h1 className={styles.gameTitle}>Purrfect Timing</h1>
      {/* Feedback Area */}
      <div className={styles.feedbackArea}>
        {/* Intro Text Layer (Fades Out) */}
        <p
          className={styles.feedbackTextBase}
          style={{
            position: "absolute",
            opacity: gameState === "idle" && showIntro ? 1 : 0,
            pointerEvents: "none",
            width: "100%",
          }}
        >
          {gameState === "idle" ? feedbackDisplay : ""}
        </p>
        {/* Main Game Feedback Layer */}
        {timeDisplay && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BiAlarm className={styles.resultTimeIcon} />
            <span className={styles.resultTime}>{timeDisplay}</span>
          </div>
        )}
        {/* Non-petting feedback */}
        {gameState !== "idle" && !isPetting && (
          <p
            className={`${styles.feedbackTextBase} ${
              gameState === "result"
                ? styles.successFeedback
                : gameState === "failed"
                ? styles.failureFeedback
                : ""
            }`}
          >
            {feedbackDisplay}
          </p>
        )}

        {/* Petting animation - separate from p tag */}
        {gameState === "petting" && (
          <div
            className={styles.pettingTextContainer}
            style={{
              opacity: 1,
              animation: "textPulse 2s ease-in-out infinite",
            }}
          >
            {Array.from("Petting...zzZZZzz").map((char, index) => (
              <span
                key={index}
                className={styles.pettingLetter}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </div>
        )}
      </div>
      {/* Game Interaction Area */}
      <div
        className={styles.gameArea}
        onMouseDown={handlePressStart}
        onMouseUp={() => handlePressEnd()}
        onMouseLeave={() => {
          if (isPetting) handlePressEnd();
        }}
        onTouchStart={handlePressStart}
        onTouchEnd={() => handlePressEnd()}
        onTouchCancel={() => {
          if (isPetting) handlePressEnd();
        }}
        role="button"
        aria-label="Pet the cat scene"
        tabIndex={0}
      >
        {/* Layer 1: Background Scene (User SVG) */}
        <StickerSceneBackground />
        {/* Layer 2: Animated Cat (User SVG) */}
        <div className={styles.stickerCatContainer}>
          <CatDisplay catState={catState} />
        </div>
        {/* Layer 3: Petting Pulse Indicator */}
        {isPetting && <div className={styles.pettingIndicator} />}
      </div>
      {/* Action Area (Button or Hint) */}
      <div className={styles.actionArea}>
        {gameState === "result" || gameState === "failed" ? (
          <p className={styles.idleHint}>
            Press & Hold Calico Cat to Try Again
          </p>
        ) : (
          <p className={styles.idleHint}>
            {isPetting ? "Release Gently..." : "Press & Hold Calico Cat"}
          </p>
        )}
      </div>
      {/* Score Footer Area */}
      {renderScoreFooter()}
    </div>
  );
};

export default PurrfectTiming;
