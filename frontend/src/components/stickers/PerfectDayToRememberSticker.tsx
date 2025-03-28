import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { CharacterConfig } from "../../lib/data"; // Assuming this path is correct

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
  // --- NEW STATE ---
  // Store the index where the user made a mistake
  const [failureIndex, setFailureIndex] = useState<number | null>(null);

  // --- Constants ---
  const SHOW_SEQUENCE_TIME = 3000;
  const COUNTDOWN_INTERVAL = 50;
  const SUCCESS_DELAY = 2000;

  // --- Effects ---

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem(`highScore-${character.slug}`);
    if (saved) {
      const score = parseInt(saved, 10);
      if (!isNaN(score)) {
        setHighScore(score);
      }
    }
  }, [character.slug]);

  // Generate new sequence
  const generateNewSequence = useCallback(() => {
    const newSequence = Array.from({ length: round }, () => {
      const randomIndex = Math.floor(
        Math.random() * character.activities.length
      );
      return character.activities[randomIndex].id;
    });
    setSequence(newSequence);
    setUserInput([]);
    setFeedback(null);
    setFailureIndex(null); // Reset failure index
    setGameState("waiting");
  }, [round, character.activities]);

  useEffect(() => {
    generateNewSequence();
  }, [round, generateNewSequence]);

  // --- Game Logic ---

  const showSequence = () => {
    if (gameState !== "waiting") return;
    setFailureIndex(null); // Ensure failure index is cleared before showing
    setGameState("showing");
    setCountdownProgress(100);
    const steps = SHOW_SEQUENCE_TIME / COUNTDOWN_INTERVAL;
    const decrementPerStep = 100 / steps;
    const countdownInterval = setInterval(() => {
      setCountdownProgress((prev) => Math.max(0, prev - decrementPerStep));
    }, COUNTDOWN_INTERVAL);
    setTimeout(() => {
      clearInterval(countdownInterval);
      setGameState("userTurn");
    }, SHOW_SEQUENCE_TIME);
  };

  const handleUserTap = (id: string) => {
    if (gameState !== "userTurn") return;

    const currentInputIndex = userInput.length;
    const nextInput = [...userInput, id];
    setUserInput(nextInput);

    // --- Check for incorrect tap ---
    if (id !== sequence[currentInputIndex]) {
      const failMessages = [
        "Not what I had in mind but still a great time!",
        "Not quite! Let's see where things differed.",
        "Almost, but you forgot something!",
      ];
      setFeedback({
        message: failMessages[Math.floor(Math.random() * failMessages.length)],
        success: false,
      });
      setFailureIndex(currentInputIndex); // Record the index of the mistake
      setGameState("failed");
      return;
    }

    // --- Correct tap, check if sequence complete ---
    if (nextInput.length === sequence.length) {
      const successMessages = [
        "You got it! That's my perfect day!",
        "Incredible memory! You nailed it!",
        "Yes! Exactly right!",
      ];
      const newScore = Math.max(highScore, sequence.length);
      setHighScore(newScore);
      try {
        localStorage.setItem(
          `highScore-${character.slug}`,
          newScore.toString()
        );
      } catch (error) {
        console.error("Failed to save high score:", error);
      }
      setFeedback({
        message:
          successMessages[Math.floor(Math.random() * successMessages.length)],
        success: true,
      });
      setGameState("success");
      setTimeout(() => {
        setRound((r) => r + 1);
      }, SUCCESS_DELAY);
    }
    // If correct but not complete, continue...
  };

  const resetGame = () => {
    setRound(1);
    setCountdownProgress(100);
    setGameState("waiting");
    setSequence([]);
    setUserInput([]);
    setFeedback(null);
    setFailureIndex(null);
    generateNewSequence();
  };

  const getActivityById = (id: string) => {
    return character.activities.find((activity) => activity.id === id);
  };

  // --- Render Logic ---

  // Helper function to render sequence items with specific styling
  const renderSequenceItem = (
    id: string | null,
    index: number,
    type:
      | "correct"
      | "user-correct"
      | "user-incorrect"
      | "placeholder"
      | "original"
      | "missed"
  ) => {
    const activity = id ? getActivityById(id) : null;
    let bgColor = "bg-gray-100";
    let ringColor = "ring-gray-200";
    let iconSize = "w-10 h-10"; // Default size
    let opacity = "opacity-100";
    let content: React.ReactNode = (
      <div
        className={`${iconSize} flex items-center justify-center text-gray-400 font-mono text-lg`}
      >
        ?
      </div>
    );

    if (activity) {
      content = (
        <Image
          src={activity.svg || ""}
          alt={activity.label || ""} // Provide alt text
          width={36}
          height={36}
          className={iconSize}
          unoptimized
        />
      );
    }

    switch (type) {
      case "correct": // The correct sequence display
        bgColor = "bg-blue-50";
        ringColor = "ring-blue-200";
        iconSize = "w-12 h-12"; // Slightly larger for emphasis
        if (activity) {
          // Re-render with correct size
          content = (
            <Image
              src={activity.svg}
              alt={activity.label || ""}
              width={40}
              height={40}
              className={iconSize}
              unoptimized
            />
          );
        }
        break;
      case "user-correct": // User's input that matched
        bgColor = "bg-green-50";
        ringColor = "ring-green-300";
        break;
      case "user-incorrect": // The specific item user got wrong
        bgColor = "bg-red-50";
        ringColor = "ring-red-300";
        // Optionally add more emphasis like a thicker ring or icon
        break;
      case "original": // The original sequence display
        bgColor = "bg-blue-50";
        break;
      case "missed": // Correct items the user didn't get to input
        bgColor = "bg-orange-50"; // Indicate these were missed
        ringColor = "ring-orange-200";
        opacity = "opacity-60"; // Dim them slightly
        break;
      case "placeholder": // Placeholders in user turn (before failure)
      default:
        // Use default styles
        break;
    }

    return (
      <div
        key={`${type}-${index}-${id || "empty"}`}
        className={`p-1.5 rounded-lg ring-1 ${ringColor} ${bgColor} ${opacity}`}
        title={
          activity?.label ||
          (type === "placeholder" ? "Waiting for input" : "Incorrect item")
        }
      >
        {content}
      </div>
    );
  };

  return (
    <div
      className="h-full w-full flex flex-col items-center justify-center text-zinc-900 selection:bg-yellow-300"
      style={{ backgroundColor: character.bgColor }}
    >
      {/* Title */}
      {gameState === "waiting" && !feedback && (
        <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-center">
          A Perfect Day to Remember
        </h1>
      )}
      {/* Score Display */}
      <div className="flex flex-row items-center justify-center gap-6 transition-opacity duration-300 ease-in-out">
        {gameState !== "userTurn" && !feedback && (
          <div className="flex items-baseline space-x-1.5">
            <span className="font-medium">Round</span>
            <span className="text-lg font-semibold text-zinc-900">{round}</span>
          </div>
        )}
        <Image
          src={character.imageSrc}
          alt={character.name}
          width={100} // Slightly smaller? Adjust as needed
          height={100}
          priority={gameState === "waiting"} // Only prioritize if visible initially
        />

        {gameState !== "userTurn" && !feedback && (
          <div className="flex items-baseline space-x-1.5">
            <span className="font-medium">High Score</span>
            <span className="text-lg font-semibold text-zinc-900">
              {highScore}
            </span>
          </div>
        )}
      </div>
      {/* Main Game Card */}
      <div
        className="w-full max-w-sm rounded-2xl p-6 md:p-8 bg-white text-center text-zinc-800 overflow-y-auto border ring-gray-200"
        style={{
          fontFamily:
            '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
          maxHeight: "calc(100vh - 280px)",
        }}
      >
        {/* State: Waiting to Start - with random Messages */}
        {gameState === "waiting" && !feedback && (
          <div className="text-base mb-6 text-gray-600 px-4">
            {(() => {
              const waitingMessages = [
                `Let me show you my perfect day... Think you can remember it all?`,
                `I've got the BEST day planned! Can you keep up with my schedule?`,
                `Oh I just found out what makes my day perfect! Ready to see?`,
                `${character.name} here! Can you remember my perfect day?`,
                `I'm thinking about my ideal day... Pay attention to what I love!`,
                `This is how I spend a perfect day. How good is your memory?`,
                `My perfect day has ${round} special moments. Can you remember them all?`,
              ];
              return waitingMessages[
                Math.floor(Math.random() * waitingMessages.length)
              ];
            })()}
          </div>
        )}

        {/* State: Success Feedback */}
        {gameState === "success" && feedback && (
          <div className="transition-all duration-300 ease-out space-y-4 opacity-100 scale-100">
            <p className="text-xl font-semibold mb-2 text-green-600">
              {feedback.message}
            </p>
            {/* Optionally show the sequence again briefly */}
            <div className="flex flex-wrap justify-center gap-2 opacity-80">
              {sequence.map((id, index) =>
                renderSequenceItem(id, index, "user-correct")
              )}
            </div>
            <p className="text-sm text-zinc-500 mt-1 animate-pulse">
              {" "}
              {/* Subtle pulse for wait time */}
              Awesome! Getting ready for round {round + 1}...
            </p>
          </div>
        )}

        {/* State: Showing Sequence */}
        {gameState === "showing" && (
          <div className="mb-8">
            <p className="text-base font-semibold mb-4 text-zinc-700">
              Memorize this sequence:
            </p>
            {/* Use the render helper for consistency, but force 'correct' style */}
            <div className="flex flex-wrap justify-center gap-3">
              {sequence.map((id, index) =>
                renderSequenceItem(id, index, "correct")
              )}
            </div>
          </div>
        )}

        {/* State: User's Turn */}
        {gameState === "userTurn" && (
          <div className="mb-6">
            {/* User Input Progress Display */}
            <div className="mb-5">
              <p className="text-base font-semibold mb-3 text-zinc-700">
                Your turn! Repeat the sequence:
              </p>
              <div className="flex flex-wrap justify-center gap-2 items-center min-h-[56px]">
                {/* Show entered items as user-correct */}
                {userInput.map((id, index) =>
                  renderSequenceItem(id, index, "user-correct")
                )}
                {/* Show placeholders for remaining items */}
                {Array(sequence.length - userInput.length)
                  .fill(null)
                  .map((_, index) =>
                    renderSequenceItem(
                      null,
                      userInput.length + index,
                      "placeholder"
                    )
                  )}
              </div>
            </div>
            {/* Activity Selection Buttons */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {character.activities.map((activity) => (
                <button
                  key={activity.id}
                  onClick={() => handleUserTap(activity.id)}
                  className={` p-4 rounded-xl transition-all duration-150 ease-in-out bg-slate-50 hover:bg-slate-100 border border-slate-200 active:scale-95 active:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 `}
                  disabled={gameState !== "userTurn"}
                >
                  {" "}
                  <Image
                    src={activity.svg}
                    alt=""
                    width={56}
                    height={56}
                    className="w-14 h-14 mx-auto mb-1.5"
                    unoptimized
                  />{" "}
                  <div className="text-sm font-medium text-zinc-800 text-center truncate px-1">
                    {" "}
                    {activity.label}{" "}
                  </div>{" "}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* --- State: Failed --- */}
        {gameState === "failed" && feedback && failureIndex !== null && (
          <div className="mb-6">
            {/* Failure Message */}
            <p className="text-lg font-semibold mb-4 text-red-600">
              {feedback.message}
            </p>

            {/* Correct Sequence Display */}
            <div className="mb-3">
              <p className="text-sm font-semibold text-zinc-600 mb-2">
                The Correct Sequence:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {sequence.map((id, index) =>
                  renderSequenceItem(id, index, "original")
                )}
              </div>
            </div>

            {/* User Input Display with Highlight */}
            <div className="mb-5">
              <p className="text-sm font-semibold text-zinc-600 mb-2">
                Your Sequence:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {sequence.map((id, index) => {
                  if (index < failureIndex) {
                    // Correctly entered items
                    return renderSequenceItem(
                      userInput[index],
                      index,
                      "user-correct"
                    );
                  } else if (index === failureIndex) {
                    // The incorrect item
                    return renderSequenceItem(
                      userInput[index],
                      index,
                      "user-incorrect"
                    );
                  } else {
                    // Items after the mistake (or items not reached if input is shorter)
                    // Show the correct item but styled as 'missed'
                    return renderSequenceItem(id, index, "missed");
                  }
                })}
                {/* If user input was shorter than failure index (shouldn't happen with current logic, but safe) */}
                {failureIndex >= userInput.length &&
                  Array(sequence.length - userInput.length)
                    .fill(null)
                    .map((_, idx) =>
                      renderSequenceItem(
                        sequence[userInput.length + idx],
                        userInput.length + idx,
                        "missed"
                      )
                    )}
              </div>
            </div>
            <p className="text-sm text-zinc-600 mt-4">
              No worries, remembering can be tricky! Want to try again from the
              start?
            </p>
          </div>
        )}

        {/* Action Button Area */}
        <div className="flex justify-center items-center mt-4">
          {/* State: Waiting Button */}
          {gameState === "waiting" && (
            <button
              onClick={showSequence}
              className="px-6 py-2.5 bg-zinc-900 text-white rounded-full hover:bg-zinc-700 transition-colors font-semibold text-base"
            >
              {" "}
              ▶ Play Round {round}{" "}
            </button>
          )}
          {/* State: Showing Sequence Indicator */}
          {gameState === "showing" && (
            <div
              className="px-5 py-2.5 bg-amber-500 text-white rounded-full font-medium text-sm flex items-center relative overflow-hidden"
              role="progressbar"
              aria-valuenow={100 - countdownProgress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Memorizing sequence progress"
            >
              {" "}
              <div
                className="absolute top-0 left-0 bottom-0 bg-amber-600 transition-width duration-100 ease-linear"
                style={{ width: `${100 - countdownProgress}%` }}
              ></div>{" "}
              <div className="flex items-center z-10 relative">
                {" "}
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
                </svg>{" "}
                Memorize...{" "}
              </div>{" "}
            </div>
          )}
          {/* State: User Turn Progress Indicator */}
          {gameState === "userTurn" && (
            <div
              className="px-5 py-2.5 bg-green-600 text-white rounded-full font-medium text-sm flex items-center"
              role="status"
            >
              {" "}
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
              </svg>{" "}
              Your Turn ({userInput.length}/{sequence.length}){" "}
            </div>
          )}
          {/* State: Failed Button */}
          {gameState === "failed" && (
            <button
              onClick={resetGame}
              className="px-6 py-2.5 bg-zinc-900 text-white rounded-full hover:bg-zinc-700 transition-colors font-semibold text-base flex items-center"
            >
              {" "}
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
              </svg>{" "}
              Try Again?{" "}
            </button>
          )}
        </div>
      </div>{" "}
      {/* End Game Card */}
    </div>
  );
}
