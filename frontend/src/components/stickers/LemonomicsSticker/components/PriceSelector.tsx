import React from 'react';
import { generatePriceOptions } from '../gameLogic';

interface PriceSelectorProps {
  basePrice: number;
  onPriceSelect: (price: number) => void;
}

const PriceSelector: React.FC<PriceSelectorProps> = ({ basePrice, onPriceSelect }) => {
  // Generate price options around the base price
  const priceOptions = generatePriceOptions(basePrice);

  // Add a visual indicator of profit/loss for each option
  const getProfitLossIndicator = (price: number) => {
    const profit = price - basePrice;
    if (profit > 0) {
      return (
        <span className="text-green-600 text-xs">+${profit.toFixed(2)}</span>
      );
    } else if (profit < 0) {
      return (
        <span className="text-red-600 text-xs">${profit.toFixed(2)}</span>
      );
    }
    return <span className="text-gray-600 text-xs">$0.00</span>;
  };

  return (
    <div className="w-full max-w-xs mx-auto">
      <h3 className="text-sm font-medium text-center mb-2 text-black">
        Select Your Price:
      </h3>

      {/* Preset price buttons */}
      <div className="flex justify-between mb-4">
        {priceOptions.map((price, index) => (
          <div
            key={`price-${index}-${price}`}
            className="flex flex-col items-center"
          >
            <button
              onClick={() => onPriceSelect(price)}
              className="bg-yellow-100 hover:bg-yellow-200 text-black font-medium 
                         text-xs py-1 px-2 rounded-md shadow transition hover:scale-105 mb-1"
            >
              ${price.toFixed(2)}
            </button>
            {getProfitLossIndicator(price)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriceSelector;
