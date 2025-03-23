// src/components/stickers/FortuneSticker.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Engine, Render, World, Bodies, Body, Events, Mouse, MouseConstraint } from 'matter-js';

interface FortuneCookie {
  body: Body;
  opened: boolean;
  fortune: string;
  angle: number;
}

const fortunes = [
  "A beautiful, smart, and loving person will be coming into your life.",
  "Your creativity will make you successful in a most unexpected way.",
  "Your hard work is about to pay off. Remember, dreams are the seeds of reality.",
  "The greatest risk is not taking one.",
  "A dubious friend may be an enemy in camouflage.",
  "A journey of a thousand miles begins with a single step.",
  "You will travel to many exotic places.",
  "Your ability to juggle many tasks will take you far.",
  "The cure for boredom is curiosity.",
  "Your smile lights up someone's day.",
  "Embrace the glorious mess that you are.",
  "A lifetime of happiness awaits you."
];

export default function FortuneSticker() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const renderRef = useRef<Render | null>(null);
  const cookiesRef = useRef<FortuneCookie[]>([]);
  const mouseConstraintRef = useRef<MouseConstraint | null>(null);
  
  const [openedFortune, setOpenedFortune] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  
  // Initialize the physics engine
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current || gameStarted) return;
    
    // Create engine
    const engine = Engine.create({
      gravity: { x: 0, y: 1, scale: 0.001 }
    });
    engineRef.current = engine;
    
    // Create renderer
    const render = Render.create({
      element: containerRef.current,
      engine: engine,
      canvas: canvasRef.current,
      options: {
        width: containerRef.current.clientWidth,
        height: 400,
        background: 'transparent',
        wireframes: false
      }
    });
    renderRef.current = render;
    
    // Add walls
    const wallOptions = { 
      isStatic: true, 
      render: { 
        fillStyle: 'transparent',
        strokeStyle: 'rgba(255, 215, 0, 0.2)',
        lineWidth: 1
      }
    };
    
    const width = containerRef.current.clientWidth;
    const height = 400;
    
    World.add(engine.world, [
      // Walls
      Bodies.rectangle(width / 2, height + 50, width, 100, wallOptions), // Bottom
      Bodies.rectangle(-50, height / 2, 100, height, wallOptions), // Left
      Bodies.rectangle(width + 50, height / 2, 100, height, wallOptions) // Right
    ]);
    
    // Add mouse control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    });
    mouseConstraintRef.current = mouseConstraint;
    
    World.add(engine.world, mouseConstraint);
    
    // Handle mouse clicks on fortune cookies
    Events.on(mouseConstraint, 'mousedown', (event) => {
      const mousePosition = event.mouse.position;
      
      for (let i = 0; i < cookiesRef.current.length; i++) {
        const cookie = cookiesRef.current[i];
        
        if (cookie.opened) continue;
        
        // Check if the mouse click is on this cookie
        const cookiePosition = cookie.body.position;
        const distance = Math.sqrt(
          Math.pow(mousePosition.x - cookiePosition.x, 2) + 
          Math.pow(mousePosition.y - cookiePosition.y, 2)
        );
        
        // If close enough to the cookie, "open" it
        if (distance < 40) {
          cookie.opened = true;
          
          // Apply a small upward force when opened
          Body.applyForce(
            cookie.body,
            cookiePosition,
            { x: 0, y: -0.05 }
          );
          
          // Show the fortune
          setOpenedFortune(cookie.fortune);
          break;
        }
      }
    });
    
    // Start the engine and renderer
    Render.run(render);
    
    const runner = requestAnimationFrame(function animate() {
      Engine.update(engine, 1000 / 60);
      requestAnimationFrame(animate);
    });
    
    // Cleanup function
    return () => {
      if (render) {
        Render.stop(render);
        World.clear(engine.world, false);
        Engine.clear(engine);
        render.canvas.remove();
        cancelAnimationFrame(runner);
      }
    };
  }, [gameStarted]);
  
  // Function to create and drop fortune cookies
  const startGame = () => {
    if (!engineRef.current || !renderRef.current || !containerRef.current) return;
    
    setGameStarted(true);
    cookiesRef.current = [];
    setOpenedFortune(null);
    
    // Create cookies with random positions at the top
    const width = containerRef.current.clientWidth;
    const cookieCount = Math.min(8, Math.floor(width / 50)); // Adjust number based on width
    
    for (let i = 0; i < cookieCount; i++) {
      const x = (width / (cookieCount + 1)) * (i + 1);
      const y = -50 - (Math.random() * 200); // Start above the visible area
      
      const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
      const angle = Math.random() * Math.PI;
      
      // Create a fortune cookie shape (simplified as circle for now)
      const cookie = Bodies.circle(x, y, 25, {
        restitution: 0.6,
        friction: 0.1,
        frictionAir: 0.03,
        render: {
          sprite: {
            texture: '/cookie-closed.svg', // This will be replaced with your SVG
            xScale: 0.5,
            yScale: 0.5
          }
        }
      });
      
      // Random initial velocity
      Body.setVelocity(cookie, { 
        x: (Math.random() - 0.5) * 3, 
        y: Math.random() * 2 
      });
      
      // Random spin
      Body.setAngularVelocity(cookie, (Math.random() - 0.5) * 0.1);
      
      World.add(engineRef.current.world, cookie);
      
      // Store the cookie with its fortune
      cookiesRef.current.push({
        body: cookie,
        opened: false,
        fortune,
        angle
      });
    }
    
    // Update rendering to show fortune cookies
    updateCookieRendering();
  };
  
  // Custom rendering function to draw fortune cookies
  const updateCookieRendering = () => {
    if (!renderRef.current || !cookiesRef.current.length) return;
    
    // This function could update the sprites or appearance based on the cookie state
    // For now it's placeholder for when you have real SVGs
    cookiesRef.current.forEach(cookie => {
      if (cookie.opened) {
        // Update appearance for opened cookie
        cookie.body.render.sprite = {
          texture: '/cookie-opened.svg', // Replace with your opened cookie SVG
          xScale: 0.5,
          yScale: 0.5
        };
      }
    });
  };
  
  return (
    <div className="fortune-teller w-full flex flex-col items-center">
      {/* SVG for closed and opened cookies - will be used as sprite textures */}
      <div className="hidden">
        {/* These SVGs would be referenced by the physics engine */}
        <svg id="cookie-closed" width="100" height="100" viewBox="0 0 100 100">
          <ellipse cx="50" cy="50" rx="45" ry="25" fill="#F5DEB3" stroke="#D2B48C" strokeWidth="2" />
          <path d="M20,50 Q50,70 80,50" fill="none" stroke="#D2B48C" strokeWidth="2" />
        </svg>
        
        <svg id="cookie-opened" width="100" height="100" viewBox="0 0 100 100">
          <path d="M5,40 Q50,80 95,40" fill="#F5DEB3" stroke="#D2B48C" strokeWidth="2" />
          <rect x="25" y="42" width="50" height="30" fill="white" stroke="#D2B48C" strokeWidth="1" />
        </svg>
      </div>
      
      {openedFortune && (
        <div className="fortune-paper absolute z-10 p-4 bg-white text-black rounded shadow-lg max-w-md text-center transform -translate-y-20">
          <p className="font-serif">{openedFortune}</p>
        </div>
      )}
      
      <div 
        ref={containerRef} 
        className="fortune-container relative w-full max-w-md h-96 bg-gray-900 rounded-lg overflow-hidden"
      >
        <canvas ref={canvasRef} />
        
        {!gameStarted && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-80 z-10">
            <div className="text-6xl mb-4">🥠</div>
            <p className="text-center mb-4 text-white">Tap to drop fortune cookies!</p>
            <button
              onClick={startGame}
              className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full transition"
            >
              Start
            </button>
          </div>
        )}
        
        {gameStarted && (
          <div className="absolute bottom-4 right-4 z-10">
            <button
              onClick={startGame}
              className="px-4 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded-full transition"
            >
              New Cookies
            </button>
          </div>
        )}
      </div>
      
      <div className="instructions mt-4 text-sm text-gray-400 text-center">
        <p>Click on a fortune cookie to reveal your fortune!</p>
      </div>
    </div>
  );
}