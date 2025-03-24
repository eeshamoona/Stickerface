import React from 'react';
import { Customer, GameState } from '../types';
import { MAX_DAYS } from '../constants';

interface EndDayModalProps {
  gameState: GameState;
  onEndDay: () => void;
}

const EndDayModal: React.FC<EndDayModalProps> = ({ gameState, onEndDay }) => {
  // Calculate total revenue and costs
  const totalRevenue = gameState.customers.reduce(
    (sum, customer) => sum + customer.actualPaid,
    0
  );
  // Only count costs for customers who were served (bought lemonade)
  const servedCustomers = gameState.customers.filter(
    (customer) => customer.actualPaid > 0
  ).length;
  const totalCost = servedCustomers * gameState.basePrice;
  
  // Calculate the correct average rating from the dailyRatings array
  const averageRating = 
    gameState.dailyRatings.length > 0
      ? gameState.dailyRatings.reduce((sum, rating) => sum + rating, 0) / 
        gameState.dailyRatings.length
      : 0;

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-10">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
        <h2 className="text-xl font-bold text-center mb-3 text-black">
          End of Day {gameState.currentDay}
        </h2>

        <div className="mb-6">
          <div className="bg-yellow-50 p-3 rounded-lg mb-3">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-black">Base Price:</span>
              <span className="text-sm font-medium text-black">
                ${gameState.basePrice.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-black">Total Revenue:</span>
              <span className="text-sm font-medium text-black">
                ${totalRevenue.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-black">Total Cost:</span>
              <span className="text-sm font-medium text-black">
                ${totalCost.toFixed(2)}
              </span>
            </div>
            <div className="h-px bg-yellow-200 my-2"></div>
            <div className="flex justify-between">
              <span className="text-black">Daily Profit:</span>
              <span className="font-medium text-black">
                ${gameState.dailyProfit.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex justify-between mb-2">
            <span className="text-black">Customer Rating:</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-xl ${
                    i < Math.round(averageRating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-between mb-4">
            <span className="text-black">Total Profit:</span>
            <span className="font-medium text-black">
              ${(gameState.totalProfit + gameState.dailyProfit).toFixed(2)}
            </span>
          </div>
          
          {/* Customer List with Ratings */}
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2 text-black">Customer Ratings:</h3>
            <div className="max-h-40 overflow-y-auto pr-1 bg-yellow-50 rounded-lg">
              {gameState.customers.map((customer) => (
                <div 
                  key={customer.id} 
                  className="flex justify-between items-center p-2 border-b border-yellow-100 last:border-0"
                >
                  <div className="flex items-center">
                    <span className="mr-2">{customer.emoji}</span>
                    <span className="text-sm text-black">{customer.name}</span>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${
                          i < Math.round(customer.rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={onEndDay}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg
                    shadow transition hover:shadow-lg"
        >
          {gameState.currentDay >= MAX_DAYS ? "Finish Game" : "Next Day"}
        </button>
      </div>
    </div>
  );
};

export default EndDayModal;
