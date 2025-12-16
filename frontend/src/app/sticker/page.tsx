"use client";

import Link from "next/link";
import { stickers } from "../../lib/sticker";
import {
  FaMagic,
  FaHatWizard,
  FaSun,
  FaHandPointer,
  FaCat,
  FaBus,
  FaStar
} from "react-icons/fa";
import { Nunito } from "next/font/google";

const nunito = Nunito({ subsets: ["latin"], weight: ["500", "600", "700"] });

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-gray-800 font-sans overflow-hidden flex flex-col">
      <header className="px-6 py-8 md:py-12 z-10 bg-[#FDFBF7]/80 backdrop-blur-sm sticky top-0 md:static">
        <div className="max-w-7xl mx-auto text-center md:text-center">
            <h1 className={`text-3xl md:text-4xl font-bold tracking-tight mb-2 text-indigo-900 ${nunito.className}`}>
            Stickers
          </h1>
          <p className="text-sm text-gray-500 max-w-lg mx-auto">
            Click to play the stickers that come to life
          </p>
        </div>
      </header>

      {/* Main Sticker Grid Container */}
      <main className="flex-grow w-full px-4 sm:px-6 py-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 justify-items-center">
          {stickers.map((sticker) => (
            <div
              key={sticker.id}
              className="flex flex-col items-center group cursor-pointer"
            >
              <Link href={`/sticker/${sticker.id}`} className="flex flex-col items-center text-center w-full">

                {/* Sticker Visual - Icon with Die-Cut Effect */}
                {/* 
                   We use a drop-shadow filter sequence to simulate a white sticker border 
                   around the arbitrary icon shape.
                */}
                <div
                  className="relative transition-all duration-300 transform hover:-rotate-3 hover:scale-110"
                  style={{
                    color: sticker.color,
                    filter: "drop-shadow(0px 0px 4px white) drop-shadow(0px 0px 0px white) drop-shadow(0px 2px 4px rgba(0,0,0,0.15))"
                  }}
                >
                  <div className="relative p-4">
                    {/* Double-layer icon to ensure border visibility if needed, 
                        or just applying filter to the parent is enough for simple shapes */}
                    {getIconForType(sticker.type)}
                  </div>
                </div>

                {/* Caption Below - Title & Description */}
                <div className="mt-6 flex flex-col items-center max-w-[180px]">
                  <h3
                    className="font-extrabold text-sm md:text-base uppercase tracking-wide leading-tight mb-1"
                    style={{ color: sticker.color }}
                  >
                    {sticker.name}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium leading-snug">
                    {sticker.description}
                  </p>
                </div>

              </Link>
            </div>
          ))}
        </div>
      </main>

      {/* Clean up global styles - removed scrollbar verify code */}
    </div>
  );
}

// Helper function for aesthetic icon placeholders
function getIconForType(type: string) {
  const iconSize = 64; // Increased from 48 to 64 for visual balance without the circle container
  switch (type) {
    case "fortune":
      return <FaMagic size={iconSize} />;
    case "spell":
      return <FaHatWizard size={iconSize} />;
    case "perfect-day":
      return <FaSun size={iconSize} />;
    case "button":
      return <FaHandPointer size={iconSize} />;
    case "purrfect-timing":
      return <FaCat size={iconSize} />;
    case "ride-the-bus":
      return <FaBus size={iconSize} />;
    default:
      return <FaStar size={iconSize} />;
  }
}
