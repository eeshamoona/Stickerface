/**
 * StressSpellSticker.tsx
 *
 * A minimal, mobile-friendly React + TypeScript web app for stress-relief spells.
 * Key Features:
 *   1) Ingredient selection
 *   2) A whimsical incantation puzzle (words in random order)
 *   3) Mixing swirl animation
 *   4) A final "business card" that's flippable: front = incantation & affirmation; back = stats
 *   5) A button to download the card details as a .txt file
 *
 * Dependencies:
 *   - React, ReactDOM (18+)
 *   - Tailwind CSS (via CDN or bundler)
 *
 * Tailwind classes used for card-flip animation:
 *   - perspective, transform-style, rotate-y-180, backface-hidden, etc.
 *
 * Enjoy and customize to your liking!
 */

import { useEffect, useState } from "react";

// Whimsical incantation fragments (super detailed & funny!)
const incantationOpeners = [
  "A sleepy wizard yawns loudly",
  "Three tiny dragons sneeze glitter",
  "A talking unicorn whispers sassily",
  "The ghost of a sandwich giggles",
  "An enchanted teapot whistles suspiciously",
];

const incantationVerbs = ["inside", "beneath", "behind", "on top of", "around"];

const incantationNouns = [
  "Grandma's secret cookie jar",
  "the socks you lost in the dryer",
  "the legendary couch cushion",
  "your messy bedroom closet",
  "the world's smallest trampoline",
];

const incantationClosers = [
  "turning anxiety into pizza cravings",
  "summoning oddly specific confidence",
  "transforming worries into cat videos",
  "making awkwardness strangely endearing",
  "replacing stress with spontaneous dance moves",
];

// Affirmations (funny & specific!)
const possibleAffirmations = [
  "You handle stress better than a raccoon handles trash cans!",
  "Your charm is stronger than the Wi-Fi at grandma’s house.",
  "You radiate confidence brighter than a cellphone screen at 3 AM.",
  "You’re calmer than a cat ignoring its owner.",
  "You’ve got this better than autocorrect has got your texts!",
];

// Rarities
const rarities = ["✨Common", "🌟Rare", "🌈Legendary"];

// Ingredients
const ingredients = [
  { name: "Dash of Love", emoji: "❤️" },
  { name: "Garden of Serenity", emoji: "🌿" },
  { name: "Glow of Light", emoji: "✨" },
  { name: "Crystal of Clarity", emoji: "💎" },
  { name: "Moon’s Embrace", emoji: "🌕" },
  { name: "Blanket of Clouds", emoji: "☁️" },
];

// Local Storage keys
const STORAGE_PREFIX = "stress-spell::";
const SPELL_COUNT_KEY = `${STORAGE_PREFIX}spellsCast`;

