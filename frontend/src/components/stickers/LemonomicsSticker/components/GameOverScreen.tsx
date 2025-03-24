import React from 'react';
import { GameState, LifetimeStats } from '../types';

interface GameOverScreenProps {
  gameState: GameState;
  lifetimeStats: LifetimeStats;
  onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({
  gameState,
  lifetimeStats,
  onRestart,
}) => {
  // Calculate final average rating across all days
  const finalAverageRating = gameState.averageRating || 0;

  // Calculate total customers served vs total possible customers
  const totalCustomersServed = gameState.customers.filter(
    (c) => c.actualPaid > 0
  ).length;
  const totalPossibleCustomers = gameState.customers.length;
  const customerServedPercentage =
    totalPossibleCustomers > 0
      ? Math.round((totalCustomersServed / totalPossibleCustomers) * 100)
      : 0;

  return (
    <div className="flex flex-col items-center justify-center h-full w-full text-center p-6">
      <h1 className="text-2xl font-bold mb-2 text-black">Game Over!</h1>

      <div className="mb-6 bg-yellow-50 p-4 rounded-xl shadow-inner w-full max-w-xs">
        <p className="font-medium mb-3 text-black">Final Results:</p>

        <div className="flex justify-between mb-2">
          <span className="text-black">Days Played:</span>
          <span className="font-medium text-black">
            {gameState.currentDay}
          </span>
        </div>

        <div className="flex justify-between mb-2">
          <span className="text-black">Total Profit:</span>
          <span className="font-medium text-black">
            ${gameState.totalProfit.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between mb-2">
          <span className="text-black">Customers Served:</span>
          <span className="font-medium text-black">
            {customerServedPercentage}%
          </span>
        </div>

        <div className="flex justify-between mb-2">
          <span className="text-black">Average Rating:</span>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-xl ${
                  i < Math.round(finalAverageRating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <div className="h-px bg-yellow-200 my-3"></div>

        <div className="flex justify-between">
          <span className="text-black font-medium">Lifetime Profit:</span>
          <span className="font-medium text-black">
            $
            {(lifetimeStats.lifetimeProfit + gameState.totalProfit).toFixed(
              2
            )}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={onRestart}
          className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-6 rounded-lg 
                    shadow-md transition hover:shadow-lg font-medium w-full"
        >
          Play Again
        </button>

        <p className="text-xs text-gray-600 italic">
          Thanks for playing Lemonomics! Can you beat your high score?
        </p>
      </div>
    </div>
  );
};

export default GameOverScreen;
