"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaBus, FaTrophy, FaRedo, FaInfoCircle, FaPlay, FaExclamationCircle, FaCheckCircle, FaList, FaBug, FaPalette, FaChartBar, FaSkull, FaTimes, FaArrowUp, FaArrowDown, FaDivide } from "react-icons/fa";
import { supabase } from "@/lib/supabase";

// --- TYPES & CONSTANTS ---

type Suit = "hearts" | "diamonds" | "clubs" | "spades";
type Rank = "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K" | "A";

interface Card {
    id: string;
    rank: Rank;
    suit: Suit;
    value: number;
}

interface LeaderboardEntry {
    nickname: string;
    min_stops: number | null;
    max_stops: number | null;
    emoji: string;
    created_at: string;
}

interface GameStats {
    correct: number;
    wrong: number;
    stepFailures: [number, number, number, number];
    cardsSeen: { suit: Suit; rank: Rank }[];
}

interface Odds {
    [key: string]: number;
}

const SUITS: Suit[] = ["hearts", "diamonds", "clubs", "spades"];
const RANKS: Rank[] = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

// A=14, K=13, etc.
const GET_VALUE = (rank: Rank): number => {
    if (rank === "A") return 14;
    if (rank === "K") return 13;
    if (rank === "Q") return 12;
    if (rank === "J") return 11;
    return parseInt(rank);
};

const SUIT_SYMBOLS: Record<Suit, string> = {
    hearts: "♥",
    diamonds: "♦",
    clubs: "♣",
    spades: "♠",
};

// --- HELPER FUNCTIONS ---

const generateDeck = (): Card[] => {
    const deck: Card[] = [];
    SUITS.forEach((suit) => {
        RANKS.forEach((rank) => {
            deck.push({
                id: `${rank}-${suit}-${Math.random().toString(36).substr(2, 9)}`,
                rank,
                suit,
                value: GET_VALUE(rank),
            });
        });
    });
    // Fisher-Yates shuffle
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
};

// --- COMPONENTS ---

const CardView = ({
    card,
    isFaceUp,
    isCurrent,
    index,
}: {
    card: Card | null;
    isFaceUp: boolean;
    isCurrent: boolean;
    index: number;
}) => {
    const isRed = card && (card.suit === "hearts" || card.suit === "diamonds");

    // "Dealt" state: If card is null, we can hide it or show empty slot.
    // To animate "dealing", we could use scale or opacity.
    // If card is present, show it.
    const showCard = !!card;

    return (
        <div
            className={`
        relative w-14 h-20 sm:w-20 sm:h-28 rounded-md transition-all duration-500 transform
        ${isCurrent ? "scale-105 ring-4 ring-yellow-200 ring-opacity-60 -translate-y-2" : ""}
        ${showCard ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
        ${isFaceUp ? "rotate-y-0" : ""}
      `}
            style={{ perspective: "1000px" }}
        >
            {/* FACE DOWN / BACK */}
            <div
                className={`
          absolute inset-0 bg-indigo-500 rounded-md border-2 border-white shadow-sm flex items-center justify-center backface-hidden transition-all duration-500
          ${isFaceUp ? "opacity-0 rotate-y-180" : "opacity-100"}
        `}
            >
                <div className="w-12 h-16 border border-indigo-300 rounded opacity-30" />
            </div>

            {/* FACE UP / FRONT */}
            <div
                className={`
          absolute inset-0 bg-white rounded-md border-2 shadow-md flex flex-col items-center justify-center select-none backface-hidden transition-all duration-500
          ${isFaceUp ? "opacity-100 rotate-y-0" : "opacity-0 -rotate-y-180"}
          ${isRed ? "text-red-500 border-red-50" : "text-slate-800 border-slate-100"}
        `}
            >
                {card && (
                    <>
                        <span className="text-xl font-bold font-nunito">{card.rank}</span>
                        <span className="text-3xl leading-none">{SUIT_SYMBOLS[card.suit]}</span>
                    </>
                )}
            </div>
        </div>
    );
};

const GameButton = ({ label, onClick, colorClass, subLabel, icon, odds, isRainbow = false }: any) => (
    <button
        onClick={onClick}
        className={`
      flex flex-col items-center justify-center relative overflow-hidden
      py-4 px-2 rounded-lg font-bold text-lg shadow-sm transition-all transform active:scale-95
      ${colorClass}
      ${isRainbow ? "ring-2 ring-offset-2 ring-indigo-300" : ""}
    `}
    >
        {isRainbow && (
            <div className="absolute inset-0 bg-gradient-to-r from-red-200 via-yellow-200 to-blue-200 opacity-20" />
        )}
        <span className="flex items-center gap-2 relative z-10">
            {icon} {label}
            {odds !== undefined && (
                <span className="bg-white/30 px-1.5 py-0.5 rounded text-[10px] font-mono opacity-80">
                    {odds}%
                </span>
            )}
        </span>
        {subLabel && <span className="text-xs opacity-70 font-normal relative z-10">{subLabel}</span>}
    </button>
);

// --- MAIN APP COMPONENT ---

