/**
 * SpellSticker.tsx
 *
 * A modern, mobile-friendly React + TypeScript web app for stress-relief spells.
 * Key Features:
 *   1) Ingredient selection with visual feedback
 *   2) A whimsical incantation puzzle (words in random order)
 *   3) Enhanced mixing animation
 *   4) A beautiful flippable card: front = incantation & affirmation; back = stats
 *   5) A button to download the card details as a .txt file
 *
 * Dependencies:
 *   - React, ReactDOM (18+)
 *   - Tailwind CSS (via CDN or bundler)
 *
 * Tailwind classes used for card-flip animation and enhanced UI:
 *   - perspective, transform-style, rotate-y-180, backface-hidden
 *   - gradient backgrounds, micro-interactions, and subtle animations
 *
 * Enjoy this enhanced magical experience!
 */

import { useEffect, useState } from "react";

// Whimsical incantation fragments (rhyming, detailed, & funny!)
const incantationOpeners = [
  "Wizard yawns and sleepy sighs",
  "Dragons sneeze with glittery eyes",
  "Unicorn whispers secrets deep",
  "Ghostly sandwich giggles creep",
  "Teapot whistles tunes bizarre",
];

const incantationVerbs = ["within", "beneath", "behind", "around", "beyond"];

const incantationNouns = [
  "Grandma's jar of cookie dreams",
  "Lost socks caught in laundry seams",
  "Cushions hiding endless coins",
  "Closet chaos re-appoints",
  "Trampolines for fleas alone",
];

const incantationClosers = [
  "turning worries into pies",
  "summoning courage, surprise!",
  "fears transformed to dancing cats",
  "awkward charms and silly chats",
  "stress replaced by quirky moves",
];

// Affirmations (funny & specific!)
const possibleAffirmations = [
  "You're a master of stress-management - like a ninja dodging couch cushions!",
  "Your awesomeness is contagious - spread it like a meme!",
  "You're braver than a firefighter rescuing a cat from a tree!",
  "Your smile is more powerful than a selfie on a good hair day!",
  "You're more resilient than a rubber band stretched to its limits!",
];

// Rarities with enhanced visual indicators
const rarities = ["✨ Common", "🌟 Rare", "🌈 Legendary"];

// Ingredients with colors for visual theming
const ingredients = [
  { name: "Dash of Love", emoji: "❤️", color: "#ff6b6b" },
  { name: "Garden of Serenity", emoji: "🌿", color: "#51cf66" },
  { name: "Glow of Light", emoji: "✨", color: "#fcc419" },
  { name: "Crystal of Clarity", emoji: "💎", color: "#339af0" },
  { name: "Moon's Embrace", emoji: "🌕", color: "#845ef7" },
  { name: "Blanket of Clouds", emoji: "☁️", color: "#adb5bd" },
];

// Local Storage keys
const STORAGE_PREFIX = "stress-spell::";
const SPELL_COUNT_KEY = `${STORAGE_PREFIX}spellsCast`;

