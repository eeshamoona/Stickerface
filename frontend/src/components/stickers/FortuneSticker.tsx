'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTree, FaLeaf, FaCloud, FaTint, FaSun, FaBolt,
  FaHome, FaKey, FaGem, FaBook, FaAnchor, FaGift,
  FaBug, FaFish, FaFeatherAlt, FaMagic, FaEye, FaMoon, FaCompass, FaRocket,
  FaStar
} from 'react-icons/fa';
import Image from 'next/image';

// --- Types ---
type GamePhase = 'intro' | 'tarot' | 'reveal';

interface TarotCard {
  id: string;
  icon: React.ReactNode;
  label: string;
  vibe: 'soft' | 'sharp' | 'chaos';
}

// Larger pools for randomization with Vibes
const CARD_POOLS = {
  Nature: [
    { id: 'tree', icon: <FaTree />, label: 'Growth', vibe: 'soft' },
    { id: 'flower', icon: <FaLeaf />, label: 'Beauty', vibe: 'soft' },
    { id: 'cloud', icon: <FaCloud />, label: 'Change', vibe: 'soft' },
    { id: 'water', icon: <FaTint />, label: 'Flow', vibe: 'soft' },
    { id: 'sun', icon: <FaSun />, label: 'Energy', vibe: 'sharp' },
    { id: 'bolt', icon: <FaBolt />, label: 'Power', vibe: 'chaos' },
  ] as TarotCard[],
  Objects: [
    { id: 'house', icon: <FaHome />, label: 'Sanctuary', vibe: 'soft' },
    { id: 'key', icon: <FaKey />, label: 'Discovery', vibe: 'sharp' },
    { id: 'gem', icon: <FaGem />, label: 'Value', vibe: 'sharp' },
    { id: 'book', icon: <FaBook />, label: 'Knowledge', vibe: 'soft' },
    { id: 'gift', icon: <FaGift />, label: 'Surprise', vibe: 'soft' },
    { id: 'anchor', icon: <FaAnchor />, label: 'Stability', vibe: 'sharp' },
  ] as TarotCard[],
  Signs: [
    { id: 'bug', icon: <FaBug />, label: 'Resilience', vibe: 'soft' },
    { id: 'fish', icon: <FaFish />, label: 'Abundance', vibe: 'soft' },
    { id: 'feather', icon: <FaFeatherAlt />, label: 'Lightness', vibe: 'soft' },
    { id: 'magic', icon: <FaMagic />, label: 'Potential', vibe: 'chaos' },
    { id: 'eye', icon: <FaEye />, label: 'Vision', vibe: 'sharp' },
    { id: 'moon', icon: <FaMoon />, label: 'Mystery', vibe: 'soft' },
    { id: 'compass', icon: <FaCompass />, label: 'Direction', vibe: 'sharp' },
    { id: 'rocket', icon: <FaRocket />, label: 'Future', vibe: 'chaos' },
  ] as TarotCard[]
};

// Light theme colors matching the app
const colors = {
  primary: '#F4D03F',      // Fortune sticker color from lib/sticker.ts
  accent: '#af90ff',       // Purple from purrfectTiming
  textDark: '#3f3d56',
  textLight: '#6f6d84',
  bgLight: '#f4effb',
  cardBg: '#fffbfe',
  success: '#66bb6a',
};

