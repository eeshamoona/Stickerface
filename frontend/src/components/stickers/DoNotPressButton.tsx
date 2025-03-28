import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react"; // Added useCallback
// Import EVERYTHING from the content file now
import * as ButtonContent from "@/lib/do-not-push-button";
// Import animations
import { animations, buttonKeyframes } from "@/lib/animations";

// Define image paths (as before)
const DoNotPushDown = "/images/DoNotPush-Down.svg";
const DoNotPushFull = "/images/DoNotPush-Full.svg";
const DoNotPushMidway = "/images/DoNotPush-Midway.svg";

// Define sound paths (as before)
const CLICK_SOUND = "/sounds/mouse-click.mp3";
const POP_SOUND = "/sounds/bubble-pop.mp3";

// --- Configuration ---
const MESSAGE_HISTORY_LENGTH = 50; // How many past messages to check against for unique static messages
const RECENT_PROCEDURAL_HISTORY_LENGTH = 5; // How many past messages to check against for procedural repeats
const MAX_MESSAGES_TO_KEEP = 100; // Limit overall history size in state

// --- Message Generation Logic ---
// This function now orchestrates calls to ButtonContent
function getButtonMessage(count: number, fullMessageHistory: string[]): string {
  // 1. Check for specific milestones first
  if (ButtonContent.milestoneMessages[count]) {
    return ButtonContent.milestoneMessages[count];
  }

  // 2. Try to find a truly unique static message (checking recent history)
  const recentStaticCheckHistory = fullMessageHistory.slice(
    -MESSAGE_HISTORY_LENGTH
  );
  const availableUniqueMessages = ButtonContent.uniqueMessages.filter(
    (msg) => !recentStaticCheckHistory.includes(msg)
  );

  // Give static unique messages a higher chance if available
  const preferStaticUnique = Math.random() < 0.7; // 70% chance to use static if available

  if (availableUniqueMessages.length > 0 && preferStaticUnique) {
    // Pick a random one from the available *static* unique messages
    const randomIndex = Math.floor(
      Math.random() * availableUniqueMessages.length
    );
    return availableUniqueMessages[randomIndex];
  }

  // 3. Generate a procedural message
  let proceduralMessage: string;
  let attempts = 0;
  const maxAttempts = 10; // Prevent infinite loops if generation is stuck
  const recentProceduralCheckHistory = fullMessageHistory.slice(
    -RECENT_PROCEDURAL_HISTORY_LENGTH
  );

  // Try generating a procedural message that hasn't been seen very recently
  do {
    proceduralMessage = ButtonContent.generateProceduralMessage(count);
    attempts++;
  } while (
    recentProceduralCheckHistory.includes(proceduralMessage) &&
    attempts < maxAttempts
  );

  // If we couldn't find a novel procedural message after attempts, just use the last one generated
  // Or, optionally, fall back to a static unique message again if any exist at all
  if (attempts === maxAttempts && ButtonContent.uniqueMessages.length > 0) {
    const fallbackUnique = ButtonContent.uniqueMessages.filter(
      (msg) => !fullMessageHistory.slice(-1).includes(msg) // Avoid immediate repeat
    );
    if (fallbackUnique.length > 0) {
      const randomIndex = Math.floor(Math.random() * fallbackUnique.length);
      return fallbackUnique[randomIndex];
    }
    // If even THAT fails, return the last procedural one.
  }

  return proceduralMessage;

  // 4. Absolute Fallback (should be rarely needed with good procedural generation)
  // Removed the old simple fallback, relying on the robust procedural generation.
  // If generateProceduralMessage could potentially fail/return empty, add a final static fallback here:
  // return "Button pressed.";
}