export default function RideTheBusSticker() {
    const [view, setView] = useState<"intro" | "game" | "result">("intro");
    const [deck, setDeck] = useState<Card[]>([]);

    // Game State
    const [activeCards, setActiveCards] = useState<(Card | null)[]>([null, null, null, null]);
    const [step, setStep] = useState(0); // 0..3
    const [stops, setStops] = useState(0);
    const [shake, setShake] = useState(false);
    const [flashColor, setFlashColor] = useState<"green" | "red" | "blue" | "rainbow" | null>(null);
    const [revealFailure, setRevealFailure] = useState(false);
    const [odds, setOdds] = useState<Odds>({});

    // Stats Tracking
    const [stats, setStats] = useState<GameStats>({
        correct: 0,
        wrong: 0,
        stepFailures: [0, 0, 0, 0],
        cardsSeen: []
    });

    // Tie Breaker
    const startTimeRef = useRef<number>(0);
    const [finalDuration, setFinalDuration] = useState(0);

    // Leaderboard State
    const [bestLeaderboard, setBestLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [worstLeaderboard, setWorstLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [playerName, setPlayerName] = useState("");
    const [playerEmoji, setPlayerEmoji] = useState("🚌");
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [debugMode, setDebugMode] = useState(false);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [leaderboardView, setLeaderboardView] = useState<"best" | "worst">("best");

    // Stop Delta Animation
    const [stopDelta, setStopDelta] = useState<"+1" | "-1" | "÷2" | null>(null);

    // Emoji Menu State
    const [showEmojiMenu, setShowEmojiMenu] = useState(false);

    // User ID State
    const [userId, setUserId] = useState<string>("");

    // Load LocalStorage on mount
    useEffect(() => {
        const savedName = localStorage.getItem("rtb_nickname");
        const savedEmoji = localStorage.getItem("rtb_emoji");
        let savedUserId = localStorage.getItem("rtb_user_id");

        if (!savedUserId) {
            savedUserId = crypto.randomUUID();
            localStorage.setItem("rtb_user_id", savedUserId);
        }

        setUserId(savedUserId);
        if (savedName) setPlayerName(savedName);
        if (savedEmoji) setPlayerEmoji(savedEmoji);
    }, []);

    const getCheatAnswer = () => {
        const currentCard = activeCards[step];
        if (!currentCard) return "Loading...";

        if (step === 0) {
            const isRed = currentCard.suit === "hearts" || currentCard.suit === "diamonds";
            return isRed ? "Red" : "Black";
        }
        if (step === 1) {
            const prev = activeCards[step - 1];
            if (!prev) return "?";
            if (currentCard.value === prev.value) return "Goalpost!";
            return currentCard.value > prev.value ? "Higher" : "Lower";
        }
        if (step === 2) {
            const c1 = activeCards[0]!.value;
            const c2 = activeCards[1]!.value;
            if (c1 === c2) {
                if (currentCard.value === c1) return "Goalpost!";
                return currentCard.value > c1 ? "Higher" : "Lower";
            }
            const min = Math.min(c1, c2);
            const max = Math.max(c1, c2);
            const val = currentCard.value;
            if (val === min || val === max) return "Goalpost!";
            if (val > min && val < max) return "Inside";
            return "Outside";
        }
        if (step === 3) {
            const playedSuits = new Set([activeCards[0]?.suit, activeCards[1]?.suit, activeCards[2]?.suit]);
            const missingSuit = SUITS.find(s => !playedSuits.has(s));
            if (playedSuits.size === 3 && currentCard.suit === missingSuit) {
                return `Rainbow! (${SUIT_SYMBOLS[currentCard.suit]})`;
            }
            return currentCard.suit === "hearts" ? "♥ Hearts" :
                currentCard.suit === "diamonds" ? "♦ Diamonds" :
                    currentCard.suit === "clubs" ? "♣ Clubs" : "♠ Spades";
        }
    };

    const EMOJIS = ["🚌", "🚍", "🚏", "🎫", "🤡", "👑", "🔥", "🧊", "🚀", "🐌", "🎲", "🎰", "🤢", "🤮", "🤠", "👻", "💩", "💀"];


    // Load scores on mount or view change
    useEffect(() => {
        if (view === "intro" || view === "result") {
            fetchLeaderboard();
        }
    }, [view]);

    // Calculate odds when game state changes
    useEffect(() => {
        if (view === "game" && deck.length > 0) {
            calculateOdds();
        }
    }, [step, deck, view, activeCards]);

    const calculateOdds = () => {
        const revealedIds = new Set(activeCards.slice(0, step).filter(c => c !== null).map(c => c!.id));
        const unknownCards = deck.filter(c => !revealedIds.has(c.id));
        const total = unknownCards.length;
        if (total === 0) return;

        const newOdds: Odds = {};

        if (step === 0) {
            const redCount = unknownCards.filter(c => c.suit === "hearts" || c.suit === "diamonds").length;
            newOdds["red"] = Math.round((redCount / total) * 100);
            newOdds["black"] = Math.round(((total - redCount) / total) * 100);
        }
        else if (step === 1 && activeCards[0]) {
            const refVal = activeCards[0].value;
            const higher = unknownCards.filter(c => c.value > refVal).length;
            const lower = unknownCards.filter(c => c.value < refVal).length;
            const same = unknownCards.filter(c => c.value === refVal).length;
            newOdds["higher"] = Math.round((higher / total) * 100);
            newOdds["lower"] = Math.round((lower / total) * 100);
            newOdds["goalpost"] = Math.round((same / total) * 100);
        }
        else if (step === 2 && activeCards[0] && activeCards[1]) {
            const c1 = activeCards[0].value;
            const c2 = activeCards[1].value;
            if (c1 === c2) {
                const higher = unknownCards.filter(c => c.value > c1).length;
                const lower = unknownCards.filter(c => c.value < c1).length;
                const same = unknownCards.filter(c => c.value === c1).length;
                newOdds["higher"] = Math.round((higher / total) * 100);
                newOdds["lower"] = Math.round((lower / total) * 100);
                newOdds["goalpost"] = Math.round((same / total) * 100);
            } else {
                const min = Math.min(c1, c2);
                const max = Math.max(c1, c2);
                const inside = unknownCards.filter(c => c.value > min && c.value < max).length;
                const outside = unknownCards.filter(c => c.value < min || c.value > max).length;
                const post = unknownCards.filter(c => c.value === min || c.value === max).length;
                newOdds["inside"] = Math.round((inside / total) * 100);
                newOdds["outside"] = Math.round((outside / total) * 100);
                newOdds["goalpost"] = Math.round((post / total) * 100);
            }
        }
        else if (step === 3) {
            const hearts = unknownCards.filter(c => c.suit === "hearts").length;
            const diamonds = unknownCards.filter(c => c.suit === "diamonds").length;
            const clubs = unknownCards.filter(c => c.suit === "clubs").length;
            const spades = unknownCards.filter(c => c.suit === "spades").length;
            newOdds["hearts"] = Math.round((hearts / total) * 100);
            newOdds["diamonds"] = Math.round((diamonds / total) * 100);
            newOdds["clubs"] = Math.round((clubs / total) * 100);
            newOdds["spades"] = Math.round((spades / total) * 100);
            const playedSuits = new Set([activeCards[0]?.suit, activeCards[1]?.suit, activeCards[2]?.suit]);
            if (playedSuits.size === 3) {
                const missingSuit = SUITS.find(s => !playedSuits.has(s));
                const missingCount = unknownCards.filter(c => c.suit === missingSuit).length;
                newOdds["rainbow"] = Math.round((missingCount / total) * 100);
            }
        }
        setOdds(newOdds);
    };

    const trackCard = (card: Card) => {
        setStats(prev => ({
            ...prev,
            cardsSeen: [...prev.cardsSeen, { suit: card.suit, rank: card.rank }]
        }));
    };

    const fetchLeaderboard = async () => {
        // Fetch top 5 best rides (min_stops ascending)
        const { data: bestData } = await supabase
            .from("bus_scores")
            .select("nickname, min_stops, max_stops, emoji, created_at")
            .order("min_stops", { ascending: true, nullsFirst: false })
            .limit(5);

        if (bestData) {
            setBestLeaderboard(bestData);
        }

        // Fetch top 5 worst rides (max_stops descending)
        const { data: worstData } = await supabase
            .from("bus_scores")
            .select("nickname, min_stops, max_stops, emoji, created_at")
            .order("max_stops", { ascending: false, nullsFirst: false })
            .limit(5);

        if (worstData) {
            setWorstLeaderboard(worstData);
        }
    };

    const startGame = () => {
        const newDeck = generateDeck();
        setDeck(newDeck);
        // Deal 4 initial placeholder cards
        setActiveCards([newDeck[0], newDeck[1], newDeck[2], newDeck[3]]);
        setStops(0);
        setStep(0);
        setStats({ correct: 0, wrong: 0, stepFailures: [0, 0, 0, 0], cardsSeen: [] });
        startTimeRef.current = Date.now();
        setHasSubmitted(false);
        setView("game");
    };

    const resetRound = () => {
        const currentCard = activeCards[step];
        if (currentCard) trackCard(currentCard);

        // Update Stats
        setStats(prev => {
            const newFailures = [...prev.stepFailures] as [number, number, number, number];
            newFailures[step] = newFailures[step] + 1;
            return { ...prev, wrong: prev.wrong + 1, stepFailures: newFailures };
        });

        // Punish player: Shake effect + Increment Stops
        setShake(true);
        setStops((s) => s + 1);
        setStopDelta("+1");
        setFlashColor("red");
        setRevealFailure(true);

        // Clear delta after animation
        setTimeout(() => setStopDelta(null), 1000);

        // 1. Reveal feedback (red flash), wait.
        setTimeout(() => {
            setShake(false);
            setFlashColor(null);

            // 2. Flip all cards face down.
            // We do this by setting step to -1 (so idx < step is false for all).
            setStep(-1);
            setRevealFailure(false);

            // Wait for flip down transition (500ms)
            setTimeout(() => {
                // 3. Clear board (remove cards) to simulate "clearing table"
                setActiveCards([null, null, null, null]);

                // Wait a moment for clear
                setTimeout(() => {
                    // 4. Deal new cards
                    const newDeck = generateDeck();
                    setDeck(newDeck);

                    // Staggered Deal
                    const deal = (index: number) => {
                        if (index > 3) {
                            setStep(0); // Ready to play
                            return;
                        }
                        setActiveCards(prev => {
                            const next = [...prev];
                            next[index] = newDeck[index];
                            return next;
                        });
                        setTimeout(() => deal(index + 1), 150);
                    };

                    deal(0);

                }, 200);
            }, 500);
        }, 800);
    };

    const nextStep = (effect: "standard" | "reward" | "rainbow" = "standard") => {
        const currentCard = activeCards[step];
        if (currentCard) trackCard(currentCard);

        setStats(prev => ({ ...prev, correct: prev.correct + 1 }));

        if (effect === "rainbow") setFlashColor("rainbow");
        else if (effect === "reward") setFlashColor("blue");
        else setFlashColor("green");

        if (effect === "reward") {
            setStops(s => Math.max(0, s - 1));
            setStopDelta("-1");
            setTimeout(() => setStopDelta(null), 1000);
        } else if (effect === "rainbow") {
            setStops(s => Math.floor(s / 2));
            setStopDelta("÷2");
            setTimeout(() => setStopDelta(null), 1000);
        }

        setTimeout(() => {
            setFlashColor(null);
            if (step === 3) {
                // Victory!
                setFinalDuration(Date.now() - startTimeRef.current);
                setView("result");
            } else {
                setStep((s) => s + 1);
            }
        }, 600);
    };

    const handleGuess = (type: string, payload?: any) => {
        if (step < 0 || revealFailure) return; // Prevent clicking during reset
        const currentCard = activeCards[step];
        if (!currentCard) return;

        let correct = false;
        let effect: "standard" | "reward" | "rainbow" = "standard";

        // --- LOGIC ---
        if (step === 0) {
            // Red or Black
            const isRed = currentCard.suit === "hearts" || currentCard.suit === "diamonds";
            if (type === "red" && isRed) correct = true;
            if (type === "black" && !isRed) correct = true;
        } else if (step === 1) {
            // High or Low (with Goalpost)
            const prev = activeCards[step - 1];
            if (prev) {
                if (type === "higher" && currentCard.value > prev.value) correct = true;
                if (type === "lower" && currentCard.value < prev.value) correct = true;
                if (type === "goalpost" && currentCard.value === prev.value) {
                    correct = true;
                    effect = "reward";
                }
            }
        } else if (step === 2) {
            // Inside or Outside (with Goalpost and identical bounds handling)
            const c1 = activeCards[0]!.value;
            const c2 = activeCards[1]!.value;
            const min = Math.min(c1, c2);
            const max = Math.max(c1, c2);
            const val = currentCard.value;
            const isPost = val === min || val === max;

            if (c1 === c2) {
                // Edge case: Identical cards
                if (type === "higher" && val > c1) correct = true;
                if (type === "lower" && val < c1) correct = true;
                if (type === "goalpost" && val === c1) { correct = true; effect = "reward"; }
            } else {
                if (type === "inside" && val > min && val < max) correct = true;
                if (type === "outside" && (val < min || val > max)) correct = true;
                if (type === "goalpost" && isPost) { correct = true; effect = "reward"; }
            }
        } else if (step === 3) {
            // Suit (with Rainbow)
            if (type === "rainbow") {
                const playedSuits = new Set([activeCards[0]?.suit, activeCards[1]?.suit, activeCards[2]?.suit]);
                const missingSuit = SUITS.find(s => !playedSuits.has(s));
                if (currentCard.suit === missingSuit) { correct = true; effect = "rainbow"; }
            } else {
                if (currentCard.suit === payload) correct = true;
            }
        }

        if (correct) {
            nextStep(effect);
        } else {
            resetRound();
        }
    };

    const submitScore = async () => {
        if (!playerName.trim() || !userId) return;

        // Save to LocalStorage
        localStorage.setItem("rtb_nickname", playerName);
        localStorage.setItem("rtb_emoji", playerEmoji);

        // Check for existing by USER_ID
        const { data: existingUser } = await supabase
            .from("bus_scores")
            .select("*")
            .eq("user_id", userId)
            .single();

        let error;

        if (existingUser) {
            // Update
            const newMin = existingUser.min_stops === null ? stops : Math.min(existingUser.min_stops, stops);
            const newMax = existingUser.max_stops === null ? stops : Math.max(existingUser.max_stops, stops);

            const { error: updateError } = await supabase
                .from("bus_scores")
                .update({
                    min_stops: newMin,
                    max_stops: newMax,
                    nickname: playerName, // Update nickname in case they changed it
                    emoji: playerEmoji
                })
                .eq("user_id", userId);
            error = updateError;
        } else {
            // Insert
            const { error: insertError } = await supabase
                .from("bus_scores")
                .insert([
                    {
                        user_id: userId,
                        nickname: playerName,
                        min_stops: stops,
                        max_stops: stops,
                        emoji: playerEmoji
                    }
                ]);
            error = insertError;
        }

        if (!error) {
            setHasSubmitted(true);
            fetchLeaderboard();
        } else {
            console.error("Error submitting score", error);
        }
    };

    // --- RENDER HELPERS ---

    const getQuestionText = () => {
        switch (step) {
            case 0:
                return "Red or Black?";
            case 1:
                return "Higher or Lower?";
            case 2:
                return "Inside or Outside?";
            case 3:
                return "Which Suit?";
            default:
                return "";
        }
    };

    const isIdenticalBounds = step === 2 && activeCards[0]?.value === activeCards[1]?.value;
    const isRainbowPossible = () => {
        if (step !== 3) return false;
        const suits = new Set([activeCards[0]?.suit, activeCards[1]?.suit, activeCards[2]?.suit]);
        return suits.size === 3;
    };

    const getEndGameStats = () => {
        const totalAnswers = stats.correct + stats.wrong;
        const accuracy = totalAnswers > 0 ? Math.round((stats.correct / totalAnswers) * 100) : 0;

        const suitCounts = {
            hearts: stats.cardsSeen.filter(c => c.suit === "hearts").length,
            diamonds: stats.cardsSeen.filter(c => c.suit === "diamonds").length,
            clubs: stats.cardsSeen.filter(c => c.suit === "clubs").length,
            spades: stats.cardsSeen.filter(c => c.suit === "spades").length,
        };
        const totalSuits = stats.cardsSeen.length;

        // Nemesis calculation
        const stepFailures = stats.stepFailures;
        const maxFailures = Math.max(...stepFailures);
        const worstStepIndex = stepFailures.indexOf(maxFailures);
        const worstStepName = ["Color", "High/Low", "In/Out", "Suit"][worstStepIndex];

        return {
            totalAnswers,
            accuracy,
            suitCounts,
            totalSuits,
            stepFailures,
            maxFailures,
            worstStepIndex
        };
    };

    return (
        <div className="h-full w-full bg-sky-50 font-sans text-slate-800 flex items-center justify-center p-1 md:p-2 rounded-lg overflow-hidden">
            {/* Global CSS for Shake Animation */}
            <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        @keyframes floatUp {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-20px) scale(1.2); }
        }
        .animate-shake { animation: shake 0.4s ease-in-out; }
        .animate-float-up { animation: floatUp 0.8s ease-out forwards; }
        .font-nunito { font-family: 'Nunito', sans-serif; }
        /* Backface visibility utility not always in default tailwind */
        .backface-hidden {
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
        }
        .rotate-y-180 {
            transform: rotateY(180deg);
        }
        .rotate-y-0 {
            transform: rotateY(0deg);
        }
      `}</style>

            {/* --- APP CONTAINER --- */}
            <div className="w-full h-full bg-white rounded-lg shadow-none md:shadow-xl overflow-hidden flex flex-col relative border border-slate-100 max-h-[90vh]">

                {/* --- LEADERBOARD OVERLAY --- */}
                {showLeaderboard && (
                    <div className="absolute inset-0 bg-white z-50 flex flex-col animate-in fade-in duration-300">
                        {/* Header */}
                        <div className="flex items-center justify-between p-3 border-b border-slate-100">
                            <h2 className="text-xl font-black text-slate-800">Leaderboard</h2>
                            <button
                                onClick={() => setShowLeaderboard(false)}
                                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                            >
                                <FaTimes className="text-slate-500" />
                            </button>
                        </div>

                        {/* Toggle Tabs */}
                        <div className="flex p-2 gap-2 bg-slate-50">
                            <button
                                onClick={() => setLeaderboardView("best")}
                                className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${leaderboardView === "best"
                                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200"
                                    : "bg-white text-slate-500 hover:bg-slate-100"
                                    }`}
                            >
                                <FaTrophy /> Best Rides
                            </button>
                            <button
                                onClick={() => setLeaderboardView("worst")}
                                className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${leaderboardView === "worst"
                                    ? "bg-red-500 text-white shadow-lg shadow-red-200"
                                    : "bg-white text-slate-500 hover:bg-slate-100"
                                    }`}
                            >
                                <FaSkull /> Worst Rides
                            </button>
                        </div>

                        {/* Leaderboard List */}
                        <div className="flex-1 p-4 overflow-y-auto">
                            {leaderboardView === "best" ? (
                                <div className="space-y-2">
                                    {bestLeaderboard.length === 0 ? (
                                        <div className="text-center text-slate-400 py-8">No records yet. Be the first!</div>
                                    ) : (
                                        bestLeaderboard.map((entry, i) => (
                                            <div
                                                key={i}
                                                className={`flex items-center gap-3 p-2 rounded-lg border transition-all ${i === 0 ? "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200" :
                                                    i === 1 ? "bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200" :
                                                        i === 2 ? "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200" :
                                                            "bg-white border-slate-100"
                                                    }`}
                                            >
                                                <div className="text-2xl w-10 text-center">
                                                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                                                </div>
                                                <div className="text-2xl">{entry.emoji}</div>
                                                <div className="flex-1">
                                                    <div className="font-bold text-slate-800">{entry.nickname}</div>
                                                </div>
                                                <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-mono font-bold text-sm flex items-center gap-1">
                                                    <FaArrowDown className="text-xs" /> {entry.min_stops} stops
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {worstLeaderboard.length === 0 ? (
                                        <div className="text-center text-slate-400 py-8">No records yet. Be the first!</div>
                                    ) : (
                                        worstLeaderboard.map((entry, i) => (
                                            <div
                                                key={i}
                                                className={`flex items-center gap-3 p-2 rounded-lg border transition-all ${i === 0 ? "bg-gradient-to-r from-red-50 to-rose-50 border-red-200" :
                                                    i === 1 ? "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200" :
                                                        i === 2 ? "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200" :
                                                            "bg-white border-slate-100"
                                                    }`}
                                            >
                                                <div className="text-2xl w-10 text-center">
                                                    {i === 0 ? "💀" : i === 1 ? "🔥" : i === 2 ? "😱" : `#${i + 1}`}
                                                </div>
                                                <div className="text-2xl">{entry.emoji}</div>
                                                <div className="flex-1">
                                                    <div className="font-bold text-slate-800">{entry.nickname}</div>
                                                </div>
                                                <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-mono font-bold text-sm flex items-center gap-1">
                                                    <FaArrowUp className="text-xs" /> {entry.max_stops} stops
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* --- VIEW: INTRO --- */}
                {view === "intro" && (
                    <div className="flex-1 flex flex-col items-center justify-center p-4 text-center space-y-6 animate-in fade-in duration-700">
                        {/* Leaderboard Button */}
                        <button
                            onClick={() => setShowLeaderboard(true)}
                            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all hover:scale-105 shadow-sm"
                        >
                            <FaTrophy className="text-amber-500 text-base" />
                        </button>

                        <div className="relative">
                            <div className="absolute -top-8 -right-8 text-4xl opacity-50 rotate-12">🃏</div>
                            <div className="bg-indigo-100 p-6 rounded-full mb-2">
                                <FaBus className="text-4xl text-indigo-600" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Ride the Bus</h1>
                            <p className="text-slate-500 text-sm max-w-[200px] mx-auto">Guess the cards to get off the bus.</p>
                        </div>

                        <div className="w-full space-y-4 max-w-sm">
                            <button
                                onClick={startGame}
                                className="w-full py-5 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white font-bold rounded-lg text-xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-3"
                            >
                                <FaPlay /> Start Ride
                            </button>

                            {bestLeaderboard.length > 0 && (
                                <div className="bg-slate-50 rounded-lg p-4 text-left">
                                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">
                                        <FaTrophy /> Best Rides
                                    </div>
                                    {bestLeaderboard.slice(0, 3).map((s, i) => (
                                        <div key={i} className="flex justify-between items-center text-sm py-1">
                                            <span className="flex items-center gap-2 font-semibold">
                                                <span className="text-lg">{i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}</span>
                                                {s.emoji} {s.nickname}
                                            </span>
                                            <span className="font-mono bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs">{s.min_stops} stops</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* --- VIEW: GAME --- */}
                {view === "game" && (
                    <div className={`flex-1 flex flex-col p-2 md:p-4 relative ${shake ? "animate-shake" : ""}`}>
                        {/* Flash Feedback Layer */}
                        {flashColor && (
                            <div
                                className={`
                                    absolute inset-0 z-0 opacity-20 pointer-events-none transition-colors duration-100
                                    ${flashColor === "green" ? "bg-green-500" : ""}
                                    ${flashColor === "red" ? "bg-red-500" : ""}
                                    ${flashColor === "blue" ? "bg-blue-500" : ""}
                                    ${flashColor === "rainbow" ? "bg-gradient-to-r from-red-500 via-green-500 to-blue-500 opacity-30" : ""}
                                `}
                            />
                        )}

                        {/* Top Bar */}
                        <div className="flex justify-between items-center mb-4 relative z-10">
                            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full shadow-sm relative">
                                <FaBus className="text-indigo-500" />
                                <span className="font-bold text-slate-700">Stops: {stops}</span>
                                {/* Stop Delta Animation */}
                                {stopDelta && (
                                    <span className={`absolute -right-2 -top-2 font-bold text-sm animate-float-up ${stopDelta === "+1" ? "text-red-500" :
                                        stopDelta === "-1" ? "text-emerald-500" :
                                            "text-indigo-500"
                                        }`}>
                                        {stopDelta}
                                    </span>
                                )}
                            </div>
                            <div className="group relative">
                                <FaInfoCircle className="text-slate-300 cursor-pointer hover:text-indigo-400 transition-colors text-xl" />
                                <div className="absolute right-0 top-8 w-40 bg-slate-800 text-white text-[10px] p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg z-50">
                                    Ranks go 2–A.<br />A is high.<br />Wrong guess resets the board!<br />🥅 Goalpost = -1 stop<br />🌈 Rainbow =  stops/2
                                </div>
                            </div>

                            {/* Debug Toggle */}
                            <div className="group relative ml-2">
                                <button onClick={() => setDebugMode(!debugMode)} className={`text-lg transition-colors ${debugMode ? "text-red-500" : "text-slate-200 hover:text-slate-400"}`}>
                                    <FaBug />
                                </button>
                                {debugMode && (
                                    <div className="absolute right-0 top-8 w-max bg-red-100 text-red-800 text-[10px] font-bold p-2 rounded-md shadow-lg border border-red-200 z-50">
                                        CHEAT: {getCheatAnswer()}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Evaluation Area */}
                        <div className="flex-1 flex flex-col items-center justify-center z-10 w-full">
                            <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-4 mb-4">
                                {[0, 1, 2, 3].map((idx) => (
                                    <CardView
                                        key={idx}
                                        index={idx}
                                        card={activeCards[idx]}
                                        isFaceUp={(idx < step && step >= 0) || (flashColor !== null && idx === step) || (revealFailure && idx === step)} // Hide if step is -1 (resetting)
                                        isCurrent={idx === step}
                                    />
                                ))}
                            </div>

                            {/* Interaction Area */}
                            <div className="w-full animate-in slide-in-from-bottom-4 duration-500 max-w-sm">
                                <div className="text-center mb-3">
                                    <h2 className="text-xl font-black text-slate-800">{getQuestionText()}</h2>
                                    <p className="text-slate-400 text-sm font-semibold mt-1">
                                        {step === 2 && activeCards[0] && activeCards[1] && !isIdenticalBounds
                                            ? `Between ${activeCards[0].rank} & ${activeCards[1].rank}?`
                                            : `Question ${step + 1} of 4`}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    {step === 0 && (
                                        <>
                                            <GameButton label="Red" onClick={() => handleGuess("red")} colorClass="bg-red-500 text-white hover:bg-red-600" />
                                            <GameButton
                                                label="Black"
                                                onClick={() => handleGuess("black")}
                                                colorClass="bg-slate-800 text-white hover:bg-slate-900"
                                            />
                                        </>
                                    )}
                                    {(step === 1 || isIdenticalBounds) && (
                                        <>
                                            <GameButton
                                                label="Higher"
                                                odds={odds["higher"]}
                                                subLabel={`Than ${activeCards[step === 1 ? 0 : 0]?.rank}`}
                                                onClick={() => handleGuess("higher")}
                                                colorClass="bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                                icon="▲"
                                            />
                                            <GameButton
                                                label="Lower"
                                                odds={odds["lower"]}
                                                subLabel={`Than ${activeCards[step === 1 ? 0 : 0]?.rank}`}
                                                onClick={() => handleGuess("lower")}
                                                colorClass="bg-rose-100 text-rose-800 hover:bg-rose-200"
                                                icon="▼"
                                            />
                                            <GameButton
                                                label="Goalpost!"
                                                odds={odds["goalpost"]}
                                                subLabel="Same Value (-1 Stop)"
                                                onClick={() => handleGuess("goalpost")}
                                                colorClass="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 col-span-2"
                                                icon="🥅"
                                            />
                                        </>
                                    )}
                                    {step === 2 && !isIdenticalBounds && (
                                        <>
                                            <GameButton
                                                label="Inside"
                                                odds={odds["inside"]}
                                                onClick={() => handleGuess("inside")}
                                                colorClass="bg-orange-100 text-orange-800 hover:bg-orange-200"
                                                icon="↔"
                                            />
                                            <GameButton
                                                label="Outside"
                                                odds={odds["outside"]}
                                                onClick={() => handleGuess("outside")}
                                                colorClass="bg-purple-100 text-purple-800 hover:bg-purple-200"
                                                icon="⇤⇥"
                                            />
                                            <GameButton
                                                label="Goalpost!"
                                                odds={odds["goalpost"]}
                                                subLabel="Hits the edge (-1 Stop)"
                                                onClick={() => handleGuess("goalpost")}
                                                colorClass="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 col-span-2"
                                                icon="🥅"
                                            />
                                        </>
                                    )}
                                    {step === 3 && (
                                        <>
                                            <div className="col-span-2 grid grid-cols-4 gap-2">
                                                <button
                                                    onClick={() => handleGuess("suit", "hearts")}
                                                    className="aspect-square rounded-lg bg-red-50 text-red-500 text-2xl flex flex-col items-center justify-center hover:bg-red-100 shadow-sm active:scale-95 transition-all"
                                                >
                                                    ♥
                                                    <span className="text-[9px] opacity-70 font-mono">{odds["hearts"]}%</span>
                                                </button>
                                                <button
                                                    onClick={() => handleGuess("suit", "diamonds")}
                                                    className="aspect-square rounded-lg bg-red-50 text-red-500 text-2xl flex flex-col items-center justify-center hover:bg-red-100 shadow-sm active:scale-95 transition-all"
                                                >
                                                    ♦
                                                    <span className="text-[9px] opacity-70 font-mono">{odds["diamonds"]}%</span>
                                                </button>
                                                <button
                                                    onClick={() => handleGuess("suit", "clubs")}
                                                    className="aspect-square rounded-lg bg-slate-100 text-slate-800 text-2xl flex flex-col items-center justify-center hover:bg-slate-200 shadow-sm active:scale-95 transition-all"
                                                >
                                                    ♣
                                                    <span className="text-[9px] opacity-70 font-mono">{odds["clubs"]}%</span>
                                                </button>
                                                <button
                                                    onClick={() => handleGuess("suit", "spades")}
                                                    className="aspect-square rounded-lg bg-slate-100 text-slate-800 text-2xl flex flex-col items-center justify-center hover:bg-slate-200 shadow-sm active:scale-95 transition-all"
                                                >
                                                    ♠
                                                    <span className="text-[9px] opacity-70 font-mono">{odds["spades"]}%</span>
                                                </button>
                                            </div>
                                            {isRainbowPossible() && (
                                                <GameButton
                                                    label="Rainbow!"
                                                    odds={odds["rainbow"]}
                                                    subLabel="Guess Missing Suit"
                                                    onClick={() => handleGuess("rainbow")}
                                                    colorClass="bg-gradient-to-r from-pink-100 via-yellow-100 to-sky-100 text-indigo-800 hover:opacity-90 col-span-2 mt-1"
                                                    icon={<FaPalette className="inline" />}
                                                    isRainbow={true}
                                                />
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- VIEW: RESULT --- */}
                {view === "result" && (
                    <div className="flex-1 flex flex-col items-center p-4 text-center animate-in zoom-in-95 duration-500 overflow-y-auto w-full">
                        <div className="mt-1 mb-4 space-y-1">
                            <h2 className="text-2xl font-black text-slate-800">Ride Complete!</h2>
                        </div>

                        {/* A. Prominent Stops */}
                        <div className="bg-indigo-50 border-2 border-indigo-100 rounded-3xl p-4 mb-4 w-full max-w-sm relative overflow-hidden flex flex-col items-center justify-center min-h-[120px] flex-shrink-0">
                            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                                <FaBus className="text-9xl text-indigo-500 transform rotate-12" />
                            </div>
                            <div className="text-6xl font-black text-indigo-600 relative z-10 leading-none">{stops}</div>
                            <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest relative z-10 mt-1">Total Stops</div>
                        </div>

                        {/* B & C. Questions & Accuracy */}
                        <div className="grid grid-cols-2 gap-3 w-full max-w-sm mb-4 flex-shrink-0">
                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col items-center justify-center min-h-[80px]">
                                <div className="text-2xl font-black text-slate-700">{getEndGameStats().totalAnswers}</div>
                                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center mt-1">Questions</div>
                            </div>
                            <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 flex flex-col items-center justify-center min-h-[80px]">
                                <div className="text-2xl font-black text-emerald-600">{getEndGameStats().accuracy}%</div>
                                <div className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider text-center mt-1">Accuracy</div>
                            </div>
                        </div>

                        {/* D. Suit Distribution (Horizontal Bar) */}
                        <div className="w-full max-w-sm mb-4 flex-shrink-0">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-left ml-1">Card Distribution</div>
                            <div className="h-12 w-full flex rounded-xl overflow-hidden shadow-sm border border-slate-100 bg-slate-50">
                                {(['hearts', 'diamonds', 'clubs', 'spades'] as Suit[]).map(suit => {
                                    const count = getEndGameStats().suitCounts[suit];
                                    const pct = getEndGameStats().totalSuits > 0 ? (count / getEndGameStats().totalSuits) * 100 : 0;
                                    const bg = suit === 'hearts' ? 'bg-rose-500' : suit === 'diamonds' ? 'bg-red-500' : suit === 'clubs' ? 'bg-slate-700' : 'bg-slate-900';
                                    const textColor = (suit === 'hearts' || suit === 'diamonds') ? 'text-white' : 'text-slate-200';

                                    if (count === 0) return null;

                                    return (
                                        <div key={suit} style={{ width: `${pct}%` }} className={`${bg} flex flex-col items-center justify-center relative group`}>
                                            <span className={`font-bold ${pct < 10 ? 'text-xs' : 'text-sm'} ${textColor}`}>{SUIT_SYMBOLS[suit]}</span>
                                            {pct > 15 && <span className={`text-[10px] ${textColor} opacity-80`}>{count}</span>}
                                        </div>
                                    )
                                })}
                                {getEndGameStats().totalSuits === 0 && <div className="w-full flex items-center justify-center text-xs text-slate-400 font-mono">No cards needed!</div>}
                            </div>
                        </div>

                        {/* E. Wrong Answer Distribution (Nemesis) */}
                        <div className="w-full max-w-sm mb-6 flex-shrink-0">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-left ml-1"> Questions that stopped you</div>
                            <div className="grid grid-cols-4 gap-2 h-28 items-end bg-slate-50 rounded-xl p-3 border border-slate-100">
                                {getEndGameStats().stepFailures.map((failures, idx) => {
                                    const max = Math.max(...getEndGameStats().stepFailures, 1); // Avoid div by zero
                                    const heightPct = (failures / max) * 100;
                                    const labels = ["Color", "Hi/Lo", "In/Out", "Suit"];

                                    return (
                                        <div key={idx} className="flex flex-col items-center justify-end h-full gap-2 w-full">
                                            <div className="relative w-full flex-1 flex items-end justify-center bg-slate-100 rounded-lg overflow-hidden">
                                                <div
                                                    className={`w-full transition-all duration-500 ${failures > 0 ? (failures === getEndGameStats().maxFailures ? "bg-orange-400" : "bg-slate-300") : "bg-transparent"}`}
                                                    style={{ height: failures > 0 ? `${heightPct}%` : '0%' }}
                                                />
                                                {failures > 0 && (
                                                    <span className="absolute bottom-1 text-xs font-bold text-white shadow-sm filter drop-shadow-md">{failures}</span>
                                                )}
                                            </div>
                                            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tight text-center leading-none">{labels[idx]}</div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {!hasSubmitted ? (
                            <div className="w-full space-y-4 max-w-sm animate-in slide-in-from-bottom duration-500">
                                <div className="space-y-2">
                                    <div className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Save your Record</div>

                                    <div className="flex gap-2 relative">
                                        {/* Emoji Toggle */}
                                        <div className="relative">
                                            <button
                                                onClick={() => setShowEmojiMenu(!showEmojiMenu)}
                                                className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-2xl border-2 border-transparent hover:bg-slate-200 transition-colors"
                                            >
                                                {playerEmoji}
                                            </button>

                                            {/* Emoji Menu Popover */}
                                            {showEmojiMenu && (
                                                <div className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-50 grid grid-cols-6 gap-2 animate-in zoom-in-95 leading-none">
                                                    {EMOJIS.map(e => (
                                                        <button
                                                            key={e}
                                                            onClick={() => {
                                                                setPlayerEmoji(e);
                                                                setShowEmojiMenu(false);
                                                            }}
                                                            className={`text-xl p-1.5 rounded-md hover:bg-slate-100 transition-colors ${playerEmoji === e ? "bg-indigo-50 ring-2 ring-indigo-200" : ""}`}
                                                        >
                                                            {e}
                                                        </button>
                                                    ))}
                                                    <button
                                                        onClick={() => setShowEmojiMenu(false)}
                                                        className="col-span-6 mt-1 py-1 text-xs text-slate-400 hover:text-slate-600 font-bold bg-slate-50 rounded"
                                                    >
                                                        Close
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <input
                                            type="text"
                                            placeholder="Your Name"
                                            value={playerName}
                                            onChange={(e) => setPlayerName(e.target.value)}
                                            className="flex-1 h-12 px-3 rounded-lg border-2 border-slate-200 focus:border-indigo-400 outline-none font-bold text-slate-700 bg-white"
                                            maxLength={10}
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={submitScore}
                                    disabled={!playerName.trim()}
                                    className="w-full py-4 bg-slate-900 text-white rounded-lg font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                                >
                                    Save Record
                                </button>

                                <button
                                    onClick={() => {
                                        setStops(0);
                                        setStep(0);
                                        setView("intro");
                                    }}
                                    className="w-full py-2 text-slate-400 font-bold hover:text-slate-600 text-sm transition-colors"
                                >
                                    Skip & Return to Title
                                </button>
                            </div>
                        ) : (
                            <div className="w-full max-w-sm space-y-4 animate-in zoom-in duration-300">
                                <div className="bg-green-100 text-green-700 p-4 rounded-lg font-bold flex items-center justify-center gap-2 mb-6">
                                    <FaCheckCircle /> Score Saved!
                                </div>

                                <button
                                    onClick={startGame}
                                    className="w-full py-4 bg-indigo-500 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-600 active:bg-indigo-700 transition-all flex items-center justify-center gap-2 text-lg"
                                >
                                    <FaPlay /> Ride Again
                                </button>

                                <button
                                    onClick={() => {
                                        setStops(0);
                                        setStep(0);
                                        setView("intro");
                                    }}
                                    className="w-full py-4 bg-slate-100 text-slate-600 font-bold rounded-lg hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                                >
                                    <FaList /> View Leaderboard
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
