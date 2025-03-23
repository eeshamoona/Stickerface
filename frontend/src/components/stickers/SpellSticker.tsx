'use client';

import React, { useState, useEffect } from 'react';

type Ingredient = {
  name: string;
  description: string;
  color: string;
  amount: number;
  maxAmount: number;
  icon: string;
};

export default function SpellSticker() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    {
      name: 'Blanket of Clouds',
      description: 'Brings comfort and peace of mind',
      color: '#E0E7FF',
      amount: 0,
      maxAmount: 3,
      icon: '☁️'
    },
    {
      name: 'Dash of Love',
      description: 'Adds warmth and compassion',
      color: '#FECDD3',
      amount: 0,
      maxAmount: 3,
      icon: '❤️'
    },
    {
      name: 'Garden of Serenity',
      description: 'Calms the mind and soothes the soul',
      color: '#A7F3D0',
      amount: 0,
      maxAmount: 3,
      icon: '🌿'
    },
    {
      name: "Moon's Embrace",
      description: 'Brings restful sleep and peaceful dreams',
      color: '#C7D2FE',
      amount: 0,
      maxAmount: 3,
      icon: '🌙'
    },
    {
      name: 'Crystal of Clarity',
      description: 'Clears the mind and enhances focus',
      color: '#BFDBFE',
      amount: 0,
      maxAmount: 3,
      icon: '💎'
    },
    {
      name: 'Glow of Light',
      description: 'Dispels darkness and brings hope',
      color: '#FEF3C7',
      amount: 0,
      maxAmount: 3,
      icon: '✨'
    }
  ]);

  const [spellResult, setSpellResult] = useState<string>('');
  const [spellCast, setSpellCast] = useState<boolean>(false);
  const [spellAnimation, setSpellAnimation] = useState<boolean>(false);

  // Calculate total ingredients added
  const totalIngredients = ingredients.reduce((sum, ingredient) => sum + ingredient.amount, 0);

  // Handle adding an ingredient
  const addIngredient = (index: number) => {
    if (ingredients[index].amount < ingredients[index].maxAmount) {
      const newIngredients = [...ingredients];
      newIngredients[index].amount += 1;
      setIngredients(newIngredients);
    }
  };

  // Handle removing an ingredient
  const removeIngredient = (index: number) => {
    if (ingredients[index].amount > 0) {
      const newIngredients = [...ingredients];
      newIngredients[index].amount -= 1;
      setIngredients(newIngredients);
    }
  };

  // Reset the spell
  const resetSpell = () => {
    const resetIngredients = ingredients.map(ingredient => ({
      ...ingredient,
      amount: 0
    }));
    setIngredients(resetIngredients);
    setSpellResult('');
    setSpellCast(false);
  };

  // Cast the spell and generate a result
  const castSpell = () => {
    if (totalIngredients === 0) {
      setSpellResult('Add some ingredients to create your spell!');
      return;
    }

    setSpellAnimation(true);
    setTimeout(() => {
      setSpellAnimation(false);
      setSpellCast(true);
      
      // Generate spell result based on ingredients
      const spellMessages = [
        'Your stress melts away like snow in sunshine.',
        'A wave of calm washes over you, bringing peace.',
        'Your mind clears, revealing a path forward.',
        'Worries dissolve as serenity fills your heart.',
        'A gentle warmth spreads through you, easing tension.',
        'Your breath deepens as tranquility embraces you.'
      ];
      
      // Create a personalized message based on ingredients
      let message = 'Your spell has been cast! ';
      
      // Add specific effects based on predominant ingredients
      const maxIngredient = [...ingredients].sort((a, b) => b.amount - a.amount)[0];
      if (maxIngredient.amount > 0) {
        switch (maxIngredient.name) {
          case 'Blanket of Clouds':
            message += 'You feel wrapped in comfort and protection. ';
            break;
          case 'Dash of Love':
            message += 'Warmth and compassion fill your heart. ';
            break;
          case 'Garden of Serenity':
            message += 'A sense of calm and balance restores you. ';
            break;
          case "Moon's Embrace":
            message += 'Your mind quiets, ready for peaceful rest. ';
            break;
          case 'Crystal of Clarity':
            message += 'Your thoughts become clear and focused. ';
            break;
          case 'Glow of Light':
            message += 'Hope shines within you, brightening your path. ';
            break;
        }
      }
      
      // Add a random general effect
      message += spellMessages[Math.floor(Math.random() * spellMessages.length)];
      
      // Add potency based on total ingredients
      if (totalIngredients > 10) {
        message += ' This powerful spell will last for days.';
      } else if (totalIngredients > 5) {
        message += ' The effects will last through tomorrow.';
      } else {
        message += ' The gentle effects will help you through today.';
      }
      
      setSpellResult(message);
    }, 1500);
  };

  // Generate cauldron gradient based on ingredients
  const getCauldronStyle = () => {
    if (totalIngredients === 0) {
      return {
        background: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)',
        boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.3)'
      };
    }

    const activeIngredients = ingredients.filter(i => i.amount > 0);
    const gradientStops = activeIngredients.map((ing, idx) => {
      const percent = (idx / Math.max(1, activeIngredients.length - 1)) * 100;
      return `${ing.color} ${percent}%`;
    }).join(', ');

    return {
      background: `linear-gradient(135deg, ${gradientStops})`,
      boxShadow: 'inset 0 4px 15px rgba(0,0,0,0.2)'
    };
  };

  return (
    <div className="min-h-full w-full bg-gradient-to-b from-purple-900 to-indigo-900 p-4 sm:p-6 flex flex-col items-center text-white">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-purple-200">
          Stress Relief Spell
        </h2>
        <p className="text-sm text-purple-200 max-w-md mx-auto">
          Combine magical ingredients to create your personalized stress-relieving spell
        </p>
      </div>
      
      {/* Cauldron */}
      <div className="w-full max-w-xs mb-6">
        <div 
          className={`relative w-48 h-48 mx-auto rounded-full flex items-center justify-center overflow-hidden transition-all duration-500 ${
            spellAnimation ? 'animate-pulse' : ''
          }`}
          style={getCauldronStyle()}
        >
          {/* Cauldron contents */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Bubbles animation when casting */}
            {spellAnimation && (
              <>
                <div className="absolute w-4 h-4 rounded-full bg-white opacity-70 animate-bubble-1"></div>
                <div className="absolute w-6 h-6 rounded-full bg-white opacity-50 animate-bubble-2" style={{ animationDelay: '0.3s' }}></div>
                <div className="absolute w-3 h-3 rounded-full bg-white opacity-60 animate-bubble-3" style={{ animationDelay: '0.7s' }}></div>
              </>
            )}
          </div>
          
          {/* Cauldron content */}
          <div className="relative z-10 text-center p-3">
            {spellAnimation ? (
              <div className="animate-spin text-5xl mb-2">✨</div>
            ) : spellCast && spellResult ? (
              <>
                <div className="text-5xl mb-2">🌟</div>
                <div className="text-sm font-medium text-white">Spell Complete!</div>
              </>
            ) : (
              <>
                <div className="text-5xl mb-2">🧪</div>
                <div className="text-sm font-medium text-white">
                  {totalIngredients > 0 ? `${totalIngredients} ingredients` : 'Add ingredients'}
                </div>
              </>
            )}
          </div>
          
          {/* Cauldron rim */}
          <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-gray-800 to-transparent opacity-30 rounded-t-full"></div>
        </div>
      </div>
      
      {/* Spell Result */}
      {spellResult && (
        <div className="mb-6 p-4 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg text-sm text-white border border-purple-300 border-opacity-30 max-w-md">
          <p className="leading-relaxed">{spellResult}</p>
        </div>
      )}
      
      {/* Ingredients Grid - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 w-full max-w-md">
        {ingredients.map((ingredient, index) => (
          <div 
            key={ingredient.name} 
            className="relative bg-white bg-opacity-10 backdrop-blur-sm p-3 rounded-lg border border-white border-opacity-20 transition-all hover:bg-opacity-15"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <span className="text-xl mr-2">{ingredient.icon}</span>
                <span className="font-medium text-sm">{ingredient.name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <button 
                  onClick={() => removeIngredient(index)}
                  disabled={ingredient.amount === 0}
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                    ingredient.amount === 0 
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                      : 'bg-pink-500 bg-opacity-30 text-white hover:bg-opacity-50'
                  }`}
                  aria-label="Remove ingredient"
                >
                  <span className="text-xs">-</span>
                </button>
                <div className="flex items-center justify-center w-6 h-6">
                  <span className="text-sm text-center">{ingredient.amount}</span>
                </div>
                <button 
                  onClick={() => addIngredient(index)}
                  disabled={ingredient.amount === ingredient.maxAmount}
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                    ingredient.amount === ingredient.maxAmount 
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                      : 'bg-green-500 bg-opacity-30 text-white hover:bg-opacity-50'
                  }`}
                  aria-label="Add ingredient"
                >
                  <span className="text-xs">+</span>
                </button>
              </div>
            </div>
            <div className="flex items-center">
              <div 
                className="w-full h-1 rounded-full bg-gray-700"
              >
                <div 
                  className="h-1 rounded-full transition-all duration-300" 
                  style={{ 
                    width: `${(ingredient.amount / ingredient.maxAmount) * 100}%`,
                    backgroundColor: ingredient.color
                  }}
                ></div>
              </div>
            </div>
            <p className="text-xs text-purple-200 mt-2">{ingredient.description}</p>
          </div>
        ))}
      </div>
      
      {/* Action Buttons - Mobile Friendly */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full max-w-xs">
        <button 
          onClick={castSpell}
          disabled={spellAnimation}
          className={`px-6 py-3 rounded-lg text-white font-medium w-full transition-all transform hover:scale-105 ${
            spellAnimation 
              ? 'bg-indigo-500 bg-opacity-50 cursor-not-allowed' 
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500'
          }`}
        >
          {spellAnimation ? 'Casting...' : 'Cast Spell'}
        </button>
        <button 
          onClick={resetSpell}
          className="px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium w-full transition-all transform hover:scale-105"
        >
          Reset
        </button>
      </div>
      
      {/* Add custom keyframes for bubble animations */}
      <style jsx global>{`
        @keyframes bubble-1 {
          0% { bottom: -20px; left: 20%; opacity: 0; }
          20% { opacity: 0.7; }
          80% { opacity: 0.7; }
          100% { bottom: 120px; left: 30%; opacity: 0; }
        }
        @keyframes bubble-2 {
          0% { bottom: -20px; left: 50%; opacity: 0; }
          20% { opacity: 0.5; }
          80% { opacity: 0.5; }
          100% { bottom: 140px; left: 55%; opacity: 0; }
        }
        @keyframes bubble-3 {
          0% { bottom: -20px; left: 70%; opacity: 0; }
          20% { opacity: 0.6; }
          80% { opacity: 0.6; }
          100% { bottom: 130px; left: 60%; opacity: 0; }
        }
        .animate-bubble-1 {
          animation: bubble-1 2s ease-in-out infinite;
        }
        .animate-bubble-2 {
          animation: bubble-2 2.3s ease-in-out infinite;
        }
        .animate-bubble-3 {
          animation: bubble-3 1.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}