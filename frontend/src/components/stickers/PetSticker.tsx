
// Example sticker component - src/components/stickers/PetSticker.tsx
'use client';

import { useState, useEffect } from 'react';

type Mood = 'happy' | 'sleepy' | 'hungry' | 'playful';

export default function PetSticker() {
  const [mood, setMood] = useState<Mood>('sleepy');
  const [pats, setPats] = useState(0);
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const timeSinceInteraction = now - lastInteraction;
      
      // Change mood based on time elapsed
      if (timeSinceInteraction > 20000) {
        setMood('sleepy');
      } else if (pats > 10) {
        setMood('happy');
      } else if (pats > 5) {
        setMood('playful');
      } else {
        setMood('hungry');
      }
    }, 5000);
    
    return () => clearInterval(timer);
  }, [lastInteraction, pats]);
  
  const handleInteract = () => {
    setPats(prev => prev + 1);
    setLastInteraction(Date.now());
  };
  
  const renderPet = () => {
    switch (mood) {
      case 'happy':
        return '😺';
      case 'sleepy':
        return '😴';
      case 'hungry':
        return '🥺';
      case 'playful':
        return '😸';
      default:
        return '😺';
    }
  };
  
  return (
    <div className="p-4 flex flex-col items-center">
      <div 
        className="w-48 h-48 bg-pink-100 rounded-full flex flex-col items-center justify-center cursor-pointer"
        onClick={handleInteract}
      >
        <div className="text-6xl mb-2">{renderPet()}</div>
        <div className="text-pink-800 text-sm font-medium">
          {mood === 'sleepy' && 'Zzz... (tap to wake)'}
          {mood === 'hungry' && 'Feed me with pats!'}
          {mood === 'happy' && 'So happy!'}
          {mood === 'playful' && 'Let\'s play!'}
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        Pats: {pats}
      </div>
      
      <div className="mt-2 flex space-x-2">
        <button 
          onClick={() => {setPats(0); setMood('hungry');}}
          className="bg-pink-500 text-white px-3 py-1 rounded-full text-xs"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
