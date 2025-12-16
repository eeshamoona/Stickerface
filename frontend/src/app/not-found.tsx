"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { FaGhost, FaHome, FaPlay, FaRedo } from "react-icons/fa";

// Game Constants
const GRAVITY = 0.6;
const JUMP_FORCE = -10;
const OBSTACLE_SPEED_INITIAL = 5;
const OBSTACLE_SPAWN_Rate = 1500; // ms
const GAME_WIDTH = 600;
const GAME_HEIGHT = 200;
const DINO_SIZE = 40; // 40px
const OBSTACLE_SIZE = 30; // 30px
const GROUND_Y = GAME_HEIGHT - DINO_SIZE;

export default function NotFound() {
    // Game State
    const [isPlaying, setIsPlaying] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);

    // Refs for game loop (avoiding re-renders for 60fps logic)
    const requestRef = useRef<number>(0);
    const lastTimeRef = useRef<number>(0);
    const scoreRef = useRef<number>(0);
    const obstacleSpeedRef = useRef<number>(OBSTACLE_SPEED_INITIAL);
    const lastSpawnTimeRef = useRef<number>(0);

    // Game Objects
    const [dinoY, setDinoY] = useState(GROUND_Y);
    const dinoYRef = useRef(GROUND_Y);
    const dinoVelocityRef = useRef(0);
    const [obstacles, setObstacles] = useState<{ id: number; x: number; passed: boolean }[]>([]);
    const obstaclesRef = useRef<{ id: number; x: number; passed: boolean }[]>([]);

    // Load High Score
    useEffect(() => {
        const saved = localStorage.getItem("ghost_runner_highscore");
        if (saved) setHighScore(parseInt(saved, 10));
    }, []);

    const handleGameOver = useCallback(() => {
        cancelAnimationFrame(requestRef.current);
        setGameOver(true);
        setIsPlaying(false);
        if (scoreRef.current > highScore) {
            setHighScore(scoreRef.current);
            localStorage.setItem("ghost_runner_highscore", scoreRef.current.toString());
        }
    }, [highScore]);

    const gameLoop = useCallback((time: number) => {
        lastTimeRef.current = time;

        // 1. Update Dino Physics
        dinoVelocityRef.current += GRAVITY;
        dinoYRef.current += dinoVelocityRef.current;

        // Floor Collision
        if (dinoYRef.current > GROUND_Y) {
            dinoYRef.current = GROUND_Y;
            dinoVelocityRef.current = 0;
        }
        setDinoY(dinoYRef.current);

        // 2. Spawn Obstacles
        if (time - lastSpawnTimeRef.current > OBSTACLE_SPAWN_Rate / (obstacleSpeedRef.current / 5)) {
            // Add minimal randomness to spawn logic
            if (Math.random() > 0.3) {
                obstaclesRef.current.push({
                    id: Date.now(),
                    x: GAME_WIDTH,
                    passed: false
                });
                lastSpawnTimeRef.current = time;
            }
        }

        // 3. Update Obstacles & Collision
        const newObstacles = [];
        for (const obs of obstaclesRef.current) {
            obs.x -= obstacleSpeedRef.current;

            // Collision Check (AABB)
            const dinoLeft = 50; // Fixed x position
            const dinoRight = 50 + DINO_SIZE - 10; // Padding
            const dinoTop = dinoYRef.current + 10; // Padding
            const dinoBottom = dinoYRef.current + DINO_SIZE;

            const obsLeft = obs.x + 5;
            const obsRight = obs.x + OBSTACLE_SIZE - 5;
            const obsTop = GROUND_Y + (DINO_SIZE - OBSTACLE_SIZE) + 5; // Obstacles align bottom
            const obsBottom = GROUND_Y + DINO_SIZE;

            if (
                dinoRight > obsLeft &&
                dinoLeft < obsRight &&
                dinoBottom > obsTop &&
                dinoTop < obsBottom
            ) {
                // Game Over
                handleGameOver();
                return; // Stop Loop
            }

            // Score Update
            if (!obs.passed && obsRight < dinoLeft) {
                obs.passed = true;
                scoreRef.current += 1;
                setScore(scoreRef.current);
                // Increase difficulty
                if (scoreRef.current % 5 === 0) {
                    obstacleSpeedRef.current += 0.5;
                }
            }

            // Keep valid obstacles
            if (obs.x > -OBSTACLE_SIZE) {
                newObstacles.push(obs);
            }
        }
        obstaclesRef.current = newObstacles;
        setObstacles([...obstaclesRef.current]); // Trigger render for obstacles

        requestRef.current = requestAnimationFrame(gameLoop);
    }, [handleGameOver]);

    const startGame = useCallback(() => {
        setIsPlaying(true);
        setGameOver(false);
        setScore(0);
        scoreRef.current = 0;
        obstacleSpeedRef.current = OBSTACLE_SPEED_INITIAL;

        // Reset Physics
        dinoYRef.current = GROUND_Y;
        setDinoY(GROUND_Y);
        dinoVelocityRef.current = 0;

        // Clear Obstacles
        obstaclesRef.current = [];
        setObstacles([]);

        lastTimeRef.current = performance.now();
        lastSpawnTimeRef.current = performance.now();
        requestRef.current = requestAnimationFrame(gameLoop);
    }, [gameLoop]);

    const jump = useCallback(() => {
        if (!isPlaying || gameOver) {
            if (gameOver) startGame(); // Restart on jump if game over
            return;
        }
        // Only jump if on ground
        if (dinoYRef.current >= GROUND_Y - 1) { // Tolerance
            dinoVelocityRef.current = JUMP_FORCE;
        }
    }, [isPlaying, gameOver, startGame]);

    // Handle Input
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === "Space" || e.code === "ArrowUp") {
                e.preventDefault();
                jump();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [jump]);

    // Cleanup
    useEffect(() => {
        return () => cancelAnimationFrame(requestRef.current);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans text-slate-800 overflow-hidden select-none">

            {/* 1. Header Area */}
            <div className="text-center mb-6 space-y-2 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="inline-flex items-center justify-center bg-indigo-100 p-4 rounded-full mb-2 shadow-inner">
                    <h1 className="text-4xl font-black text-indigo-600 tracking-tighter">404</h1>
                </div>
                <h2 className="text-xl font-bold text-slate-600">Page Not Found</h2>
                <p className="text-slate-400 text-sm">But you found a ghost!</p>
            </div>

            {/* 2. Game Container */}
            <div
                className="relative bg-white rounded-xl shadow-xl w-full max-w-[600px] h-[200px] border-2 border-slate-200 overflow-hidden cursor-pointer active:cursor-grabbing hover:shadow-2xl transition-shadow"
                onClick={jump}
            >
                {/* Background Clouds (Parallax-ish) */}
                {!gameOver && isPlaying && (
                    <div className="absolute top-4 left-0 w-full h-full opacity-30 pointer-events-none">
                        <div className="animate-float-cloud text-4xl absolute top-0 -left-10">☁️</div>
                        <div className="animate-float-cloud-slow text-4xl absolute top-8 left-1/2">☁️</div>
                    </div>
                )}

                {/* Score HUD */}
                <div className="absolute top-2 right-2 flex gap-4 font-mono text-sm font-bold z-10">
                    <div className="text-slate-400">HI {highScore.toString().padStart(5, '0')}</div>
                    <div className="text-slate-800">{score.toString().padStart(5, '0')}</div>
                </div>

                {/* Start / Game Over Overlay */}
                {(!isPlaying) && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center p-4">
                        {gameOver ? (
                            <>
                                <h3 className="text-2xl font-black text-slate-800 mb-1">GAME OVER</h3>
                                <p className="text-slate-500 font-bold mb-4">Score: {score}</p>
                                <button
                                    onClick={(e) => { e.stopPropagation(); startGame(); }}
                                    className="flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full font-bold shadow-lg transition-transform active:scale-95"
                                >
                                    <FaRedo /> Try Again
                                </button>
                            </>
                        ) : (
                            <>
                                <FaGhost className="text-4xl text-indigo-400 mb-2 animate-bounce" />
                                <p className="text-slate-500 font-bold mb-4">Tap or Space to Jump</p>
                                <button
                                    onClick={(e) => { e.stopPropagation(); startGame(); }}
                                    className="flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full font-bold shadow-lg transition-transform active:scale-95"
                                >
                                    <FaPlay /> Start Run
                                </button>
                            </>
                        )}
                    </div>
                )}

                {/* DINO (Ghost) */}
                <div
                    className="absolute left-[50px] transition-transform"
                    style={{
                        top: `${dinoY}px`,
                        width: `${DINO_SIZE}px`,
                        height: `${DINO_SIZE}px`,
                        // Rotate a bit when jumping
                        transform: dinoY < GROUND_Y ? 'rotate(-10deg)' : 'rotate(0deg)'
                    }}
                >
                    <div className="text-[35px] leading-none filter drop-shadow-sm">👻</div>
                </div>

                {/* OBSTACLES */}
                {obstacles.map(obs => (
                    <div
                        key={obs.id}
                        className="absolute text-center flex items-center justify-center font-black text-rose-500 text-xs bg-rose-100 border border-rose-200 rounded-md"
                        style={{
                            left: `${obs.x}px`,
                            top: `${GROUND_Y + (DINO_SIZE - OBSTACLE_SIZE)}px`, // Align bottom
                            width: `${OBSTACLE_SIZE}px`,
                            height: `${OBSTACLE_SIZE}px`
                        }}
                    >
                        404
                    </div>
                ))}

                {/* Ground Line */}
                <div className="absolute bottom-0 w-full h-[2px] bg-slate-200"></div>
            </div>

            {/* 3. Footer / Home Button */}
            <div className="mt-8 text-center">
                <Link
                    href="/"
                    className="
            inline-flex items-center gap-2 px-6 py-3 
            text-slate-500 font-bold 
            bg-white hover:bg-slate-50 border border-slate-200 
            rounded-xl transition-all hover:scale-105 active:scale-95
            "
                >
                    <FaHome /> Go Home
                </Link>
            </div>

            {/* Global Keyframes for clouds */}
            <style jsx global>{`
        @keyframes float-cloud {
            0% { transform: translateX(600px); }
            100% { transform: translateX(-100px); }
        }
        .animate-float-cloud {
            animation: float-cloud 8s linear infinite;
        }
        .animate-float-cloud-slow {
            animation: float-cloud 12s linear infinite;
        }
      `}</style>
        </div>
    );
}
