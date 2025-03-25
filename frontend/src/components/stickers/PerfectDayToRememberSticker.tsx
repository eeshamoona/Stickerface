import { useEffect, useState } from "react";
import Image from "next/image";
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
  const [gameState, setGameState] = useState<
    "waiting" | "showing" | "userTurn" | "success" | "failed"
  >("waiting");
  const [countdownProgress, setCountdownProgress] = useState(100);
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
    setCountdownProgress(100);

    // Start countdown animation
    const totalTime = 3000; // 3 seconds
    const interval = 50; // Update every 50ms
    const steps = totalTime / interval;
    const decrementPerStep = 100 / steps;

    const countdownInterval = setInterval(() => {
      setCountdownProgress((prev) => {
        const newValue = prev - decrementPerStep;
        return newValue > 0 ? newValue : 0;
      });
    }, interval);

    // After showing the sequence for a few seconds, switch to user turn
    setTimeout(() => {
      clearInterval(countdownInterval);
      setGameState("userTurn");
    }, totalTime);
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
          "Hey, I'd still hang out with you if we did that!",
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
        "You got it! That really was a perfect day!",
        "Whoa! You remembered everything!",
        "Yes! That's exactly how I imagined it!",
      ];
      const newScore = Math.max(highScore, sequence.length);
      setHighScore(newScore);
      localStorage.setItem(`highScore-${character.slug}`, newScore.toString());
      setFeedback({
        message:
          successMessages[Math.floor(Math.random() * successMessages.length)],
        success: true,
      });
      setGameState("success");
      // Automatically start next round after a short delay when successful
      setTimeout(() => {
        setRound((r) => r + 1);
        setGameState("waiting");
      }, 2000);
    }
  };

  // Helper function to get activity by ID
  const getActivityById = (id: string) => {
    return character.activities.find((activity) => activity.id === id);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 text-black"
      style={{ backgroundColor: character.bgColor }}
    >
      <div className="text-3xl font-semibold mb-3 tracking-tight">
        A Perfect Day to Remember
      </div>

      {/* Current Score Display */}
      <div className="w-full mb-0 flex items-center justify-evenly gap-10">
        <div className="flex items-center space-x-2">
          <span className="text-md font-light text-gray-800">Round</span>
          <span className="text-md text-gray-800">{round}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-md font-light text-gray-800">High Score</span>
          <span className="text-md text-gray-800">{highScore}</span>
        </div>
      </div>

      <div
        className="w-full max-w-md rounded-2xl p-8 shadow-md bg-white text-center text-black"
        style={{
          fontFamily:
            '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
        }}
      >
        {/* Feedback message */}
        {(gameState === "success" || gameState === "failed") && feedback && (
          <div className="text-lg font-medium mb-4">
            {feedback.message}
            <div className="text-sm mt-2">
              {feedback.success
                ? "Wait… actually—I just thought of an even better one!"
                : "Wanna try again? I've got another perfect one!"}
            </div>
          </div>
        )}

        {/* Intro message */}
        {gameState === "waiting" && (
          <div className="text-base italic mb-4">
            &quot;Here&apos;s what I&apos;d do on my perfect day... can you remember it?&quot;
          </div>
        )}

        {/* Sequence display */}
        {gameState === "showing" && (
          <div className="mb-6">
            <div className="text-base font-medium mb-3">
              Remember this sequence:
            </div>
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              {sequence.map((id, index) => {
                const activity = getActivityById(id);
                return (
                  <div
                    key={`${id}-${index}`}
                    className="p-2 bg-blue-50 rounded-lg"
                  >
                    <Image
                      src={activity?.svg || ""}
                      alt={activity?.label || ""}
                      width={48}
                      height={48}
                      className="w-12 h-12"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* User selection options */}
        {gameState === "userTurn" && (
          <div className="mb-6">
            <div className="text-base font-medium mb-3">
              Now repeat the sequence:
            </div>
            <div className="flex flex-wrap justify-center gap-2 mb-3">
              {userInput.map((id, index) => {
                const activity = getActivityById(id);
                return (
                  <div
                    key={`input-${index}`}
                    className="p-2 bg-green-50 rounded-lg"
                  >
                    <Image
                      src={activity?.svg || ""}
                      alt={activity?.label || ""}
                      width={40}
                      height={40}
                      className="w-10 h-10"
                    />
                  </div>
                );
              })}
              {Array(sequence.length - userInput.length)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="p-2 bg-gray-100 rounded-lg"
                  >
                    <div className="w-10 h-10 flex items-center justify-center text-gray-400">
                      ?
                    </div>
                  </div>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {character.activities.map((activity) => (
                <button
                  key={activity.id}
                  onClick={() => handleUserTap(activity.id)}
                  className="p-4 rounded-xl transition-all bg-gray-50 hover:bg-gray-100 shadow-sm"
                  disabled={gameState !== "userTurn"}
                >
                  <Image
                    src={activity.svg}
                    alt={activity.label}
                    width={64}
                    height={64}
                    className="w-16 h-16 mx-auto mb-2"
                  />
                  <div className="text-sm font-medium text-gray-800">
                    {activity.label}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="text-sm font-medium text-gray-700 opacity-0">
            {/* Hidden element to maintain layout balance */}
            Placeholder
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
              className="px-5 py-2.5 bg-amber-500 text-white rounded-full font-medium flex items-center relative overflow-hidden"
              style={{ boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)" }}
            >
              {/* Progress bar overlay */}
              <div
                className="absolute top-0 left-0 h-full bg-orange-500 transition-all duration-100 ease-linear"
                style={{
                  width: `${100 - countdownProgress}%`,
                  transition: "width 50ms linear",
                }}
              ></div>

              {/* Content (always visible above the progress bar) */}
              <div className="flex items-center z-10 relative">
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
                Memorize
              </div>
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
      <div className="flex-col items-left justify-left w-full">
        <Image
          src={character.imageSrc}
          alt={character.name}
          width={80}
          height={80}
          className="w-20 h-20 mr-3"
        />
        {/* <div className="text-gray-800 font-medium text-left">
          {character.name}
        </div> */}
      </div>
    </div>
  );
}
