import React from 'react';
import { LifetimeStats } from '../types';

interface StartScreenProps {
  lifetimeStats: LifetimeStats;
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ lifetimeStats, onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full text-center p-6">
      <h1 className="text-2xl font-bold mb-2 text-black">Lemonomics</h1>
      <p className="text-sm mb-4 text-black">Run your own lemonade stand!</p>

      <div className="mb-6 bg-yellow-50 p-3 rounded-xl shadow-inner">
        <p className="text-xs mb-2 font-medium text-black">Lifetime stats:</p>
        <p className="text-xs text-black">
          Days in business: {lifetimeStats.daysPlayed}
        </p>
        <p className="text-xs text-black">
          Total profits: ${lifetimeStats.lifetimeProfit.toFixed(2)}
        </p>
      </div>

      <button
        onClick={onStart}
        className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-6 rounded-full 
                   shadow-md transform transition hover:scale-105 active:scale-95 font-medium"
      >
        Start Game
      </button>

      <p className="text-xs mt-4 text-black">
        Set prices, serve customers & maximize profits!
      </p>
    </div>
  );
};

export default StartScreen;
