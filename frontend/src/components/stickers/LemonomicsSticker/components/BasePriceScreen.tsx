import React from 'react';
import { generateBasePriceOptions } from '../gameLogic';

interface BasePriceScreenProps {
  onBasePriceSelect: (price: number) => void;
}

const BasePriceScreen: React.FC<BasePriceScreenProps> = ({ onBasePriceSelect }) => {
  // Price options from MIN_PRICE to MAX_PRICE
  const priceOptions = generateBasePriceOptions();

  return (
    <div className="flex flex-col items-center justify-center h-full w-full text-center p-6">
      <h1 className="text-2xl font-bold mb-2 text-black">
        Set Your Base Price
      </h1>
      <p className="text-sm mb-4 text-black">
        This is your cost price for making lemonade.
      </p>

      <div className="mb-6 bg-yellow-50 p-4 rounded-xl shadow-inner w-full max-w-xs">
        <p className="text-sm text-black mb-3">
          Choose wisely! Your base price affects:
        </p>
        <ul className="text-xs text-black text-left list-disc pl-5">
          <li>Your cost per cup (affects profit margin)</li>
          <li>Customer price expectations (higher quality = higher price)</li>
          <li>Finding the right balance is key to success!</li>
        </ul>
      </div>

      <div className="grid grid-cols-5 gap-2 mb-6">
        {priceOptions.map((price, index) => (
          <button
            key={`base-price-${index}-${price}`}
            onClick={() => onBasePriceSelect(price)}
            className={`${
              price <= 2.5
                ? "bg-yellow-100 hover:bg-yellow-200"
                : "bg-amber-100 hover:bg-amber-200"
            } 
                       text-black font-medium text-xs py-2 px-3 rounded-md shadow transition hover:scale-105`}
          >
            ${price.toFixed(2)}
          </button>
        ))}
      </div>

      <div className="text-xs text-gray-600 max-w-xs">
        <p>
          Lower base price = lower costs but customers expect cheaper prices
        </p>
        <p>
          Higher base price = higher costs but customers willing to pay more
        </p>
      </div>
    </div>
  );
};

export default BasePriceScreen;
