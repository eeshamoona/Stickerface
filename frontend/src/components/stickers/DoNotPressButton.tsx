import { useEffect, useState, useRef } from "react";

// Define image paths for the button states
const DoNotPushDown = "/images/DoNotPush-Down.svg";
const DoNotPushFull = "/images/DoNotPush-Full.svg";
const DoNotPushMidway = "/images/DoNotPush-Midway.svg";

// Define sound paths
const CLICK_SOUND = "/sounds/mouse-click.mp3";
const POP_SOUND = "/sounds/bubble-pop.mp3";

const milestoneMessages: Record<number, string> = {
  1: "Seriously. Don’t press it again.",
  5: "That’s five presses. You’ve got commitment issues.",
  10: "The council has been notified.",
  25: "You have now reached level: Button Gremlin.",
  50: "Button status: mildly traumatized.",
  100: "You’ve pressed it 100 times. Are you okay?",
};

const templates = [
  "You've now pressed the button [number] times. That's [adjective].",
  "That press just [verb] [noun].",
  "In a parallel universe, that press caused [weirdEvent].",
  "Press #[number]: [reaction]",
  "The button is now [status].",
  "Button status: [status] after [verb] [noun].",
  "After [number] presses, the button feels [adjective].",
  "That last press? It [verb] [noun]. Again.",
  "You've angered the [noun]. Good job.",
];

const adjectives = [
  "chaotically bold",
  "deeply concerning",
  "heroically dumb",
  "mildly cursed",
  "cosmically unwise",
  "ferociously petty",
  "alarmingly consistent",
];

const verbs = [
  "summoned",
  "cursed",
  "annoyed",
  "bewitched",
  "confused",
  "startled",
  "befriended",
  "alerted",
  "woke up",
];

const nouns = [
  "a sleep-deprived wizard",
  "the ghost of bad decisions",
  "a feral raccoon",
  "a sentient waffle",
  "your 3rd grade math teacher",
  "a grumpy AI",
  "an interdimensional goose",
];

const weirdEvents = [
  "the moon to hiccup",
  "the clouds to blush",
  "a cow to tweet",
  "your phone to judge you silently",
  "all spoons to vibrate in sync",
  "a toaster to feel jealousy",
];

const reactions = [
  "It felt that one. Rude.",
  "Still not broken. Disappointed.",
  "You win nothing.",
  "Try harder. Or don't.",
  "What do you expect to happen?",
  "That's not how any of this works.",
  "Nice try, chaos gremlin.",
];

const statuses = [
  "self-aware",
  "melting",
  "emotionally unavailable",
  "on strike",
  "plotting something",
  "done with your nonsense",
  "tired of being perceived",
];

function shuffle<T>(array: T[]): T[] {
  return array.sort(() => 0.5 - Math.random());
}

function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function fillTemplate(template: string, data: Record<string, string | number>) {
  return template.replace(/\[(\w+)]/g, (_, key) => String(data[key] ?? ""));
}

function getButtonMessage(count: number): string {
  if (milestoneMessages[count]) {
    return milestoneMessages[count];
  }
  const template = pickRandom(templates);
  return fillTemplate(template, {
    number: count,
    adjective: pickRandom(adjectives),
    verb: pickRandom(verbs),
    noun: pickRandom(nouns),
    weirdEvent: pickRandom(weirdEvents),
    reaction: pickRandom(reactions),
    status: pickRandom(statuses),
  });
}

