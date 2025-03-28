import Image from "next/image";
import { useEffect, useRef, useState } from "react";
// Import content from the new file
import {
  getRandomTemplateMessage,
  milestoneMessages,
  uniqueMessages,
} from "@/lib/do-not-push-button";

// Define image paths (keep these here or move to constants file)
const DoNotPushDown = "/images/DoNotPush-Down.svg";
const DoNotPushFull = "/images/DoNotPush-Full.svg";
const DoNotPushMidway = "/images/DoNotPush-Midway.svg";

// Define sound paths
const CLICK_SOUND = "/sounds/mouse-click.mp3";
const POP_SOUND = "/sounds/bubble-pop.mp3"; // Keep pop for jump

// --- Removed old message constants and lists (they are in buttonContent.ts now) ---

function pickRandom<T>(array: T[]): T {
  // Keep this utility function here or move to a general utils file
  return array[Math.floor(Math.random() * array.length)];
}

// Improved message generation logic
// Revised message generation logic
function getButtonMessage(count: number, previousMessages: string[]): string {
  // 1. Check for specific milestones first (no change)
  if (milestoneMessages[count]) {
    return milestoneMessages[count];
  }

  // 2. Decide between Unique Message or Template (if unique are available)
  const recentMessages = previousMessages.slice(-15); // Check against a slightly larger history
  const availableUniqueMessages = uniqueMessages.filter(
    (msg) => !recentMessages.includes(msg)
  );

  const useTemplateInsteadOfUnique = Math.random() >= 0.65; // ~35% chance to favour template

  if (availableUniqueMessages.length > 0 && !useTemplateInsteadOfUnique) {
    // ~65% chance to use an available unique message
    return pickRandom(availableUniqueMessages);
  }

  // 3. If we didn't return a unique message (either by choice or availability), try a template
  try {
    // Attempt to generate a message using the template system
    const templateMessage = getRandomTemplateMessage();
    // Basic check to prevent repeating the very last message if it was also a template
    if (templateMessage !== previousMessages[previousMessages.length - 1]) {
      return templateMessage;
    }
    // If it's the same as the last, fall through to other options
  } catch (e) {
    console.error("Error generating template message:", e);
    // If template generation fails, fall through to unique message fallback
  }

  // 4. Fallback: If template failed or was skipped/repeated, try any unique message
  if (uniqueMessages.length > 0) {
    // Prefer available ones if possible, otherwise pick any unique one
    const fallbackPool =
      availableUniqueMessages.length > 0
        ? availableUniqueMessages
        : uniqueMessages;
    return pickRandom(fallbackPool);
  }

  // 5. Absolute Fallback: If all else fails (no unique messages defined)
  return "You pressed the button. Congratulations, I guess.";
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

  useEffect(() => {
    const storedCount = localStorage.getItem("pressCount");
    if (storedCount) {
      const count = Number(storedCount);
      setPressCount(count);
      // Set an initial message based on stored count if needed, or keep default
      if (count > 0) {
        const initialMsg = getButtonMessage(count, []); // Get a message for the loaded count
        setMessage(initialMsg);
        setMessageHistory([initialMsg]);
      }
    }

    // Initialize audio elements
    clickSoundRef.current = new Audio(CLICK_SOUND);
    popSoundRef.current = new Audio(POP_SOUND);

    // Set volume
    if (clickSoundRef.current) clickSoundRef.current.volume = 0.4; // Slightly lower volume
    if (popSoundRef.current) popSoundRef.current.volume = 0.6; // Keep pop slightly louder
  }, []); // Empty dependency array ensures this runs only once on mount

  const playSound = (
    audioRef: React.MutableRefObject<HTMLAudioElement | null>
  ) => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) => {
        // Avoid console noise in production for common browser interrupt errors
        if (err.name !== "AbortError") {
          console.error("Error playing sound:", err);
        }
      });
    }
  };

  const handlePress = () => {
    // Prevent interaction if already animating shake/jump/wobble
    if (isShaking || isJumping || isWobbling) return;

    // Button press visual feedback
    setIsPressed("midway"); // Start press immediately
    setTimeout(() => setIsPressed("down"), 75); // Quicker down state
    setTimeout(() => setIsPressed("full"), 200); // Quicker return

    // Increment count and update state/storage
    const newCount = pressCount + 1;
    localStorage.setItem("pressCount", newCount.toString());
    setPressCount(newCount);

    // Get and set message
    const newMessage = getButtonMessage(newCount, messageHistory);
    setMessage(newMessage);
    // Update message history (keep it reasonably sized)
    setMessageHistory((prev) => [...prev, newMessage].slice(-50)); // Keep last 50 messages

    // Play click sound
    playSound(clickSoundRef);

    // --- Chaos effects: Reduced Frequency ---
    const randomEffect = Math.random();

    // Lower chance for effects
    const SHAKE_CHANCE = 0.08; // 8% chance to shake
    const JUMP_CHANCE = 0.04; // 4% chance to jump 
    const WOBBLE_CHANCE = 0.04; // 4% chance to wobble (total 16% chance for any effect)

    if (randomEffect < SHAKE_CHANCE) {
      // Shake effect
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500); // Duration of shake CSS animation
    } else if (randomEffect < SHAKE_CHANCE + JUMP_CHANCE) {
      // Jump effect
      setIsJumping(true);
      setTimeout(() => {
        setIsJumping(false);
        // Play pop sound *after* jump animation seems appropriate, e.g., near the end/impact
      }, 1100); // Slightly before animation ends
      setTimeout(() => playSound(popSoundRef), 900); // Play pop sound during the fall/impact part
    } else if (randomEffect < SHAKE_CHANCE + JUMP_CHANCE + WOBBLE_CHANCE) {
      // Wobble effect
      setIsWobbling(true);
      setTimeout(() => setIsWobbling(false), 1000); // Duration of wobble animation
      playSound(clickSoundRef); // Play click sound during the wobble
    }
    // Most clicks (84%) will have no extra effect now
  };

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
    // Added min-h-screen for better behavior on different screen sizes
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-center p-4 overflow-hidden">
      {/* CSS Animations remain the same */}
      <style jsx>{`
        @keyframes shake {
          0% {
            transform: translate(1px, 1px) rotate(0deg);
          }
          10% {
            transform: translate(-1px, -2px) rotate(-1deg);
          }
          20% {
            transform: translate(-3px, 0px) rotate(1deg);
          }
          30% {
            transform: translate(3px, 2px) rotate(0deg);
          }
          40% {
            transform: translate(1px, -1px) rotate(1deg);
          }
          50% {
            transform: translate(-1px, 2px) rotate(-1deg);
          }
          60% {
            transform: translate(-3px, 1px) rotate(0deg);
          }
          70% {
            transform: translate(3px, 1px) rotate(-1deg);
          }
          80% {
            transform: translate(-1px, -1px) rotate(1deg);
          }
          90% {
            transform: translate(1px, 2px) rotate(0deg);
          }
          100% {
            transform: translate(1px, -2px) rotate(-1deg);
          }
        }

        @keyframes jump {
          0%,
          100% {
            transform: translateY(0) scale(1, 1);
          }
          10% {
            transform: translateY(5px) scale(1.1, 0.9);
          } /* Anticipation squash */
          30% {
            transform: translateY(-90px) scale(0.9, 1.1);
          } /* Take off stretch */
          50% {
            transform: translateY(-120px) scale(1, 1);
          } /* Apex */
          70% {
            transform: translateY(-90px) scale(0.95, 1.05);
          } /* Falling stretch */
          90% {
            transform: translateY(0) scale(1.2, 0.8);
          } /* Landing squash */
          95% {
            transform: translateY(-4px) scale(0.98, 1.02);
          } /* Bounce */
        }

        .shake {
          animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }

        @keyframes wobble {
          0%, 100% {
            transform: translateX(0%) rotate(0deg);
            transform-origin: 50% 50%;
          }
          15% {
            transform: translateX(-25px) rotate(-8deg);
          }
          30% {
            transform: translateX(20px) rotate(6deg);
          }
          45% {
            transform: translateX(-15px) rotate(-4deg);
          }
          60% {
            transform: translateX(10px) rotate(2deg);
          }
          75% {
            transform: translateX(-5px) rotate(-1deg);
          }
        }

        .jump {
          animation: jump 1.2s ease-in-out;
          transform-origin: center bottom;
        }

        .wobble {
          animation: wobble 1s ease-in-out;
          transform-origin: center center;
        }
      `}</style>

      {/* Container for Button + Message Area */}
      {/* Adjusted height/spacing for better layout */}
      <div
        className="flex flex-col items-center justify-start pt-10"
        style={{ height: "calc(100vh - 100px)" }}
      >
        {/* Button container with space for jump */}
        <div className="relative h-[400px] flex items-end justify-center">
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

        {/* Counter (Optional but nice) */}
        <div className="absolute bottom-4 right-4 text-sm text-red-400">
          Presses: {pressCount}
        </div>
      </div>
    </div>
  );
}
