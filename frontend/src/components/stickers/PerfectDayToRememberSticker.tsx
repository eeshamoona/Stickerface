import { useEffect, useState } from "react";
import { CharacterConfig } from "../../lib/data";

// Props: characterSlug (string), characterData (object containing name, bgColor, avatarSVG, activityList [{ id, label, svg }])
export default function PerfectDayToRememberSticker({
  character,
}: {
  character: CharacterConfig;
}) {
  const [sequence, setSequence] = useState<string[]>([]);
  const [userInput, setUserInput] = useState<string[]>([]);
  const [round, setRound] = useState(1);
  const [feedback, setFeedback] = useState<{
    message: string;
    success: boolean;
  } | null>(null);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [gameState, setGameState] = useState<
    "waiting" | "showing" | "userTurn" | "failed"
  >("waiting");
  const [highScore, setHighScore] = useState(0);

  // Pull high score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`highScore-${character.slug}`);
    if (saved) setHighScore(parseInt(saved));
  }, [character.slug]);

  // Start new round
  useEffect(() => {
    const newSequence = Array.from({ length: round }, () => {
      return character.activities[
        Math.floor(Math.random() * character.activities.length)
      ].id;
    });
    setSequence(newSequence);
    setUserInput([]);
    setFeedback(null);
    setGameState("waiting");
  }, [round, character.activities]);

  // Function to show the sequence to the user
  const showSequence = () => {
    if (gameState !== "waiting") return;

    setGameState("showing");
    setIsShowingSequence(true);
    let currentIndex = 0;

    const intervalId = setInterval(() => {
      if (currentIndex < sequence.length) {
        setActiveIndex(currentIndex);

        // Clear highlight after a short delay
        setTimeout(() => {
          setActiveIndex(null);
        }, 500);

        currentIndex++;
      } else {
        clearInterval(intervalId);
        setIsShowingSequence(false);
        setGameState("userTurn");
      }
    }, 1000);
  };

  const handleUserTap = (id: string) => {
    // Don't allow input while showing sequence
    if (gameState !== "userTurn") return;
    const nextInput = [...userInput, id];
    setUserInput(nextInput);

    // Check as they go
    for (let i = 0; i < nextInput.length; i++) {
      if (nextInput[i] !== sequence[i]) {
        // Fail
        const failMessages = [
          "Oops, not quite! But that still sounds fun!",
          "Haha, close enough for a pretty good day!",
          "Hey, I’d still hang out with you if we did that!",
        ];
        setFeedback({
          message:
            failMessages[Math.floor(Math.random() * failMessages.length)],
          success: false,
        });
        // Don't reset the round immediately, let user decide when to try again
        setGameState("failed");
        return;
      }
    }

    // If complete and correct
    if (nextInput.length === sequence.length) {
      const successMessages = [
        "You got it!! That really was a perfect day!",
        "Whoa!! You remembered everything!",
        "Yes!! That’s exactly how I imagined it!",
      ];
      const newScore = Math.max(highScore, sequence.length);
      setHighScore(newScore);
      localStorage.setItem(`highScore-${character.slug}`, newScore.toString());
      setFeedback({
        message:
          successMessages[Math.floor(Math.random() * successMessages.length)],
        success: true,
      });
      // Automatically start next round after a short delay when successful
      setTimeout(() => {
        setRound((r) => r + 1);
        setGameState("waiting");
      }, 1500);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ backgroundColor: character.bgColor }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8 shadow-md bg-white text-center text-black"
        style={{
          fontFamily:
            '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
        }}
      >
        <div className="text-3xl font-semibold mb-3 tracking-tight">
          A Perfect Day to Remember
        </div>

        <div className="flex items-center justify-center mb-5">
          <img
            src={character.imageSrc}
            alt={character.name}
            className="w-20 h-20 mr-3"
          />
          <div className="text-gray-800 font-medium text-left">
            {character.name} says:
          </div>
        </div>

        {feedback ? (
          <div className="text-lg font-medium mb-4">
            {feedback.message}
            <div className="text-sm mt-2">
              {feedback.success
                ? "Wait… actually—I just thought of an even better one!"
                : "Wanna try again? I’ve got another perfect one!"}
            </div>
          </div>
        ) : (
          <div className="text-base italic mb-4">
            "Here’s what I’d do on my perfect day... can you remember it?"
          </div>
        )}

        <div className="grid grid-cols-2 gap-5 mb-8">
          {character.activities.map((activity) => (
            <button
              key={activity.id}
              onClick={() => handleUserTap(activity.id)}
              className={`p-4 rounded-xl transition-all ${
                activeIndex !== null && sequence[activeIndex] === activity.id
                  ? "bg-blue-50 ring-2 ring-blue-400 transform scale-105"
                  : "bg-gray-50 hover:bg-gray-100 shadow-sm"
              }`}
              disabled={isShowingSequence}
              style={{
                transition: "all 0.2s ease-in-out",
                boxShadow:
                  activeIndex !== null && sequence[activeIndex] === activity.id
                    ? "0 0 15px rgba(59, 130, 246, 0.3)"
                    : "",
              }}
            >
              <img
                src={activity.svg}
                alt={activity.label}
                className="w-20 h-20 mx-auto mb-2"
              />
              <div className="text-sm font-medium text-gray-800">
                {activity.label}
              </div>
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm font-medium text-gray-700">
            <span className="text-xs uppercase tracking-wide text-gray-500">
              High Score:
            </span>{" "}
            {highScore}
          </div>

          {gameState === "waiting" && (
            <button
              onClick={showSequence}
              className="px-5 py-2.5 bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-medium"
              style={{ boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)" }}
            >
              Play
            </button>
          )}

          {gameState === "showing" && (
            <div
              className="px-5 py-2.5 bg-amber-500 text-white rounded-full font-medium flex items-center"
              style={{ boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
              Watch carefully
            </div>
          )}

          {gameState === "userTurn" && (
            <div
              className="px-5 py-2.5 bg-green-500 text-white rounded-full font-medium flex items-center"
              style={{ boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              {userInput.length}/{sequence.length}
            </div>
          )}

          {gameState === "failed" && (
            <button
              onClick={() => {
                setRound(1); // Reset to round 1 when failed
                setGameState("waiting");
              }}
              className="px-5 py-2.5 bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-medium flex items-center"
              style={{ boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