function StressSpellSticker() {
  // App states
  const [hasStarted, setHasStarted] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<
    Record<string, number>
  >({});
  const [isIncantationGame, setIsIncantationGame] = useState(false);
  const [isMixing, setIsMixing] = useState(false);

  // Incantation puzzle states
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [chosenWords, setChosenWords] = useState<string[]>([]);
  const [incantationFull, setIncantationFull] = useState("");

  // Final results
  const [finalAffirmation, setFinalAffirmation] = useState("");
  const [spellRarity, setSpellRarity] = useState("");
  const [mostUsedIngredient, setMostUsedIngredient] = useState("");
  const [totalAdded, setTotalAdded] = useState(0);
  const [spellsCast, setSpellsCast] = useState(0);

  // Flippable Card
  const [cardFlipped, setCardFlipped] = useState(false);

  // Load total spells from localStorage
  useEffect(() => {
    const storedCount = localStorage.getItem(SPELL_COUNT_KEY);
    if (storedCount) {
      setSpellsCast(parseInt(storedCount, 10));
    }
  }, []);

  // --- Incantation Generator Helpers ---
  function pickRandom<T>(arr: T[]) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function shuffleArray<T>(arr: T[]) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function generateIncantation(): string {
    const opener = pickRandom(incantationOpeners);
    const verb = pickRandom(incantationVerbs);
    const noun = pickRandom(incantationNouns);
    const closer = pickRandom(incantationClosers);
    // Example: "Giggling stardust twirls across the cozy heart, tickling away worries."
    return `${opener} ${verb} ${noun}, ${closer}.`;
  }

  // --- Handlers ---
  const handleStart = () => {
    setHasStarted(true);
  };

  const handleIngredientClick = (ingredientName: string) => {
    setSelectedIngredients((prev) => {
      const count = prev[ingredientName] || 0;
      return { ...prev, [ingredientName]: count + 1 };
    });
  };

  const handleGoToIncantationGame = () => {
    // Generate a silly incantation
    const incantation = generateIncantation();
    setIncantationFull(incantation);

    // Remove punctuation for the puzzle, split into words
    const puzzleWords = incantation
      .replace(/[.,]/g, "")
      .split(" ")
      .map((word) => word.toLowerCase())
      .filter(Boolean);

    // Shuffle them, reset chosen words
    setShuffledWords(shuffleArray(puzzleWords));
    setChosenWords([]);

    setIsIncantationGame(true);
  };

  // Incantation puzzle word click - add word to chosen words
  const handleWordClick = (word: string, index: number) => {
    setChosenWords([...chosenWords, word]);
    setShuffledWords((prev) => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
  };

  // Remove a chosen word and put it back in the shuffled words
  const handleRemoveChosenWord = (word: string, index: number) => {
    // Remove from chosen words
    setChosenWords((prev) => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });

    // Add back to shuffled words
    setShuffledWords((prev) => [...prev, word]);
  };

  // Confirm incantation => swirl mixing
  const handleConfirmIncantation = () => {
    setIsIncantationGame(false);
    setIsMixing(true);

    setTimeout(() => {
      // Calculate stats
      const total = Object.values(selectedIngredients).reduce(
        (acc, val) => acc + val,
        0
      );
      const [topIngredient, topCount] = Object.entries(
        selectedIngredients
      ).reduce(
        (best, current) => (current[1] > best[1] ? current : best),
        ["", 0]
      );
      setTotalAdded(total);
      setMostUsedIngredient(topCount > 0 ? topIngredient : "N/A");

      // Assign random affirmation & rarity
      setFinalAffirmation(pickRandom(possibleAffirmations));
      setSpellRarity(pickRandom(rarities));

      // Increment spells cast
      const newCount = spellsCast + 1;
      localStorage.setItem(SPELL_COUNT_KEY, newCount.toString());
      setSpellsCast(newCount);

      // Done mixing
      setIsMixing(false);
    }, 1500);
  };

  // Reset everything
  const handleCastAnother = () => {
    setHasStarted(false);
    setIsIncantationGame(false);
    setIsMixing(false);
    setSelectedIngredients({});
    setShuffledWords([]);
    setChosenWords([]);
    setIncantationFull("");
    setFinalAffirmation("");
    setSpellRarity("");
    setMostUsedIngredient("");
    setTotalAdded(0);
    setCardFlipped(false);
  };

  // --- Download business card info as .txt ---
  const handleDownloadCard = () => {
    const assembled = `
Spell Business Card

Incantation:
${getFinalIncantation()}

Affirmation:
${finalAffirmation}

Stats:
- Total Ingredients: ${totalAdded}
- Most Used: ${mostUsedIngredient}
- Rarity: ${spellRarity}
- Spells Cast: ${spellsCast}
    `.trim();

    const blob = new Blob([assembled], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "MySpellCard.txt";
    link.href = url;
    link.click();
    // Cleanup
    URL.revokeObjectURL(url);
  };

  // Rebuild user’s final incantation with punctuation
  const getFinalIncantation = () => {
    const phrase = chosenWords.join(" ");
    return phrase.endsWith(".") ? phrase : phrase + ".";
  };

  // --- Render Sections ---

  // 1. Start Screen
  const renderStartScreen = () => (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-3 text-gray-900">
        Stress-Relieving Spell
      </h1>
      <p className="text-gray-800 mb-6 text-center text-lg">
        Ready to conjure some playful calm? Tap below to start.
      </p>
      <button
        className="bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-800 transition-colors"
        onClick={handleStart}
      >
        Begin
      </button>
    </div>
  );

  // 2. Ingredient Selection
  const renderIngredientSelection = () => (
    <div className="flex flex-col items-center p-4 w-full max-w-md">
      <h2 className="text-2xl font-semibold mb-3 text-gray-900">
        Choose Your Magical Ingredients
      </h2>
      <div className="grid grid-cols-2 gap-4 w-full">
        {ingredients.map((item) => (
          <button
            key={item.name}
            onClick={() => handleIngredientClick(item.name)}
            className="flex flex-col items-center justify-center p-3 bg-white rounded shadow hover:shadow-md transition-shadow border border-gray-200"
          >
            <span className="text-2xl mb-1">{item.emoji}</span>
            <span className="text-sm text-gray-900">{item.name}</span>
          </button>
        ))}
      </div>
      <div className="mt-6 w-full">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Your Selection:
        </h3>
        <ul className="mb-4 pl-4 list-disc text-gray-800">
          {Object.entries(selectedIngredients).length === 0 && (
            <li className="text-gray-500">No ingredients added yet.</li>
          )}
          {Object.entries(selectedIngredients).map(([name, count]) => (
            <li key={name}>
              {name} x {count}
            </li>
          ))}
        </ul>
        <button
          onClick={handleGoToIncantationGame}
          className="bg-purple-700 w-full text-white py-2 rounded hover:bg-purple-800 transition-colors"
        >
          Next: Incantation Game
        </button>
      </div>
    </div>
  );

  // 3. Incantation Game
  const renderIncantationGame = () => (
    <div className="flex flex-col items-center p-4 w-full max-w-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 text-center">
        Build Your Incantation
      </h2>
      <p className="text-gray-800 mb-4 text-center">
        Click the words below in any order to form your spell phrase:
      </p>

      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {shuffledWords.map((word, idx) => (
          <button
            key={`${word}-${idx}`}
            onClick={() => handleWordClick(word, idx)}
            className="bg-purple-100 text-purple-900 px-2 py-1 rounded hover:bg-purple-200 transition-colors border border-purple-300"
          >
            {word}
          </button>
        ))}
      </div>

      <div className="w-full bg-white rounded border border-gray-200 p-3 mb-6 shadow">
        <p className="text-gray-700 mb-1 font-medium">Your Incantation:</p>
        <div className="flex flex-wrap gap-1 text-purple-900 min-h-[48px] italic">
          {chosenWords.map((word, idx) => (
            <button
              key={`chosen-${word}-${idx}`}
              onClick={() => handleRemoveChosenWord(word, idx)}
              className="bg-purple-200 text-purple-900 px-2 py-1 rounded hover:bg-purple-300 transition-colors border border-purple-300"
            >
              {word}
            </button>
          ))}
        </div>
        <p className="text-gray-500 text-xs mt-2">
          {chosenWords.length > 0
            ? "Click any word to remove it"
            : "Select words to build your incantation"}
        </p>
      </div>

      <button
        onClick={handleConfirmIncantation}
        disabled={chosenWords.length === 0}
        className={`${
          chosenWords.length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-purple-700 hover:bg-purple-800"
        } text-white px-6 py-2 rounded transition-colors`}
      >
        Confirm & Mix
      </button>
    </div>
  );

  // 4. Mixing Screen
  const renderMixingScreen = () => (
    <div className="flex flex-col items-center p-4">
      <div className="text-5xl animate-pulse mb-4">✨</div>
      <p className="text-gray-900 text-lg text-center">
        Mixing your calming spell...
      </p>
    </div>
  );

  // 5. Final Screen with Flippable Card
  const renderFinalScreen = () => (
    <div className="flex flex-col items-center p-4 text-center w-full max-w-md">
      <h2 className="text-2xl font-semibold mb-3 text-gray-900">
        Your Spell Is Complete!
      </h2>
      <p className="text-gray-700 mb-4">
        Flip the card to see more details or download it for safekeeping.
      </p>

      {/* The flippable "business card" */}
      <div className="relative w-full max-w-sm h-64 [perspective:1000px] mb-6">
        {/* Inner wrapper with rotating transform */}
        <div
          className={`absolute w-full h-full transition-all duration-500 [transform-style:preserve-3d] ${
            cardFlipped ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          {/* Card Front */}
          <div className="bg-white absolute w-full h-full [backface-visibility:hidden] flex flex-col items-center justify-center p-4 border border-gray-200 rounded shadow">
            <div className="flex flex-col items-center text-gray-700">
              <p className="font-semibold mb-1">Incantation:</p>
              <p className="mb-3 italic px-4">{getFinalIncantation()}</p>
              <p className="font-semibold mb-1">Affirmation:</p>
              <p className="px-4">{finalAffirmation}</p>
            </div>
          </div>

          {/* Card Back */}
          <div className="bg-white absolute w-full h-full [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col items-center justify-center p-4 border border-gray-200 rounded shadow">
            <div className="flex flex-col items-start text-gray-700">
              <p className="mb-2">
                <strong>Total Ingredients:</strong> {totalAdded}
              </p>
              <p className="mb-2">
                <strong>Most Used:</strong> {mostUsedIngredient}
              </p>
              <p className="mb-2">
                <strong>Rarity:</strong> {spellRarity}
              </p>
              <p>
                <strong>Spells Cast:</strong> {spellsCast}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Flip and Download Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={() => setCardFlipped(!cardFlipped)}
          className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 transition-colors"
        >
          Flip Card
        </button>

        <button
          onClick={handleDownloadCard}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
        >
          Download
        </button>
      </div>

      <p className="text-gray-600 mt-6 max-w-sm">
        Take a moment to let the playful calm settle in. When you’re ready, cast
        another spell to keep the good vibes going!
      </p>

      <button
        onClick={handleCastAnother}
        className="bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-800 transition-colors mt-4"
      >
        Cast Another Spell
      </button>
    </div>
  );

  // Main app router
  const renderApp = () => {
    // 1) Start
    if (!hasStarted) return renderStartScreen();

    // 2) Ingredients
    if (hasStarted && !isIncantationGame && !isMixing && !finalAffirmation) {
      return renderIngredientSelection();
    }

    // 3) Incantation puzzle
    if (isIncantationGame) {
      return renderIncantationGame();
    }

    // 4) Mixing swirl
    if (isMixing) {
      return renderMixingScreen();
    }

    // 5) Final flippable card
    if (finalAffirmation) {
      return renderFinalScreen();
    }
  };

  return <div className="w-full">{renderApp()}</div>;
}

export default StressSpellSticker;