// --- Helper: Get Random Cards ---
const getRandomCards = (pool: TarotCard[], count: number) => {
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// --- Component ---
export default function FortuneSticker() {
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [tarotSelections, setTarotSelections] = useState<TarotCard[]>([]);
  const [fortune, setFortune] = useState<string | null>(null);
  const [cookieState, setCookieState] = useState<'closed' | 'opened'>('closed');
  const [currentRound, setCurrentRound] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // State for the random cards shown in each round
  const [currentRoundCards, setCurrentRoundCards] = useState<TarotCard[]>([]);

  // Function to prepare a round
  const prepareRound = (roundIndex: number) => {
    let pool: TarotCard[] = [];
    if (roundIndex === 0) pool = CARD_POOLS.Nature;
    else if (roundIndex === 1) pool = CARD_POOLS.Objects;
    else pool = CARD_POOLS.Signs;

    setCurrentRoundCards(getRandomCards(pool, 4));
  };

  // --- Intro ---
  const handleStart = () => {
    setTarotSelections([]);
    setCurrentRound(0);
    prepareRound(0);
    setPhase('tarot');
    setCookieState('closed');
    setFortune(null);
  };

  // --- Tarot Selection ---
  const handleTarotSelect = (card: TarotCard) => {
    const newSelections = [...tarotSelections, card];
    setTarotSelections(newSelections);

    if (currentRound < 2) {
      const nextRound = currentRound + 1;
      setCurrentRound(nextRound);
      prepareRound(nextRound);
    } else {
      setPhase('reveal');
      generateFortune(newSelections);
    }
  };

  // --- Fortune Generation ---
  const generateFortune = async (selections: TarotCard[]) => {
    setIsLoading(true);
    // Extract labels and vibes
    const selectionData = selections.map(s => ({ label: s.label, vibe: s.vibe }));

    try {
      const res = await fetch('/api/fortune', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selections: selectionData }),
      });

      const data = await res.json();
      setFortune(data.fortune || "The mists reveal hidden treasures ahead.");
    } catch (err) {
      console.error('Fortune fetch error:', err);
      setFortune("Trust your path—great things await.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Retry / Reset ---
  const handleRetry = () => {
    handleStart();
  };

  // --- Typewriter Effect ---
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (cookieState === 'opened' && fortune) {
      setDisplayedText(""); // Clear previous text
      let currentLength = 0;

      const interval = setInterval(() => {
        currentLength++;
        setDisplayedText(fortune.slice(0, currentLength));

        if (currentLength >= fortune.length) {
          clearInterval(interval);
        }
      }, 40);

      return () => clearInterval(interval);
    }
  }, [cookieState, fortune]);

  // --- Render ---
  return (
    <div
      className="w-full h-full flex flex-col items-center relative overflow-hidden"
      style={{
        fontFamily: "'Quicksand', sans-serif",
        backgroundColor: colors.bgLight,
      }}
    >
      {/* Header */}
      <header className="pt-6 pb-4 w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          key={phase}
          className="space-y-1"
        >
          <h1
            className="text-2xl font-bold"
            style={{ color: colors.primary }}
          >
            Fortune Teller
          </h1>
          <p
            className="text-sm"
            style={{ color: colors.textLight }}
          >
            {phase === 'intro' && "Discover what fate holds for you"}
            {phase === 'tarot' && `Choose your path (${currentRound + 1}/3)`}
            {phase === 'reveal' && "Your fortune awaits"}
          </p>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full flex flex-col items-center justify-center px-6 pb-6">

        <AnimatePresence mode="wait">
          {/* INTRO PHASE */}
          {phase === 'intro' && (
            <motion.div
              key="intro"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center text-center"
            >
              <div
                className="mb-8 relative cursor-pointer group"
                onClick={handleStart}
              >
                <div
                  className="absolute inset-0 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity"
                  style={{ backgroundColor: colors.primary }}
                />
                <FaStar
                  className="text-6xl relative z-10 animate-pulse"
                  style={{ color: colors.primary }}
                />
              </div>

              <button
                onClick={handleStart}
                className="px-8 py-3 rounded-full font-semibold text-white transition-all hover:scale-105 active:scale-95 shadow-lg"
                style={{ backgroundColor: colors.accent }}
              >
                Consult the Oracle
              </button>

              <p
                className="mt-4 text-sm italic"
                style={{ color: colors.textLight }}
              >
                Tap to begin your journey
              </p>
            </motion.div>
          )}

          {/* TAROT PHASE */}
          {phase === 'tarot' && (
            <motion.div
              key="tarot"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-sm flex flex-col items-center"
            >
              <motion.div
                key={currentRound}
                className="grid grid-cols-2 gap-3 w-full"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ staggerChildren: 0.1 }}
              >
                {currentRoundCards.map((card, idx) => (
                  <motion.button
                    key={card.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    onClick={() => handleTarotSelect(card)}
                    className="aspect-[4/5] rounded-xl flex flex-col items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 border-2 relative overflow-hidden"
                    style={{
                      backgroundColor: colors.cardBg,
                      borderColor: 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = colors.accent;
                      e.currentTarget.style.boxShadow = `0 4px 20px ${colors.accent}40`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'transparent';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div
                      className="text-4xl transition-colors relative z-10"
                      style={{ color: colors.accent }}
                    >
                      {card.icon}
                    </div>
                    <span
                      className="font-semibold text-sm uppercase tracking-wide relative z-10"
                      style={{ color: colors.textDark }}
                    >
                      {card.label}
                    </span>
                  </motion.button>
                ))}
              </motion.div>

              {/* Progress Dots */}
              <div className="mt-6 flex gap-2">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: i === currentRound ? '2rem' : '0.5rem',
                      backgroundColor: i <= currentRound ? colors.accent : '#ddd',
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* REVEAL PHASE */}
          {phase === 'reveal' && (
            <motion.div
              key="reveal"
              className="w-full flex flex-col items-center justify-center relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {/* Fortune Paper */}
              <AnimatePresence>
                {cookieState === 'opened' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="w-full max-w-xs mb-6"
                  >
                    <div
                      className="p-6 rounded-xl shadow-lg text-center relative"
                      style={{
                        backgroundColor: '#fffef7',
                        border: '1px solid #f0e6d2',
                      }}
                    >
                      {fortune && !isLoading ? (
                        <>
                          <p
                            className="text-lg italic leading-relaxed mb-4"
                            style={{ color: colors.textDark }}
                          >
                            &quot;{displayedText}&quot;
                          </p>
                          <div
                            className="w-12 h-0.5 mx-auto mb-3"
                            style={{ backgroundColor: colors.primary }}
                          />
                          <div className="flex justify-center gap-2 text-xs uppercase tracking-widest flex-wrap" style={{ color: colors.textLight }}>
                            {tarotSelections.map(s => <span key={s.id}>{s.label}</span>)}
                          </div>

                          {/* RETRY BUTTON */}
                          <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            onClick={handleRetry}
                            className="mt-6 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-purple-200 hover:bg-purple-50 transition-colors"
                            style={{ color: colors.accent }}
                          >
                            Crack Another
                          </motion.button>
                        </>
                      ) : (
                        <div className="py-4 flex flex-col items-center gap-2">
                          <FaStar className="animate-spin" style={{ color: colors.primary }} />
                          <span className="text-sm" style={{ color: colors.textLight }}>Divining...</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Cookie */}
              <motion.button
                layout
                onClick={() => {
                  if (cookieState === 'closed') {
                    setCookieState('opened');
                  }
                }}
                disabled={cookieState === 'opened'}
                className="relative w-48 h-48 focus:outline-none cursor-pointer group"
              >
                <div className={`relative w-full h-full transition-all duration-500 ${cookieState === 'opened' ? 'opacity-40 scale-75 translate-y-12 blur-[1px]' : 'hover:scale-105'}`}>
                  <Image
                    src={cookieState === 'closed' ? "/cookie-closed.svg" : "/cookie-opened.svg"}
                    fill
                    className="object-contain drop-shadow-lg"
                    alt="Fortune Cookie"
                  />
                </div>

                {cookieState === 'closed' && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="absolute -bottom-6 left-0 right-0 text-center text-sm animate-pulse"
                    style={{ color: colors.textLight }}
                  >
                    Tap to crack open
                  </motion.p>
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}