function SpellSticker() {
  // App states
  const [hasStarted, setHasStarted] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<
    Record<string, number>
  >({});
  const [isIncantationGame, setIsIncantationGame] = useState(false);
  const [isMixing, setIsMixing] = useState(false);
  const [activeThemeColor, setActiveThemeColor] = useState("#9333ea"); // Default purple theme

  // Incantation puzzle states
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [chosenWords, setChosenWords] = useState<string[]>([]);

  // Final results
  const [finalAffirmation, setFinalAffirmation] = useState("");
  const [spellRarity, setSpellRarity] = useState("");
  const [mostUsedIngredient, setMostUsedIngredient] = useState("");
  const [totalAdded, setTotalAdded] = useState(0);
  const [spellsCast, setSpellsCast] = useState(0);

  // Flippable Card
  const [cardFlipped, setCardFlipped] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);

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
    // Removed unused setIncantationFull call
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
    <div className="flex flex-col items-center p-6 max-w-md mx-auto">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-purple-300 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full bg-blue-300 blur-3xl animate-pulse"></div>
      </div>

      <div className="text-6xl mb-4">✨</div>
      <h1 className="text-4xl font-bold mb-4 text-gray-900 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
        Stress-Relief Spell
      </h1>
      <p className="text-gray-700 mb-8 text-center text-lg leading-relaxed">
        Create a magical moment of calm with your own personalized spell.
      </p>
      <button
        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-medium"
        onClick={handleStart}
      >
        Begin Your Spell
      </button>
    </div>
  );

  // 2. Ingredient Selection
  // Calculate the most used ingredient to set the theme color
  useEffect(() => {
    if (Object.keys(selectedIngredients).length > 0) {
      const [topIngredient] = Object.entries(selectedIngredients).reduce(
        (best, current) => (current[1] > best[1] ? current : best),
        ["", 0]
      );
      const ingredient = ingredients.find((i) => i.name === topIngredient);
      if (ingredient) {
        setActiveThemeColor(ingredient.color);
      }
    }
  }, [selectedIngredients]);

  const renderIngredientSelection = () => {
    return (
      <div className="flex flex-col items-center p-6 w-full max-w-md mx-auto">
        <div className="w-full mb-4 text-center">
          <h2 className="text-2xl font-bold mb-2 text-gray-800">
            Choose Your Magical Ingredients
          </h2>
          <p className="text-gray-600">
            Tap ingredients to add them to your spell
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          {ingredients.map((item) => {
            const count = selectedIngredients[item.name] || 0;
            return (
              <button
                key={item.name}
                onClick={() => handleIngredientClick(item.name)}
                className="flex flex-col items-center justify-center p-3 bg-white rounded-md shadow-sm border relative"
                style={{
                  borderColor: count > 0 ? item.color : "#eaeaea",
                  borderWidth: count > 0 ? "2px" : "1px",
                }}
              >
                {count > 0 && (
                  <span
                    className="absolute top-1 right-1 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    style={{ backgroundColor: item.color }}
                  >
                    {count}
                  </span>
                )}
                <span className="text-2xl mb-1">{item.emoji}</span>
                <span className="text-xs font-medium text-gray-800">
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 w-full bg-white p-3 rounded-md shadow-sm border border-gray-200">
          <h3 className="text-md font-medium text-gray-800 mb-2 flex items-center">
            <span className="mr-1">🧪</span> Your Brew
          </h3>

          {Object.entries(selectedIngredients).length === 0 ? (
            <p className="text-gray-500 text-xs mb-2">
              Add some ingredients to your cauldron
            </p>
          ) : (
            <ul className="mb-2 space-y-1">
              {Object.entries(selectedIngredients).map(([name, count]) => {
                const ingredient = ingredients.find((i) => i.name === name);
                return (
                  <li key={name} className="flex items-center text-sm">
                    <span className="mr-1">{ingredient?.emoji}</span>
                    <span className="text-gray-800">{name}</span>
                    <span
                      className="ml-auto font-medium"
                      style={{ color: ingredient?.color }}
                    >
                      ×{count}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}

          <button
            onClick={handleGoToIncantationGame}
            disabled={Object.keys(selectedIngredients).length === 0}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white shadow-sm transform transition-all duration-300 ${
              Object.keys(selectedIngredients).length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : `bg-gradient-to-r hover:shadow-md hover:scale-[1.02] active:scale-[0.98]`
            }`}
            style={{
              backgroundImage:
                Object.keys(selectedIngredients).length === 0
                  ? "none"
                  : `linear-gradient(to right, ${activeThemeColor}, ${activeThemeColor}DD)`,
            }}
          >
            Continue to Incantation <span className="ml-1">→</span>
          </button>
        </div>
      </div>
    );
  };

  // 3. Incantation Game
  const renderIncantationGame = () => (
    <div className="flex flex-col items-center p-6 w-full max-w-md mx-auto">
      <div className="w-full mb-6 text-center">
        <h2
          className="text-2xl font-bold mb-3 bg-clip-text text-transparent"
          style={{
            backgroundImage: `linear-gradient(to right, ${activeThemeColor}, ${activeThemeColor}CC)`,
          }}
        >
          Craft Your Magical Words
        </h2>
        <p className="text-gray-600 mb-2">
          Arrange these words to create your unique spell incantation
        </p>
      </div>

      {/* Word bank */}
      <div className="w-full bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
        <p className="text-gray-700 mb-3 font-medium flex items-center">
          <span className="mr-2">💬</span> Available Words:
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {shuffledWords.map((word, idx) => (
            <button
              key={`${word}-${idx}`}
              onClick={() => handleWordClick(word, idx)}
              className="bg-white text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200 border border-gray-200 shadow-sm hover:shadow transform hover:scale-105 active:scale-95"
              style={{
                borderLeftColor: activeThemeColor,
                borderLeftWidth: "3px",
              }}
            >
              {word}
            </button>
          ))}
          {shuffledWords.length === 0 && (
            <p className="text-gray-400 italic text-sm">
              All words have been used
            </p>
          )}
        </div>
      </div>

      {/* Incantation preview */}
      <div
        className="w-full bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm"
        style={{ borderLeftColor: activeThemeColor, borderLeftWidth: "4px" }}
      >
        <p className="text-gray-700 mb-3 font-medium flex items-center">
          <span className="mr-2">✨</span> Your Incantation:
        </p>
        <div className="flex flex-wrap gap-2 min-h-[60px] p-3 bg-gray-50 rounded-lg mb-2">
          {chosenWords.map((word, idx) => (
            <button
              key={`chosen-${word}-${idx}`}
              onClick={() => handleRemoveChosenWord(word, idx)}
              className="relative group bg-white text-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-all duration-200 border border-gray-200 shadow-sm"
              style={{
                borderBottomColor: activeThemeColor,
                borderBottomWidth: "2px",
              }}
            >
              <span>{word}</span>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                ×
              </span>
            </button>
          ))}
          {chosenWords.length === 0 && (
            <p className="text-gray-400 italic text-sm self-center">
              Select words to build your incantation
            </p>
          )}
        </div>
        <p className="text-gray-500 text-xs">
          {chosenWords.length > 0 && "Click any word to remove it"}
        </p>
      </div>

      {/* Preview of the incantation */}
      {chosenWords.length > 0 && (
        <div className="w-full bg-gray-50 rounded-lg p-3 mb-6 text-center italic text-gray-700">
          &quot;{getFinalIncantation()}&quot;
        </div>
      )}

      <button
        onClick={handleConfirmIncantation}
        disabled={chosenWords.length === 0}
        className={`w-full py-3 px-4 rounded-lg font-medium text-white shadow-sm transform transition-all duration-300 ${
          chosenWords.length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
        }`}
        style={{
          backgroundImage:
            chosenWords.length === 0
              ? "none"
              : `linear-gradient(to right, ${activeThemeColor}, ${activeThemeColor}DD)`,
        }}
      >
        <span className="flex items-center justify-center">
          <span className="mr-2">Mix Your Spell</span>
          <span>🧪</span>
        </span>
      </button>
    </div>
  );

  // 4. Mixing Screen with enhanced animation
  const renderMixingScreen = () => (
    <div className="flex flex-col items-center justify-center p-6 h-[50vh]">
      <div className="relative w-32 h-32 mb-6">
        {/* Animated cauldron */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl">🧪</div>
        </div>

        {/* Animated bubbles */}
        <div
          className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-purple-400 animate-ping"
          style={{ animationDuration: "1.5s", animationDelay: "0.2s" }}
        ></div>
        <div
          className="absolute top-1/3 right-1/3 w-3 h-3 rounded-full bg-blue-400 animate-ping"
          style={{ animationDuration: "1.3s", animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute bottom-1/3 left-1/3 w-2 h-2 rounded-full bg-pink-400 animate-ping"
          style={{ animationDuration: "1.7s", animationDelay: "0.1s" }}
        ></div>

        {/* Sparkles */}
        <div
          className="absolute -top-4 -left-4 text-2xl animate-bounce"
          style={{ animationDuration: "2s" }}
        >
          ✨
        </div>
        <div
          className="absolute -top-4 -right-4 text-2xl animate-bounce"
          style={{ animationDuration: "2.3s" }}
        >
          ✨
        </div>
        <div
          className="absolute -bottom-4 -left-4 text-2xl animate-bounce"
          style={{ animationDuration: "1.8s" }}
        >
          ✨
        </div>
        <div
          className="absolute -bottom-4 -right-4 text-2xl animate-bounce"
          style={{ animationDuration: "2.2s" }}
        >
          ✨
        </div>

        {/* Swirling background */}
        <div
          className="absolute inset-0 -z-10 rounded-full opacity-20 animate-spin"
          style={{
            backgroundImage: `conic-gradient(${activeThemeColor}88, transparent, ${activeThemeColor}44, transparent)`,
            animationDuration: "3s",
          }}
        ></div>
      </div>

      <p className="text-gray-800 text-xl font-medium text-center mb-2">
        Brewing your magical spell...
      </p>
      <p className="text-gray-600 text-center">
        Stirring in the perfect balance of calm and joy
      </p>
    </div>
  );

  // Effect to show sparkles when the spell is complete
  useEffect(() => {
    if (finalAffirmation) {
      setShowSparkles(true);
      const timer = setTimeout(() => {
        setShowSparkles(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [finalAffirmation]);

  // 5. Final Screen with Enhanced Flippable Card
  const renderFinalScreen = () => {
    // Find the ingredient object for the most used ingredient
    const topIngredient = ingredients.find(
      (i) => i.name === mostUsedIngredient
    );
    const cardColor = topIngredient?.color || activeThemeColor;

    return (
      <div className="flex flex-col items-center p-6 text-center w-full max-w-md mx-auto relative">
        {/* Floating sparkles animation */}
        {showSparkles && (
          <>
            <div
              className="absolute top-10 left-10 text-2xl animate-ping"
              style={{ animationDuration: "1s" }}
            >
              ✨
            </div>
            <div
              className="absolute top-20 right-20 text-xl animate-ping"
              style={{ animationDuration: "1.5s" }}
            >
              ✨
            </div>
            <div
              className="absolute bottom-40 left-20 text-2xl animate-ping"
              style={{ animationDuration: "1.2s" }}
            >
              ✨
            </div>
            <div
              className="absolute bottom-20 right-10 text-xl animate-ping"
              style={{ animationDuration: "0.8s" }}
            >
              ✨
            </div>
          </>
        )}

        <div className="w-full mb-4 text-center">
          <h2 className="text-2xl font-bold mb-2 text-gray-800">
            Your Spell Is Ready!
          </h2>
          <p className="text-gray-600 text-sm mb-1">
            Tap card to flip or use buttons below
          </p>
        </div>

        {/* Flippable card */}
        <div
          className="relative w-full max-w-sm h-64 [perspective:1000px] mb-4 cursor-pointer"
          onClick={() => setCardFlipped(!cardFlipped)}
        >
          {/* Inner wrapper with rotating transform */}
          <div
            className={`absolute w-full h-full transition-all duration-700 [transform-style:preserve-3d] ${
              cardFlipped ? "[transform:rotateY(180deg)]" : ""
            }`}
          >
            {/* Card Front - Incantation & Affirmation */}
            <div
              className="bg-white absolute w-full h-full [backface-visibility:hidden] flex flex-col items-center justify-between p-4 rounded-md shadow border"
              style={{ borderTop: `4px solid ${cardColor}` }}
            >
              <div className="absolute top-2 right-2 text-gray-400 text-xs">
                {spellRarity}
              </div>

              <div className="w-10 h-10 flex items-center justify-center mb-1">
                <span className="text-xl">{topIngredient?.emoji || "✨"}</span>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center w-full">
                <h3 className="font-medium text-gray-500 uppercase text-xs mb-1">
                  Incantation
                </h3>
                <p className="mb-3 italic text-gray-800 text-sm px-2 text-center">
                  &quot;{getFinalIncantation()}&quot;
                </p>

                <h3 className="font-medium text-gray-500 uppercase text-xs mb-1">
                  Affirmation
                </h3>
                <p className="text-gray-800 px-2 text-center text-sm">
                  {finalAffirmation}
                </p>
              </div>

              <div className="text-gray-400 text-xs mt-1 flex items-center">
                <span>Tap to flip</span>
                <span className="ml-1">↻</span>
              </div>
            </div>

            {/* Card Back - Stats */}
            <div
              className="bg-white absolute w-full h-full [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col items-center justify-between p-4 rounded-md shadow border"
              style={{ borderBottom: `4px solid ${cardColor}` }}
            >
              <h3 className="font-medium text-gray-800 text-md mb-2">
                Spell Statistics
              </h3>

              <div className="flex-1 flex flex-col items-center justify-center w-full space-y-2">
                <div className="w-full flex justify-between items-center p-1.5 border border-gray-100 rounded">
                  <span className="text-gray-700 text-xs">
                    Total Ingredients
                  </span>
                  <span className="font-medium text-gray-900 text-sm">
                    {totalAdded}
                  </span>
                </div>

                <div className="w-full flex justify-between items-center p-1.5 border border-gray-100 rounded">
                  <span className="text-gray-700 text-xs">Most Used</span>
                  <span className="font-medium text-gray-900 text-sm flex items-center">
                    {topIngredient?.emoji} {mostUsedIngredient}
                  </span>
                </div>

                <div className="w-full flex justify-between items-center p-1.5 border border-gray-100 rounded">
                  <span className="text-gray-700 text-xs">Rarity</span>
                  <span className="font-medium text-gray-900 text-sm">
                    {spellRarity}
                  </span>
                </div>

                <div className="w-full flex justify-between items-center p-1.5 border border-gray-100 rounded">
                  <span className="text-gray-700 text-xs">Spells Cast</span>
                  <span className="font-medium text-gray-900 text-sm">
                    {spellsCast}
                  </span>
                </div>
              </div>

              <div className="text-gray-400 text-xs mt-1 flex items-center">
                <span>Tap to flip</span>
                <span className="ml-1">↻</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mb-3">
          <button
            onClick={handleDownloadCard}
            className="flex items-center bg-white border border-gray-200 text-gray-800 px-3 py-1.5 rounded text-sm"
          >
            <span className="mr-1">💾</span>
            <span>Save</span>
          </button>

          <button
            onClick={handleCastAnother}
            className="flex items-center px-3 py-1.5 rounded text-sm text-white"
            style={{ backgroundColor: cardColor }}
          >
            <span className="mr-1">✨</span>
            <span>New Spell</span>
          </button>
        </div>

        <p className="text-gray-600 max-w-sm text-xs">
          Take a moment to let the calm settle in before creating another spell.
        </p>
      </div>
    );
  };

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

  return (
    <div className="w-full min-h-full relative overflow-hidden">
      {renderApp()}
    </div>
  );
}

export default SpellSticker;
