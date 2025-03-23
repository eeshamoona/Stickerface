'use client';

import Link from 'next/link';
import { stickers } from '../lib/data';

export default function Home() {
  return (
    <div className="sticker-sheet min-h-screen flex flex-col items-center p-6 bg-black text-white">
      <h1 className="text-4xl font-bold mb-6 mt-8">Stickerface</h1>
      <p className="text-xl mb-12">Tap a sticker to activate its magic!</p>
      
      <div className="grid grid-cols-2 w-full max-w-md gap-y-8">
        <div className="flex flex-col items-center gap-y-8">
          {stickers.slice(0, Math.ceil(stickers.length / 2)).map((sticker) => (
            <Link key={sticker.id} href={`/sticker/${sticker.id}`} className="flex flex-col items-center">
              <div className="mb-2">
                <div 
                  className="sticker w-24 h-24 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: sticker.color, boxShadow: '0 4px 8px rgba(0,0,0,0.3)' }}
                >
                  <span className="text-4xl">
                    {getEmojiForType(sticker.type)}
                  </span>
                </div>
              </div>
              <div className="text-center">
                <div>{sticker.name}</div>
                <div className="text-gray-400">Click to view</div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="flex flex-col items-center gap-y-8">
          {stickers.slice(Math.ceil(stickers.length / 2)).map((sticker) => (
            <Link key={sticker.id} href={`/sticker/${sticker.id}`} className="flex flex-col items-center">
              <div className="mb-2">
                <div 
                  className="sticker w-24 h-24 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: sticker.color, boxShadow: '0 4px 8px rgba(0,0,0,0.3)' }}
                >
                  <span className="text-4xl">
                    {getEmojiForType(sticker.type)}
                  </span>
                </div>
              </div>
              <div className="text-center">
                <div>{sticker.name}</div>
                <div className="text-gray-400">Click to view</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper function for temporary emoji placeholders
function getEmojiForType(type: string): string {
  switch(type) {
    case 'fortune': return '🔮';
    case 'pet': return '🐱';
    case 'weather': return '☁️';
    case 'music': return '🎵';
    case 'game': return '🎮';
    case 'art': return '🎨';
    default: return '⭐';
  }
}