export default function DoNotPressButton() {
  const [pressCount, setPressCount] = useState(0);
  const [message, setMessage] = useState("...");
  const [isPressed, setIsPressed] = useState<"full" | "midway" | "down">(
    "full"
  );
  const [isShaking, setIsShaking] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  
  // Audio refs
  const clickSoundRef = useRef<HTMLAudioElement>(null);
  const popSoundRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const storedCount = localStorage.getItem("pressCount");
    if (storedCount) setPressCount(Number(storedCount));
    
    // Initialize audio elements
    clickSoundRef.current = new Audio(CLICK_SOUND);
    popSoundRef.current = new Audio(POP_SOUND);
    
    // Set volume
    if (clickSoundRef.current) clickSoundRef.current.volume = 0.5;
    if (popSoundRef.current) popSoundRef.current.volume = 0.5;
  }, []);

  // Function to play a sound
  const playSound = (audioRef: React.MutableRefObject<HTMLAudioElement | null>) => {
    if (audioRef.current) {
      // Reset the audio to start
      audioRef.current.currentTime = 0;
      
      // Play the sound
      audioRef.current.play().catch(err => {
        console.error("Error playing sound:", err);
      });
    }
  };
  
  const handlePress = () => {
    setTimeout(() => setIsPressed("midway"), 50);
    setTimeout(() => setIsPressed("down"), 100);
    setTimeout(() => setIsPressed("full"), 250);

    const newCount = pressCount + 1;
    localStorage.setItem("pressCount", newCount.toString());
    setPressCount(newCount);
    setMessage(getButtonMessage(newCount));
    
    // Play click sound on every button press
    playSound(clickSoundRef);

    // Chaos effects - random chance for different effects
    const randomEffect = Math.random();

    if (randomEffect < 0.4) {
      // Shake effect (40% chance)
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    } else if (randomEffect < 0.6) {
      // Jump effect (20% chance)
      setIsJumping(true);
      setTimeout(() => setIsJumping(false), 1200);
      
      // Play pop sound when the button jumps
      playSound(popSoundRef);
    }
    // No effect (40% chance)
  };

  const renderButtonImage = () => {
    switch (isPressed) {
      case "down":
        return (
          <img
            src={DoNotPushDown}
            alt="Do Not Push Button - Down"
            className="w-80 h-80"
          />
        );
      case "midway":
        return (
          <img
            src={DoNotPushMidway}
            alt="Do Not Push Button - Midway"
            className="w-80 h-80"
          />
        );
      default:
        return (
          <img
            src={DoNotPushFull}
            alt="Do Not Push Button - Full"
            className="w-80 h-80"
          />
        );
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-red-50 text-center p-4">
      <style jsx>{`
        @keyframes shake {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          20% {
            transform: translate(-5px, 0) rotate(-5deg);
          }
          40% {
            transform: translate(5px, 0) rotate(5deg);
          }
          60% {
            transform: translate(-3px, 0) rotate(-3deg);
          }
          80% {
            transform: translate(3px, 0) rotate(3deg);
          }
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
        }

        @keyframes jump {
          /* Anticipation - slight squash before jump */
          0% {
            transform: translateY(0) scaleY(1) scaleX(1);
          }
          10% {
            transform: translateY(5px) scaleY(0.9) scaleX(1.1);
          }

          /* Take off - stretch vertically */
          20% {
            transform: translateY(-20px) scaleY(1.1) scaleX(0.9);
          }

          /* Upward movement */
          30% {
            transform: translateY(-60px) scaleY(1) scaleX(1);
          }
          40% {
            transform: translateY(-100px) scaleY(1) scaleX(1);
          }

          /* At the peak - slight stretch horizontally */
          50% {
            transform: translateY(-120px) scaleY(0.95) scaleX(1.05);
          }

          /* Falling - stretch vertically */
          65% {
            transform: translateY(-50px) scaleY(1.05) scaleX(0.95);
          }

          /* Impact - squash */
          80% {
            transform: translateY(0) scaleY(0.85) scaleX(1.15);
          }

          /* Rebound - slight bounce */
          87% {
            transform: translateY(-6px) scaleY(1.015) scaleX(0.985);
          }
          92% {
            transform: translateY(0) scaleY(0.99) scaleX(1.01);
          }
          97% {
            transform: translateY(-0.4px) scaleY(1.0025) scaleX(0.9975);
          }

          /* Rest */
          100% {
            transform: translateY(0) scaleY(1) scaleX(1);
          }
        }

        .shake {
          animation: shake 0.5s ease-in-out;
        }

        .jump {
          animation: jump 1.2s ease-in-out;
          transform-origin: center bottom;
        }
      `}</style>

      <div className="flex flex-col items-center h-[500px]">
        <div
          className={`relative ${isShaking ? "shake" : ""} ${
            isJumping ? "jump" : ""
          }`}
        >
          <div onClick={handlePress} className="cursor-pointer">
            {renderButtonImage()}
          </div>
        </div>

        <div className="h-20 flex items-center justify-center">
          <p className="text-xl max-w-xs text-red-800 font-bold">{message}</p>
        </div>
      </div>
    </div>
  );
}
