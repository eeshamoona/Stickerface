import React from 'react';
import { MAX_DAYS } from '../constants';

interface GameStatsProps {
  currentDay: number;
  dailyProfit: number;
}

const GameStats: React.FC<GameStatsProps> = ({ currentDay, dailyProfit }) => {
  return (
    <div className="bg-white bg-opacity-80 rounded-lg p-3 shadow-md w-full max-w-xs mx-auto">
      <div className="flex justify-between mb-1">
        <span className="text-xs font-medium text-black">Day:</span>
        <span className="text-xs text-black">
          {currentDay}/{MAX_DAYS}
        </span>
      </div>

      <div className="flex justify-between">
        <span className="text-xs font-medium text-black">
          Today's profit:
        </span>
        <span className="text-xs text-black">
          ${dailyProfit.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default GameStats;