export default function DoNotPressButton() {
  const [pressCount, setPressCount] = useState(0);
  const [message, setMessage] = useState("Do. Not. Press."); // Initial message
  const [isPressed, setIsPressed] = useState<"full" | "midway" | "down">(
    "full"
  );
  const [isShaking, setIsShaking] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [isWobbling, setIsWobbling] = useState(false);
  const [messageHistory, setMessageHistory] = useState<string[]>([]); // Track history for better unique message selection

  const clickSoundRef = useRef<HTMLAudioElement>(null);
  const popSoundRef = useRef<HTMLAudioElement>(null);
  const [showPressCount, setShowPressCount] = useState(false);

  // --- Effects Initialization (useEffect) ---
  useEffect(() => {
    // Load count from local storage
    const storedCount = localStorage.getItem("pressCount");
    let initialCount = 0;
    if (storedCount) {
      initialCount = Number(storedCount);
      setPressCount(initialCount);
    }

    // Set initial message (avoiding call if count is 0)
    if (initialCount > 0) {
      // Pass an empty history initially, or fetch stored history if you implement that
      const initialMsg = getButtonMessage(initialCount, []);
      setMessage(initialMsg);
      setMessageHistory([initialMsg]); // Start history
    } else {
      setMessage("Do. Not. Press."); // Ensure default message for count 0
      setMessageHistory(["Do. Not. Press."]); // Initialize history
    }

    // Initialize audio elements
    clickSoundRef.current = new Audio(CLICK_SOUND);
    popSoundRef.current = new Audio(POP_SOUND);
    if (clickSoundRef.current) clickSoundRef.current.volume = 0.4;
    if (popSoundRef.current) popSoundRef.current.volume = 0.6;
  }, []); // Runs only on mount

  // --- Sound Playback ---
  const playSound = useCallback(
    (audioRef: React.MutableRefObject<HTMLAudioElement | null>) => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((err) => {
          if (err.name !== "AbortError") {
            console.error("Error playing sound:", err);
          }
        });
      }
    },
    []
  );

  // --- Button Press Handler ---
  const handlePress = useCallback(() => {
    if (isShaking || isJumping || isWobbling) return;

    // Visual feedback
    setIsPressed("midway");
    setTimeout(() => setIsPressed("down"), 75);
    setTimeout(() => setIsPressed("full"), 200);

    // Update count
    const newCount = pressCount + 1;
    localStorage.setItem("pressCount", newCount.toString());
    setPressCount(newCount);

    // Get and set message, update history
    const newMessage = getButtonMessage(newCount, messageHistory);
    setMessage(newMessage);
    setMessageHistory((prev) =>
      [...prev, newMessage].slice(-MAX_MESSAGES_TO_KEEP)
    );

    // Play sound
    playSound(clickSoundRef);

    // Chaos effects (Reduced Frequency - logic remains similar)
    const randomEffect = Math.random();
    const SHAKE_CHANCE = 0.08;
    const JUMP_CHANCE = 0.04;
    const WOBBLE_CHANCE = 0.04;

    if (randomEffect < SHAKE_CHANCE) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    } else if (randomEffect < SHAKE_CHANCE + JUMP_CHANCE) {
      setIsJumping(true);
      setTimeout(() => setIsJumping(false), 1100);
      setTimeout(() => playSound(popSoundRef), 900);
    } else if (randomEffect < SHAKE_CHANCE + JUMP_CHANCE + WOBBLE_CHANCE) {
      setIsWobbling(true);
      setTimeout(() => setIsWobbling(false), 1000);
      // Maybe play a different sound for wobble or none? Adjust as needed.
      // playSound(clickSoundRef); // Playing click again might be too much here
    }
  }, [
    pressCount,
    messageHistory,
    isShaking,
    isJumping,
    isWobbling,
    playSound,
    popSoundRef,
  ]); // Include all dependencies

  // renderButtonImage remains the same, assuming images are correct
  const renderButtonImage = () => {
    let src = DoNotPushFull;
    let alt = "Do Not Push Button - Default";
    if (isPressed === "down") {
      src = DoNotPushDown;
      alt = "Do Not Push Button - Pressed Down";
    } else if (isPressed === "midway") {
      src = DoNotPushMidway;
      alt = "Do Not Push Button - Midway";
    }

    return (
      <Image
        src={src}
        alt={alt}
        width={400} // Slightly smaller maybe? Adjust as needed
        height={400}
        className="w-72 h-72 md:w-80 md:h-80" // Responsive size example
        priority // Prioritize loading the button image
      />
    );
  };

  return (
    // Use h-full instead of h-screen to adapt to parent container
    <div className="h-full w-full flex flex-col items-center justify-center bg-red-50 text-center overflow-hidden">
      {/* CSS Animations remain the same */}
      <style jsx>{`
        ${buttonKeyframes}

        .shake {
          animation: ${animations.shake.animation};
        }

        .jump {
          animation: ${animations.jump.animation};
          transform-origin: ${animations.jump.transformOrigin};
        }

        .wobble {
          animation: ${animations.wobble.animation};
          transform-origin: ${animations.wobble.transformOrigin};
        }
      `}</style>

      {/* Container for Button + Message Area - using flex layout */}
      <div className="flex flex-col items-center justify-center w-full h-full">

        {/* Button container with space for jump - using relative positioning */}
        <div className="relative flex items-end justify-center" style={{ height: "min(300px, 40vh)" }}>
          <div
            className={`transform transition-transform duration-100 ease-out ${
              isShaking ? "shake" : ""
            } ${isJumping ? "jump" : ""} ${isWobbling ? "wobble" : ""}`}
            style={{ willChange: "transform" }} // Performance hint for animations
          >
            {/* Make the clickable area slightly larger/easier to hit */}
            <div
              onClick={handlePress}
              className="cursor-pointer p-2 rounded-full" // Add padding around image for easier clicks
              role="button"
              aria-pressed={isPressed !== "full"}
              aria-label="Do Not Press Button"
              tabIndex={0} // Make it focusable
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handlePress();
              }} // Allow keyboard interaction
            >
              {renderButtonImage()}
            </div>
          </div>
        </div>

        {/* Message Area */}
        <div className="h-24 flex items-center justify-center mt-4 px-4">
          <p className="text-xl md:text-2xl max-w-md text-red-800 font-semibold leading-tight">
            {" "}
            {/* Slightly larger text, adjusted line height */}
            {message}
          </p>
        </div>

        {/* Hidden counter that shows on secret click */}
        {showPressCount ? (
          <div
            className="absolute bottom-4 right-4 text-sm text-red-400 transition-opacity duration-500"
            style={{ opacity: showPressCount ? 1 : 0 }}
          >
            Presses: {pressCount}
          </div>
        ) : (
          <button
            onClick={() => {
              setShowPressCount(true);
              setTimeout(() => setShowPressCount(false), 3000);
            }}
            className="absolute bottom-4 right-4 w-8 h-8 cursor-default focus:outline-none"
            style={{ background: "transparent" }}
            aria-label="Show press count"
          />
        )}
      </div>
    </div>
  );
}
